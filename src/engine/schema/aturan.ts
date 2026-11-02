import { z } from "zod";

const porsiMaks = z.object({
  staple: z.number().positive(), protein: z.number().positive(), sayur: z.number().positive(),
  lemak: z.number().positive(), buah: z.number().positive(), susu: z.number().positive(),
});
const pita = z.object({
  bulan_min: z.number().int(), bulan_maks: z.number().int(), energi_mpasi_kkal: z.number().positive(),
  makan_utama: z.number().int().positive(), selingan: z.number().int().min(0), porsi_maks_g: porsiMaks,
});

export const AturanPolaMakanSchema = z.object({
  klaim_ids: z.array(z.string()).min(1),
  label_belum_diverifikasi: z.boolean().optional(),
  _meta: z.object({ catatan: z.array(z.string()) }).passthrough(),
  pita: z.object({ "6-8": pita, "9-11": pita, "12-23": pita }),
  porsi_energi: z.object({
    makan_utama_dari_total: z.number().min(0).max(1), staple: z.number(), protein: z.number(),
    sayur: z.number(), lemak: z.number(), selingan_buah: z.number(), selingan_susu: z.number(),
  }),
  batas: z.object({
    vit_a_hewani_rae_mcg_per_hari: z.number().positive(), hati_maks_g_per_porsi: z.number().positive(),
    hati_maks_per_minggu: z.number().int().min(0), mdd_minimal_kelompok: z.number().int(), kelompok_mdd_total: z.number().int(),
  }),
  tampilan: z.object({ ambang_persen_rendah: z.number(), ambang_persen_cukup: z.number() }),
}).superRefine((a, ctx) => {
  const p = a.porsi_energi;
  if (Math.abs(p.staple + p.protein + p.sayur + p.lemak - 1) > 1e-9)
    ctx.addIssue({ code: "custom", message: "porsi energi makan utama harus berjumlah 1", path: ["porsi_energi"] });
  if (Math.abs(p.selingan_buah + p.selingan_susu - 1) > 1e-9)
    ctx.addIssue({ code: "custom", message: "porsi energi selingan harus berjumlah 1", path: ["porsi_energi"] });
});
export type AturanPolaMakan = z.infer<typeof AturanPolaMakanSchema>;

const kodeTeks = z.string().regex(/^[a-z0-9_]{1,60}$/);
const daftarKode = z.array(z.string().min(1).max(80)).max(20);
export const AturanRujukanSchema = z
  .object({
    klaim_ids: z.array(z.string()).min(1),
    label_belum_diverifikasi: z.literal(true),
    _meta: z.object({ catatan: z.array(z.string()) }).passthrough().optional(),
    tanda_bahaya: z.array(z.object({ kode: kodeTeks, label: z.string().min(3).max(120) }).strict()).min(1).max(30),
    tingkat_dari_status: z
      .object({
        rujuk: z.object({ bbu: daftarKode, pbu: daftarKode, bbpb: daftarKode }).strict(),
        perhatian: z.object({ bbu: daftarKode, pbu: daftarKode, bbpb: daftarKode }).strict(),
      })
      .strict(),
  })
  .strict();
export type AturanRujukan = z.infer<typeof AturanRujukanSchema>;
