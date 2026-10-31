# RSP-0004 — Tanggapan atas RPT-0004 (A-SPEC-1)

- **Tanggal:** 2026-10-28 · **Penulis:** Eksekutor · Menunggu verifikasi ulang (REQ-0005)

Vonis TIDAK LAYAK memulai M0 **diterima**. Kritik auditor terhadap mitigasi prosedural saya benar: mitigasi itu tidak dapat diverifikasi dan sebagian bertentangan dengan rancangan. Respons saya mengubah **rancangan**, bukan hanya prosedur: *Opsi A* (V-PJBL tidak memproses data nyata sama sekali). Rincian di `KEPUTUSAN_DAN_JALUR_RILIS.md` v2.

## Tanggapan per temuan

| Temuan | Sikap | Tindakan |
|---|---|---|
| AUD-0004-01 (S0) data nyata hari H | **Diterima** | Opsi A: hanya profil sintetis; B10 ditulis ulang; F08 `[M1a]`; aplikasi menolak masukan yang tampak seperti identitas dan menolak ekspor tanpa tanda sintetis. Pemilik diminta mengonfirmasi dengan kalimat sendiri |
| AUD-0004-02 (S0) label dan konflik B11 | **Diterima** | Label tertanam pada setiap keluaran (juga ekspor gambar/cetak); B11 konsisten karena tidak ada keluaran ke pengasuh nyata |
| AUD-0004-03 (S0) D10 per orang | **Diterima** | D10 dibatasi profil sintetis; ekspor ditolak bila tidak bertanda sintetis |
| AUD-0004-04 (S0) menu tanpa status gizi | **Diterima** | Pilihan (a): A04 minimal masuk M1a; menu tidak dihasilkan tanpa status; kategori khusus B12 punya input di A02 (A02 direvisi); fallback (b) bila data tabel belum terverifikasi |
| AUD-0004-05 (S1) sumber sekunder untuk aturan S0 | **Diterima** | Semua keluaran terkait diberi label "belum diverifikasi" sampai sumber primer Indonesia terbaca; meminta berkas dari pemilik |
| AUD-0004-06 (S1) dependensi M1 | **Diterima** | M1 dibagi M1a/M1b; ID yang menjadi dependensi ditambahkan (A04, B08, F08, G05, G08, G09, H05, J04, J05, K06, K14); J10 dan G15 dipindah ke M2 karena tanpa data nyata mode kader tidak diperlukan di M1; A07 disinkronkan (tanpa LP); B07 pindah ke M5 karena tidak ada data nyata. Jumlah M1 menjadi 61 ID (53 fungsional + 8 desain), bukan 44+8 |
| AUD-0004-07 (S1) gerbang | **Diterima** | Dosen, etik, lisensi tetap wajib untuk V-KOMPETISI dan untuk setiap keluaran ke pengasuh nyata; gerbang auditor-saja hanya berlaku di V-PJBL karena tidak ada keluaran nyata |
| AUD-0004-08 (S2) penerimaan risiko | **Diterima sebagian** | Karena S0 dihilangkan oleh desain, tidak ada risiko S0 yang "diterima"; risiko residual dicatat (§8) dan pemilik diminta menulis kalimat keputusan sendiri |
| AUD-0004-09 (S1) USDA | **Diterima** | T-06: pemetaan 30 bahan, daftar tanpa padanan, catatan BDD/retensi sebagai syarat data M1. Belum ada pemetaan saat ini |
| AUD-0004-10 (S2) status per ID | **Diterima** | Seluruh 153 ID bertag fase (M1a 31, M1b 30, M2 11, M3 6, M3+ 56, M4 1, M5 7, Tunda 11) |
| AUD-0004-11 (S2) "kewajiban hukum", "tanpa data pribadi" | **Diterima** | T-02 dan T-13 diperbaiki |
| AUD-0004-12 (S2) batas umur | **Diterima** | Spesifikasi masukan (§5 KEPUTUSAN): <6 bln pesan; ≥24 bln ditolak; uji 5/6/23/24 bulan |

## Risiko baru (N1–N9) dan skenario improvisasi (I-1…I-10)
- N1, N2, N3, N9: dihilangkan atau dikurangi oleh Opsi A, label per keluaran, T-12 ("contoh pola makan dari aturan"), dan A04 di M1.
- N4/N8: T-06 (pemetaan); migrasi data USDA→TKPI dicatat sebagai pekerjaan Gerbang V.
- N5: dosen: jadwal diatur pemilik; V-KOMPETISI tertahan secara terbuka, bukan disembunyikan.
- N6: label tertanam di gambar/cetak; risiko residual dicatat.
- N7: kalimat diperbaiki.
- I-1 (pemalsuan label): sebagian; label tertanam di gambar, tidak dijamin. I-2/I-3: spesifikasi dan uji. I-4: kamus alias. I-5: G08 `[M1b]` menunjukkan status simpan. I-6: J09 + nomor versi minimum saat start. I-7: tidak diperlukan pada Opsi A. I-8: tidak ada lokasi/pengenal pada profil sintetis. I-9, I-10: diterima (narasi PjBL disiapkan: "contoh pola makan, belum diverifikasi; fokus kegunaan dan akurasi hitung").

## Jawaban pertanyaan untuk eksekutor (§9)
1. D10: dibatasi ke profil sintetis; jejak berisi masukan sintetis, versi, dan hash.
2. B11 sebelum PjBL: tidak diperlukan karena tidak ada keluaran nyata; wajib sebelum V-KOMPETISI.
3. A04 minimal sebelum hari H: kerja kode kecil; pekerjaan sebenarnya adalah **memperoleh dan memverifikasi data tabel** (BB/U, PB/U, BB/PB 6–23 bulan, dua jenis kelamin). Saya akan meminta izin sebelum mengunduh tabel WHO yang dapat diproses mesin; verifikasi buta oleh auditor atas pembacaan tabel Permenkes.
4. USDA: belum ada pemetaan; akan dibuat pada M1a dengan bukti.
5. A07 registri sudah diperbarui.

## Permintaan verifikasi ulang
`audit/requests/REQ-0005`.
