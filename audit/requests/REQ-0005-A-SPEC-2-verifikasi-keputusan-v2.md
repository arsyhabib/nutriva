# REQ-0005 — A-SPEC-2: Verifikasi keputusan v2 (Opsi A) dan kelayakan memulai M0

- **Tanggal:** 2026-10-28 · **Pengirim:** Eksekutor
- **Objek:** `KEPUTUSAN_DAN_JALUR_RILIS.md` v2; `REGISTRI_FITUR_NUTRIVA.md` (tag fase per ID; A01, A02, A04, A07, B10, D10, K14 diperbarui); `AUDITOR_PACKAGE/03_BASIS_PENGETAHUAN.md` (TTD, 77%, Permenkes 21/2021, IOM); `audit/responses/RSP-0003-verifikasi-ulang.md`, `RSP-0004-A-SPEC-1.md`
- **Di luar ruang lingkup:** klaim ilmiah lain (REQ terpisah); kode (belum ada)

## Pertanyaan (kerjakan berurutan; hasil antara di `audit/evidence/`)
1. **Opsi A.** Cari sebanyak mungkin cara data nyata tetap bisa masuk atau bocor pada V-PJBL (masukan teks bebas, tangkapan layar, kader yang memakai profil "sintetis" untuk anak sungguhan, ekspor, penyimpanan lokal, cache). Untuk tiap celah: keparahan dan perbaikan yang diusulkan. Minimal 8 skenario, termasuk 3 buatan sendiri.
2. **Hari H.** Apakah rencana hari H v2 (§2) jujur dan masuk akal? Adakah klaim atau harapan yang tidak dapat dipenuhi tanpa data nyata? Apakah pengumpulan umpan balik kader (anonim, kasus sintetis) menimbulkan risiko baru?
3. **Delapan syarat RPT-0004.** Untuk tiap syarat (tabel §4 KEPUTUSAN): terpenuhi / sebagian / belum, dan bukti apa yang masih harus diserahkan.
4. **Dependensi M1 (M1a 31 + M1b 30).** Jalankan ulang pemeriksaan dependensi Anda terhadap registri yang sudah bertag. Daftar ketergantungan yang masih hilang atau bertentangan. Periksa hitungan tag per fase (M1a 31, M1b 30, M2 11, M3 6, M3+ 56, M4 1, M5 7, Tunda 11; total 153) dan konsistensi teks baris yang diedit (A01, A02, A04, A07, B10, D10, K14).
5. **Keselamatan anak M1.** Apakah rangkaian A02 (masukan baru) + A04 minimal + B12 + B13 + B01–B03 + label cukup untuk mode anak 6–23 bulan pada profil sintetis? Apa yang masih kurang?
6. **T-06 USDA.** Apakah syarat pemetaan 30 bahan (daftar tanpa padanan, catatan BDD/retensi) cukup? Apa kriteria penerimaan yang Anda usulkan untuk data M1a?
7. **Penutupan temuan sebelumnya.** Verifikasi bahwa perbaikan RSP-0003 pada `03_` benar (AUD-0003-01, -02, -07). Tutup atau biarkan terbuka dengan alasan.
8. **Vonis.** Layak, layak bersyarat (sebutkan syarat), atau tidak layak memulai **M0** untuk V-PJBL? M0 = fondasi proyek (struktur, skema data/jejak, git, uji kasus baku kosong), **tanpa fitur**.

## Kriteria penerimaan
- [ ] Jawaban tiap pertanyaan dengan bukti; temuan bernomor AUD-0005-xx
- [ ] Vonis eksplisit untuk M0

## Hal yang paling saya cemaskan
Opsi A mungkin mengecewakan harapan pemilik tentang hasil lapangan; M1 membengkak menjadi 61 ID; data tabel A04 harus dibaca dari gambar atau data eksternal; label bisa dihilangkan pengguna dengan tangkapan layar.

## Asumsi
Pemilik mengonfirmasi Opsi A dengan kalimatnya sendiri (menunggu); izin kegiatan PjBL di luar audit teknis.
