# 05 — Batas Mutlak (satu halaman; sisanya bebas)

Setiap butir berikut ada karena alasan keselamatan, aksesibilitas, hukum, atau kejujuran ilmiah. Tidak ada yang menyangkut selera visual. Bila Anda merasa sebuah butir menghalangi ide hebat, **sampaikan kepada kami beserta alasan**, jangan diam-diam melanggar.

## Keselamatan dan kejujuran
| # | Batas | Alasan |
|---|---|---|
| 1 | Saat ada tanda bahaya atau kategori khusus (prematur, bengkak, kondisi khusus, status berat), antarmuka **berhenti memberi pola makan** dan memunculkan rujukan yang tidak mudah terlewat | Menu untuk anak yang sakit berat bisa berbahaya |
| 2 | Tidak ada bahasa diagnosis, terapi, dosis obat/suplemen, atau janji ("pasti", "dijamin", "menyembuhkan") | Aplikasi edukasi, bukan alat medis |
| 3 | Label prototipe wajib pada **setiap** keluaran profil `demo` dan **tertanam pada gambar/cetak/tangkapan layar**, bukan hanya di halaman Tentang | Orang akan membagikan tangkapan layar dan menganggapnya nasihat |
| 4 | "Tidak ada data" tidak boleh tampil sebagai angka 0; ketidakpastian atau rentang harus dapat ditampilkan jujur | Menyembunyikan data hilang menyesatkan |
| 5 | Hasil tidak layak (tidak ada kombinasi yang cukup) ditampilkan **apa adanya** sebagai celah, tanpa "menu ajaib" | Kejujuran ilmiah |
| 6 | Hasil deterministik dan hasil penjelasan AI (kelak) **terlihat jelas terpisah**; AI tidak pernah tampil sebagai sumber angka atau keputusan keselamatan | Keterbukaan dan keselamatan |
| 7 | Status verifikasi sumber dan tingkat bukti tampil jelas; klaim belum diverifikasi **berlabel** | Penguji akan mencarinya |
| 8 | Tidak ada tampilan skor tunggal yang menghakimi atau memeringkat ibu/anak ("nilai 62/100"); kategori resmi ditampilkan dengan bahasa yang manusiawi | Stigma dan rasa gagal |
| 9 | Pada profil `demo`: tidak ada kolom teks bebas, tidak ada ekspor per profil, tidak ada keadaan masukan di URL | Mencegah data nyata/pribadi masuk |

## Aksesibilitas dan keterbacaan
| # | Batas | Alasan |
|---|---|---|
| 10 | Teks memenuhi kontras WCAG 2.2 AA (≥ 4,5:1; teks besar ≥ 3:1; komponen dan batas fokus ≥ 3:1) pada **semua** keadaan: normal, fokus, tekan, nonaktif, galat, dan setiap tema | Matahari posyandu, penglihatan menurun |
| 11 | Informasi **tidak** disampaikan hanya lewat warna (selalu ada teks/bentuk/ikon) | Buta warna; layar pudar di bawah matahari |
| 12 | Target sentuh ≥ 48 dp dengan jarak memadai; operasi **satu tangan** | Menggendong anak; jari besar; tangan basah |
| 13 | Teks dapat diperbesar sampai 200% tanpa kehilangan fungsi; tidak ada teks di dalam gambar untuk informasi penting | Penglihatan menurun |
| 14 | Patuh `prefers-reduced-motion`; tidak ada kedipan cepat; tidak ada gerak yang diperlukan untuk memahami informasi | Vestibular, kenyamanan |
| 15 | Dapat dioperasikan dengan pembaca layar (TalkBack) dan urutan fokus logis; label bermakna | Tunanetra; kelak suara |
| 16 | Angka berformat Indonesia (desimal koma); mendukung masukan koma dan titik | Pengguna lokal |

## Teknis (sebagai kenyataan perangkat, bukan pilihan gaya)
| # | Batas | Alasan |
|---|---|---|
| 17 | PWA offline-first; **semua** fungsi inti berjalan tanpa jaringan; keadaan luring/daring selalu terlihat | Sinyal posyandu |
| 18 | **Ringan:** HP Android murah, koneksi lambat. Gambar dan font berat, efek blur/bayangan besar, atau animasi yang menghitung ulang tata letak dapat membuat aplikasi tidak terpakai | Perangkat nyata |
| 19 | Layar 360–412 px sebagai acuan utama; harus tetap sempurna sampai laptop/proyektor | Pemakaian nyata |
| 20 | Tidak ada ketergantungan pada layanan eksternal untuk tampilan (font/ikon/gambar disertakan lokal) | Offline dan privasi |
| 21 | Satu sistem desain melayani profil `demo` dan `lapangan` (kelak lebih banyak mode) | Satu produk |

## Etika desain
| # | Batas | Alasan |
|---|---|---|
| 22 | Tidak ada pola gelap (dark pattern), penghitung streak yang membuat rasa bersalah, atau notifikasi yang menekan | Pengguna rentan |
| 23 | Tidak memakai citra anak nyata atau wajah orang sungguhan yang dapat dikenali tanpa izin | Privasi |
