import { MuatanAiSchema } from "../src/ai/kontrak";
import { validasiKeluaranAi } from "../src/ai/validator";
import { PROMPT_SISTEM, susunPesan } from "./prompt";

/**
 * Worker proksi AI NUTRIVA (K-08, D-AI). Kunci hanya ada di secret Worker.
 * Tidak mencatat isi permintaan atau jawaban (tidak ada console.*).
 * Satu rute: POST /v1/jelaskan dengan muatan tertutup (lihat src/ai/kontrak.ts).
 */
export interface Lingkungan {
  OPENROUTER_API_KEY?: string;
  AI_MODEL?: string;
  FITUR_AI?: string;
  IZIN_ORIGIN?: string;
  BATAS_PER_MENIT?: string;
  BATAS_GLOBAL_PER_MENIT?: string;
}

// klaim: n/a — batas rekayasa Worker (K-08), bukan konstanta ilmiah
const BATAS_BADAN_BYTE = 2048;
// klaim: n/a — batas waktu panggilan ke penyedia AI, diperlonggar menjadi 25 detik atas permintaan pemilik (percobaan ulang ada di sisi klien)
const BATAS_HULU_MS = 25_000;
// klaim: n/a — batas token keluaran
const TOKEN_MAKS = 900;
// klaim: n/a — bawaan batas laju per klien per menit bila variabel tidak diisi
const BATAS_KLIEN_BAWAAN = 12;
// klaim: n/a — bawaan batas laju global per isolat per menit
const BATAS_GLOBAL_BAWAAN = 120;
// klaim: n/a — jendela batas laju (ms)
const JENDELA_MS = 60_000;
// klaim: n/a — batas jumlah kunci penghitung di memori
const BATAS_KUNCI = 5000;
const URL_HULU = "https://openrouter.ai/api/v1/chat/completions";

const hitung = new Map<string, { mulai: number; n: number }>();
const global_ = { mulai: 0, n: 0 };

/** Hanya untuk uji. */
export function setelUlangBatasLaju(): void {
  hitung.clear();
  global_.mulai = 0;
  global_.n = 0;
}

function json(badan: unknown, status: number, tambahan: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(badan), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff", ...tambahan },
  });
}

function originDiizinkan(env: Lingkungan, origin: string | null): string | null {
  if (!origin) return null;
  const daftar = (env.IZIN_ORIGIN ?? "").split(",").map((x) => x.trim()).filter(Boolean);
  return daftar.includes(origin) ? origin : null;
}

function angka(v: string | undefined, bawaan: number): number {
  const n = Number(v);
  return Number.isInteger(n) && n > 0 ? n : bawaan;
}

function lewatBatas(kunci: string, env: Lingkungan, kini: number): boolean {
  // Batas per klien diperiksa lebih dulu dan permintaan yang ditolak tidak menambah hitungan global,
  // agar satu klien yang berisik tidak menghabiskan jatah semua pengguna lain.
  let e = hitung.get(kunci);
  if (!e || kini - e.mulai >= JENDELA_MS) {
    if (hitung.size >= BATAS_KUNCI) {
      for (const [k, v] of hitung) if (kini - v.mulai >= JENDELA_MS) hitung.delete(k);
      while (hitung.size >= BATAS_KUNCI) {
        const tertua = hitung.keys().next().value;
        if (tertua === undefined) break;
        hitung.delete(tertua);
      }
    }
    e = { mulai: kini, n: 0 };
    hitung.set(kunci, e);
  }
  if (e.n >= angka(env.BATAS_PER_MENIT, BATAS_KLIEN_BAWAAN)) return true;
  if (kini - global_.mulai >= JENDELA_MS) { global_.mulai = kini; global_.n = 0; }
  if (global_.n >= angka(env.BATAS_GLOBAL_PER_MENIT, BATAS_GLOBAL_BAWAAN)) return true;
  e.n += 1;
  global_.n += 1;
  return false;
}

export default {
  async fetch(req: Request, env: Lingkungan): Promise<Response> {
    const url = new URL(req.url);
    const origin = originDiizinkan(env, req.headers.get("Origin"));
    const cors: Record<string, string> = origin
      ? { "Access-Control-Allow-Origin": origin, Vary: "Origin", "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type", "Access-Control-Max-Age": "600" }
      : {};

    if (url.pathname !== "/v1/jelaskan") return json({ galat: "tidak_ditemukan" }, 404, cors);
    if (req.method === "OPTIONS") return origin ? new Response(null, { status: 204, headers: cors }) : json({ galat: "origin_ditolak" }, 403);
    if (req.method !== "POST") return json({ galat: "metode_ditolak" }, 405, { ...cors, Allow: "POST, OPTIONS" });
    if (!origin) return json({ galat: "origin_ditolak" }, 403);
    if (env.FITUR_AI !== "1") return json({ galat: "fitur_mati" }, 503, cors);
    if ((req.headers.get("Content-Type") ?? "").toLowerCase().split(";")[0]?.trim() !== "application/json") return json({ galat: "jenis_ditolak" }, 415, cors);

    const klien = req.headers.get("CF-Connecting-IP") ?? "tak-dikenal";
    if (lewatBatas(klien, env, Date.now())) return json({ galat: "terlalu_sering" }, 429, { ...cors, "Retry-After": "60" });

    const panjangDeklarasi = Number(req.headers.get("Content-Length") ?? "0");
    if (Number.isFinite(panjangDeklarasi) && panjangDeklarasi > BATAS_BADAN_BYTE) return json({ galat: "terlalu_besar" }, 413, cors);
    const mentah = await req.text();
    if (new TextEncoder().encode(mentah).length > BATAS_BADAN_BYTE) return json({ galat: "terlalu_besar" }, 413, cors);
    let obj: unknown;
    try { obj = JSON.parse(mentah); } catch { return json({ galat: "muatan_tidak_valid" }, 400, cors); }
    const sah = MuatanAiSchema.safeParse(obj);
    if (!sah.success) return json({ galat: "muatan_tidak_valid" }, 400, cors);
    const muatan = sah.data;

    const kunci = env.OPENROUTER_API_KEY;
    const model = env.AI_MODEL;
    if (!kunci || !model) return json({ galat: "tidak_dikonfigurasi" }, 503, cors);

    const kendali = new AbortController();
    const waktu = setTimeout(() => kendali.abort(), BATAS_HULU_MS);
    try {
      const res = await fetch(URL_HULU, {
        method: "POST",
        headers: { Authorization: `Bearer ${kunci}`, "Content-Type": "application/json", "X-Title": "NUTRIVA" },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: PROMPT_SISTEM },
            { role: "user", content: susunPesan(muatan) },
          ],
          max_tokens: TOKEN_MAKS,
          temperature: 0.2,
          provider: { data_collection: "deny" },
        }),
        signal: kendali.signal,
      });
      if (!res.ok) return json({ galat: "hulu_gagal" }, 502, cors);
      const hulu = (await res.json()) as { choices?: { message?: { content?: unknown }; finish_reason?: unknown }[] };
      if (hulu.choices?.[0]?.finish_reason === "length") return json({ galat: "keluaran_terpotong" }, 502, cors);
      const teks = hulu.choices?.[0]?.message?.content;
      const v = validasiKeluaranAi(teks, muatan);
      if (!v.ok) return json({ galat: "keluaran_ditolak" }, 502, cors);
      return json({ teks: v.teks, sumber: "ai" }, 200, cors);
    } catch (e) {
      const habisWaktu = e instanceof Error && e.name === "AbortError";
      return json({ galat: habisWaktu ? "hulu_habis_waktu" : "hulu_gagal" }, habisWaktu ? 504 : 502, cors);
    } finally {
      clearTimeout(waktu);
    }
  },
};
