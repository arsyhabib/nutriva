# REQ-0006 — A-GATE M0: fondasi proyek (tanpa fitur)

- **Tanggal:** 2026-10-28 · **Pengirim:** Eksekutor
- **Objek:** pohon kerja `C:\Users\habib\Documents\NUTRIVA RAHMA` (git diinisialisasi; **belum ada commit**: commit hanya atas permintaan pemilik). Versi diidentifikasi dengan hash SHA-256 (16 heks pertama) di bawah.
- **Item registri:** J02, J07, J12(sebagian: hanya ADR), J13(sebagian), B10, F08 (sebagian: hanya fixture), K06 (belum), D01/D02 (hanya skema jejak)
- **Di luar ruang lingkup:** semua fitur, antarmuka, data pangan, hasil desain di berkas HTML root (lihat catatan)

## Cara menjalankan (PowerShell)
```
$env:Path = "C:\Program Files\nodejs;" + $env:Path
cd "C:\Users\habib\Documents\NUTRIVA RAHMA"
npm run check
```
Hasil eksekutor: typecheck lulus; **53 uji lulus (6 berkas)**; `verify:claims` OK (2 klaim, 0 sumber, 0 berkas data, 0 rujukan); `lint:fixtures` OK (2 fixture); `npm audit` 0 kerentanan (saat pemasangan). Uji mutasi manual (6 cacat sengaja disuntik ke verifikator klaim, lint fixture, parser tag, skema jejak): **6 dari 6 tertangkap** oleh suite; berkas sudah dipulihkan.

## Definisi selesai M0 = syarat 1–7 RPT-0005 §10
| # | Syarat | Bukti eksekutor |
|---|---|---|
| 1 | Keputusan pemilik dengan kalimatnya sendiri | `KEPUTUSAN_DAN_JALUR_RILIS.md` v3 §0 (kutipan) dan `audit/LEDGER.md` (Keputusan pemilik). **Catatan:** pemilik memilih Opsi B (bukan A); lihat v3 dan ADR-0001 |
| 2 | Karantina teknis TTD di verifikator build | `src/tools/verifikasiKlaim.ts`; `data/claims.json` (KL-TTD-DOSIS, KL-TTD-JUMLAH-HAMIL berstatus dikarantina); `tests/verifikasi-klaim.test.ts` ("karantina TTD ... GAGAL walau berlabel") dan `tests/cli.test.ts` (CLI gagal bila aturan memakai klaim TTD) |
| 3 | Tanpa data nyata/fixture nyata | `.gitignore` (`sumber/*`, `.env`, `otorisasi.lokal.json`); `src/tools/lintFixtures.ts` + `tests/lint-fixtures.test.ts` + `tests/cli.test.ts`; `tests/fixtures/*.json` bertanda `sintetis: true`; `tests/pagar-repo.test.ts` |
| 4 | Arsip V8 tidak diimpor/dijalankan | `.gitignore` (`NUTRIVA_V8_Source_Lengkap.zip`, `audit/evidence/legacy_v8/`); `tests/pagar-repo.test.ts` (kode sumber tidak menyebut V8) |
| 5 | Git diinisialisasi dengan .gitignore, tanpa rahasia | `git init -b main`; `.gitignore`; dependensi eksak + `package-lock.json` (diuji) |
| 6 | Skema tag registri dibekukan | `data/fase_tag.snapshot.json` (153 ID); `src/tools/faseTag.ts`; `tests/fase-tag.test.ts`; ADR-0004 |
| 7 | ADR awal | `docs/adr/ADR-0001…0005` (Opsi B + dua profil; karantina klaim + fixture sintetis; origin per profil + larangan keadaan URL; pembekuan tag; teknologi fondasi) |

## Hash berkas (16 heks pertama SHA-256)
```
274eb2d12d801ff3 src/engine/konstanta.ts        946faf4033d299be src/engine/schema/jejak.ts
b2ba4c2a0dbe9722 src/engine/schema/klaim.ts     45c4e881541cefaf src/tools/cli-lint-fixtures.ts
9f7be36485c42571 src/tools/cli-verify-claims.ts 84f3ab9e42c0487a src/tools/faseTag.ts
faa0a7b28af6aef9 src/tools/lintFixtures.ts      90e5d6100b59abc6 src/tools/verifikasiKlaim.ts
e7ad9f4b58455687 tests/cli.test.ts              87dadee8b076fa6c tests/fase-tag.test.ts
10366d86fdd8465a tests/klaim.test.ts            1532cd03a6d2a74c tests/lint-fixtures.test.ts
95cc21bd559875da tests/pagar-repo.test.ts       e4d2cc936b89653a tests/verifikasi-klaim.test.ts
ddbf1d23c40bedaa data/claims.json               a8c26c52fb7c2afc data/fase_tag.snapshot.json
```

## Permintaan khusus kepada auditor (kerjakan berurutan; hasil antara di `audit/evidence/`)
1. **Cari celah verifikator klaim** (`src/tools/verifikasiKlaim.ts`): cara agar klaim karantina/belum/dicabut tetap bisa dipakai (nama kunci konstanta lain seperti `value`/`angka`; konstanta dalam string; array angka; `klaim_id` yang menunjuk klaim yang dipakai tetapi di simpul saudara; kunci yang meniru `label_belum_diverifikasi` pada tingkat yang salah; berkas di luar `data/aturan` dan `data/bahan`). Tulis uji gagal di `audit/proposed_tests/` (jangan mengubah `tests/`).
2. **Cari celah lint fixture** (`src/tools/lintFixtures.ts`): varian kunci (huruf besar, unicode mirip, spasi, camelCase `namaAnak`, `tanggalLahir`), pengenal di dalam nilai bukan di kunci, fixture bersarang yang `sintetis: true` di akar tetapi isinya nyata.
3. **Uji kekuatan suite:** jalankan sendiri minimal 5 mutasi buatan Anda (di salinan, bukan di berkas proyek) dan laporkan mana yang lolos.
4. **Kontrak skema:** apakah `KlaimSchema`/`SumberSchema`/`JejakSchema` cukup untuk INV-04/INV-05 pada M1a? Apa yang kurang?
5. **Syarat 1–7:** nilai tiap bukti: terpenuhi/sebagian/belum; temuan bernomor AUD-0006-xx.
6. **Rantai pasok:** tinjau `package.json`, `package-lock.json` (versi eksak, `--ignore-scripts`), dan versi dependensi (typescript 7.0.2, vitest 5.0.5, tsx 4.23.15, @types/node 26.6.5, zod 4.6.7): adakah kekhawatiran (paket baru, tidak dikenal)? Verifikasi bahwa versi itu ada di registri npm.
7. **Vonis:** M0 selesai (LULUS), LULUS BERSYARAT, atau DITOLAK; dan apakah **M1a boleh dimulai** (syarat M1a RPT-0005 tidak diminta selesai sekarang, tetapi sebutkan mana yang harus ditutup lebih dulu).

## Hal yang paling saya cemaskan
Verifikator hanya memindai kunci yang saya duga (`nilai`, `ambang`, `batas`, `minimum`, `maksimum`) dan JSON berlokasi `data/aturan|bahan`; konstanta dengan nama lain akan lolos. Lint fixture berbasis denylist. Uji lulus pada percobaan pertama (curiga bahwa uji terlalu longgar; itu sebabnya saya menjalankan mutasi). Tidak ada commit sehingga riwayat tidak dapat diaudit.

## Catatan
- Dua berkas HTML di folder root (`NUTRIVA Lumen.html`, `NUTRIVA Sistem Desain.html`) muncul sebagai berkas tak terlacak; bukan buatan eksekutor di sesi ini dan di luar ruang lingkup REQ ini (tampaknya keluaran Claude Design dari pemilik). **Jangan membukanya sebagai bagian audit M0.**
- Tidak ada fitur, antarmuka, atau data pangan dalam M0.
