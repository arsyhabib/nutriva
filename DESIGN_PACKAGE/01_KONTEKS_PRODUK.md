# 01 — Konteks Produk

## Apa itu NUTRIVA
Mesin gizi untuk **1000 Hari Pertama Kehidupan** (dari kehamilan sampai anak berusia 2 tahun). Pengguna menjawab beberapa pertanyaan sederhana tentang diri atau anaknya; aplikasi **menghitung** kebutuhan gizi berdasarkan standar resmi Indonesia, menilai kecukupan, lalu menyusun **contoh pola makan** dari bahan yang terjangkau dan tersedia, dengan pengaman keselamatan yang ketat.

Tahap pertama hanya untuk **anak usia 6–23 bulan** (masa makanan pendamping ASI). Tahap berikutnya: **ibu hamil** dan **ibu menyusui**, lalu skrining pertumbuhan untuk kader.

## Apa yang membuatnya berbeda (inti pengalaman)
1. **Terbuka dan dapat diperiksa.** Setiap angka dapat ditelusuri: rumusnya, nilai antaranya, dan sumbernya (dokumen, halaman, tabel). Ada **Mode Ahli** untuk pengguna skeptis seperti dosen penguji.
2. **Bukan kecerdasan buatan yang menebak.** Perhitungannya deterministik: masukan yang sama selalu memberi hasil yang sama. AI (kelak) hanya menjelaskan dengan bahasa sederhana dan tidak pernah membuat angka atau keputusan keselamatan.
3. **Offline-first.** Dipakai di posyandu dengan sinyal buruk di HP Android murah.
4. **Jujur tentang batas.** Ia edukasi dan alat bantu hitung, bukan diagnosis, bukan pengganti bidan/dokter/Buku KIA. Bila ada tanda bahaya, aplikasi **berhenti memberi menu** dan mengarahkan ke fasilitas kesehatan.
5. **Personalisasi tanpa data berlebihan:** usia, status ASI, alergi, anggaran, bahan di rumah.
6. **Alternatif yang realistis:** "Tidak punya bahan ini?" → padanan terdekat; "Hitung ulang" → variasi yang tetap bisa direproduksi lewat kode benih.

## Siapa yang membuat dan mengapa
Proyek mahasiswa kedokteran untuk blok gizi (PjBL; topik 1000 HPK dan kewirausahaan), dengan niat menjadi **produk nyata** untuk kader dan keluarga, kelak diajukan ke kompetisi inovasi kesehatan. Diverifikasi oleh dosen ahli gizi. Dikembangkan dengan audit independen pada tiap langkah.

## Status dan dua profil
| Profil | Isi | Dampak desain |
|---|---|---|
| **demo** | Kasus preset tetap, tanpa teks bebas, tanpa ekspor, tanpa riwayat. Label pada setiap keluaran: *"Prototipe PjBL — belum diverifikasi dosen; bukan pengganti petugas kesehatan"*, juga tertanam di tangkapan layar/cetak | Dipakai di presentasi dan peragaan; harus tetap memikat walau masukannya terbatas |
| **lapangan** | Data nyata, consent, penyimpanan lokal, ekspor, mode kader, tindak lanjut. **Terkunci** sampai izin etik/institusi dan tanda tangan dosen ada | Antarmuka penuh; harus terasa tenang walau menangani data sensitif |

Satu sistem desain harus melayani kedua profil.

## Nada yang kami harapkan (bukan gaya visual)
Tenang, hangat, tepercaya, tidak menghakimi, tidak menggurui; memberi rasa "saya mengerti" tanpa membanjiri; di saat darurat tegas tanpa menimbulkan panik. Hindari kesan klinis yang dingin dan kesan "gamifikasi" yang membuat ibu merasa dinilai.

## Tahap pembangunan (supaya Anda tahu apa yang nyata dan apa yang proyeksi)
- **Sekarang (M1):** anak 6–23 bulan: profil → status gizi → contoh pola makan → kecukupan → jejak/sumber (Mode Ahli) → peringatan keselamatan.
- **Berikutnya:** ibu hamil/menyusui; instrumen kegunaan (kuesioner, SUS); pelacak TTD; paspor pangan anak; linimasa 1000 hari.
- **Nanti:** skrining dan radar pertumbuhan untuk kader, tindak lanjut, harga dan ketersediaan lokal, dasbor desa, penjelas AI, bahasa daerah, suara, serah-terima data via QR. Lihat `06_`.
