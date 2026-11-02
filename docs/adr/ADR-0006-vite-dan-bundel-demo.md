# ADR-0006 — Vite sebagai alat build, pengecualian blok Rona, status memori-saja

Tanggal: 2026-11-02 · Status: diusulkan eksekutor (Claude Code), menunggu persetujuan pemilik

- **Keputusan:** tambah `vite 8.3.5` (eksak, `--ignore-scripts`) sebagai devDependency. Versi ini sudah ada di pohon dependensi sebagai turunan `vitest 5.0.4`; tidak ada paket baru yang masuk `node_modules`. Tanpa kerangka UI dan tanpa plugin tambahan.
- **K-13:** plugin lokal di `vite.config.ts` menghapus `<script id="rona-physics">` dan `<script id="rona-exhibition">` dari HTML dan menggagalkan build bila masih ada di keluaran. `npm run cek:bundel` memeriksa ulang `dist/` dan batas 1,5 MB (sebelum gzip).
- **Status:** `src/engine/state.ts` hanya menyimpan di memori; profil `demo` tidak memakai penyimpanan peramban, cookie, atau status di URL (ADR-0003).
- **Berkas masuk:** `index.html` dan `src/main.ts` adalah cangkang sementara agar build berjalan; digantikan oleh `src/ui/` (Antigravity).
