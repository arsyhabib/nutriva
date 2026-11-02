# Laporan Claude Code — Hari 1 (2026-11-02)

## Hasil ringkas
- Keadaan awal `npm run check`: hijau (8 berkas uji, 106 uji).
- Akhir: `npm run check` hijau — **10 berkas uji, 237 uji lulus, 0 gagal**; `verify:claims OK — 10 klaim, 3 sumber, 7 berkas data dan 10 berkas kode dipindai, 7 rujukan`; `lint:fixtures OK — 2 fixture`.
- `npm run build` berhasil; `npm run cek:bundel`: `Ukuran dist/: 1193 byte (1.2 KiB) dari batas 1572864 byte, 2 berkas` → `cek:bundel OK`.

## Yang dibuat
- `src/engine/schema/tabelSd.ts`, `src/engine/schema/akg.ts` (Zod), `src/engine/data.ts` (satu pintu muat data, gagal keras), `src/engine/versi.ts` (`ENGINE_VERSION`, `DATA_VERSION`, `RULES_VERSION`).
- `src/engine/antropometri.ts`: `hitungStatus()` murni; usia bulan penuh 6–23 (di luar → `stop` + kode alasan); koreksi berdiri +0,7 cm dengan aritmetika bilangan bulat berskala (bukan float); pembulatan panjang BB/PB ke 0,5 cm setengah-naik (D-6); kategori + posisi antar-garis; tanpa z-score; setiap indikator membawa `klaim_id` (KL-SD-*) dan `label_belum_diverifikasi`; cap `engine_version`/`data_version`.
- `tests/golden.test.ts`: 129 kasus dari `tests/golden/kasus_status.json`, tidak ada yang dilewati. `tests/state.test.ts`.
- `src/engine/state.ts`: status memori-saja (tanpa penyimpanan peramban, cookie, status URL).
- `vite.config.ts`, `index.html`, `src/main.ts` (cangkang sementara), skrip `dev`/`build`/`preview`/`cek:bundel` (`src/tools/cli-cek-bundel.ts`), `docs/adr/ADR-0006-vite-dan-bundel-demo.md`.
- Dependensi: hanya `vite 8.3.5` (eksak, `--ignore-scripts`); versi itu sudah ada sebagai turunan vitest, jadi `npm install` melaporkan "up to date".

## Selisih golden
**Tidak ada.** 129/129 kasus cocok dengan `harapan` (kategori, posisi, `panjang_dipakai_cm`, `panjang_tabel_cm`, alasan stop). `harapan` tidak diubah.

## Verifikasi K-13
Build `dist/` saat ini hanya memuat cangkang kecil, jadi ukuran bundel belum menguji apa pun. Karena itu plugin diuji langsung pada `NUTRIVA_Rona_Demo.html` (423.556 → 331.021 karakter) dan `NUTRIVA Rona.html` (482.272 → 389.737): kedua blok hilang, tidak ada sisa. Bug yang sempat ada (garis miring terbalik pada regex hilang saat penulisan berkas, sehingga tidak ada yang terhapus) ditemukan lewat uji ini dan sudah diperbaiki.

## Keputusan terbuka / catatan
1. **Konstanta tanpa klaim_id:** usia 6 dan 24 bulan serta koreksi +0,7 cm saya anotasi `// klaim: n/a — … belum punya klaim_id`. Perlu klaim terdaftar oleh pemilik data (Cowork); saya tidak mengarang ID. Batas 45/110 cm memakai `KL-SD-BBPB-L`.
2. **Status klaim:** keluaran BB/PB membawa `label_belum_diverifikasi: true` (tabel BB/PB baru terverifikasi sampel). BB/U dan PB/U berstatus `teks-ditemukan-mesin`.
3. **Cangkang sementara:** `index.html` dan `src/main.ts` berada di luar `src/ui/` agar build berjalan; Antigravity perlu menggantikannya. `tsconfig.json` kini memuat lib `DOM` (untuk `src/main.ts`); kemurnian `src/engine/` dijaga lewat tinjauan, bukan tipe.
4. **Untuk Antigravity:** CSS inline di HTML Rona diawali karakter BOM sebelum `@font-face`; `vite build` (lightningcss) menolaknya ("Unexpected token AtKeyword"). Hapus BOM itu saat memindahkan ke `src/ui/`.
5. `ADR-0006` berstatus diusulkan; menunggu persetujuan pemilik. Tidak ada commit dibuat.
