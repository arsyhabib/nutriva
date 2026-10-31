# NUTRIVA — Konteks proyek untuk agent

Aplikasi mesin gizi 1000 HPK (ibu hamil, ibu menyusui, anak 6–23 bulan) untuk PjBL/skripsi kedokteran. Mesin deterministik yang dapat diperiksa, offline-first, dengan Mode Ahli dan sumber berkoordinat; AI hanya sebagai penjelas opsional. Bahasa kerja: **Bahasa Indonesia**.

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
