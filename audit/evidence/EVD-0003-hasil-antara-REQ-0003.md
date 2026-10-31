# EVD-0003 — Hasil antara REQ-0003 (verifikasi ulang RSP-0001 dan RSP-0002)

- **Dibuat oleh:** Auditor · **Tanggal:** 2026-10-28
- **Catatan urutan:** `docs/verifikasi_eksekutor/HASIL_VERIFIKASI.md` dibuka pada langkah 6 (sesuai REQ-0003), setelah fase buta REQ-0001 selesai dan tersimpan di `EVD-0001` dan `EVD-0002`.

## 1. Folat dalam AKG (PMK 28/2019 hlm. 9)
- Render tegak halaman 9 (`p9_header_upright.png`, scratchpad sesi auditor). Header Tabel 2: "Folat (mcg)", tanpa DFE. "Vit A (RE)" tercetak sebagai RE.
- Kesimpulan: **tanpa DFE** (benar: RPT-0001 F-01). `EVD-0001` §2 sudah dikoreksi.

## 2. Hitungan ID registri
- Hasil `parse.py` pada `REGISTRI_FITUR_NUTRIVA.md` saat ini: **153 ID**, **88 P0**, **57 P1**, **8 P2**.
- Rekonsiliasi dengan RSP-0002 (143 ID; 80/56/7): selisih +10 ID = B10–B14 (5) dan J09–J13 (5). Perubahan prioritas: A10 P0→P2; J11 P1; B10–B14, J09, J10, J12, J13 P0. Hasil: P0 80+9−1 = 88; P1 56+1 = 57; P2 7+1 = 8. Konsisten.
- 36 ID P0 tidak masuk irisan M1: A04 A15 B04 B08 C01 C02 C03 C08 D03 D04 D05 D06 D07 D11 E05 F01 F02 F03 F04 F07 F08 G04 G05 G06 G08 G09 G15 H05 H15 I07 J04 J08 K01 K02 K06 K14. Label P0 pada ID tersebut belum diubah menjadi "M2" atau "ditunda" (lihat RPT-0004).

## 3. V8 `config.js`
- Diekstrak hanya `config.js` ke `audit/evidence/legacy_v8/config.js` (304 byte). Tidak dijalankan.
- Isi: `supabaseUrl: ''`, `supabasePublishableKey: ''`, `webPushPublicKey: ''`, `analysisEndpoint: '/api/analyze'`. **Tidak ada kunci.** Premis R11 (RPT-0002) keliru; saya ikut mengutip kesalahan `10_` tanpa membuka berkas. Dikoreksi di RPT-0003 (AUD-0003-06).

## 4. Pemeriksaan edit perbaikan
| Berkas | Hasil |
|---|---|
| Registri A10 | Ada, P2, "DITANGGUHKAN", bobot tanpa sumber dicatat. OK |
| Registri A17 | Ada, P1, kualitatif, "tidak boleh menjadi pengali". OK |
| Registri B10–B14 | Ada (P0). OK |
| Registri J09–J13 | Ada (J11 P1, lainnya P0). OK |
| Registri mesin sumber langkah 4 | Ada, label "teks-ditemukan-mesin". OK |
| `04_` INV-02 | Ada, dirumuskan ulang pada presisi tampilan; uji lintas peramban (J12). OK |
| `03_` §4.2 | 77% dicabut. **Tetapi** baris yang sama menambah rujukan "EAR cut-point (IOM, DRI: Applications in Dietary Assessment, 2000)" yang belum saya verifikasi. Lihat AUD-0003-07 |
| `03_` Permenkes 21/2021 | Dicoret dengan keterangan "Tidak berlaku" — **terlalu luas**, lihat §5a |
| `10_` config | Dikoreksi (placeholder). OK |

## 5. Empat klaim yang dijawab eksekutor

### 5a. Pencabutan Permenkes 21/2021 oleh Permenkes 2/2025
- Teks resmi Permenkes 2/2025 (PDF dari kesprimkom.kemkes.go.id, diekstrak `p2025.txt`), **Pasal 85**: "Pada saat Peraturan Menteri ini mulai berlaku; … d. Peraturan Menteri Kesehatan Nomor 21 Tahun 2021 … **sepanjang mengatur penyelenggaraan pelayanan kontrasepsi dan Pelayanan Kesehatan seksual**, dicabut dan dinyatakan tidak berlaku."
- Ditetapkan 20 Februari 2025 (teks). Pasal 86 mengatur saat berlaku.
- **Kesimpulan:** pencabutan **sebagian**. Bagian masa sebelum hamil, hamil, persalinan, dan masa sesudah melahirkan **tidak** tercantum dalam klausul pencabutan Pasal 85 pada teks ini. Maka "tidak berlaku" di `03_` dan registri keliru. Klaim eksekutor "dicabut Permenkes 2/2025" hanya benar sebagian.

### 5b. Aturan WHO panjang vs tinggi pada 24 bulan
- Dokumen WHO-UNICEF 2019 (ISBN 978-92-4-151555-9) dapat diakses di halaman WHO: judul, tahun, ISBN terkonfirmasi. Teks lengkap PDF tidak terbuka (data.unicef.org HTTP 403). Halaman ringkasan tidak memuat aturan 24 bulan.
- Sumber sekunder (Nutrition International, dikutip mesin pencari) menyebut panjang untuk <24 bulan. Konsisten dengan klaim, **tetapi bukan primer**.
- **Hasil: TIDAK DAPAT DIVERIFIKASI** (primer tidak terbuka). Dokumen yang dikutip RPT-0001 (CGS 2006) juga belum dibuka.

### 5c. Pedoman TTD Kemenkes primer
- Berkas primer yang terbaca: *Pedoman Pencegahan dan Penanggulangan Anemia pada Remaja Putri dan WUS* (Kemenkes; nama berkas "GUIDELINE-2016", WHO Platform; disebut memakai dasar Perpres 42/2013). Diekstrak dari PDF hasil `WebFetch` (`ttd2016.pdf`, `ttd.txt`). Halaman dihitung pada berkas PDF, bukan nomor cetak:
  - Daftar Istilah (PDF hlm. 13): "TTD: suplemen gizi dengan kandungan zat besi setara **60 mg besi elemental dan 400 mcg asam folat**."
  - Bagian C Suplementasi (PDF hlm. 38): "sekurangnya 60 mg elemental besi dan 400 mcg asam folat", dengan dosis **1 kali seminggu** untuk rematri/WUS.
- **Yang tidak ditemukan dalam pedoman ini:** dosis 1 tablet per hari; "minimal 90 tablet selama hamil"; kadar folat 0,25 mg.
- Pedoman ini untuk rematri/WUS, **bukan** ibu hamil. Permenkes 88/2014 (dasar TTD WUS dan ibu hamil, disebut pedoman) hanya menyebut "standar tablet … sebagaimana tercantum dalam Lampiran" (Pasal 1). Lampiran hlm. 6–8 **tidak terbaca** dari teks yang tersedia.
- **Hasil: DIKOREKSI untuk 0,25 mg** (tidak didukung primer yang terbaca; primer menyebut 400 mcg). **TIDAK DAPAT DIVERIFIKASI** untuk "90 tablet selama hamil" (pedoman ibu hamil dan Lampiran Permenkes 88/2014 belum terbuka).

### 5d. Render halaman 14–15 Permenkes 2/2020
- Dirender ke PNG (`akg2020_thr_14.png`, `akg2020_thr_15.png`). Hasil bacaan:
  - BB/PB atau BB/TB: berisiko gizi lebih **> +1 s.d. +2**; gizi lebih **> +2 s.d. +3**; obesitas **> +3** SD.
  - IMT/U 0–60 bulan: berisiko gizi lebih > +1 s.d. +2; gizi lebih > +2 s.d. +3; obesitas > +3 SD.
  - IMT/U 5–18 tahun (hlm. 15): gizi kurang −3 s.d. <−2; gizi baik −2 s.d. +1; gizi lebih +1 s.d. +2; obesitas > +2.
- **Hasil: TERVERIFIKASI** (C-013 penuh). Catatan di RPT-0001 mengenai baris yang tergabung pada ekstraksi teks sekarang tertutup oleh render. Eksekutor membaca hlm. 14–15 dengan benar.

## 6. Perbandingan tabel nilai acuan AKG (HASIL_VERIFIKASI §4 vs pembacaan auditor)
- Semua baris cocok setelah koreksi besi T3. Rincian di RPT-0003 §6.
- Perempuan 19–29 (render `p7_perempuan.png`): energi 2250, protein 60, lemak total 65, karbohidrat 360, serat 32, air 2350 — cocok dengan HASIL. Perempuan 30–49: 2150, 60, 60, 340, 30, 2350 — cocok.
- Besi hamil tambahan: T1 +0, T2 +9, T3 +9 (`p13_upright.png`, `p13_hamil.png`). HASIL benar; pembacaan auditor awal (+6) keliru dan sudah dikoreksi di EVD-0001.
