import { z } from "zod";

/** Tujuh garis SD berurutan: -3, -2, -1, 0, +1, +2, +3 (naik ketat tidak disyaratkan; tidak menurun). */
export const KOLOM_SD = ["-3", "-2", "-1", "0", "+1", "+2", "+3"] as const;

const SdSchema = z
  .tuple([z.number(), z.number(), z.number(), z.number(), z.number(), z.number(), z.number()])
  .refine((sd) => sd.every((x, i) => i === 0 || x >= (sd[i - 1] as number)), {
    message: "garis SD harus tidak menurun dari -3 ke +3",
  });

const MetaSchema = z.object({
  indikator: z.enum(["BBU", "PBU", "BBPB"]),
  nama: z.string().min(1),
  jenis_kelamin: z.enum(["L", "P"]),
  satuan: z.string().min(1),
  kolom_sd: z.tuple([
    z.literal("-3"),
    z.literal("-2"),
    z.literal("-1"),
    z.literal("0"),
    z.literal("+1"),
    z.literal("+2"),
    z.literal("+3"),
  ]),
  kunci_baris: z.enum(["bulan", "panjang_cm"]),
  cakupan: z.string().min(1),
  sumber_rujukan: z.string().min(1),
  sumber_mesin: z.string().min(1),
  sha256_berkas_sumber_mesin: z.string().regex(/^[0-9a-f]{64}$/),
  pembulatan: z.string().min(1),
  catatan: z.string().optional(),
});

const BarisBulanSchema = z.object({ bulan: z.number().int(), sd: SdSchema });
const BarisPanjangSchema = z.object({ panjang_cm: z.number(), sd: SdSchema });

const dasar = {
  klaim_id: z.string().regex(/^KL-SD-[A-Z]+-[LP]$/),
  label_belum_diverifikasi: z.boolean().optional(),
};

/** Tabel BB/U dan PB/U: kunci baris = usia bulan penuh. */
export const TabelSdBulanSchema = z
  .object({
    ...dasar,
    _meta: MetaSchema.refine((m) => m.kunci_baris === "bulan"),
    baris: z.array(BarisBulanSchema).min(1),
  })
  .refine((t) => new Set(t.baris.map((b) => b.bulan)).size === t.baris.length, {
    message: "bulan duplikat",
  });

/** Tabel BB/PB: kunci baris = panjang (cm), langkah 0,5. */
export const TabelSdPanjangSchema = z
  .object({
    ...dasar,
    _meta: MetaSchema.refine((m) => m.kunci_baris === "panjang_cm"),
    baris: z.array(BarisPanjangSchema).min(1),
  })
  .refine((t) => new Set(t.baris.map((b) => b.panjang_cm)).size === t.baris.length, {
    message: "panjang duplikat",
  });

export type Sd7 = z.infer<typeof SdSchema>;
export type TabelSdBulan = z.infer<typeof TabelSdBulanSchema>;
export type TabelSdPanjang = z.infer<typeof TabelSdPanjangSchema>;
