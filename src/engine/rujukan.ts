import { DATA } from "./data";
import type { KeluaranStatus } from "./antropometri";

/**
 * Tingkat tindak lanjut dari hasil status dan tanda bahaya. Aturan konservatif (KL-ASUMSI-RUJUKAN, belum ditinjau tenaga kesehatan).
 * "rujuk" = segera temui petugas kesehatan; menu contoh tidak ditampilkan dan AI tidak dipakai.
 */
export type TingkatTindak = "normal" | "perhatian" | "rujuk";
export type KodeTandaBahaya = string;

export interface HasilRujukan {
  tingkat: TingkatTindak;
  /** Kode alasan, mis. "tanda_bahaya:kejang" atau "bbu:bb_sangat_kurang". */
  alasan: string[];
}

export function daftarTandaBahaya(): readonly { kode: string; label: string }[] {
  return DATA.aturanRujukan.tanda_bahaya;
}

export function tentukanTingkat(status: KeluaranStatus | null, tandaBahaya: readonly KodeTandaBahaya[]): HasilRujukan {
  const A = DATA.aturanRujukan;
  const dikenal = new Set(A.tanda_bahaya.map((t) => t.kode));
  const alasanRujuk: string[] = [];
  for (const t of tandaBahaya) {
    // kode tak dikenal diperlakukan sebagai tanda bahaya (gagal-aman), bukan diabaikan
    alasanRujuk.push(dikenal.has(t) ? `tanda_bahaya:${t}` : `tanda_bahaya_tak_dikenal:${t.slice(0, 40)}`);
  }
  const alasanPerhatian: string[] = [];
  if (status && status.hasil === "ok") {
    const peta: [string, string][] = [
      ["bbu", status.bbu.kategori],
      ["pbu", status.pbu.kategori],
      ["bbpb", status.bbpb.kategori],
    ];
    for (const [ind, kat] of peta) {
      if ((A.tingkat_dari_status.rujuk as Record<string, string[]>)[ind]?.includes(kat)) alasanRujuk.push(`${ind}:${kat}`);
      else if ((A.tingkat_dari_status.perhatian as Record<string, string[]>)[ind]?.includes(kat)) alasanPerhatian.push(`${ind}:${kat}`);
    }
  }
  if (alasanRujuk.length > 0) return { tingkat: "rujuk", alasan: [...alasanRujuk, ...alasanPerhatian] };
  if (alasanPerhatian.length > 0) return { tingkat: "perhatian", alasan: alasanPerhatian };
  return { tingkat: "normal", alasan: [] };
}
