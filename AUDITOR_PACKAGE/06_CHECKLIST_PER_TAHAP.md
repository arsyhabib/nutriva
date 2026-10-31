# 06 — Checklist per Tahap dan per Jenis Artefak

Gunakan sebagai **lantai**, bukan langit-langit. Centang hanya dengan bukti. Tambahkan butir sendiri bila perlu.

## A. Per tahap (milestone)

### Pra-M0 — A-SRC-0 dan A-SPEC-0 (audit awal)
- [ ] Verifikasi **seluruh** `08_REGISTER_KLAIM_DAN_RUJUKAN.md` terhadap sumber primer; tandai tiap klaim: TERVERIFIKASI / DIKOREKSI / TIDAK DAPAT DIVERIFIKASI
- [ ] Periksa konsistensi `REGISTRI_FITUR_NUTRIVA.md` dan `STRATEGI_PENGEMBANGAN.md` (ID unik, prioritas masuk akal, ketergantungan antar fitur, tidak ada kontradiksi dengan INV)
- [ ] Nilai ketegangan ruang lingkup (menu engine vs skrining posyandu) dan beri rekomendasi
- [ ] Nilai pilihan teknologi dan risiko (LP di browser, PDF.js offline, PWA di HP murah)
- [ ] Nilai rancangan mesin sumber (klaim, locator, hak cipta) — apakah realistis dan akurat
- [ ] Periksa ruang lingkup etik/regulasi: apakah ada hal yang memerlukan izin/etik sebelum pengembangan data riil
- [ ] Tinjau pembagian peran dan protokol verifikasi dosen
- [ ] Identifikasi minimal 10 risiko yang belum tercatat

### M0 — Fondasi
- [ ] Struktur proyek sesuai lapisan; mesin tidak mengimpor UI/DOM
- [ ] Skema data dan trace didefinisikan, berversi, divalidasi (Zod/JSON Schema)
- [ ] Uji dan lint berjalan di komputer bersih (perintah dari nol, dicoba oleh auditor)
- [ ] Git terinisialisasi; `.gitignore` aman (tidak ada rahasia/data pribadi)
- [ ] `CLAUDE.md`/dokumen aturan sesuai `04_`
- [ ] ADR awal ada dan masuk akal

### M1 — Walking skeleton
- [ ] Irisan menyeluruh bekerja offline: profil → kebutuhan → menu → jejak → buka satu sumber
- [ ] Hasil dapat direproduksi (benih)
- [ ] Nilai kebutuhan cocok dengan AKG (bandingkan dengan dokumen)
- [ ] Tidak ada angka tanpa klaim
- [ ] Demonstrasi pada HP berspesifikasi rendah (atau emulasi dengan throttling)

### M2 — Mesin lengkap
- [ ] Tiga mode; kategori dan batas usia benar
- [ ] Kasus baku ≥ 30 dengan nilai harapan dari **sumber independen** (bukan keluaran mesin sendiri)
- [ ] z-score diuji vs WHO Anthro (atau tabel resmi) pada batas usia, jenis kelamin, dan nilai ekstrem
- [ ] Filter keamanan lengkap dan tidak dapat dikalahkan (INV-03)
- [ ] Tanda bahaya (INV-07) diuji
- [ ] Self-check independen (K06) menolak hasil yang menyimpang
- [ ] Infeasible dan data kosong ditangani (INV-14)
- [ ] Verifikasi dosen atas AKG, aturan keamanan, kasus baku **terdokumentasi**

### M3 — Data dan sumber
- [ ] Setiap nilai bahan punya sumber, locator, dan tingkat bukti
- [ ] Verifikator build menolak klaim tanpa sumber
- [ ] Sampel acak ≥ 10% baris data dicek manual terhadap sumber (auditor)
- [ ] Satuan (RAE, DFE) benar; null tidak menjadi nol
- [ ] Lisensi data/sumber dipatuhi (ODbL, CC BY-NC-SA, domain publik, hak cipta jurnal)
- [ ] Pustaka Sumber membuka sumber di lokasi yang tepat; hash cocok
- [ ] Lembar review dosen tercipta dan dapat diimpor
- [ ] CVI terukur dengan prosedur yang benar

### M4 — Pengalaman
- [ ] Alur P0 selesai < target waktu pada pengguna nyata (≥ 5 orang)
- [ ] Aksesibilitas: axe, TalkBack, kontras, ukuran huruf, target sentuh, reduced motion
- [ ] Offline dan status sinkron jelas; kehilangan data nol saat jaringan putus
- [ ] Bahasa sederhana diuji pada ibu/kader (keterbacaan)
- [ ] Mode Kader vs Keluarga tidak membocorkan data lintas pengguna

### M5 — Riset, etik, AI
- [ ] Persetujuan etik ada; teks consent memadai (anak = subjek tidak langsung; orang tua memberi persetujuan)
- [ ] Minimisasi data; anonimisasi nyata (uji re-identifikasi sederhana)
- [ ] Instrumen (pre/post, SUS) sesuai metode baku; skor dihitung benar
- [ ] AI: validator, fallback, injeksi prompt, tanda bahaya, tidak ada pengiriman PII
- [ ] Ekspor data memenuhi UU PDP (hak akses, hapus)
- [ ] Gladi uji coba kecil dengan data sintetis

### M6 — Pra-demo
- [ ] Pembekuan kode; hanya perbaikan bug terdaftar
- [ ] Skenario demo dapat diulang offline; data demo sintetis
- [ ] Rencana cadangan (AI mati, listrik mati, proyektor, HP kader mati)
- [ ] Daftar pertanyaan penguji terjawab dengan bukti (lihat `07_` §7)

## B. Per jenis artefak

### B1. Mesin/logika
- [ ] Murni (INV-11); tidak ada `Math.random`, `Date.now` tersembunyi
- [ ] Rentang dan satuan eksplisit; tipe ketat; tidak ada `any` liar
- [ ] Batas usia/berat/tinggi dan nilai non-wajar ditangani
- [ ] Pembulatan terdokumentasi (kapan, ke mana, berapa)
- [ ] Floating-point: perbandingan dengan toleransi; tidak ada ketergantungan urutan iterasi
- [ ] Uji berbasis properti (monotonisitas, idempotensi, permutasi, konservasi)
- [ ] Cakupan uji untuk cabang keputusan klinis (bukan hanya baris)

### B2. Data
- [ ] Skema valid; ID stabil; versi data
- [ ] Sumber per nilai; tidak ada "angka misterius"
- [ ] Null vs 0; satuan; mentah vs matang; BDD
- [ ] Duplikasi dan sinonim bahan; pemetaan lintas basis data
- [ ] Kelas harga dan ketersediaan: asal dan tanggal; tidak menyiratkan harga pasti
- [ ] Peringatan keamanan per bahan lengkap (alergen, usia minimum, risiko)

### B3. Keselamatan
- [ ] Matriks: kondisi × bahan × usia/trimester dicek (bukan sampel acak saja)
- [ ] Ambang UL dan batas harian
- [ ] Penanda kondisi khusus → rujukan, tanpa saran terapi
- [ ] Aturan dapat diaudit dosen (format terbaca)
- [ ] Uji negatif: upaya melewati filter lewat preferensi/anggaran/bahan di rumah

### B4. UI/UX/aksesibilitas
- [ ] Hierarki jelas; satu tindakan utama per layar
- [ ] Teks sederhana; tidak memakai istilah medis tanpa penjelasan
- [ ] Pesan galat memberi langkah; keadaan kosong/loading
- [ ] Fokus keyboard/urutan baca; label ARIA benar; target sentuh; kontras; zoom 200%; reduced motion
- [ ] Mode gelap/terang tetap terbaca; tidak ada informasi hanya lewat warna
- [ ] Lokal: pemisah desimal koma, format tanggal Indonesia
- [ ] Performa: waktu muat, memori, ukuran bundel

### B5. Mesin sumber / provenansi
- [ ] Registri sumber: lisensi, hash, `boleh_redistribusi`
- [ ] Locator: halaman, tabel, baris, kutipan pendek, bbox; terbuka di lokasi yang benar
- [ ] Verifikator build: gagal bila klaim tanpa sumber, hash berubah, atau kutipan tidak ditemukan
- [ ] Status "terverifikasi-mesin" tidak disalahartikan sebagai "benar"
- [ ] Audit Pack dapat dijalankan ulang menghasilkan hasil identik
- [ ] Tidak ada sitasi yang dihasilkan AI

### B6. Lapisan AI
- [ ] AI menerima hanya jejak anonim; tidak ada PII
- [ ] Keluaran terstruktur; validator mencocokkan angka dan bahan dengan jejak
- [ ] Fallback templat berfungsi ketika AI mati atau menolak
- [ ] Uji injeksi prompt (lewat chip, nama bahan, catatan bebas)
- [ ] Permintaan di luar cakupan (diagnosis, dosis obat) ditolak dengan rujukan
- [ ] Biaya, laju, cache; kunci tidak di klien
- [ ] Ukur kesesuaian pada sampel ≥ N kalimat (N ditentukan di REQ)

### B7. Riset dan etik
- [ ] Persetujuan etik; teks persetujuan; hak menarik diri
- [ ] Data pribadi minimum; kode partisipan; penyimpanan dan penghapusan
- [ ] Instrumen valid; urutan tidak menimbulkan bias berlebih
- [ ] Rencana analisis statistik ditetapkan sebelum data dilihat
- [ ] Pelaporan: STROBE/mERA; keterbatasan dinyatakan

### B8. Keamanan teknis
- [ ] Tidak ada rahasia di repo/klien; `.env` diabaikan
- [ ] Dependensi: audit kerentanan dan lisensi
- [ ] XSS/injeksi: seluruh keluaran dari masukan pengguna dilepas-escape
- [ ] CSP dan header yang sesuai bila di-host
- [ ] Penyimpanan lokal: enkripsi untuk data sensitif atau minimisasi
- [ ] QR/berkas impor: validasi skema, tanda tangan/integritas, batas ukuran
- [ ] Service worker: strategi cache tidak menyajikan data lama yang berbahaya (versi aturan keamanan lama)

## C. Audit proses (setiap A-IMPL)
- [ ] Uji ditulis lebih dulu atau bersamaan; jejak commit mendukung
- [ ] Laporan eksekutor sesuai kenyataan kode
- [ ] Ruang lingkup tidak membengkak; fitur di luar registri tidak menyelinap
- [ ] ADR dibuat untuk keputusan inti
- [ ] CHANGELOG, registri, LEDGER diperbarui
- [ ] Klaim "selesai" punya bukti
