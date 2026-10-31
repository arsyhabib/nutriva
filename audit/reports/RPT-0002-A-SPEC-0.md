# RPT-0002 — A-SPEC-0: Audit rancangan (registri, strategi, tasklist, jalur desain)

- **Permintaan:** REQ-0002-A-SPEC-0-audit-rancangan
- **Auditor:** Auditor independen · **Tanggal:** 2026-10-28
- **Objek:** `REGISTRI_FITUR_NUTRIVA.md` (A–L, Rancangan Mesin Sumber), `STRATEGI_PENGEMBANGAN.md`, `TASKLIST.md`
- **Basis fakta:** RPT-0001 (klaim angka) dan teks primer Permenkes 2/2020 dan PMK 28/2019 yang saya baca sendiri (lihat `audit/evidence/`).

## Vonis: **DITOLAK** sebagai dasar M0 — dapat diajukan ulang setelah pemangkasan P0 dan keputusan S1

Alasan: ada S1 terbuka pada rancangan (AUD-0002-01 sampai -09; lihat "Temuan bernomor"). Arah besar tidak salah, tetapi cakupan P0 terlalu besar untuk satu semester dan dua kali lipat, dan sejumlah klaim dan fitur bergantung pada data yang belum ada hak penggunaannya.

## Jawaban pertanyaan REQ (ringkas, dengan butir)

**1. Ruang lingkup.** Registri berisi sekitar 140 fitur A–J ditambah K (14) dan L (14). Daftar "Fondasi (P0 inti)" di registri memuat 21 rentang (sekitar 75 ID); pada registri saat ini tercatat 88 P0 dari 153 ID (lihat RPT-0003 butir 2b). Itu bukan MVP. **Rekomendasi pemangkasan P0:**
- Ambil dari P0 untuk M1: A01, A02, A03, A06 (30 bahan, bukan 300), A07 (versi sederhana: pilih dari slot, tanpa LP), A10 tidak dipakai (lihat butir 6), A11, A12, A13, A14, A18, B01, B02, B03, B06, B07, D01, D02, D10 (versi JSON saja), E04, G01–G03, G13, H01–H03, H09–H12, J01, J02, J07.
- Tunda ke P1 atau P2: A04 status gizi hingga tabel resmi diputuskan, K01–K14 seluruhnya, C01–C03, C08–C11, D05 (Pustaka hingga verifikasi), D11, F01–F08, L07, L09, L10, I01–I07.
- **Ketegangan dua pusat gravitasi:** saya menilai keduanya tidak koheren sebagai satu produk pada tahap awal. Menu butuh basis bahan dan LP; skrining butuh tabel SD resmi dan logika tren. Rekomendasi: menu sebagai inti (ini sesuai keinginan pemilik), skrining minimal hanya kalkulator status anak (A04) tanpa radar faltering dan tanpa tindak lanjut sampai M3. Dosen menilai satu fitur sempurna lebih baik daripada dua setengah jadi.

**2. Kelayakan teknis.** TypeScript, Preact, Vite, Vitest, Zod, Dexie, vite-plugin-pwa adalah pilihan wajar dan umum. Dua hal yang saya nilai berisiko untuk vibe coder:
- **Pemecah LP di peramban (HiGHS-WASM).** Ukuran unduhan, waktu muat di HP murah, dan determinisme antar mesin belum diukur. Belum ada prototipe (TASKLIST §3 mengakui). Jalur yang lebih aman: menu berbasis slot dengan heuristik deterministik dan uji properti. LP tetap dapat ditambahkan sebagai pembanding offline.
- **PDF.js dengan bbox.** Biaya integrasi besar dan bergantung pada kualitas bbox semi-otomatis (registri §7 mengakui). Untuk M1–M3 cukup kutipan halaman dan tabel dengan SHA-256.

**3. Mesin sumber dan provenansi.** Locator berkoordinat, hash, dan verifikator build layak. Tetapi:
- Verifikasi mesin hanya membuktikan teks ada, bukan bahwa tafsirnya benar (registri §7). Label "terverifikasi-mesin" berisiko disalahbaca sebagai "benar". Ganti nama status menjadi "teks-ditemukan-mesin" dan pakai "terverifikasi-manusia" hanya dengan nama dan tanggal dosen.
- Hak cipta: C-076 (WHO CC BY-NC-SA 3.0 IGO) membatasi penggunaan komersial. Rancangan B2B2G dan kompetisi kewirausahaan dapat bertabrakan dengan klausa NC. Ini perlu keputusan tertulis. Belum saya verifikasi lisensi WHO dari halaman resmi.
- Lisensi TKPI belum diketahui (C-006). Ini menjadi blocker untuk mengirim data turunan TKPI di dalam aplikasi. Ini S1 terbuka untuk M3 (lihat AUD-0002-03).

**4. Keselamatan klinis.** Lapisan keamanan ada, tetapi daftar belum lengkap dan belum disetujui dosen:
- Tidak ada aturan untuk remaja hamil di bawah 19 tahun, usia di atas 40, kehamilan kembar, HPHT tidak diketahui, prematur (usia koreksi), edema bilateral, usia tidak diketahui, sindrom tertentu. Semua ada di bagian "skenario ekstrem" `07_` §4 dan tidak masuk registri.
- Tanda bahaya (B03) belum punya daftar baku yang ditandatangani. Permintaan dosen ini harus menjadi gerbang M2.
- Keputusan AKG untuk anak yang masih ASI: F-03 HASIL benar. Rancangan belum menyebut cara membedakan "menu tambahan" dari "menu total".
- Kondisi khusus (B04) berpotensi terdengar seperti terapi bila menu dibuat untuk diabetes atau hipertensi. Perlu daftar kata terlarang dan uji.

**5. Bioavailabilitas (A17).** Dibuang atau diubah menjadi kualitatif. AKG tercetak memuat asumsi 75% heme untuk besi dan asumsi seng bioavailabilitas tinggi/sedang (RPT-0001, AUD-0001-03). Mengalikan lagi dengan faktor FAO/WHO 2004 (C-028, belum terverifikasi) berarti menghitung dua kali. A17 hanya boleh menjadi saran pasangan pangan (penguat/penghambat) tanpa angka serapan.

**6. Etik dan regulasi.** Dua hal memerlukan keputusan sebelum data riil:
- **Data anak di posyandu.** Pengukuran antropometri anak nyata adalah data pribadi sensitif (UU 27/2022, sumber sekunder untuk pasal). Persetujuan etik dan persetujuan orang tua harus ada sebelum hari H, bukan setelahnya. Ini tidak diwajibkan oleh registri secara tegas; F01 hanya persetujuan digital.
- **Status alat kesehatan perangkat lunak.** Belum saya verifikasi (TIDAK DAPAT DIVERIFIKASI). Pemilik perlu bertanya ke dosen atau instansi sebelum klaim "skrining" dipakai di publik.

**7. Jalur desain (T7/L).**
- Risiko bentrok: "kontras semi-kuat" belum didefinisikan secara numerik. Minimum WCAG untuk teks 4,5:1 dan elemen UI 3:1 adalah batas bawah, bukan selera. Tafsiran "tidak hitam murni" sah, tetapi harus diuji untuk semua keadaan (fokus, nonaktif, galat) dan mode gelap.
- "Status aman/perhatian/segera" dengan warna dan ikon yang empatik (L11) benar, tetapi kata "segera" bisa memicu kecemasan. Uji dengan ibu dan kader pada M4.
- Target sentuh 48 dp (H03, L08) adalah pilihan rancangan yang sah dan tercatat sebagai lebih ketat dari WCAG 2.5.8 (24 px). Tidak masalah.

**8. Strategi audit.** Protokol, gerbang, dan paket memadai untuk kendali kualitas. Yang hilang:
- Tidak ada aturan siapa yang menetapkan nilai harapan untuk 30+ kasus baku. Protokol meminta sumber independen (`06_` M2), tetapi registri tidak menunjuk sumbernya.
- Tidak ada kebijakan untuk eksekutor yang menemukan dirinya tidak bisa mengakses sumber (akses web diblokir sebagian; RPT-0001 menghadapi itu).
- Belum ada threat model keamanan teknis (XSS, impor QR/JSON, penyimpanan lokal). B8 di `06_` memang ada, tetapi tidak dikaitkan dengan fitur.

**9. Narasi kompetisi dan skripsi.** Klaim berlebihan yang saya temukan:
- Skor NUTRIVA 0–100 (A10) dengan bobot kecukupan, keamanan, variasi, biaya, bioavailabilitas. Bobotnya tidak punya sumber. Ini asumsi D tetapi diperlakukan sebagai skor ilmiah. Hapus dari M1–M3 atau beri label "skor edukatif, bobot pengembang".
- "Menu lebih baik daripada ahli gizi" (uji 8 di `07_` §8) belum punya desain uji. Jangan dijanjikan di presentasi.
- "Verifikasi ... sumber" dalam narasi seolah bukti; lihat butir 3.
- "Sumber berkoordinat dapat dibuka di aplikasi" sebagai klaim utama: perlu hak penggunaan dan pembatasan PDF.

## Argumen penolakan terkuat terhadap tiga keputusan terbesar

Permintaan: argumen penolakan yang paling kuat, bukan yang lemah.

**(a) Niche mesin gizi (menu 1000 HPK sebagai produk utama).**
- Penolakan terkuat: Tidak ada basis bahan yang punya hak pakai untuk 300–600 bahan Indonesia dengan harga dan nilai gizi (C-006, C-073). Tanpa itu, mesin menu hanya bisa berjalan pada contoh sintetis, dan "menu terbaik" berarti optimasi atas data mainan. Penguji ahli gizi akan langsung menanyakan data mana yang dipakai. Jawaban yang jujur akan melemahkan klaim utama.
- Penolakan kedua: Optimasi murni menghasilkan menu tidak realistis; `03_` §4.6 dan literatur Darmon yang disebut sendiri mengakuinya. Solusi slot dan penalti pengulangan adalah heuristik yang tidak diuji. Satu pertanyaan penguji ("mengapa menu ini bukan menu lain?") akan sulit dijawab tanpa uji membandingkan dengan ahli gizi.
- Penolakan ketiga: Nilai pasar B2B2G belum dibuktikan (R-005). Niche yang dipilih karena "unik" belum tentu layak dibiayai.
- Respons yang disarankan: pertahankan menu sebagai demo M1, tetapi kurangi basis bahan jadi 30 bahan terverifikasi (sesuai M1 di strategi) dan pindahkan fokus skripsi ke akurasi kalkulasi kebutuhan (A03) dan keselamatan (B01–B03), yang bisa diverifikasi dengan kasus baku.

**(b) Deterministik + AI sebagai penjelas.**
- Penolakan terkuat: Dua sistem menambah permukaan serangan (injeksi lewat chip dan nama bahan, `07_` §7) dan biaya pemeliharaan. Validator yang mencocokkan angka tidak membuktikan bahwa penjelasan tidak menyesatkan. Penjelasan yang benar secara angka tetapi keliru secara konteks, misalnya tentang tanda bahaya, tetap lolos. Keuntungan bagi pengguna tidak jelas, karena penjelasan templat bisa sederhana.
- Penolakan kedua: "Deterministik" juga belum terbukti. Hasil identik bit antar mesin (INV-02) bergantung pada urutan iterasi, fungsi matematika bawaan (`Math.exp`, `Math.log`) yang dapat berbeda antar peramban, dan pemecah LP. Klaim "dapat diperiksa" perlu uji lintas-peramban, bukan hanya di Node.
- Penolakan ketiga: AI menyentuh data anak (INV-08); kebijakan pengiriman profil ke layanan eksternal belum diputuskan (`01_` §5).
- Respons: tunda AI ke M5 seperti di strategi, dan kunci sebagai saklar mati pada rilis hari H. Uji determinisme lintas peramban sebelum klaim.

**(c) Mesin sumber berkoordinat (bbox, PDF.js, verifikator build).**
- Penolakan terkuat: Ini bagian paling mahal dan tidak diperlukan untuk M1–M2. Verifikasi mesin hanya menjamin teks; kebenaran tafsir tetap manusia (registri §7). Mode ahli dengan kutipan halaman dan SHA-256 sudah memenuhi kebutuhan penguji untuk sebagian besar pertanyaan.
- Penolakan kedua: Hak cipta. Sumber WHO CC BY-NC-SA dan jurnal berhak cipta tidak boleh disertakan sebagai berkas. Itu berarti "buka sumber" di aplikasi sebagian besar hanya membuka tautan eksternal. Mesin sumber berkoordinat menjadi tampilan mewah untuk sebagian kecil sumber.
- Penolakan ketiga: PDF pindai (TKPI) membutuhkan OCR dan kurasi manual; itu berarti pekerjaan kader dan dosen yang sudah berat ditambah.
- Respons: M1–M3 cukup dengan locator halaman dan tabel serta SHA-256. bbox dan PDF.js dipindah ke P2.

## Temuan bernomor

| Nomor | Asal | Tingkat |
|---|---|---|
| AUD-0002-01 | R02 data anak sebelum etik | S0 |
| AUD-0002-02 | R06 tanda bahaya belum baku | S0 |
| AUD-0002-03 | R01 lisensi TKPI | S1 |
| AUD-0002-04 | R03 status alat kesehatan | S1 |
| AUD-0002-05 | R05 determinisme lintas peramban | S1 |
| AUD-0002-06 | R07 kategori khusus tidak ada aturan | S1 |
| AUD-0002-07 | R08 service worker versi aturan | S1 |
| AUD-0002-08 | R10 HP bersama lintas keluarga | S1 |
| AUD-0002-09 | R14 dua standar WHO vs Permenkes | S1 |
| AUD-0002-10 | R04 skor A10 tanpa bobot bersumber | S2 |
| AUD-0002-11 | R09 IndexedDB hilang | S2 |
| AUD-0002-12 | R11 berkas legacy V8 (premis keliru, lihat RPT-0003) | S2 |
| AUD-0002-13 | R12 lembar review dosen | S2 |
| AUD-0002-14 | R13 stigma | S2 |
| AUD-0002-15 | R15 threat model | S2 |
| AUD-0002-16 | R16 ketergantungan satu dosen | S2 |
| AUD-0002-17 | R17 pembacaan visual AKG | S2 |

Total: S0 2, S1 7, S2 8. Nomor R01–R17 tetap dipakai sebagai rujukan di tabel berikut.

## Daftar risiko yang belum tercatat (≥ 10)

| ID | Risiko | Tingkat | Rekomendasi |
|---|---|---|---|
| AUD-0002-R01 | Lisensi TKPI belum diketahui; data turunan tidak boleh dikirim | S1 | Keputusan tertulis sebelum M3 |
| AUD-0002-R02 | Data anak di posyandu sebelum etik disetujui | S0 | Hari H hanya data sintetis atau data yang sudah lolos etik |
| AUD-0002-R03 | Status alat kesehatan perangkat lunak belum jelas | S1 | Konsultasi dosen/instansi |
| AUD-0002-R04 | Skor A10 dengan bobot tanpa sumber | S2 | Hapus atau beri label D |
| AUD-0002-R05 | Determinisme lintas peramban belum diuji | S1 | Uji lintas-peramban di M1 |
| AUD-0002-R06 | Daftar tanda bahaya belum baku dan belum disetujui | S0 | Gerbang M2 |
| AUD-0002-R07 | Tidak ada aturan untuk prematur, kembar, usia ibu ekstrem, edema, sindrom | S1 | Tambahkan ke registri B; tolak atau tandai |
| AUD-0002-R08 | Service worker menyajikan aturan keamanan lama (`06_` B8) | S1 | Versi minimum aturan keamanan dan paksa muat ulang |
| AUD-0002-R09 | IndexedDB dapat dihapus peramban atau penuh; data riwayat hilang | S2 | Ekspor manual dan peringatan |
| AUD-0002-R10 | Satu HP kader dipakai banyak keluarga; data lintas keluarga bocor | S1 | Mode kader dengan kunci sesi dan hapus otomatis |
| AUD-0002-R11 | Berkas legacy V8 di folder proyek memuat kunci publik Supabase; risiko salah pakai konfigurasi | S2 | Jangan impor; hapus dari jalur build |
| AUD-0002-R12 | Lembar review XLSX dosen belum diuji dengan dosen | S2 | Uji alur impor-ekspor dengan contoh |
| AUD-0002-R13 | Label "stunting" dan skor rendah dapat menghakimi ibu | S2 | Protokol bahasa dan uji dengan ibu (L11, M4) |
| AUD-0002-R14 | Dua standar (WHO vs Permenkes 2/2020) menghasilkan kelas berbeda; belum diputuskan yang ditampilkan | S1 | ADR dan uji pada batas bulan 24 |
| AUD-0002-R15 | Tidak ada threat model untuk impor QR/JSON dan penyimpanan | S2 | Tambahkan ke `06_` B8 dan uji |
| AUD-0002-R16 | Kebergantungan pada satu dosen yang identitasnya belum diketahui | S2 | Konfirmasi dan jadwal gerbang |
| AUD-0002-R17 | Pembacaan visual AKG oleh eksekutor (RPT-0001 AUD-0001-03) | S2 | Dosen membaca ulang tabel sebelum M2 |

## Pemangkasan P0 yang saya usulkan (ringkas)

Tetap P0 untuk M1: lihat butir 1. Tunda: lihat butir 1. Hapus dari P0: K01, K02, K03, K04, K05, K07, K08, K09, K10, K11, K12, K13 (kecuali K06 dan K14 yang tetap P0 karena alasan keselamatan dan UU PDP). Pindahkan A10, A17, B05, D08, D09, D12, D13, E-series (kecuali E04–E05), H06–H08, I-series ke P1–P2.

## Yang tidak saya periksa

- Isi kode: belum ada kode, sehingga tidak ada audit implementasi.
- Pembacaan teks lengkap WHO CGS 2006, IOM 2001, IYCF 2021, dan pedoman TTD Kemenkes (tidak terbuka dalam sesi ini).
- Lisensi WHO dan TKPI dari sumber resmi (belum dicari).
- Kelayakan HiGHS-WASM dan javascript-lp-solver: tidak diukur.
- Status hukum alat kesehatan perangkat lunak: tidak diperiksa.
- Desain visual dan palet: hanya kerangka aturan, tidak ada palet untuk diuji.
- Aspek bisnis (T6, I01–I07): tidak dinilai, bukan wewenang auditor di tahap ini.
