# Hasil Verifikasi Awal oleh Eksekutor (Pra-M0)

Tanggal: 2026-10-28 · Penulis: Eksekutor · Status dokumen: **bukan bukti independen**; ini bahan untuk dibandingkan oleh auditor **setelah** fase buta A-SRC-0.

> **Auditor:** jangan membaca berkas ini sebelum Anda menurunkan sendiri nilai dari sumber primer (fase buta). Tujuannya agar verifikasi Anda tidak terpengaruh pembacaan saya.

## 1. Metode dan batas

- Alat: pencarian web, pengambilan halaman (WebFetch), dan pembacaan PDF. PDF resmi yang berbentuk gambar saya render menjadi gambar per halaman dan **dibaca secara visual**. Berkas PDF disimpan otomatis oleh alat di folder sementara sesi; tidak ada berkas yang saya simpan ke folder proyek.
- **Risiko pembacaan visual:** tabel AKG dibaca dari gambar yang diputar. Salah baca angka mungkin terjadi. Auditor wajib membaca ulang sendiri.
- Ringkasan hasil pencarian dibuat oleh model kecil dan bisa keliru; hanya halaman/dokumen yang saya baca langsung yang saya beri status TERVERIFIKASI. Selebihnya diberi label sekunder.
- Banyak situs resmi menolak akses otomatis (403/404/SSL); ini membatasi cakupan.
- Tidak ada kutipan panjang disalin; hanya angka, ambang, dan lokasi.

## 2. Status per klaim (ID mengacu `AUDITOR_PACKAGE/08_REGISTER_KLAIM_DAN_RUJUKAN.md`)

Label: **TERVERIFIKASI** (dokumen primer dibaca) · **SEKUNDER** (sumber turunan konsisten, primer belum dibaca) · **SEBAGIAN** · **BELUM** · **TIDAK TERKONFIRMASI** · **DIKOREKSI**.

| ID | Status | Bukti dan catatan |
|---|---|---|
| C-001 | TERVERIFIKASI | Permenkes 28/2019 "Angka Kecukupan Gizi yang Dianjurkan untuk Masyarakat Indonesia"; ditetapkan 20 Agu 2019, diundangkan 26 Agu 2019; Berita Negara 2019 No. 956; mencabut Permenkes 75/2013. Dibaca dari salinan Berita Negara (peraturan.go.id) + halaman JDIH Kemenkes |
| C-002 | TERVERIFIKASI | Permenkes 2/2020 "Standar Antropometri Anak"; ditetapkan 2 Jan 2020, diundangkan 8 Jan 2020; BN 2020 No. 7; mencabut Kepmenkes 1995/2010 |
| C-003 | BELUM | Pencarian gagal |
| C-004 | SEKUNDER | UU 27/2022, ditandatangani 17 Okt 2022. Data kesehatan dan data anak = data pribadi spesifik (Pasal 4 ayat 2; sumber sekunder). Temuan tambahan (belum diverifikasi): UU 17/2023 tentang Kesehatan Pasal 351 mewajibkan pelindungan data kesehatan; putusan MK 2025 atas Pasal 53(1)b UU PDP |
| C-005 | BELUM | |
| C-006 | BELUM | TKPI belum dicari |
| C-007 | BELUM | |
| C-008 | **TERVERIFIKASI** | Tabel 1, hlm. 8 (BN hlm. 8): hamil energi +180 (T1), +300 (T2), +300 (T3); protein +1, +10, +30 g. Sumber sekunder yang menyebut protein tambahan datar 20 g **bertentangan** dengan dokumen primer (kemungkinan dari AKG lama) |
| C-009 | **TERVERIFIKASI** | Hlm. 8: menyusui 6 bln pertama energi +330, protein +20; 6 bln kedua +400, +15 |
| C-010 | SEBAGIAN | 90 tablet dan 60 mg besi: sumber sekunder. **Kadar asam folat tidak konsisten antar sumber (0,25 vs 0,4 mg)**. Pedoman Kemenkes belum terbaca |
| C-011 | SEKUNDER | LiLA < 23,5 cm risiko KEK; banyak skripsi mengutip Kemenkes 2024; dokumen resmi belum dibaca |
| C-012 | SEBAGIAN | Batas MUAC WHO < 115 mm (SAM) dan 115–< 125 mm (MAM) dikonfirmasi lewat literatur; angka ini diperdebatkan. Sumber nasional belum dibaca |
| C-013 | **TERVERIFIKASI** | Lampiran Bab II.B, hlm. 14–15: ambang BB/U, TB/U, BB/TB, IMT/U 0–60 bulan dan IMT/U 5–18 th persis sebagaimana `03_` §4.1. Ditambah catatan: kategori "berisiko gizi lebih" tidak masuk klasifikasi survei/cakupan program; BB/U tidak dapat dipakai menilai gemuk; kategori IMT/U gizi buruk/kurang untuk tata laksana memakai BB/PB-TB |
| C-020 | SEBAGIAN | Dokumen WHO *Computation of centiles and z-scores* (referensi 2007, 5–19 th): rumus LMS (L≠0) terkonfirmasi; **penyesuaian di luar ±3 SD hanya untuk indikator berbasis berat**; TB/U tidak disesuaikan. Rumus L=0 tidak ada di dokumen itu. Dokumen standar 2006 (0–5 th) **belum dibaca**; dokumen ini menyatakan metodenya mengikuti CGS 2006 |
| C-021 | SEBAGIAN | Batas BIV: HAZ −6/+6, WAZ −6/+5, WHZ −5/+5, BAZ −5/+5. Dari dokumen turunan yang mengutip WHO Anthro, forum DHS, dan program SAS CDC. Manual WHO Anthro belum dibuka |
| C-022 | **TERVERIFIKASI (aturan nasional)** | Permenkes 2/2020 hlm. 12: usia = bulan penuh (2 bln 29 hari → 2 bulan); 0–24 bulan PB terlentang, jika diukur berdiri +0,7 cm; > 24 bulan TB berdiri, jika diukur terlentang −0,7 cm. **Ambigu tepat pada 24 bulan** ("0–24" dan "di atas 24") |
| C-023 | SEBAGIAN | Pasal 6(4) Permenkes 2/2020 menetapkan tabel kenaikan BB (weight increment) 0–24 bulan untuk risiko gagal tumbuh/weight faltering. Standar WHO 2009 belum dibaca |
| C-024 | **TERVERIFIKASI (registry WHO)** | WHO GHO metadata: MDD 6–23 bulan = ≥ 5 dari 8 kelompok; delapan kelompok seperti di `03_` §4.3. Dokumen IYCF 2021 penuh (CC BY-NC-SA 3.0 IGO) **belum dibaca** (403). Aturan untuk anak tidak disusui belum terkonfirmasi |
| C-025 | BELUM | |
| C-026 | **TERVERIFIKASI (salinan)** | 200/300/550 kkal per hari (6–8/9–11/12–23 bulan) untuk anak dengan asupan ASI "rata-rata" negara berkembang; teks dibaca dari salinan prinsip panduan di server universitas + beberapa sumber sekunder. Dokumen WHO/PAHO asli belum dibaca |
| C-027 | BELUM | |
| C-028 | TIDAK TERKONFIRMASI | Persentase 5/10/12/15% tidak terkonfirmasi. **Catatan penting:** AKG 2019 sendiri memuat asumsi bioavailabilitas (lihat F-02) |
| C-029 | BELUM | |
| C-030 | SEBAGIAN | UL vitamin A praformed dewasa 3000 µg/hari (buku IOM 2001 via National Academies); opini EFSA 2024 menyatakan 3000 µg RE/hari berlaku termasuk ibu hamil dan menyusui. Angka UL spesifik hamil menurut IOM belum terlihat |
| C-031 | SEBAGIAN | RAE: 1 µg RAE = 1 µg retinol = 12 µg β-karoten = 24 µg karotenoid provitamin A lain (IOM via NAP; BfR). DFE belum dicek |
| C-032 | BELUM | Gibson 77% |
| C-033 | BELUM | |
| C-034 | TERVERIFIKASI (abstrak) | Ferguson dkk., *J Nutr* 2004;134(4):951–957 (pendekatan 4 fase LP untuk pedoman pangan); Darmon, Ferguson & Briend, *J Nutr* 2002;132(12):3764–3771 (batasan biaya saja menurunkan kerapatan gizi). Naskah penuh belum dibaca |
| C-035–C-039 | BELUM | |
| C-050–C-053, C-055–C-056 | BELUM | |
| C-054 | SEBAGIAN | WCAG 2.2 SC 2.5.8 (AA): target minimum 24×24 CSS px dengan pengecualian jarak, setara, inline, kontrol agen pengguna, esensial. Kontras 4,5:1 (SC 1.4.3) belum dibuka |
| C-057 | SEKUNDER | Lihat C-004 |
| C-070 | SEBAGIAN | FoodData Central: domain publik, CC0 1.0, mohon atribusi; dataset Foundation, SR Legacy (terakhir diperbarui 2018), FNDDS, Branded; unduhan tersedia. **Jumlah ≈ 7.800 pangan tidak terkonfirmasi**; format CSV belum dikonfirmasi |
| C-071 | TERVERIFIKASI | Open Food Facts: basis data ODbL, isi DbCL, gambar CC BY-SA; wajib atribusi; karya turunan share-alike |
| C-072 | SEBAGIAN | PIHPS Nasional dikelola Bank Indonesia, di bi.go.id/hargapangan sejak 1 Jul 2023; komoditas utama (beras, telur, daging ayam/sapi, cabai, bawang, minyak, gula); laporan 2017: 164 pasar tradisional di 82 kota. API resmi tidak ditemukan |
| C-073 | BELUM | Tidak dilakukan pencarian khusus basis data bahan Indonesia berharga |
| C-074 | TIDAK TERKONFIRMASI | Pencarian tidak menemukan dokumentasi HiGHS-JS/dual; harus diuji lewat prototipe |
| C-075–C-078 | BELUM | |
| C-090 | **TERVERIFIKASI (CDC)** | Halaman CDC bertanggal 14 Apr 2026: madu dan susu sapi sebagai minuman, jus: tidak < 12 bulan; tanpa gula tambahan < 24 bulan; hindari ikan merkuri tinggi, produk tidak dipasteurisasi. **Bukan sumber Indonesia**; Kemenkes/IDAI belum dicek |
| C-091 | SEBAGIAN (NHS) | Halaman NHS (ditinjau 15 Jun 2026): hindari susu/produk susu tidak dipasteurisasi, keju lunak berjamur kecuali dimasak, hati dan produk hati (vitamin A), ikan/kerang mentah, hiu/todak/marlin, daging mentah; batasi tuna dan ikan berminyak; kafein ≤ 200 mg/hari; hindari alkohol; teh herbal dibatasi, hindari teh akar manis. **Ketentuan telur "British Lion" khas Inggris**, tidak berlaku di Indonesia. Pedoman Kemenkes/WHO belum dicek |
| C-092 | SEBAGIAN | Addendum NIAID 2017: tiga tingkat risiko, pengenalan kacang sejak 4–6 bulan untuk risiko tinggi, sekitar usia 6 bulan untuk risiko sedang, bebas untuk risiko rendah; berbasis LEAP (penurunan alergi kacang ± 81% pada risiko tinggi). Telur dan pedoman IDAI belum dicek |
| C-093–C-096 | BELUM | Usia koreksi prematur, sindrom, edema, zat besi sulit tercukupi: pencarian gagal/belum |
| C-097 | SEBAGIAN | Kafein 200 mg/hari (NHS). Batas garam/gula anak belum dicek |
| C-098 | SEBAGIAN | Lihat C-023; kriteria "2T" Buku KIA belum dicek |

## 3. Temuan baru dari pembacaan primer (belum ada di register)

| ID | Temuan | Dampak |
|---|---|---|
| F-01 | **AKG 2019 menyatakan vitamin A dalam RE** (kolom "Vit A (RE)"), bukan RAE; UL IOM memakai RAE/retinol. Folat tertulis "mcg" tanpa menyebut DFE | S1: salah satuan menghasilkan kekeliruan nilai kecukupan |
| F-02 | AKG menanam **asumsi bioavailabilitas**: catatan kaki Tabel 3 menyatakan *75% besi diasumsikan dari sumber heme* (tertulis demikian di dokumen; mungkin salah ketik, sumber IOM 2001/2006 perlu dicek) dan seng diasumsikan dari sumber bioavailabilitas tinggi/sedang | S1: menambah faktor bioavailabilitas di atas AKG berisiko menghitung ganda. Fitur A17 harus dirancang ulang atau bersifat kualitatif |
| F-03 | AKG energi 6–11 bulan = 800 kkal **total** (ASI + makanan); kebutuhan dari makanan pendamping (200/300/550) adalah konsep berbeda. AKG 0–5 bulan "bersumber dari ASI eksklusif" | S1: jangan membandingkan menu dengan 800 kkal untuk anak yang masih disusui |
| F-04 | PMK 28/2019 punya dua set tambahan energi: Tabel 1 (hamil +180/+300/+300; menyusui +330/+400) dan bagian perencanaan situasi darurat (hamil +300; menyusui +500) | S2: mesin harus memakai Tabel 1 untuk individu |
| F-05 | Penambahan "(+an)" untuk hamil/menyusui di tabel tidak menyebut eksplisit pada kelompok usia ibu mana ditambahkan (dalam teks yang saya baca) | S2: butuh konfirmasi dosen; konvensi: tambahkan pada kelompok usia ibu |
| F-06 | Permenkes 2/2020 mengklasifikasi lewat **tabel SD per bulan penuh** untuk 0–60 bulan, bukan LMS kontinu | S2: implementasi harus memakai tabel resmi atau membuktikan kesetaraan |
| F-07 | Lampiran II PMK 28/2019 hlm. 31–32 menjelaskan metode **Cost of the Diet** (TKPI + harga lokal per 100 g + ukuran porsi + perangkat lunak CotD) | Dasar regulasi untuk K03 dan seluruh optimasi biaya |
| F-08 | Permenkes 2/2020 Pasal 5 dan 7 mewajibkan tata laksana bila ditemukan masalah gizi/risiko gagal tumbuh | Rujukan wajib, selaras prinsip aplikasi |
| F-09 | UU PDP: data anak dan kesehatan = data pribadi spesifik; regulasi turunan dan lembaga pengawas masih berproses (per sumber sekunder) | S1 untuk desain privasi |
| F-10 | BPOM Peraturan 22/2019 (BN 2019 No. 948) mengatur informasi nilai gizi pada label pangan olahan (ditemukan tak sengaja) | S3: relevan bila ada fitur produk kemasan |

## 4. Nilai acuan AKG 2019 untuk uji kasus baku (hasil pembacaan visual; **wajib dibaca ulang auditor**)

| Kelompok | Energi (kkal) | Protein (g) | Lemak (g) | Karbohidrat (g) | Serat (g) | Air (ml) |
|---|---|---|---|---|---|---|
| 6–11 bulan | 800 | 15 | 35 | 105 | 11 | 900 |
| 1–3 tahun | 1350 | 20 | 45 | 215 | 19 | 1150 |
| Perempuan 19–29 th | 2250 | 60 | 65 | 360 | 32 | 2350 |
| Perempuan 30–49 th | 2150 | 60 | 60 | 340 | 30 | 2350 |
| Hamil (+) T1 / T2 / T3 | +180 / +300 / +300 | +1 / +10 / +30 | +2,3 | +25 / +40 / +40 | +3 / +4 / +4 | +300 |
| Menyusui (+) 0–6 / 7–12 bln | +330 / +400 | +20 / +15 | +2,2 | +45 / +55 | +5 / +6 | +800 / +650 |

Mikro (perempuan 19–29 th; tambahan hamil T1/T2/T3; tambahan menyusui 6 bln pertama/kedua): vit A 600 RE (+300 semua trimester; +350), folat 400 µg (+200; +100), vit C 75 mg (+10; +45), besi 18 mg (+0/+9/+9; +0), seng 8 mg (+2/+4/+4; +5), iodium 150 µg (+70; +140), kalsium 1000 mg (+200; +200). Anak 6–11 bln: vit A 400 RE, besi 11 mg, seng 3 mg, kalsium 270 mg, folat 80 µg, vit C 50 mg. Anak 1–3 th: vit A 400 RE, besi 7 mg, seng 3 mg, kalsium 650 mg, folat 160 µg, vit C 40 mg.

## 5. Yang belum terverifikasi dan perlu dikerjakan lagi

Permenkes 41/2014; Perpres 72/2021; Permenkes 21/2021; TKPI (isi, jumlah, lisensi); Buku KIA; pedoman TTD (folat); LiLA dokumen resmi; dokumen IYCF 2021 penuh (MMF, MMFF, MAD, aturan non-ASI); standar WHO 2006 dan WHO Anthro (flag, penyesuaian); WHO 2009 velocity; MDD-W; FAO/WHO 2004 besi; IZiNCG; Gibson 77%; usia koreksi prematur; edema; sindrom Down; alergen telur (IDAI); batas garam/gula anak; SUS; CVI; Bland-Altman; ISO 9241-11; HiGHS dual; PDF.js; Naegele.

## 6. Implikasi untuk rancangan (usulan)

1. Daftar satuan kanonik: vitamin A **RE** mengikuti AKG; konversi ke RAE bila memakai UL IOM; folat: tentukan satuan dengan dosen.
2. Hapus asumsi "bioavailabilitas sebagai pengali tambahan"; jadikan A17 informasi kualitatif (penguat/penghambat) hingga ada keputusan dosen.
3. Pisahkan konsep "AKG total" dan "kebutuhan dari makanan pendamping" untuk 6–23 bulan; tanyakan status ASI.
4. Gunakan tabel SD resmi Permenkes 2/2020 untuk klasifikasi; simpan LMS WHO hanya bila z-score kontinu dibutuhkan; putuskan perilaku tepat pada 24 bulan.
5. Tonjolkan Cost of the Diet (PMK 28/2019 Lampiran II) dalam argumen ilmiah dan bisnis.
