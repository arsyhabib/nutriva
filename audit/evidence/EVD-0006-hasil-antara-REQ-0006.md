# EVD-0006 — Hasil antara REQ-0006 (A-GATE M0)

- **Dibuat oleh:** Auditor · **Tanggal:** 2026-10-28
- **Kode yang diperiksa:** `src/`, `tests/`, `data/`, `docs/adr/`, `package.json`, `package-lock.json`, `.gitignore`, `tsconfig.json`, `vitest.config.ts`. Tidak ada yang diubah. Mutasi dilakukan pada salinan di `scratchpad\mut` (node_modules disambungkan sebagai junction ke proyek).

## 1. Jalankan `npm run check` (langkah 2)
- `typecheck` (tsc --noEmit): lulus.
- `test` (vitest run): **6 berkas, 53 uji lulus** (sesuai RSP/REQ).
- `verify:claims`: OK — 2 klaim, 0 sumber, 0 berkas data dipindai, 0 rujukan.
- `lint:fixtures`: OK — 2 fixture sintetis.
- `npm audit`: 0 kerentanan (112 paket; prod 2, dev 111).

## 2. Mutasi verifikator klaim (`src/tools/verifikasiKlaim.ts`, CLI `cli-verify-claims.ts`)
Berkas mutasi ditulis tanpa BOM (`UTF8` tanpa BOM). Hasil:

| Kode | Mutasi (berkas `data/aturan/*.json` atau lokasi lain) | Hasil |
|---|---|---|
| V0 | kontrol: `{"aturan":{"nilai":800}}` | GAGAL (tertangkap) ✓ |
| V7 | `{"ttd":{"nilai":60,"klaim_id":"KL-TTD-DOSIS"}}` | GAGAL: "berstatus dikarantina" ✓ |
| V1 | `{"aturan":{"nilai":[800,900]}}` (konstanta berupa array) | **LOLOS** |
| V2 | `{"aturan":{"energi_kkal":800}}` (nama kunci lain) | **LOLOS** |
| V3 | `{"aturan":{"nilai":"800"}}` (angka sebagai string) | **LOLOS** |
| V4 | `{"aturan":{"Nilai":800}}` (huruf besar) | **LOLOS** |
| V5 | `{"aturan":{"batas_atas":3000}}` | **LOLOS** |
| V6 | `data/menu.json` berisi `{"ttd":{"nilai":60,"klaim_id":"KL-TTD-DOSIS"}}` (di luar `data/aturan` dan `data/bahan`) | **LOLOS** ("0 berkas data dipindai") |

Penyebab (dibaca dari kode): `KUNCI_KONSTANTA` berupa `Set` yang sensitif huruf besar dan hanya berlaku bila `typeof v === "number"`; daftar berkas hanya dua folder dan hanya `.json`.

## 3. Mutasi lint fixture (`src/tools/lintFixtures.ts`)
Mutasi di `tests/fixtures/` pada salinan:

| Kode | Isi fixture | Hasil |
|---|---|---|
| L0 | kontrol: `"nama": "Budi"` | GAGAL ✓ |
| L7 | `"detail": {"Nama_Lengkap": "Sari"}` | GAGAL ✓ |
| L1 | `"namaAnak": "Budi"` (camelCase) | **LOLOS** |
| L2 | `"tanggalLahir": "2024-01-01"` (camelCase) | **LOLOS** |
| L3 | kunci `nаma` dengan huruf Kiril U+0430 | **LOLOS** |
| L4 | `"keterangan": "anak bernama Budi, ibunya Sari"` | **LOLOS** (nama di dalam nilai) |
| L5 | `"catatan": "0812-3456-7890"` | **LOLOS** |
| L6 | `"catatan": "3201 2345 6789 0001"` (NIK dengan spasi) | **LOLOS** |

Penyebab: normalisasi hanya `lower-case` + spasi/strip→underscore (tidak memecah camelCase); daftar kunci berbasis denylist; regex NIK/telepon mensyaratkan digit berurutan.

## 4. Improvisasi skema (salinan, `tests/improvisasi.test.ts` sementara)
- I1: `JejakSchema` profil `demo` dengan `label: "x"` → **lolos** (label tidak diperiksa isinya).
- I2: `JejakSchema` `masukan.catatan = "anak Budi"` → **lolos** (teks bebas identitas dalam jejak).
- I3 (kontrol): klaim `belum` tanpa sumber → ditolak ✓.
- I4: `KlaimSchema` status `dikarantina` dengan sumber terisi → **lolos** (tidak melarang sumber, tidak melarang pemakaian).

## 5. Mutasi registri (uji tag, salinan)
- Mengganti satu `[M2]` menjadi `[M3]` pada `REGISTRI_FITUR_NUTRIVA.md` salinan: **4 uji gagal** di `fase-tag.test.ts` ✓ (tertangkap).

## 6. Pemeriksaan kunci lapangan (ADR-0001, v3 §0.3)
- `grep -rn "otorisasi" src tests`: hanya `tests/pagar-repo.test.ts` (pemeriksaan bahwa berkas `otorisasi.lokal.json` **tidak ada**). Tidak ada kode yang membaca berkas itu, tidak ada validasi `dasar_izin`, `penandatangan_tanda_bahaya`, `keputusan_status_alat`, `versi_aturan`, dan tidak ada gerbang untuk profil `lapangan`.
- `grep -rn "lapangan" src`: hanya definisi enum `PROFIL_RILIS`.
- Hasil: penguncian teknis yang menjadi dasar Opsi B **tidak diimplementasikan**; uji yang ada bernama "profil lapangan terkunci" tetapi hanya memeriksa ketiadaan berkas.

## 7. Pemeriksaan git dan pagar repositori
- `git status`: ada 0 berkas ter-commit (`git ls-files | wc -l` = 0); `git log`: belum ada commit.
- `.gitignore` (diuji `git check-ignore`):
  - `sumber/x.pdf` → diabaikan ✓; `Sumber/x.pdf` → diabaikan (Windows) ✓; `data/otorisasi.lokal.json` → diabaikan ✓; `tests/fixtures/.env` → diabaikan ✓.
  - **`data/bahan/buku_kia_2024.pdf` → TIDAK diabaikan.** **`sumber2/tkpi.pdf` → TIDAK diabaikan.** Berkas sumber yang ditempatkan di luar `sumber/` akan ikut ter-commit.
- Berkas tak terlacak tanpa aturan ignore di akar: `DESIGN_PACKAGE/`, `DESIGN_PACKAGE.zip`, `NUTRIVA Lumen.html`, `NUTRIVA Sistem Desain.html`. Di luar ruang lingkup REQ, tetapi relevan untuk `git add .` (tidak diperiksa isinya).
- Pemindaian kata kunci (supabase, api_key, secret, password) di luar folder audit/desain: **tidak ada hasil**.

## 8. Ada tidaknya CI dan kasus baku
- Tidak ada `.github/`, tidak ada `golden/` atau `tests/golden`. Kasus baku kosong (RPT-0005 §9) dan CI uji (STRATEGI M0) tidak ada.

## 9. Pemeriksaan ADR dan status
- `docs/adr/ADR-0001..0005`: semua berstatus "Diusulkan". ADR-0004 menyebut `tests/registri.test.ts` yang **tidak ada** (yang ada: `tests/fase-tag.test.ts`).
- Riwayat ADR-0004 mencatat snapshot M2 16, M5 2; sesuai dengan registri saat ini (tes "registri sama dengan snapshot" lulus) ✓.

## 10. Rantai pasok (langkah 6)
- Versi di `package.json` dikunci eksak (`typescript 7.0.2`, `vitest 5.0.5`, `tsx 4.23.15`, `@types/node 26.6.5`, `zod 4.6.7`) dan `package-lock.json` (lockfileVersion 3; 112 paket; seluruh `resolved` dari `registry.npmjs.org`).
- Ada di registri npm (`npm view`, baca-saja) dengan integritas sama seperti lock:
  - typescript 7.0.2 — publish 2026-07-08.
  - vitest 5.0.5 — publish 2026-10-15 (**13 hari**, di bawah 2 minggu; aturan 2 minggu di CLAUDE.md berlaku untuk CDN, bukan dependensi npm; dicatat sebagai S3).
  - tsx 4.23.15 — publish 2026-09-20.
  - @types/node 26.6.5 — publish 2026-10-09.
  - zod 4.6.7 — publish 2026-10-12.
- Paket dengan skrip instalasi di lock: `esbuild`, `fsevents` (keduanya dari pohon tsx/vitest). Pemasangan memakai `--ignore-scripts`; esbuild tetap berjalan karena binari platform dipasang lewat paket opsional (tidak diverifikasi lebih jauh).

## 11. Kode engine (INV-11, INV-17)
- `src/engine/`: hanya `konstanta.ts` (enum profil, label, versi skema), `schema/klaim.ts`, `schema/jejak.ts`. Tidak ada DOM, tidak ada `Date.now`/`Math.random`, tidak ada jaringan. (Baik.)
- `JejakSchema.masukan`/`keluaran` menerima `z.string()` tanpa batas; komentar "tidak memuat teks bebas" tidak ditegakkan (lihat I2).
- `tsconfig` strict, `noUncheckedIndexedAccess` aktif; tidak ditemukan `any` atau `@ts-ignore` di `src/`.
- Tidak ada konstanta numerik di `src/` yang harus punya `claim_id` (INV-04): verifikator tidak memindai `src/`.

## 12. Catatan tentang keputusan dan tafsiran (langkah 7)
- `KEPUTUSAN_DAN_JALUR_RILIS.md` v3 §0: kutipan pemilik "tentukan keputusan untuk saya … pakai opsi b …". Kutipan ini adalah pilihan Opsi B. Frasa "tentukan keputusan untuk saya" mendelegasikan keputusan rinci kepada eksekutor.
- `audit/LEDGER.md`: kutipan pemilik tercatat; **belum ada penerimaan risiko S0** untuk profil `lapangan`.
- `audit/responses/RSP-0005`: tafsiran syarat 2–7 sebagai definisi selesai M0 (diminta dikonfirmasi auditor).

## 13. Yang belum dilakukan
- Tidak menjalankan `tsx` pada berkas di luar `src/` dan `tests/`.
- Tidak membaca isi `DESIGN_PACKAGE/` atau dua berkas HTML root (di luar ruang lingkup REQ).
- Tidak membuat commit atau mengubah status git (dilarang).
