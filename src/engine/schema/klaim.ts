import { z } from "zod";

/** Status klaim (ADR-0002). */
export const STATUS_KLAIM = [
  "teks-ditemukan-mesin",
  "terverifikasi-manusia",
  "belum",
  "dikarantina",
  "dicabut",
] as const;
export type StatusKlaim = (typeof STATUS_KLAIM)[number];

/** Tingkat bukti: A regulasi nasional, B pedoman WHO/FAO, C model terbit, D asumsi pengembang. */
export const TINGKAT_BUKTI = ["A", "B", "C", "D"] as const;
export type TingkatBukti = (typeof TINGKAT_BUKTI)[number];

export const TIPE_KLAIM = ["nilai", "rumus", "ambang", "asumsi"] as const;

export const LocatorSchema = z.object({
  halaman: z.number().int().positive().optional(),
  tabel: z.string().min(1).optional(),
  baris: z.string().min(1).optional(),
  /** Kutipan pendek saja (batas hak cipta); bukan salinan teks sumber. */
  kutipan_pendek: z.string().max(200).optional(),
  bbox: z.tuple([z.number(), z.number(), z.number(), z.number()]).optional(),
});
export type Locator = z.infer<typeof LocatorSchema>;

export const SumberSchema = z.object({
  id: z.string().regex(/^S-[A-Za-z0-9_-]+$/),
  jenis: z.enum(["regulasi", "pedoman", "jurnal", "basis-data", "lainnya"]),
  penerbit: z.string().min(1),
  judul: z.string().min(1),
  edisi: z.string().min(1),
  url: z.string().url().optional(),
  doi: z.string().optional(),
  tanggal_akses: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  lisensi: z.string().min(1),
  boleh_redistribusi: z.boolean(),
  berkas_lokal: z.string().nullable(),
  sha256: z
    .string()
    .regex(/^[0-9a-f]{64}$/)
    .nullable(),
  tingkat: z.enum(TINGKAT_BUKTI),
});
export type Sumber = z.infer<typeof SumberSchema>;

export const RujukanSumberSchema = z.object({
  sumber_id: z.string(),
  locator: LocatorSchema,
});

export const KlaimSchema = z
  .object({
    id: z.string().regex(/^KL-[A-Za-z0-9_-]+$/),
    tipe: z.enum(TIPE_KLAIM),
    pernyataan: z.string().min(1),
    status: z.enum(STATUS_KLAIM),
    tingkat: z.enum(TINGKAT_BUKTI),
    sumber: z.array(RujukanSumberSchema),
    diverifikasi_oleh: z
      .object({
        nama: z.string().min(1),
        tanggal: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        versi: z.string().min(1),
      })
      .optional(),
  })
  .superRefine((k, ctx) => {
    if (k.status === "terverifikasi-manusia" && !k.diverifikasi_oleh) {
      ctx.addIssue({
        code: "custom",
        message: "status terverifikasi-manusia wajib memuat nama, tanggal, dan versi",
        path: ["diverifikasi_oleh"],
      });
    }
    if (k.tipe !== "asumsi" && k.sumber.length === 0 && k.status !== "dikarantina" && k.status !== "dicabut") {
      ctx.addIssue({
        code: "custom",
        message: "klaim bukan-asumsi wajib punya minimal satu sumber (kecuali dikarantina/dicabut)",
        path: ["sumber"],
      });
    }
    if (k.tipe === "asumsi" && k.tingkat !== "D") {
      ctx.addIssue({
        code: "custom",
        message: "asumsi pengembang wajib bertingkat bukti D",
        path: ["tingkat"],
      });
    }
  });
export type Klaim = z.infer<typeof KlaimSchema>;

export const KumpulanKlaimSchema = z
  .object({
    versi: z.string().min(1),
    klaim: z.array(KlaimSchema),
  })
  .superRefine((kk, ctx) => {
    const lihat = new Set<string>();
    kk.klaim.forEach((k, i) => {
      if (lihat.has(k.id)) {
        ctx.addIssue({ code: "custom", message: `id klaim ganda: ${k.id}`, path: ["klaim", i, "id"] });
      }
      lihat.add(k.id);
    });
  });
export type KumpulanKlaim = z.infer<typeof KumpulanKlaimSchema>;

export const KumpulanSumberSchema = z
  .object({
    versi: z.string().min(1),
    sumber: z.array(SumberSchema),
  })
  .superRefine((ks, ctx) => {
    const lihat = new Set<string>();
    ks.sumber.forEach((s, i) => {
      if (lihat.has(s.id)) {
        ctx.addIssue({ code: "custom", message: `id sumber ganda: ${s.id}`, path: ["sumber", i, "id"] });
      }
      lihat.add(s.id);
    });
  });
export type KumpulanSumber = z.infer<typeof KumpulanSumberSchema>;
