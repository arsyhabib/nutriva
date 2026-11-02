import { DATA } from "./data";
import type { MenuHari } from "./polaMakan";

/** Daftar belanja perkiraan dari menu beberapa hari. Bukan harga; gram dibeli = gram disajikan x rasio_beli, dibulatkan ke atas ke kelipatan 5 g. */

export interface ItemBelanja {
  bahan_id: string;
  nama: string;
  peran: string;
  gram_disajikan: number;
  gram_beli: number;
  kelas_harga: "murah" | "sedang" | "mahal";
}

export interface DaftarBelanja {
  item: ItemBelanja[];
  jumlah_per_kelas: Record<"murah" | "sedang" | "mahal", number>;
  klaim_ids: string[];
  label_belum_diverifikasi: true;
}

const URUT_PERAN = ["staple", "protein_hewani", "protein_nabati", "sayur", "buah", "susu", "lemak"];

export function bulatAtasLima(x: number): number {
  return Math.ceil(x / 5 - 1e-9) * 5;
}

export function buatDaftarBelanja(hari: readonly MenuHari[]): DaftarBelanja {
  const ATR = new Map(DATA.bahanAtribut.bahan.map((b) => [b.id, b] as const));
  const jumlah = new Map<string, number>();
  for (const h of hari) for (const s of h.slot) for (const i of s.item) jumlah.set(i.bahan_id, (jumlah.get(i.bahan_id) ?? 0) + i.gram);
  const item: ItemBelanja[] = [];
  for (const [id, gram] of jumlah) {
    const a = ATR.get(id);
    if (!a) throw new Error(`atribut bahan tidak ada: ${id}`);
    item.push({
      bahan_id: id,
      nama: a.nama,
      peran: a.peran,
      gram_disajikan: gram,
      gram_beli: bulatAtasLima(gram * a.rasio_beli),
      kelas_harga: a.kelas_harga,
    });
  }
  item.sort((x, y) => URUT_PERAN.indexOf(x.peran) - URUT_PERAN.indexOf(y.peran) || x.nama.localeCompare(y.nama, "id"));
  const jml = { murah: 0, sedang: 0, mahal: 0 };
  for (const i of item) jml[i.kelas_harga] += 1;
  return {
    item,
    jumlah_per_kelas: jml,
    klaim_ids: ["KL-ASUMSI-RASIO-BELI", "KL-ASUMSI-BAHAN-ATRIBUT"],
    label_belum_diverifikasi: true,
  };
}
