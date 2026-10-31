# RPT-0001 — A-SRC-0: Verifikasi register klaim `08_` dan klaim angka `03_`

- **Permintaan:** REQ-0001-A-SRC-0-verifikasi-klaim
- **Auditor:** Auditor independen · **Tanggal:** 2026-10-28
- **Fase buta:** dilakukan dan disimpan **sebelum** membuka `docs/verifikasi_eksekutor/HASIL_VERIFIKASI.md` — lihat `audit/evidence/EVD-0001-fase-buta-AKG-PMK28-2019.md` dan `EVD-0002-fase-buta-lain-sumber-primer.md`.

## Vonis: **DITOLAK** (untuk penggunaan klaim pada data dan aturan)

Alasan: S1 terbuka pada tiga klaim yang berdampak materiil dan belum terverifikasi atau berkonflik (AUD-0001-01, -02, -03). Angka AKG utama lolos verifikasi primer, sehingga M0 dapat dibahas ulang begitu tiga klaim itu ditutup. Ini bukan penilaian bahwa eksekutor berbohong; sebagian besar kerja eksekutor benar.

## Lima temuan teratas

1. **AUD-0001-01 (S1, TERKONFIRMASI bahwa klaim belum terverifikasi).** Klaim TTD (C-010) tidak konsisten antar sumber: 0,25 mg vs 0,4 mg asam folat per tablet; jumlah 90 tablet hanya dari sumber sekunder. Pedoman Kemenkes primer tidak berhasil saya buka. Katalog SATUSEHAT/KFA menunjukkan produk "Ferrous Fumarate 60 mg / Folic Acid 0,4 mg", tetapi katalog bukan pedoman. Dampak: jika TTD dijadikan rujukan di aplikasi (A18), angka salah bisa masuk ke pesan kepada ibu. Bukti: `EVD-0002` §D; `08_` C-010.

2. **AUD-0001-02 (S1, TIDAK DAPAT DIVERIFIKASI).** Angka 77% (C-032, ambang kecukupan mikronutrien) dipakai di `03_` §4.2 dan HASIL §4 belum dibuktikan dari Gibson 2005. Pencarian sesi ini tidak menemukan angka tersebut. Saran pengganti yang terbukti ada: metode EAR cut-point (DRI, NAP) — ini harus dipilih dan dijelaskan, bukan 77% tanpa sumber. Bukti: `EVD-0002` §E; pencarian web tidak memuat 77% Gibson.

3. **AUD-0001-03 (S1, TERKONFIRMASI sebagai asumsi tertanam).** Catatan kaki 2 Tabel 3 PMK 28/2019 (hlm. 14) tercetak: "Diasumsikan 75% besi adalah dari sumber besi heme." Kalimat berikutnya menyebut buah, sayuran, dan makanan fortifikasi sebagai non-heme, dan daging serta unggas sebagai heme. Eksekutor menduga salah ketik (HASIL F-02). Auditor tidak dapat memastikan itu salah ketik: teks cetak pada salinan yang saya baca memang menyatakan heme. Dampak untuk desain: AKG sudah memuat asumsi bioavailabilitas, sehingga fitur A17 tidak boleh menjadi pengali kedua. Bukti: `EVD-0001` §3 (footnote dibaca utuh).

4. **AUD-0001-04 (S2, TERKONFIRMASI).** Batas PB/TB tepat 24 bulan ambigu di Permenkes 2/2020: PB untuk "0–24 bulan" dan TB untuk "di atas 24 bulan" (PDF hlm. 12–13, baris teks ~432–445 pada salinan ekstraksi). Register C-022 menyebut WHO memakai panjang "< 24 bln" dan tinggi "≥ 24 bln"; itu berarti Permenkes dan WHO berbeda pada hari ke-24 bulan penuh. Belum saya verifikasi langsung dokumen WHO. Keputusan: pilih satu aturan, catat di ADR, dan uji. Bukti: `EVD-0002` §A.

5. **AUD-0001-05 (S2, KEMUNGKINAN).** Status Permenkes 21/2021 (C-005) belum dibuktikan. Sumber sekunder (pasal.id) menyatakan tidak berlaku lagi, dan BPK mencantumkannya sebagai dicabut oleh Permenkes 2/2025 untuk bidang kesehatan reproduksi. Saya belum membuka teks pencabutan. Dampak: rujukan pelayanan kehamilan di dokumen rancangan bisa usang. Bukti: `EVD-0002` §D.

## Hasil per klaim

Status: **TERVERIFIKASI** (dibaca dari sumber primer oleh auditor), **SEKUNDER** (sumber turunan konsisten), **SEBAGIAN**, **TIDAK DAPAT DIVERIFIKASI** (tidak berhasil dibuka dalam sesi ini), **DIKOREKSI**.

| ID | Status auditor | Catatan |
|---|---|---|
| C-001 | TERVERIFIKASI | Ditetapkan 20 Agt 2019, diundangkan 26 Agt 2019, BN 956/2019, mencabut Permenkes 75/2013 (PDF hlm. 1 dan 5, teks). Eksekutor benar. |
| C-002 | TERVERIFIKASI (judul, tanggal, struktur) | Ditetapkan 2 Jan 2020, diundangkan 8 Jan 2020, LN 2020 No. 7 (pasal.id; teks PDF dibaca). Eksekutor benar. |
| C-003 | TIDAK DAPAT DIVERIFIKASI | Tidak dicari dalam sesi ini. |
| C-004 | SEBAGIAN | UU 27/2022 ada; data kesehatan dan data anak termasuk data spesifik (sekunder). Nomor pasal tidak diverifikasi dari teks primer. |
| C-005 | DIKOREKSI / perlu cek | Perpres 72/2021 terverifikasi berlaku (BPK). Permenkes 21/2021: lihat AUD-0001-05. |
| C-006–C-007 | TIDAK DAPAT DIVERIFIKASI | Tidak diperiksa. |
| C-008 | TERVERIFIKASI | Hamil +180/+300/+300 kkal; protein +1/+10/+30 g (Tabel 1, hlm. 8). Sumber sekunder yang menyebut protein +20 datar keliru. |
| C-009 | TERVERIFIKASI | Menyusui +330 (0–6 bln), +400 (6 bln kedua); protein +20 dan +15 (hlm. 8). |
| C-010 | **DIKOREKSI / tidak konsisten** | AUD-0001-01. |
| C-011 | TIDAK DAPAT DIVERIFIKASI | Dokumen Kemenkes LiLA tidak ditemukan primer; sekunder konsisten pada 23,5 cm. |
| C-012 | TIDAK DAPAT DIVERIFIKASI | Tidak diperiksa dari sumber nasional. |
| C-013 | TERVERIFIKASI dengan catatan | Ambang BB/U, PB/U-TB/U, BB/PB-TB, IMT/U 0–60 bln ada di Permenkes 2/2020 Bagian B (hlm. 14–15). Angka BB/U, TB/U, BB/TB pada `03_` §4.1 sesuai. **Catatan:** baris "gizi lebih" dan "obesitas" pada BB/PB dan IMT/U tergabung dalam ekstraksi teks; perlu cek visual sebelum implementasi (lihat "Yang tidak saya periksa"). |
| C-020 | TIDAK DAPAT DIVERIFIKASI | Dokumen WHO CGS 2006 tidak dibuka. Permenkes 2/2020 **tidak** menyebut LMS, rumus z-score, atau penyesuaian ±3 SD. Eksekutor menyatakan bahwa penyesuaian hanya untuk indikator berbasis berat (dokumen 2007). Belum terbukti. |
| C-021 | SEBAGIAN (sekunder konsisten) | CDC SAS: BB/U < −6 atau ≥ +5; TB/U < −6 atau ≥ +6, konsisten dengan HASIL. Nilai BB/TB ±5 dan manual WHO Anthro belum saya buka. Permenkes 2/2020 tidak memuat BIV. |
| C-022 | TERVERIFIKASI (aturan nasional) | Lihat AUD-0001-04. Aturan usia bulan penuh dan koreksi ±0,7 cm benar. |
| C-023 | SEBAGIAN | Pasal 6(4) mengonfirmasi tabel kenaikan BB 0–24 bln untuk weight faltering (teks PDF). Tabel angka tidak dibaca. |
| C-024 | TERVERIFIKASI | Definisi GHO: ≥ 5 dari 8 kelompok, sumber WHO/UNICEF 2021. Eksekutor benar. Versi lama 4 dari 7. |
| C-025, C-027, C-029 | TIDAK DAPAT DIVERIFIKASI | Tidak diperiksa. |
| C-026 | SEBAGIAN | Tidak diverifikasi dari sumber WHO/PAHO asli. |
| C-028 | TIDAK DAPAT DIVERIFIKASI | Angka 5/10/12/15% belum ditemukan dalam sumber. |
| C-030 | SEKUNDER | UL 3000 µg/hari (sumber sekunder konsisten); IOM 2001 tidak terbuka. Sumber menyebut retinol, bukan RAE, pada sebagian kalimat. |
| C-031 | SEBAGIAN | Kolom Vit A pada AKG tercetak RE (terverifikasi di tabel, hlm. 9–10). Definisi RAE dari IOM belum terbuka. |
| C-032 | **TIDAK DAPAT DIVERIFIKASI** | AUD-0001-02. |
| C-033–C-039 | TIDAK DAPAT DIVERIFIKASI | Sitasi historis tidak diperiksa. |
| C-034 | SEBAGIAN | Ferguson 2004 dan Darmon 2002: abstrak sekunder konsisten; naskah tidak dibaca. |
| C-050–C-056 | TIDAK DAPAT DIVERIFIKASI | Tidak diperiksa. |
| C-057 | SEBAGIAN | Lihat C-004. |
| C-070 | TIDAK DAPAT DIVERIFIKASI | Jumlah pangan tidak dikonfirmasi. |
| C-071 | SEKUNDER | ODbL untuk Open Food Facts (sumber sekunder). |
| C-072 | TIDAK DAPAT DIVERIFIKASI | Tidak diperiksa langsung. |
| C-073 | TIDAK DAPAT DIVERIFIKASI | Tidak dicari. Ini klaim tentang ketiadaan; pencarian belum dilakukan oleh siapa pun. |
| C-074 | TIDAK DAPAT DIVERIFIKASI | Tidak diperiksa. |
| C-075–C-078 | TIDAK DAPAT DIVERIFIKASI | Tidak diperiksa. |
| C-090 | SEKUNDER | Madu < 12 bln dihindari menurut otoritas kesehatan (sumber sekunder dari beberapa negara). Pedoman Kemenkes tidak dibuka. |
| C-091–C-098 | TIDAK DAPAT DIVERIFIKASI | Sebagian sumber NHS/CDC tidak relevan untuk Indonesia; tidak diverifikasi. |

## Temuan tambahan dari fase buta (belum ada di register)

- **F-01 (dikonfirmasi):** tabel AKG tercetak **RE** untuk vitamin A dan **mcg** tanpa DFE untuk folat (hlm. 9–10). HASIL F-01 benar.
- **F-02 (dikonfirmasi sebagai tercetak, lihat AUD-0001-03).**
- **Konfirmasi angka mikronutrien tambahan hamil** (hlm. 10, 13 dibaca tegak dengan rotasi): besi +0/+9/+9; seng +2/+4/+4; iodium +70; kalsium +200; folat +200; vitamin A +300 (T1–T3). HASIL §4 benar pada besi. Catatan: pembacaan awal saya salah pada besi T3 (+6), sudah dikoreksi di EVD-0001.
- **Konfirmasi tambahan menyusui:** vitamin A +350 RE, folat +100 µg, vitamin C +45, seng +5, iodium +140 (hlm. 11, 14). Konsisten dengan HASIL.
- **Dasar hamil dan menyusui:** AKG Tabel 1–3 memberi tambahan tanpa menyebut kelompok usia ibu. Tambahan ditulis "(+an)" di baris hamil (F-05 HASIL benar bahwa ini tidak eksplisit).

## Yang tidak saya periksa

- Seluruh klaim dengan status TIDAK DAPAT DIVERIFIKASI di atas, khususnya C-003, C-006, C-007, C-020 (WHO), C-025, C-027, C-028, C-029, C-033–C-039, C-050–C-056, C-070–C-078, C-091–C-098.
- Dokumen WHO CGS 2006, WHO Anthro manual, IYCF 2021 penuh, IOM 2001, FAO/WHO 2004, Gibson 2005, Buku KIA, pedoman TTD Kemenkes, TKPI. Semua tidak berhasil dibuka dalam sesi ini atau tidak dicari.
- Teks lengkap UU PDP 27/2022 (sebatas sumber sekunder).
- Ketepatan pembacaan visual Lampiran II PMK 28/2019 (metode Cost of the Diet, hlm. 31–32): tidak saya baca sendiri dalam sesi ini; F-07 HASIL belum diverifikasi.
- Pembacaan visual kolom BB/PB dan IMT/U Permenkes 2/2020 untuk garis "obesitas" (lihat C-013).
- Angka dasar perempuan 19–29 pada beberapa kolom (lemak, karbohidrat, serat) dibaca cepat; tidak diverifikasi silang.
- Tingkat keyakinan pembacaan visual: angka bertanda ⚠ di EVD-0001 perlu dibaca ulang dari halaman asli oleh manusia (dosen) sebelum dipakai di data.
