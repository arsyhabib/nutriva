import { z } from "zod";
import { KUNCI_ZAT } from "../engine/schema/bahan";
import type { KategoriBbu, KategoriBbpb, KategoriPbu } from "../engine/antropometri";

/**
 * Kontrak muatan ke penjelas AI (K-08). Himpunan tertutup: tidak ada teks bebas, tidak ada angka mentah
 * selain persen AKG bulat dan hitungan kecil. Berkas ini dipakai bersama oleh klien dan Worker.
 * Layar "rujukan" sengaja tidak ada: AI tidak pernah tampil di sana.
 */
export const SKEMA_MUATAN_VERSI = 1 as const;

export const LAYAR_AI = ["status", "pola_makan", "belanja"] as const;
export const PITA_USIA = ["6-8", "9-11", "12-23"] as const;
export const KAT_BBU = ["bb_sangat_kurang", "bb_kurang", "bb_normal", "risiko_bb_lebih"] as const satisfies readonly KategoriBbu[];
export const KAT_PBU = ["sangat_pendek", "pendek", "normal", "tinggi"] as const satisfies readonly KategoriPbu[];
export const KAT_BBPB = [
  "gizi_buruk", "gizi_kurang", "gizi_baik", "risiko_gizi_lebih", "gizi_lebih", "obesitas",
  "panjang_di_luar_tabel_setelah_pembulatan",
] as const satisfies readonly (KategoriBbpb | "panjang_di_luar_tabel_setelah_pembulatan")[];
export const KODE_CELAH = [
  "mdd_belum_tercapai", "vit_a_hewani_melebihi_batas", "tidak_ada_pilihan_staple",
  "tidak_ada_pilihan_protein", "tidak_ada_pilihan_sayur", "tidak_ada_pilihan_buah", "tidak_ada_pilihan_susu",
] as const;

/** Zat yang dilaporkan persen AKG-nya (tanpa energi, yang dibandingkan dengan target MP-ASI). */
export const KUNCI_ZAT_AKG = KUNCI_ZAT.filter((k) => k !== "energi_kkal");

const versiTeks = z.string().regex(/^[0-9][0-9.\-]{0,15}$/);

export const MuatanAiSchema = z
  .object({
    skema: z.literal(SKEMA_MUATAN_VERSI),
    layar: z.enum(LAYAR_AI),
    pita_usia: z.enum(PITA_USIA),
    status: z
      .object({ bbu: z.enum(KAT_BBU), pbu: z.enum(KAT_PBU), bbpb: z.enum(KAT_BBPB) })
      .strict()
      .optional(),
    akg: z
      .array(z.object({ zat: z.enum(KUNCI_ZAT), persen: z.number().int().min(0).max(999) }).strict())
      .max(KUNCI_ZAT.length)
      .optional(),
    celah: z.array(z.enum(KODE_CELAH)).max(KODE_CELAH.length).optional(),
    menu: z
      .object({
        mdd_tercapai: z.boolean(),
        jumlah_kelompok_mdd: z.number().int().min(0).max(8),
        energi_persen_target: z.number().int().min(0).max(300),
      })
      .strict()
      .optional(),
    versi: z.object({ engine: versiTeks, data: versiTeks, rules: versiTeks }).strict(),
  })
  .strict();

export type MuatanAi = z.infer<typeof MuatanAiSchema>;
