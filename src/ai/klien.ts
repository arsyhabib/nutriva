import { MuatanAiSchema, type MuatanAi } from "./kontrak";
import { jelaskanTemplat } from "./templat";
import { validasiKeluaranAi } from "./validator";
import { PROMPT_SISTEM, susunPesan } from "./prompt";

export interface HasilPenjelasan {
  sumber: "ai" | "templat";
  teks: string;
  /** Mengapa jatuh ke templat (untuk uji dan log lokal; jangan ditampilkan ke pengguna). */
  alasan_templat?: string;
}

/** Model bawaan dan alamat penyedia. Penyedia selalu OpenRouter. */
export const MODEL_AI_BAWAAN = "anthropic/claude-haiku-5.5";
export const URL_OPENROUTER = "https://openrouter.ai/api/v1/chat/completions";
/**
 * Penyaring keluaran AI (validator) pada jalur kunci sendiri/bawaan. Dimatikan atas keputusan pemilik: teks AI
 * ditampilkan apa adanya (tetap dirender aman oleh mesin markdown) dengan tanda "dibuat AI, bisa keliru".
 * Mutu dijaga lewat prompt sistem. Ubah ke true untuk menghidupkan kembali penyaring.
 */
export const FILTER_KELUARAN_AI = false;
export const URL_OPENROUTER_KUNCI = "https://openrouter.ai/api/v1/key";

export interface KunciSendiri {
  /** Kunci API milik pengguna sendiri. Tidak pernah dicatat, disimpan ke berkas, atau dikirim ke tempat selain OpenRouter. */
  kunci: string;
  model?: string | undefined;
}

export interface OpsiKlien {
  /** Mode kunci sendiri: panggilan langsung dari peramban ke OpenRouter. Didahulukan atas Worker. */
  kunciSendiri?: KunciSendiri | undefined;
  /** URL Worker, mis. https://nutriva-ai.<akun>.workers.dev. Kosong = AI mati, langsung templat. */
  urlWorker?: string | undefined;
  fetchFn?: typeof fetch;
  /** Batas waktu klien (ms). Harus sedikit di atas batas Worker agar Worker yang memutus lebih dulu. */
  batasMs?: number;
  /** Paksa menyaring keluaran (default: FILTER_KELUARAN_AI). */
  saring?: boolean;
}

// klaim: n/a — batas waktu jaringan klien (milidetik), keputusan rekayasa K-08, bukan konstanta ilmiah
const BATAS_KLIEN_MS = 12_000;

/**
 * Minta penjelasan AI; apa pun yang gagal (jaringan, status, bentuk, validator) jatuh ke templat deterministik.
 * Tidak pernah melempar. Tidak dipanggil untuk layar Rujukan (skema muatan tidak memuatnya).
 */
export async function mintaPenjelasan(muatan: MuatanAi, opsi: OpsiKlien = {}): Promise<HasilPenjelasan> {
  const templat = (alasan: string): HasilPenjelasan => ({ sumber: "templat", teks: jelaskanTemplat(muatan), alasan_templat: alasan });
  const sah = MuatanAiSchema.safeParse(muatan);
  if (!sah.success) return templat("muatan_tidak_valid");
  const kunci = opsi.kunciSendiri?.kunci.trim();
  if (!kunci && !opsi.urlWorker) return templat("ai_mati");
  const f = opsi.fetchFn ?? fetch;
  const kendali = new AbortController();
  const waktu = setTimeout(() => kendali.abort(), opsi.batasMs ?? BATAS_KLIEN_MS);
  try {
    let res: Response;
    if (kunci) {
      res = await f(URL_OPENROUTER, {
        method: "POST",
        headers: { Authorization: `Bearer ${kunci}`, "Content-Type": "application/json", "X-Title": "NUTRIVA" },
        body: JSON.stringify({
          model: opsi.kunciSendiri?.model?.trim() || MODEL_AI_BAWAAN,
          messages: [
            { role: "system", content: PROMPT_SISTEM },
            { role: "user", content: susunPesan(sah.data) },
          ],
          max_tokens: 800,
          temperature: 0.3,
          provider: { data_collection: "deny" },
        }),
        signal: kendali.signal,
        credentials: "omit",
        referrerPolicy: "no-referrer",
      });
    } else {
      const url = (opsi.urlWorker as string).replace(/\/+$/, "") + "/v1/jelaskan";
      res = await f(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sah.data),
        signal: kendali.signal,
        credentials: "omit",
        referrerPolicy: "no-referrer",
      });
    }
    if (!res.ok) return templat(`status_${res.status}`);
    const badan: unknown = await res.json();
    let teks: unknown;
    if (kunci) {
      const h = badan as { choices?: { message?: { content?: unknown }; finish_reason?: unknown }[] };
      if (h?.choices?.[0]?.finish_reason === "length" && (opsi.saring ?? FILTER_KELUARAN_AI)) return templat("keluaran_terpotong");
      teks = h?.choices?.[0]?.message?.content;
    } else {
      teks = typeof badan === "object" && badan !== null ? (badan as { teks?: unknown }).teks : undefined;
    }
    if (kunci && !(opsi.saring ?? FILTER_KELUARAN_AI)) {
      if (typeof teks !== "string" || teks.trim().length < 5) return templat("keluaran_kosong");
      return { sumber: "ai", teks: teks.replace(/\p{Cf}/gu, "").trim().slice(0, 6000) };
    }
    const v = validasiKeluaranAi(teks, sah.data);
    if (!v.ok) return templat("ditolak_" + v.alasan.join("+"));
    return { sumber: "ai", teks: v.teks };
  } catch {
    return templat("galat_jaringan");
  } finally {
    clearTimeout(waktu);
  }
}

/** Periksa kunci tanpa biaya token: OpenRouter mengembalikan info kunci bila sah. */
export async function ujiKunci(kunci: string, fetchFn: typeof fetch = fetch): Promise<"sah" | "ditolak" | "gagal"> {
  const bersih = kunci.trim();
  if (bersih === "") return "ditolak";
  const kendali = new AbortController();
  const waktu = setTimeout(() => kendali.abort(), 10_000);
  try {
    const res = await fetchFn(URL_OPENROUTER_KUNCI, {
      headers: { Authorization: `Bearer ${bersih}` },
      signal: kendali.signal,
      credentials: "omit",
      referrerPolicy: "no-referrer",
    });
    if (res.ok) return "sah";
    return res.status === 401 || res.status === 403 ? "ditolak" : "gagal";
  } catch {
    return "gagal";
  } finally {
    clearTimeout(waktu);
  }
}

/** Kalimat ramah untuk alasan jatuh ke templat pada mode kunci sendiri. */
export function pesanAlasan(alasan: string | undefined): string | null {
  if (!alasan || alasan === "bawaan_deterministik" || alasan === "ai_mati") return null;
  if (alasan === "status_401" || alasan === "status_403") return "Kunci API ditolak OpenRouter. Periksa kembali kunci Anda.";
  if (alasan === "status_402") return "Saldo OpenRouter tidak cukup untuk permintaan ini.";
  if (alasan === "status_404") return "Model tidak ditemukan di OpenRouter. Periksa nama model di Pengaturan.";
  if (alasan === "status_429") return "Terlalu banyak permintaan. Coba lagi sebentar lagi.";
  if (alasan === "galat_jaringan") return "Tidak dapat menghubungi penyedia AI. Teks cadangan ditampilkan.";
  if (alasan.startsWith("ditolak_") || alasan === "keluaran_terpotong") return "Jawaban AI tidak lolos pemeriksaan keamanan, teks cadangan ditampilkan.";
  return "Penjelasan AI belum tersedia, teks cadangan ditampilkan.";
}
