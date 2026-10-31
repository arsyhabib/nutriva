# EVD-0005 — Hasil antara REQ-0005 (verifikasi keputusan v2 / Opsi A dan kelayakan M0)

- **Dibuat oleh:** Auditor · **Tanggal:** 2026-10-28
- **Sumber:** `KEPUTUSAN_DAN_JALUR_RILIS.md` v2; `REGISTRI_FITUR_NUTRIVA.md` (153 ID, bertag); `AUDITOR_PACKAGE/03_BASIS_PENGETAHUAN.md`; `audit/responses/RSP-0003-verifikasi-ulang.md`, `RSP-0004-A-SPEC-1.md`.

## 1. Hitungan dan konsistensi tag (langkah 4)
Pemeriksaan skrip (`tags.py`) terhadap registri saat ini:
- Jumlah baris ID: **153**.
- Tag: M1a **31**, M1b **30**, M2 **11**, M3 **6**, M3+ **56**, M4 **1**, M5 **7**, Tunda **11**. Jumlah = 153 ✓. Tidak ada ID tanpa tag.
- Daftar M1a dan M1b per ID **cocok persis** dengan §5 `KEPUTUSAN` v2 (tidak ada ketidakcocokan).
- M1 fungsional = 31 (M1a) + 22 (M1b) = **53**; desain = 8 (L01, L02, L03, L04, L05, L08, L11, L12). Total 61 ✓.
- Tag M2: A15 B04 C01 D03 D06 D07 G04 G06 G15 J08 J10 (11). M5: B07 E05 F01 F02 F03 F04 F07 (7). Tunda: A10 C03 C08 C11 D09 E09 I05 I06 I07 K11 K12 (11).
- **Catatan:** J05 (P1) ditag M1b. Prinsip irisan P0 tidak dipenuhi untuk ID ini (lihat RPT-0005 AUD-0005-13).

## 2. Teks baris yang diedit (langkah 4)
- **A01** (M1b): "Build M1: hanya Anak 6–23 bulan aktif" — konsisten dengan KEPUTUSAN §5.
- **A02** (M1a): bagian M1 memuat status ASI wajib, prematur, edema, kondisi khusus, usia tidak pasti — konsisten dengan KEPUTUSAN §5. Tetapi baris yang sama juga memuat bagian M2 (trimester, LiLA). Lihat AUD-0005-13.
- **A04** (M1a): M1 = BB/U, PB/U, BB/PB dari tabel Permenkes 2/2020; M2 = 24–59 bulan. Konsisten.
- **A07** (M1a): "heuristik deterministik … LP ditunda". Konsisten dengan T-07.
- **B10** (M1a): "hanya profil sintetis (F08)". Konsisten dengan Opsi A. Tetapi "tampak seperti identitas" tidak punya spesifikasi (lihat AUD-0005-02).
- **D10** (M1a): V-PJBL profil sintetis; V-KOMPETISI tetap memuat masukan. Konsisten.
- **K14** (M1b): "hapus semua data di perangkat ini" — konsisten.

## 3. Ketergantungan yang masih hilang atau bertentangan (langkah 4)
| ID | Ketergantungan | Status |
|---|---|---|
| A12 | harga dan ketersediaan (I01, I02 = M3+) | **Masih ada.** Teks A12 tidak diubah |
| A19 | frekuensi makan menurut usia (MMF, C-027 BELUM) | **Masih ada** |
| A06 | kelas harga; sumber per nilai; data USDA (T-06 belum ada pemetaan) | Data M1a belum tersedia |
| J13 | nilai harapan "disetujui dosen" (K-05: dosen setelah PjBL) | **Konflik gerbang** (lihat AUD-0005-12) |
| B11 | "tidak dirilis ke pengguna tanpa tanda tangan dosen" vs peragaan kasus sintetis ke ibu/kader | **Definisi "rilis" belum jelas** (AUD-0005-12) |
| F03/F04 | SUS dan waktu tugas dijanjikan sebagai hasil hari H (KEPUTUSAN §2) | **Ditag M5** (ditunda). Janji tidak dapat dipenuhi di V-PJBL |
| B07 | persetujuan informasi dan penelitian | **Ditag M5**. Umpan balik kader/ibu di hari H membutuhkan persetujuan (lihat §5 Q2) |
| H11 | anggaran performa (J05, P1 di M1b) | Ambang "muat < 3 dtk di 3G" belum diukur |
| H12 | status luring (G08 M1b, ok) dan IndexedDB (C-077 BELUM) | Ketergantungan pada klaim belum diverifikasi |
| B13 | konsep 200/300/550 (C-026 SEBAGIAN) | Ditandai sekunder di T-04 (ok) |
| B01, B02 | madu, tersedak, garam/gula, alergen (C-090, C-092, C-097) | Sekunder; tanpa label belum memenuhi syarat 5 |
| B03 | daftar tanda bahaya | Belum bersumber primer (Buku KIA 2024 belum dibaca) |
| INV-15 | desimal koma/titik | Ada di A02 (M1a) ✓ |

## 4. Verifikasi perbaikan RSP-0003 pada `03_` (langkah 7)
- **Baris Permenkes 21/2021** (`03_` baris 22): "Dicabut sebagian oleh Permenkes 2/2025 (Pasal 85 huruf d, ...) … Bagian masa hamil/persalinan belum dinilai. Tidak dipakai sebagai dasar aturan aplikasi." → **benar** (sesuai `EVD-0003` §5a).
- **Baris TTD** (`03_` baris 57): "satu tablet setara 60 mg besi elemental + 400 µg asam folat (pedoman Kemenkes anemia rematri/WUS, hlm. 13 dan 38, dibaca auditor); 0,25 mg dicabut. 'Satu tablet per hari, minimal 90 tablet selama hamil' bersumber halaman resmi Kemenkes (ayosehat, hasil pencarian; halaman belum terbaca langsung …)". → **benar dan jujur** untuk 0,25 mg; klaim 90 tablet diberi label belum terbaca. Namun satu kalimat "bersumber halaman resmi" memberi kesan sumbernya sudah ada.
- **Percobaan verifikasi ayosehat.kemkes.go.id** pada sesi ini: **HTTP 503**. Tidak dapat diverifikasi.
- **Baris IOM DRI** (`03_` §4.2 baris 50): "EAR cut-point (IOM, DRI: Applications in Dietary Assessment, 2000)" → dicoba: halaman National Academies `https://www.nationalacademies.org/read/9956/...` tercantum dengan judul "Dietary Reference Intakes: Applications in Dietary Assessment (2000)", DOI 10.17226/9956. **Judul dan penerbit terverifikasi. Isi metode EAR cut-point belum dibaca.**

## 5. Penelusuran Opsi A (langkah 1) — ringkasan; rincian di RPT-0005 §2
Kasus yang dicari (minimal 8, 3 buatan sendiri, ditandai "[S]"):
1. Kader mengisi angka anak nyata pada profil "sintetis" (tidak ada pemeriksaan teknis selain label pengguna).
2. Pengasuh membuka tautan V-PJBL dan memasukkan data anaknya sendiri.
3. Teks bebas (alergi, catatan) memuat nama anak atau nama keluarga.
4. Tanda "sintetis" dinyalakan pengguna agar ekspor diterima untuk profil nyata.
5. Build V-PJBL dan V-KOMPETISI pada origin yang sama: IndexedDB dari V-KOMPETISI terbawa ke V-PJBL.
6. Status menu di URL (tautan bagikan) atau log host menyimpan nilai masukan.
7. Tangkapan layar menu yang sudah terlabeli "contoh", tetapi angka di dalamnya adalah angka anak nyata.
8. Masukan dicatat di kertas saat posyandu, lalu dimasukkan di rumah (perilaku, di luar kendali aplikasi).
9. **[S]** Repositori: fixture uji memakai contoh nyata dari Buku KIA atau catatan posyandu.
10. **[S]** Kuesioner umpan balik kader/ibu (Google Form atau sejenisnya) menanyakan usia dan berat anak.
11. **[S]** Penyimpanan otomatis (autosave/draf) tetap menyimpan profil dari sesi sebelumnya di perangkat bersama.
12. **[S]** Ekspor PDF/gambar "contoh" ternyata membawa angka yang bisa dibandingkan lintas keluarga (bukan data nyata, tetapi identitas kuasi).

## 6. Pertanyaan 6 — T-06 (langkah 6)
Pemeriksaan kriteria yang diusulkan `KEPUTUSAN` T-06 dan RSP-0004 (pemetaan 30 bahan, daftar tanpa padanan, catatan BDD/retensi): diperlukan juga satuan. USDA FDC melaporkan vitamin A sebagai **RAE** (µg), sedangkan AKG 2019 tercetak **RE** (lihat `EVD-0001` dan `RPT-0001` F-01). Konversi RAE↔RE belum bersumber dan belum diverifikasi.

## 7. Yang belum dilakukan dalam sesi ini
- Tidak membuka data USDA FDC.
- Tidak membuka Buku KIA 2024 atau pedoman IDAI/Kemenkes untuk aturan S0 (menunggu berkas pemilik, `KEPUTUSAN` §9-3).
- Tidak menjalankan uji apa pun (belum ada kode).
