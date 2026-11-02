import { z } from "zod";

/** Kunci zat per 100 g pada data/bahan/bahan.json. */
export const KUNCI_ZAT = [
  "energi_kkal", "protein_g", "lemak_g", "karbohidrat_g", "serat_g",
  "kalsium_mg", "fosfor_mg", "magnesium_mg", "besi_mg", "seng_mg", "natrium_mg", "kalium_mg",
  "tembaga_mg", "selenium_mcg", "vit_a_rae_mcg", "vit_d_mcg", "vit_c_mg",
  "vit_b1_mg", "vit_b2_mg", "vit_b3_mg", "vit_b6_mg", "folat_total_mcg", "vit_b12_mcg", "kolin_mg",
] as const;
export type KunciZat = (typeof KUNCI_ZAT)[number];

const per100g = z.object(
  Object.fromEntries(KUNCI_ZAT.map((k) => [k, z.number().nonnegative().optional()])) as Record<
    KunciZat,
    z.ZodOptional<z.ZodNumber>
  >,
).strict();

export const BahanGiziSchema = z.object({
  klaim_id: z.literal("KL-BAHAN-USDA-SRLEGACY"),
  label_belum_diverifikasi: z.boolean().optional(),
  _meta: z.object({ sumber: z.string().min(1) }).passthrough(),
  bahan: z.array(
    z.object({
      id: z.string().regex(/^[a-z0-9_]+$/),
      nama_usda: z.string().min(1),
      fdc_id: z.number().int().positive(),
      per_100g: per100g,
    }),
  ).min(1),
});
export type BahanGizi = z.infer<typeof BahanGiziSchema>;

export const PERAN = ["staple", "protein_hewani", "protein_nabati", "sayur", "buah", "lemak", "susu"] as const;
export const KELOMPOK_MDD = [
  "serealia", "kacang_biji", "susu_olahan", "daging_ikan", "telur", "sayur_buah_vit_a", "sayur_buah_lain", "lemak",
] as const;

export const BahanAtributSchema = z.object({
  klaim_ids: z.array(z.string()).min(1),
  label_belum_diverifikasi: z.boolean().optional(),
  _meta: z.object({ catatan: z.string() }).passthrough(),
  bahan: z.array(
    z.object({
      id: z.string().regex(/^[a-z0-9_]+$/),
      nama: z.string().min(1),
      peran: z.enum(PERAN),
      kelompok_mdd: z.enum(KELOMPOK_MDD),
      hewani: z.boolean(),
      usia_min_bulan: z.number().int().min(0),
      alergen: z.array(z.string()),
      rasio_beli: z.number().positive(),
      kelas_harga: z.enum(["murah", "sedang", "mahal"]),
    }),
  ).min(1),
});
export type BahanAtribut = z.infer<typeof BahanAtributSchema>;
