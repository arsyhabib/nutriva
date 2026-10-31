# ADR-0002 — Karantina klaim dan fixture sintetis

- **Tanggal:** 2026-10-28 · **Status:** Diusulkan (menunggu REQ-0006)

## Konteks
Register klaim memuat banyak klaim belum terverifikasi (RPT-0001/0003), termasuk TTD (AUD-0003-02). Auditor mensyaratkan: verifikator build menolak klaim berstatus belum/karantina yang dipakai (RPT-0005 §10 syarat 2) dan fixture tidak boleh berasal dari data nyata (AUD-0005-07).

## Keputusan
1. Setiap konstanta, aturan, atau nilai data wajib mengacu `claim_id` di `data/claims.json`. Status klaim: `teks-ditemukan-mesin`, `terverifikasi-manusia`, `belum`, `dikarantina`, `dicabut`.
2. `npm run verify:claims` (`src/tools/cli-verify-claims.ts`) **gagal** bila: klaim yang dirujuk tidak ada; klaim berstatus `dikarantina` atau `dicabut` (**tidak pernah boleh dipakai, bahkan dengan label**); klaim berstatus `belum` tanpa `label_belum_diverifikasi: true` pada simpul itu atau induknya; konstanta angka (`nilai`, `ambang`, `batas`, `minimum`, `maksimum`) tanpa `klaim_id`; klaim menunjuk sumber yang tidak terdaftar. Berkas yang dipindai: `data/aturan/**` dan `data/bahan/**`.
3. Klaim TTD (dosis, jumlah tablet) berstatus `dikarantina`; aplikasi tidak memuat angka dosis (T-10).
4. Semua fixture uji wajib berkas JSON dengan `sintetis: true`, `asal: "dibuat-pengembang"`, dan tidak memuat kunci identitas (nama, tanggal lahir, alamat, NIK, telepon). `tools/lint-fixtures` menolak pelanggaran.
5. Folder `sumber/` dan arsip V8 tidak masuk repositori (`.gitignore`).

## Konsekuensi
Menutup S0 AUD-0005-07 dan sebagian AUD-0001-01. Menambah disiplin saat menulis data dan aturan.
