import type { MuatanAi } from "./kontrak";

/** Arti kode dalam bahasa sehari-hari. Dipakai templat cadangan, prompt Worker, dan validator (satu sumber kata). */
export const LABEL_BBU: Record<NonNullable<MuatanAi["status"]>["bbu"], string> = {
  bb_sangat_kurang: "berat badan sangat kurang menurut umur",
  bb_kurang: "berat badan kurang menurut umur",
  bb_normal: "berat badan normal menurut umur",
  risiko_bb_lebih: "berat badan berisiko lebih menurut umur",
};
export const LABEL_PBU: Record<NonNullable<MuatanAi["status"]>["pbu"], string> = {
  sangat_pendek: "panjang badan sangat pendek menurut umur",
  pendek: "panjang badan pendek menurut umur",
  normal: "panjang badan normal menurut umur",
  tinggi: "panjang badan tinggi menurut umur",
};
export const LABEL_BBPB: Record<NonNullable<MuatanAi["status"]>["bbpb"], string> = {
  gizi_buruk: "berat badan menurut panjang badan masuk kategori gizi buruk",
  gizi_kurang: "berat badan menurut panjang badan masuk kategori gizi kurang",
  gizi_baik: "berat badan menurut panjang badan masuk kategori gizi baik",
  risiko_gizi_lebih: "berat badan menurut panjang badan masuk kategori berisiko gizi lebih",
  gizi_lebih: "berat badan menurut panjang badan masuk kategori gizi lebih",
  obesitas: "berat badan menurut panjang badan masuk kategori obesitas",
  panjang_di_luar_tabel_setelah_pembulatan: "panjang badan di luar rentang tabel sehingga kategori berat menurut panjang tidak dapat dibaca",
};
export const NAMA_ZAT: Record<string, string> = {
  energi_kkal: "energi", protein_g: "protein", lemak_g: "lemak", karbohidrat_g: "karbohidrat", serat_g: "serat",
  kalsium_mg: "kalsium", fosfor_mg: "fosfor", magnesium_mg: "magnesium", besi_mg: "zat besi", seng_mg: "seng",
  natrium_mg: "natrium", kalium_mg: "kalium", tembaga_mg: "tembaga", selenium_mcg: "selenium",
  vit_a_rae_mcg: "vitamin A", vit_d_mcg: "vitamin D", vit_c_mg: "vitamin C", vit_b1_mg: "vitamin B1",
  vit_b2_mg: "vitamin B2", vit_b3_mg: "vitamin B3", vit_b6_mg: "vitamin B6", folat_total_mcg: "folat",
  vit_b12_mcg: "vitamin B12", kolin_mg: "kolin",
};
export const LABEL_CELAH: Record<NonNullable<MuatanAi["celah"]>[number], string> = {
  mdd_belum_tercapai: "keragaman makanan harian belum mencapai 5 dari 8 kelompok",
  vit_a_hewani_melebihi_batas: "vitamin A dari sumber hewani melewati batas asumsi",
  tidak_ada_pilihan_staple: "tidak ada pilihan makanan pokok yang cocok",
  tidak_ada_pilihan_protein: "tidak ada pilihan lauk yang cocok",
  tidak_ada_pilihan_sayur: "tidak ada pilihan sayur yang cocok",
  tidak_ada_pilihan_buah: "tidak ada pilihan buah yang cocok",
  tidak_ada_pilihan_susu: "tidak ada pilihan susu atau olahannya yang cocok",
};
export const LABEL_PITA: Record<MuatanAi["pita_usia"], string> = {
  "6-8": "6 sampai 8 bulan",
  "9-11": "9 sampai 11 bulan",
  "12-23": "12 sampai 23 bulan",
};

/** Tulisan wajib yang ditampilkan antarmuka di samping teks AI (bukan bagian keluaran AI). */
export const PERINGATAN_AI =
  "Penjelasan ini dibuat oleh AI dan bisa keliru. Angka dan status dihitung oleh mesin NUTRIVA, bukan oleh AI.";
export const PERNYATAAN_PRIVASI_AI =
  "Penjelasan AI bersifat opsional. Yang dikirim hanya ringkasan berkode (rentang usia, kategori status, persen kecukupan gizi). Nama, tanggal lahir, berat badan, dan panjang badan tidak dikirim. Teks cadangan selalu tersedia tanpa jaringan.";
