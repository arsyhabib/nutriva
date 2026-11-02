# 06 — Proyeksi: Sistem yang Harus Mampu Tumbuh

Aplikasi akan terus bertambah: mode baru, fitur baru, pengguna baru, perangkat baru, bahasa baru. Kami ingin kanvas yang sejak awal **punya ruang** untuk itu, sehingga fitur masa depan terasa *tumbuh dari dalam* sistem, bukan ditempel.

## Cara aplikasi tumbuh (kenyataan arsitektur yang berdampak ke desain)
- **Modul terdaftar:** tiap fitur adalah modul yang masuk lewat titik kaitan tetap pada alur "profil → kebutuhan → penyaringan keselamatan → pemilihan → peringkat → penjelasan". Desain yang baik menyediakan **titik kaitan visual** yang sama: tempat baru untuk satu modul tanpa menggeser yang lama.
- **Mode:** hari ini satu (anak 6–23 bulan); segera ibu hamil, ibu menyusui; lalu 24–59 bulan; lalu peran (keluarga vs kader).
- **Profil rilis:** `demo` dan `lapangan`; kelak juga mode presentasi dan mode kios.
- **Lapisan bukti selalu ada:** apa pun fiturnya, ia punya jejak dan sumber.
- **Versi aturan:** hasil selalu bertanda versi; aturan keselamatan bisa kedaluwarsa dan harus diperbarui.

## Peta kemungkinan pertumbuhan (rancang ruangnya; detailnya boleh sangat Anda tentukan)
| Arah | Contoh yang akan datang | Tantangan desain yang kami sadari |
|---|---|---|
| **Lebih banyak orang** | ibu hamil, menyusui, balita 24–59 bln, kader, bidan, kepala desa | satu sistem, banyak "kepribadian" tanpa pecah |
| **Lebih banyak kedalaman** | Mode Ahli, jejak interaktif, perbandingan standar, analisis kepekaan ("kalau anggaran naik Rp 2.000?") | kedalaman tanpa membebani pengguna biasa |
| **Lebih banyak waktu** | linimasa 1000 hari, pelacak kebiasaan, tren pertumbuhan, riwayat | menampilkan waktu tanpa rasa dikejar |
| **Lebih banyak data** | harga & ketersediaan lokal, peta bahan, dasbor desa | agregat yang manusiawi, bukan papan skor |
| **Lebih banyak cara masuk** | suara, gambar/ikon, bahasa daerah, QR, cetak | literasi rendah, tunanetra, tanpa internet |
| **Lebih banyak kecerdasan** | penjelas AI dengan pilihan tindak lanjut | kejujuran asal-usul: mana hitungan, mana penjelasan |
| **Lebih banyak perangkat** | tablet kader, proyektor, layar kios, kartu cetak | satu bahasa visual dalam banyak ukuran dan cahaya |
| **Lebih banyak bahasa dan budaya** | Jawa, Sunda, dll.; pantangan/kebiasaan makan setempat | teks lebih panjang/pendek; ikon yang tidak salah arti |

## Yang kami harapkan dari "sistem" Anda
- Bahasa visual dan **bahasa gerak** yang dapat diperluas tanpa kehilangan jati diri.
- Cara menyatakan **status** (aman / perlu perhatian / segera / tidak ada data / belum diverifikasi) yang tidak bergantung pada warna dan tidak menghakimi, dan dapat tumbuh bila status baru muncul.
- Cara menampilkan **angka dan kecukupan** yang bermakna bagi non-ahli, namun tetap jujur bagi ahli.
- Cara menampilkan **asal-usul** (sumber, asumsi, versi) yang terasa seperti bagian dari keindahan, bukan catatan kaki.
- Satu cara menangani **momen darurat** yang konsisten di semua mode.

## Pertanyaan pemicu (boleh diabaikan sama sekali)
Ini bukan arahan, hanya batu loncatan jika Anda ingin memulai dari pertanyaan:
- Seperti apa rasanya **kecukupan** jika tidak berbentuk batang kemajuan atau lingkaran persentase?
- Bagaimana **ketidakpastian** dan **"belum ada data"** bisa tampak indah dan jujur, bukan seperti kerusakan?
- Bagaimana **jejak perhitungan** bisa menjadi sesuatu yang ingin dijelajahi?
- Bagaimana **rujukan darurat** bisa tegas sekaligus menenangkan?
- Bagaimana satu desain terbaca di bawah **matahari** dan tetap cantik di **proyektor** ruang gelap?
- Bagaimana **gerak** menunjukkan *sebab-akibat* (mengganti bahan → kecukupan bergeser) tanpa menjadi pertunjukan?
- Apa yang **belum pernah** dilakukan aplikasi gizi mana pun, namun masuk akal di tangan seorang kader di tenda posyandu?
