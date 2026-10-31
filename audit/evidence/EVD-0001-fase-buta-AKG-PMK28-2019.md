# EVD-0001 — Fase buta: nilai AKG dari sumber primer (PMK/Permenkes 28/2019)

- **Dibuat oleh:** Auditor · **Tanggal:** 2026-10-28
- **Urutan:** dibuat SEBELUM membuka `docs/verifikasi_eksekutor/HASIL_VERIFIKASI.md`. Berkas itu belum dibuka pada saat evidence ini ditulis.
- **Sumber primer:** Berita Negara RI No. 956 Tahun 2019, Peraturan Menteri Kesehatan tentang AKG (Lampiran I, Tabel 1–3, hlm. 6–14). Diunduh dari pasal.id (tautan redirect ke berkas PDF peraturan.go.id). Ukuran 1,1 MB.
- **Metode:** teks lapisan PDF tidak tersedia untuk halaman 6–14 (berupa citra). Halaman dirender ke PNG (pypdfium2) dan dibaca secara visual oleh auditor. Halaman 1–5 dan 15–16 berisi teks.
- **Keterbatasan pembacaan:** citra hasil render beresolusi menengah dan tabel diputar 90°. Angka berikut dibaca dengan keyakinan tinggi kecuali yang ditandai ⚠ (keyakinan sedang, perlu konfirmasi ulang oleh manusia dari halaman asli).

## 1. Tabel 1 (hlm. 8): Energi, protein, lemak, karbohidrat, serat, air — tambahan kehamilan dan menyusui

| Kelompok | Energi (kkal) | Protein (g) | Lemak total (g) | Karbohidrat (g) | Serat (g) | Air (ml) |
|---|---|---|---|---|---|---|
| Hamil Trimester 1 | **+180** | **+1** | +2.3 | +25 | +3 | +300 |
| Hamil Trimester 2 | **+300** | **+10** | +2.3 | +40 | +4 | +300 |
| Hamil Trimester 3 | **+300** | **+30** | +2.3 | +40 | +4 | +300 |
| Menyusui 0–6 bln pertama | **+330** | +20 | +2.2 | +45 | +5 | +800 |
| Menyusui 6 bln kedua | **+400** | +15 | +2.2 | +55 | +6 | +650 |

Angka dasar (Tabel 1, hlm. 6–8): perempuan 19–29 tahun = 2250 kkal, protein 60 g (dari hlm. 7; ⚠ dibaca dari citra). Bayi 6–11 bulan = 800 kkal total, protein 15 g (hlm. 6). Bayi 0–5 bulan = 550 kkal, protein 9 g.

## 2. Tabel 2 (hlm. 9–11): vitamin — tambahan

| Kelompok | Vit A (RE, µg) | Vit C (mg) | Folat (mcg, tercetak tanpa DFE) | B12 (mcg) | Vit D | Vit E | Vit K |
|---|---|---|---|---|---|---|---|
| Hamil T1 | ⚠ +300 | +10 | ⚠ +200 | +0.5 | +0 | +0 | +0 |
| Hamil T2 | ⚠ +300 | +10 | ⚠ +200 | +0.5 | +0 | +0 | +0 |
| Hamil T3 | ⚠ +300 | +10 | ⚠ +200 | +0.5 | +0 | +0 | +0 |
| Menyusui 0–6 bln | ⚠ +350 | +45 | ⚠ +100 | +1.0 | +0 | +4 | +0 |
| Menyusui 6 bln kedua | ⚠ +350 | +45 | ⚠ +100 | +1.0 | +0 | +4 | +0 |

Catatan: nilai dasar Vit A dewasa perempuan 19–29 tahun = 600 RE (hlm. 9–10 ⚠). Folat dasar perempuan 19–29 = 400 mcg (tercetak "mcg"; tidak tertulis DFE, diverifikasi pada header Tabel 2 hlm. 9 dengan render tegak). Vit C dasar = 75 mg (⚠).
Catatan penting: kolom Vit A dalam AKG tercetak sebagai **RE**, bukan RAE.

Bayi 6–11 bulan (hlm. 9): Vit A 400 RE; Vit C 50 mg; Folat 80 µg; B12 0,5 µg (⚠ dari citra).

## 3. Tabel 3 (hlm. 12–14): mineral — tambahan

| Kelompok | Kalsium (mg) | Besi (mg) | Iodium (µg) | Seng (mg) | Selenium (µg) | Tembaga (µg) |
|---|---|---|---|---|---|---|
| Hamil T1 | **+200** | **+0** | **+70** | **+2** | +5 | +100 |
| Hamil T2 | **+200** | **+9** | **+70** | **+4** | +5 | +100 |
| Hamil T3 | **+200** | **+9** | **+70** | **+4** | +5 | +100 |

Koreksi (2026-10-28, setelah render halaman 13 secara tegak dengan rotasi 90°): besi tambahan hamil **T1 +0, T2 +9, T3 +9** (bacaan awal "+6" untuk T3 keliru). Seng T1 +2, T2 +4, T3 +4 terkonfirmasi. Kalsium +200 dan iodium +70 terkonfirmasi untuk ketiga trimester.
| Menyusui 0–6 bln pertama | +200 | +0 | +140 | +5 | ±10 | +400 |
| Menyusui 6 bln kedua | +200 | +0 | +140 | +5 | +10 | +400 |

Dasar perempuan 19–29 tahun (hlm. 12–13 ⚠): kalsium 1000 mg; besi 18 mg; iodium 150 µg; seng 8 mg; selenium 26 µg (⚠); tembaga 900 µg.

**Footnote hlm. 14 (dibaca utuh, bukan dari sumber sekunder):**
- ² "Diasumsikan 75% besi adalah dari sumber besi heme. Buah, sayuran, dan makanan yang difortifikasi besi adalah sumber besi non-heme, daging dan unggas adalah sumber besi heme."
- ³ "Diasumsikan sumber seng berasal dari sumber dengan bioavailability tinggi dan sedang (IOM, 2001 dan 2006)."
- ¹ (Tabel 1–3 bayi 0–5 bulan): "Pemenuhan kebutuhan gizi bayi 0–5 bulan bersumber dari pemberian ASI Eksklusif."

## 4. Ringkasan pembacaan yang menjawab REQ-0001 §2.3

- Tambahan energi hamil: **+180 (T1), +300 (T2), +300 (T3)** — **sesuai** C-008.
- Tambahan protein hamil: **+1 (T1), +10 (T2), +30 (T3)** — **sesuai** C-008.
- Tambahan energi menyusui: **+330 (0–6 bln), +400 (6 bln kedua)** — **sesuai** C-009.
- Tabel 1 juga memuat tambahan protein menyusui **+20 dan +15** (C-008/C-009 tidak menyebut ini).
- Satuan Vit A dalam tabel adalah **RE** (bukan RAE); folat **DFE**.
- Besi: footnote 2 menyatakan asumsi **75% heme**, yang merupakan asumsi bioavailabilitas yang sudah tertanam di angka AKG (relevan untuk A17).
- Kalsium hamil tambahan **+200 mg** (sebagai tercetak; belum dibandingkan dengan dokumen lain).

## 5. Yang belum saya baca (fase buta)

- Bagian Lampiran II (pedoman penggunaan, hlm. 15–16+) dan situasi darurat (tambahan hamil +300 / menyusui +500 yang disebut eksekutor) — belum saya temukan di halaman 6–14; **tidak diverifikasi** oleh saya.
- Angka ⚠ perlu dikonfirmasi ulang di halaman asli (kolom besi T2/T3 dan Vit A/folat tambahan).
- Ambang UL vitamin A dan nilai pada kolom lain belum diuji di fase buta ini (bukan bagian Permenkes ini).
