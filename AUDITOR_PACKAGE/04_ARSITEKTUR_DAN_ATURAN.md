# 04 — Arsitektur, Aturan, dan Invarian

Sumber utama: `../STRATEGI_PENGEMBANGAN.md` (baca dulu). Berkas ini memuat **hal yang dapat diuji**.

## 1. Lapisan

```
L4 Layanan opsional   AI, sinkron, ekspor
L3 Cangkang aplikasi  rute, mode, penyimpanan, i18n, aksesibilitas
L2 Modul fitur        satu fitur = satu modul terdaftar
L1 Mesin inti         fungsi murni (TypeScript), tanpa DOM/jaringan
L0 Data dan sumber    JSON berskema, klaim, locator, versi
```

Pipa tetap: **Profil → Kebutuhan → Saring Keamanan → Optimasi → Peringkat → Penjelasan**. Fitur baru mengait pada tahap, tidak mengubah isi tahap.

## 2. Invarian (harus selalu benar; setiap invarian harus punya uji otomatis)

| ID | Invarian |
|---|---|
| INV-01 | Nilai gizi `null` tidak pernah diperlakukan sebagai 0; total melacak "tidak ada data" |
| INV-02 | Masukan + benih + `engine_version` + `data_version` → keluaran **identik pada presisi yang ditampilkan dan disimpan** (bukan "bit demi bit": fungsi transendental seperti `Math.exp`/`Math.log`/`Math.pow` dapat berbeda di ujung digit antar peramban). Jalur keputusan klasifikasi memakai tabel resmi dan bilangan bulat/pembulatan eksplisit; diuji lintas peramban (J12). *Direvisi setelah audit RPT-0002 R05* |
| INV-03 | Filter keamanan berjalan **sebelum** optimasi dan **tidak dapat dikalahkan** oleh skor, preferensi, anggaran, atau AI |
| INV-04 | Setiap konstanta/ambang/aturan/nilai data memiliki `claim_id` yang valid; build gagal bila tidak |
| INV-05 | Jejak (trace) lengkap: jumlah per bahan = total yang ditampilkan; tiap langkah menunjuk klaim |
| INV-06 | AI tidak menghasilkan angka, bahan, sitasi, atau keputusan keamanan; semua keluaran AI divalidasi kode |
| INV-07 | Deteksi tanda bahaya (aturan tetap) berjalan sebelum rekomendasi dan sebelum AI |
| INV-08 | Tidak ada pengenal pribadi dalam log, ekspor riset, atau permintaan AI |
| INV-09 | Seluruh fungsi inti berjalan **tanpa jaringan** |
| INV-10 | Setiap besaran membawa satuan eksplisit; konversi satuan hanya lewat modul tunggal |
| INV-11 | Mesin tanpa efek samping (murni); tidak memakai `Date.now()`/`Math.random()` tanpa disuntikkan |
| INV-12 | Hasil menampilkan batas/ketidakpastian yang relevan |
| INV-13 | Tidak ada bahasa diagnosis atau klaim terapi; kondisi khusus → penandaan dan rujukan |
| INV-14 | Infeasible/tidak ada data tidak menghasilkan galat diam atau menu "ajaib"; harus terlapor |
| INV-15 | Parsing masukan menerima koma dan titik desimal sesuai lokal Indonesia tanpa salah tafsir |
| INV-16 | Tanggal diproses dalam zona waktu yang konsisten (WIB) dan tahan tahun kabisat |
| INV-17 | Teks masukan pengguna tidak pernah dieksekusi/ditafsirkan sebagai kode atau HTML |
| INV-18 | Perubahan keluaran kasus baku hanya melalui persetujuan eksplisit (snapshot diperbarui dengan ADR) |

## 3. Aturan proses

1. **Uji lebih dulu** untuk logika gizi dan keamanan.
2. **Satu perubahan = satu tujuan**; commit kecil, pesan jelas.
3. **Registri adalah sumber kebenaran backlog**; fitur baru dicatat sebelum dibangun.
4. **ADR** untuk setiap keputusan arsitektur atau perubahan skema.
5. **Saklar fitur** untuk P1/P2 dan AI.
6. **Semantic versioning** untuk mesin, data, dan skema trace; migrasi berversi untuk IndexedDB.
7. **Tidak ada rahasia di kode klien.** Kunci AI hanya di server perantara.
8. **Anggaran performa:** muat cepat pada koneksi lambat, bundel inti kecil; diuji di HP berspesifikasi rendah.
9. **Aksesibilitas otomatis** (axe) dan manual (TalkBack) pada alur P0.
10. **Lisensi dependensi dan data** dicatat; tidak menyertakan data berlisensi terbatas.

## 4. Definisi Selesai (DoD) per peningkatan

- [ ] Kriteria penerimaan terpenuhi dan diuji otomatis
- [ ] Uji kasus baku lama tidak berubah (atau perubahan disetujui + ADR)
- [ ] Klaim sumber terdaftar dan (bila memengaruhi hasil) berstatus terverifikasi
- [ ] Invarian relevan diuji
- [ ] Aksesibilitas dasar diperiksa
- [ ] Dokumentasi dan CHANGELOG diperbarui; status registri diperbarui
- [ ] Permintaan audit dikirim; temuan S0/S1 sudah ditutup
- [ ] Keterbatasan dan asumsi ditulis

## 5. Teknologi yang diusulkan (belum diprototipekan)

TypeScript ketat · Vite · Preact · Vitest · Zod · Dexie · vite-plugin-pwa · PDF.js · pemecah LP (HiGHS-WASM atau javascript-lp-solver). **Auditor diminta menilai kecocokan pilihan ini** pada A-SPEC-0.
