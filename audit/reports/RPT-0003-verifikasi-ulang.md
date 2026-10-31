# RPT-0003 — Verifikasi ulang RSP-0001 dan RSP-0002

- **Menjawab:** REQ-0003-verifikasi-ulang-RSP-0001-0002 · **Jenis:** A-SRC lanjutan + verifikasi ulang
- **Auditor:** Auditor independen · **Tanggal:** 2026-10-28
- **Objek:** `audit/responses/RSP-0001-A-SRC-0.md`, `RSP-0002-A-SPEC-0.md`; artefak yang diedit eksekutor (registri, `03_`, `04_`, `10_`)
- **VONIS: DITOLAK** (untuk penutupan AUD-0001-01 TTD). Butir lain diterima dengan koreksi yang tercantum.

## 1. Ringkasan
- Sebagian besar perbaikan benar dan lengkap: 77% dicabut, A17 kualitatif, config V8 tanpa kunci, 24 bulan diakui ambigu, C-013 terverifikasi penuh, tabel AKG cocok.
- **Koreksi pada eksekutor:** Permenkes 21/2021 **dicabut sebagian** (Pasal 85 Permenkes 2/2025, huruf d), bukan seluruhnya. Penulisan "tidak berlaku" di `03_` dan registri terlalu luas (AUD-0003-01).
- **Tetap terbuka:** TTD. Pedoman primer yang terbaca menyebut 60 mg besi dan 400 mcg folat per tablet, tidak 0,25 mg. Klaim "90 tablet selama hamil" belum terverifikasi (AUD-0003-02, S1). Karantina RSP-0001 sudah tepat, tetapi tutup S1 belum sah.
- **Koreksi auditor (saya):** (a) label DFE di EVD-0001 salah, (b) pernyataan "ratusan ID" di RPT-0002 keliru, (c) premis R11 diikuti dari `10_` tanpa membuka berkas. Ketiganya sudah diperbaiki (AUD-0003-04..06).
- **Tidak dapat diverifikasi:** aturan WHO 24 bulan (primer tidak terbuka) (AUD-0003-03).

## 2. Hasil per butir REQ-0003

### Butir 1 — Penomoran temuan RPT-0002
Selesai. Bagian "Temuan bernomor" ditambahkan ke RPT-0002: AUD-0002-01..02 (S0), -03..09 (S1), -10..17 (S2). Frasa vonis diperbaiki. Total S0 2, S1 7, S2 8. (Catatan: berkas RPT-0002 berubah di disk saat sesi ini; perubahan saya hanya pada bagian yang tercantum.)

### Butir 2a — Folat: DFE atau tidak
- Render tegak halaman 9 PMK 28/2019: header Tabel 2 tertulis **"Folat (mcg)"**, tanpa DFE (`EVD-0003` §1).
- **RPT-0001 F-01 benar.** `EVD-0001` §2 yang menulis "DFE" salah; sudah dikoreksi.

### Butir 2b — Hitungan ID P0
- Hitungan langsung dari registri saat ini: 153 ID; 88 P0; 57 P1; 8 P2.
- RSP-0002 menyebut 143 ID (80/56/7) pada snapshot sebelumnya. Selisih dapat direkonsiliasi (`EVD-0003` §2): B10–B14 dan J09–J13 ditambahkan, A10 turun dari P0 ke P2, J11 P1.
- **Klaim "ratusan ID" di RPT-0002 keliru.** Pengganti: "21 rentang sekitar 75 ID pada snapshot awal; 88 P0 pada registri saat ini". Kesimpulan bahwa 80–88 P0 terlalu banyak untuk satu irisan tetap berlaku.

### Butir 3 — Kunci Supabase di V8 `config.js`
- Hanya `config.js` yang diekstrak ke `audit/evidence/legacy_v8/config.js`. Tidak dijalankan.
- Isi: `supabaseUrl: ''`, `supabasePublishableKey: ''`, `webPushPublicKey: ''`. **Tidak ada kunci.**
- **RSP-0002 catatan 3 benar.** Premis R11 saya keliru karena saya mengutip `10_` tanpa membuka berkas. AUD-0002-12 ditutup sebagai premis keliru. Arahan "jangan impor V8" tetap berlaku.

### Butir 4 — Verifikasi tindakan perbaikan
| Edit | Status |
|---|---|
| Registri A10 (P2, ditangguhkan) | OK |
| Registri A17 (P1, kualitatif) | OK |
| Registri B10–B14 | OK |
| Registri J09–J13 | OK |
| Registri mesin sumber langkah 4 | OK |
| `04_` INV-02 | OK |
| `03_` §4.2 77% dicabut | OK, **tetapi** baris penggantinya memuat sitasi "IOM DRI: Applications in Dietary Assessment, 2000" yang belum diverifikasi. Lihat AUD-0003-07 |
| `03_` Permenkes 21/2021 "tidak berlaku" | **Dikoreksi:** pencabutan hanya sebagian (AUD-0003-01) |
| `10_` config | OK |

### Butir 5a — Pencabutan Permenkes 21/2021
- Teks Permenkes 2/2025, **Pasal 85 huruf d**, mencabut Permenkes 21/2021 "sepanjang mengatur penyelenggaraan pelayanan kontrasepsi dan Pelayanan Kesehatan seksual". Ditetapkan 20 Februari 2025.
- Bagian masa sebelum hamil, hamil, persalinan, dan nifas tidak tercantum dalam klausul itu.
- **TERKONFIRMASI sebagian.** Klaim eksekutor "dicabut" benar untuk kontrasepsi dan kesehatan seksual, salah untuk seluruh regulasi. (AUD-0003-01, S2)

### Butir 5b — Aturan WHO panjang vs tinggi pada 24 bulan
- Dokumen WHO-UNICEF 2019 (ISBN 978-92-4-151555-9): judul dan tahun terkonfirmasi di halaman WHO. Teks PDF tidak terbuka (403 dari UNICEF; halaman WHO tidak memuat aturan 24 bulan).
- **TIDAK DAPAT DIVERIFIKASI.** Sumber sekunder konsisten dengan klaim tetapi bukan primer. Catatan: RSP-0001 mengutip dokumen WHO 2019; RPT-0001 mengutip CGS 2006. Keduanya perlu dicek ulang. (AUD-0003-03, S2)

### Butir 5c — Pedoman TTD Kemenkes primer
- Berkas primer yang terbaca: Pedoman Pencegahan dan Penanggulangan Anemia pada Remaja Putri dan WUS (Kemenkes; dasar Perpres 42/2013). Halaman PDF:
  - Daftar Istilah (hlm. 13): TTD setara **60 mg besi elemental dan 400 mcg asam folat**.
  - Suplementasi (hlm. 38): sekurangnya 60 mg dan 400 mcg; dosis **1 kali seminggu** untuk rematri/WUS.
- Tidak ditemukan: 1 tablet per hari, minimal 90 tablet selama hamil, atau folat 0,25 mg.
- Permenkes 88/2014 (dasar TTD ibu hamil): Pasal 1 hanya merujuk Lampiran. Lampiran hlm. 6–8 tidak terbaca dari teks yang tersedia.
- **Hasil:** 0,25 mg **DIKOREKSI** (tidak didukung primer; primer menyebut 400 mcg). "90 tablet selama hamil" **TIDAK DAPAT DIVERIFIKASI** dalam sesi ini. (AUD-0003-02, S1, tetap terbuka)

### Butir 5d — Render halaman 14–15 Permenkes 2/2020
- Dirender dan dibaca langsung. Baris BB/PB-TB, IMT/U 0–60, dan IMT/U 5–18 sesuai dengan klaim eksekutor (RSP-0001 butir 2) dan `03_` §4.1.
- **TERVERIFIKASI.** C-013 penuh; catatan RPT-0001 tentang baris tergabung tertutup.

### Butir 6 — Perbandingan tabel AKG
Semua baris HASIL_VERIFIKASI §4 cocok dengan pembacaan auditor setelah koreksi besi T3. Nilai yang dicek (ringkas):

| Kelompok | Energi | Protein | Lemak | Karbo | Serat | Air | Mikro |
|---|---|---|---|---|---|---|---|
| 6–11 bln | 800 | 15 | 35 | 105 | 11 | 900 | vit A 400; besi 11; seng 3; kalsium 270; folat 80; vit C 50 — cocok |
| 1–3 th | 1350 | 20 | 45 | 215 | 19 | 1150 | vit A 400; besi 7; seng 3; kalsium 650; folat 160; vit C 40 — cocok |
| Perempuan 19–29 | 2250 | 60 | 65 | 360 | 32 | 2350 | vit A 600; besi 18; seng 8; iodium 150; kalsium 1000; folat 400; vit C 75 — cocok |
| Perempuan 30–49 | 2150 | 60 | 60 | 340 | 30 | 2350 | — cocok |
| Hamil T1/T2/T3 (+) | +180/+300/+300 | +1/+10/+30 | +2,3 | +25/+40/+40 | +3/+4/+4 | +300 | vit A +300; folat +200; vit C +10; besi +0/+9/+9; seng +2/+4/+4; iodium +70; kalsium +200 — cocok |
| Menyusui (+) 0–6 / 6 bln kedua | +330/+400 | +20/+15 | +2,2 | +45/+55 | +5/+6 | +800/+650 | vit A +350; folat +100; vit C +45; seng +5; iodium +140; kalsium +200 — cocok |

**Selisih yang tersisa:** tidak ada pada baris yang dicek. Selisih awal auditor (besi T3 +6) sudah dikoreksi. Untuk lemak, karbohidrat, dan serat dewasa, yang tadinya belum diverifikasi, sekarang cocok.

**Catatan kecil yang tetap berlaku:** satuan folat tercetak "mcg" tanpa DFE (lihat butir 2a); vitamin A dalam RE.

## 3. Temuan bernomor (REQ-0003)

| ID | Tingkat | Keyakinan | Ringkasan | Status |
|---|---|---|---|---|
| AUD-0003-01 | S2 | TERKONFIRMASI | Permenkes 21/2021 dicabut **sebagian** (Pasal 85 huruf d Permenkes 2/2025). `03_` dan registri menulis "tidak berlaku" secara penuh | Terbuka: koreksi di `03_` dan registri |
| AUD-0003-02 | S1 | TERKONFIRMASI (untuk 0,25 mg); TIDAK DAPAT DIVERIFIKASI (untuk 90 tablet) | Primer Kemenkes yang terbaca menyebut 400 mcg folat; 0,25 mg tidak didukung. 90 tablet selama hamil belum terverifikasi | Terbuka. Karantina diterima; tutup hanya dengan pedoman ibu hamil atau Lampiran Permenkes 88/2014 |
| AUD-0003-03 | S2 | TIDAK DAPAT DIVERIFIKASI | Aturan WHO 24 bulan (panjang vs tinggi) belum berhasil dibuka dari primer. RSP-0001 dan RPT-0001 memakai dokumen WHO yang berbeda | Terbuka. ADR pada M2 tetap menunggu |
| AUD-0003-04 | S3 | TERKONFIRMASI | RPT-0002 menulis "ratusan ID" di Fondasi; tidak akurat | Ditutup dengan koreksi di RPT-0002 |
| AUD-0003-05 | S3 | TERKONFIRMASI | `EVD-0001` §2 menulis folat "DFE"; salah label | Ditutup (dikoreksi) |
| AUD-0003-06 | S3 | TERKONFIRMASI | Premis R11 dalam RPT-0002 berasal dari `10_` yang tidak saya buka. `config.js` tanpa kunci | Ditutup (premis keliru) |
| AUD-0003-07 | S2 | KEMUNGKINAN | `03_` §4.2 menambah sitasi "IOM DRI 2000" untuk EAR cut-point yang belum diverifikasi. Melanggar aturan "jangan mengarang sitasi" bila belum dibuka | Terbuka: ganti dengan "BELUM DIVERIFIKASI" atau verifikasi |

## 4. Hasil fase buta / bukti
- `audit/evidence/EVD-0001` (AKG, dikoreksi), `EVD-0002` (klaim lain), `EVD-0003` (hasil antara REQ-0003).
- `audit/evidence/legacy_v8/config.js`.

## 5. Yang TIDAK saya periksa
- Permenkes 88/2014 Lampiran (hlm. 6–8): tidak terbaca.
- Pedoman ibu hamil TTD (Buku KIA atau pedoman terpisah): tidak dicari.
- WHO-UNICEF 2019 teks penuh; WHO CGS 2006; IOM 2001.
- Sisa klaim karantina (C-003, C-006, C-007, C-025–C-029, C-033–C-039, C-050–C-056, C-070–C-078, C-091–C-098) — di luar REQ-0003 sesuai permintaan.
- Penilaian ulang Lampiran II PMK 28/2019 (F-07).
- Kesesuaian satuan folat RE/DFE pada sumber data (USDA, TKPI) — belum ada datanya.

## 6. Rekomendasi
1. Koreksi `03_` dan registri untuk Permenkes 21/2021: "dicabut sebagian (Permenkes 2/2025 Pasal 85 huruf d, sepanjang kontrasepsi dan kesehatan seksual); bagian kehamilan dan persalinan belum dinilai" — atau hapus rujukan karena tidak dipakai aplikasi.
2. Ganti "0,25 mg" dengan "400 mcg (pedoman Kemenkes rematri/WUS, hlm. 13 dan 38)", atau hapus. Tutup AUD-0003-02 hanya dengan pedoman ibu hamil atau Lampiran Permenkes 88/2014.
3. Hapus sitasi "IOM DRI 2000" dari `03_` §4.2 sampai diverifikasi.
4. Tandai C-022 WHO sebagai TIDAK DAPAT DIVERIFIKASI untuk bagian WHO; aturan Permenkes tetap TERVERIFIKASI.

## 7. Verifikasi ulang (diisi setelah RSP berikutnya)
| Temuan | Bukti verifikasi ulang | Hasil |
|---|---|---|
| AUD-0003-01 | — | Terbuka |
| AUD-0003-02 | — | Terbuka |
| AUD-0003-03 | — | Terbuka |
| AUD-0003-07 | — | Terbuka |
