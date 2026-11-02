# Prompt pemeriksaan silang (Gemini atau ChatGPT) — hanya membaca

Peran: pemeriksa independen. Anda TIDAK boleh mengubah berkas proyek. Tulis hasil sebagai satu berkas Markdown yang akan disimpan pemilik di `docs/periksa/`.

Lampirkan: (1) PDF Permenkes 2/2020 (peraturan.go.id/files/bn7-2020.pdf), (2) PDF Permenkes 28/2019 (BN 2019 No. 956), (3) berkas `data/tabel_sd/*.json` dan `data/akg_anak.json`.

## Tugas A: tabel SD
Untuk setiap berkas `data/tabel_sd/*.json`, bandingkan SETIAP baris dan kolom (−3, −2, −1, median, +1, +2, +3 SD) dengan tabel resmi:
- BB/U laki-laki: PDF hlm. 16–17; perempuan: hlm. 34–35 (rentang 6–23 bulan).
- PB/U laki-laki: hlm. 19; perempuan: hlm. 37 (6–23 bulan).
- BB/PB laki-laki dan perempuan: tabel "Berat Badan menurut Panjang Badan" (sampel awal: laki-laki hlm. 22, perempuan hlm. 41); periksa SELURUH baris 45,0–110,0 cm.
Kolom merah (−3, −2, +2, +3 SD) berwarna gelap dan mudah salah baca; baca dengan teliti dan laporkan keraguan.

## Tugas B: AKG
Bandingkan `data/akg_anak.json` (kelompok 6–11 bulan dan 1–3 tahun) dengan Lampiran I Permenkes 28/2019 Tabel 1, 2, 3 (hlm. 6–14 berkas; halaman diputar). Periksa semua 36 zat. Laporkan juga isi lengkap catatan kaki Tabel 1 (faktor aktivitas fisik) dan Tabel 3 (besi, seng).

## Format hasil
1. Ringkasan: jumlah sel diperiksa, jumlah cocok, jumlah berbeda, jumlah tidak terbaca.
2. Tabel selisih: berkas | baris | kolom | nilai di data | nilai di PDF | keyakinan (tinggi/sedang/rendah).
3. Pernyataan jujur tentang apa yang TIDAK dapat Anda baca. Jangan menebak. Jangan menyatakan "semua cocok" bila ada sel yang tidak terbaca.
