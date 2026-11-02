# Laporan penyempurnaan NUTRIVA Rona (2026-11-02)

Dasar: port Rona buatan Antigravity di repo `arsyhabib/nutriva`. Tidak ada desain baru; seluruh DNA Rona dipertahankan (palet Susu Oat, 4 tema, 3 peran, kaca/optik, SutraField, bejana cair, tetesan Bezier, lembar bawah, meter SD, Mode Ahli, kartu bagikan, 18 layar/keadaan, hemat gerak, teks besar).

## Akar masalah yang terbukti
1. **Bejana glitch**: solver gelombang lama menjadi NaN pada bingkai lambat (dt 45 ms), lalu pengait try/catch ticker mencabut tugasnya, sehingga bejana macet atau bergaris. Diganti `langkahGelombang` (substep tetap 1/240 s, redaman per-substep, batas ±24, dt dijepit). Ticker kini mencabut tugas hanya setelah 5 galat beruntun.
2. **Kedip**: `render()` membongkar seluruh cangkang tiap perubahan (kanvas latar dan pegas bejana mulai dari nol). Kini cangkang dan kanvas latar persisten; hanya wilayah dinamis diganti; bejana bergerak mulus dari nilai lama; animasi masuk hanya saat pindah layar; posisi gulir dipertahankan.
3. **Angka/klaim karangan** dibuang: strata ASI (45%, 3%, 55% dst.), rentang "variasi alami" ±10%, takaran "~2 sdm", jam makan, nama variasi, angka AKG hardcode, tombol 119 dan langkah P3K tanpa sumber, alasan rujukan yang dikarang saat tidak ada, alergen "udang" (tidak dikenal mesin).
4. **Kebocoran UI pengembang**: dock 18 layar, "Kontrol & Layar", kode A1..K10, kode alasan mentah. Diganti sheet **Pengaturan** (kasus, 4 tema, animasi/hemat gerak, teks besar, layar penuh, peran, tentang, reset; keadaan khusus untuk peninjau di dalam `<details>`). Kode mentah hanya di Mode Ahli.
5. **PWA/hosting**: path absolut menyalahi GitHub Pages; SW tidak menyimpan aset berhash (luring pertama gagal, terbukti di uji); `_headers` tidak dibaca GitHub Pages. Diperbaiki: path relatif, SW memprakirim JS/CSS/font, `ignoreVary`, CSP meta saat build, ikon PNG.

## Desain
Tipografi Plus Jakarta Sans (isi, judul) + Instrument Serif italic (aksen), berkas woff2 (CSS 218 → 44 kB). Hierarki tiga tingkat: satu kartu sorot dan satu tombol utama per layar, kartu isi datar, keterangan redup. Tombol 48 px+, gradien, umpan balik tekan. Orb latar diredam dan di belakang kartu. Header satu baris.

## Pengujian
- `npm run check`: tipe, uji unit (termasuk `fisika-stabil` 11 uji, `ui-jujur` 23 uji: larangan klaim karangan pada 3 kasus × 3 peran × 18 layar, kontras WCAG 4 tema, alergen dikenal mesin, tanpa Math.random/eval), klaim, fixture.
- `npm run e2e` (Chromium nyata): 1678 butir: 5 viewport × 3 kasus × 4 tema × 9 layar (tanpa gulir horizontal, label prototipe, tema), 18 layar tidak kosong, target sentuh ≥48 px, bejana hidup pada CPU ×1/×4/×8, kanvas persisten, luring (SW + font), 200 aksi acak. Hasil: 0 gagal.
- Bundel `dist/` 465 KiB dari batas 1,5 MiB.

## Perubahan keputusan yang perlu dikonfirmasi pemilik
- K-13 (tanpa blok fisika) dilampaui atas permintaan pemilik: fisika disertakan.
- D-1: formulir profil memperbolehkan angka bebas (nilai karangan, tanpa simpan). Konfirmasi atau ganti ke preset-saja.

## Belum dikerjakan / di luar jangkauan
- Worker AI belum dideploy (`PASANG_WORKER.cmd`; atur `IZIN_ORIGIN` dan `VITE_URL_WORKER_AI`); kunci hanya lewat `wrangler secret put`.
- Token GitHub dan kunci OpenRouter yang pernah ditempel harus dicabut/diputar.
- Persetujuan B07 sebelum profil `lapangan`; verifikasi dosen atas klaim berstatus belum.

## Audit independen (Haiku) dan tindak lanjut
Audit awal: 12 lulus, 9 gagal, 2 tak teruji dari 23 Batas Mutlak. Sudah diperbaiki: lencana "ACUAN RESMI" (menyesatkan untuk klaim belum diverifikasi) menjadi "SUMBER DIRUJUK"; angka karangan layar K06 (`?? 41`) dibuang; ketuk latar menutup Pengaturan; input formulir 48 px, koma desimal, masukan di luar rentang ditolak; indikator luring nyata (menggantikan lencana hard-code); klaim ASI eksklusif/privasi/"tanpa penyimpanan" diluruskan (AI opsional mengirim ringkasan berkode); lencana energi tidak lagi selalu hijau; istilah internal (ADR, K-04) dibuang dari teks pengguna; fokus keyboard pada lembar dan kartu bejana.

Belum (di luar UI, perlu keputusan pemilik atau Claude Code): input prematur/usia koreksi (C-093) dan ambang berat tidak valid (C-021) di mesin; BB sangat besar kini ditolak di UI (2–25 kg), bukan oleh mesin. Beberapa teks tetap hard-code namun sesuai mesin saat ini (+0,7 cm, hati ≤1×/pekan). Performa HP murah dan pembaca layar nyata belum teruji.
