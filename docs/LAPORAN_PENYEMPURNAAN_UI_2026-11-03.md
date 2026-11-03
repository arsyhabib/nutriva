# Laporan penyempurnaan UI, 2026-11-03

Ringkasan perubahan dan hasil uji. Pemilik yang melakukan commit.

## Perubahan
1. Teks: "gerbang konteks" dihapus; "kasus sintetis" menjadi "contoh hasil penggunaan" (Contoh 1/2/3); "dosen penguji" menjadi "mode ahli". Pita peringatan prototipe dan kata "dosen/verifikasi" tidak tampil di UI maupun PDF.
2. Navigasi: setiap layar punya entri riwayat (`#id`); tombol kembali peramban/gestur ponsel mundur satu layar, lembar menutup lebih dulu. Panah kiri/kanan di bilah status dan tombol keyboard panah.
3. Pengaturan: penanda aktif kini ikut berpindah (isi lembar dibangun ulang tiap render, bukan salinan statis).
4. AI: kolom kunci API milik pengguna; penyedia bawaan OpenRouter, model bawaan Haiku 5.5; uji kunci; keluaran tetap melewati validator; jatuh ke templat bila gagal.
5. Render AI: mesin markdown aman (judul, daftar bersarang, tabel, kutipan, kode, coret, garis, tautan dinetralkan).
6. Merek: logo vektor tetesan nektar dengan huruf N, ikon PWA, tanda "E.13.1".
7. Ekspor PDF: enam templat A4 (laporan lengkap, status, menu dan belanja, gizi, kartu, jejak klaim) dengan kaki halaman bernomor.
8. Gerak: transisi tombol 380 ms, umpan tekan, ikon navigasi aktif; mati otomatis pada hemat gerak.

## Hasil uji (2026-11-03)
- `npx tsc --noEmit` bersih; `npx vitest run` 468 lulus; bundel 613 KiB dari batas 1536 KiB.
- e2e smoke 1681 lulus; e2e adaptif 1323 lulus dan satu kegagalan nyata (Escape di kolom isian tidak menutup lembar) sudah diperbaiki.

## Belum diuji / catatan
- Perangkat fisik dan pembaca layar belum diuji. Worker belum dideploy. Panggilan OpenRouter sungguhan belum diuji (hanya tiruan jaringan, tanpa kunci).
- Kunci yang pernah ditempel di percakapan harus dicabut dan diganti oleh pemilik.

## Tambahan sore hari (2026-11-03): data sendiri, resep AI, ekspor Ultimate

1. **Validator penjelas AI**: kosakata wajar (sapaan, "si kecil", "proporsi", dll.) tidak lagi ditolak; angka, kata terlarang, status, dan rujukan tetap ketat. Alasan penolakan ditampilkan ramah di UI.
2. **Mode data sendiri**: beranda "Isi data anak Anda"; label "Data Anda"; nilai awal ditandai belum diisi sampai usia, berat, dan panjang diganti dengan nilai sah (atau dikonfirmasi); pantangan dan tanda bahaya contoh tidak terbawa; ekspor dikunci selama belum diisi. Tanpa nama, tanpa tanggal lahir, tanpa penyimpanan.
3. **Resep AI + ilustrasi**: satu klik, teks dan gambar diminta bersamaan (`Promise.all`) dan tampil bersamaan. Bahan dan gram dari mesin; validator resep ketat (bahan di luar daftar, bumbu, gram terikat per bahan, menit 5 sampai 45, klaim manfaat, negasi ketat); gagal-aman ke resep cadangan; gambar diperiksa (data URL, tipe, ukuran) dan dibatasi 8 resep per sesi.
4. **Ekspor**: bagian baru Ringkasan sesi, Resep dan ilustrasi AI, Penjelasan sederhana; pilihan cepat **Ultimate**; tombol "Unduh PDF" per resep; sampul, daftar isi bernomor halaman.
5. Audit independen (Sonnet) menemukan 2 kritis dan beberapa tinggi/sedang; yang kritis dan tinggi sudah diperbaiki (lihat tes `tests/ai-resep.test.ts`). Belum diuji: panggilan sungguhan ke OpenRouter (endpoint gambar dan parameter `output_format` mengikuti dokumentasi yang dibaca, belum dicoba dengan kunci nyata), perangkat nyata, pembaca layar.

## Kunci bawaan tersamar
Jalankan di komputer Anda: `npm run kunci:pasang` (ketik kunci, tidak tampil), lalu `npm run check && npm run build`, commit dan push. Ganti harian: ulangi perintah yang sama. Cabut: `npm run kunci:pasang -- --hapus`. Penyamaran hanya menghindarkan pemindai teks; keamanan sebenarnya ada pada batas kredit kunci di OpenRouter.

## Tambahan malam: ketahanan AI, kunci tegak, perbaikan hasil audit

- **AI konsisten dan stabil.** Penyebab "tidak merespons" adalah batas waktu 12 detik tanpa percobaan ulang (gangguan sesaat langsung jatuh ke teks cadangan), galat penyedia yang datang bersama status 200 yang tidak dibaca, dan jawaban kosong. Penyebab "terpotong" adalah ruang keluaran sempit (800 dan 1400 token) dan penalaran model yang ikut memakan jatah, sementara penyaring yang dimatikan tidak lagi membuang jawaban terpotong. Penyebab "hanya gambar" adalah resep yang gagal sementara jatuh ke resep cadangan sedangkan gambar lolos. Semuanya ditangani di `src/ai/transport.ts` (lihat CLAUDE.md).
- **Resep tampil lebih dulu**, gambar menyusul; tombol ulang resep dan ulang gambar berdiri sendiri.
- **Kunci tegak ponsel** (`src/ui/orientasi.ts`) dan manifest `portrait`.
- **Watermark** "Developed by E.13.1 Feat H.A?128".
- **Hasil audit independen yang diperbaiki:** fokus hilang antarkolom data anak (render kini menunggu penunjuk dilepas), penolakan angka tidak murni (`9abc`, `1e1`) dengan pesan, pengingat "Periksa kembali ukuran" untuk indikator ekstrem, kartu poster A4 yang terpotong, kontras tombol reset di tema Dekap, watermark pecah di nav sempit, hasil permintaan AI basi yang menahan tombol, jatah AI bawaan yang tidak menghitung percobaan ulang.
- **Belum teruji:** panggilan nyata ke OpenRouter (semua jaringan dalam uji ditiru), kunci orientasi di perangkat fisik (iPhone dan Android), pembaca layar.
