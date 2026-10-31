# 08 — Register Klaim dan Rujukan Eksekutor (SEMUA BELUM DIVERIFIKASI)

Setiap baris adalah klaim yang eksekutor buat selama diskusi dari **ingatan**. Tugas pertama auditor (**A-SRC-0**): isi kolom Status, Bukti, dan Koreksi. Eksekutor tidak boleh memakai klaim di sini pada data/aturan sebelum berstatus `TERVERIFIKASI`.

**Catatan (diperbarui 2026-10-28):** eksekutor telah menjalankan verifikasi awal; hasilnya di `../docs/verifikasi_eksekutor/HASIL_VERIFIKASI.md`. **Jangan membukanya sebelum fase buta selesai.** Kolom Status di bawah sengaja dibiarkan `BELUM` agar verifikasi auditor independen.

Status: `BELUM` · `TERVERIFIKASI` · `DIKOREKSI` · `TIDAK DAPAT DIVERIFIKASI` · `DITOLAK`.
Dampak jika salah: S0–S3 (lihat `05_`).

## A. Regulasi dan dokumen nasional

| ID | Klaim | Dampak | Status | Cara verifikasi |
|---|---|---|---|---|
| C-001 | Permenkes No. 28/2019 adalah regulasi AKG | S1 | BELUM | Cari dokumen resmi (JDIH Kemenkes); catat judul lengkap, tahun, tabel |
| C-002 | Permenkes No. 2/2020 adalah Standar Antropometri Anak | S1 | BELUM | Idem; ambil tabel ambang dan kategori |
| C-003 | Permenkes No. 41/2014 adalah Pedoman Gizi Seimbang | S2 | BELUM | Idem |
| C-004 | UU No. 27/2022 adalah UU Pelindungan Data Pribadi | S1 | BELUM | Idem |
| C-005 | Perpres 72/2021 percepatan penurunan stunting; Permenkes 21/2021 pelayanan masa hamil dst. | S3 | BELUM | Idem |
| C-006 | TKPI 2017 memuat ± 1.000+ pangan; tersedia dalam bentuk PDF/web; lisensi/penggunaannya belum dicek | S1 | BELUM | Cek ketersediaan, jumlah, hak penggunaan |
| C-007 | Buku KIA edisi terbaru memuat jadwal ANC (≥ 6 kali), USG, tanda bahaya, KMS | S2 | BELUM | Baca edisi terbaru |
| C-008 | AKG 2019 hamil: energi +180 (T1), +300 (T2), +300 (T3); protein +1/+10/+30 g | **S1** | BELUM | Tabel AKG; periksa juga mikronutrien tambahan |
| C-009 | AKG 2019 menyusui: energi +330 (0–6 bln), +400 (7–12 bln) | **S1** | BELUM | Idem |
| C-010 | Program TTD: 1 tablet/hari, ≥ 90 tablet selama hamil; ± 60 mg Fe elemental + 0,25 mg asam folat | S1 | BELUM | Dokumen pedoman Kemenkes |
| C-011 | LiLA ibu hamil < 23,5 cm = risiko KEK | S1 | BELUM | Pedoman Kemenkes/Buku KIA |
| C-012 | LiLA anak 6–59 bln: < 11,5 cm risiko gizi buruk; 11,5–< 12,5 cm risiko gizi kurang | S1 | BELUM | Pedoman Kemenkes/WHO |
| C-013 | Kategori Permenkes 2/2020: lihat `03_` §4.1 | **S1** | BELUM | Tabel resmi; bandingkan kata per kata |

## B. Standar internasional

| ID | Klaim | Dampak | Status | Cara verifikasi |
|---|---|---|---|---|
| C-020 | WHO CGS 2006 memakai LMS; rumus z-score seperti di `03_` §4.1; penyesuaian di luar ±3 SD berlaku untuk BB/U, BB/PB-TB, IMT/U tetapi bukan TB/U dan LK/U | **S1** | BELUM | Dokumen WHO (*Computation of centiles and z-scores*); WHO Anthro |
| C-021 | Batas BIV WHO: TB/U z < −6 atau > +6; BB/U < −6 atau > +5; BB/TB < −5 atau > +5 | S1 | BELUM | Manual WHO Anthro |
| C-022 | Panjang berbaring ≈ 0,7 cm lebih besar daripada tinggi berdiri; WHO memakai panjang < 24 bln, tinggi ≥ 24 bln | S1 | BELUM | WHO CGS 2006 |
| C-023 | WHO weight velocity standards (2009) tersedia dan dapat dipakai untuk kenaikan BB per interval | S2 | BELUM | Situs WHO |
| C-024 | **MDD anak 6–23 bln (WHO/UNICEF 2021) = ≥ 5 dari 8 kelompok**; delapan kelompok seperti `03_` §4.3. **Eksekutor sebelumnya menulis "4 dari 8" (keliru).** | **S1** | BELUM (koreksi) | Dokumen indikator IYCF 2021 |
| C-025 | MDD-W (FAO & FHI 360 2016): ≥ 5 dari 10 kelompok | S1 | BELUM | Dokumen resmi |
| C-026 | PAHO/WHO 2003: energi dari makanan pendamping ± 200/300/550 kkal (6–8/9–11/12–23 bln) | S1 | BELUM | Dokumen resmi; catat asumsi ASI |
| C-027 | MMF (frekuensi minimum) menurut usia dan status ASI (2021) | S2 | BELUM | Dokumen IYCF 2021 |
| C-028 | FAO/WHO 2004: kategori bioavailabilitas besi non-heme 5/10/12/15% (rendah/menengah/tinggi) | S2 | BELUM | Dokumen FAO/WHO 2004 |
| C-029 | IZiNCG 2004: klasifikasi diet berdasarkan rasio molar fitat:Zn dan fraksi serapan | S2 | BELUM | Dokumen IZiNCG |
| C-030 | IOM UL retinol 3000 µg RAE/hari dewasa (termasuk hamil) | S1 | BELUM | IOM DRI 2001 |
| C-031 | IOM: definisi RAE dan DFE | S1 | BELUM | IOM |
| C-032 | Gibson (2005): ambang 77% RDA ≈ EAR untuk menilai kecukupan mikronutrien | S1 | BELUM | Buku; cek halaman |
| C-033 | NAR/MAR: Madden & Yoder 1972; Guthrie & Scheer 1981 | S3 | BELUM | Sitasi asli |
| C-034 | Ferguson dkk. *J Nutr* 2004; Darmon dkk. 2002; Optifood sebagai metode LP untuk rekomendasi pangan | S2 | BELUM | Sitasi dan isi |
| C-035 | Stigler 1945; Dantzig 1947 sebagai asal masalah diet | S3 | BELUM | Sitasi |
| C-036 | USDA *Table of Nutrient Retention Factors, Release 6* (2007) | S2 | BELUM | Dokumen USDA |
| C-037 | IOM 2009 kenaikan BB hamil menurut IMT prahamil | S2 | BELUM | Dokumen IOM |
| C-038 | Hwang & Yoon 1981 (TOPSIS); Saaty 1980 (AHP) | S3 | BELUM | Sitasi |
| C-039 | Drewnowski NRF indeks (2005/2009) | S3 | BELUM | Sitasi |

## C. Evaluasi dan standar teknis

| ID | Klaim | Dampak | Status | Cara verifikasi |
|---|---|---|---|---|
| C-050 | SUS: rerata acuan 68 (Brooke 1996; Sauro) | S2 | BELUM | Sitasi |
| C-051 | CVI: I-CVI ≥ 0,78 (≥ 6 pakar) dan S-CVI/Ave ≥ 0,90 (Polit & Beck); Lynn 1986 | S2 | BELUM | Bandingkan ambang berdasarkan jumlah pakar |
| C-052 | Bland-Altman (1986), ICC, kappa sebagai uji kesesuaian | S3 | BELUM | Metodologi |
| C-053 | ISO 9241-11: efektivitas, efisiensi, kepuasan | S3 | BELUM | Standar |
| C-054 | WCAG 2.2 AA: kontras 4,5:1; target minimum 24×24 px (2.5.8); registri memakai 48 dp sebagai rancangan lebih ketat | S2 | BELUM | W3C |
| C-055 | Doak SAM untuk kesesuaian materi | S3 | BELUM | Sitasi |
| C-056 | STROBE, WHO mERA, DECIDE-AI sebagai pedoman pelaporan | S3 | BELUM | Dokumen |
| C-057 | UU PDP: data kesehatan dan anak sebagai data sensitif; hak subjek data | S1 | BELUM | Teks UU |

## D. Basis data dan teknologi

| ID | Klaim | Dampak | Status | Cara verifikasi |
|---|---|---|---|---|
| C-070 | USDA FoodData Central: unduh CSV, domain publik (CC0); SR Legacy ≈ 7.800 pangan | S2 | BELUM | Situs USDA |
| C-071 | Open Food Facts berlisensi ODbL (berbagi-serupa) | S2 | BELUM | Situs OFF |
| C-072 | PIHPS Bank Indonesia dan Panel Harga Badan Pangan hanya tingkat komoditas utama | S2 | BELUM | Situs terkait |
| C-073 | Tidak ada paket unduhan siap pakai yang menggabungkan 5–6 ribu bahan Indonesia dengan harga | S2 | **BELUM — eksekutor tidak melakukan pencarian web** | Pencarian menyeluruh |
| C-074 | HiGHS-WASM menyediakan nilai dual (harga bayangan); `javascript-lp-solver` belum tentu | S2 | BELUM | Dokumentasi; prototipe |
| C-075 | PDF.js dapat membuka halaman tertentu dan menyorot area berdasarkan koordinat | S3 | BELUM | Dokumentasi; prototipe |
| C-076 | Publikasi WHO berlisensi CC BY-NC-SA 3.0 IGO (redistribusi tertentu) | S2 | BELUM | Halaman lisensi WHO |
| C-077 | PWA IndexedDB cukup untuk basis data bahan dan riwayat pada HP rendah | S2 | BELUM | Prototipe dan uji |
| C-078 | Naegele: HPL = HPHT + 280 hari; konsepsi ≈ HPHT + 14 hari | S2 | BELUM | Referensi obstetri |

## E. Klaim klinis/keamanan pangan

| ID | Klaim | Dampak | Status | Cara verifikasi |
|---|---|---|---|---|
| C-090 | Madu dihindari < 12 bulan (botulisme bayi) | S0 | BELUM | Pedoman Kemenkes/WHO/AAP |
| C-091 | Daftar pantangan pangan ibu hamil (ikan mentah, merkuri tinggi, hati berlebih, susu tak dipasteurisasi, jamu, kafein, alkohol) | S0 | BELUM | Pedoman Kemenkes/WHO/ACOG |
| C-092 | Pengenalan alergen dini (telur, kacang, ikan) sesuai pedoman; bukan penghindaran tanpa indikasi | S1 | BELUM | Pedoman IDAI/WAO/AAP; studi LEAP/EAT |
| C-093 | Prematur: gunakan usia koreksi untuk antropometri sampai ± 24 bulan | S1 | BELUM | WHO/Kemenkes |
| C-094 | Standar pertumbuhan WHO tidak berlaku bagi sindrom tertentu (mis. Down) | S2 | BELUM | Literatur |
| C-095 | Edema bilateral membuat berat badan tak dapat dipercaya | S1 | BELUM | WHO |
| C-096 | Zat besi (hamil dan 6–23 bln) sulit dipenuhi dari pangan saja | S1 | BELUM | Optifood/WHO |
| C-097 | Batas harian kafein bagi ibu hamil dan batas garam/gula pada anak | S1 | BELUM | Pedoman |
| C-098 | Kenaikan berat bayi diperiksa dengan kriteria "2T" Buku KIA/KMS | S2 | BELUM | Buku KIA |

## F. Klaim penalaran (bukan sumber tunggal)

| ID | Klaim | Dampak | Status | Cara menilai |
|---|---|---|---|---|
| R-001 | Kesalahan ukur/plotting di posyandu umum dan bermakna | S2 | BELUM | Cari studi; jika tidak ada, jangan digunakan sebagai klaim |
| R-002 | Faltering mendahului stunting sehingga deteksi dini bernilai | S2 | BELUM | Literatur |
| R-003 | Optimasi murni menghasilkan menu tidak realistis; slot dan batas porsi mengatasi | S2 | BELUM | Literatur + uji |
| R-004 | Perbaikan terkecil (K01) lebih efektif secara perilaku | S3 | BELUM | Literatur perilaku; atau tandai hipotesis |
| R-005 | Pasar B2B2G (desa/puskesmas) mau membayar | S3 | BELUM | Bukti pasar (wawancara) |
| R-006 | AI tidak cocok untuk semua pengguna (aksesibilitas, bias, konektivitas) | S3 | BELUM | Dinyatakan pemilik; nilai alasan |
| R-007 | Mesin deterministik lebih dapat diaudit daripada AI | S3 | BELUM | Argumen; periksa kebenaran bersyarat |

## G. Hal yang eksekutor TIDAK ketahui (isi bila Anda mengetahui)

- Nilai nutrisi aktual bahan Indonesia dan keandalan TKPI untuk mikronutrien.
- Sebaran bahan yang tersedia di posyandu target.
- Rujukan resmi daftar tanda bahaya yang disetujui dosen.
- Apakah kategori/aturan AKG berbeda untuk remaja hamil.
