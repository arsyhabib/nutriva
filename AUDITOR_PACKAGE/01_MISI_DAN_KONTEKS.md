# 01 — Misi dan Konteks

## 1. Pemilik dan konteks akademik

- Pemilik produk: mahasiswa kedokteran, kerja **PjBL blok gizi**. Topik utama: **1000 Hari Pertama Kehidupan (1000 HPK)**. Topik sekunder: **kewirausahaan**. Dua topik ini adalah jangkar seluruh konsep.
- Ujian: presentasi hasil kerja nyata dari rancangan dan produk PjBL. Pelaksanaan lapangan: **satu hari di posyandu**, mengumpulkan data untuk presentasi.
- Aplikasi **tidak akan selesai dalam sehari**. Yang harus siap pada hari H adalah bagian yang menghasilkan data yang dapat dipresentasikan.
- Aplikasi akan diperlakukan **seperti skripsi**: proposal, dasar ilmiah, metode, hasil. Kemungkinan diajukan ke **kompetisi inovasi teknologi kesehatan**.
- **Dosen ahli gizi** akan menjadi verifikator aplikasi (gerbang M2, M3 dan seterusnya) dan kemungkinan penguji. Pengajuan etik belum diketahui statusnya.
- Hari ini (saat paket disusun): 2026-10-28. **Tanggal hari H, tenggat kompetisi, nama posyandu, dan identitas dosen belum diketahui eksekutor.**
- Pemilik produk adalah *vibe coder*: bergantung pada agent untuk menulis kode. Kualitas kode, uji, dan keamanan sepenuhnya bergantung pada disiplin proses, termasuk audit Anda.
- Pemilik produk menyatakan **tidak ada batasan waktu** dan meminta usaha maksimal.

## 2. Visi produk (versi saat ini)

**Mesin gizi 1000 HPK yang deterministik, dapat diperiksa, dan jalan offline**, dipakai oleh ibu, keluarga, dan kader posyandu.

- Tiga mode: **Ibu hamil**, **Ibu menyusui**, **Anak 6–23 bulan** (opsional 24–59 bulan). Bayi < 6 bulan: hanya ASI, tanpa menu.
- Inti: menghasilkan rekomendasi menu sederhana yang dipersonalisasi (usia/trimester, status gizi, alergi, anggaran, bahan yang ada, ketersediaan lokal) menggunakan **perhitungan terbuka**, bukan AI.
- **Mode Ahli:** memaparkan rumus, nilai antara, dan **sumber berkoordinat** (dokumen, halaman, tabel, baris) yang dapat dibuka langsung dari aplikasi pada laman khusus. Ditujukan untuk pengguna skeptis, termasuk dosen pembimbing dan penguji.
- **AI** hanya lapisan opsional: menjelaskan hasil mesin dalam bahasa sederhana dan mengusulkan pertanyaan lanjutan berbentuk pilihan. AI **tidak** membuat angka, bahan, sitasi, atau keputusan keamanan.
- Pelengkap lapangan: pengukuran antropometri terpandu, deteksi dini faltering, tindak lanjut kader, instrumen riset (pre/post, SUS).
- Kewirausahaan: jalur B2B2G (posyandu, puskesmas, desa), harga dan ketersediaan lokal dari kader, paket bahan UMKM, biaya diet bergizi.

## 3. Prinsip produk (tidak boleh dilanggar tanpa keputusan pemilik)

1. Keselamatan di atas kecerdasan: tanda bahaya dan aturan keamanan pangan **mendahului** semua rekomendasi dan AI.
2. Setiap angka dapat ditelusuri ke sumber.
3. Hasil dapat direproduksi (masukan + benih + versi = keluaran identik).
4. Jujur tentang batas: edukasi gizi, bukan diagnosis, bukan terapi gizi untuk penyakit.
5. Berfungsi untuk pengguna dengan HP murah, sinyal buruk, literasi rendah, satu tangan.
6. Privasi: data anak dan ibu adalah data pribadi sensitif.

## 4. Kronologi keputusan

| ID | Keputusan / pernyataan pemilik | Catatan |
|---|---|---|
| D-001 | Aplikasi lama (NUTRIVA V8, jaringan perawatan dokter/Pustu) akan dirombak besar-besaran; konsep disesuaikan dengan PjBL gizi 1000 HPK + kewirausahaan | Lihat `10_RINGKASAN_LEGACY_V8.md` |
| D-002 | Pemilik meminta pendapat: all-in-one atau niche. Eksekutor merekomendasikan niche | Pemilik: "persis seperti yang saya pikirkan" |
| D-003 | Eksekutor mengusulkan lima ide: integritas ukur, radar faltering, lingkaran tindak lanjut, resep anggaran lokal, kontinum ibu-anak | Pemilik kemudian memfokuskan ke mesin rekomendasi menu |
| D-004 | Pemilik: inti = **rekomendasi menu dua kategori** (balita dan ibu hamil) dengan kalkulasi tidak statis, personalisasi tinggi **tanpa AI** untuk keputusan; kebutuhan nutrisi (% terpenuhi) menurut berat, tinggi, jenis kelamin, kondisi kesehatan | Eksekutor menambah kategori ibu menyusui |
| D-005 | Pemilik meminta database 5–6 ribu bahan; eksekutor menyarankan 300–600 bahan yang dikurasi | **Belum ada pencarian web untuk memverifikasi ketersediaan basis data**; lihat register klaim |
| D-006 | Pemilik menginginkan AI sebagai **auditor** hasil deterministik, menjelaskan ke ibu dan mengajukan pertanyaan lanjutan | Eksekutor memberi koreksi: AI = penjelas/pewawancara; auditor angka = kode + ahli gizi |
| D-007 | Pemilik meminta daftar instrumen ilmiah untuk pembelaan di depan dosen ahli gizi | Dasar `03_` dan `08_`; seluruhnya belum diverifikasi |
| D-008 | Pemilik menyetujui seluruh registri fitur (`REGISTRI_FITUR_NUTRIVA.md`) | Persetujuan terhadap registri versi awal; ruang lingkup P0 belum dikunci secara eksplisit |
| D-009 | Strategi pengembangan: inti bertingkat, jalur komplementer, arsitektur longgar; 14 fitur tambahan (K01–K14) diusulkan | Belum disetujui pemilik secara eksplisit |
| D-010 | Pemilik menetapkan **agent auditor independen** untuk setiap langkah | Alasan paket ini ada |

## 5. Hal yang belum diketahui (unknowns)

- Tanggal hari H dan tenggat kompetisi, jumlah anak dan ibu yang diharapkan, ukuran tim.
- Posyandu dan puskesmas yang dilibatkan; sinyal internet dan perangkat kader.
- Status persetujuan etik; apakah dosen mewajibkan metode tertentu.
- Identitas dan ketersediaan dosen ahli gizi; apakah mereka akan memakai lembar review XLSX.
- Apakah pemilik memiliki akses API model AI; kebijakan data untuk pengiriman profil ke layanan AI.
- Lisensi dan ketersediaan berkas TKPI dalam bentuk dapat diproses.
- Pilihan teknologi final (dijelaskan di strategi sebagai usulan, belum diprototipekan).

## 6. Ketegangan ruang lingkup yang diketahui (mohon dinilai)

Eksekutor mengakui adanya **dua pusat gravitasi** yang bisa berebut sumber daya:
(a) mesin rekomendasi menu (inti terbaru pemilik) dan (b) skrining antropometri dan tindak lanjut posyandu (hasil diskusi awal). Registri memuat keduanya. Pertanyaan audit: apakah keduanya koheren sebagai satu produk, atau salah satunya harus dijadikan modul belakangan?
