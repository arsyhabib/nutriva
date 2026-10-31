/** Profil build (ADR-0001). */
export const PROFIL_RILIS = ["demo", "lapangan"] as const;
export type ProfilRilis = (typeof PROFIL_RILIS)[number];

/**
 * Label wajib pada setiap keluaran profil `demo`, juga pada ekspor gambar/cetak
 * (RPT-0004 syarat 2; DESIGN_PACKAGE/05 butir 3). Jangan diubah maknanya tanpa audit.
 * Label HARUS berasal dari konstanta ini, bukan dari data (RPT-0006 I-D).
 */
export const LABEL_PROTOTIPE =
  "Prototipe PjBL — belum diverifikasi dosen; bukan pengganti petugas kesehatan.";

/** Versi skema jejak (trace). Perubahan skema = versi baru dengan migrasi (strategi §2.4). */
// klaim: n/a — versi skema, bukan konstanta ilmiah
export const SKEMA_JEJAK_VERSI = 1 as const;
