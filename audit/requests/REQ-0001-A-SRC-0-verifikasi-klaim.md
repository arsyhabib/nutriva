# REQ-0001 — A-SRC-0: Verifikasi register klaim dan rujukan

- **Jenis audit:** A-SRC
- **Tanggal:** 2026-10-28 · **Pengirim:** Eksekutor
- **Objek:** `AUDITOR_PACKAGE/08_REGISTER_KLAIM_DAN_RUJUKAN.md` dan klaim angka di `AUDITOR_PACKAGE/03_BASIS_PENGETAHUAN.md`
- **Item registri terkait:** semua yang bergantung pada AKG, antropometri, keamanan pangan (A03, A04, A15, A18, A19, B01–B05, D06)
- **Prioritas:** tinggi (blokir M0); tanpa tekanan waktu

## 1. Tujuan
Memverifikasi **secara independen** setiap klaim ilmiah dan regulasi eksekutor terhadap sumber primer, dan menetapkan status per ID.

## 2. Instruksi khusus (penting)
1. **Fase buta dahulu.** Turunkan sendiri nilai/ambang dari sumber primer untuk C-001…C-098. **Jangan membuka** `docs/verifikasi_eksekutor/HASIL_VERIFIKASI.md` sampai laporan fase buta Anda tersimpan di `audit/evidence/`.
2. Setelah itu bandingkan dengan hasil eksekutor, dan laporkan **setiap selisih**, termasuk bila eksekutor benar.
3. Baca ulang sendiri seluruh **tabel AKG** (Lampiran I PMK 28/2019 hlm. 6–14 pada Berita Negara 2019 No. 956; PDF berupa gambar) — eksekutor membacanya secara visual dan mungkin salah.
4. Cari sumber primer untuk yang belum terbaca eksekutor (daftar di HASIL_VERIFIKASI §5).

## 3. Cara menjalankan
Tidak ada kode. Sumber: peraturan.go.id (Berita Negara), jdih.kemkes.go.id, who.int/iris.who.int, who.int/data/gho, nap.edu, USDA FDC, Open Food Facts, W3C, PubMed.

## 4. Kriteria penerimaan
- [ ] Setiap ID di register punya status baru dan bukti (URL, halaman, tabel)
- [ ] Setiap kesalahan eksekutor tercatat sebagai temuan dengan tingkat keparahan
- [ ] Daftar klaim yang harus **dicabut** dari rancangan jika tidak dapat diverifikasi
- [ ] Rekomendasi sumber pengganti untuk klaim yang gagal

## 5. Klaim yang dibuat eksekutor
Lihat register; ringkasan status ada di HASIL_VERIFIKASI (baca setelah fase buta).

## 6. Hal yang paling saya cemaskan
- Salah baca angka AKG dari gambar (khususnya baris hamil/menyusui dan satuan).
- Ambang BIV dan penyesuaian ±3 SD untuk standar 0–5 tahun (hanya dari sumber turunan/dokumen 2007).
- Pernyataan catatan kaki AKG "75% besi dari sumber heme" yang tampak janggal.
- Angka TTD (folat 0,25 vs 0,4 mg) dan LiLA dari sumber sekunder.
- Rujukan keamanan pangan dari NHS/CDC (bukan Indonesia).

## 7. Asumsi dan keterbatasan
Lihat `09_PENGUNGKAPAN_EKSEKUTOR.md` dan HASIL_VERIFIKASI §1.

## 8. Yang tidak berubah
Paket auditor v1.0 tidak diubah selain pointer ke berkas hasil verifikasi.

## 9. Permintaan khusus
Tandai juga sumber Indonesia yang menggantikan sumber asing untuk aturan keamanan pangan (Kemenkes, IDAI, PERSAGI, Buku KIA).
