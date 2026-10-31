# RPT-0005 — A-SPEC-2: Verifikasi keputusan v2 (Opsi A) dan kelayakan memulai M0

- **Menjawab:** REQ-0005-A-SPEC-2-verifikasi-keputusan-v2 · **Jenis:** A-SPEC-2
- **Auditor:** Auditor independen · **Tanggal:** 2026-10-28
- **Objek:** `KEPUTUSAN_DAN_JALUR_RILIS.md` v2; `REGISTRI_FITUR_NUTRIVA.md` (153 ID bertag); `03_BASIS_PENGETAHUAN.md`; `RSP-0003`, `RSP-0004`
- **Bukti:** `audit/evidence/EVD-0005-hasil-antara-REQ-0005.md`

## 1. Ringkasan (≤10 baris)

- **VONIS M0 (fondasi tanpa fitur, V-PJBL): LAYAK BERSYARAT.** Syarat di §10.
- Opsi A menghilangkan S0 **terbesar** RPT-0004 (data nyata hari H). Tetapi Opsi A hanya mengganti data nyata dengan **kepercayaan pada label "sintetis"**. Celah ini tercatat: 12 skenario, 4 S0/S1 kritis (AUD-0005-01, -02, -04, -06).
- Tag registri konsisten: 153 ID, 61 M1 (31+30), tag sama persis dengan daftar KEPUTUSAN v2.
- **Belum layak M1a:** kontrak sumber primer (B03, B01, A19), dependensi A12/A19, dan gerbang J13 (dosen) belum selesai. Ini tidak menghambat M0.
- Hari H tidak dapat memenuhi janji hasil (SUS, waktu tugas) karena F03/F04 ditag M5 (AUD-0005-10).
- Penutupan temuan: AUD-0003-01 ditutup; AUD-0003-03 ditutup dengan catatan; AUD-0003-07 ditutup (judul terverifikasi); AUD-0003-02 **tetap S1 terbuka** (tidak menghambat M0 selama karantina teknis).
- Dua hal harus ada sebelum M0 dimulai: keputusan Opsi A **dengan kalimat pemilik sendiri**, dan karantina TTD di verifikator build (lihat §10).

## 2. Pertanyaan 1 — Celah Opsi A (minimal 8 skenario; 3 buatan auditor [S]; ≥30% usaha)

Usaha kira-kira 45% dari analisis ini dihabiskan untuk skenario [S] dan penelusuran lintas-berkas (registri, `KEPUTUSAN`, `03_`). Skenario ditulis sebagai kasus nyata yang bisa terjadi di lapangan.

| Kode | Skenario | Keparahan | Perbaikan yang diusulkan |
|---|---|---|---|
| S-1 | Kader mengetik angka anak nyata pada profil "sintetis" (mis. "anak 9 bln, BB 6,8 kg") karena profil bebas-edit. Tidak ada pembeda teknis selain label pengguna | **S0** | Profil V-PJBL hanya **preset tetap** (3–5 kasus contoh, nilai dikunci); tidak ada angka bebas di build V-PJBL. Keluaran diberi label "CONTOH — bukan untuk anak ini" |
| S-2 | Pengasuh membuka tautan V-PJBL dari grup WhatsApp dan memasukkan data anaknya sendiri | **S0** | Build V-PJBL tanpa input bebas (sama dengan S-1); tautan V-PJBL tidak dipublikasikan; kader tetap mendampingi |
| S-3 | Teks bebas (alergi, catatan, anggaran dengan keterangan) memuat nama anak: "alergi: Budi" | **S1** | Di M1 tidak ada teks bebas (pilihan tertutup: daftar alergen, angka). Uji: input teks ditolak di build V-PJBL |
| S-4 | Pengguna menyalakan "sintetis" pada profil nyata untuk membuka ekspor (B10 hanya bergantung pada tanda pengguna) | **S1** | Ekspor dimatikan total di V-PJBL (bukan dinyalakan per profil). Ekspor hanya gambar/cetak dengan label |
| S-5 | Build V-PJBL dan V-KOMPETISI pada origin (domain) yang sama: IndexedDB V-KOMPETISI (berisi data nyata setelah etik) terbawa ke V-PJBL | **S1** | Origin berbeda per build, atau migrasi/hapus data saat ganti build (uji). Dicatat sebagai ADR |
| S-6 | Keadaan menu dimasukkan ke URL (fitur bagikan tautan) sehingga angka nyata tercatat di log host atau riwayat peramban bersama | **S1** | Tidak ada keadaan masukan di URL (uji: URL tidak berubah dengan input). Log host dinonaktifkan atau tanpa query string |
| S-7 | Tangkapan layar menu bertanda "contoh" tetapi angkanya persis anak nyata; orang lain mengikuti angka itu untuk anaknya | **S0** (residual) | Label tertanam pada gambar (sudah ada di KEPUTUSAN §3). Kontrol residual: contoh tidak boleh menyerupai pola usia-berat tertentu; pemilih preset tidak mengisi angka anak nyata. Residual dicatat |
| S-8 | Masukan dicatat di kertas saat posyandu lalu diketik di rumah | **S1** (perilaku, tidak dapat dicegah teknis) | Dinyatakan sebagai risiko residual. Mitigasi: kader menandatangani pernyataan tidak memasukkan data nyata (tidak teknis). Peragaan memakai preset saja |
| S-9 **[S]** | Repositori: fixture uji dan contoh dokumentasi memuat angka dari Buku KIA atau catatan posyandu yang disalin untuk "cek hasil" | **S0** (proses) | Aturan M0: fixture dan contoh wajib sintetis; lint menolak angka yang cocok dengan daftar contoh nyata (uji pemeriksa); tinjauan kode oleh auditor pada M0 |
| S-10 **[S]** | Kuesioner umpan balik kader/ibu (mis. formulir daring) meminta usia dan berat anak untuk "konteks" | **S1** | Formulir umpan balik tanpa pertanyaan tentang anak; persetujuan pembimbing (KEPUTUSAN §9-2) sebelum dipakai |
| S-11 **[S]** | Autosave dan riwayat draf menyimpan preset atau masukan terakhir di perangkat bersama kader; ibu berikutnya melihat sisa masukan | **S2** | Hapus draf saat sesi selesai; tidak ada riwayat di build V-PJBL (uji) |
| S-12 **[S]** | Hasil ekspor "contoh" (PDF/gambar) dikumpulkan dan dibandingkan lintas keluarga untuk membuat pola usia-berat; kuasi-identifikasi | **S2** | Tidak ada ekspor per profil di V-PJBL (sejalan S-4). Ekspor agregat hanya untuk preset |

**Kesimpulan Pertanyaan 1:** Opsi A menghilangkan risiko data-tersimpan-di-server, tetapi tidak menghilangkan risiko data nyata yang masuk melalui pengguna (S-1, S-2, S-7, S-8). Opsi A **tidak** setara dengan "tanpa data nyata" kecuali build V-PJBL dibatasi pada preset tetap dan tanpa input bebas. Dengan itu, S0 utama menjadi S0 residual yang perlu dicatat sebagai risiko residual.

## 3. Pertanyaan 2 — Rencana hari H (§2) dan klaim

**Yang jujur dan masuk akal:** peragaan dengan kasus sintetis; pengukuran anak sungguhan tetap oleh petugas dengan alat dan Buku KIA; aplikasi tidak dipakai untuk data nyata.

**Klaim atau harapan yang tidak dapat dipenuhi:**
- **"Hasil kegunaan: waktu menyelesaikan kasus, kesalahan, SUS"** — F03 (SUS), F04 (waktu dan kesalahan) ditag **M5** (ditunda). Di V-PJBL hasil ini tidak dapat diukur tanpa mengubah tag. (AUD-0005-10)
- **"Pemahaman kader/ibu atas edukasi"** — tidak ada instrumen pra/pasca yang tervalidasi (F02 M5, dan instrumen belum dinilai, C-051/C-050 BELUM). Pengukuran pemahaman tanpa instrumen valid bukan hasil yang dapat dipresentasikan sebagai bukti. Ini harus diturunkan menjadi "pengamatan kualitatif" dan dinyatakan sebagai itu.
- **Umpan balik kader/ibu** adalah pengumpulan data tentang manusia. Meskipun anonim, ini membutuhkan persetujuan pembimbing (sudah diajukan pemilik sebagai pertanyaan terbuka) dan persetujuan informasi (B07, M5). Selama B07 ditag M5, pengumpulan ini tidak memiliki dasar persetujuan dalam rancangan. (AUD-0005-10)

**Risiko baru dari umpan balik:** formulir umpan balik dapat menanyakan identitas anak (S-10). Dapat dicegah dengan formulir bertanda dan tanpa pertanyaan tentang anak.

## 4. Pertanyaan 3 — Delapan syarat RPT-0004 (tabel)

| Syarat | Status | Bukti yang masih harus diserahkan |
|---|---|---|
| 1. Tanpa data nyata; F08 naik ke P0 | **SEBAGIAN** | F08 kini M1a, P0 ✓. Desain Opsi A ✓. Belum ada uji `demo_no_identity` (menolak nama/tanggal lahir). Lihat S-1, S-3 (teks bebas) |
| 2. Label di setiap keluaran | **SEBAGIAN** | Desain: label tertanam di tampilan dan gambar ✓. Belum ada uji templat (`output_label`). Tangkapan layar tidak dapat dikontrol (S-7) |
| 3. Audit Pack tanpa masukan per orang | **SEBAGIAN** | D10 V-PJBL: profil sintetis; "ekspor ditolak bila tidak bertanda sintetis" — penanda dari pengguna (S-4). Uji `export_no_person` belum ada |
| 4. Tidak ada menu anak tanpa status gizi | **SEBAGIAN** | A04 minimal ditag M1a dan rujukan wajib; tabel SD Permenkes terbaca (RPT-0003 §5d; tabel Tabel 1–5 belum diuji ambangnya). Uji "status buruk → rujukan, tanpa menu" belum ada |
| 5. B01/B03 primer atau label | **BELUM** | Label "belum diverifikasi" ada pada rancangan, tetapi belum ada daftar aturan dengan kolom sumber dan status. Berkas primer (Buku KIA 2024, pedoman IDAI/Kemenkes) belum diterima |
| 6. Dependensi dan status fase per ID | **SEBAGIAN** | Tag 153 ✓; A07 disinkronkan ✓. Dependensi A12 (harga, I01/I02 M3+) dan A19 (MMF) belum dibereskan (AUD-0005-14) |
| 7. Penerimaan risiko ditulis pemilik | **BELUM** | Pemilik diminta menulis kalimat sendiri (KEPUTUSAN §9-1). Entri LEDGER belum ada |
| 8. Gerbang tidak melemah | **SEBAGIAN** | §7 membedakan V-PJBL dan V-KOMPETISI ✓. "Tidak ada keluaran ke pengasuh nyata" sebagai prasyarat M2 V-PJBL hanya berlaku bila Opsi A terbukti (S-1..S-2) |

## 5. Pertanyaan 4 — Dependensi M1 dan hitungan tag

- **Hitungan:** M1a 31 + M1b 30 = 61 (53 fungsional + 8 desain). Tag fase M1a 31, M1b 30, M2 11, M3 6, M3+ 56, M4 1, M5 7, Tunda 11 = 153 ✓. Teks KEPUTUSAN §5 cocok dengan tag. Tidak ada ID dalam dua fase.
- **Konsistensi teks baris yang diedit:** A01, A02, A04, A07, B10, D10, K14 konsisten dengan KEPUTUSAN v2. Catatan: A02 (M1a) masih memuat bagian M2 (trimester, LiLA) dalam baris yang sama (AUD-0005-13).
- **Ketergantungan yang masih hilang atau bertentangan** (lihat EVD-0005 §3):
  1. **A12** — harga dan ketersediaan dari I01/I02 (M3+).
  2. **A19** — frekuensi makan dari klaim MMF (C-027 BELUM).
  3. **J13** — nilai harapan disetujui dosen, sedangkan K-05 dosen memverifikasi setelah PjBL. Konflik waktu (AUD-0005-12).
  4. **B11** — "tidak dirilis ke pengguna tanpa tanda tangan dosen"; peragaan kasus sintetis kepada ibu/kader perlu didefinisikan: apakah termasuk rilis (AUD-0005-12).
  5. **F03, F04, B07** — ditag M5 tetapi dibutuhkan untuk hasil dan umpan balik hari H (AUD-0005-10).
  6. **H11** — J05 (P1) ditag M1b tanpa ambang terukur (AUD-0005-13).
  7. **H12** — C-077 (IndexedDB pada HP rendah) belum diverifikasi (uji prototipe).
  8. **A06** — data M1a belum ada (T-06 belum dipetakan; AUD-0004-09).
  9. **B03, B01, B02** — sumber primer belum diterima (ditandai di syarat 5).
  10. **A03** — teks memuat AKG hamil/menyusui (M2) walau dalam M1a; build M1 harus membatasi ke anak (AUD-0005-13).

## 6. Pertanyaan 5 — Keselamatan anak M1 pada profil sintetis

**Cukup (dengan syarat):** A02 baru (status ASI wajib; prematur; edema; kondisi khusus; usia tidak pasti) + A04 minimal + B12 (tandai dan rujuk) + B13 (memisahkan ASI) + B01–B03 + label.

**Yang masih kurang** (ditandai sebagai AUD-0005-15):
1. **Tanda bahaya tidak sumber primer.** Menampilkan daftar tanda bahaya tidak lengkap kepada ibu (peragaan) dapat membuat ibu tidak mencari rujukan. Default aman yang diusulkan: bila ada tanda bahaya yang tidak tercantum atau ragu, tampilkan "bawa ke petugas kesehatan hari ini" (bukan menu).
2. **Ambang BIV** untuk nilai tak masuk akal belum bersumber primer (C-021 SEBAGIAN; CDC SAS sekunder). Permenkes 2/2020 tidak memuat BIV. Uji BIV harus memakai nilai yang ditandai.
3. **Gula dan garam (B01)** tanpa batas numerik bersumber (C-097 SEBAGIAN). Jangan tampilkan angka batas sebelum sumber terbaca.
4. **Pengenalan alergen (B02)** memakai pola NIAID/AS (C-092 SEBAGIAN). Belum ada pedoman Indonesia.
5. **Tekstur dan frekuensi (A19)** bergantung pada MMF yang belum terverifikasi (AUD-0005-14).
6. **Kamus alias** (madu hutan, kecap manis, gula merah): belum disusun. Tanpa itu B01 tidak tepat.
7. **Uji kasus sintetis** untuk M1 harus mencakup: 5 bln 29 hr, 6 bln 0 hr, 23 bln 30 hr, 24 bln 0 hr, prematur, edema, BB ekstrem, status buruk, alias madu, alergi tiga bahan, anggaran nol. Nilai harapannya memerlukan persetujuan dosen (J13) — konflik waktu (AUD-0005-12).

## 7. Pertanyaan 6 — T-06 (USDA) dan kriteria penerimaan M1a

**Syarat yang diusulkan RSP-0004 cukup sebagai awal, tetapi belum cukup.** Tambahkan:
1. **Satuan vitamin A:** USDA melaporkan RAE; AKG tercetak RE. Konversi RAE→RE harus bersumber. Saat ini belum (C-031 SEBAGIAN; AKG memakai RE). Tanpa ini nilai vitamin A tidak dapat dibandingkan dengan AKG.
2. **Folat:** USDA melaporkan folat dalam DFE dan/atau total µg. Pilih satu; tulis konversi bila ada.
3. **BDD dan faktor retensi** untuk bahan M1: sumber faktor retensi (USDA Table of Nutrient Retention Factors, C-036 BELUM DIVERIFIKASI) harus dibuka sebelum diklaim.
4. **Padanan:** ≥ 90% dari 30 bahan memiliki entri USDA dengan nama dan deskripsi yang dapat diaudit; daftar tanpa padanan dicantumkan (bukan diisi dengan entri terdekat tanpa catatan).
5. **Hash dan tanggal unduhan** basis USDA yang dipakai; tanggal rilis.
6. **Atribusi CC0** tetap dicantumkan sebagai sumber per nilai.
7. **Uji selisih:** untuk 5 bahan yang juga ada di TKPI (sumber lokal) — hanya bila lisensi memungkinkan penggunaan internal; bila tidak, uji selisih ditunda dan dicatat sebagai keterbatasan.
8. **Penerimaan dosen:** padanan disetujui dosen pasca-PjBL. Di V-PJBL, label "padanan belum diverifikasi" wajib pada setiap nilai.

## 8. Pertanyaan 7 — Penutupan temuan sebelumnya

| Temuan | Keputusan auditor | Alasan |
|---|---|---|
| AUD-0003-01 (Permenkes 21/2021 dicabut sebagian) | **DITUTUP** | `03_` baris 22 benar; teks Pasal 85 dibaca (EVD-0003 §5a); tidak dipakai di aturan aplikasi |
| AUD-0003-02 (TTD) | **TETAP TERBUKA (S1)** | Koreksi 0,25 mg diterima dan benar. Klaim "90 tablet selama hamil" belum terbaca dari sumber primer (ayosehat HTTP 503 saat verifikasi). Penutupan penuh menunggu pedoman ibu hamil atau Lampiran Permenkes 88/2014. **Tidak menghambat M0** karena klaim karantina (T-10: tidak ada dosis). Syarat: verifikator build menolak klaim ini bila dipakai (§10) |
| AUD-0003-03 (WHO 24 bulan) | **DITUTUP** dengan catatan | Dampak dihapus dari M1 (mode 6–23 bulan, T-02). Dicatat sebagai ADR untuk M2. Tidak ada klaim WHO di data M1 |
| AUD-0003-07 (sitasi IOM 2000) | **DITUTUP** | Judul dan penerbit terverifikasi (National Academies, DOI 10.17226/9956). `03_` menyatakan isi belum dibaca dan "kemungkinan relevan". Penggunaan metode EAR cut-point tidak diklaim di M1 |

## 9. Pertanyaan 8 — Vonis M0 (fondasi tanpa fitur) untuk V-PJBL

**VONIS: LAYAK BERSYARAT.** M0 (struktur proyek, skema data dan jejak, git, CI uji, uji kasus baku kosong, `CLAUDE.md`, ADR awal) tidak memuat fitur dan tidak memuat data nyata. Tidak ada S0 yang menyentuh isi M0. S0 terbuka pada RPT-0004 dan RPT-0005 relevan untuk M1a dan keluaran, bukan untuk M0.

Gerbang M0 pada `KEPUTUSAN` §7 mensyaratkan REQ-0003 dan REQ-0004 berstatus lulus atau bersyarat. REQ-0003 (RPT-0003) tercatat **DITOLAK** karena AUD-0003-02. REQ-0004 (RPT-0004) tercatat **TIDAK LAYAK**. Keduanya diperbarui oleh temuan di atas:
- AUD-0003-02 tetap S1, tetapi karena klaim tidak masuk M0 dan dikarantina, saya menilai **tidak menghambat M0** (lihat §8). RPT-0003 tetap DITOLAK sebagai catatan historis; LEDGER 0003 diperbarui agar mencerminkan penutupan temuan lain.
- RPT-0004 digantikan oleh vonis RPT-0005 untuk M0: Opsi A menutup syarat 1 dan 2 pada desain, tetapi belum terbukti; syarat itu menjadi syarat **M1a**, bukan M0.

## 10. Syarat LAYAK BERSYARAT untuk memulai M0

M0 boleh dimulai bila **semua** syarat berikut terpenuhi dan bukti diserahkan ke `audit/evidence/`:
1. **Keputusan pemilik dengan kalimatnya sendiri** tentang Opsi A dan ketiadaan data nyata di V-PJBL (KEPUTUSAN §9-1). Belum ada.
2. **Karantina teknis TTD:** verifikator build (fondasi, bukan fitur) menolak klaim berstatus `belum` atau `dikarantina` bila dipakai di data/aturan (RSP-0001). Bukti: uji yang gagal bila klaim karantina dipakai.
3. **Tidak ada data nyata dan tidak ada fixture dari sumber nyata**: `.gitignore` mengecualikan folder `sumber/` (berkas berhak cipta dan data pribadi); uji lint menolak angka yang cocok dengan daftar contoh nyata (S-9).
4. **Arsip V-8 tidak diimpor** dan tidak dijalankan. `NUTRIVA_V8_Source_Lengkap.zip` tidak masuk jalur build; isinya tidak diekstrak ke folder sumber.
5. **Git diinisialisasi** dengan `.gitignore` dan tidak mengandung rahasia (`.env` diabaikan).
6. **Skema tag** di registri (153 ID) dibekukan sebagai acuan; perubahan tag memerlukan entri ADR.
7. **ADR awal** mencatat: Opsi A; V-PJBL vs V-KOMPETISI; origin per build (S-5); larangan input bebas di V-PJBL (S-3); TTD karantina.

**Syarat untuk M1a (bukan M0; dicatat di sini agar jelas):** S0 AUD-0005-01, -02, -04, -06 ditutup; uji `demo_no_identity`, `output_label`, `export_no_person`, `input_boundary_age`, `alias_madu`, `version_gate` lulus; sumber primer B01/B03 diterima atau label diberikan; dependensi A12 dan A19 diputuskan; J13 disetujui sebelum PjBL atau dibuat tidak mengikat dosen untuk V-PJBL dengan label.

## 11. Temuan bernomor (REQ-0005)

| ID | Tingkat | Keyakinan | Ringkasan | Status |
|---|---|---|---|---|
| AUD-0005-01 | S0 | TERKONFIRMASI | Opsi A bergantung pada label "sintetis" pengguna; profil bebas-edit memungkinkan angka anak nyata (S-1, S-2) | Terbuka (tutup di M1a) |
| AUD-0005-02 | S0 | TERKONFIRMASI | Teks bebas dan kriteria "tampak seperti identitas" tanpa spesifikasi; nama dapat masuk (S-3) | Terbuka (M1a) |
| AUD-0005-03 | S1 | TERKONFIRMASI | Ekspor per profil dapat dinyalakan pengguna (S-4) | Terbuka (M1a) |
| AUD-0005-04 | S0 | KEMUNGKINAN | Keluaran "contoh" yang dibagikan sebagai gambar dapat diikuti untuk anak nyata (S-7); residual | Terbuka (risiko residual, dicatat) |
| AUD-0005-05 | S1 | TERKONFIRMASI | Origin bersama antara V-PJBL dan V-KOMPETISI (S-5) | Terbuka (ADR M0) |
| AUD-0005-06 | S1 | KEMUNGKINAN | Keadaan masukan di URL/log host (S-6); perilaku kertas-ke-rumah (S-8) | Terbuka (uji URL) |
| AUD-0005-07 | S0 | TERKONFIRMASI | Fixture dan contoh dari sumber nyata (S-9): proses | Terbuka (syarat M0 3) |
| AUD-0005-08 | S1 | KEMUNGKINAN | Formulir umpan balik meminta data anak (S-10) | Terbuka |
| AUD-0005-09 | S2 | KEMUNGKINAN | Autosave menyisakan masukan di perangkat bersama (S-11) | Terbuka (uji M1a) |
| AUD-0005-10 | S1 | TERKONFIRMASI | Hasil hari H (SUS, waktu tugas) ditag M5; umpan balik kader memerlukan B07 (M5) | Terbuka |
| AUD-0005-11 | S2 | KEMUNGKINAN | Ekspor kuasi-identifikasi lintas keluarga (S-12) | Terbuka |
| AUD-0005-12 | S1 | TERKONFIRMASI | J13 disetujui dosen (sebelum PjBL) vs K-05 dosen setelah PjBL; definisi "rilis" untuk B11 belum jelas | Terbuka |
| AUD-0005-13 | S2 | TERKONFIRMASI | Hygiene cakupan: J05 (P1) ditag M1b; A02 dan A03 M1a memuat teks M2 | Terbuka |
| AUD-0005-14 | S1 | TERKONFIRMASI | A12 (harga dari M3+) dan A19 (MMF belum terverifikasi) masih bergantung pada sumber tidak tersedia | Terbuka |
| AUD-0005-15 | S0 | KEMUNGKINAN | Keselamatan M1 pada profil sintetis tetap bergantung pada aturan belum primer (tanda bahaya, BIV, gula/garam, alergen, alias madu) | Terbuka (syarat M1a) |
| AUD-0005-16 | S1 | TERKONFIRMASI | T-06: satuan RAE vs RE, folat DFE, retensi (C-036 BELUM) belum ada dalam kriteria | Terbuka |
| AUD-0005-17 | S3 | TERKONFIRMASI | Penjelasan "kewajiban hukum" T-02 sudah diperbaiki; tidak ada temuan baru | Ditutup |

**Ringkasan hitungan:** S0 = 5 (AUD-0005-01, -02, -04, -07, -15); S1 = 8 (-03, -05, -06, -08, -10, -12, -14, -16); S2 = 3 (-09, -11, -13); S3 = 1 (-17, ditutup). Total 17.

Angka untuk LEDGER: **S0 = 5, S1 = 8, S2 = 3.**

## 12. Penutupan temuan sebelumnya (AUD-0003-xx, AUD-0004-xx)
- AUD-0003-01, -03, -07: ditutup (lihat §8).
- AUD-0003-02: tetap S1 terbuka.
- AUD-0004-01..04 (S0): diterima dan didesain ulang (Opsi A). **Tetap terbuka** sebagai syarat M1a sampai uji lulus.
- AUD-0004-05..12: diterima oleh RSP-0004; sebagian masih terbuka (lihat AUD-0005-14, -15, -16).

## 13. Yang TIDAK saya periksa
- **Kode dan prototipe:** belum ada. Tidak ada uji dijalankan.
- **Buku KIA 2024, pedoman IDAI/Kemenkes untuk aturan S0:** belum diterima (menunggu berkas pemilik). Tidak dibuka.
- **Ayosehat.kemkes.go.id:** HTTP 503. Klaim "90 tablet" tidak diverifikasi.
- **Teks penuh National Academies 2000:** judul saja.
- **Data USDA FDC:** tidak dibuka.
- **Kepatuhan etik dan izin institusi PjBL:** di luar cakupan auditor (asumsi REQ).
- **Desain visual dan aksesibilitas:** tidak dinilai.
- **Biaya dan jadwal M0–M1:** di luar kompetensi audit.
- **Perilaku nyata kader dan pengasuh:** tidak ada data; S-8 dan S-10 dinilai dari desain.

## 14. Pertanyaan untuk eksekutor
1. Apakah build V-PJBL dapat dibuat tanpa input bebas dan tanpa ekspor per profil? Berapa usaha tambahannya?
2. Siapa yang menandatangani J13 sebelum PjBL? Jika tidak ada, apakah J13 untuk V-PJBL cukup dengan persetujuan pembimbing dan label?
3. Apa definisi "rilis" pada B11? Apakah kasus peragaan kepada ibu termasuk rilis?
4. Berkas primer apa yang sudah ada di folder pemilik (`sumber/`)? Apakah ada Buku KIA 2024 dalam bentuk PDF yang dapat dibaca teksnya?
5. Apakah origin berbeda per build dapat diterapkan pada hosting yang dipilih?

## 15. Rekomendasi audit berikutnya
- A-SAFE pada daftar B01/B03 setelah sumber primer diterima.
- A-IMPL pada uji S-1..S-12 begitu kode M0 ada (dimulai dari uji lint fixture).
- A-DATA pada pemetaan T-06 (30 bahan) sebelum M1a.

## 16. Verifikasi ulang (diisi setelah RSP)
| Temuan | Bukti verifikasi ulang | Hasil |
|---|---|---|
| AUD-0005-01..16 | — | Terbuka |
| AUD-0005-17 | — | Ditutup |
