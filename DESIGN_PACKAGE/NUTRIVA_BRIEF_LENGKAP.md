# NUTRIVA — Brief Ringkas untuk Claude Design (tempel langsung)

## Bahasa Indonesia

Rancanglah wajah dan pengalaman **NUTRIVA**, aplikasi gizi 1000 Hari Pertama Kehidupan untuk **ibu, keluarga, dan kader posyandu** di Indonesia. Pengguna menjawab beberapa pertanyaan tentang anak (tahap pertama: usia 6–23 bulan; kelak ibu hamil dan menyusui); aplikasi **menghitung** kebutuhan gizi dari standar resmi, menilai kecukupan, dan menyusun **contoh pola makan** yang terjangkau dengan pengaman keselamatan ketat. Ada **Mode Ahli** yang membuka rumus, asumsi, dan **sumber berkoordinat** untuk pengguna skeptis (dosen penguji). Perhitungannya deterministik, bukan AI yang menebak. Berjalan **offline** di HP Android murah, di bawah matahari posyandu, sering dengan satu tangan.

**Kebebasan Anda hampir penuh.** Kami tidak menentukan palet, tipografi, bentuk, tata letak, ikon, ilustrasi, bahasa gerak, atau metafora. Kami tidak punya gambar tujuan; jangan mulai dari tren aplikasi kesehatan. Kami menginginkan sesuatu yang **inovatif dan baru**.

**Arah pemilik (aspirasi, boleh ditafsir berani):** keterbacaan di atas segalanya; modern dan minimalis; kontras cukup tegas tetapi tidak keras dan konsisten di semua halaman; estetika interaktif; animasi relevan dan bermakna (menunjukkan sebab-akibat); efek yang pas; desain proyektif yang mampu menampung mode, fitur, perangkat, dan bahasa baru tanpa dirombak.

**Batas mutlak (singkat; lengkap di `05_BATAS_MUTLAK.md`):** saat tanda bahaya/kategori khusus aplikasi berhenti memberi pola makan dan merujuk ke petugas; tanpa bahasa diagnosis/terapi/dosis; label prototipe tertanam di setiap keluaran (termasuk tangkapan layar); "tidak ada data" bukan nol; hasil tidak layak ditampilkan jujur; tanpa skor yang menghakimi; AI (kelak) terpisah jelas dari hitungan; kontras WCAG 2.2 AA pada semua keadaan; makna tak bergantung pada warna; target sentuh ≥ 48 dp, satu tangan; teks sampai 200%; patuh reduced-motion; angka berformat Indonesia (koma); offline-first, ringan, tanpa layanan eksternal; satu sistem untuk profil `demo` dan `lapangan`.

**Yang diharapkan:** satu arah kuat (opsional dua alternatif berani), sistem desain dengan semua keadaan komponen, layar kunci (HP + laptop/proyektor), keadaan khusus, bahasa gerak (termasuk reduced-motion), konsep proyektif untuk 3–5 arah pertumbuhan, dan catatan keputusan. Bila mungkin, prototipe interaktif alur inti.

Baca paket lengkap: `00_BACA_DULU.md` … `07_PENGIRIMAN_DAN_EVALUASI.md`.

## English (short)

Design the look and experience of **NUTRIVA**, an Indonesian first-1000-days nutrition app for **mothers, families and community health volunteers (kader)**. Users describe a child (first release: 6–23 months; later pregnant and breastfeeding women); the app **calculates** nutrient needs from official standards, shows adequacy, and composes **affordable example meal patterns** with strict safety guards. An **Expert Mode** exposes formulas, assumptions and **coordinate-level sources** for skeptical users (examiners). The engine is deterministic, not guessing AI. It runs **offline** on low-end Android phones, in bright sun, often one-handed.

**You have near-total freedom**: palette, type, shape, layout, icons, illustration, motion language and metaphor are yours. We have no target image — do not start from health-app trends. We want something **innovative and new**.

**Owner's aspirations:** readability first; modern and minimal; contrast firm but not harsh, consistent across pages; interactive aesthetics; relevant, meaningful animation (showing cause and effect); fitting effects; a **projective** system that absorbs new modes, features, devices and languages without a redesign.

**Non-negotiables (see `05_BATAS_MUTLAK.md`):** on danger signs the app stops suggesting meals and refers to a health worker; no diagnostic/therapeutic language or doses; prototype label embedded in every output (incl. screenshots); "no data" is never zero; infeasible results shown honestly; no judgmental scores; future AI visibly separate from calculation; WCAG 2.2 AA contrast in all states; meaning never by color alone; ≥48 dp targets, one-handed; text to 200%; reduced-motion; Indonesian number format (decimal comma); offline-first, lightweight, no external services; one system for `demo` and `lapangan` profiles.

**Deliver:** one strong direction (optionally two bold alternatives), a design system with all component states, key screens (phone + laptop/projector), special states, a motion language (incl. reduced-motion), projective concepts for 3–5 growth directions, and a decision log. Interactive prototype of the core flow if possible.

---

# NUTRIVA — Paket Brief untuk Claude Design

Versi 1.0 · 2026-10-28 · Bahasa: Indonesia (ringkasan Inggris ada di `BRIEF_RINGKAS.md`)

## Sambutan

Anda diundang merancang wajah dan pengalaman sebuah aplikasi gizi untuk **ibu, keluarga, dan kader posyandu** di Indonesia. Kami **sengaja tidak membawa gambar tujuan**, palet, font, atau tata letak yang harus ditiru. Kanvasnya milik Anda. Yang kami bawa adalah: kenyataan lapangan, hal-hal yang tidak boleh dilanggar (karena menyangkut keselamatan anak dan ibu), aspirasi pemilik, dan gambaran ke mana aplikasi ini akan tumbuh.

Kami ingin sesuatu yang **inovatif dan baru**, bukan "aplikasi kesehatan yang rapi" yang sudah pernah kita lihat. Silakan ambil risiko desain, asalkan ia tetap terbaca di bawah matahari posyandu oleh orang yang sedang menggendong anak.

## Tiga tingkat kebebasan

| Tingkat | Artinya | Di mana |
|---|---|---|
| **MUTLAK** | Tidak boleh dilanggar; alasannya keselamatan, aksesibilitas, atau hukum. Satu halaman, dengan alasan tiap butir | `05_BATAS_MUTLAK.md` |
| **ARAH PEMILIK** | Aspirasi pemilik produk. Tafsirkan seberani mungkin; bila Anda punya argumen kuat untuk menyimpang, sampaikan alasannya | di bawah, dan `01_` |
| **BEBAS** | Segala yang lain: bahasa visual, warna, tipografi, bentuk, grid, ikon, ilustrasi, bahasa gerak, metafora interaksi, struktur navigasi, nama sistem desain | seluruhnya milik Anda |

### Arah pemilik (aspirasi, bukan resep)
- **Keterbacaan** adalah mata uang utama.
- **Modern dan minimalis**, dengan **kontras yang cukup tegas tetapi tidak keras**, dan **konsisten di setiap halaman**.
- **Estetika interaktif:** layar yang terasa hidup dan menjelaskan dirinya sendiri.
- **Animasi yang relevan dan sesuai**, dan **efek yang pas**: gerak harus bermakna (menunjukkan sebab-akibat, perubahan, perhatian), bukan hiasan.
- **Inovatif dan baru.**
- Desain harus **proyektif**: mampu menampung fitur dan fungsi yang akan datang tanpa dirombak (lihat `06_`).

## Cara memakai paket ini
1. Baca `BRIEF_RINGKAS.md` untuk gambaran satu halaman.
2. Baca `01_` sampai `04_` untuk memahami produk, orang, dan kebutuhan.
3. Baca `05_` sampai tuntas sebelum membuat apa pun: di sinilah batasnya.
4. `06_` memberi arah pertumbuhan; `07_` memuat apa yang kami harapkan dan bagaimana kami menilai.

## Hal yang sengaja tidak kami tentukan
Warna; tipografi; bentuk dan sudut; bayangan/efek; ikonografi; gaya ilustrasi (atau tanpa ilustrasi); jumlah dan bentuk navigasi; apakah ada maskot; apakah gelap atau terang jadi tampilan utama; metafora utama antarmuka (kartu? garis waktu? piring? ruang?). Semua terbuka.

## Satu catatan jujur
Ada desain lama (V6: hijau hutan, kaca/glass) dari prototipe sebelumnya. Itu **tidak mengikat** dan sebaiknya dilupakan sama sekali; ia kami sebut hanya supaya Anda tahu bahwa tidak ada warisan visual yang harus dipertahankan.

---

# 01 — Konteks Produk

## Apa itu NUTRIVA
Mesin gizi untuk **1000 Hari Pertama Kehidupan** (dari kehamilan sampai anak berusia 2 tahun). Pengguna menjawab beberapa pertanyaan sederhana tentang diri atau anaknya; aplikasi **menghitung** kebutuhan gizi berdasarkan standar resmi Indonesia, menilai kecukupan, lalu menyusun **contoh pola makan** dari bahan yang terjangkau dan tersedia, dengan pengaman keselamatan yang ketat.

Tahap pertama hanya untuk **anak usia 6–23 bulan** (masa makanan pendamping ASI). Tahap berikutnya: **ibu hamil** dan **ibu menyusui**, lalu skrining pertumbuhan untuk kader.

## Apa yang membuatnya berbeda (inti pengalaman)
1. **Terbuka dan dapat diperiksa.** Setiap angka dapat ditelusuri: rumusnya, nilai antaranya, dan sumbernya (dokumen, halaman, tabel). Ada **Mode Ahli** untuk pengguna skeptis seperti dosen penguji.
2. **Bukan kecerdasan buatan yang menebak.** Perhitungannya deterministik: masukan yang sama selalu memberi hasil yang sama. AI (kelak) hanya menjelaskan dengan bahasa sederhana dan tidak pernah membuat angka atau keputusan keselamatan.
3. **Offline-first.** Dipakai di posyandu dengan sinyal buruk di HP Android murah.
4. **Jujur tentang batas.** Ia edukasi dan alat bantu hitung, bukan diagnosis, bukan pengganti bidan/dokter/Buku KIA. Bila ada tanda bahaya, aplikasi **berhenti memberi menu** dan mengarahkan ke fasilitas kesehatan.
5. **Personalisasi tanpa data berlebihan:** usia, status ASI, alergi, anggaran, bahan di rumah.
6. **Alternatif yang realistis:** "Tidak punya bahan ini?" → padanan terdekat; "Hitung ulang" → variasi yang tetap bisa direproduksi lewat kode benih.

## Siapa yang membuat dan mengapa
Proyek mahasiswa kedokteran untuk blok gizi (PjBL; topik 1000 HPK dan kewirausahaan), dengan niat menjadi **produk nyata** untuk kader dan keluarga, kelak diajukan ke kompetisi inovasi kesehatan. Diverifikasi oleh dosen ahli gizi. Dikembangkan dengan audit independen pada tiap langkah.

## Status dan dua profil
| Profil | Isi | Dampak desain |
|---|---|---|
| **demo** | Kasus preset tetap, tanpa teks bebas, tanpa ekspor, tanpa riwayat. Label pada setiap keluaran: *"Prototipe PjBL — belum diverifikasi dosen; bukan pengganti petugas kesehatan"*, juga tertanam di tangkapan layar/cetak | Dipakai di presentasi dan peragaan; harus tetap memikat walau masukannya terbatas |
| **lapangan** | Data nyata, consent, penyimpanan lokal, ekspor, mode kader, tindak lanjut. **Terkunci** sampai izin etik/institusi dan tanda tangan dosen ada | Antarmuka penuh; harus terasa tenang walau menangani data sensitif |

Satu sistem desain harus melayani kedua profil.

## Nada yang kami harapkan (bukan gaya visual)
Tenang, hangat, tepercaya, tidak menghakimi, tidak menggurui; memberi rasa "saya mengerti" tanpa membanjiri; di saat darurat tegas tanpa menimbulkan panik. Hindari kesan klinis yang dingin dan kesan "gamifikasi" yang membuat ibu merasa dinilai.

## Tahap pembangunan (supaya Anda tahu apa yang nyata dan apa yang proyeksi)
- **Sekarang (M1):** anak 6–23 bulan: profil → status gizi → contoh pola makan → kecukupan → jejak/sumber (Mode Ahli) → peringatan keselamatan.
- **Berikutnya:** ibu hamil/menyusui; instrumen kegunaan (kuesioner, SUS); pelacak TTD; paspor pangan anak; linimasa 1000 hari.
- **Nanti:** skrining dan radar pertumbuhan untuk kader, tindak lanjut, harga dan ketersediaan lokal, dasbor desa, penjelas AI, bahasa daerah, suara, serah-terima data via QR. Lihat `06_`.

---

# 02 — Pengguna dan Konteks Pemakaian

Persona di bawah **fiktif** (komposit rancangan), dibuat agar Anda dapat membayangkan keadaan nyata. Silakan tambah, ubah, atau tantang.

## Orang-orangnya

### Sari, 28 tahun — ibu muda
Anak pertamanya 9 bulan. HP Android murah, layar retak sedikit, baterai cepat habis. Sinyal datang-pergi. Membaca cepat, jarang mau membaca paragraf. **Mudah merasa dinilai** ("anak saya kurang gizi?"). Ingin tahu satu hal: *apa yang sebaiknya saya masak hari ini dengan uang sekian?* Takut salah memberi makanan.

### Bu Wati, 46 tahun — kader posyandu
Mengurus puluhan anak dalam beberapa jam. Satu tangan memegang timbangan atau bayi, satu tangan memegang HP. Di bawah tenda, di bawah sinar matahari, kacamata baca. Tidak sabar pada layar rumit; takut salah catat di depan ibu-ibu. Ingin cepat, jelas, dan bisa dipercaya. Kelak ia membutuhkan daftar anak dan tugas tindak lanjut.

### Mbah Yem, 62 tahun — nenek pengasuh
Penglihatan menurun, bahasa sehari-hari Jawa, jarang membaca teks panjang, percaya ke gambar dan suara. Kadang dialah yang menyuapi cucunya. Ia tidak membuka aplikasi sendiri; ia melihat layar yang ditunjukkan anak atau kader. (Proyeksi: bahasa daerah dan suara.)

### Dr. Rini — dosen ahli gizi, penguji
Skeptis yang sehat. Ingin membuka "kenapa menu ini?", memeriksa angka, melihat sumber dan asumsi, dan menemukan di mana aplikasi mungkin keliru. Membaca teliti di laptop atau proyektor. Ia **menyukai** keterbukaan dan **menghukum** keangkuhan.

### Dimas — mahasiswa presenter
Mendemokan di depan penguji dengan proyektor, kadang di ruangan terang, kadang jaringan mati. Butuh alur yang sanggup memikat dalam lima menit dan tidak gagal di depan umum.

### Proyeksi
Bidan desa; kepala desa/puskesmas melihat dasbor ringkas; orang tua yang tidak melek huruf; pengguna tunanetra atau dengan gangguan motorik tangan.

## Keadaan nyata pemakaian
- **Layar:** terutama HP Android 360–412 px lebar, kadang tablet kader, kadang laptop/proyektor untuk presentasi.
- **Cahaya:** sinar matahari langsung di tenda posyandu; ruang gelap di rumah malam hari.
- **Tangan:** sering satu tangan; ibu sambil menggendong; jempol sebagai alat utama.
- **Jaringan:** putus-putus atau tidak ada. Aplikasi harus berfungsi sepenuhnya tanpa jaringan.
- **Perangkat:** RAM kecil, prosesor lambat; animasi berat atau gambar besar akan terasa lambat.
- **Literasi:** beragam. Angka dan persentase tidak selalu mudah dipahami; kalimat pendek dan gambar membantu.
- **Waktu:** kader hanya punya hitungan detik per anak; ibu punya perhatian yang mudah teralih.
- **Emosi:** takut salah, malu, lelah, kadang cemas pada kondisi anak.
- **Bahasa:** Indonesia; angka berformat Indonesia (desimal koma: "12,5"); proyeksi bahasa daerah.

## Tujuan emosional (yang ingin dirasakan pengguna)
- *"Saya tahu apa yang harus dilakukan sekarang."*
- *"Saya tidak dihakimi."*
- *"Saya bisa percaya ini, dan kalau ragu saya bisa memeriksanya."*
- *"Kalau ada bahaya, saya langsung tahu dan tidak ditinggal sendirian."*
- *"Ini terasa dibuat dengan perhatian."* (bukan generik)

## Yang kami takutkan terjadi
- Ibu merasa gagal karena tampilan "merah/rendah".
- Kader salah baca dalam terik matahari.
- Orang menangkap layar contoh dan mengira itu nasihat untuk anaknya.
- Penguji merasa dibodohi oleh tampilan yang indah tetapi tidak jujur.
- Layar yang cantik tetapi lambat di HP murah.

---

# 03 — Tugas Pengguna dan Alur (bukan tata letak)

Berikut **apa yang perlu bisa dilakukan orang**, bukan bagaimana layarnya harus tersusun. Bentuk, urutan, dan metafora sepenuhnya milik Anda. Status: **[Sekarang]** dibangun lebih dulu · **[Segera]** setelah itu · **[Proyeksi]** konsep untuk dirancang agar sistem siap menampungnya.

## A. Inti [Sekarang] — anak 6–23 bulan

**A1. Masuk dan memahami konteks.** Pengguna memahami dalam hitungan detik: apa ini, untuk siapa, apa batasnya; dalam profil `demo` melihat label prototipe; memilih konteks (kini: anak 6–23 bulan; kelak hamil dan menyusui). Instal ke layar utama (PWA). Status luring/daring terlihat jelas.

**A2. Menceritakan keadaan anak** (profil). Informasi: usia dalam bulan, jenis kelamin, berat badan, panjang/tinggi dan cara mengukurnya, **status ASI (wajib)**, lahir prematur?, bengkak pada kedua kaki/wajah?, kondisi atau sindrom khusus?, usia diketahui pasti?, alergi, anggaran makan per hari, bahan yang ada di rumah. Masukan harus terasa ringan, bukan formulir. Angka berformat Indonesia (koma). Nilai tak masuk akal ditangani dengan ramah ("ukur ulang?"). Pada profil `demo` masukannya berupa **preset tetap**, bukan ketikan.

**A3. Mengetahui status gizi anak.** Hasil klasifikasi berat/panjang menurut usia dari tabel resmi (kategori bernama resmi, mis. "berat badan kurang", "pendek"). Disampaikan **tanpa menghakimi**, dengan arti dan langkah berikut. Bila status berat atau ada kategori khusus (prematur, bengkak, sindrom, usia tidak pasti): **berhenti memberi menu → rujukan** ke petugas kesehatan.

**A4. Mendapat contoh pola makan.** Hasil: pola makan sehari/beberapa kali makan dalam "slot" (sumber karbohidrat, lauk hewani, lauk nabati, sayur, buah), dengan **ukuran rumah tangga** (butir, sendok makan, centong, potong), tekstur sesuai usia, **dan** tanpa bahan yang berbahaya atau berpotensi alergen sesuai masukan. Pengguna dapat:
- mengganti satu bahan ("Tidak punya ini") → padanan terdekat yang terjangkau;
- meminta variasi ("Hitung ulang") yang tetap bisa direproduksi (kode benih tampil);
- melihat biaya perkiraan (kelas harga), bukan harga pasti.
Istilah di antarmuka: **"contoh pola makan dari aturan"**, bukan "rekomendasi menu" (sampai dosen menandatangani).

**A5. Memahami kecukupan gizi.** Seberapa besar kebutuhan harian dari standar tercukupi (persentase AKG) per zat, **celah** yang tersisa, dan apa artinya. Untuk 6–11 bulan: bedakan **total kebutuhan (termasuk ASI)** dan **bagian dari makanan pendamping**. Bila celah tidak dapat ditutup dari makanan (mis. zat besi), arahkan ke "tanyakan petugas tentang suplemen", **tanpa menyebut dosis**. Ketidakpastian dan "tidak ada data" harus bisa ditampilkan jujur (rentang; "belum ada data" ≠ nol).

**A6. Bertanya "Kenapa?".** Panel yang menjelaskan keputusan: kebutuhan, apa yang terpenuhi, apa kurang, mengapa bahan ini, aturan keselamatan apa yang lolos/menyaring bahan. Bahasa awam di lapisan pertama.

**A7. Mode Ahli (pemeriksaan).** Untuk pengguna skeptis: rumus, nilai antara, satuan, versi mesin dan data, kode benih, **asumsi dan batasan**, dan **sumber berkoordinat** (dokumen, halaman, tabel) dengan **status verifikasi** (`teks-ditemukan-mesin`, `terverifikasi-manusia`, `belum`) serta **tingkat bukti** (A regulasi nasional, B pedoman WHO/FAO, C model terbit, D asumsi pengembang). Daftar semua sumber ("Pustaka Sumber"). Bisa membandingkan hasil dengan menjalankan ulang. Harus bisa dibaca serius oleh dosen di laptop **tanpa** mengganggu pengguna biasa.

**A8. Keselamatan dan tanda bahaya.** Daftar tanda bahaya (mis. kejang, sulit bernapas, tidak mau minum, lemas luar biasa) → layar yang **tegas, tenang, tidak bisa terlewat**: "bawa ke fasilitas kesehatan hari ini". Aplikasi tidak melanjutkan ke menu. Tidak boleh terasa seperti diagnosis atau menakut-nakuti.

**A9. Tentang, label, hak data.** Memahami batas aplikasi; label prototipe; menghapus semua data di perangkat dalam satu tindakan (profil lapangan); versi aturan dan pembaruan yang diperlukan.

## B. Keadaan yang harus dirancang (bukan hanya jalur mulus)
Kosong · memuat · luring · aturan keselamatan kedaluwarsa (wajib perbarui sebelum memberi menu) · galat masukan · hasil **tidak layak** (mis. tidak ada kombinasi yang menutup zat tertentu → tampilkan celah dengan jujur, jangan menu ajaib) · data tidak tersedia · rujukan/blokir · sesi berakhir/hapus data · layar sangat kecil · teks diperbesar 200% · mode gerak dikurangi · cetak/tangkapan layar (label harus ikut).

## C. [Segera] — setelah inti
- **Ibu hamil dan menyusui:** trimester/usia kandungan, LiLA, kebutuhan tambahan; jalur keselamatan makanan yang berbeda. Rujukan, bukan terapi, untuk kondisi seperti diabetes kehamilan.
- **Instrumen kegunaan:** persetujuan, kuesioner singkat sebelum/sesudah, SUS, pengukur waktu tugas, tanpa menanyakan data anak.
- **Pelacak tablet tambah darah** (tanpa dosis; pengingat dan kebiasaan).
- **Paspor pangan anak:** bahan yang sudah dicoba, kelompok pangan, pengenalan alergen terpandu.
- **Linimasa 1000 hari:** hari ke-N, tonggak, "yang perlu dilakukan minggu ini".
- **Fakta Hari Ini:** pemeriksa mitos/fakta berbasis aturan, bersumber.

## D. [Proyeksi] — rancang ruang untuknya
- **Kader:** sesi posyandu, daftar anak (kode, tanpa nama), alur ukur terpandu, deteksi dini pertumbuhan melambat, daftar tugas tindak lanjut, pengingat via tautan WhatsApp.
- **Harga dan ketersediaan lokal** yang diperbarui kader; **Harga Celah**: biaya menutup tiap celah gizi.
- **Dasbor desa/puskesmas** (agregat anonim): sebaran status, kebutuhan intervensi, biaya diet bergizi.
- **Penjelas AI** (opsional, tidak pernah menentukan angka): menjelaskan dengan bahasa sederhana dan mengajukan pertanyaan lanjutan dalam bentuk pilihan; harus **terlihat jelas terpisah** dari hasil deterministik.
- **Bahasa daerah, suara (baca-keras dan masukan suara), mode bergambar** untuk literasi rendah.
- **Serah-terima data tanpa internet** lewat kode QR antar HP.
- **Kalibrasi dapur:** ibu mengkalibrasi sendok/mangkuknya agar porsi pas.
- **Akademi kader:** latihan dari kasus sintetis.
- Perangkat lain: tablet, layar proyektor, cetak (kartu rujukan), mode kios di posyandu.

## E. Hal yang harus **terasa** sebagai satu sistem
Walau jalurnya banyak, pengguna harus merasa memakai **satu hal yang koheren**: satu bahasa visual, satu cara memahami angka, satu cara melihat sumber, satu cara menghadapi bahaya.

---

# 04 — Konten dan Data Contoh (SINTETIS dan ILUSTRATIF)

> **Semua angka di bawah rekaan untuk keperluan desain.** Jangan dipakai sebagai data gizi. Angka gizi nyata berasal dari standar resmi dan sedang diverifikasi.

## 1. Kosakata dan nada

| Pakai | Hindari |
|---|---|
| "contoh pola makan dari aturan" | "rekomendasi menu", "resep terbaik", "diet" |
| "bawa ke petugas kesehatan hari ini" | "Anda harus", "bahaya!" |
| "belum diverifikasi dosen" | "terbukti", "dijamin", "pasti" |
| "kebutuhan harian dari standar" | "target yang gagal", "kurang bagus" |
| "perlu perhatian", "tanyakan petugas" | "diagnosis", "penyakit", "obat", dosis apa pun |
| "tidak ada data" | menampilkan 0 untuk data yang tidak ada |
Kalimat pendek; pecah angka menjadi makna; sapaan hangat tetapi tidak sok akrab; jangan menyalahkan. Format Indonesia: "12,5 kg", "9 bulan 2 minggu" (usia dihitung bulan penuh pada sistem).

## 2. Teks wajib (tidak boleh dihilangkan atau diubah maknanya)
- Label profil demo, pada **setiap** layar keluaran dan **tertanam di tangkapan layar/cetak**: *"Prototipe PjBL — belum diverifikasi dosen; bukan pengganti petugas kesehatan."*
- Saat rujukan: *"Bawa anak ke petugas kesehatan hari ini."* (inti pesan; kalimat sekitarnya bebas)
- Sumber: setiap angka punya penanda sumber dan status verifikasi yang dapat dibuka.

## 3. Contoh profil sintetis
```
Anak (contoh preset A): 9 bulan · perempuan · 8,1 kg · 71,0 cm (diukur berbaring)
ASI: masih menyusu · prematur: tidak · bengkak: tidak · kondisi khusus: tidak
Alergi: tidak ada · Anggaran: Rp 15.000/hari · Bahan di rumah: beras, telur, bayam
```
```
Anak (contoh preset B): 14 bulan · laki-laki · 7,6 kg · 72,0 cm  → [skenario rancangan: hasil berkategori berat sehingga rujukan tanpa menu; angka rekaan, BUKAN penilaian klinis]
```
```
Anak (contoh preset C): 18 bulan · alergi telur · anggaran Rp 8.000/hari   → [kendala ketat]
```

## 4. Contoh hasil status gizi (ilustratif)
```
Berat menurut umur: normal            Panjang menurut umur: normal
Berat menurut panjang: gizi baik     (kategori resmi; angka batas dari tabel standar)
```
Kategori resmi yang dapat muncul (nama sebenarnya dari standar): BB/U: berat badan sangat kurang · kurang · normal · risiko berat badan lebih. PB/TB menurut umur: sangat pendek · pendek · normal · tinggi. BB menurut PB/TB: gizi buruk · gizi kurang · gizi baik · berisiko gizi lebih · gizi lebih · obesitas.

## 5. Contoh pola makan (ilustratif)
```
Slot          Contoh bahan (ilustratif)         Ukuran rumah tangga     Catatan
Karbohidrat   bubur nasi lembut                  3 sendok makan          tekstur: lembut
Lauk hewani   telur ayam matang                 1 butir (dibagi 2 kali) 
Lauk nabati   tempe kukus halus                  1 potong kecil
Sayur         bayam rebus cincang                2 sendok makan
Buah          pisang matang dilumatkan           ½ buah
```
- Tombol per baris: "Tidak punya ini" → padanan; "Kenapa ini?".
- Kontrol global: "Hitung ulang" (variasi baru), kode benih `#A7F3`, perkiraan biaya "sekitar Rp 11.000–14.000".
- Label bahan yang disaring: "madu tidak disertakan: belum boleh untuk bayi di bawah 12 bulan".

## 6. Contoh kecukupan (ilustratif)
```
Energi          ███████░░░  ≈ 72% dari kebutuhan harian  
Protein         █████████░  ≈ 94%
Zat besi        ████░░░░░░  ≈ 41%   ← celah: sulit ditutup dari makanan saja → tanyakan petugas tentang suplemen
Kalsium         ███████░░░  ≈ 68%
Vitamin A       ██████████  ≈ 100%
Seng            ──          tidak ada data (bukan nol)
```
(Bentuk batang hanya ilustrasi; Anda bebas menemukan cara yang lebih baik untuk membuat kecukupan **terasa** tanpa menjadi nilai ujian.)

## 7. Contoh jejak "Kenapa" (Mode Ahli, ilustratif)
```
1. Masukan: 9 bulan, perempuan, ASI ya                         [versi data 0.1.0 · mesin 0.1.0 · benih #A7F3]
2. Kebutuhan energi total (standar nasional, tabel 1, hlm. 6)  800 kkal   → sumber [S1] tingkat A · status: teks-ditemukan-mesin
3. Bagian dari makanan pendamping (konsep WHO/PAHO)           ± 300 kkal → sumber [S2] tingkat B · status: belum diverifikasi
4. Aturan keselamatan: madu disaring (anak < 12 bulan)         → sumber [S3] tingkat B · status: belum diverifikasi
5. Pemilihan bahan: slot × batas porsi × anggaran              → asumsi pengembang [D1] tingkat D
```
Status verifikasi dan tingkat bukti harus mudah dibedakan sekilas tanpa mengandalkan warna saja.

## 8. Contoh "daftar sumber" (ilustratif)
```
[S1] Peraturan Menteri Kesehatan No. 28/2019 · Angka Kecukupan Gizi · Lampiran I, Tabel 1 · hlm. 6  ·  tingkat A
     Status: teks-ditemukan-mesin · diverifikasi manusia: belum · hash berkas: 7e3a…c91
[S2] ... 
```

## 9. Contoh tanda bahaya (ilustratif; daftar sebenarnya sedang disusun dengan sumber primer)
Kejang · napas sangat cepat/sesak · tidak mau menyusu atau minum sama sekali · lemas/sulit dibangunkan · muntah terus-menerus · diare berdarah. Pesan inti: *bawa ke petugas kesehatan hari ini.*

## 10. Contoh keadaan khusus
- Usia di luar rentang: "Aplikasi ini untuk anak 6–23 bulan. Untuk bayi di bawah 6 bulan, ASI saja sudah cukup." / "Untuk usia 24 bulan ke atas, versi berikutnya."
- Aturan kedaluwarsa: "Aturan keselamatan perlu diperbarui sebelum menyusun pola makan. Sambungkan ke internet sebentar."
- Hasil tidak layak: "Dengan anggaran dan bahan ini, zat besi belum bisa tercukupi dari makanan. Ini wajar; tanyakan petugas."

---

# 05 — Batas Mutlak (satu halaman; sisanya bebas)

Setiap butir berikut ada karena alasan keselamatan, aksesibilitas, hukum, atau kejujuran ilmiah. Tidak ada yang menyangkut selera visual. Bila Anda merasa sebuah butir menghalangi ide hebat, **sampaikan kepada kami beserta alasan**, jangan diam-diam melanggar.

## Keselamatan dan kejujuran
| # | Batas | Alasan |
|---|---|---|
| 1 | Saat ada tanda bahaya atau kategori khusus (prematur, bengkak, kondisi khusus, status berat), antarmuka **berhenti memberi pola makan** dan memunculkan rujukan yang tidak mudah terlewat | Menu untuk anak yang sakit berat bisa berbahaya |
| 2 | Tidak ada bahasa diagnosis, terapi, dosis obat/suplemen, atau janji ("pasti", "dijamin", "menyembuhkan") | Aplikasi edukasi, bukan alat medis |
| 3 | Label prototipe wajib pada **setiap** keluaran profil `demo` dan **tertanam pada gambar/cetak/tangkapan layar**, bukan hanya di halaman Tentang | Orang akan membagikan tangkapan layar dan menganggapnya nasihat |
| 4 | "Tidak ada data" tidak boleh tampil sebagai angka 0; ketidakpastian atau rentang harus dapat ditampilkan jujur | Menyembunyikan data hilang menyesatkan |
| 5 | Hasil tidak layak (tidak ada kombinasi yang cukup) ditampilkan **apa adanya** sebagai celah, tanpa "menu ajaib" | Kejujuran ilmiah |
| 6 | Hasil deterministik dan hasil penjelasan AI (kelak) **terlihat jelas terpisah**; AI tidak pernah tampil sebagai sumber angka atau keputusan keselamatan | Keterbukaan dan keselamatan |
| 7 | Status verifikasi sumber dan tingkat bukti tampil jelas; klaim belum diverifikasi **berlabel** | Penguji akan mencarinya |
| 8 | Tidak ada tampilan skor tunggal yang menghakimi atau memeringkat ibu/anak ("nilai 62/100"); kategori resmi ditampilkan dengan bahasa yang manusiawi | Stigma dan rasa gagal |
| 9 | Pada profil `demo`: tidak ada kolom teks bebas, tidak ada ekspor per profil, tidak ada keadaan masukan di URL | Mencegah data nyata/pribadi masuk |

## Aksesibilitas dan keterbacaan
| # | Batas | Alasan |
|---|---|---|
| 10 | Teks memenuhi kontras WCAG 2.2 AA (≥ 4,5:1; teks besar ≥ 3:1; komponen dan batas fokus ≥ 3:1) pada **semua** keadaan: normal, fokus, tekan, nonaktif, galat, dan setiap tema | Matahari posyandu, penglihatan menurun |
| 11 | Informasi **tidak** disampaikan hanya lewat warna (selalu ada teks/bentuk/ikon) | Buta warna; layar pudar di bawah matahari |
| 12 | Target sentuh ≥ 48 dp dengan jarak memadai; operasi **satu tangan** | Menggendong anak; jari besar; tangan basah |
| 13 | Teks dapat diperbesar sampai 200% tanpa kehilangan fungsi; tidak ada teks di dalam gambar untuk informasi penting | Penglihatan menurun |
| 14 | Patuh `prefers-reduced-motion`; tidak ada kedipan cepat; tidak ada gerak yang diperlukan untuk memahami informasi | Vestibular, kenyamanan |
| 15 | Dapat dioperasikan dengan pembaca layar (TalkBack) dan urutan fokus logis; label bermakna | Tunanetra; kelak suara |
| 16 | Angka berformat Indonesia (desimal koma); mendukung masukan koma dan titik | Pengguna lokal |

## Teknis (sebagai kenyataan perangkat, bukan pilihan gaya)
| # | Batas | Alasan |
|---|---|---|
| 17 | PWA offline-first; **semua** fungsi inti berjalan tanpa jaringan; keadaan luring/daring selalu terlihat | Sinyal posyandu |
| 18 | **Ringan:** HP Android murah, koneksi lambat. Gambar dan font berat, efek blur/bayangan besar, atau animasi yang menghitung ulang tata letak dapat membuat aplikasi tidak terpakai | Perangkat nyata |
| 19 | Layar 360–412 px sebagai acuan utama; harus tetap sempurna sampai laptop/proyektor | Pemakaian nyata |
| 20 | Tidak ada ketergantungan pada layanan eksternal untuk tampilan (font/ikon/gambar disertakan lokal) | Offline dan privasi |
| 21 | Satu sistem desain melayani profil `demo` dan `lapangan` (kelak lebih banyak mode) | Satu produk |

## Etika desain
| # | Batas | Alasan |
|---|---|---|
| 22 | Tidak ada pola gelap (dark pattern), penghitung streak yang membuat rasa bersalah, atau notifikasi yang menekan | Pengguna rentan |
| 23 | Tidak memakai citra anak nyata atau wajah orang sungguhan yang dapat dikenali tanpa izin | Privasi |

---

# 06 — Proyeksi: Sistem yang Harus Mampu Tumbuh

Aplikasi akan terus bertambah: mode baru, fitur baru, pengguna baru, perangkat baru, bahasa baru. Kami ingin kanvas yang sejak awal **punya ruang** untuk itu, sehingga fitur masa depan terasa *tumbuh dari dalam* sistem, bukan ditempel.

## Cara aplikasi tumbuh (kenyataan arsitektur yang berdampak ke desain)
- **Modul terdaftar:** tiap fitur adalah modul yang masuk lewat titik kaitan tetap pada alur "profil → kebutuhan → penyaringan keselamatan → pemilihan → peringkat → penjelasan". Desain yang baik menyediakan **titik kaitan visual** yang sama: tempat baru untuk satu modul tanpa menggeser yang lama.
- **Mode:** hari ini satu (anak 6–23 bulan); segera ibu hamil, ibu menyusui; lalu 24–59 bulan; lalu peran (keluarga vs kader).
- **Profil rilis:** `demo` dan `lapangan`; kelak juga mode presentasi dan mode kios.
- **Lapisan bukti selalu ada:** apa pun fiturnya, ia punya jejak dan sumber.
- **Versi aturan:** hasil selalu bertanda versi; aturan keselamatan bisa kedaluwarsa dan harus diperbarui.

## Peta kemungkinan pertumbuhan (rancang ruangnya; detailnya boleh sangat Anda tentukan)
| Arah | Contoh yang akan datang | Tantangan desain yang kami sadari |
|---|---|---|
| **Lebih banyak orang** | ibu hamil, menyusui, balita 24–59 bln, kader, bidan, kepala desa | satu sistem, banyak "kepribadian" tanpa pecah |
| **Lebih banyak kedalaman** | Mode Ahli, jejak interaktif, perbandingan standar, analisis kepekaan ("kalau anggaran naik Rp 2.000?") | kedalaman tanpa membebani pengguna biasa |
| **Lebih banyak waktu** | linimasa 1000 hari, pelacak kebiasaan, tren pertumbuhan, riwayat | menampilkan waktu tanpa rasa dikejar |
| **Lebih banyak data** | harga & ketersediaan lokal, peta bahan, dasbor desa | agregat yang manusiawi, bukan papan skor |
| **Lebih banyak cara masuk** | suara, gambar/ikon, bahasa daerah, QR, cetak | literasi rendah, tunanetra, tanpa internet |
| **Lebih banyak kecerdasan** | penjelas AI dengan pilihan tindak lanjut | kejujuran asal-usul: mana hitungan, mana penjelasan |
| **Lebih banyak perangkat** | tablet kader, proyektor, layar kios, kartu cetak | satu bahasa visual dalam banyak ukuran dan cahaya |
| **Lebih banyak bahasa dan budaya** | Jawa, Sunda, dll.; pantangan/kebiasaan makan setempat | teks lebih panjang/pendek; ikon yang tidak salah arti |

## Yang kami harapkan dari "sistem" Anda
- Bahasa visual dan **bahasa gerak** yang dapat diperluas tanpa kehilangan jati diri.
- Cara menyatakan **status** (aman / perlu perhatian / segera / tidak ada data / belum diverifikasi) yang tidak bergantung pada warna dan tidak menghakimi, dan dapat tumbuh bila status baru muncul.
- Cara menampilkan **angka dan kecukupan** yang bermakna bagi non-ahli, namun tetap jujur bagi ahli.
- Cara menampilkan **asal-usul** (sumber, asumsi, versi) yang terasa seperti bagian dari keindahan, bukan catatan kaki.
- Satu cara menangani **momen darurat** yang konsisten di semua mode.

## Pertanyaan pemicu (boleh diabaikan sama sekali)
Ini bukan arahan, hanya batu loncatan jika Anda ingin memulai dari pertanyaan:
- Seperti apa rasanya **kecukupan** jika tidak berbentuk batang kemajuan atau lingkaran persentase?
- Bagaimana **ketidakpastian** dan **"belum ada data"** bisa tampak indah dan jujur, bukan seperti kerusakan?
- Bagaimana **jejak perhitungan** bisa menjadi sesuatu yang ingin dijelajahi?
- Bagaimana **rujukan darurat** bisa tegas sekaligus menenangkan?
- Bagaimana satu desain terbaca di bawah **matahari** dan tetap cantik di **proyektor** ruang gelap?
- Bagaimana **gerak** menunjukkan *sebab-akibat* (mengganti bahan → kecukupan bergeser) tanpa menjadi pertunjukan?
- Apa yang **belum pernah** dilakukan aplikasi gizi mana pun, namun masuk akal di tangan seorang kader di tenda posyandu?

---

# 07 — Yang Kami Harapkan dan Cara Kami Menilai

## Hasil yang kami harapkan (silakan sesuaikan ukuran dan urutannya)
1. **Satu arah desain yang kuat** (pilihan Anda) lengkap: gagasan inti, prinsip, dan alasan. Opsional: **dua arah alternatif yang berani** untuk dibandingkan.
2. **Sistem desain**: token (warna, tipografi, jarak, bentuk, bayangan/efek, gerak), pustaka komponen dengan **semua keadaan**, aturan penggunaan, tema terang/gelap bila Anda memandangnya perlu.
3. **Layar kunci** pada lebar HP (360–412 px) dan satu tampilan laptop/proyektor: masuk dan konteks → masukan profil → status gizi → contoh pola makan (dengan alternatif dan hitung ulang) → kecukupan → "Kenapa?" → Mode Ahli dan daftar sumber → tanda bahaya → Tentang/label/hak data.
4. **Keadaan khusus** dirancang sungguh-sungguh: kosong, luring, memuat, galat, aturan kedaluwarsa, hasil tidak layak, data tidak ada, rujukan.
5. **Bahasa gerak**: prinsip dan contoh perilaku (apa yang bergerak, mengapa, seberapa lama), termasuk versi *reduced-motion*.
6. **Konsep proyektif** untuk 3–5 arah pertumbuhan di `06_` (cukup tingkat konsep) untuk membuktikan sistem muat.
7. **Catatan keputusan:** apa yang Anda pilih sengaja, apa yang Anda lepaskan, dan pertanyaan terbuka untuk kami.
8. Bila memungkinkan: **prototipe interaktif** pada alur inti, atau penjelasan interaksi yang cukup rinci untuk diimplementasikan di HTML/CSS/JS ringan.

## Cara kami menilai (uji manusiawi, bukan selera)
| Uji | Pertanyaan |
|---|---|
| **Uji lengan terentang & matahari** | Terbaca dari jarak lengan, pada layar redup di bawah terang? |
| **Uji lima detik** | Seseorang yang baru membuka layar tahu apa yang harus dilakukan berikutnya dalam 5 detik? |
| **Uji satu jempol** | Seluruh alur inti dapat dilakukan satu tangan, berdiri, menggendong? |
| **Uji tanpa warna** | Layar dicetak abu-abu: semua makna tetap utuh? |
| **Uji 200%** | Teks 200% tanpa layout rusak atau fungsi hilang? |
| **Uji penguji skeptis** | Dosen dapat menemukan sumber dan asumsi suatu angka dalam ≤ 3 sentuhan? |
| **Uji tangkapan layar** | Layar hasil yang dibagikan sebagai gambar tetap memuat label dan tidak menyesatkan? |
| **Uji tanpa gerak** | Dengan animasi dimatikan, semua tetap dapat dipahami? |
| **Uji HP murah** | Tetap mulus pada perangkat lambat dan bobot kecil? |
| **Uji empati** | Ibu yang cemas tidak merasa dihakimi atau ditakuti? |
| **Uji "baru"** | Seorang desainer berpengalaman berkata: *"ini bukan template aplikasi kesehatan yang pernah saya lihat"*? |
| **Uji tumbuh** | Satu modul baru dapat ditambahkan tanpa mengubah yang lama? |

## Yang akan kami lakukan dengan hasil Anda
Hasil Anda menjadi acuan bagi pengembangan (dikerjakan sebagai komponen ringan berbasis web, diuji aksesibilitas dan performa, serta diaudit). Kami akan jujur bila sebuah ide tidak dapat dibangun di perangkat sasaran, dan kami akan mencari cara mewujudkannya semaksimal mungkin dibanding membuangnya.

## Pertanyaan yang boleh Anda jawab sendiri
- Siapa sebenarnya "pengguna utama" menurut Anda: ibu, kader, atau penguji? Apakah satu tampilan cukup, atau sistem memiliki beberapa "ruang"?
- Apa metafora inti produk ini?
- Apa yang harus **dirasakan** seseorang pada 10 detik pertama?
- Hal apa dalam brief ini yang menurut Anda keliru atau menghalangi kualitas?

## Kontak umpan balik
Satu pemilik produk memutuskan akhir. Kami membuka diri untuk satu putaran tanya-jawab sebelum Anda mulai dan satu putaran penyempurnaan sesudah arah pertama.
