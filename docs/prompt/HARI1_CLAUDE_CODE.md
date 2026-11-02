# Prompt Hari 1 untuk Claude Code (laptop) — salin seluruhnya

Peran: kamu EKSEKUTOR KODE proyek NUTRIVA (folder ini). Baca dulu `CLAUDE.md`, `KEPUTUSAN_DAN_JALUR_RILIS.md` §00 (v4), `docs/verifikasi_eksekutor/VERIFIKASI_TABEL_SD.md`, `tests/golden/hitung_golden.py`.
Kepemilikan: kamu hanya menulis di `src/engine/`, `src/ai/`, `worker/`, konfigurasi build (`package.json`, `tsconfig.json`, `vite.config.ts`, `vitest.config.ts`). Jangan mengubah `data/`, `tests/golden/`, `docs/`, `src/ui/`. Jangan commit. Dependensi dikunci eksak; pasang dengan `--ignore-scripts`; tambah dependensi hanya Vite (dan plugin yang mutlak perlu) dan catat di `docs/adr/`.

## Langkah (kerjakan berurutan; berhenti dan laporkan bila ada yang gagal)
1. `npm run check` pada keadaan awal. Laporkan hasilnya apa adanya.
2. Pindahkan data baru ke skema: tulis `src/engine/schema/tabelSd.ts` (Zod) untuk bentuk `data/tabel_sd/*.json` (`_meta`, `baris[]` dengan `sd` 7 angka, kunci `bulan` atau `panjang_cm`) dan `src/engine/schema/akg.ts` untuk `data/akg_anak.json`. Muat data lewat satu modul `src/engine/data.ts` yang memvalidasi dengan Zod dan gagal keras bila salah. Pastikan `data/claims.json` dan `data/sources.json` tetap lolos `npm run verify:claims`.
3. Tulis `src/engine/antropometri.ts` (fungsi murni, tanpa DOM, tanpa Date.now, tanpa Math.random):
   - usia = bulan penuh (hari tidak dibulatkan ke atas); di luar 6–23 bulan → keluaran `stop` dengan kode alasan;
   - koreksi `berdiri` pada usia < 24 bulan: panjang + 0,7 cm, dibulatkan 1 desimal setengah-naik (decimal, bukan float);
   - kategori BB/U, PB/U, BB/PB persis seperti aturan di `tests/golden/hitung_golden.py` (fungsi `kat_*`) dan posisi di antara garis SD (`posisi`);
   - BB/PB: panjang dibulatkan ke 0,5 cm terdekat, setengah naik (keputusan D-6, klaim `KL-ASUMSI-PEMBULATAN-PANJANG`), lalu baca baris tabel; sertakan `panjang_tabel_cm` pada keluaran seperti di golden;
   - setiap keluaran memuat `klaim_id` sumbernya (KL-SD-*), dan `engine_version`, `data_version` dari konstanta;
   - JANGAN menghitung z-score; hanya kategori dan posisi antar-garis.
4. Uji golden: `tests/golden.test.ts` (milikmu; berada di luar `tests/golden/`) membaca `tests/golden/kasus_status.json` dan membandingkan SEMUA 129 kasus dengan `antropometri.ts`. Kasus tak boleh dilewati. Bila ada selisih, jangan ubah `harapan`; laporkan selisih beserta analisis siapa yang benar menurut Permenkes 2/2020.
5. Tambah dasar pembuatan UI tanpa mengubah `src/ui/`: Vite + TypeScript tanpa kerangka UI. Skrip: `dev`, `build`, `preview`. Konfigurasi build harus MENGECUALIKAN blok `rona-physics` dan `rona-exhibition` dari `dist/` (K-13). Adaptor status memori-saja (`src/engine/state.ts`): tanpa localStorage, sessionStorage, IndexedDB, cookie, atau status di URL pada profil `demo`.
6. Cek ukuran bundel: skrip `npm run cek:bundel` yang gagal bila `dist/` melebihi 1,5 MB (sebelum gzip) dan mencetak ukuran.
7. Jalankan `npm run check` dan `npm run build`. Tulis laporan `LAPORAN_CC_HARI1.md` di akar proyek: apa yang dibuat, hasil uji (jumlah lulus/gagal), selisih golden, ukuran bundel, keputusan terbuka. Jangan klaim "lulus" tanpa menempelkan keluaran perintah.

## Larangan
Jangan mengarang angka medis. Jangan membuat penjelas AI hari ini (Hari 3). Jangan menyentuh kunci/otorisasi `lapangan`. Jangan menghapus berkas.
