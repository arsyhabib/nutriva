# Tinjauan NUTRIVA Rona terhadap batas mutlak

- **Tanggal:** 2026-10-31 · **Penulis:** Eksekutor · **Status:** tinjauan eksekutor, **belum diaudit** (A-UX menunggu tampilan final)
- **Keputusan pemilik:** paket **NUTRIVA Rona** dipakai sebagai basis desain (2026-10-31). Tercatat di `audit/LEDGER.md` dan `TASKLIST.md` §4.
- **Objek (SHA-256, 16 heks pertama):**
  - `NUTRIVA Rona.html` (482.716 byte): `d1d191952d79a14e`. Salinan identik di `DESIGN_PACKAGE/NUTRIVA Rona.html`. Memuat halaman showcase dan Bagian 01 (prototipe interaktif 392×848 px).
  - `NUTRIVA_Rona_Demo.html` (423.821 byte): `186606ac274ac3ef`. Studio prototipe interaktif.
  - Catatan integritas: hash di atas dihitung dari berkas kerja. Di repositori (commit `fad1824`, diamend menjadi `e21539a`), `core.autocrlf=true` menyimpan versi tanpa CR, dan hash blob-nya `3debe20f303d2635` dan `8bfe382f76367b9f`. Isi keduanya identik setelah CR dihapus. Hal yang sama berlaku untuk beberapa berkas M0 di commit `50f0c40`.
- **Yang tidak diubah:** kedua berkas desain. Perbaikan dilakukan di sesi desain (lihat §5).

## 1. Ringkasan

- Tidak ada sumber luar, permintaan jaringan, service worker, atau status di URL/penyimpanan. Tidak ada gambar, sehingga tidak ada foto anak nyata.
- Kontras pasangan token memenuhi WCAG AA di keempat tema (teks ≥ 4,5:1; elemen UI ≥ 3:1). Angka ini dihitung dari nilai hex token, bukan dari piksel yang dirender.
- Tiga hal melanggar batas mutlak atau keputusan yang sudah ada: label prototipe tidak persis (RN-01), catatan internal tampil di antarmuka (RN-02), dan Mode Ahli menyebut LMS sebagai dasar Permenkes 2/2020 (RN-03). Ketiganya wajib diperbaiki sebelum tampilan dipakai di luar peragaan.
- Ada klaim verifikasi dan lulus yang belum punya dasar (RN-05, RN-06), serta nama anak contoh yang terdengar nyata (RN-07).
- Lima hal menunggu keputusan pemilik (RN-07, RN-08, RN-10, RN-11, dan konfirmasi tafsiran kontras).

## 2. Temuan

Tingkat mengikuti skala di `AUDITOR_PACKAGE/05_PROTOKOL_AUDIT.md` agar seragam. Nomor baris merujuk ke `NUTRIVA Rona.html` (root) dan `NUTRIVA_Rona_Demo.html` (demo).

| ID | Tingkat | Lokasi | Temuan | Tindakan usulan |
|---|---|---|---|---|
| RN-01 | S1 | demo baris 5200 (pita atas); root baris 3320 | Label prototipe tidak persis. Demo menulis "Belum diverifikasi dosen; bukan pengganti **tenaga** kesehatan". Root menulis "Prototipe PjBL 1.000 Hari Pertama Kehidupan · … Bukan pengganti tenaga kesehatan" tanpa frasa "belum diverifikasi dosen". Teks wajib: *Prototipe PjBL — belum diverifikasi dosen; bukan pengganti petugas kesehatan.* (`KEPUTUSAN` §3; batas mutlak 3) | Ambil teks dari satu sumber, yaitu konstanta `LABEL_PROTOTIPE` di `src/engine/konstanta.ts`. Huruf kapital boleh lewat gaya CSS, tetapi teksnya tidak diubah. |
| RN-02 | S1 | demo baris 6660; root baris 7628 | Teks yang tampil ke pengguna memuat "(BATAS MUTLAK #16)". Itu catatan pengembang yang bocor ke antarmuka. | Hapus dari teks tampak. Rujukan internal hanya di komentar atau dokumen. |
| RN-03 | S1 | root baris 2584 (Mode Ahli); data LMS baris 5709 dan 5718 | Mode Ahli menulis "Derivasi Antropometri LMS (Permenkes 2/2020)" dan menampilkan parameter L, M, S serta z-score LMS. Permenkes 2/2020 memakai tabel SD per bulan dan tidak memuat rumus LMS (`audit/evidence/EVD-0002` §A; keputusan T-08). LMS hanya terkait dokumen WHO yang belum terverifikasi (C-020). | Ganti atribusi dengan tabel SD resmi, atau keluarkan jalur LMS dari M1. Jangan tampilkan z-score yang tidak bisa ditelusuri ke tabel resmi. |
| RN-04 | S2 | root baris 2577, 3292, 6591 (Mode Sidang: "Matriks LP", "fungsi objektif LP") | Desain menampilkan pemrograman linear (LP), padahal LP ditunda (T-07; A07 tanpa LP). | Ganti, atau beri label "fase lanjut". Jangan dijanjikan dalam presentasi (RPT-0002). |
| RN-05 | S1 | root baris 2631, 2636, 2641 | Label "[DIVERIFIKASI]" pada sumber, termasuk Permenkes 28/2019. Belum ada verifikasi manusia. Kosakata status yang sah: `teks-ditemukan-mesin`, `terverifikasi-manusia`, `belum` (`REGISTRI_FITUR_NUTRIVA.md` bagian Rancangan Mesin Sumber, butir 4). | Pakai kosakata status register. "DIVERIFIKASI" tidak dipakai sampai dosen memverifikasi (K-05). |
| RN-06 | S2 | root baris 3231–3308 (tabel uji desain) | Penanda "Lulus Desain" dan "Lulus Mutlak" adalah klaim lulus sepihak. Uji lima detik, empati, dan "baru" belum dilakukan (`TASKLIST` §4). | Beri label "hasil mandiri desainer, belum diuji pengguna", seperti pada Bening. Atau hapus penanda lulus. |
| RN-07 | S2 | root baris 2432, 5685, 5736, 5787; demo baris 2330, 4717 | Preset memakai nama anak yang terdengar nyata: "Ayla Putri", "Bima Pratama", "Citra Kirana". `KEPUTUSAN` T-13 dan B10 menolak nama dalam data pengguna. Batas mutlak 9 meminta demo tanpa identitas. | **Keputusan pemilik:** pakai kode preset (A/B/C, seperti `tests/fixtures/`), atau nama yang jelas fiktif. |
| RN-08 | S2 | demo baris 4789 dan 4807 (`status: 'bahaya'`); tabel status root | Kosakata status "bahaya / celah / perhatian / cukup / kosong" berbeda dari L02 dan L11 (aman / perhatian / segera, empatik). Istilah "bahaya" untuk status gizi belum diuji empati (brief 05 batas 8; 07 uji empati). | **Keputusan pemilik:** selaraskan dengan L02 dan L11, lalu uji empati dengan kader dan ibu (M4). |
| RN-09 | S2 | root banyak baris (mis. 2369, 2530, 2645) | Desain mengutip TKPI sebagai sumber nilai. Lisensi TKPI belum diketahui (C-006; AUD-0002-03). | Tanda "ilustratif" tetap. Jangan dipakai sebagai data produk sampai lisensinya jelas. |
| RN-10 | Keputusan | root baris 165 (`--t-1: #0F080B`); tema Terik di atas `#FFFFFF` (≈ 19,8 : 1) | Tema Terik hampir hitam di atas putih. `TASKLIST` §4 menyatakan hindari hitam murni di atas putih murni. Tafsiran "kontras semi-kuat" belum dikonfirmasi pemilik. | **Keputusan pemilik:** turunkan tone teks, atau biarkan karena kontras tinggi lebih aman di bawah terik matahari. |
| RN-11 | Keputusan | root baris 2314 ("Lab Fisika"), 2938 ("Enam Meja Eksperimen", "Luxury Physics") | Enam meja eksperimen (reologi, Snell, meniskus, air dangkal) tidak ada di `REGISTRI_FITUR_NUTRIVA.md`. Bagian ini lebih cocok sebagai presentasi. | **Keputusan pemilik:** masuk produk (butuh ID registri), atau tetap menjadi galeri presentasi. |
| RN-12 | S2 | demo, blok skrip "LOGIKA APLIKASI" | Prototipe menjalankan kalkulasi sendiri di dalam HTML (z-score, kebutuhan, pemilihan bahan). Itu dua implementasi yang bisa berbeda dari `src/engine/` (STRATEGI §2: mesin murni, satu sumber). | Kalkulasi produk hanya di `src/engine/`. Logika prototipe diperlakukan sebagai ilustrasi, tidak disalin ke produk. |
| RN-13 | S3 | root baris 2802–2850 | Rasio yang tertulis di teks desain (mis. "15,4 : 1 (AAA)") tidak selalu sama dengan hitung ulang dari token (mis. ≈ 16,2 untuk teks utama tema Fajar). Semua tetap di atas ambang. | Hitung ulang dengan pasangan warna yang sama sebelum dikutip. |

## 3. Yang sudah sesuai batas mutlak

- Tidak ada sumber luar, permintaan jaringan, atau service worker. Ini mendukung batas 17 dan 20 (luring, tanpa layanan eksternal).
- Tidak ada state di URL atau penyimpanan browser (`location.hash`, `location.search`, `pushState`, `localStorage`, `sessionStorage`, `indexedDB`: 0 kali). Ini mendukung batas 9.
- Tidak ada gambar (`<img>`: 0), sehingga tidak ada citra anak nyata (batas 23).
- Tidak ada klaim diagnosis, terapi, atau dosis. Kata "dosis" hanya muncul sebagai penyangkalan ("tidak memberikan dosis obat").
- Tanda bahaya menghentikan saran makanan dan menampilkan "Bawa anak ke petugas kesehatan hari ini" (layar A8). Ini mendukung batas 1.
- Mode Ahli dan hapus data (K14) ada.
- Kontras token memenuhi WCAG AA di keempat tema. Rasio terendah per tema (nilai hitung dari token):

| Tema | Teks terendah (pasangan) | Status terendah | Elemen UI terendah |
|---|---|---|---|
| Fajar (utama) | 5,96 : 1 (`t-3` di `bg-1`) | 7,22 : 1 | 5,52 : 1 (`sage` di `bg-1`) |
| Lensa (Mode Ahli) | 6,65 : 1 (`t-3` di `bg-1`) | 7,37 : 1 | 6,42 : 1 (`sage` di `bg-1`) |
| Dekap (malam) | 6,85 : 1 (`t-3` di `permukaan-solid`) | tidak ada pasangan status | 7,70 : 1 (`aksen` di `permukaan-solid`) |
| Terik (luar ruang) | 12,13 : 1 (`t-3` di `bg-1`) | 8,79 : 1 | 8,88 : 1 (`sage` di `bg-1`) |

Ambang: teks ≥ 4,5 : 1; elemen UI ≥ 3 : 1 (WCAG 2.2 AA, batas mutlak 10).
- `prefers-reduced-motion` ada (root 3 kali, demo 2 kali). `lang="id"` ada.

## 4. Yang belum saya periksa

- Render visual pada lebar 360–412 px, zoom 200%, tampilan tanpa warna, dan pembaca layar. Pemeriksaan ini butuh pratinjau browser.
- Kontras pada keadaan gradien, kaca, dan animasi. Hitungan hanya dari token.
- Performa pada HP murah, dan uji ukuran bundel.
- Logika prototipe sebagai perilaku produk. Logika itu hanya dibaca, tidak dijalankan.
- Konten tiap layar secara menyeluruh. Yang dibaca adalah teks yang tampak dan pola kosakata.

## 5. Usulan perbaikan untuk sesi desain (T7)

1. Wajib sebelum tampilan dipakai di luar peragaan: RN-01, RN-02, RN-03, RN-05.
2. Diperbaiki bersamaan dengan keputusan pemilik: RN-06, RN-07, RN-08, RN-09.
3. Keputusan pemilik sebelum tampilan dikunci: RN-10, RN-11, dan konfirmasi tafsiran kontras (`TASKLIST` §4).
4. Setelah perbaikan: uji manual pada §4, lalu A-UX oleh auditor (`AUDITOR_PACKAGE/05`, varian A-UX).
