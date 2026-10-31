import { z } from "zod";
import type { ProfilRilis } from "./konstanta";

/**
 * Gerbang profil `lapangan` (ADR-0001; AUD-0006-01).
 *
 * Satu-satunya pintu masuk data nyata. Fungsi data nyata di masa depan (simpan profil,
 * impor, ekspor, jejak lapangan) WAJIB menerima `TokenData` sebagai parameter dan memanggil
 * `pastikanTokenData` sebelum memakainya. Token hanya dicatat oleh `bukaPintuData` di berkas
 * ini. Tiga lapis: tipe (kompilator), pemeriksaan runtime `pastikanTokenData`, dan uji
 * arsitektur (tests/pintu-data.test.ts). Kompilator tidak melarang cast manual; itu sebabnya
 * lapis kedua wajib (REQ-0008, celah `{} as TokenData`).
 *
 * Mesin murni (INV-11): tanggal hari ini disuntikkan pemanggil; tidak membaca berkas.
 */

declare const merekToken: unique symbol;
/** Bukti bahwa pintu data nyata terbuka. Hanya sah bila lolos `pastikanTokenData`. */
export interface TokenData {
  readonly [merekToken]: true;
}

/** Token yang dicatat oleh `bukaPintuData`; token palsu tidak pernah ada di sini. */
const tokenSah = new WeakSet<object>();

const Tanggal = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const OtorisasiSchema = z.object({
  versi_skema: z.literal(1),
  /** Surat persetujuan etik, atau pembebasan etik/izin resmi institusi (diputuskan pemilik + dosen). */
  dasar_izin: z.object({
    jenis: z.enum(["persetujuan-etik", "pembebasan-etik", "izin-institusi"]),
    nomor: z.string().min(3),
    penerbit: z.string().min(3),
    tanggal: Tanggal,
  }),
  /** Dosen yang menandatangani daftar tanda bahaya (B11). */
  penandatangan_tanda_bahaya: z.object({
    nama: z.string().min(3),
    jabatan: z.string().min(3),
    tanggal: Tanggal,
    versi_daftar: z.string().min(1),
  }),
  /** Keputusan status alat kesehatan; "menunggu" tidak diterima. */
  keputusan_status_alat: z.object({
    keputusan: z.enum(["bukan-alat-kesehatan", "izin-diperoleh"]),
    rujukan: z.string().min(3),
    tanggal: Tanggal,
  }),
  /** Versi aturan yang disahkan; harus sama dengan versi aturan yang aktif. */
  versi_aturan: z.string().min(1),
});
export type Otorisasi = z.infer<typeof OtorisasiSchema>;

export type HasilPintu =
  | { terbuka: true; token: TokenData }
  | { terbuka: false; alasan: string[] };

export interface MasukanPintu {
  profil: ProfilRilis;
  otorisasi: unknown;
  versiAturanAktif: string;
  /** Format YYYY-MM-DD; disuntikkan pemanggil agar mesin tetap murni. */
  tanggalHariIni: string;
}

function tanggalKalenderValid(s: string): boolean {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return false;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const t = new Date(Date.UTC(y, mo - 1, d));
  return t.getUTCFullYear() === y && t.getUTCMonth() === mo - 1 && t.getUTCDate() === d;
}

export function bukaPintuData(masukan: MasukanPintu): HasilPintu {
  if (masukan.profil === "demo") {
    return { terbuka: false, alasan: ["profil demo tidak pernah menerima data nyata"] };
  }
  if (!tanggalKalenderValid(masukan.tanggalHariIni)) {
    return { terbuka: false, alasan: ["tanggal hari ini tidak valid"] };
  }

  const ur = OtorisasiSchema.safeParse(masukan.otorisasi);
  if (!ur.success) {
    const alasan = ur.error.issues.map((i) => `otorisasi: ${i.path.join(".") || "(akar)"}: ${i.message}`);
    return { terbuka: false, alasan: alasan.length ? alasan : ["otorisasi tidak ada atau tidak valid"] };
  }

  const o = ur.data;
  const alasan: string[] = [];
  const tanggalBerkas: [string, string][] = [
    ["dasar_izin.tanggal", o.dasar_izin.tanggal],
    ["penandatangan_tanda_bahaya.tanggal", o.penandatangan_tanda_bahaya.tanggal],
    ["keputusan_status_alat.tanggal", o.keputusan_status_alat.tanggal],
  ];
  for (const [nama, t] of tanggalBerkas) {
    if (!tanggalKalenderValid(t)) alasan.push(`${nama}: bukan tanggal kalender yang valid`);
    else if (t > masukan.tanggalHariIni) alasan.push(`${nama}: berada di masa depan`);
  }
  if (o.versi_aturan !== masukan.versiAturanAktif) {
    alasan.push(
      `versi_aturan otorisasi (${o.versi_aturan}) tidak sama dengan versi aturan aktif (${masukan.versiAturanAktif})`,
    );
  }
  if (alasan.length > 0) return { terbuka: false, alasan };

  const token = Object.freeze({}) as unknown as TokenData;
  tokenSah.add(token);
  return { terbuka: true, token };
}

/**
 * Memastikan token berasal dari `bukaPintuData`. Cast manual seperti `{} as TokenData` lolos
 * kompilator, jadi fungsi data nyata wajib memanggil ini. Melempar galat bila token palsu.
 */
export function pastikanTokenData(token: TokenData): TokenData {
  if (!tokenSah.has(token)) {
    throw new Error("TokenData tidak sah: hanya dapat dibuat oleh bukaPintuData");
  }
  return token;
}
