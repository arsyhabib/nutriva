/**
 * Lapisan transport bersama untuk semua panggilan ke OpenRouter dan Worker.
 * Tujuan: AI konsisten dan stabil. Gangguan sesaat (batas laju, penyedia sibuk, jaringan putus, galat yang datang
 * bersama status 200, keluaran kosong) diulang otomatis; keluaran yang terpotong diminta ulang dengan ruang lebih besar,
 * dan bila tetap terpotong dirapikan sampai kalimat atau baris utuh terakhir. Tidak pernah melempar.
 */

export type PesanChat = { role: "system" | "user" | "assistant"; content: string };

export interface PanggilanChat {
  kunci: string;
  model: string;
  pesan: PesanChat[];
  maxTokens: number;
  suhu: number;
  fetchFn?: typeof fetch | undefined;
  url: string;
  /** Batas waktu tiap percobaan (ms). */
  batasMs: number;
  /** Jumlah percobaan maksimum (termasuk yang pertama). */
  cobaMaks?: number;
  /** Jeda dasar antarpercobaan (ms); 0 untuk uji. */
  jedaMs?: number;
  /** Tambahan petunjuk ke pesan sistem bila keluaran terpotong (dipakai pada percobaan ulang). */
  petunjukRingkas?: string;
}

export type HasilChat =
  | { ok: true; teks: string; terpotong: boolean; percobaan: number }
  | { ok: false; alasan: string };

// klaim: n/a — kode status HTTP yang layak diulang (batas laju, waktu habis, penyedia sibuk/jatuh); keputusan rekayasa
const STATUS_ULANG = new Set([408, 409, 425, 429, 500, 502, 503, 504, 520, 522, 524, 529]);
// klaim: n/a — batas atas ruang keluaran saat meminta ulang keluaran yang terpotong
const TOKEN_ATAS = 4096;
// klaim: n/a — batas jeda Retry-After yang dihormati (ms), agar pengguna tidak menunggu terlalu lama
const JEDA_MAKS_MS = 6000;

/** Galat terminal dari pembaca badan (mis. gambar tak sah): tidak diulang, alasannya dipakai apa adanya. */
export class GalatBaca extends Error {}

const tidur = (ms: number): Promise<void> => (ms > 0 ? new Promise((r) => setTimeout(r, ms)) : Promise.resolve());

/** Ambil teks dari bentuk keluaran yang mungkin: string, atau larik bagian {type:"text", text}. Buang blok pikiran. */
export function ambilTeks(isi: unknown): string | null {
  let t: string | null = null;
  if (typeof isi === "string") t = isi;
  else if (Array.isArray(isi)) {
    // Hanya bagian teks; bagian penalaran ("reasoning", "thinking") tidak boleh bocor ke pengguna.
    const bagian = isi
      .map((x) => {
        if (typeof x === "string") return x;
        if (!x || typeof x !== "object") return "";
        const { type, text } = x as { type?: unknown; text?: unknown };
        const jenisTeks = type === undefined || type === "text" || type === "output_text";
        return jenisTeks && typeof text === "string" ? text : "";
      })
      .join("");
    t = bagian;
  }
  if (t === null) return null;
  return t
    .replace(/<(think|thinking|reasoning)>[\s\S]*?<\/\1>/gi, "")
    .replace(/<(think|thinking|reasoning)>[\s\S]*$/i, "")
    .replace(/\p{Cf}/gu, "")
    .trim();
}

/**
 * Rapikan teks yang terpotong di tengah. Pemotongan pasti terjadi di baris terakhir, jadi hanya baris itu yang dibuang
 * (kecuali sudah berakhir tanda baca kalimat), disusul judul/label/nomor yatim di ujung. Baris daftar yang utuh di atasnya
 * tidak disentuh. Teks satu baris dipotong di akhir kalimat terakhir yang bukan singkatan atau angka.
 */
export function potongRapi(teks: string): string {
  const t = teks.replace(/\s+$/, "");
  if (t === "") return t;
  const akhirKalimat = /[.!?…)\]"”']$/;
  const yatim = (b: string): boolean => b === "" || /^#{1,6}\s/.test(b) || /^\*\*[^*]+\*\*:?$/.test(b) || /^(?:\d+[.)]|[-*•])$/.test(b) || /:$/.test(b);
  let hasil: string;
  const baris = t.split("\n");
  if (baris.length > 1) {
    const akhir = (baris[baris.length - 1] ?? "").trim();
    if (!akhirKalimat.test(akhir) || yatim(akhir)) baris.pop();
    while (baris.length > 0 && yatim((baris[baris.length - 1] ?? "").trim())) baris.pop();
    hasil = baris.join("\n").replace(/\s+$/, "");
    if (hasil === "") hasil = t;
  } else {
    hasil = t;
    if (!akhirKalimat.test(hasil)) {
      // klaim: n/a — singkatan lazim yang titiknya bukan akhir kalimat
      const SINGKATAN = /(?:^|\s)(?:dr|dll|dsb|dst|yg|mis|no|hlm|sdr|ir|prof|kg|gr|cm|ml)$/i;
      let potong = -1;
      for (const m of hasil.matchAll(/[.!?…](?=\s)/g)) {
        const i = m.index ?? 0;
        const sebelum = hasil.slice(0, i);
        if (/\d$/.test(sebelum) && m[0] === ".") continue; // "1." atau "2,5."
        if (m[0] === "." && SINGKATAN.test(sebelum)) continue;
        potong = i;
      }
      if (potong > 20) hasil = hasil.slice(0, potong + 1);
    }
  }
  // Penanda tebal yang terbuka (jumlah ** ganjil) dibuang dari ujung agar tidak merusak render.
  if (((hasil.match(/\*\*/g) ?? []).length & 1) === 1) hasil = hasil.slice(0, hasil.lastIndexOf("**")).replace(/\s+$/, "");
  return hasil;
}

function jedaDariHeader(res: Response): number | null {
  const v = res.headers?.get?.("retry-after");
  if (!v) return null;
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? Math.min(n * 1000, JEDA_MAKS_MS) : null;
}

interface BadanChat {
  error?: { message?: unknown; code?: unknown } | undefined;
  choices?: { message?: { content?: unknown; refusal?: unknown }; finish_reason?: unknown; error?: unknown }[];
}

/** Satu panggilan chat dengan percobaan ulang cerdas. */
export async function panggilChat(p: PanggilanChat): Promise<HasilChat> {
  const f = p.fetchFn ?? fetch;
  const cobaMaks = Math.max(1, p.cobaMaks ?? 3);
  const jeda = p.jedaMs ?? 700;
  let maxTokens = p.maxTokens;
  let pakaiReasoning = true;
  let ringkas = false;
  let sebagian: string | null = null;
  let alasanTerakhir = "galat_jaringan";

  for (let ke = 1; ke <= cobaMaks; ke++) {
    const kendali = new AbortController();
    const waktu = setTimeout(() => kendali.abort(), p.batasMs);
    let tunggu = jeda * ke;
    let gratis = false;
    try {
      const pesan: PesanChat[] = ringkas && p.petunjukRingkas
        ? p.pesan.map((m, i) => (i === 0 && m.role === "system" ? { ...m, content: `${m.content}\n${p.petunjukRingkas}` } : m))
        : p.pesan;
      const res = await f(p.url, {
        method: "POST",
        headers: { Authorization: `Bearer ${p.kunci}`, "Content-Type": "application/json", "X-Title": "NUTRIVA" },
        body: JSON.stringify({
          model: p.model,
          messages: pesan,
          max_tokens: maxTokens,
          temperature: p.suhu,
          provider: { data_collection: "deny" },
          // Penalaran yang memakan jatah keluaran adalah penyebab umum jawaban kosong atau terpotong.
          ...(pakaiReasoning ? { reasoning: { enabled: false } } : {}),
        }),
        signal: kendali.signal,
        credentials: "omit",
        cache: "no-store",
        referrerPolicy: "no-referrer",
      });
      if (!res.ok) {
        alasanTerakhir = `status_${res.status}`;
        if (res.status === 400 && pakaiReasoning) {
          pakaiReasoning = false; // model menolak parameter penalaran: ulangi tanpa itu, tidak memakai jatah percobaan
          tunggu = 0;
          gratis = true;
        } else if (!STATUS_ULANG.has(res.status)) {
          return { ok: false, alasan: alasanTerakhir };
        } else {
          tunggu = jedaDariHeader(res) ?? tunggu * 2;
        }
      } else {
        let badan: BadanChat | null = null;
        try { badan = (await res.json()) as BadanChat; } catch { badan = null; }
        if (!badan || typeof badan !== "object") {
          alasanTerakhir = kendali.signal.aborted ? "waktu_habis" : "galat_jaringan";
        } else {
          const pilihan = badan.choices?.[0];
          const teks = ambilTeks(pilihan?.message?.content);
          const galatBadan = badan.error ?? pilihan?.error;
          const akhir = pilihan?.finish_reason;
          if (galatBadan !== undefined && galatBadan !== null && (teks === null || teks.length < 20 || akhir === "error")) {
            // Galat yang datang bersama status 200 (penyedia gagal di tengah jalan).
            const kode = Number((galatBadan as { code?: unknown }).code);
            const adaKode = Number.isFinite(kode) && kode >= 400 && kode < 600;
            alasanTerakhir = adaKode ? `status_${kode}` : "galat_penyedia";
            if (teks && teks.length > 0) sebagian = teks;
            if (adaKode && kode === 400 && pakaiReasoning) {
              pakaiReasoning = false;
              tunggu = 0;
              gratis = true;
            } else if (adaKode && kode < 500 && !STATUS_ULANG.has(kode)) {
              return { ok: false, alasan: alasanTerakhir }; // 401/402/403/404 dst. tidak layak diulang
            }
          } else if (teks === null || teks.length === 0) {
            alasanTerakhir = typeof pilihan?.message?.refusal === "string" && pilihan.message.refusal ? "ditolak_model" : "keluaran_kosong";
            if (akhir === "length") { maxTokens = Math.min(TOKEN_ATAS, maxTokens * 2); tunggu = 0; }
          } else if (akhir === "length") {
            // Terpotong: simpan, minta lagi dengan ruang dua kali lipat dan petunjuk ringkas.
            if (teks.length > (sebagian?.length ?? 0)) sebagian = teks;
            alasanTerakhir = "keluaran_terpotong";
            if (maxTokens >= TOKEN_ATAS) return { ok: true, teks: sebagian ?? teks, terpotong: true, percobaan: ke };
            maxTokens = Math.min(TOKEN_ATAS, maxTokens * 2);
            ringkas = true;
            tunggu = 0;
          } else {
            return { ok: true, teks, terpotong: false, percobaan: ke };
          }
        }
      }
    } catch {
      alasanTerakhir = kendali.signal.aborted ? "waktu_habis" : "galat_jaringan";
    } finally {
      clearTimeout(waktu);
    }
    if (gratis) { ke--; continue; } // sekali saja: pakaiReasoning sudah false
    if (ke === cobaMaks) break;
    await tidur(tunggu);
  }
  if (sebagian && sebagian.length >= 20) return { ok: true, teks: sebagian, terpotong: true, percobaan: cobaMaks };
  return { ok: false, alasan: alasanTerakhir };
}

/**
 * POST dengan percobaan ulang untuk status sementara dan jaringan. `baca` membaca badan respons di dalam batas waktu
 * yang sama, sehingga badan besar (gambar) yang macet ikut terputus.
 */
export async function kirimUlang<T>(
  url: string,
  init: RequestInit,
  opsi: { fetchFn?: typeof fetch | undefined; batasMs: number; cobaMaks?: number; jedaMs?: number; ulangiWaktuHabis?: boolean },
  baca: (res: Response) => Promise<T>,
): Promise<{ ok: true; nilai: T } | { ok: false; alasan: string }> {
  const f = opsi.fetchFn ?? fetch;
  const cobaMaks = Math.max(1, opsi.cobaMaks ?? 2);
  const jeda = opsi.jedaMs ?? 800;
  let alasan = "galat_jaringan";
  for (let ke = 1; ke <= cobaMaks; ke++) {
    const kendali = new AbortController();
    const waktu = setTimeout(() => kendali.abort(), opsi.batasMs);
    let tunggu = jeda * ke;
    try {
      const res = await f(url, { ...init, signal: kendali.signal });
      if (res.ok) {
        try {
          return { ok: true, nilai: await baca(res) };
        } catch (e) {
          if (e instanceof GalatBaca) return { ok: false, alasan: e.message }; // gambar_tak_sah, status_402, dst.: terminal
          alasan = kendali.signal.aborted ? "waktu_habis" : "galat_jaringan"; // galat bawaan peramban: layak diulang
        }
      } else {
        alasan = `status_${res.status}`;
        if (!STATUS_ULANG.has(res.status)) return { ok: false, alasan };
        tunggu = jedaDariHeader(res) ?? tunggu * 2;
      }
    } catch {
      alasan = kendali.signal.aborted ? "waktu_habis" : "galat_jaringan";
    } finally {
      clearTimeout(waktu);
    }
    // Permintaan yang habis waktu mungkin sudah ditagih penyedia; untuk yang mahal (gambar) jangan diulang.
    if (alasan === "waktu_habis" && opsi.ulangiWaktuHabis === false) return { ok: false, alasan };
    if (ke < cobaMaks) await tidur(tunggu);
  }
  return { ok: false, alasan };
}
