# Strategi Pengembangan NUTRIVA (draf v0.1)

Tujuan: aplikasi gizi 1000 HPK yang deterministik, bisa diperiksa, offline-first, dapat dikembangkan tanpa merusak fondasi, dan bisa diverifikasi oleh dosen ahli gizi.

> **Pembaruan 2026-10-28:** rilis dibagi menjadi **V-PJBL** dan **V-KOMPETISI**, ruang lingkup M1 dipangkas, dan beberapa gerbang berubah. Lihat `KEPUTUSAN_DAN_JALUR_RILIS.md` (otoritatif bila berbeda dengan tabel milestone di bawah).

## 1. Sistem kerja: bertingkat di inti, komplementer di sekitarnya

- **Bertingkat (berurutan, dengan gerbang):** kontrak data, mesin inti, dan skema jejak. Semua fitur bergantung pada ini, jadi harus stabil dan diverifikasi lebih dulu.
- **Komplementer (jalur paralel):** setelah kontrak dibekukan, jalur-jalur ini berjalan bersamaan dan saling melengkapi.

| Jalur | Isi | Penanggung jawab utama |
|---|---|---|
| T1 Mesin | Perhitungan, keamanan, optimasi, self-check, uji kasus baku | Claude + Anda |
| T2 Data dan sumber | Basis bahan, registri sumber, lembar review | Anda + dosen ahli gizi |
| T3 Pengalaman | UI, mode kader/keluarga, aksesibilitas, offline | Claude + Anda |
| T4 Riset dan skripsi | Etik, instrumen, rancangan uji, penulisan | Anda + dospem |
| T5 Lapisan AI | Penjelas, chip, validator | Claude |
| T6 Bisnis | Kanvas, wawancara pasar, model pendapatan | Anda |
| T7 Desain dan estetika | Sistem desain bertoken, palet kontras semi-kuat konsisten, minimalis, kenyamanan; **sesi khusus penyempurnaan** (lihat `TASKLIST.md` §4 dan registri kelompok L) | Claude + Anda |

**Peran:** Anda sebagai pemilik produk dan penanggung jawab lapangan; dosen sebagai verifikator di gerbang; Claude sebagai pelaksana pengembangan, penulis uji, dan peninjau kode.

## 2. Arsitektur longgar (tidak merusak fondasi lama)

```
Lapisan 4  Layanan opsional   AI, sinkron, ekspor
Lapisan 3  Cangkang aplikasi  rute, mode, penyimpanan, i18n, aksesibilitas
Lapisan 2  Modul fitur        satu fitur = satu modul terdaftar
Lapisan 1  Mesin inti         fungsi murni, tanpa DOM, tanpa jaringan
Lapisan 0  Data dan sumber    JSON berskema, versi, klaim, locator
```

**Aturan arsitektur:**
1. **Mesin inti = fungsi murni** (TypeScript, tanpa DOM). Dapat dijalankan di Node untuk uji massal, verifikasi build, dan Audit Pack.
2. **Pipa tahap tetap:** Profil → Kebutuhan → Saring Keamanan → Optimasi → Peringkat → Penjelasan. Fitur baru **mengait** pada titik ekstensi tahap-tahap ini, tidak mengubah isinya. Contoh: bioavailabilitas masuk di tahap Peringkat; utang gizi masuk di tahap Kebutuhan.
3. **Modul terdaftar:** tiap modul mengikuti antarmuka `{id, versi, bergantung, skema, hitung(), jelaskan(), klaim[]}` dan didaftarkan ke registri modul. Menambah fitur berarti menambah modul + uji, bukan mengedit modul lama.
4. **Skema jejak (trace) berversi.** Perubahan skema = versi baru dengan migrasi, tidak mengubah yang lama.
5. **Data bukan kode.** Bahan, aturan, ambang, dan sumber hidup di berkas JSON bervalidasi skema (Zod), terpisah dari logika, sehingga dosen dapat meninjau tanpa membaca kode.
6. **Uji karakterisasi (golden tests):** 30+ kasus baku. Bila keluaran kasus lama berubah, uji gagal dan perubahan harus disetujui eksplisit.
7. **Saklar fitur** (`flags`) untuk fitur P1/P2 dan AI. Fitur belum matang tidak boleh mengganggu demo.
8. **Versi semantik** untuk mesin dan data. Setiap hasil memuat `engine_version` dan `data_version`.
9. **Migrasi penyimpanan:** IndexedDB berversi, ada skrip migrasi dan uji migrasi.
10. **AI terisolasi:** hanya menerima jejak, hanya mengeluarkan data terstruktur, selalu ada templat cadangan.
11. **ADR (catatan keputusan arsitektur)** untuk setiap perubahan inti, supaya alasan terdokumentasi (berguna di bab metode skripsi).

**Usulan teknologi (final setelah prototipe):** TypeScript ketat, Vite, Preact (bundel kecil untuk HP murah), Vitest, Zod, Dexie (IndexedDB), vite-plugin-pwa, PDF.js. Pemecah LP: `HiGHS` (WASM) bila butuh harga bayangan (dual); `javascript-lp-solver` bila cukup. Putuskan lewat prototipe kecil.

## 3. Siklus kerja per peningkatan

1. Pilih satu item dari registri.
2. Tulis mini-spesifikasi dan **kriteria penerimaan**.
3. Tulis uji lebih dulu.
4. Implementasi.
5. Jalankan uji, lint, pemeriksaan aksesibilitas (axe), dan ukuran bundel.
6. Demo (tangkapan layar atau pratinjau browser).
7. Catat ADR dan perubahan (CHANGELOG), perbarui status di registri.
8. Commit (git).

**Pengendalian versi:** folder ini belum git. Langkah awal: `git init`, cabang per fitur, tag per milestone.

**Memori antar-sesi:** `CLAUDE.md` di akar proyek memuat aturan arsitektur di atas supaya setiap sesi pengembangan konsisten.

## 4. Milestone dan gerbang

| M | Isi | Gerbang keluar |
|---|---|---|
| M0 | Fondasi: git, struktur, skema data dan jejak, CI uji, CLAUDE.md | Skema disetujui Anda |
| M1 | **Walking skeleton:** satu irisan menyeluruh (anak 12–23 bulan → profil → AKG → 30 bahan → menu → jejak → buka satu sumber) | Demo kecil ke dosen |
| M2 | Mesin lengkap 3 mode, lapisan keamanan, 30+ kasus baku, self-check | **Verifikasi dosen** atas AKG, aturan keamanan, kasus baku |
| M3 | Data 300–600 bahan, verifikator sumber, lembar review, Pustaka Sumber | CVI memenuhi ambang |
| M4 | UX, aksesibilitas, offline, mode ahli, mode kader | Uji kegunaan awal (5 pengguna) |
| M5 | Instrumen riset, izin etik, lapisan AI (saklar), uji coba kecil | Etik disetujui, gladi bersih |
| M6 | **Pembekuan kode** sebelum hari H, data demo, latihan presentasi | Hanya perbaikan bug |

## 5. Protokol verifikasi dosen (tanpa membaca kode)

1. Mesin mengekspor **lembar review** (XLSX/CSV): bahan, nilai, sumber, locator, status.
2. Dosen menandai `setuju / koreksi / tolak` beserta catatan.
3. Hasil diimpor kembali; klaim yang disetujui berstatus **terverifikasi-manusia (nama, tanggal, versi)**.
4. Aplikasi menampilkan stempel verifikasi di Mode Ahli ("Diverifikasi oleh ..., v1.2").
5. Perubahan setelah verifikasi menandai klaim terkait sebagai "perlu verifikasi ulang".

## 6. Risiko utama

| Risiko | Mitigasi |
|---|---|
| Kurasi data memakan waktu | Mulai 100 bahan inti, perluas bertahap; prioritaskan bahan yang dipakai di menu demo |
| Ruang lingkup membengkak | Registri sebagai sumber kebenaran; fitur baru masuk P1/P2 kecuali disetujui |
| Ketersediaan dosen | Jadwalkan gerbang M2 dan M3 sejak awal; lembar review mempercepat |
| Izin etik terlambat | Ajukan paralel dengan M2, bukan setelah selesai |
| AI mati/mahal/lambat saat demo | Saklar, templat cadangan, cache |
| Regresi saat menambah fitur | Golden tests dan ADR |
| HP uji kader tidak kompatibel | Uji lebih awal di HP murah |

## 7. Yang sengaja tidak dibuat (menjaga identitas)

Chatbot bebas, pelacak kalori ala diet, deteksi makanan dari foto, telemedis, marketplace penuh, pengenalan wajah.
