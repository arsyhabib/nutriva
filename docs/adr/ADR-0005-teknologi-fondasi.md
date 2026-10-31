# ADR-0005 — Teknologi fondasi (M0)

- **Tanggal:** 2026-10-28 · **Status:** Diusulkan (menunggu REQ-0006)

## Keputusan
- **TypeScript mode ketat**, **Vitest** (uji), **Zod** (skema data dan jejak), **tsx** (menjalankan alat CLI TypeScript). Versi **dikunci eksak** di `package.json` dan `package-lock.json`.
- Mesin inti = fungsi murni tanpa DOM/jaringan (INV-11) di `src/engine/`.
- **Kerangka UI (Preact atau lainnya), pemecah LP, PWA plugin, PDF.js ditunda** sampai prototipe M1 mengukur determinisme lintas-peramban, ukuran bundel, dan performa (T-11, J12).
- Dependensi M0 sengaja minimal untuk memperkecil permukaan rantai pasok.

## Lingkungan
Node.js v24.22.1 (LTS) dan npm 11.19.1 dipasang di mesin pengembangan pada 2026-10-28 atas persetujuan pemilik, melalui `winget install OpenJS.NodeJS.LTS` (pemasang diverifikasi hash oleh winget). Dependensi dipasang dengan `--ignore-scripts --save-exact`: `typescript 7.0.2`, `vitest 5.0.4`, `tsx 4.23.15`, `@types/node 26.6.5`, `zod 4.6.7`; `npm audit` melaporkan 0 kerentanan pada saat pemasangan. `vitest` semula dipasang 5.0.5; dipin ulang ke 5.0.4 setelah AUD-0006-11 (RSP-0006). Versi di `package.json` dan `package-lock.json` adalah 5.0.4.
