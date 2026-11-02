import { MuatanAiSchema, type MuatanAi } from "./kontrak";
import { jelaskanTemplat } from "./templat";
import { validasiKeluaranAi } from "./validator";

export interface HasilPenjelasan {
  sumber: "ai" | "templat";
  teks: string;
  /** Mengapa jatuh ke templat (untuk uji dan log lokal; jangan ditampilkan ke pengguna). */
  alasan_templat?: string;
}

export interface OpsiKlien {
  /** URL Worker, mis. https://nutriva-ai.<akun>.workers.dev. Kosong = AI mati, langsung templat. */
  urlWorker?: string | undefined;
  fetchFn?: typeof fetch;
  /** Batas waktu klien (ms). Harus sedikit di atas batas Worker agar Worker yang memutus lebih dulu. */
  batasMs?: number;
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
  if (!opsi.urlWorker) return templat("ai_mati");
  const f = opsi.fetchFn ?? fetch;
  const kendali = new AbortController();
  const waktu = setTimeout(() => kendali.abort(), opsi.batasMs ?? BATAS_KLIEN_MS);
  try {
    const url = opsi.urlWorker.replace(/\/+$/, "") + "/v1/jelaskan";
    const res = await f(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sah.data),
      signal: kendali.signal,
      credentials: "omit",
      referrerPolicy: "no-referrer",
    });
    if (!res.ok) return templat(`status_${res.status}`);
    const badan: unknown = await res.json();
    const teks = typeof badan === "object" && badan !== null ? (badan as { teks?: unknown }).teks : undefined;
    const v = validasiKeluaranAi(teks, sah.data);
    if (!v.ok) return templat("ditolak_" + v.alasan.join("+"));
    return { sumber: "ai", teks: v.teks };
  } catch {
    return templat("galat_jaringan");
  } finally {
    clearTimeout(waktu);
  }
}
