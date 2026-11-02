# 03 — Tugas Pengguna dan Alur (bukan tata letak)

Berikut **apa yang perlu bisa dilakukan orang**, bukan bagaimana layarnya harus tersusun. Bentuk, urutan, dan metafora sepenuhnya milik Anda. Status: **[Sekarang]** dibangun lebih dulu · **[Segera]** setelah itu · **[Proyeksi]** konsep untuk dirancang agar sistem siap menampungnya.

## A. Inti [Sekarang] — anak 6–23 bulan

**A1. Masuk dan memahami konteks.** Pengguna memahami dalam hitungan detik: apa ini, untuk siapa, apa batasnya; dalam profil `demo` melihat label prototipe; memilih konteks (kini: anak 6–23 bulan; kelak hamil dan menyusui). Instal ke layar utama (PWA). Status luring/daring terlihat jelas.

**A2. Menceritakan keadaan anak** (profil). Informasi: usia dalam bulan, jenis kelamin, berat badan, panjang/tinggi dan cara mengukurnya, **status ASI (wajib)**, lahir prematur?, bengkak pada kedua kaki/wajah?, kondisi atau sindrom khusus?, usia diketahui pasti?, alergi, anggaran makan per hari, bahan yang ada di rumah. Masukan harus terasa ringan, bukan formulir. Angka berformat Indonesia (koma). Nilai tak masuk akal ditangani dengan ramah ("ukur ulang?"). Pada profil `demo` masukannya berupa **preset tetap**, bukan ketikan.

**A3. Mengetahui status gizi anak.** Hasil klasifikasi berat/panjang menurut usia dari tabel resmi (kategori bernama resmi, mis. "berat badan kurang", "pendek"). Disampaikan **tanpa menghakimi**, dengan arti dan langkah berikut. Bila status berat atau ada kategori khusus (prematur, bengkak, sindrom, usia tidak pasti): **berhenti memberi menu → rujukan** ke petugas kesehatan.

**A4. Mendapat contoh pola makan.** Hasil: pola makan sehari/beberapa kali makan dalam "slot" (sumber karbohidrat, lauk hewani, lauk nabati, sayur, buah), dengan **ukuran rumah tangga** (butir, sendok makan, centong, potong), tekstur sesuai usia, **dan** tanpa bahan yang berbahaya atau berpotensi alergen sesuai masukan. Pengguna dapat:
- mengganti satu bahan ("Tidak punya ini") → padanan terdekat yang terjangkau;
- meminta variasi ("Hitung ulang") yang tetap bisa direproduksi (kode benih tampil);
- melihat biaya perkiraan (kelas harga), bukan harga pasti.
Istilah di antarmuka: **"contoh pola makan dari aturan"**, bukan "rekomendasi menu" (sampai dosen menandatangani).

**A5. Memahami kecukupan gizi.** Seberapa besar kebutuhan harian dari standar tercukupi (persentase AKG) per zat, **celah** yang tersisa, dan apa artinya. Untuk 6–11 bulan: bedakan **total kebutuhan (termasuk ASI)** dan **bagian dari makanan pendamping**. Bila celah tidak dapat ditutup dari makanan (mis. zat besi), arahkan ke "tanyakan petugas tentang suplemen", **tanpa menyebut dosis**. Ketidakpastian dan "tidak ada data" harus bisa ditampilkan jujur (rentang; "belum ada data" ≠ nol).

**A6. Bertanya "Kenapa?".** Panel yang menjelaskan keputusan: kebutuhan, apa yang terpenuhi, apa kurang, mengapa bahan ini, aturan keselamatan apa yang lolos/menyaring bahan. Bahasa awam di lapisan pertama.

**A7. Mode Ahli (pemeriksaan).** Untuk pengguna skeptis: rumus, nilai antara, satuan, versi mesin dan data, kode benih, **asumsi dan batasan**, dan **sumber berkoordinat** (dokumen, halaman, tabel) dengan **status verifikasi** (`teks-ditemukan-mesin`, `terverifikasi-manusia`, `belum`) serta **tingkat bukti** (A regulasi nasional, B pedoman WHO/FAO, C model terbit, D asumsi pengembang). Daftar semua sumber ("Pustaka Sumber"). Bisa membandingkan hasil dengan menjalankan ulang. Harus bisa dibaca serius oleh dosen di laptop **tanpa** mengganggu pengguna biasa.

**A8. Keselamatan dan tanda bahaya.** Daftar tanda bahaya (mis. kejang, sulit bernapas, tidak mau minum, lemas luar biasa) → layar yang **tegas, tenang, tidak bisa terlewat**: "bawa ke fasilitas kesehatan hari ini". Aplikasi tidak melanjutkan ke menu. Tidak boleh terasa seperti diagnosis atau menakut-nakuti.

**A9. Tentang, label, hak data.** Memahami batas aplikasi; label prototipe; menghapus semua data di perangkat dalam satu tindakan (profil lapangan); versi aturan dan pembaruan yang diperlukan.

## B. Keadaan yang harus dirancang (bukan hanya jalur mulus)
Kosong · memuat · luring · aturan keselamatan kedaluwarsa (wajib perbarui sebelum memberi menu) · galat masukan · hasil **tidak layak** (mis. tidak ada kombinasi yang menutup zat tertentu → tampilkan celah dengan jujur, jangan menu ajaib) · data tidak tersedia · rujukan/blokir · sesi berakhir/hapus data · layar sangat kecil · teks diperbesar 200% · mode gerak dikurangi · cetak/tangkapan layar (label harus ikut).

## C. [Segera] — setelah inti
- **Ibu hamil dan menyusui:** trimester/usia kandungan, LiLA, kebutuhan tambahan; jalur keselamatan makanan yang berbeda. Rujukan, bukan terapi, untuk kondisi seperti diabetes kehamilan.
- **Instrumen kegunaan:** persetujuan, kuesioner singkat sebelum/sesudah, SUS, pengukur waktu tugas, tanpa menanyakan data anak.
- **Pelacak tablet tambah darah** (tanpa dosis; pengingat dan kebiasaan).
- **Paspor pangan anak:** bahan yang sudah dicoba, kelompok pangan, pengenalan alergen terpandu.
- **Linimasa 1000 hari:** hari ke-N, tonggak, "yang perlu dilakukan minggu ini".
- **Fakta Hari Ini:** pemeriksa mitos/fakta berbasis aturan, bersumber.

## D. [Proyeksi] — rancang ruang untuknya
- **Kader:** sesi posyandu, daftar anak (kode, tanpa nama), alur ukur terpandu, deteksi dini pertumbuhan melambat, daftar tugas tindak lanjut, pengingat via tautan WhatsApp.
- **Harga dan ketersediaan lokal** yang diperbarui kader; **Harga Celah**: biaya menutup tiap celah gizi.
- **Dasbor desa/puskesmas** (agregat anonim): sebaran status, kebutuhan intervensi, biaya diet bergizi.
- **Penjelas AI** (opsional, tidak pernah menentukan angka): menjelaskan dengan bahasa sederhana dan mengajukan pertanyaan lanjutan dalam bentuk pilihan; harus **terlihat jelas terpisah** dari hasil deterministik.
- **Bahasa daerah, suara (baca-keras dan masukan suara), mode bergambar** untuk literasi rendah.
- **Serah-terima data tanpa internet** lewat kode QR antar HP.
- **Kalibrasi dapur:** ibu mengkalibrasi sendok/mangkuknya agar porsi pas.
- **Akademi kader:** latihan dari kasus sintetis.
- Perangkat lain: tablet, layar proyektor, cetak (kartu rujukan), mode kios di posyandu.

## E. Hal yang harus **terasa** sebagai satu sistem
Walau jalurnya banyak, pengguna harus merasa memakai **satu hal yang koheren**: satu bahasa visual, satu cara memahami angka, satu cara melihat sumber, satu cara menghadapi bahaya.
