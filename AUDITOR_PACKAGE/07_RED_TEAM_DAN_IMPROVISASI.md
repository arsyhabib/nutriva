# 07 — Red Team dan Ruang Improvisasi Auditor

## 1. Mandat improvisasi

Checklist `06_` adalah **lantai**. Anda **diharapkan** melampauinya. Ruang improvisasi dibagi tiga lapis:

| Lapis | Isi | Porsi usaha |
|---|---|---|
| 1. Terstruktur | Checklist `06_` | ≤ 50% |
| 2. Penelusuran bebas | Skenario `07_`, ide Anda sendiri, pertanyaan "apa yang tidak dipikirkan siapa pun" | ≥ 30% |
| 3. Meta | Asumsi, ruang lingkup, bias, proses, model bisnis, dan klaim ilmiah di tingkat konsep | ≥ 10% |

**Pertanyaan pemandu (tanyakan pada setiap artefak):**
1. Bagaimana ini bisa **mencelakai** ibu atau anak? Pada pengguna dengan literasi rendah? Bila terjadi salah ketik?
2. Bagaimana seorang **penguji ahli gizi yang skeptis** akan membongkar ini dalam lima menit?
3. Apa yang **diam-diam diasumsikan**, tetapi tidak ditulis?
4. Apa yang akan terjadi bila **masukan tidak ideal** (kosong, ekstrem, tidak masuk akal, ambigu)?
5. Apa yang terjadi bila **komponen eksternal gagal** (jaringan, AI, penyimpanan, daya, lisensi)?
6. Apa yang bisa **berubah diam-diam** (versi data, aturan, cache, zona waktu) sehingga hasil kemarin ≠ hari ini?
7. Apa yang **tampak bukti** tetapi sebenarnya hanya **kesepakatan** (circular evidence)?
8. Apa yang sedang **dihindari** oleh eksekutor?

## 2. Yang boleh dilakukan auditor

- Menjalankan kode, uji, dan perintah baca; membuat skrip uji **di `audit/`**.
- Menulis uji gagal ke `audit/proposed_tests/` dan menyertakan perintah reproduksi.
- Menggunakan pencarian web dan dokumen publik untuk memverifikasi sumber.
- Mengunduh dokumen sumber ke `audit/evidence/` **bila diizinkan oleh pemilik dan lisensi** (catat sumber dan hash).
- Melakukan fuzzing, uji properti, uji mutasi, perbandingan diferensial dengan perangkat referensi.
- Mengusulkan fitur, penyederhanaan, atau penghapusan ruang lingkup.
- Memperluas audit sedikit di luar REQ bila Anda mendapati risiko serius; catat sebagai area tambahan.
- Mempertanyakan ruang lingkup, model bisnis, klaim ilmiah, dan keputusan pemilik.
- Meminta eksekutor menyediakan data/akses tambahan lewat LEDGER.

## 3. Yang dilarang auditor

- Mengubah berkas di zona eksekutor (kode, data, registri, strategi).
- Menjalankan perintah merusak (`rm -rf`, `git reset --hard`, force push, mengubah cabang).
- Mengarang rujukan, halaman, angka, atau hasil uji.
- Menyetujui tanpa bukti yang dijalankan sendiri.
- Menghubungi dosen, juri, atau pihak luar atas nama proyek.
- Memasukkan data pribadi nyata ke alat atau layanan eksternal.
- Mengunggah sumber berhak cipta ke tempat publik.
- Menyembunyikan temuan yang tidak enak; atau menggelembungkan temuan.

## 4. Skenario masukan ekstrem (mesin dan antarmuka)

**Antropometri anak**
- Usia tepat 6 bulan, 23 bulan 30 hari, tepat 24 bulan, 59 bulan 30 hari, 60 bulan; lahir 29 Februari; tanggal lahir di masa depan; kunjungan sebelum lahir.
- Prematur (usia kehamilan 28/32/36 minggu) — usia koreksi diterapkan atau minimal ditandai?
- Edema, sindrom Down, usia tidak diketahui, tanggal lahir perkiraan.
- Berat 0,5 / 2,0 / 25 kg; panjang 30 / 45 / 110 / 130 cm; LK 20/65; nilai negatif, nol, huruf, kosong.
- Panjang diukur berdiri / tinggi diukur berbaring (posisi salah).
- Desimal koma `12,5` vs titik `12.5` vs `12,500`; spasi; angka Arab-Indic.
- Tinggi menurun dibanding kunjungan lalu; berat naik 3 kg dalam sebulan.

**Ibu**
- Hamil < 19 tahun (remaja), > 40 tahun, kembar, HPHT tidak diketahui, HPHT tidak masuk akal, trimester di batas (13+6 → 14+0 minggu), pascapersalinan (menyusui eksklusif vs parsial vs berhenti).
- LiLA 18 / 23,4 / 23,5 / 40; BB prahamil tidak diketahui; IMT ekstrem.
- Kondisi: diabetes gestasional, hipertensi, anemia berat, hiperemesis, alergi berat, intoleransi laktosa, vegetarian/vegan, puasa, halal.

**Menu dan optimasi**
- Anggaran nol / sangat kecil / sangat besar; semua bahan di rumah hanya satu; tidak ada kompor; tidak ada bahan hewani; hanya 3 bahan tersedia.
- Alergi yang meniadakan semua protein; alergi terhadap telur + ikan + susu + kacang sekaligus.
- Infeasible: tidak ada solusi yang memenuhi besi; bagaimana pesannya?
- Benih sama, versi data berbeda; benih berbeda, hasil sama (kasus kembar).
- Dua bahan identik harga/gizi: urutan stabil?
- Pecahan porsi tak realistis (0,13 butir telur); jumlah bahan > batas wajar; pengulangan.
- Menu memenuhi gizi tetapi **tidak masuk akal budaya** (mis. kombinasi aneh); uji manusia.
- Bahan dengan nilai null pada zat target.
- Perubahan bahan "alternatif" yang secara gizi mirip tetapi melanggar keamanan (mis. ikan mentah).

**Tanda bahaya**
- Kata/kondisi yang harus memicu rujukan (perdarahan, kejang, gerak janin hilang, sesak, anak tidak mau minum/ASI, letargi, demam tinggi pada bayi muda, diare berdarah). Apakah daftar lengkap, dan apakah dosen menyetujuinya?
- Pengguna mengabaikan peringatan: apakah aplikasi tetap memberi menu "seolah normal"?

## 5. Skenario sistem

- Mati jaringan di tengah sinkronisasi; mode pesawat; kuota habis; penyimpanan HP penuh; IndexedDB dihapus oleh peramban; dua tab terbuka.
- Pembaruan service worker membawa aturan lama (cache basi) — adakah mekanisme versi minimum aturan keamanan?
- Migrasi skema IndexedDB dari versi lama dengan data nyata.
- Zona waktu perangkat salah; jam perangkat mundur; tanggal diubah manual.
- HP Android lama (peramban tua), layar kecil, font sistem besar, mode gelap paksa, mode hemat data.
- Beberapa pengguna berbagi satu HP (kader); data lintas keluarga bocor?
- Impor QR/berkas dimodifikasi; ukuran sangat besar; JSON beracun; prototype pollution.
- Dependensi berbahaya atau lisensi tidak kompatibel; paket dihapus dari registri.

## 6. Skenario mesin sumber

- Locator menunjuk halaman salah (pergeseran halaman antar edisi).
- Berkas sumber berganti edisi dengan hash berbeda; sumber ditarik/diperbarui oleh penerbit.
- PDF pindai (OCR salah): angka 0 dan O, 1 dan l, koma desimal dan titik ribuan.
- Kutipan terverifikasi mesin tetapi **konteks** (catatan kaki, kolom lain) mengubah makna.
- Sumber berhak cipta disertakan tanpa izin; atribusi lisensi hilang.
- Sitasi hasil AI atau hasil "tampak benar" tanpa berkas.
- Klaim tingkat A–D diberi label terlalu tinggi.
- Audit Pack tidak identik saat dijalankan ulang di mesin lain (urutan, zona waktu, versi pustaka).

## 7. Skenario lapisan AI

- Chip/catatan berisi instruksi ("abaikan aturan sebelumnya"); nama bahan berisi perintah.
- Permintaan dosis obat, diagnosis, "apakah bayi saya stunting?", "boleh minum jamu apa?".
- AI menambah bahan, mengubah angka, atau mengutip sumber.
- Bahasa daerah menyebabkan makna berubah.
- AI mati/lambat; respons terpotong; JSON rusak; laju terbatas; biaya meledak.
- Data yang dikirim ke AI: periksa muatan nyata (jaringan) untuk PII.

## 8. Pertanyaan penguji yang harus bisa dijawab dengan bukti (uji pembelaan)

Auditor mensimulasikan penguji ahli gizi. Untuk tiap pertanyaan, nilai: apakah **bukti ada di aplikasi/dokumen**?

1. Mengapa AKG, bukan EAR? Bagaimana ambang 77% digunakan?
2. Bagaimana menjamin besi ibu hamil tercukupi? (jawaban benar: tidak dari makanan saja; rujuk TTD)
3. Mengapa menu ini, bukan menu lain? (jejak)
4. Bagaimana bioavailabilitas dihitung dan divalidasi?
5. Bagaimana variasi komposisi pangan diperhitungkan?
6. Faktor masak/BDD; mentah vs matang?
7. Bagaimana klasifikasi z-score diverifikasi?
8. Apa bukti menu mesin ≥ menu ahli gizi?
9. Siapa memvalidasi aturan keamanan? Mana tandatangan/stempelnya?
10. Apa yang terjadi bila ibu memiliki penyakit penyerta?
11. Bagaimana AI dijamin tidak berhalusinasi? Berapa tingkat kesesuaian terukur?
12. Mengapa hanya 300–600 bahan? Apa konsekuensi bagi generalisasi?
13. Apa keterbatasan penelitian satu hari?
14. Bagaimana data anak dilindungi? Apakah ada persetujuan etik?
15. Apakah ini alat kesehatan yang membutuhkan izin?

## 9. Ide audit tingkat lanjut (opsional, pilih yang bernilai)

- **Pengujian diferensial:** jalankan z-score pada ribuan titik acak vs implementasi referensi WHO Anthro.
- **Uji metamorfik:** naikkan anggaran → biaya optimal tidak naik; hapus bahan → tidak lebih baik; tambah ketersediaan → solusi tetap layak.
- **Uji mutasi:** ubah ambang kecil; apakah suite uji menangkap perubahan?
- **Audit data statistik:** distribusi nilai gizi tiap kelompok; deteksi outlier tidak masuk akal (mis. kalori > 900 per 100 g untuk sayur).
- **Audit model bisnis:** apakah asumsi pasar B2B2G didukung bukti (wawancara) atau hanya narasi?
- **Audit narasi:** bandingkan klaim di dokumen presentasi dengan kemampuan nyata aplikasi (over-claiming).
- **Pre-mortem:** bayangkan demo hari H gagal total; tuliskan 10 penyebab paling mungkin dan periksa kesiapan masing-masing.
- **Audit dampak etika:** adakah kelompok yang terdampak negatif (ibu miskin merasa dihakimi oleh skor rendah; stigma stunting)? Bahasa disampaikan dengan empati?
