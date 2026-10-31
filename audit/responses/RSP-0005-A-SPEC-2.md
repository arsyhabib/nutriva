# RSP-0005 — Tanggapan atas RPT-0005 (A-SPEC-2)

- **Tanggal:** 2026-10-28 · **Penulis:** Eksekutor · Menunggu verifikasi ulang pada REQ-0006 (gerbang M0)

Vonis M0 **LAYAK BERSYARAT diterima**. Pemilik kemudian memutuskan **Opsi B** (aplikasi mampu menangani data nyata; etik diurus bersama dosen nanti) dan meminta cakupan tidak dikurangi. Saya menerjemahkannya sebagai **dua profil build dengan penguncian teknis** (lihat `KEPUTUSAN_DAN_JALUR_RILIS.md` v3 §0); itu mengubah sebagian jawaban saya pada RPT-0005, dicatat di bawah.

## Penafsiran syarat M0 (mohon dikonfirmasi auditor)
RPT-0005 §10 menyebut M0 "boleh dimulai bila semua syarat terpenuhi dan bukti diserahkan". Syarat 2–7 adalah **hasil kerja M0 itu sendiri** (git, .gitignore, verifikator, ADR, pembekuan tag). Saya menafsirkannya sebagai **definisi selesai M0**, bukan prasyarat yang harus ada sebelum satu baris pun ditulis; M0 tidak memuat fitur maupun data. Bukti diserahkan sebagai REQ-0006 sebelum M1a. Jika auditor menilai tafsiran ini keliru, mohon sebut di RPT-0006 (belum ada kode fitur yang akan hilang).

## Tanggapan per temuan

| Temuan | Sikap | Tindakan |
|---|---|---|
| AUD-0005-01 (S0) label "sintetis" oleh pengguna | **Diterima** | Profil `demo`: preset tetap, nilai dikunci, tanpa angka bebas. Profil `lapangan`: terkunci oleh otorisasi (v3 §0.3) |
| AUD-0005-02 (S0) teks bebas | **Diterima** | `demo`: tanpa teks bebas (pilihan tertutup). `lapangan`: kolom teks bebas tidak ada pada M1; kode partisipan dibuat sistem |
| AUD-0005-03 (S1) ekspor dinyalakan pengguna | **Diterima** | `demo`: ekspor dimatikan (hanya gambar/cetak berlabel). `lapangan`: ekspor mengikuti consent |
| AUD-0005-04 (S0, residual) tangkapan layar | **Diterima sebagai residual** | Label tertanam; preset tidak menyerupai pola anak nyata; dicatat |
| AUD-0005-05 (S1) origin bersama | **Diterima** | ADR-0003: origin berbeda per profil; uji pada M0/M1b |
| AUD-0005-06 (S1) URL/log | **Diterima** | Tidak ada keadaan masukan di URL; uji |
| AUD-0005-07 (S0) fixture dari sumber nyata | **Diterima** | M0: lint fixture (wajib `sintetis: true`, tolak kunci identitas), `.gitignore` untuk `sumber/`, tinjauan auditor |
| AUD-0005-08 (S1) formulir umpan balik | **Diterima** | Formulir tanpa pertanyaan tentang anak; F-series dikerjakan di M2 dengan persetujuan |
| AUD-0005-09 (S2) autosave | **Diterima** | `demo`: tidak ada draf/riwayat; `lapangan`: draf terenkripsi/terhapus saat sesi berakhir (uji M2) |
| AUD-0005-10 (S1) F03/F04/B07 di M5 | **Diterima** | F01–F04 dan B07 dimajukan ke M2 |
| AUD-0005-11 (S2) kuasi-identifikasi ekspor | **Diterima** | Selaras dengan -03 |
| AUD-0005-12 (S1) J13 vs K-05; definisi rilis | **Diterima** | v3 §0.6–0.7 |
| AUD-0005-13 (S2) hygiene cakupan | **Diterima** | A02/A03 baris campuran diberi penanda "M1: anak / M2: hamil-menyusui" dan build M1 membatasi; J05 tetap P1 tetapi ber-tag M1b dengan catatan ambang performa ditetapkan di M0 |
| AUD-0005-14 (S1) A12 dan A19 | **Diterima** | A12 di M1 memakai kelas harga statis dari data A06 (tanpa I01/I02); A19: tekstur dari sumber yang sudah dibaca saja; frekuensi MMF tidak ditampilkan sampai terverifikasi |
| AUD-0005-15 (S0) keselamatan M1 bergantung aturan belum primer | **Diterima** | Default aman: ragu/tanda bahaya tak dikenali → "bawa ke petugas kesehatan hari ini", tanpa menu; label "belum diverifikasi"; berkas primer diminta dari pemilik |
| AUD-0005-16 (S1) T-06 | **Diterima** | Kriteria data M1a ditambah: konversi RAE→RE dan folat bersumber, retensi dibuka sebelum diklaim, padanan ≥ 90% atau daftar tanpa padanan, hash+tanggal rilis USDA, atribusi |
| AUD-0005-17 (S3) | Ditutup | — |

## Jawaban pertanyaan auditor (§14)
1. Build tanpa input bebas dan tanpa ekspor per profil: ya, melalui profil `demo` (flag build). Usaha tambahan kecil karena mengurangi fitur, bukan menambah.
2. J13 untuk `demo`: persetujuan pembimbing + label; dosen sebelum otorisasi `lapangan` (v3 §0.7).
3. "Rilis" B11: v3 §0.6; peragaan preset terdampingi bukan rilis.
4. Folder `sumber/`: baru dibuat; pemilik belum menyerahkan berkas (diminta).
5. Origin berbeda per profil: bergantung hosting yang belum dipilih; dicatat sebagai syarat ADR-0003 dan diuji sebelum rilis.

## Hal yang berubah dari jawaban saya sebelumnya
RSP-0004 menyatakan "Opsi A: tanpa data nyata di V-PJBL". Pemilik memilih Opsi B; Opsi A tetap menjadi profil `demo`, dan data nyata hanya melalui profil `lapangan` yang terkunci otorisasi.
