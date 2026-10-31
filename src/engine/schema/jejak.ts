import { z } from "zod";
import { LABEL_PROTOTIPE, PROFIL_RILIS, SKEMA_JEJAK_VERSI } from "../konstanta";

/**
 * Nilai yang boleh dicatat dalam jejak: angka, boolean, null, atau KODE tertutup
 * (huruf kecil/angka/_ . -, maksimal 40 karakter). Teks bebas ditolak (INV-17; AUD-0006-04):
 * jejak tidak boleh menjadi saluran nama atau catatan pengguna.
 */
const Kode = z.string().regex(/^[a-z0-9][a-z0-9_.-]{0,39}$/, "hanya kode tertutup, bukan teks bebas");
const Skalar = z.union([z.number(), z.boolean(), z.null(), Kode]);
const NilaiJejak = z.union([Skalar, z.array(Skalar)]);

export const LangkahJejakSchema = z.object({
  no: z.number().int().positive(),
  /** Ditulis pengembang (bukan pengguna); dibatasi panjang. */
  deskripsi: z.string().min(1).max(200),
  masukan: z.record(z.string().regex(/^[a-z0-9_]{1,40}$/), NilaiJejak),
  keluaran: z.record(z.string().regex(/^[a-z0-9_]{1,40}$/), NilaiJejak),
  satuan: z.string().max(20).optional(),
  /** Setiap langkah menunjuk klaim yang mendasarinya (INV-04, INV-05). */
  klaim_id: z.array(z.string().regex(/^KL-[A-Za-z0-9_-]+$/)).min(1),
});
export type LangkahJejak = z.infer<typeof LangkahJejakSchema>;

export const JejakSchema = z
  .object({
    skema_versi: z.literal(SKEMA_JEJAK_VERSI),
    engine_version: z.string().min(1),
    data_version: z.string().min(1),
    /** Benih deterministik (INV-02). */
    benih: z.string().min(1).max(40),
    profil_rilis: z.enum(PROFIL_RILIS),
    /** Harus persis LABEL_PROTOTIPE bila ada; wajib pada profil demo (RPT-0004 syarat 2). */
    label: z.literal(LABEL_PROTOTIPE).optional(),
    langkah: z.array(LangkahJejakSchema).min(1),
  })
  .superRefine((j, ctx) => {
    if (j.profil_rilis === "demo" && !j.label) {
      ctx.addIssue({ code: "custom", message: "profil demo wajib memuat label prototipe", path: ["label"] });
    }
    j.langkah.forEach((l, i) => {
      if (l.no !== i + 1) {
        ctx.addIssue({ code: "custom", message: "nomor langkah harus berurutan mulai 1", path: ["langkah", i, "no"] });
      }
    });
  });
export type Jejak = z.infer<typeof JejakSchema>;
