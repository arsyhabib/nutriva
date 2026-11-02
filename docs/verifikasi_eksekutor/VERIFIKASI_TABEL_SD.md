# Verifikasi tabel SD (Permenkes 2/2020) — Hari 1, diperbarui 2026-11-02

Metode: (A) baca visual halaman PDF Permenkes 2/2020 (peraturan.go.id/files/bn7-2020.pdf) vs (B) tabel WHO 2006 (pygrowup 0.8.2) + hitung ulang LMS (0 selisih, 6 berkas).

| Berkas | Dicek visual | Hasil | Status klaim |
|---|---|---|---|
| bbu_L (BB/U laki-laki 6–23 bln) | hlm. 16–17, 18 baris | cocok (bln 20 +2SD diputuskan via LMS = 14,2) | teks-ditemukan-mesin |
| bbu_P (BB/U perempuan 6–23 bln) | hlm. 34–35, 18 baris | cocok di kolom −3, −1, 0, +1, +3 SD | teks-ditemukan-mesin |
| pbu_L (PB/U laki-laki 6–23 bln) | hlm. 19, 18 baris | cocok di kolom −3, −1, 0, +1, +3 SD | teks-ditemukan-mesin |
| pbu_P (PB/U perempuan 6–23 bln) | hlm. 37, 18 baris | cocok di kolom −3, −1, 0, +1, +3 SD | teks-ditemukan-mesin |
| bbpb_L (BB/PB laki-laki) | hlm. 22, sampel 48,5–61,0 cm (25 baris) | cocok di kolom terbaca | belum (sampel) + label_belum_diverifikasi |
| bbpb_P (BB/PB perempuan) | hlm. 41, sampel 61,5–74,0 cm (25 baris) | cocok di kolom terbaca | belum (sampel) + label_belum_diverifikasi |

Catatan: sel merah (−3/−2/+2/+3 SD) sulit dibaca pada zoom rendah; kolom −2 dan +2 SD hanya ditopang hitung ulang LMS. Sisa pemeriksaan visual → silang oleh AI lain (`docs/periksa/PROMPT_PERIKSA_SILANG.md`).
Catatan: nomor halaman adalah nomor halaman berkas PDF (BN hlm. n = berkas hlm. n).
