import { z } from "zod";

const ZatSchema = z.object({ nilai: z.number().nonnegative(), satuan: z.string().min(1) });

const KelompokSchema = z.object({
  berat_badan_kg: z.number().positive(),
  tinggi_badan_cm: z.number().positive(),
  nilai: z.record(z.string(), ZatSchema),
});

/** AKG anak (Permenkes 28/2019, Lampiran I). Angka membawa klaim_id dan label bila belum diverifikasi. */
export const AkgAnakSchema = z.object({
  klaim_id: z.literal("KL-AKG-ANAK"),
  label_belum_diverifikasi: z.boolean().optional(),
  _meta: z.object({ sumber: z.string().min(1) }).passthrough(),
  kelompok: z.object({
    "6-11_bulan": KelompokSchema,
    "1-3_tahun": KelompokSchema,
  }),
});
export type AkgAnak = z.infer<typeof AkgAnakSchema>;
