import { DATA } from "./data";
import { KUNCI_ZAT, type KunciZat } from "./schema/bahan";

/** Bagian gizi: jumlah zat dari daftar bahan dan persen terhadap AKG anak. Fungsi murni. */

export interface ItemMenu {
  bahan_id: string;
  /** gram bagian dimakan dalam keadaan seperti entri USDA (umumnya matang) */
  gram: number;
}

export interface TotalGizi {
  total: Record<KunciZat, number>;
  /** zat yang tidak diketahui pada minimal satu bahan; totalnya batas bawah */
  tidak_lengkap: KunciZat[];
}

const PETA_BAHAN = new Map(DATA.bahanGizi.bahan.map((b) => [b.id, b] as const));

export function adaBahan(id: string): boolean {
  return PETA_BAHAN.has(id);
}

export function hitungGizi(items: readonly ItemMenu[]): TotalGizi {
  const total = Object.fromEntries(KUNCI_ZAT.map((k) => [k, 0])) as Record<KunciZat, number>;
  const hilang = new Set<KunciZat>();
  for (const it of items) {
    const b = PETA_BAHAN.get(it.bahan_id);
    if (!b) throw new Error(`bahan tidak dikenal: ${it.bahan_id}`);
    if (!(it.gram >= 0) || !Number.isFinite(it.gram)) throw new Error(`gram tidak valid untuk ${it.bahan_id}`);
    for (const k of KUNCI_ZAT) {
      const v = b.per_100g[k];
      if (v === undefined) {
        if (it.gram > 0) hilang.add(k);
      } else {
        total[k] += (v * it.gram) / 100;
      }
    }
  }
  return { total, tidak_lengkap: KUNCI_ZAT.filter((k) => hilang.has(k)) };
}

export type KelompokAkg = "6-11_bulan" | "1-3_tahun";

export function kelompokAkgDariUsia(usiaBulan: number): KelompokAkg {
  return usiaBulan <= 11 ? "6-11_bulan" : "1-3_tahun";
}

interface PetaZat {
  zat: KunciZat;
  akg: string;
  satuanAkg: string;
  /** pengali satuan USDA -> satuan AKG */
  pengali: number;
  /** vitamin A: USDA RAE vs AKG RE */
  satuan_beda?: boolean;
}

// klaim: n/a — tabel pemetaan nama zat; nilai pengali adalah konversi satuan (mg ke mcg), bukan konstanta ilmiah
const PETA: readonly PetaZat[] = [
  { zat: "protein_g", akg: "protein", satuanAkg: "g", pengali: 1 },
  { zat: "lemak_g", akg: "lemak_total", satuanAkg: "g", pengali: 1 },
  { zat: "karbohidrat_g", akg: "karbohidrat", satuanAkg: "g", pengali: 1 },
  { zat: "serat_g", akg: "serat", satuanAkg: "g", pengali: 1 },
  { zat: "kalsium_mg", akg: "kalsium", satuanAkg: "mg", pengali: 1 },
  { zat: "fosfor_mg", akg: "fosfor", satuanAkg: "mg", pengali: 1 },
  { zat: "magnesium_mg", akg: "magnesium", satuanAkg: "mg", pengali: 1 },
  { zat: "besi_mg", akg: "besi", satuanAkg: "mg", pengali: 1 },
  { zat: "seng_mg", akg: "seng", satuanAkg: "mg", pengali: 1 },
  { zat: "natrium_mg", akg: "natrium", satuanAkg: "mg", pengali: 1 },
  { zat: "kalium_mg", akg: "kalium", satuanAkg: "mg", pengali: 1 },
  { zat: "tembaga_mg", akg: "tembaga", satuanAkg: "mcg", pengali: 1000 },
  { zat: "selenium_mcg", akg: "selenium", satuanAkg: "mcg", pengali: 1 },
  { zat: "vit_a_rae_mcg", akg: "vit_a_re", satuanAkg: "RE", pengali: 1, satuan_beda: true },
  { zat: "vit_d_mcg", akg: "vit_d", satuanAkg: "mcg", pengali: 1 },
  { zat: "vit_c_mg", akg: "vit_c", satuanAkg: "mg", pengali: 1 },
  { zat: "vit_b1_mg", akg: "vit_b1", satuanAkg: "mg", pengali: 1 },
  { zat: "vit_b2_mg", akg: "vit_b2", satuanAkg: "mg", pengali: 1 },
  { zat: "vit_b3_mg", akg: "vit_b3", satuanAkg: "mg", pengali: 1 },
  { zat: "vit_b6_mg", akg: "vit_b6", satuanAkg: "mg", pengali: 1 },
  { zat: "folat_total_mcg", akg: "folat", satuanAkg: "mcg", pengali: 1 },
  { zat: "vit_b12_mcg", akg: "vit_b12", satuanAkg: "mcg", pengali: 1 },
  { zat: "kolin_mg", akg: "kolin", satuanAkg: "mg", pengali: 1 },
];

export type PitaPersen = "rendah" | "sedang" | "cukup";

export interface PersenZat {
  zat: KunciZat;
  nilai: number;
  akg: number;
  persen: number;
  pita: PitaPersen;
  lengkap: boolean;
  satuan_beda: boolean;
}

export interface LaporanAkg {
  kelompok: KelompokAkg;
  klaim_id: string;
  label_belum_diverifikasi: boolean;
  zat: PersenZat[];
}

/** Pembulatan setengah-naik ke bilangan bulat (bukan pembulatan bankir bawaan Math.round untuk negatif; nilai selalu >= 0). */
export function bulatPersen(x: number): number {
  return Math.floor(x + 0.5);
}

export function persenAkg(t: TotalGizi, usiaBulan: number): LaporanAkg {
  const kel = kelompokAkgDariUsia(usiaBulan);
  const akg = DATA.akgAnak.kelompok[kel].nilai;
  const a = DATA.aturanPolaMakan.tampilan;
  const zat: PersenZat[] = PETA.map((p) => {
    const rujukan = akg[p.akg];
    if (!rujukan) throw new Error(`AKG tidak memuat ${p.akg}`);
    if (rujukan.satuan !== p.satuanAkg) throw new Error(`satuan AKG ${p.akg} ${rujukan.satuan} != ${p.satuanAkg}`);
    const nilai = t.total[p.zat] * p.pengali;
    const persen = bulatPersen((nilai / rujukan.nilai) * 100);
    const pita: PitaPersen = persen < a.ambang_persen_rendah ? "rendah" : persen < a.ambang_persen_cukup ? "sedang" : "cukup";
    return {
      zat: p.zat,
      nilai,
      akg: rujukan.nilai,
      persen,
      pita,
      lengkap: !t.tidak_lengkap.includes(p.zat),
      satuan_beda: p.satuan_beda === true,
    };
  });
  return {
    kelompok: kel,
    klaim_id: DATA.akgAnak.klaim_id,
    label_belum_diverifikasi: DATA.akgAnak.label_belum_diverifikasi === true,
    zat,
  };
}
