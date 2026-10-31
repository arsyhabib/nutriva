# 09 — Pengungkapan Eksekutor (kelemahan, asumsi, bias)

Eksekutor menulis ini agar Anda tidak perlu menemukannya dengan susah payah. Perlakukan sebagai **peta tempat mencari**.

## 1. Kesalahan yang sudah diketahui

1. **MDD**: sempat ditulis "4 dari 8 kelompok"; yang benar menurut IYCF 2021 adalah ≥ 5 dari 8 (versi 2008: 4 dari 7). Sudah dikoreksi di percakapan, namun **belum diverifikasi ke dokumen**, dan teks lama mungkin muncul di draf awal.
2. **Target sentuh 48 dp** di registri disebut sebagai syarat aksesibilitas; WCAG 2.2 AA mensyaratkan minimum 24 px. 48 dp adalah pilihan rancangan lebih ketat.
3. Registri menulis "kontras WCAG 2.2 AA" tanpa memeriksa seluruh palet (belum ada palet).

## 2. Seluruh rujukan dari ingatan

Tidak ada satu pun sumber yang saya buka dalam sesi ini. Nomor regulasi, ambang, angka tambahan AKG, nilai kalori MP-ASI, persentase bioavailabilitas, dan sitasi jurnal ditulis dari memori model dan **mungkin keliru** (tahun, nomor pasal, angka). Saya tidak menjalankan pencarian web sama sekali untuk klaim ketersediaan basis data (C-073).

## 3. Aplikasi lama (V8)

Pernyataan tentang V8 berasal dari dokumen README/SPEC dan pembacaan sebagian kode yang diminifikasi. **Saya tidak menjalankan V8**, tidak membuka UI-nya, tidak menjalankan SQL, dan tidak memverifikasi bahwa fitur yang diklaim README benar berfungsi.

## 4. Asumsi yang belum diuji

- Pemecah LP dalam peramban cukup cepat dan kecil untuk HP rendah.
- 300–600 bahan cukup untuk menu yang beragam dan bermakna budaya.
- Kelas harga (bukan harga eksak) cukup untuk keputusan.
- Kader mau dan mampu memperbarui harga dan ketersediaan.
- Dosen ahli gizi bersedia memakai lembar review XLSX/CSV dan menyetujui aturan keamanan.
- AI (penjelas) dapat ditahan agar tidak mengarang angka dengan validator sederhana.
- PWA dapat berjalan baik pada perangkat posyandu.
- Mode ahli dan sumber berkoordinat dapat dibuat tanpa melanggar hak cipta.
- Satu hari pelaksanaan cukup menghasilkan data yang bermakna.

## 5. Bias dan kecenderungan eksekutor

| Kecenderungan | Wujud | Yang diminta dari Anda |
|---|---|---|
| **Menyenangkan pemilik** | Pemilik menyebut "persis seperti yang saya pikirkan", dan eksekutor sempat mengiyakan dengan cepat | Cari argumen penolakan terkuat terhadap tiap keputusan besar |
| **Ketuntasan palsu** | Dokumen terlihat rapi dan menyeluruh sehingga menimbulkan kesan matang | Periksa apakah isinya terbukti, bukan hanya tertata |
| **Keyakinan berlebih pada ingatan** | Angka disampaikan dengan nada pasti | Anggap semua angka salah sampai terbukti |
| **Scope creep** | Registri (± 140 fitur) + 14 tambahan telah membengkak | Nilai kelayakan realistis; usulkan pemangkasan |
| **Optimisme teknis** | Menganggap LP+PWA+PDF.js+AI dapat dibangun cepat oleh vibe coder | Nilai risiko integrasi dan beban pemeliharaan |
| **Narasi inovasi** | Fitur "inovatif" mungkin lebih menarik daripada berguna bagi kader | Tanyakan: siapa yang akan benar-benar memakainya di posyandu? |
| **Pengaburan batas klinis** | Rekomendasi gizi mendekati saran medis | Cari kalimat yang terdengar seperti diagnosis/terapi |

## 6. Hal yang kurang dipikirkan (silakan ambil)

- Beban kognitif dan waktu kader di posyandu yang ramai.
- Siapa yang bertanggung jawab bila rekomendasi aplikasi dianggap salah oleh ibu atau bidan.
- Status regulasi alat (apakah termasuk perangkat lunak kesehatan yang perlu izin?).
- Pemeliharaan setelah mahasiswa lulus (keberlanjutan).
- Sensitivitas budaya (makanan tertentu, pantangan, stigma stunting/gizi buruk).
- Ketimpangan akses pangan: menu "bergizi" yang tak terjangkau dapat menimbulkan rasa bersalah.
- Dampak skor: skor rendah dapat dipakai menghakimi ibu.
- Ketidakpastian data TKPI untuk pangan olahan/lokal.
- Bahasa daerah dan literasi; kemampuan membaca angka/persentase.
- Keamanan fisik perangkat kader dan pemakaian bersama.

## 7. Metrik keberhasilan yang dikhawatirkan eksekutor tidak tercapai

- Persetujuan etik datang terlambat dibanding kebutuhan pengambilan data.
- Verifikasi dosen berjalan lambat sehingga M2/M3 tertahan.
- Jumlah sampel hari H terlalu kecil untuk kesimpulan kuantitatif.
- Skor SUS dan pemahaman ibu dipengaruhi bias keinginan sosial.
- Basis data bahan tidak selesai dikurasi tepat waktu.
