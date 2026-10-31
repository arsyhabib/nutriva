# Registri Fitur NUTRIVA (draf diskusi v0.1)

Konsep: mesin gizi deterministik untuk 1000 HPK yang bisa diperiksa, offline-first, dengan AI sebagai penjelas opsional.
Kategori pengguna: **Ibu hamil**, **Ibu menyusui**, **Anak 6–23 bulan** (opsional 24–59 bulan). Bayi < 6 bulan: hanya ASI, tanpa menu.

**Prioritas:** P0 = wajib untuk hari H dan inti skripsi · P1 = penting, tahap berikutnya · P2 = pengembangan lanjut.
**Peran:** I = ibu/keluarga, K = kader, A = ahli/penguji/dospem, S = sistem.

---

## A. Fitur Utama (Mesin Gizi)

| ID | Fitur | Deskripsi | Prio | Peran | Bukti / Metrik |
|---|---|---|---|---|---|
| A01 | Pemilih kategori `[M1b]` | Layar awal memilih Hamil / Menyusui / Anak; menentukan seluruh parameter. **Build M1: hanya "Anak 6–23 bulan" aktif**; pilihan lain disembunyikan | P0 | I,K | Waktu pilih |
| A02 | Profil minimal `[M1a]` | **M1 (anak):** usia bulan penuh, jenis kelamin, BB, PB/TB + posisi ukur, **status ASI (wajib)**, prematur, edema bilateral, kondisi/sindrom khusus, usia tidak pasti, alergi, anggaran; salah satu "ya" pada kategori khusus → tandai dan rujuk (B12). **M2 (hamil/menyusui):** trimester/usia kandungan, LiLA, dst. Desimal koma/titik diterima (INV-15) | P0 | I,K | Kelengkapan data |
| A03 | Kalkulator kebutuhan `[M1a]` | Kebutuhan energi dan zat gizi dari AKG 2019 menurut usia, jenis kelamin, trimester, menyusui | P0 | S | Kecocokan dengan AKG |
| A04 | Status gizi anak `[M1a]` | **M1 minimal (6–23 bulan):** klasifikasi BB/U, PB/U, BB/PB memakai **tabel SD resmi Permenkes 2/2020**; usia bulan penuh; cek nilai tak masuk akal; koreksi panjang vs tinggi. **Menu anak tidak dihasilkan tanpa status gizi**; status buruk/pendek/risiko → rujukan. M2: 24–59 bulan, z-score kontinu bila perlu | P0 | S | Kappa vs WHO Anthro |
| A05 | Status gizi ibu `[M3+]` | LiLA (KEK < 23,5 cm), opsional IMT dan kenaikan BB hamil | P1 | S | |
| A06 | Basis data bahan inti `[M1a]` | 300–600 bahan: komposisi, BDD, faktor masak, URT, kelas harga, kelompok pangan, peringatan keamanan, sumber per nilai | P0 | S | Validitas isi (CVI) |
| A07 | Pembangkit menu `[M1a]` | Menu berbasis slot (Pedoman Gizi Seimbang) dengan **heuristik deterministik**, batas porsi, dan penalti pengulangan (M1). LP/HiGHS ditunda sebagai pembanding setelah prototipe (RPT-0004 AUD-0004-06) | P0 | S | % AKG, MAR, biaya |
| A08 | Konteks harian `[M1a]` | Bahan di rumah hari ini, anggaran hari ini, jumlah waktu masak, perangkat masak | P0 | I | |
| A09 | Pemeringkatan multi-kriteria `[M3+]` | Penggeser prioritas (hemat, tinggi besi, mudah masak, mudah didapat); bobot dapat diubah | P1 | I | |
| A10 | Skor NUTRIVA (DITANGGUHKAN setelah audit RPT-0002) `[Tunda]` | Skor 0–100 dengan komponen kecukupan, keamanan, variasi, biaya. **Bobot tidak punya sumber (tingkat bukti D)**; tidak dipakai di M1–M3. Gantinya: tampilkan komponen apa adanya. Bila dihidupkan: label "skor edukatif, bobot pengembang" | P2 | I,A | |
| A11 | Panel "Kenapa menu ini?" `[M1a]` | Penjelasan tiap keputusan: kebutuhan, terpenuhi, kurang, bahan penutup celah | P0 | I,A | |
| A12 | Alternatif bahan `[M1a]` | Tombol "Tidak punya bahan ini": padanan terdekat (profil gizi, kelompok pangan, harga, ketersediaan) | P0 | I | |
| A13 | Hitung ulang `[M1a]` | Benih baru dengan batasan sama; benih ditampilkan dan dapat dimasukkan ulang | P0 | I | |
| A14 | Ukuran rumah tangga `[M1a]` | Semua porsi dalam butir, sendok, centong, potong; konversi gram tersedia di mode ahli | P0 | I | |
| A15 | Keragaman pangan `[M2]` | MDD (anak ≥5 dari 8), MDD-W (ibu ≥5 dari 10) per hari | P0 | S | |
| A16 | Utang gizi bergulir `[M3+]` | Kekurangan 2–3 hari terakhir dikompensasi pada menu berikutnya | P1 | S | |
| A17 | Saran pasangan pangan (DIUBAH setelah audit RPT-0001/0002) `[M3+]` | **Kualitatif saja**: saran penguat (mis. sumber vitamin C) dan penghambat (mis. teh/kopi) tanpa angka serapan. **Tidak boleh menjadi pengali tambahan**: AKG 2019 sudah memuat asumsi bioavailabilitas (besi, seng; Tabel 3 hlm. 14) sehingga akan menghitung ganda | P1 | S,A | Dosen menyetujui kalimat |
| A18 | Celah gizi dan rujukan suplemen `[M1a]` | Menunjukkan zat yang tak tercapai lewat makanan (besi, kalsium, dll.) dan mengarahkan ke TTD/petugas | P0 | I,K | |
| A19 | Tekstur dan tahap usia `[M1a]` | Menu menyesuaikan tekstur dan frekuensi makan menurut usia anak | P0 | S | |
| A20 | Resep singkat `[M3+]` | Langkah masak sederhana dari templat tetap per kombinasi bahan | P1 | I | |

## B. Keamanan Klinis dan Etika

| ID | Fitur | Deskripsi | Prio |
|---|---|---|---|
| B01 | Lapisan keamanan keras `[M1a]` | Aturan yang menyaring bahan sebelum optimasi (ikan mentah, ikan merkuri tinggi, hati berlebih, jamu, madu < 12 bln, risiko tersedak, garam/gula) | P0 |
| B02 | Filter alergi `[M1a]` | Eksklusi alergen yang dipilih pengguna | P0 |
| B03 | Deteksi tanda bahaya `[M1a]` | Aturan baku (perdarahan, kejang, gerak janin berkurang, anak tak mau minum, demam tinggi, dll.) sebelum AI; arahkan ke fasilitas kesehatan | P0 |
| B04 | Penanda kondisi khusus `[M2]` | Pengguna menandai kondisi (diabetes, hipertensi, penyakit ginjal, dll.); aplikasi tidak memberi terapi gizi, menyarankan konsultasi | P0 |
| B05 | Batas atas aman `[M3+]` | Peringatan bila mendekati UL (misalnya retinol) | P1 |
| B06 | Pernyataan batas klinis `[M1b]` | Disclaimer ringkas: edukasi gizi, bukan diagnosis, bukan pengganti petugas | P0 |
| B07 | Persetujuan `[M2]` | Persetujuan informasi, penelitian, dan AI terpisah dan dapat dicabut | P0 |
| B08 | Anonimisasi `[M1a]` | Kode partisipan, tanpa nama lengkap/tgl lahir persis pada data riset | P0 |
| B09 | Penguncian PIN dan layar `[M3+]` | PIN opsional, mode privasi untuk umum | P1 |
| B10 | Gerbang etik data nyata `[M1a]` | **Selama V-PJBL tidak ada data anak/ibu nyata yang dimasukkan, disimpan, atau ditampilkan**, termasuk pada hari H: hanya profil sintetis (F08). Aplikasi menolak/menandai masukan yang tampak seperti identitas (nama, tanggal lahir lengkap) dan menolak ekspor bila profil tidak bertanda sintetis. Data nyata baru boleh setelah persetujuan etik dan persetujuan orang tua (AUD-0004-01) | P0 |
| B11 | Daftar tanda bahaya baku bertanda dosen `[M1a]` | Daftar B03 ditetapkan dan ditandatangani dosen; aplikasi tidak dirilis ke pengguna tanpa itu (gerbang M2; R06) | P0 |
| B12 | Kategori khusus: tandai dan rujuk `[M1a]` | Remaja hamil (< 19 th), usia ibu ekstrem, kehamilan kembar, HPHT tidak diketahui, bayi prematur (usia koreksi), edema bilateral, sindrom tertentu, usia tidak diketahui: **tidak diproses seperti kasus biasa**; ditandai dan dirujuk (R07) | P0 |
| B13 | Pembeda "menu tambahan" dan "menu total" untuk 6–23 bulan `[M1a]` | Tanyakan status ASI; kebutuhan dari makanan pendamping (konsep 200/300/550) dipisahkan dari AKG total (800 kkal pada 6–11 bln) | P0 |
| B14 | Pustaka kalimat terlarang `[M1a]` | Daftar kata/frasa bernada diagnosis atau terapi dan stigma; diuji otomatis pada semua teks keluaran | P0 |

## C. Skrining dan Tindak Lanjut Posyandu (Kader)

| ID | Fitur | Deskripsi | Prio |
|---|---|---|---|
| C01 | Alur ukur terpandu `[M2]` | Langkah pengukuran, posisi ukur, pengecekan kewajaran saat input, minta ukur ulang | P0 |
| C02 | Impor Buku KIA `[M3]` | Input 3–6 catatan penimbangan lalu | P0 |
| C03 | Radar faltering `[Tunda]` | Deteksi lintasan menurun dan tidak naik; tiga level (baik/perhatian/tindak lanjut) | P0 |
| C04 | Kartu tindak lanjut `[M3+]` | Tugas konkret per anak/ibu berisiko dengan tenggat dan penanggung jawab | P1 |
| C05 | Pengingat via WhatsApp `[M3+]` | Tautan `wa.me` dengan templat pesan netral, tanpa diagnosis | P1 |
| C06 | Daftar kerja kader `[M3+]` | "Yang perlu saya temui minggu ini" | P1 |
| C07 | Surat rujukan sederhana `[M3+]` | Ringkasan hasil untuk puskesmas, dicetak/dibagikan | P1 |
| C08 | Ringkasan sesi `[Tunda]` | Statistik hari itu: jumlah, prevalensi, risiko, tindak lanjut | P0 |
| C09 | Dasbor agregat anonim `[M3+]` | Peta risiko per posyandu/desa, tren, indikator proses | P1 |
| C10 | Ekspor laporan `[M3+]` | CSV/PDF format rekap posyandu | P1 |
| C11 | Skor kualitas data kader `[Tunda]` | Tingkat pengulangan ukur, nilai tak wajar | P2 |

## D. Mode Ahli dan Bukti (untuk pengguna skeptis)

| ID | Fitur | Deskripsi | Prio |
|---|---|---|---|
| D01 | Mode Ahli `[M1a]` | Saklar mode yang menampilkan rumus, nilai antara, satuan, dan sumber di setiap langkah | P0 |
| D02 | Jejak perhitungan (trace) `[M1a]` | Daftar langkah: masukan → parameter → aturan → keluaran, tiap langkah punya `claim_id` | P0 |
| D03 | Sitasi otomatis `[M2]` | Referensi [1], [2], ... diurutkan menurut kemunculan, dibuat dari jejak (bukan oleh AI) | P0 |
| D04 | Tombol "Buka sumber" `[M3]` | Membuka berkas sumber di halaman, tabel, dan baris yang tepat dengan sorotan | P0 |
| D05 | Pustaka Sumber `[M3]` | Halaman khusus berisi daftar semua sumber, status verifikasi, hash, lisensi, unduhan | P0 |
| D06 | Tingkat bukti `[M2]` | Label A (regulasi nasional) / B (pedoman WHO/FAO) / C (model peer-review) / D (asumsi pengembang) | P0 |
| D07 | Daftar asumsi dan batasan `[M2]` | Semua asumsi eksplisit dan keterbatasan per hasil | P0 |
| D08 | Analisis sensitivitas `[M3+]` | Berapa banyak hasil berubah bila parameter ±10–20% | P1 |
| D09 | Pembanding standar `[Tunda]` | Hasil dengan standar alternatif (misalnya WHO 2006 vs Permenkes 2/2020) | P2 |
| D10 | Audit Pack `[M1a]` | **V-PJBL: hanya profil sintetis; tanpa masukan per orang nyata (AUD-0004-03).** Ekspor ditolak bila profil tidak bertanda sintetis. Isi (V-KOMPETISI): unduh ZIP berisi masukan, benih, versi mesin, versi data, jejak, sumber, hash, laporan | P0 |
| D11 | Jalankan ulang dan bandingkan `[M3]` | Mereproduksi hasil dari Audit Pack dan menandai identik/berbeda | P0 |
| D12 | Versi dan perubahan `[M3+]` | Versi mesin/data tampil di setiap hasil; riwayat perubahan | P1 |
| D13 | Daftar pustaka otomatis `[M3+]` | Format Vancouver/APA dari metadata sumber | P1 |

## E. Lapisan AI (opsional, di balik saklar)

| ID | Fitur | Deskripsi | Prio |
|---|---|---|---|
| E01 | Penjelas bahasa sederhana `[M3+]` | AI menulis penjelasan hanya dari jejak mesin | P1 |
| E02 | Pertanyaan lanjutan berbentuk chip `[M3+]` | AI mengusulkan pilihan (tekstur, ketersediaan, selera); pilihan menjadi batasan baru bagi mesin | P1 |
| E03 | Validator keluaran AI `[M3+]` | Kode memeriksa angka dan bahan dalam jawaban terhadap jejak; gagal → templat | P1 |
| E04 | Fallback templat `[M1a]` | Penjelasan tanpa AI selalu tersedia | P0 |
| E05 | Filter tanda bahaya sebelum AI `[M5]` | Aturan baku dijalankan lebih dulu | P0 |
| E06 | Cache dan batas laju `[M3+]` | Cache per hash jejak, batas panggilan, server perantara | P1 |
| E07 | Mode suara `[M3+]` | Pembacaan penjelasan (TTS) | P1 |
| E08 | Log kesetiaan AI `[M3+]` | Menyimpan sampel untuk audit manual | P1 |
| E09 | Bahasa daerah `[Tunda]` | Terjemahan penjelasan, ditandai "terjemahan otomatis" | P2 |

## F. Instrumen Riset dalam Aplikasi

| ID | Fitur | Deskripsi | Prio |
|---|---|---|---|
| F01 | Lembar persetujuan digital `[M2]` | Informed consent dengan bukti waktu | P0 |
| F02 | Kuesioner pre/post `[M2]` | Tes pengetahuan, niat, dan kepercayaan diri | P0 |
| F03 | SUS `[M2]` | System Usability Scale dalam aplikasi | P0 |
| F04 | Pengukur waktu dan kesalahan `[M2]` | Waktu tugas dan kesalahan manual vs aplikasi | P0 |
| F05 | Randomisasi A/B `[M3+]` | Penjelasan templat vs AI, dicatat tanpa identitas | P1 |
| F06 | Recall 24 jam `[M3+]` | Input asupan sehari sebelumnya untuk pembanding menu | P1 |
| F07 | Ekspor data riset `[M5]` | CSV anonim dengan kamus data | P0 |
| F08 | Mode demo `[M1a]` | Data sintetis untuk presentasi tanpa data anak asli | P0 |

## G. Pengalaman Pengguna (UX)

| ID | Fitur | Deskripsi | Prio |
|---|---|---|---|
| G01 | Onboarding 3 langkah `[M1b]` | Pilih kategori → isi profil minimal → hasil pertama kurang dari 2 menit | P0 |
| G02 | Pengungkapan bertahap `[M1b]` | Tampilan sederhana lebih dulu, detail dan mode ahli sesuai kebutuhan | P0 |
| G03 | Bahasa sederhana `[M1b]` | Kalimat pendek, setara tingkat baca SMP, tanpa istilah medis tanpa penjelasan | P0 |
| G04 | Pencarian bahan toleran ejaan `[M2]` | Nama lokal, sinonim, salah ketik | P0 |
| G05 | Pilihan, bukan ketik `[M1b]` | Chip, penggeser, tombol besar; ketik hanya bila perlu | P0 |
| G06 | Simpan otomatis dan lanjutkan `[M2]` | Draf tersimpan, dapat dilanjutkan | P0 |
| G07 | Undo dan edit `[M3+]` | Semua pilihan dapat dibatalkan | P1 |
| G08 | Status luring dan sinkron `[M1b]` | Penanda jelas offline/online dan antrean sinkron | P0 |
| G09 | Pesan galat membantu `[M1b]` | Menyebut masalah dan langkah perbaikan | P0 |
| G10 | Keadaan kosong dan loading `[M3+]` | Penjelasan, bukan layar kosong | P1 |
| G11 | Riwayat dan favorit `[M3+]` | Menu yang disukai dapat disimpan | P1 |
| G12 | Berbagi menu `[M3+]` | Kirim menu sederhana via WhatsApp/gambar | P1 |
| G13 | Instal ke layar utama `[M1b]` | PWA, ikon, layar pemuka | P0 |
| G14 | Bantuan kontekstual `[M3+]` | Ikon "?" dengan penjelasan satu kalimat | P1 |
| G15 | Mode Kader vs Mode Keluarga `[M2]` | Antarmuka berbeda untuk alur kerja berbeda | P0 |

## H. Aksesibilitas dan Inklusi

| ID | Fitur | Untuk siapa | Prio |
|---|---|---|---|
| H01 | Kontras minimal WCAG 2.2 AA `[M1b]` | Penglihatan rendah | P0 |
| H02 | Ukuran huruf dapat diatur (100–200%) `[M1b]` | Lansia, penglihatan rendah | P0 |
| H03 | Target sentuh ≥ 48 dp, jarak antar-tombol cukup `[M1b]` | Tangan gemetar, jari besar | P0 |
| H04 | Label pembaca layar (TalkBack) dan urutan fokus logis `[M3+]` | Tunanetra | P1 |
| H05 | Ikon selalu disertai teks; warna bukan satu-satunya penanda `[M1b]` | Buta warna | P0 |
| H06 | Mode bergambar `[M3+]` | Literasi rendah; foto bahan dan porsi nyata | P1 |
| H07 | Keluaran suara (TTS) dan masukan suara `[M3+]` | Literasi rendah, tunanetra, tangan sibuk | P1 |
| H08 | Bahasa Indonesia sederhana + bahasa daerah terpilih `[M3+]` | Penutur bahasa daerah | P1 |
| H09 | Kurangi gerak (`prefers-reduced-motion`) `[M1b]` | Sensitivitas gerak | P0 |
| H10 | Operasi satu tangan `[M1b]` | Menggendong anak | P0 |
| H11 | Hemat data dan HP rendah `[M1b]` | Android murah, kuota terbatas, memori kecil | P0 |
| H12 | Luring penuh untuk inti `[M1b]` | Daerah tanpa sinyal | P0 |
| H13 | Pengasuh lain `[M3+]` | Nenek, ayah, pengasuh bisa memakai tanpa akun | P1 |
| H14 | Pilihan kehalalan, vegetarian, pantangan budaya `[M3+]` | Keyakinan dan budaya | P1 |
| H15 | Uji dengan pengguna nyata `[M4]` | Kader dan ibu ikut menguji sebelum rilis | P0 |

## I. Kewirausahaan dan Keberlanjutan

| ID | Fitur | Deskripsi | Prio |
|---|---|---|---|
| I01 | Harga oleh kader `[M3+]` | Kader memperbarui kelas harga setempat | P1 |
| I02 | Peta ketersediaan lokal `[M3+]` | Bahan tersedia per desa/warung | P1 |
| I03 | Paket bahan `[M3+]` | Daftar belanja dari menu, bisa dikirim ke warung/UMKM | P1 |
| I04 | Laporan desa/puskesmas `[M3+]` | Ringkasan risiko dan kebutuhan intervensi | P1 |
| I05 | Dasbor biaya diet `[Tunda]` | Biaya diet bergizi per desa | P2 |
| I06 | Mode merek putih `[Tunda]` | Logo posyandu/puskesmas | P2 |
| I07 | Kanvas bisnis dan wawancara pasar `[Tunda]` | Data kesediaan membayar dari kader dan bidan | P0 |

## J. Non-Fungsional

| ID | Persyaratan | Prio |
|---|---|---|
| J01 | PWA offline-first (IndexedDB), sinkron saat daring `[M1b]` | P0 |
| J02 | Uji otomatis dengan 30+ kasus baku sebelum rilis `[M1a]` | P0 |
| J03 | Enkripsi data lokal, tanpa data pribadi di log `[M3+]` | P1 |
| J04 | Kepatuhan UU PDP 27/2022 `[M1b]` | P0 |
| J05 | Anggaran performa (muat < 3 dtk di 3G, ukuran inti kecil) `[M1b]` | P1 |
| J06 | Pencatatan audit untuk perubahan basis data dan aturan `[M3+]` | P1 |
| J07 | Konfigurasi data terpisah dari kode (mudah divalidasi ahli) `[M1a]` | P0 |
| J08 | Dokumentasi mesin sebagai lampiran skripsi `[M2]` | P0 |
| J09 | Versi minimum aturan keamanan `[M1b]` | Service worker/cache tidak boleh menyajikan aturan keamanan lama; ada nomor versi minimum dan paksa muat ulang (R08) | P0 |
| J10 | Mode kader dengan kunci sesi `[M2]` | HP bersama: kunci sesi, penghapusan otomatis, tidak ada data lintas keluarga (R10) | P0 |
| J11 | Threat model teknis `[M3+]` | Impor QR/JSON, penyimpanan lokal, XSS, prototype pollution; dikaitkan ke fitur dan diuji (R15) | P1 |
| J12 | Uji determinisme lintas peramban `[M1a]` | Hasil identik pada presisi tampilan di Chrome, Firefox, Safari, dan Node (R05) | P0 |
| J13 | Kebijakan nilai harapan kasus baku `[M1a]` | Nilai harapan 30+ kasus baku berasal dari WHO Anthro/tabel resmi dan perhitungan tangan, disetujui dosen; **bukan dari keluaran mesin sendiri** | P0 |

---

## Rancangan Mesin Sumber dan Bukti (Provenance Engine)

**Prinsip:** sitasi tidak pernah dibuat oleh AI. Sitasi dilekatkan pada data dan aturan saat dibuat, lalu dirakit otomatis dari jejak perhitungan.

### 1. Registri Sumber (`sources.json`)
Tiap sumber memiliki: `source_id`, jenis (regulasi, pedoman, jurnal, basis data), penerbit, judul, edisi/tahun, DOI/URL, tanggal akses, lisensi, `boleh_redistribusi`, berkas lokal, **SHA-256**, tingkat bukti (A–D).

### 2. Locator berkoordinat
Setiap rujukan menunjuk lokasi tepat:
```
{ source_id, halaman, tabel, baris, kolom, kutipan_pendek, bbox: [x0,y0,x1,y1] }
```
`bbox` dipakai untuk menyorot area di halaman PDF.

### 3. Registri Klaim (`claims`)
Setiap konstanta, ambang, rumus, nilai data, dan asumsi punya `claim_id`, tipe (nilai / rumus / ambang / **asumsi**), dan satu atau lebih locator. Asumsi pengembang berlabel tingkat D dan ditampilkan apa adanya.

### 4. Verifikator saat build (skrip)
1. Berkas sumber ada dan SHA-256 cocok.
2. Ekstrak teks halaman rujukan; kutipan dan angka harus ditemukan (untuk PDF hasil pindai: OCR, ditandai kepercayaan lebih rendah).
3. **Build gagal** bila ada aturan, nilai, atau konstanta tanpa klaim.
4. Status per klaim: `teks-ditemukan-mesin` / `terverifikasi-manusia (nama, tanggal, versi)` / `belum`. (Nama diubah setelah audit RPT-0002: "terverifikasi-mesin" bisa disalahbaca sebagai "benar", padahal hanya membuktikan teks ada di lokasi tersebut.)
5. Peringatan sumber yang usang.

### 5. Saat aplikasi berjalan
- Jejak hasil memuat `claim_id` di setiap langkah.
- Penata referensi menyusun [1], [2], ... otomatis.
- "Buka sumber" membuka penampil PDF (PDF.js) pada halaman dan sorotan bbox. Bila lisensi tidak membolehkan penyertaan berkas, tampilkan tautan DOI/URL, kutipan pendek, dan nilai yang dipakai.
- **Pustaka Sumber:** daftar, filter tingkat bukti dan status verifikasi, hash, lisensi, unduh.

### 6. Audit Pack dan reproduksi
ZIP berisi: `input.json`, benih, versi mesin, versi data, `trace.json`, subset `sources.json`, manifes hash, laporan PDF. Tombol **Jalankan ulang** membandingkan hasil baru dengan hasil tersimpan.

### 7. Keterbatasan yang harus diakui
- Tidak semua sumber boleh disertakan sebagai berkas (jurnal berhak cipta): untuk itu cukup tautan DOI dan kutipan pendek.
- `bbox` dibuat semi-otomatis (skrip mengusulkan, manusia mengonfirmasi); PDF pindai (misalnya TKPI) lebih sulit dan butuh kurasi manual.
- Verifikasi mesin hanya membuktikan teks ada di lokasi tersebut, **bukan** bahwa tafsirannya benar. Karena itu ada status "terverifikasi manusia" oleh ahli gizi.
- Ukuran paket sumber memengaruhi mode luring, jadi sediakan unduhan opsional.

---

## K. Fitur Tambahan Usulan (menunggu persetujuan)

| ID | Fitur | Deskripsi | Prio |
|---|---|---|---|
| K01 | **Perbaikan Satu Langkah** `[M3]` | Dari menu/recall ibu, cari perubahan terkecil yang menutup celah (misalnya "tambah 1 butir telur → keragaman tercapai"), terjangkau dan tersedia | P0 |
| K02 | **Cek Menu Saya** `[M3]` | Ibu memasukkan apa yang dimasak/dimakan; aplikasi menilai kecukupan secara langsung (sekaligus instrumen recall F06) | P0 |
| K03 | **Harga Celah dan Keterjangkauan** `[M3+]` | Dari harga bayangan LP: biaya menutup tiap celah, zat gizi termahal hari ini, dan rasio anggaran terhadap biaya diet bergizi | P1 |
| K04 | **Mesin sadar-ketidakpastian** `[M3+]` | Bila usia/berat tidak pasti (tanggal lahir perkiraan, timbangan gantung), hasil tampil sebagai rentang dengan penanda keandalan | P1 |
| K05 | **Kalibrasi Dapur** `[M3+]` | Ibu mengkalibrasi sendok/mangkuk/centong miliknya (ditimbang kader sekali), menghasilkan konversi gram pribadi | P1 |
| K06 | **Verifikasi silang internal (self-check)** `[M1a]` | Setiap hasil dihitung ulang dari nol lewat jalur kode independen; selisih di atas toleransi menolak hasil | P0 |
| K07 | **Cek kalibrasi timbangan harian** `[M3+]` | Kader mencatat bobot referensi sebelum sesi; peringatan bila penyimpangan melebihi toleransi | P1 |
| K08 | **Linimasa 1000 Hari** `[M3+]` | Hari ke-N dari 1000 (dari HPHT/HPL atau tanggal lahir), tonggak gizi, dan "yang perlu dilakukan minggu ini" | P1 |
| K09 | **Paspor Pangan Anak** `[M3+]` | Catatan bahan yang sudah dicoba, tantangan 8 kelompok pangan, pengenalan alergen terpandu dan pemantauan reaksi | P1 |
| K10 | **Pelacak kepatuhan TTD dan suplemen** `[M3+]` | Kalender sederhana, pengingat, tips efek samping berbasis aturan | P1 |
| K11 | **Kartu QR portabel** `[Tunda]` | Serah-terima data ibu-anak terenkripsi lewat kode QR antar HP tanpa internet | P2 |
| K12 | **Akademi Kader** `[Tunda]` | Kasus baku diubah menjadi kasus latihan dengan kunci jawaban dan skor (data kompetensi kader) | P2 |
| K13 | **Fakta Hari Ini** `[M3+]` | Pemeriksa fakta mikro sesuai tahap/hari ke-N, juga sebagai pengungkit skor pengetahuan | P1 |
| K14 | **Hak Data Saya** `[M1b]` | Unduh dan **hapus** seluruh data lokal dalam satu tindakan (M1: tombol "Hapus semua data di perangkat ini"); unduh data milik ibu untuk V-KOMPETISI (sesuai UU PDP) | P0 |

## L. Desain, Estetika, dan Kenyamanan (ditegaskan pemilik; disempurnakan di sesi desain khusus)

Konsep: **modern, minimalis**, palet **kontras semi-kuat** yang **konsisten di setiap halaman**.

| ID | Fitur | Deskripsi | Prio |
|---|---|---|---|
| L01 | Sistem desain berbasis token `[M1b]` | Warna, tipografi, spasi, radius, bayangan, gerak dalam satu sumber; semua komponen mengambil dari token | P0 |
| L02 | Palet kontras semi-kuat `[M1b]` | Primer, netral, aksen, dan status aman/perhatian/segera; teks ≥ 4,5:1, elemen UI ≥ 3:1; tidak bergantung warna saja; uji buta warna | P0 |
| L03 | Tipografi `[M1b]` | Skala modular, terbaca di HP kecil, font ringan, angka tabular untuk nilai gizi | P0 |
| L04 | Pustaka komponen `[M1b]` | Tombol, kartu, chip, input, bilah progres, modal, toast, tabel; semua keadaan (normal, fokus, tekan, nonaktif, galat, memuat, kosong) | P0 |
| L05 | Tata letak minimalis `[M1b]` | Satu tindakan utama per layar, ruang putih, hierarki jelas, pengungkapan bertahap | P0 |
| L06 | Ikonografi dan ilustrasi `[M3+]` | Set ikon konsisten (ikon + teks), ilustrasi SVG ringan selaras identitas | P1 |
| L07 | Mikro-interaksi `[M3+]` | Transisi halus yang menjelaskan perubahan; patuh `prefers-reduced-motion` | P1 |
| L08 | Kenyamanan ergonomis `[M1b]` | Zona jempol, navigasi bawah, satu tangan, target ≥ 48 dp | P0 |
| L09 | Mode terang/gelap `[M3+]` | Dua tema dari palet yang sama, kontras tetap lulus | P1 |
| L10 | Identitas visual `[M3+]` | Logo, ikon PWA, layar pembuka, nada visual yang hangat dan tidak menghakimi | P1 |
| L11 | Visual status yang empatik `[M1b]` | Penyajian skor/risiko yang tidak menstigma ibu atau anak | P0 |
| L12 | Panduan gaya dan pratinjau komponen `[M1b]` | Dokumen gaya tertulis + halaman pratinjau hidup | P0 |
| L13 | Konsistensi dan regresi visual `[M3+]` | Audit lintas-halaman (A-UX) dan tangkapan baseline otomatis | P1 |
| L14 | Anggaran performa visual `[M3+]` | Batas bobot font/gambar/animasi untuk HP murah | P1 |

## Usulan ruang lingkup bertahap

1. **Fondasi (P0 inti):** A01–A04, A06–A15, A18–A19, B01–B03, B06–B08, D01–D05, D10–D11, E04–E05, F01–F04, F07–F08, G01–G06, G08–G09, G13, G15, H01–H03, H05, H09–H12, H15, J01–J02, J04, J07–J08.
2. **Pembeda (P1):** radar faltering, tindak lanjut, bioavailabilitas, utang gizi, lapisan AI, suara, harga kader.
3. **Lanjutan (P2):** dasbor biaya, bahasa daerah, merek putih, pembanding standar.
