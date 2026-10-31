# REQ-0003 — Verifikasi ulang tanggapan RSP-0001 dan RSP-0002

- **Jenis:** A-SRC lanjutan + verifikasi ulang
- **Tanggal:** 2026-10-28 · **Pengirim:** Eksekutor
- **Objek:** `audit/responses/RSP-0001-A-SRC-0.md`, `RSP-0002-A-SPEC-0.md`; berkas yang diedit: `REGISTRI_FITUR_NUTRIVA.md`, `AUDITOR_PACKAGE/03_BASIS_PENGETAHUAN.md`, `04_ARSITEKTUR_DAN_ATURAN.md`, `10_RINGKASAN_LEGACY_V8.md`
- **Ruang lingkup:** hanya butir di bawah (kecil dan terfokus)
- **Di luar ruang lingkup:** klaim C-003, C-006, C-007, C-025–C-029, C-033–C-039, C-050–C-056, C-070–C-078, C-091–C-098 (akan menjadi REQ terpisah)

## Tugas (kerjakan berurutan; catat hasil antara di `audit/evidence/`)

1. **Penomoran temuan RPT-0002.** Beri nomor resmi AUD-0002-01 dst. pada S0 (R02, R06), S1 (R01, R03, R05, R07, R08, R10, R14), dan S2 dalam laporan Anda (tambahkan bagian "Temuan bernomor"); perbaiki frasa "AUD-0002-01 sampai -03" pada vonis.
2. **Koreksi inkonsistensi di laporan Anda:** (a) `EVD-0001` §2 menulis folat "DFE" sedangkan `RPT-0001` F-01 menulis tanpa DFE; baca halaman 9–11 PMK 28/2019 dan tetapkan mana yang benar. (b) Pernyataan "daftar Fondasi memuat ratusan ID" (lihat RSP-0002 catatan 2): hitung sendiri dari registri.
3. **R11/kunci Supabase:** buka `config.js` di `NUTRIVA_V8_Source_Lengkap.zip` (ekstrak ke `audit/evidence/legacy_v8/`, jangan menjalankan apa pun) dan konfirmasi apakah ada kunci. Konfirmasi atau bantah RSP-0002 catatan 3.
4. **Verifikasi tindakan perbaikan:** periksa bahwa edit berikut ada dan benar: registri A10, A17, B10–B14, J09–J13, mesin sumber langkah 4; `04_` INV-02; `03_` §4.2 (77%) dan baris Permenkes 21/2021; `10_` koreksi config. Laporkan bila ada yang tidak sesuai atau kurang.
5. **Verifikasi klaim yang dijawab eksekutor:**
   a. Permenkes 21/2021 dicabut Permenkes 2/2025: buka teks pencabutan di Berita Negara/JDIH dan konfirmasi (pasal pencabutan).
   b. Aturan WHO panjang vs tinggi di 24 bulan: cari dokumen WHO-UNICEF 2019 *Recommendations for data collection, analysis and reporting on anthropometric indicators in children under 5* atau manual WHO Anthro; kutip lokasi aturan (tanpa menyalin panjang).
   c. Pedoman TTD Kemenkes: temukan berkas primer (judul, tahun, halaman) yang menyebut kandungan satu tablet (besi elemental dan asam folat) dan jumlah tablet minimal selama kehamilan.
   d. Konfirmasi C-013 visual: render halaman 14–15 Permenkes 2/2020 dan pastikan baris gizi lebih/obesitas (BB/PB-TB dan IMT/U 0–60 bln).
6. **Cek akurasi pembacaan eksekutor:** bandingkan tabel nilai acuan AKG di `docs/verifikasi_eksekutor/HASIL_VERIFIKASI.md` §4 dengan pembacaan Anda; daftar semua selisih (termasuk bahwa lemak/karbohidrat/serat dasar 19–29 belum Anda verifikasi).

## Kriteria penerimaan
- [ ] Tiap butir 1–6 punya status dan bukti
- [ ] Temuan baru (jika ada) bernomor dan bertingkat

## Hal yang paling saya cemaskan
Pembacaan tabel AKG dari citra (kedua pihak membaca secara visual); sumber primer TTD tidak terjangkau; saya terlalu cepat menerima sebagian saran pemangkasan.

## Asumsi
Auditor memiliki akses web dan dapat merender PDF.
