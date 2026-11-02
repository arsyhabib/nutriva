# NUTRIVA — Konteks proyek untuk agent

Aplikasi mesin gizi 1000 HPK (ibu hamil, ibu menyusui, anak 6–23 bulan) untuk PjBL/skripsi kedokteran. Mesin deterministik yang dapat diperiksa, inti berjalan tanpa jaringan (cache), dengan Mode Ahli dan sumber berkoordinat; AI hanya sebagai penjelas opsional yang diberi peringatan (K-08). Bahasa kerja: **Bahasa Indonesia**.

Ada dua peran agent. **Tentukan peranmu dari pesan pertama pemilik produk.** Bila tidak jelas, tanyakan.

## Jika EKSEKUTOR (membangun)
Baca `STRATEGI_PENGEMBANGAN.md`, `REGISTRI_FITUR_NUTRIVA.md`, `AUDITOR_PACKAGE/02_HARAPAN_EKSEKUTOR.md`, `AUDITOR_PACKAGE/04_ARSITEKTUR_DAN_ATURAN.md`.
- Setiap peningkatan diaudit lewat `audit/requests/` memakai templat. Jangan membuka gerbang tanpa vonis auditor dan persetujuan pemilik.
- Jangan mengedit `audit/reports/`.
- Jangan memakai rujukan/angka yang belum berstatus TERVERIFIKASI di `AUDITOR_PACKAGE/08_REGISTER_KLAIM_DAN_RUJUKAN.md`.
- Pegang invarian INV-01…INV-18.

## Jika AUDITOR (memeriksa)
Mulai dari `AUDITOR_PACKAGE/00_BACA_DULU.md` dan `11_PROMPT_AUDITOR.md`.
- Tulis hanya di `audit/reports/`, `audit/proposed_tests/`, `audit/evidence/`, dan kolom auditor `audit/LEDGER.md`.
- Jangan mengedit kode, data, registri, atau strategi. Jangan menjalankan perintah git yang mengubah keadaan.

## Perintah proyek (Node.js v24, dipasang di `C:\Program Files\nodejs`)
Di PowerShell, awali dengan: `$env:Path = "C:\Program Files\nodejs;" + $env:Path`
- `npm run check` — typecheck + uji + verifikator klaim + lint fixture (harus hijau sebelum meminta audit)
- `npm run test` · `npm run typecheck` · `npm run verify:claims` · `npm run lint:fixtures`
- Struktur: `src/engine/` (mesin murni, tanpa DOM), `src/tools/` (alat CLI), `data/` (klaim, sumber, aturan, bahan; JSON), `tests/` (uji; `tests/fixtures/` wajib sintetis), `docs/adr/` (keputusan), `KEPUTUSAN_DAN_JALUR_RILIS.md` (otoritatif untuk jalur rilis dan profil `demo`/`lapangan`).
- Dependensi dikunci eksak; jangan menambah dependensi tanpa ADR dan `--ignore-scripts`.

## Berlaku untuk keduanya
- Jangan mengarang sitasi, nomor peraturan, halaman, atau angka.
- Data anak dan ibu adalah data pribadi sensitif; hanya data sintetis dalam pengembangan.
- `NUTRIVA_V8_Source_Lengkap.zip` adalah aplikasi lama yang tidak dipertahankan; jangan menjalankan SQL atau skripnya.

## Rencana 5 hari V-PJBL (v4, 2026-11-02): pembagian kepemilikan berkas
Keputusan K-08 sampai K-13 ada di `KEPUTUSAN_DAN_JALUR_RILIS.md` §00. Blueprint lengkap ada di Claude Doc "NUTRIVA — Blueprint 5 Hari (V-PJBL)".
- **Cowork (eksekutor data):** `data/`, `tests/golden/`, `docs/`, `sumber/`.
- **Claude Code (laptop):** `src/engine/`, `src/ai/`, `worker/`, konfigurasi build.
- **Antigravity:** `src/ui/` (cangkang Rona).
- **Gemini/ChatGPT:** hanya membaca dan memeriksa silang; menulis ke `docs/periksa/`.
- **Tidak ada AI yang melakukan commit;** pemilik yang commit. Jangan edit berkas di luar kepemilikanmu tanpa izin.
- Setiap angka tabel/AKG membawa `klaim_id`; klaim berstatus `belum` hanya boleh tampil dengan label "belum diverifikasi".
- Cap versi pada setiap keluaran: `engine_version`, `data_version`, `rules_version`. "Hitung ulang" memakai PRNG berbenih.


## Catatan kepemilikan (Hari 2)
Cowork (Claude di cloud) menulis `src/engine/{gizi,polaMakan,belanja,prng}.ts`, `schema/{bahan,aturan}.ts`, data pangan, dan tesnya. Claude Code tetap untuk tugas yang terikat laptop/akun. Tidak ada commit oleh AI; pemilik repo yang commit.

## Catatan kepemilikan (Hari 3)
`src/ai/` dan `worker/` pada Hari 3 ditulis oleh Cowork (cloud) dan diuji di sana. Claude Code hanya untuk langkah yang terikat laptop/akun: `wrangler login`, `wrangler secret put OPENROUTER_API_KEY`, `wrangler deploy`, uji di peramban nyata. Kunci API tidak pernah masuk repo (ada tes `pagar-rahasia`).

## Catatan kepemilikan (pra-Hari 4)
Atas permintaan pemilik, Cowork juga mengerjakan `src/app/` (fasad untuk UI), `src/engine/rujukan.ts`, `public/_headers`, dan skrip `PASANG_WORKER.cmd`. Pembuatan `src/ui/` pada Hari 4 juga dikerjakan Cowork kecuali pemilik menugaskan Antigravity.

## Catatan kepemilikan (penyempurnaan Rona, 2026-11-02)
Hasil Antigravity (`src/ui/`) dinilai tidak layak, lalu **Cowork menyempurnakannya** di atas templat Rona (bukan desain baru): solver gelombang bejana stabil (`langkahGelombang`, uji `tests/fisika-stabil.test.ts`), render parsial (kerangka & kanvas latar persisten), angka/klaim karangan dibuang (strata ASI, takaran sdm, jam makan, nomor 119, P3K), dock pengembang diganti sheet Pengaturan, tipografi Plus Jakarta Sans + Instrument Serif italic, hierarki visual 3 tingkat, target sentuh ≥48 px, SW prakirim aset (luring pertama), CSP meta saat build. Uji: `npm run check` dan e2e Chromium `npm run e2e` (butuh `vite preview` di :4173 dan playwright global). Tautan dalam: `#kolam`, `#kenapa`, dst.

## Catatan tata letak adaptif (2026-11-03)
Bingkai ponsel dihapus. Satu DOM; kelas ruang diputuskan oleh **lebar kontainer nyata** (`.rona-app-shell` = `container: app`), bukan UA/perangkat: `ringkas` <640 (nav bawah, lembar bawah), `sedang` 640–1023 (rel kiri, laci kanan), `lega` ≥1024 (sidebar, inspektur menempel). Ambang ada di `BATAS_RUANG` (layar.ts) dan harus sama dengan `@container app` di rona.css (dijaga tes). Modalitas `html[data-masukan=sentuh|kursor]` dari pointer media query + `pointerType` langsung. Uji: `npm run e2e` (smoke) dan `node e2e/adaptif.cjs` (matriks 19 viewport; butuh `vite preview` :4173).

## Catatan penyempurnaan UI (2026-11-03)
Atas permintaan pemilik, Cowork menyentuh `src/ui/`, `src/ai/` (klien kunci sendiri, mesin markdown, prompt) dan re-export `worker/prompt.ts`. Perubahan: navigasi berbasis riwayat peramban (`#id`, gestur kembali tidak menutup aplikasi) plus panah kiri/kanan; kolom kunci API pengguna (OpenRouter, model bawaan `anthropic/claude-haiku-5.5`, kunci tidak pernah dirender ulang, tersimpan di sessionStorage kecuali "Ingat di perangkat ini"); mesin markdown aman tanpa dependensi (`src/ai/markdown.ts`); logo vektor (`#nv-logo`, `public/logo.svg`) dan tanda penulis "E.13.1"; ekspor PDF lewat dokumen cetak A4 (`src/ui/ekspor.ts`, CSS bagian 13); gerak tombol berjeda (bagian 14, menghormati hemat gerak). Label "prototipe/dosen" tidak lagi tampil di UI; konstanta `LABEL_PROTOTIPE` tetap ada di engine untuk skema jejak dan tes. Uji baru: `tests/ai-markdown`, `tests/ai-kunci-sendiri`, `tests/ui-ekspor`. Jangan memakai nilai kunci sungguhan dalam tes (pakai string palsu tanpa pola `sk-`).

## Catatan mode data sendiri, resep AI, dan ekspor Ultimate (2026-11-03)
Atas permintaan pemilik: (1) **Mode data sendiri** dibuka di UI: beranda memuat "Isi data anak Anda" (`mulaiDataSendiri`), label "Data Anda" menggantikan "Contoh N", nilai awal ditandai `belumDiisi` sampai usia, berat, dan panjang diubah (atau dikonfirmasi). Tidak ada kolom nama atau tanggal lahir, tidak ada penyimpanan; gerbang `otorisasi.ts` untuk penyimpanan data nyata tidak disentuh. (2) **Resep AI + gambar** (`src/ai/resep.ts`, `validasiResep` di validator): satu klik memanggil OpenRouter chat dan `/api/v1/images` (`openai/gpt-image-2`, dapat diganti di Pengaturan) lewat `Promise.all`, hasil muncul bersamaan; bahan dan gram hanya dari mesin; hanya nama bahan, gram, dan rentang usia yang dikirim; gagal-aman ke resep cadangan; gambar divalidasi (data URL png/jpeg/webp, batas ukuran). Hanya mode kunci sendiri. (3) **Ekspor**: bagian baru `sesi`, `resep`, `penjelas`; pilihan cepat **Ultimate** (semua data sesi), unduhan PDF satu resep (`resepIds`); tombol pratinjau berlabel "Unduh PDF" (cetak ke PDF peramban). Uji: `tests/ai-resep.test.ts`, `tests/ui-ekspor.test.ts`. Panggilan jaringan nyata belum pernah diuji dengan kunci sungguhan.


## Catatan kunci bawaan (2026-11-03)
Atas keputusan pemilik, aplikasi boleh membawa kunci OpenRouter bawaan yang **tersamar** (`src/ai/tamar.ts`, `src/ai/kunci-bawaan.ts`, `npm run kunci:pasang`; `-- --hapus` untuk mencabut). Ini penyamaran, bukan enkripsi: kunci tetap dapat dibongkar dari bundel publik. Mitigasi: pemilik memberi batas kredit pada kunci di OpenRouter dan menggantinya berkala; klien membatasi pemakaian bawaan per tab (30 poin: penjelasan 1, resep+gambar 5); kunci milik pengguna di Pengaturan selalu didahulukan. Pemindai `pagar-rahasia` tetap hijau karena berkas hanya memuat potongan tersamar; jangan pernah menaruh kunci mentah. Agent tidak memegang kunci pemilik: skrip dijalankan pemilik sendiri.

## Catatan penyaring keluaran AI (2026-11-03)
Atas keputusan pemilik, jalur kunci sendiri/bawaan tidak lagi menyaring keluaran AI (`FILTER_KELUARAN_AI = false` di `src/ai/klien.ts`; validator tetap ada dan dipakai Worker). Teks tetap dirender aman oleh mesin markdown dan selalu bersama tanda "dibuat AI, bisa keliru". Mutu dijaga lewat prompt sistem (`src/ai/prompt.ts`, `PROMPT_RESEP` di `src/ai/resep.ts`).
