# RENCANA "RONA DISEMPURNAKAN" (catatan kerja, 2026-11-02 malam)

Arahan pemilik (final): pakai NUTRIVA Rona sebagai template (jangan buat desain baru, jangan downgrade). Sempurnakan:
stabilitas (bejana glitch), layout/positioning, font (terasa kuno), hierarki visual bertingkat, tombol menarik, dll.
Versi saya sebelumnya (desain baru) DITOLAK pemilik; disimpan di /tmp/desain-baru (hanya referensi: font woff2, ikon, sw.js, manifest, tes kontras).

Basis: repo clone /home/claude/arsyhabib/nutriva (hasil Antigravity = port Rona; CSS identik Rona + cangkang). Check hijau (411 tes).

## Akar masalah yang SUDAH TERBUKTI
1. Bejana berkedip/belang: solver gelombang tidak stabil (BejanaNektar.langkah: tension=165, spread=190, dt tidak diklem -> osilasi checkerboard). Frame uji menunjukkan belang vertikal. Perbaikan: fixed-step substep + klem dt + koefisien stabil + uji numerik.
2. render() membuang dan membuat ulang SELURUH shell (SutraField + semua canvas bejana) tiap perubahan state -> kedip/animasi mulai dari nol.
3. Bokeh/orb SutraField melayang DI ATAS teks (tampak seperti kotoran). Pindahkan ke belakang konten.
4. ANGKA KARANGAN di UI (pelanggaran validitas): rasio ASI visual (protein 0.45, besi 0.03, seng 0.25, kalsium 0.55, vitA 0.48, vitC 0.4) -> "ASI 45%"; "~2 sdm" (gram/15); jam makan 08.00 dst; nama variasi benih (Pesisir & Kebun dst) tidak benar; teks AKG hard-coded ("11 mg/hari"); langkah pertolongan pertama (teruskan ASI, jaga hangat) = saran klinis di luar klaim; tombol "Hubungi 119" tanpa sumber. Semua harus diganti dengan data mesin / dibuang.
5. Panel dev bocor ke produk: dock 18 layar, "Kontrol & Layar", "Penuh", label "NUTRIVA Rona · Kasus A", kode layar A1..K10.
6. index.html: manifest/icon path absolut (/manifest.webmanifest) rusak di GitHub Pages; SW hanya cache ./ dan index (aset ber-hash tidak ter-cache -> luring gagal); CSP via _headers tidak jalan di GitHub Pages (perlu meta CSP saat build).
7. 'udang' di daftar alergen tidak dikenal mesin (hindari_tidak_dikenal -> menu berhenti).
8. Input angka bebas di A2 (D-1 hanya preset) -> putuskan: izinkan sebagai "nilai rekaan" dengan peringatan, tanpa simpan; catat di laporan.

## Yang dipertahankan dari Rona (inovasi)
4 tema (Fajar, Dekap, Terik, Lensa), peran Ibu/Kader/Ahli, kaca sutra/optik, bejana cairan (diperbaiki, jujur), tetesan Bezier, lembar bawah (bottom sheet), meter SD, mode ahli tabel SD, kartu bagikan, 18 keadaan layar sebagai keadaan sungguhan (kosong/memuat/luring/kedaluwarsa/galat/tidakLayak/dataTidakAda/hapus), hemat gerak, zoom teks.

## Pekerjaan (urut)
W1 fisika stabil + uji numerik   W2 render parsial (shell persisten) + bejana tanpa animasi ulang
W3 buang angka karangan; bejana jujur: lapisan MPASI (terhitung) + sisa kebutuhan (komplemen), bukan ASI
W4 CSS "10. Penyempurnaan": tipografi modern (Plus Jakarta Sans + Instrument Serif italic aksen), hierarki 3 tingkat, tombol utama terisi, orb di belakang, layout mobile
W5 buang dock/dev chrome; Pengaturan sheet (tema, gerak, peran, teks besar, mode ahli, privasi, mulai ulang)
W6 PWA/CSP/manifest/SW; udang; konten rujuk
W7 tes: stabilitas gelombang, UI string, no Math.random di jalur data, kontras token; e2e Playwright (tests/e2e) 3 preset x semua layar x 4 tema x 360/390/412 + luring + AI galat
W8 audit Haiku independen; dokumen laporan; kirim ke laptop (device_commit_files)
