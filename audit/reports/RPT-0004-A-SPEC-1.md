# RPT-0004 — A-SPEC-1: Keputusan pemilik, jalur rilis V-PJBL, dan ruang lingkup M1

- **Menjawab:** REQ-0004-A-SPEC-1-keputusan-dan-jalur-rilis · **Jenis:** A-SPEC lanjutan + penilaian mitigasi S0 (versi PjBL)
- **Auditor:** Auditor independen · **Tanggal:** 2026-10-28
- **Objek:** `KEPUTUSAN_DAN_JALUR_RILIS.md` (seluruh), `REGISTRI_FITUR_NUTRIVA.md` (versi saat ini), `RSP-0002` §D1–D6
- **Di luar ruang lingkup:** fakta ilmiah (sudah di REQ-0003/RPT-0003).

## VONIS

**TIDAK LAYAK memulai M0 untuk V-PJBL dalam bentuk sekarang.**

Alasan: empat S0 terbuka (AUD-0004-01..04). Mitigasi §3 pemilik bersifat prosedural dan tidak dapat diverifikasi, dan dua mitigasi justru bertentangan dengan rancangan yang sudah disetujui (D10 Audit Pack dan B10). Gerbang V-PJBL juga belum menutup celah M1 yang paling berbahaya: anak tanpa penilaian status gizi tetap menerima menu.

**Syarat untuk LAYAK BERSYARAT** (semua harus dipenuhi dan diverifikasi auditor):
1. **Tidak ada data anak atau ibu nyata** yang dimasukkan, disimpan, atau ditampilkan selama V-PJBL, termasuk pada hari H. Demo memakai profil sintetis (F08 naik ke P0 untuk V-PJBL). Tulis di keputusan pemilik dan di B10 (AUD-0004-01).
2. **Setiap keluaran menu dan tanda bahaya membawa label "Prototipe PjBL — belum diverifikasi dosen; bukan pengganti petugas"** di layar yang sama, bukan hanya di Tentang/Mode Ahli. Tidak ada keluaran menu yang diperlihatkan kepada pengasuh nyata di luar sesi yang didampingi (AUD-0004-02).
3. **Audit Pack dan ekspor tidak memuat masukan per orang** di V-PJBL. D10 dibatasi ke jejak dan versi tanpa `input.json` per orang, atau D10 dinyatakan P2 untuk V-PJBL (AUD-0004-03).
4. **M1 tidak boleh menghasilkan menu untuk anak tanpa penilaian status gizi.** Pilihan yang diterima: (a) A04 minimal (BB/U, PB/U, BB/TB dari tabel Permenkes 2/2020 yang sudah terbaca) masuk M1, atau (b) menu dinonaktifkan dan keluaran hanya "bawa ke posyandu untuk penimbangan" sampai A04 masuk. Keputusan (a)/(b) tertulis pemilik (AUD-0004-04).
5. **Daftar tanda bahaya (B03) dan aturan keamanan (B01) bersumber primer Indonesia** atau ditandai "belum diverifikasi" di setiap keluaran. Sumber sekunder (C-090, C-092, C-097) tidak boleh menjadi dasar aturan S0 (AUD-0004-05).
6. **Dependensi M1 diperbaiki** (lihat §3) dan registri memberi status M1/M2/ditunda pada setiap ID, bukan P0 generik (AUD-0004-06, -10).
7. **Penerimaan risiko S0 ditulis ulang** oleh pemilik dengan kalimat sendiri, menyebut R02 dan R06 secara eksplisit, batas tinjau, dan syarat 1–5 di atas. Masuk tabel "Risiko diterima pemilik" di LEDGER (AUD-0004-08).
8. **Gerbang tidak melemah** seperti dijelaskan di §5: dosen tetap menandatangani AKG dan aturan keamanan, dan etik tetap wajib untuk data nyata (AUD-0004-07).

## 1. Ruang lingkup dan metode

- **Diperiksa:** keputusan K-01..K-07, jalur V-PJBL/V-KOMPETISI, mitigasi §3 (8 butir), gerbang §6, M1 §4 (44 fungsional + 8 desain), keputusan T-01..T-11, registri (153 ID, 88 P0), STRATEGI §4 untuk gerbang.
- **Metode:** (a) cek ketergantungan langsung terhadap registri dan dokumen sumber; (b) skenario konkret untuk tiap S0; (c) hitungan langsung (`parse.py`, `parse2.py`, dijalankan pada registri saat ini); (d) penelusuran improvisasi buatan sendiri (≥30% usaha, §8).
- **Lingkungan:** Windows 11, Python 3.12 untuk parsing registri; teks PMK 28/2019 dan Permenkes 2/2020 dari RPT-0001/0003.

## 2. Jawaban pertanyaan REQ-0004

### Pertanyaan 1 — Mitigasi S0 (§3, butir 1–8)

| Butir | Penilaian | Alasan |
|---|---|---|
| 1. Tanpa data pribadi di luar perangkat; usia bulan dan kode | **KURANG** | "Kode" tidak didefinisikan. Usia bulan dan tanggal lahir, anggaran, dan bahan bersama dapat mengidentifikasi keluarga tertentu (kuasi-identifikasi). UU PDP tetap berlaku. Tidak ada mekanisme teknis (uji) yang memastikan tidak ada nama atau tanggal lahir yang tersimpan |
| 2. Hanya agregat yang diekspor | **KURANG** | Bertentangan dengan D10 yang memuat `input.json` (masukan per orang). Tidak ada spesifikasi ekspor agregat |
| 3. Pemakaian sebagai alat peraga, didampingi | **TIDAK DAPAT DIVERIFIKASI** | Perilaku pengguna. Tanpa uji kegunaan atau protokol kehadiran, auditor tidak dapat menilai |
| 4. Tanda bahaya dari sumber primer; berhenti memberi menu | **KURANG** | Daftar belum bersumber primer (B03/B11). Belum ada uji bahwa menu berhenti. Keluhan yang ditulis berbeda ejaan (mis. "tidak mau susu") belum diuji |
| 5. Kategori khusus ditandai dan dirujuk | **KURANG** | B12 memerlukan masukan (HPHT, kembar, prematur/usia koreksi, edema, sindrom) yang tidak ada di A02 M1 (AUD-0004-04) |
| 6. Tidak ada klaim klinis atau hasil penelitian dari hari H | **CUKUP** dengan syarat | Berlaku bila keluaran hari H tidak dipublikasikan; "umpan balik kegunaan" tetap berupa pengumpulan data (lihat N1) |
| 7. Data hari H tidak dipakai ulang tanpa etik | **TIDAK DAPAT DIVERIFIKASI** | Tidak ada mekanisme hapus teknis (K14 ditunda) |
| 8. Izin lokasi dan pembimbing | **DI LUAR CAKUPAN** | Tidak dinilai (asumsi REQ) |

**Skenario konkret S0 yang tetap mencelakai atau membocorkan data pada V-PJBL (minimal lima; kode skenario mengacu ke §5):**

- **S-A (data hari H):** mahasiswa mengukur 20 anak di posyandu dan memasukkan usia, berat, dan panjang ke aplikasi sebagai "demo". Data tersimpan di IndexedDB perangkat kader. Tidak ada etik dan tidak ada persetujuan. Melanggar B10 dan mitigasi 1; keluaran menu memuat data anak nyata. **S0.**
- **S-B (menu tanpa dosen):** ibu membuka tautan PWA sendiri, memasukkan "anak 9 bulan", dan mendapat menu yang memuat madu karena alias "madu hutan" tidak terdeteksi pada B01. Tidak ada label pada keluaran menu. **S0.**
- **S-C (anak kurus tanpa rujukan):** anak 14 bulan dengan BB/U jauh di bawah −3 SD diisi sebagai anak biasa; A04 belum ada; aplikasi menghasilkan menu biasa tanpa rujukan. **S0.**
- **S-D (ekspor per orang):** kader menekan "Audit Pack" (D10) untuk "dokumentasi"; `input.json` berisi usia, berat, dan bahan per anak; berkas dibagikan ke grup WhatsApp posyandu. Bertentangan dengan mitigasi 2. **S0.**
- **S-E (perangkat kader bersama):** satu HP dipakai tiga keluarga; J10 (kunci sesi) belum diuji; ibu kedua melihat riwayat ibu pertama. **S1** (mengarah ke S0 bila data tersimpan lintas keluarga).
- **S-F (cache aturan lama):** HP kader menyimpan versi aturan B01 lama tanpa J09 aktif setelah aturan diperbarui; anak tetap mendapat menu dengan bahan yang sudah dilarang. **S1.**

### Pertanyaan 2 — Kejujuran klaim V-PJBL

- **Cukup untuk penguji:** "prototipe edukasi gizi", "bukan diagnosis", "bukan pengganti petugas", dan "belum diverifikasi dosen" pada Tentang dan Mode Ahli.
- **Tidak cukup untuk pengguna:** label hanya di Tentang dan Mode Ahli. Ibu yang membuka menu tidak melihat label itu. Diperlukan label pada setiap keluaran menu (syarat 2).
- **Kalimat yang berlebihan:**
  - `KEPUTUSAN` §2 "Data pengguna: tanpa nama (kode)" — kode dan usia bulan tetap data pribadi (kuasi-identifikasi). Ganti dengan "tanpa nama lengkap; tetap data pribadi dan diperlakukan sesuai UU PDP".
  - `KEPUTUSAN` §5 T-02: "Permenkes 2/2020 sebagai kewajiban hukum (Pasal 3)". Pasal 3 mewajibkan penggunaan standar untuk **tenaga kesehatan, pengelola program, dan pemangku kepentingan terkait** untuk penilaian status gizi. Aplikasi bukan tenaga kesehatan. Pernyataan "kewajiban hukum" untuk aplikasi tidak sepenuhnya tepat; ganti "dirujuk sebagai acuan resmi".
  - `KEPUTUSAN` §2 "Dalam V-PJBL layar Tentang/Mode Ahli menampilkan 'belum diverifikasi dosen'" — label perlu lebih luas (lihat AUD-0004-02).
  - Narasi "menu" dalam presentasi PjBL berisiko dibaca sebagai rekomendasi. Gunakan istilah "contoh pola makan dari aturan" sampai dosen menandatangani.

### Pertanyaan 3 — Ketergantungan M1 dan hitungan

**Hitungan (dijalankan pada registri saat ini):** M1 §4 berisi 44 ID fungsional dan 8 ID desain (L01, L02, L03, L04, L05, L08, L11, L12). Hitungan 44 dan 8 **benar**. Semua 52 ID berprioritas P0 di registri.

**Registri:** 153 ID, 88 P0, 57 P1, 8 P2. Dari 88 P0, **36 tidak masuk M1** (A04 A15 B04 B08 C01 C02 C03 C08 D03 D04 D05 D06 D07 D11 E05 F01 F02 F03 F04 F07 F08 G04 G05 G06 G08 G09 G15 H05 H15 I07 J04 J08 K01 K02 K06 K14). Label P0 pada ID ini tidak diperbarui; ini membingungkan gerbang (AUD-0004-10).

**Ketergantungan yang hilang atau bertentangan (daftar lengkap):**

| ID M1 | Bergantung pada | Status | Masalah |
|---|---|---|---|
| A07 | LP (registri teks "dioptimasi (LP)") | T-07 menyatakan tanpa LP | **Registri tidak sinkron** dengan T-07 (AUD-0004-06) |
| A12 | harga dan ketersediaan (I01, I02) | ditunda | Padanan bahan butuh harga dan ketersediaan; sumber belum ada (C-072 SEBAGIAN) |
| A02 | LiLA (hanya relevan untuk hamil; C-011 SEKUNDER) | ibu hamil bukan M1 | Field tidak diperlukan M1; kurangi |
| A01 | pilihan Hamil dan Menyusui | M1 hanya anak | Pilihan lain harus disembunyikan di build M1 |
| A03 | AKG hamil dan menyusui | M2 | Di M1 A03 hanya AKG anak; "800 kkal total" untuk 6–11 bulan bertentangan dengan B13 bila tidak dipisah (lihat Q4) |
| A19 | frekuensi minimum (MMF, C-027 BELUM) | belum diverifikasi | Ketergantungan pada klaim tidak terverifikasi (S1) |
| B01 | sumber madu/tersedak/garam-gula (C-090 SEKUNDER; C-097 SEBAGIAN) | belum primer | Aturan S0 bergantung sumber sekunder (AUD-0004-05) |
| B02 | penandaan alergen di A06 | M1 | Panduan pengenalan alergen belum bersumber (C-092 SEBAGIAN; NIAID AS) |
| B10 | F08 mode demo (P0, ditunda), K14 (hapus data, P0, ditunda) | ditunda | B10 tidak dapat dipenuhi tanpa F08 dan K14 (AUD-0004-01) |
| B12 | A02 (HPHT, kembar, prematur, edema, sindrom) | A02 tidak memuat | **Input tidak ada** (AUD-0004-04) |
| B13 | konsep 200/300/550 (C-026 SEBAGIAN) | belum primer | Angka belum terverifikasi |
| H05 | ikon + teks (P0, ditunda) | ditunda | L02 bergantung warna, dan H05 yang menjamin "warna bukan satu-satunya penanda" tidak ada di M1 |
| H11 | anggaran performa (J05, P1) | ditunda | Tidak ada ambang terukur untuk "HP murah" |
| H12 | status luring (G08, P0, ditunda); IndexedDB (C-077 BELUM) | ditunda | Pengguna tidak tahu apakah data sudah tersimpan |
| G13 | J01 | M1 | Tidak masalah |
| J10 | G15 (mode kader vs keluarga, P0, ditunda) | ditunda | Mode kader tidak punya UI di M1 |
| J13 | nilai harapan dari WHO Anthro atau tabel resmi | belum terverifikasi (WHO) | Gunakan tabel Permenkes yang sudah terbaca |
| D10 | keluaran JSON per orang (`input.json`) | M1 | Bertentangan dengan mitigasi 2 (AUD-0004-03) |
| — | INV-15 (koma dan titik desimal) | tidak ada di M1 | Masukan "12,5" vs "12.5" tidak diuji di M1 |
| — | K06 (verifikasi silang) | ditunda (P0) | Keluaran M1 tanpa cek silang independen |

**Kesimpulan Pertanyaan 3:** M1 belum dapat dibangun utuh tanpa menambah sebagian ID ke M1 (B04, F08, K14, G08, G15, H05, A04 minimal, dan A02 yang diperbaiki) atau mengubah klaim M1. Ini berarti angka 44+8 tepat tetapi irisannya belum koheren.

### Pertanyaan 4 — Mode anak 6–23 bulan sebagai mode pertama (T-01)

**Yang sudah cukup:** mode ini menghindari ambiguitas 24 bulan (T-02). B01, B02, B03 ada. B13 membedakan menu tambahan dan total.

**Yang kurang untuk keselamatan anak:**
1. **Penilaian status gizi tidak ada di M1** (A04 ditunda). Anak yang kurus atau pendek menerima menu biasa (S-C). Ini kekurangan paling berbahaya.
2. **Kategori khusus tidak punya input** (B12): prematur (usia koreksi), edema bilateral, sindrom, usia tidak diketahui, berat lahir.
3. **Batas umur:** anak 24 bulan atau lebih harus ditolak dengan pesan, bukan diproses. Spesifikasi ini tidak ada. Input "23 bulan 30 hari" harus dibulatkan sesuai aturan usia bulan penuh (Permenkes 2/2020, penjelasan) dan diuji.
4. **Aturan makanan:** madu (alias "madu hutan", "madu asli", "air madu"), kecap dan gula merah yang mengandung gula tambahan, garam, dan pangan berisiko tersedak. Kamus alias belum ada (N12 dan AUD-0004-05).
5. **Pengenalan alergen:** pedoman yang dipakai (NIAID) bukan pedoman Indonesia. Belum ada keputusan pemilik atau dosen. B02 hanya memfilter alergen yang dipilih, bukan pengenalan.
6. **Gejala sakit:** diare, muntah, demam tinggi, tidak mau makan, dan letargi harus memunculkan rujukan. B03 belum bersumber primer (S0 jika daftar keliru).
7. **Tekstur dan frekuensi** (A19) tergantung klaim MMF yang belum terverifikasi.
8. **ASI:** status ASI (menyusui atau tidak) harus menjadi input wajib. B13 mensyaratkannya, tetapi A02 tidak memuatnya secara eksplisit.

### Pertanyaan 5 — Gerbang (§6)

**Pelemahan yang tidak dapat dipertanggungjawabkan (AUD-0004-07):**
- **M2 "vonis auditor + sumber primer terbaca" menggantikan verifikasi dosen.** Auditor bukan ahli gizi yang berwenang atas AKG, aturan keamanan, dan kasus baku. Gerbang M2 harus tetap menyertakan tanda tangan dosen untuk AKG, aturan keamanan, dan tanda bahaya (B11).
- **M3 "audit data oleh auditor, 10% baris"** menggantikan CVI dosen. Sampel 10% oleh auditor tidak menggantikan validasi isi pakar.
- **M5 "mitigasi §3 diaudit (A-RES versi PjBL); etik ditunda"** menggantikan persetujuan etik. Ini tidak dapat dipertanggungjawabkan bila ada data anak nyata; etik tetap wajib untuk data nyata apa pun statusnya.
- **B11 vs V-PJBL:** registri B11 menyatakan "aplikasi tidak dirilis ke pengguna tanpa itu (gerbang M2)". V-PJBL merilis ke pengguna di lapangan sebelum M2. Konflik ini belum diputuskan (AUD-0004-02).

**Yang harus tetap di M2/M3 walau dosen belum memverifikasi:**
- Tanda tangan dosen atas tanda bahaya (B11) sebelum keluaran apa pun ke pengasuh nyata. Pada V-PJBL ini berarti tidak ada keluaran nyata, atau dosen menandatangani sebelum PjBL, bukan sesudah.
- Verifikasi AKG dan aturan keamanan (B01, B03) dari sumber primer dan dosen.
- Etik untuk setiap data nyata.
- Lisensi TKPI sebelum data TKPI didistribusikan (V-KOMPETISI).

### Pertanyaan 6 — Keputusan teknis T-01…T-11

| # | Nilai | Alasan |
|---|---|---|
| T-01 | **SETUJU BERSYARAT** | Mode anak 6–23 bulan tepat. Syarat: B12 dan A04 minimal (Pertanyaan 4) |
| T-02 | **SETUJU BERSYARAT** | Gunakan Permenkes 2/2020 sebagai acuan resmi, bukan "kewajiban hukum" (lihat Pertanyaan 2). ADR wajib. Dosen mengonfirmasi |
| T-03 | **SETUJU** | Vitamin A RE mengikuti AKG (RPT-0001 F-01). Folat dalam mcg tanpa DFE (RPT-0003 butir 2a). Konversi DFE hanya bila sumber data memberi DFE |
| T-04 | **SETUJU BERSYARAT** | % AKG untuk 6–11 bulan harus memisahkan ASI dari makanan pendamping (B13). Tanpa itu % AKG menyesatkan |
| T-05 | **SETUJU** | Tidak ada pengali bioavailabilitas; A17 kualitatif (AUD-0001-03) |
| T-06 | **PERLU BUKTI** (AUD-0004-09) | USDA FDC (CC0) cocok dari sisi lisensi. Tetapi USDA berbasis pangan Amerika; pangan lokal (mis. tempe, ikan teri, daun kelor, bayam lokal, tahu) belum tentu tersedia atau berbeda dalam BDD dan retensi. Syarat: pemetaan 30 bahan ke entri USDA, daftar bahan yang tidak punya padanan, dan uji selisih dengan TKPI bila TKPI sudah boleh dipakai internal untuk verifikasi (bukan distribusi). Tanpa itu, angka gizi M1 berasal dari padanan yang belum tervalidasi |
| T-07 | **SETUJU** | Slot dan heuristik deterministik. **Syarat:** A07 di registri diperbarui (tidak ada LP) |
| T-08 | **SETUJU** | Tabel SD resmi Permenkes 2/2020 sudah terbaca (RPT-0003 §5d). Z-score LMS tidak diperlukan untuk M1 |
| T-09 | **SETUJU** | AI mati pada V-PJBL |
| T-10 | **SETUJU** | Tidak ada dosis TTD. Hindari kata "TTD" pada rujukan kecuali "tanya petugas". A18 harus memakai bahasa itu |
| T-11 | **SETUJU** | Uji determinisme lintas peramban (J12) dan ukuran bundel sebelum dikunci |

### Pertanyaan 7 — Penerimaan risiko pemilik (§3) menurut 05_ §6

**Belum memenuhi** (AUD-0004-08):
- Kutipan persis kalimat pemilik tidak ada. `KEPUTUSAN` §1 memuat ringkasan oleh eksekutor ("dikutip … diringkas"). Pemilik harus menulis sendiri.
- Tidak ada **batas waktu tinjau**. `05_` §6 mensyaratkan batas waktu tinjau pada tabel risiko diterima.
- Tabel "Risiko diterima pemilik" di LEDGER masih kosong. Penerimaan dicatat di "Keputusan pemilik" yang tidak sesuai format.
- Penerimaan S0 harus menyebut scope (V-PJBL), syarat (1–8 di atas), dan siapa yang meninjau. Belum ada.

**Yang harus dilengkapi pemilik:** kalimat tertulis sendiri yang menyebut R02 dan R06; alasan; batas tinjau (tanggal); syarat 1–8; penanggung jawab kepatuhan; tanggal.

### Pertanyaan 8 — Risiko baru dari keputusan ini (≥5)

| ID | Risiko | Tingkat |
|---|---|---|
| N1 | Demo hari H menjadi pengumpulan data nyata tanpa etik ("umpan balik kegunaan" mengumpulkan data pengasuh dan anak) | **S0** |
| N2 | Pengasuh memperlakukan menu sebagai nasihat karena tampilannya sudah lengkap | **S0** |
| N3 | Konflik B11 (gerbang) dan V-PJBL tidak diputuskan; keluaran sudah dirilis sebelum dosen menandatangani | **S0** (gabung AUD-0004-02) |
| N4 | V-PJBL dan V-KOMPETISI memakai data berbeda (USDA vs TKPI). Hasil PjBL tidak dapat dipakai ulang; migrasi data versi dibutuhkan | S2 |
| N5 | Dosen pasca-PjBL tidak tersedia. V-KOMPETISI tertahan tanpa batas (gerbang V) | S2 |
| N6 | Tangkapan layar dan foto menu tersebar karena G12 (berbagi) ditunda namun orang tetap membagikannya | S2 |
| N7 | Pernyataan "kewajiban hukum" dan "tanpa data pribadi" menjadi kelemahan di sidang jika dikritik | S2 |
| N8 | T-06 memberi angka USDA untuk pangan lokal yang tidak sepadan; kesalahan gizi di M1 terbawa ke V-KOMPETISI | S1 |
| N9 | Kekosongan status gizi (A04) membuat M1 tampak lengkap padahal tidak menilai anak | S0 (bagian S-C) |

## 3. Temuan bernomor (REQ-0004)

| ID | Tingkat | Keyakinan | Ringkasan | Status |
|---|---|---|---|---|
| AUD-0004-01 | S0 | TERKONFIRMASI | `KEPUTUSAN` §3 butir 6 dan §3 butir 1: hari H mengumpulkan data nyata sebelum etik. Bertentangan dengan B10 dan mitigasi 1 | Terbuka |
| AUD-0004-02 | S0 | TERKONFIRMASI | Label "belum diverifikasi" hanya di Tentang dan Mode Ahli; B11 melarang rilis tanpa tanda tangan dosen tetapi V-PJBL merilis di lapangan | Terbuka |
| AUD-0004-03 | S0 | TERKONFIRMASI | D10 Audit Pack memuat `input.json` per orang; bertentangan dengan mitigasi 2 (agregat saja). Akses tanpa pendamping mungkin | Terbuka |
| AUD-0004-04 | S0 | TERKONFIRMASI | M1 menghasilkan menu tanpa penilaian status gizi (A04 ditunda); B12 tanpa input dari A02 | Terbuka |
| AUD-0004-05 | S1 | KEMUNGKINAN | Aturan S0 (madu, tersedak, gula, garam, alergen) dan B03 bergantung sumber sekunder atau non-Indonesia (C-090, C-092, C-097) | Terbuka |
| AUD-0004-06 | S1 | TERKONFIRMASI | 14 ketergantungan M1 hilang atau tidak sinkron (A07 LP vs T-07, A12, A19, B10, B12, H05, H11, H12, J10, J13, D10, INV-15, K06, B02) | Terbuka |
| AUD-0004-07 | S1 | TERKONFIRMASI | Gerbang M2, M3, M5 menggantikan dosen dan etik dengan auditor dan mitigasi | Terbuka |
| AUD-0004-08 | S2 | TERKONFIRMASI | Penerimaan risiko S0 tidak dalam bentuk yang disyaratkan 05_ §6 (tidak tertulis oleh pemilik, tanpa batas tinjau, LEDGER kosong) | Terbuka |
| AUD-0004-09 | S1 | KEMUNGKINAN | T-06 USDA untuk 30 bahan Indonesia belum dipetakan dan belum divalidasi | Terbuka |
| AUD-0004-10 | S2 | TERKONFIRMASI | 36 ID P0 di luar M1 belum diberi status M2/ditunda; A07 registri tidak sinkron | Terbuka |
| AUD-0004-11 | S2 | TERKONFIRMASI | Pernyataan "kewajiban hukum" (T-02) dan "tanpa data pribadi" (§2) berlebihan | Terbuka |
| AUD-0004-12 | S2 | KEMUNGKINAN | Spesifikasi batas umur (24 bulan dan masukan 23 bulan 30 hari) dan penolakan di luar mode tidak ada | Terbuka |

Total: S0 4, S1 4, S2 4.

## 4. Mitigasi S0 — ringkas penilaian (wajib, 1–8)
Lihat Pertanyaan 1. Ringkasan: 1 kurang, 2 kurang, 3 tidak dapat diverifikasi, 4 kurang, 5 kurang, 6 cukup dengan syarat, 7 tidak dapat diverifikasi, 8 di luar cakupan.

## 5. Penelusuran improvisasi (buatan auditor; ≥30% usaha)

Bagian ini sengaja di luar daftar REQ. Porsi usaha kira-kira 40% dari analisis di atas.

**Skenario yang saya buat sendiri (bukan dari REQ atau 07_):**
- **I-1 (pemalsuan label):** kader mencetak tangkapan layar menu tanpa label "prototipe". Tidak ada watermark. Tidak teratasi oleh syarat 2 kecuali label dicetak ke gambar. Catatan: saran teknis sebatas watermark pada ekspor; tidak menjamin.
- **I-2 (input 24 bulan):** pengasuh memasukkan 24 bulan 0 hari. Sistem harus menolak mode anak dan mengarahkan ke fitur yang tepat. Belum ada spesifikasi. Uji yang disarankan: 23 bln 30 hr, 24 bln 0 hr, 24 bln 1 hr.
- **I-3 (desimal):** berat "12,5" dan "12.5" dan "12,500" (INV-15). M1 tidak memuat INV-15; uji belum ada.
- **I-4 (kamus alias):** "madu hutan", "madu asli", "air madu", "kecap manis" dan "gula merah" tidak tercakup B01. Kamus alias harus dibuat dan diuji (B14 belum mencakup).
- **I-5 (HP dicabut, offline):** pengguna menutup aplikasi saat menghitung. Tidak ada "simpan otomatis" (G06, ditunda). Data hilang tanpa peringatan (H12 bergantung G08).
- **I-6 (versi aturan):** kader menerima APK lama. J09 hanya bekerja bila service worker diperbarui. Tidak ada mekanisme "nomor versi minimum" yang dipaksa saat start.
- **I-7 (dosen tidak tersedia):** dosen belum bisa menandatangani B11 sebelum PjBL karena jadwal. Tanpa rencana cadangan, V-PJBL berjalan tanpa tanda tangan atau tertunda. Ini mendorong pemilik memilih menjalankan tanpa tanda tangan.
- **I-8 (kuasi-identifikasi):** kombinasi kota (dari alamat posyandu), usia bulan, berat, dan kader yang sama dapat mengidentifikasi anak meski tanpa nama. Tidak ada aturan kebijakan untuk kader mencatat lokasi.
- **I-9 (lisensi USDA):** CC0 menghilangkan kewajiban lisensi, tetapi ada kewajiban atribusi dalam *norma* tertentu (ditulis di KEPUTUSAN T-06 "label sumber per nilai"). Tidak masalah jika dilaksanakan.
- **I-10 (presentasi):** penguji bertanya "apa bukti menu ini benar" dan tidak ada jawaban selain "belum diverifikasi". Narasi PjBL perlu dirancang untuk itu.

**Hasil penelusuran:** dari I-1..I-10, tiga menunjukkan celah yang tidak tercakup syarat yang ada (I-1, I-2, I-4). Dua melengkapi temuan (I-6 → J09 dan I-8 → kebijakan lokasi). Empat tidak menambah temuan baru.

## 6. Audit proses (kepatuhan)
- Dokumen keputusan ditulis oleh eksekutor dari pesan pemilik. Kutipan K-01..K-07 tidak verbatim; ini terkait AUD-0004-08.
- Registri berubah pada snapshot ini; perubahan yang tercatat di RSP-0002 (B10–B14, J09–J13, A10, A17) sudah masuk. Perubahan A07 (LP) belum.
- Tidak ada kode, sehingga audit proses implementasi belum relevan.

## 7. Uji yang diusulkan (jalur `audit/proposed_tests/`)
Belum ditulis dalam sesi ini. Usulan ringkas:
- `input_boundary_age.test` — 23 bln 30 hr, 24 bln 0 hr, 24 bln 1 hr: mode anak menolak dan mengarahkan.
- `alias_madu.test` — set alias B01 (madu hutan, madu asli, air madu) wajib menghasilkan blokir.
- `output_label.test` — setiap keluaran menu memuat label prototipe (grep pada templat keluaran).
- `export_no_person.test` — D10/ekspor tanpa `input.json` per orang di mode V-PJBL.
- `version_gate.test` — start dengan versi aturan lama menolak keluaran menu sampai pembaruan.

## 8. Yang TIDAK saya periksa dan mengapa
- **Kepatuhan etik formal dan izin institusi PjBL** (asumsi REQ): tidak dinilai.
- **Kode dan prototipe:** belum ada. Uji di 7 belum dijalankan.
- **Kesesuaian pesan kader di lapangan** dan uji kegunaan: tidak ada data.
- **Lisensi dan ketersediaan USDA untuk pangan Indonesia:** saya tidak membuka USDA FDC dalam sesi ini; T-06 dinilai dari argumen, bukan data.
- **Status hukum alat kesehatan perangkat lunak** (R03 RPT-0002): masih TIDAK DAPAT DIVERIFIKASI.
- **Biaya dan waktu pengembangan** (kelayakan jadwal): di luar kompetensi audit ini.
- **Kualitas desain visual (L02, L11)** — hanya dinilai dari registri, tidak dari tampilan.

## 9. Pertanyaan untuk eksekutor
1. Apakah D10 untuk V-PJBL dapat dibatasi ke jejak tanpa `input.json`? Bagaimana menjaga jejak tetap berguna?
2. Bagaimana B11 dapat dijalankan sebelum PjBL? Adakah dosen yang bersedia menandatangani sebelum hari H?
3. Apakah A04 minimal (tabel Permenkes) dapat masuk M1 sebelum hari H? Estimasi kerjanya.
4. Apakah ada data pangan lokal yang sudah dipetakan ke USDA? Kalau ada, berapa banyak yang punya padanan?
5. Registri: apakah A07 akan diperbarui agar tidak lagi memuat LP?

## 10. Rekomendasi dan syarat untuk LAYAK BERSYARAT
Lihat VONIS (syarat 1–8). Untuk masing-masing, bukti yang diterima auditor:
- (1) berkas B10 yang diubah dan F08 masuk M1 dengan uji bahwa mode demo tidak menerima nama atau tanggal lahir;
- (2) tangkapan layar atau uji templat yang memuat label pada setiap keluaran menu;
- (3) uji `export_no_person.test` lulus;
- (4) A04 minimal masuk M1 dengan uji ambang tabel Permenkes; atau keputusan menonaktifkan menu tertulis;
- (5) daftar B01/B03 bersumber primer Indonesia, atau label "belum diverifikasi" pada keluaran terkait;
- (6) registri diperbarui dengan status M1/M2/ditunda untuk seluruh 36 P0 di luar M1 dan A07 disinkronkan;
- (7) kalimat penerimaan risiko pemilik, ditulis sendiri, masuk LEDGER;
- (8) gerbang M2/M3/M5 mempertahankan dosen dan etik sebagaimana dijelaskan di Pertanyaan 5.

## 11. Rekomendasi audit berikutnya
- A-SAFE pada daftar B01/B03 setelah sumber primer terbaca.
- A-IMPL pada uji `input_boundary_age` dan `export_no_person` begitu ada kode.
- A-RES untuk mitigasi PjBL (pertanyaan etik formal di luar cakupan auditor).

## 12. Verifikasi ulang (diisi setelah RSP)
| Temuan | Bukti verifikasi ulang | Hasil |
|---|---|---|
| AUD-0004-01..04 | — | Terbuka |
| AUD-0004-05..09 | — | Terbuka |
| AUD-0004-10..12 | — | Terbuka |
