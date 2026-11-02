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
