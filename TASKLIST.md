# TASKLIST NUTRIVA (dipegang oleh Eksekutor)

Diperbarui: 2026-10-28. Status: `[x]` selesai · `[~]` berjalan · `[ ]` belum.

## 0. Arahan pemilik produk yang berlaku sepanjang proyek
- Validitas dan kehati-hatian di atas kecepatan; tidak ada batas waktu atau panjang keluaran.
- Setiap langkah diaudit agent auditor independen; gerbang tidak dibuka tanpa vonis auditor + persetujuan pemilik.
- **Desain, artistik, dan kenyamanan harus menonjol** (lihat §4). Disempurnakan dalam **sesi khusus desain** nanti.

## 1. Tahap Pra-M0: Verifikasi dasar ilmiah (oleh Eksekutor, sebelum audit independen)
- [x] Paket auditor, templat, LEDGER, CLAUDE.md
- [x] Permenkes 2/2020: judul, tanggal, Pasal 2/4/6, lampiran hal.12–15 dibaca dari Berita Negara
- [x] PMK 28/2019: Tabel 1–3 (hal.6–14) dibaca dari Berita Negara; Lampiran II hal.31–32 (Cost of the Diet)
- [x] WHO dokumen komputasi z-score (referensi 2007): rumus dan penyesuaian ±3 SD
- [x] WHO GHO registry: MDD ≥5 dari 8 kelompok
- [x] Honey, susu sapi, gula tambahan, ikan merkuri tinggi (CDC, halaman 14 Apr 2026)
- [~] Standar WHO 2006 (0–5 th): penyesuaian ±3 SD, nilai BIV dari dokumen primer
- [ ] **Ulangi pencarian yang gagal:** keamanan pangan hamil, alergen, usia koreksi prematur, Gibson 77%, UU PDP 27/2022, Permenkes 41/2014, Perpres 72/2021, PMK 21/2021
- [ ] IYCF 2021 penuh (MMF, MMFF, MAD): PDF WHO/UNICEF diblokir (403), cari salinan lain
- [ ] TTD: kadar asam folat (0,25 vs 0,4 mg) dan jumlah 90 tablet dari pedoman Kemenkes
- [ ] LiLA 23,5 cm dari dokumen Kemenkes (baru dari sumber sekunder)
- [ ] FAO/WHO 2004 besi (5/10/12/15%): belum terkonfirmasi
- [ ] IZiNCG, USDA FDC (CC0), Open Food Facts (ODbL), PIHPS, HiGHS dual, PDF.js, WCAG 2.5.8, SUS, CVI, Naegele
- [x] `docs/verifikasi_eksekutor/HASIL_VERIFIKASI.md` ditulis (status per klaim, 10 temuan baru F-01…F-10, nilai acuan AKG). Register `08_` sengaja **tidak diubah** agar verifikasi auditor tetap buta
- [x] `audit/requests/REQ-0001` (A-SRC-0) dan `REQ-0002` (A-SPEC-0) dibuat dan dicatat di LEDGER
- [ ] Menunggu laporan auditor; lalu tanggapi di `audit/responses/`
- [ ] Setelah audit: lanjutkan klaim yang belum terbaca (HASIL_VERIFIKASI §5)

### Temuan penting sejauh ini (untuk auditor dan perancangan)
1. AKG 2019 menyatakan **vitamin A dalam RE**, bukan RAE; UL IOM dalam RAE. Perlu konversi dan penanda satuan.
2. AKG menanam **asumsi bioavailabilitas** (besi: catatan kaki 2 menyebut 75% heme; seng: bioavailabilitas tinggi/sedang). Menambah koreksi bioavailabilitas di atasnya berisiko menghitung ganda → fitur A17 harus dirancang ulang atau hanya bersifat kualitatif.
3. AKG energi bayi 6–11 bulan = 800 kkal **total** (termasuk ASI); kebutuhan dari makanan pendamping (200/300/550 kkal) adalah konsep berbeda. Jangan membandingkan menu dengan 800 kkal untuk anak yang masih disusui.
4. PMK 28/2019 memuat dua tambahan berbeda: Tabel 1 (hamil +180/+300/+300; menyusui +330/+400) dan bagian situasi darurat (hamil +300; menyusui +500). Mesin memakai Tabel 1.
5. Permenkes 2/2020 menetapkan klasifikasi lewat **tabel SD per bulan penuh** (bukan LMS). Usia dalam bulan penuh; batas PB/TB pada 24 bulan ("0–24 bulan" lalu "di atas 24 bulan") **ambigu pada tepat 24 bulan** → butuh keputusan dan uji.
6. Permenkes 2/2020 Pasal 6(4) memberi dasar hukum penilaian **weight faltering** (tabel kenaikan berat 0–24 bulan) → mendukung fitur radar faltering.
7. PMK 28/2019 Lampiran II hal.31–32 menjelaskan metode **Cost of the Diet** dengan TKPI dan harga lokal → dasar kuat untuk fitur Harga Celah dan keterjangkauan.
8. Kesalahan eksekutor sebelumnya: MDD "4 dari 8" (benar ≥5 dari 8).

## 2. Audit awal (oleh Auditor)
- [x] A-SRC-0 selesai: **DITOLAK** (S1 ×3, S2 ×2); tanggapan RSP-0001 (semua diterima, klaim dikarantina)
- [x] A-SPEC-0 selesai: **DITOLAK** (S0 ×2, S1 ×7, S2 ×8); tanggapan RSP-0002
- [x] REQ-0003 → RPT-0003 **DITOLAK** (TTD S1); REQ-0004 → RPT-0004 **TIDAK LAYAK memulai M0** (4 S0). Ditanggapi di RSP-0003/0004; keputusan v2 (Opsi A: V-PJBL tanpa data nyata) ditulis di `KEPUTUSAN_DAN_JALUR_RILIS.md`; registri bertag fase
- [x] REQ-0005 → RPT-0005: **LAYAK BERSYARAT untuk M0** (S0 5, S1 8, S2 3 terbuka untuk M1a). Ditanggapi RSP-0005
- [x] Pemilik memilih **Opsi B** (v3): cakupan penuh, dua profil build, data nyata terkunci otorisasi; git diinisialisasi; ADR-0001…0005 ditulis
- [x] Node.js v24.22.1 dipasang (persetujuan pemilik); **M0 selesai dibangun**: git, .gitignore, ADR-0001…0005, tag fase beku (snapshot+uji), skema klaim/sumber/jejak (Zod), verifikator klaim + karantina TTD, lint fixture sintetis, 53 uji hijau, uji mutasi 6/6 tertangkap, npm audit 0 kerentanan
- [x] REQ-0006 → RPT-0006 **DITOLAK** (AUD-0006-01 S0: gerbang `lapangan` tidak ada). RSP-0006 menanggapi semua temuan.
- [~] REQ-0007 (verifikasi ulang M0) **menunggu RPT-0007**. **M1a belum boleh dimulai.**
- [~] REQ-0008 (celah `{} as TokenData` ditutup; ADR-0004 dan ADR-0005 diperbaiki) **menunggu audit**. Belum ada commit git (menunggu permintaan pemilik)
- [ ] Berkas HTML desain di root (`NUTRIVA Lumen.html`, `NUTRIVA Sistem Desain.html`) belum ditinjau eksekutor
- [ ] Menunggu pemilik: kalimat konfirmasi Opsi A; berkas sumber primer di `sumber/` (Buku KIA 2024, pedoman TTD ibu hamil); izin mengunduh tabel WHO yang dapat diproses mesin; pertanyaan persetujuan pembimbing untuk umpan balik kader
- [x] Keputusan pemilik dicatat di `KEPUTUSAN_DAN_JALUR_RILIS.md`: D1–D6 disetujui; etik, dosen, TKPI setelah PjBL/kompetisi; dua jalur rilis V-PJBL dan V-KOMPETISI
- [ ] **Keputusan pemilik D1–D6** (RSP-0002): pemangkasan P0 untuk M1, penundaan K/radar/kader, slot dulu (LP ditunda), bbox/PDF.js ke P2, fokus skripsi pada A03+B01–B03, menu sebagai inti
- [ ] **Pertanyaan untuk pemilik/dosen:** status persetujuan etik; lisensi/izin TKPI; status alat kesehatan perangkat lunak; pedoman TTD primer; keputusan perilaku tepat 24 bulan; siapa dosen verifikator dan tanggal gerbang M2/M3
- [ ] Lanjutkan klaim yang belum terbaca (REQ terpisah, kecil): Permenkes 41/2014, TKPI, IYCF 2021 penuh, WHO 2006/Anthro, IOM, FAO/WHO besi, usia koreksi prematur, edema, alergen telur/IDAI, SUS/CVI

## 3. Pembangunan (menunggu gerbang Pra-M0)
- [ ] M0 Fondasi · [ ] M1 Walking skeleton · [ ] M2 Mesin lengkap · [ ] M3 Data dan sumber · [ ] M4 Pengalaman · [ ] M5 Riset/etik/AI · [ ] M6 Pra-demo
- Keputusan teknologi terbuka: framework UI, pemecah LP (dual untuk K03), cara menyajikan sumber berkoordinat

## 4a. Paket brief untuk Claude Design (2026-10-28)
- [x] `DESIGN_PACKAGE/` (BRIEF_RINGKAS + 00–07 + NUTRIVA_BRIEF_LENGKAP) dan `DESIGN_PACKAGE.zip` dibuat: kebebasan penuh (tiga tingkat: mutlak/arah pemilik/bebas), pengguna, alur sebagai tugas bukan tata letak, data contoh sintetis, 23 batas mutlak, proyeksi pertumbuhan, kriteria evaluasi
- [ ] Pemilik memakai paket di Claude Design; hasil desain dibawa kembali untuk ditimbang di sesi desain (tinjauan A-UX oleh auditor setelah ada tampilan)
- Catatan: paket **tidak memuat** palet/gaya; arahan pemilik (modern, minimalis, kontras semi-kuat konsisten, interaktif, gerak relevan, baru) dicantumkan sebagai aspirasi, bukan resep

## 4. Jalur DESAIN dan ESTETIKA (T7) — sesi khusus penyempurnaan dijadwalkan nanti
**Arahan pemilik:** aspek desain, artistik, dan kenyamanan ditonjolkan; konsep **modern, minimalis**, palet warna **kontras semi-kuat** yang **konsisten pada setiap halaman**.

Pekerjaan untuk sesi desain:
- [ ] Brief desain: prinsip, suasana, referensi, hal yang dihindari
- [ ] **Sistem desain berbasis token** (warna, tipografi, spasi, radius, bayangan, gerak) sebagai satu-satunya sumber gaya; menggantikan 7 stylesheet V8
- [ ] **Palet kontras semi-kuat:** tafsiran eksekutor = kontras cukup tegas untuk keterbacaan (teks ≥ 4,5:1 WCAG AA; elemen UI ≥ 3:1) tetapi tidak keras (hindari hitam murni di atas putih murni); satu palet primer + netral + aksen; **status aman/perlu perhatian/segera** yang tidak mengandalkan warna saja dan tidak menghakimi; diuji buta warna. *Pemilik perlu mengonfirmasi tafsiran ini.*
- [ ] Tipografi: skala modular, keterbacaan di HP kecil, font ringan (sistem atau satu keluarga), dukungan angka dan desimal koma
- [ ] Pustaka komponen lengkap dengan semua keadaan (normal, fokus, tekan, nonaktif, galat, memuat, kosong)
- [ ] Tata letak minimalis: satu tindakan utama per layar, ruang putih, hierarki jelas, pengungkapan bertahap; Mode Ahli tidak mengotori layar utama
- [ ] Ikonografi konsisten (ikon + teks), ilustrasi/SVG ringan, identitas (logo, ikon PWA, layar pembuka)
- [ ] Mikro-interaksi halus; patuh `prefers-reduced-motion`
- [ ] Kenyamanan: ergonomi satu tangan, zona jempol, navigasi bawah, target sentuh ≥ 48 dp
- [ ] Mode terang dan gelap dari palet yang sama (P1)
- [ ] Panduan gaya tertulis + **halaman pratinjau komponen** (living style guide)
- [ ] Audit konsistensi antar-halaman (A-UX) dan **uji regresi visual** (tangkapan baseline)
- [ ] Anggaran performa visual (bobot font/gambar) untuk HP murah

**Ketegangan yang harus diselesaikan di sesi desain:** minimalis vs. kebutuhan pengguna literasi rendah (ikon + teks, target besar, bahasa sederhana); estetika vs. kontras/aksesibilitas; keindahan vs. kecepatan di HP rendah.

## 5. Lain-lain
- [ ] `git init` saat M0
- [ ] Konfirmasi dengan pemilik: tanggal hari H, tenggat kompetisi, dosen verifikator, status etik, akses API AI
