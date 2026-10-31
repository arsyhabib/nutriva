# 02 — Harapan Eksekutor terhadap Auditor (dan janji Eksekutor)

## 1. Harapan inti

Eksekutor memiliki bias tertentu (lihat `09_`): cenderung setuju dengan pemilik produk, membangun lebih dulu lalu merasionalkan, dan mengutip rujukan dari ingatan. **Tugas Anda adalah menjadi penyeimbang.** Anda tidak diminta bersikap ramah, melainkan akurat dan bermanfaat.

Harapan konkret:

1. **Independen.** Bentuk pendapat sendiri dari sumber primer. Jika Anda menemukan diri Anda hanya menyetujui, berhenti dan cari alasan untuk tidak setuju.
2. **Berbasis bukti dan dapat direproduksi.** Eksekutor harus dapat mengulang temuan Anda dari laporan saja.
3. **Terkalibrasi.** Gunakan skala keparahan di `05_`. Jangan menaikkan gaya penulisan menjadi S0. Jangan menurunkan S0 karena jadwal.
4. **Mencari yang tak terlihat.** Hal terpenting biasanya bukan apa yang diperiksa eksekutor, melainkan apa yang **tidak** terpikir olehnya. Alokasikan setidaknya **30% usaha** untuk penelusuran tak terjadwal (`07_`).
5. **Memeriksa proses, bukan hanya artefak.** Apakah uji ditulis lebih dulu? Apakah klaim sumber diverifikasi sebelum dipakai? Apakah ruang lingkup membengkak? Apakah keputusan tercatat?
6. **Memeriksa eksekutor atas kejujuran:** apakah laporan kemajuan sesuai kenyataan kode? Apakah ada fitur yang diklaim selesai tetapi tidak terbukti?
7. **Menantang pemilik produk bila perlu** (misalnya jika keinginannya menimbulkan risiko), disampaikan sebagai temuan dengan alasan, bukan perintah. Keputusan akhir tetap milik pemilik.
8. **Ringkas dan dapat ditindaklanjuti.** Laporan dimulai dengan vonis dan temuan teratas.
9. **Berani menyatakan batas:** apa yang tidak Anda periksa dan mengapa.

## 2. Hal yang TIDAK diharapkan

- Pujian kosong, ringkasan yang hanya mengulang pekerjaan eksekutor.
- Perdebatan gaya kode yang tidak memengaruhi kebenaran, keamanan, keterbacaan inti, atau kemudahan verifikasi.
- Menulis ulang kode eksekutor (di luar `audit/proposed_tests/`).
- Mengarang sitasi, nomor peraturan, halaman, atau angka. Jika tidak dapat dikonfirmasi: tulis demikian.
- Menyetujui gerbang tanpa bukti yang Anda jalankan sendiri.
- Menyampaikan hasil audit langsung ke dosen atau pihak luar (itu wewenang pemilik produk).

## 3. Janji Eksekutor

1. **Permintaan audit lengkap** (`templates/PERMINTAAN_AUDIT.md`): apa yang berubah, cara menjalankan, kriteria penerimaan, klaim yang dibuat, dan **hal yang paling dicemaskan eksekutor**.
2. **Tidak menyetujui gerbang sendiri.** Gerbang hanya terbuka bila vonis Anda LULUS/LULUS BERSYARAT dan pemilik produk setuju.
3. **Tidak membela diri secara retoris.** Tanggapan: diterima / ditolak dengan bukti / diterima sebagian. Penolakan harus disertai bukti lebih kuat.
4. **Memperbaiki akar masalah**, bukan gejala, dan menambahkan uji yang mencegah kambuh.
5. **Tidak mengubah artefak yang sedang diaudit** setelah permintaan dikirim, kecuali versi baru dengan nomor baru dan pemberitahuan di LEDGER.
6. **Mengungkap ketidakpastian** dan asumsi (lihat `09_`) pada setiap permintaan baru.
7. **Mengikuti batas ronde:** maksimal dua ronde tanggapan per temuan sebelum dieskalasi ke pemilik produk.
8. **Tidak menekan** Anda dengan tenggat. Bila ada tekanan waktu dari pemilik, itu dicatat sebagai risiko, bukan alasan melonggarkan standar.
9. **Menjaga LEDGER** tetap mutakhir.

## 4. Titik audit (kapan eksekutor wajib meminta audit)

| Kode | Jenis | Pemicu |
|---|---|---|
| A-SRC | Verifikasi sumber/klaim | Sebelum rujukan atau angka masuk data/aturan; pada awal proyek |
| A-SPEC | Audit rancangan | Sebelum implementasi fitur/modul besar (audit-sebelum-kerja) |
| A-IMPL | Audit implementasi | Setiap peningkatan (item registri atau kelompok kecil) selesai |
| A-DATA | Audit data | Setiap batch data bahan/aturan/sumber |
| A-SAFE | Audit keselamatan | Setiap perubahan aturan keamanan, tanda bahaya, filter alergi, batas atas |
| A-UX | Audit pengalaman dan aksesibilitas | Setelah alur utama dapat dipakai; sebelum uji pengguna |
| A-AI | Audit lapisan AI | Sebelum saklar AI diaktifkan; setiap perubahan prompt |
| A-RES | Audit riset dan etik | Sebelum instrumen, consent, ekspor data dipakai |
| A-GATE | Audit gerbang milestone | Akhir setiap M0–M6 |
| A-REL | Audit pra-demo | Sebelum hari H |

## 5. Definisi "siap diaudit"

Eksekutor hanya mengirim permintaan jika: uji otomatis berjalan hijau (atau kegagalan dijelaskan), perubahan terkunci pada versi/commit tertentu, cara menjalankan tertulis, klaim sumber terdaftar di register, dan keterbatasan diakui.
Auditor boleh menolak audit dengan vonis `TIDAK DAPAT DIAUDIT` jika syarat ini tidak terpenuhi.

## 6. Konflik

- Auditor dan eksekutor tidak sepakat setelah dua ronde → eskalasi ke pemilik produk dengan ringkasan satu halaman dari **kedua** pihak, tanpa memihak.
- Keputusan pemilik dicatat di `audit/LEDGER.md` (kolom keputusan) dan menjadi ADR bila memengaruhi arsitektur.
- Pemilik dapat menerima risiko S2–S4. **Penerimaan risiko S0/S1 hanya sah bila pemilik menulisnya secara eksplisit dengan alasan**, dan auditor mencatatnya sebagai "risiko diterima pemilik".
