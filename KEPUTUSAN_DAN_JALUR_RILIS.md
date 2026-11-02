# Keputusan Pemilik dan Jalur Rilis — v4 (2026-11-02; **v4 mengalahkan v3 bila berbeda**; v3 mengalahkan v2)

## 00. Keputusan v4 (2026-11-02): rencana 5 hari V-PJBL, disetujui pemilik

**Kata pemilik (dikutip, ringkas):** menyetujui seluruh rancangan blueprint 5 hari; menambahkan kembali asisten AI dengan peringatan "hasil ini dibuat AI, periksa kembali"; AI hanya menerjemahkan dan menjelaskan hasil mesin deterministik kepada ibu; boleh tidak sepenuhnya offline; menambah fitur daftar belanja; Rona dipakai sebagai cangkang antarmuka.

| ID | Keputusan | Menggantikan |
|---|---|---|
| K-08 | **Penjelas AI opsional** kembali ada. AI hanya menjelaskan/menerjemahkan hasil mesin dalam bahasa sederhana; **tidak pernah memutuskan angka atau keselamatan**. Peringatan "dibuat oleh AI" selalu tampak. Masukan ke AI = ringkasan berkode tertutup (layar, pita usia, kode status, persen AKG bulat, kode celah, kode menu, versi). Keluaran divalidasi (angka asing, kata terlarang, tautan, panjang) dan jatuh ke templat deterministik bila gagal. **Tidak pernah tampil di layar Rujukan.** Akses lewat satu Worker proksi (kunci di server, daftar putih muatan, batas laju, tanpa log isi, sakelar `FITUR_AI`, batas 10 detik) | T-09 ("AI mati") |
| K-09 | **Boleh daring.** Inti (hitung status, pola makan, rujukan) tetap berjalan tanpa jaringan lewat cache; hanya penjelas AI yang butuh jaringan | prinsip "offline-first" ketat |
| K-10 | **Gerbang audit manusia diganti**: uji golden, pemeriksaan silang oleh AI lain (`docs/periksa/`), dan label "belum diverifikasi dosen" pada angka yang belum diverifikasi manusia. Pemeriksaan visual PDF Permenkes dicatat per tabel di `docs/verifikasi_eksekutor/` | gerbang vonis auditor per tahap (§7), untuk V-PJBL saja |
| K-11 | **Daftar belanja** dari pola makan yang dipilih (bahan, takaran rumah tangga, kelas harga kasar), berlabel "contoh" | — |
| K-12 | **Rona dipakai sebagai cangkang UI**; logika dan preset keras di dalamnya diganti seluruhnya oleh `src/engine/`. Teks klaim "100% tanpa kirim data" dan "Local Storage" wajib diganti dengan pernyataan privasi jujur (lihat K-08: ringkasan berkode dikirim lewat proksi ke penyedia AI; tanpa akun, tanpa basis data developer, tidak ada yang disimpan) | — |
| K-13 | **Blok fisika/pameran Rona dikeluarkan dari bundel produk** (`rona-physics`, `rona-exhibition`) (diusulkan eksekutor; berlaku kecuali pemilik membatalkan) | — |
| D-1 | **Diputuskan eksekutor (2026-11-02, atas perintah pemilik "buatkan keputusan terbaik"):** build publik/`demo` hanya preset; input angka bebas hanya pada profil `lapangan` yang terkunci | — |

### Keputusan eksekutor 2026-11-02 (mandat pemilik: keputusan paling menguntungkan yang tetap aman, tanpa kekhawatiran berlebih)
| ID | Keputusan | Alasan singkat |
|---|---|---|
| D-6 | Panjang untuk BB/PB dibulatkan ke 0,5 cm terdekat, setengah naik. Dicatat sebagai asumsi tingkat D (`KL-ASUMSI-PEMBULATAN-PANJANG`), berlabel; selisih paling banyak satu baris tabel | Tabel hanya per 0,5 cm; tanpa aturan ini mesin menolak input yang wajar |
| D-lisensi | Data tabel SD bersumber utama Permenkes 2/2020 (peraturan publik, tingkat A). Tabel WHO dipakai sebagai alat pemeriksa saja; mesin tidak mendistribusikan berkas WHO/pygrowup. Klaim tetap mencatat kedua sumber | Menghindari masalah redistribusi tanpa menurunkan mutu |
| D-AI | Penyedia AI: Claude Haiku 5.5 lewat Worker proksi Cloudflare, kunci milik pemilik disimpan sebagai rahasia Worker; fitur dimatikan lewat `FITUR_AI` bila ada masalah | Murah, cepat, cukup untuk penjelasan sederhana |
| D-OR | Rute panggilan AI lewat OpenRouter (kunci milik pemilik), model `anthropic/claude-haiku-5.5` (diatur variabel `AI_MODEL`, tanpa ubah kode). Setiap permintaan membawa `provider.data_collection=deny`. Worker bebas-penyedia: mengganti rute ke API Anthropic langsung hanya mengubah satu URL dan satu kunci. Pernyataan privasi wajib menyebut perantara (Cloudflare, OpenRouter, penyedia model) | Kunci OpenRouter sudah dimiliki pemilik; D-AI tetap berlaku untuk modelnya |
| D-hosting | Cloudflare Pages (gratis) untuk situs; domain bawaan `*.pages.dev` | Tanpa biaya, tanpa server sendiri |
| D-kader | Umpan balik kader hanya dengan kasus sintetis dan tanpa identitas; izin pembimbing diminta secara informal, tidak memblokir pembangunan | Risiko rendah, tetap sopan pada pembimbing |
| D-kelas-harga | Kelas harga bahan: murah/sedang/mahal berdasar asumsi kasar, berlabel "perkiraan" | Cukup untuk daftar belanja contoh |
| D-berat | Daftar kondisi "berat" untuk rujukan memakai tanda bahaya yang sudah ada di registri; tanda tangan dosen diperlukan hanya sebelum `lapangan` | Sesuai jalur rilis v3 |

Catatan: profil `demo`/`lapangan`, aturan `otorisasi.ts`, dan seluruh isi §0–§9 di bawah tetap berlaku kecuali tertimpa tabel di atas. Pernyataan privasi tidak boleh mengatakan "tidak ada data keluar" selama K-08 aktif.

## 0. Keputusan v3 (2026-10-28)

**Kata pemilik (dikutip):** "tentukan keputusan untuk saya tanpa mengurangi kualitas dan cakupan kebermanfaatan aplikasi yang akan kita buat, pakai opsi b, etik akan diurus dengan dosen nanti, sekarang kita kerjakan saja aplikasinya dulu".

**Keputusan eksekutor yang menerjemahkannya (menunggu audit REQ-0006 untuk bagian M0):**

1. **Cakupan penuh dipertahankan.** Tidak ada fitur yang dihapus dari registri. Tag fase hanya mengatur *urutan* pembangunan demi keselamatan, bukan pengurangan manfaat.
2. **Opsi B menjadi arsitektur produk:** aplikasi dibangun **mampu menangani data nyata** (penyimpanan lokal, consent, ekspor, mode kader, tindak lanjut), bukan hanya demonstrasi. Pembangunan dimulai sekarang; etik diurus bersama dosen kemudian (K-04, K-05).
3. **Dua profil build dari satu basis kode:**
   - **`demo`** (aman secara bawaan; satu-satunya yang dapat dibuka publik/ditunjukkan): hanya preset kasus tetap, tanpa teks bebas, tanpa ekspor, tanpa riwayat, label di setiap keluaran.
   - **`lapangan`** (data nyata, fitur penuh): **terkunci secara teknis** sampai berkas otorisasi lokal berisi: `dasar_izin` (nomor/tanggal surat persetujuan etik atau surat pembebasan/izin resmi dari pembimbing/institusi), `penandatangan_tanda_bahaya` (dosen yang menandatangani B11), `keputusan_status_alat`, dan `versi_aturan`. Tanpa itu build `lapangan` menolak menerima data nyata. **Aplikasi tidak menyediakan jalan pintas.** Origin/domain berbeda per profil (AUD-0005-05).
4. **Hari H PjBL:** memakai `demo` kecuali pemilik sudah memiliki surat izin/pembebasan dari institusi yang dapat dimasukkan sebagai `dasar_izin`. Memakai data nyata di luar itu adalah keputusan dan tanggung jawab pemilik; eksekutor tidak akan membuat alat untuk menghindari kunci, dan penggunaan seperti itu harus dicatat pemilik sebagai penerimaan risiko S0 di `audit/LEDGER.md`.
5. **Urutan diubah:** F01–F04 (consent, pra/pasca, SUS, waktu tugas) dan B07 dimajukan dari M5 ke **M2** supaya hasil kegunaan bisa diukur (AUD-0005-10).
6. **Definisi "rilis" (B11):** setiap keluaran yang sampai ke pengasuh nyata di luar peragaan terdampingi dengan preset. Profil `lapangan` baru boleh dibuka setelah B11 ditandatangani dosen.
7. **J13 (nilai harapan kasus baku):** untuk `demo` bersumber tabel resmi Permenkes + hitung tangan, disetujui pembimbing, berlabel; tanda tangan dosen wajib sebelum otorisasi `lapangan`.
8. **M0 dikerjakan sekarang** sebagai fondasi tanpa fitur (syarat 2–7 RPT-0005 menjadi hasil M0; syarat 1 dipenuhi dengan kutipan pemilik di atas).



Versi 1 (pagi 2026-10-28) ditolak auditor sebagai dasar M0 (RPT-0004: 4 S0, 4 S1, 4 S2). Versi 2 ini menjawab setiap syarat LAYAK BERSYARAT (1–8). Statusnya **menunggu audit REQ-0005**; **M0 belum dimulai.**

## 1. Keputusan pemilik (diringkas oleh eksekutor; pemilik diminta menulis ulang dengan kalimat sendiri, lihat §9)

| # | Keputusan |
|---|---|
| K-01 | Menyetujui saran eksekutor dan menyerahkan **keputusan terbaik** kepada eksekutor |
| K-02 | Auditor tetap di **Claude Desktop** |
| K-03 | Lanjut ke tahap berikut **hanya bila audit lulus** |
| K-04 | **Etik** diurus setelah aplikasi siap dan lulus PjBL (agenda PjBL berbeda dari kompetisi) |
| K-05 | **Dosen verifikator** memverifikasi setelah PjBL selesai |
| K-06 | **TKPI** diurus saat kompetisi |
| K-07 | Usaha maksimal |

## 2. Keputusan eksekutor yang menghilangkan S0, bukan menerimanya (Opsi A)

Auditor menunjukkan bahwa mitigasi prosedural v1 tidak dapat diverifikasi dan bertentangan dengan rancangan (mis. Audit Pack per orang). Karena pemilik menunda etik dan verifikasi dosen, cara paling aman adalah **mendesain agar S0 tidak ada**:

> **V-PJBL tidak memproses data anak atau ibu yang nyata sama sekali, termasuk pada hari H.** Semua masukan adalah profil sintetis (kasus peraga). Karena itu tidak ada keluaran menu atau tanda bahaya yang sampai ke pengasuh nyata sebagai nasihat, dan tidak ada data pribadi yang perlu dilindungi atau dikecualikan dari etik.

Konsekuensi untuk hari H (perlu diketahui pemilik):
- **Peragaan:** kasus sintetis (mis. "anak 9 bulan, ASI, tidak alergi") dipakai bersama kader dan ibu untuk edukasi dan demonstrasi.
- **Pengukuran anak sungguhan di posyandu** tetap dilakukan petugas dengan alat dan Buku KIA seperti biasa, **tanpa dimasukkan ke aplikasi**.
- **Hasil yang dapat dipresentasikan** berupa: kegunaan (waktu menyelesaikan kasus sintetis, kesalahan, SUS) dan pemahaman kader/ibu atas edukasi, **anonim dan tanpa pengenal**. Pertanyaan terbuka: apakah pengumpulan umpan balik kader ini membutuhkan persetujuan pembimbing (§9).
- **Opsi B** (data nyata di aplikasi pada hari H) **tidak diizinkan** sebelum persetujuan etik, persetujuan orang tua, daftar tanda bahaya bertanda dosen, dan keputusan status alat kesehatan; itu adalah V-KOMPETISI.

## 3. Dua jalur rilis

| Aspek | **V-PJBL** | **V-KOMPETISI** |
|---|---|---|
| Tujuan | Demonstrasi dan edukasi untuk ujian PjBL | Produk yang dapat dipertahankan secara ilmiah |
| Data | **Hanya profil sintetis**; aplikasi menolak masukan yang tampak seperti identitas dan menolak ekspor bila profil tidak bertanda sintetis | Data nyata sesuai etik dan UU PDP |
| Label | **Setiap layar keluaran menu/tanda bahaya** menampilkan "Prototipe PjBL — belum diverifikasi dosen; bukan pengganti petugas kesehatan", juga pada tangkapan layar/cetak (tertanam di gambar, bukan hanya di Tentang) | Label disesuaikan setelah verifikasi |
| Verifikasi dosen | Setelah PjBL (K-05) | **Wajib sebelum rilis** (AKG, aturan keamanan, tanda bahaya B11, data bahan) |
| Etik | Tidak diperlukan karena tidak ada data nyata (desain); izin kegiatan PjBL oleh pemilik | Wajib |
| Data pangan | ~30 bahan, label sumber per nilai, tidak didistribusikan publik | Lisensi diselesaikan (K-06) |
| AI | Mati | Opsional setelah A-AI |
| Audit Pack/ekspor | Profil sintetis saja; tanpa masukan per orang nyata | Sesuai etik |
| Mesin sumber | Locator halaman/tabel + SHA-256 | Pertimbangkan bbox/PDF.js |

## 4. Jawaban atas 8 syarat LAYAK BERSYARAT (RPT-0004)

| Syarat | Tanggapan | Bukti yang akan diserahkan |
|---|---|---|
| 1. Tanpa data nyata, termasuk hari H; F08 naik ke P0 | Diterima (Opsi A). B10 ditulis ulang; F08 `[M1a]` | Teks B10/F08; uji: mode demo menolak nama/tanggal lahir |
| 2. Label di setiap keluaran, bukan hanya Tentang | Diterima; label tertanam di tampilan dan ekspor gambar/cetak | Uji templat keluaran memuat label (`output_label`) |
| 3. Audit Pack tanpa masukan per orang | Diterima; D10 dibatasi ke profil sintetis; ekspor ditolak bila tidak bertanda sintetis | Uji `export_no_person` |
| 4. Tidak ada menu anak tanpa penilaian status gizi | Diterima, **pilihan (a)**: A04 minimal masuk M1a (BB/U, PB/U, BB/PB, tabel resmi Permenkes 2/2020, 6–23 bulan). Fallback (b): menu dinonaktifkan sampai A04 siap | Uji ambang tabel; uji "status buruk → rujukan, tanpa menu" |
| 5. B01/B03 bersumber primer Indonesia atau berlabel | Diterima; sampai primer terbaca, **setiap keluaran terkait diberi label "belum diverifikasi"** dan sumber sekunder dilabeli (C-090, C-092, C-097). Primer yang diusahakan: Buku KIA 2024, pedoman Kemenkes/IDAI (butuh berkas dari pemilik, §9) | Daftar aturan dengan kolom sumber dan status |
| 6. Dependensi M1 diperbaiki; status fase per ID | Diterima; setiap ID registri kini bertag `[M1a]/[M1b]/[M2]/[M3]/[M3+]/[M4]/[M5]/[Tunda]`; A07 disinkronkan | Registri |
| 7. Penerimaan risiko ditulis pemilik | **Tidak diperlukan untuk S0** karena S0 dihilangkan oleh desain (Opsi A); risiko residual dicatat di LEDGER dan pemilik diminta mengonfirmasi kalimatnya (§9) | Entri LEDGER |
| 8. Gerbang tidak melemah | Diterima: dosen, etik, dan lisensi tetap wajib untuk **V-KOMPETISI/data nyata/keluaran ke pengasuh nyata**. Gerbang V-PJBL (auditor + sumber primer + label) hanya berlaku karena **tidak ada keluaran ke pengasuh nyata** | §7 |

## 5. Ruang lingkup M1 (revisi)

M1 dibagi dua agar risiko terpisah:
- **M1a — inti mesin, data, keselamatan (tanpa UI):** A02, A03, A04, A06, A07, A08, A11, A12, A13, A14, A18, A19, B01, B02, B03, B08, B10, B11, B12, B13, B14, D01, D02, D10, E04, F08, J02, J07, J12, J13, K06 (**31**).
- **M1b — antarmuka, PWA, aksesibilitas, desain:** A01, B06, G01, G02, G03, G05, G08, G09, G13, H01, H02, H03, H05, H09, H10, H11, H12, J01, J04, J05, J09, K14 (22 fungsional) + L01, L02, L03, L04, L05, L08, L11, L12 (8 desain) (**30**).
- Total M1 = **61** ID (53 fungsional + 8 desain), karena sebagian ID yang semula ditunda ternyata menjadi dependensi (A04, B08, F08, G05, G08, G09, H05, J04, J05, K06, K14).
- **Ditunda dari M1:** B07 (persetujuan, M5), J10 dan G15 (mode kader, M2), seluruh K lain, radar faltering, tindak lanjut, C-series, F-series (M5), E-series kecuali E04, I-series, bbox/PDF.js, LP, skor A10.

**Spesifikasi masukan M1 (menjawab AUD-0004-12, I-2, I-3):**
- Mode anak 6–23 bulan. Usia = bulan penuh (Permenkes 2/2020 hlm. 12; "2 bulan 29 hari" = 2). < 6 bulan: pesan "ASI eksklusif, tanpa menu". ≥ 24 bulan: ditolak dengan pesan; tidak diproses. Uji: 5 bln 29 hr, 6 bln 0 hr, 23 bln 30 hr, 24 bln 0 hr, 24 bln 1 hr.
- Masukan A02 (anak): usia, jenis kelamin, BB, PB/TB dan posisi ukur, **status ASI (wajib)**, prematur (ya/tidak), edema bilateral (ya/tidak), kondisi/sindrom khusus (ya/tidak), usia tidak pasti (ya/tidak), alergi, anggaran. Salah satu jawaban "ya" pada kategori khusus → **tandai dan rujuk, tanpa menu** (B12).
- Desimal koma dan titik diterima ("12,5", "12.5"; "12,500" ditolak sebagai ambigu). Nilai tidak masuk akal → minta ukur ulang (BIV).
- **Kamus alias** untuk bahan terlarang/dibatasi (mis. madu: "madu hutan", "madu asli", "air madu"; gula tambahan: kecap manis, gula merah, dsb.) menjadi bagian data B01/B14 dan diuji (I-4).

## 6. Keputusan teknis (revisi)

| # | Keputusan |
|---|---|
| T-01 | Mode pertama: anak 6–23 bulan, dengan A04 minimal dan B12 |
| T-02 | Permenkes 2/2020 dirujuk sebagai **acuan resmi** (bukan "kewajiban hukum" bagi aplikasi; Pasal 3 menyebut tenaga kesehatan, pengelola program, pemangku kepentingan). Perilaku tepat 24 bulan menjadi keputusan M2 + dosen; di M1 tidak terpakai |
| T-03 | Satuan mengikuti AKG: vitamin A dalam RE; folat µg tanpa DFE |
| T-04 | % AKG ditampilkan; untuk 6–11 bulan **dipisah**: kebutuhan total AKG (termasuk ASI) vs bagian dari makanan pendamping (konsep 200/300/550 kkal, masih sekunder sampai primer WHO dibaca) |
| T-05 | Tanpa pengali bioavailabilitas |
| T-06 | Data M1 dari USDA FDC (CC0) **dengan pemetaan 30 bahan ke entri USDA, daftar bahan tanpa padanan, dan catatan perbedaan BDD/retensi**; TKPI menyusul; padanan disetujui dosen pasca-PjBL |
| T-07 | Slot + heuristik deterministik; LP ditunda |
| T-08 | Klasifikasi pakai tabel SD Permenkes 2/2020 |
| T-09 | AI mati |
| T-10 | Tanpa angka dosis TTD; teks: "tablet tambah darah sesuai anjuran bidan/dokter" |
| T-11 | Uji determinisme lintas peramban dan ukuran bundel sebelum teknologi dikunci |
| T-12 | Istilah di antarmuka: **"contoh pola makan dari aturan"**, bukan "rekomendasi menu", sampai dosen menandatangani (I-10) |
| T-13 | Pengetahuan dasar tidak berubah: "tanpa nama (kode)" diganti "**tanpa nama lengkap; tetap diperlakukan sebagai data pribadi**" |

## 7. Gerbang (revisi)

| Gerbang | V-PJBL | V-KOMPETISI |
|---|---|---|
| M0 | REQ-0005 lulus/bersyarat | sama |
| M1a/M1b | Vonis auditor; uji lulus; sumber primer terbaca atau berlabel | + dosen |
| M2 | Vonis auditor + sumber primer terbaca, label "belum diverifikasi dosen"; **tidak ada keluaran ke pengasuh nyata** | **Tanda tangan dosen** atas AKG, aturan keamanan, tanda bahaya (B11) |
| M3 | Audit data auditor (≥10% baris dicek ke sumber) | CVI dosen |
| M5 | Mitigasi diaudit | **Persetujuan etik** |
| Gerbang V (pasca-PjBL) | — | Dosen, etik, TKPI, status alat → membuka V-KOMPETISI |

## 8. Risiko residual yang dicatat
Hasil tangkapan layar dapat tersebar (label tertanam di gambar mengurangi, tidak menghilangkan); pengguna dapat salah mengira contoh sebagai nasihat (bahasa T-12 dan label); dosen belum tersedia untuk V-KOMPETISI (jadwal diatur pemilik); data USDA tidak sepadan dengan pangan lokal (T-06).

## 9. Hal yang diminta dari pemilik
1. **Tulis dengan kalimat sendiri** (cukup balas pesan): "Saya memutuskan V-PJBL hanya memakai profil sintetis; data anak nyata tidak dimasukkan ke aplikasi sebelum etik dan verifikasi dosen."
2. Apakah umpan balik kegunaan dari kader (anonim, kasus sintetis) memerlukan persetujuan pembimbing PjBL?
3. **Berkas sumber primer:** letakkan PDF resmi yang Anda punya di folder `sumber/` (Buku KIA 2024, TKPI bila ada, pedoman TTD ibu hamil, pedoman Kemenkes lain). Saya tidak dapat membuka Buku KIA 2024 otomatis (berkas > 10 MB). Mengunduh berkas data (mis. tabel WHO yang dapat diproses mesin) akan saya mintakan izin lebih dulu dengan menyebut nama, sumber, dan ukuran.
4. Tanggal hari H dan nama dosen verifikator (tidak memblokir M0).
