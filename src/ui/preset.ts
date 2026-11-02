import type { MasukanRingkasan } from "../app/fasad";

export type KodePreset = "A" | "B" | "C";

export interface PresetSintetis {
  id: KodePreset;
  kode: string;
  label: string;
  ringkas: string;
  catatan: string;
  masukan: MasukanRingkasan;
}

/**
 * Tiga kasus uji sintetis tanpa nama anak pribadi (D-1, INV-17, ADR-0003).
 * Seluruh angka bersifat deterministik dan hanya disimpan di memori sesi.
 */
export const PRESET_SINTETIS: Record<KodePreset, PresetSintetis> = {
  A: {
    id: "A",
    kode: "KASUS-SINTETIS-A",
    label: "Kasus Sintetis A (9 bln · Gizi Baik)",
    ringkas: "9 bln 4 hr · P · 8,2 kg · 70,5 cm · Masih ASI",
    catatan:
      "Skenario normal kelompok 9–11 bulan (tekstur cincang halus / finger food, masih menyusu ASI, tanpa pantangan bahan).",
    masukan: {
      status: {
        jk: "P",
        umur: { bulan: 9, hari: 4 },
        bb_kg: 8.2,
        pb_cm: 70.5,
        cara_ukur: "terlentang",
      },
      tanda_bahaya: [],
      pola: {
        hari: 3,
        benih: "rona-sintetis-a1",
        hindari: [],
        izinkan_hati: true,
        masih_asi: true,
      },
    },
  },
  B: {
    id: "B",
    kode: "KASUS-SINTETIS-B",
    label: "Kasus Sintetis B (14 bln · Indikasi Rujuk)",
    ringkas: "14 bln 12 hr · L · 6,8 kg · 72,0 cm · Tanda Bahaya",
    catatan:
      "Skenario rujukan wajib (gerbang keselamatan): anak tampak tidak mau minum/menyusu disertai berat badan sangat kurang. Mesin menghentikan rekomendasi menu mandiri.",
    masukan: {
      status: {
        jk: "L",
        umur: { bulan: 14, hari: 12 },
        bb_kg: 6.8,
        pb_cm: 72.0,
        cara_ukur: "terlentang",
      },
      tanda_bahaya: ["tidak_mau_minum_atau_menyusu"],
      pola: {
        hari: 3,
        benih: "rona-sintetis-b1",
        hindari: [],
        izinkan_hati: true,
        masih_asi: true,
      },
    },
  },
  C: {
    id: "C",
    kode: "KASUS-SINTETIS-C",
    label: "Kasus Sintetis C (18 bln · Pantang Telur)",
    ringkas: "18 bln 2 hr · L · 9,6 kg · 79,5 cm · Tanpa ASI · Pantang Telur",
    catatan:
      "Skenario kelompok 12–23 bulan (makanan keluarga dihaluskan seperlunya), sudah tidak menyusu ASI, dan menghindari bahan kelompok alergen telur.",
    masukan: {
      status: {
        jk: "L",
        umur: { bulan: 18, hari: 2 },
        bb_kg: 9.6,
        pb_cm: 79.5,
        cara_ukur: "terlentang",
      },
      tanda_bahaya: [],
      pola: {
        hari: 3,
        benih: "rona-sintetis-c1",
        hindari: ["telur"],
        izinkan_hati: true,
        masih_asi: false,
      },
    },
  },
};

export function klonMasukan(m: MasukanRingkasan): MasukanRingkasan {
  return {
    status: {
      jk: m.status.jk,
      umur: { bulan: m.status.umur.bulan, hari: m.status.umur.hari },
      bb_kg: m.status.bb_kg,
      pb_cm: m.status.pb_cm,
      cara_ukur: m.status.cara_ukur,
    },
    tanda_bahaya: [...m.tanda_bahaya],
    pola: {
      hari: m.pola.hari,
      benih: m.pola.benih,
      hindari: [...m.pola.hindari],
      izinkan_hati: m.pola.izinkan_hati,
      masih_asi: m.pola.masih_asi,
    },
  };
}
