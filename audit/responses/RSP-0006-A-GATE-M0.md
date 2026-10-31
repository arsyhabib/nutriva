# RSP-0006 — Tanggapan atas RPT-0006 (gerbang M0)

- **Tanggal:** 2026-10-28 · Menunggu verifikasi ulang (REQ-0007). Vonis DITOLAK **diterima**.
- **Hasil lokal:** `npm run check` hijau: typecheck; **101 uji (8 berkas)**; `verify:claims` OK; `lint:fixtures` OK. Mutasi manual eksekutor ulang BELUM dijalankan setelah perbaikan.

| Temuan | Sikap | Tindakan |
|---|---|---|
| AUD-0006-01 (S0) kunci lapangan | Diterima | `src/engine/otorisasi.ts`: `bukaPintuData` + skema otorisasi; demo tidak pernah terbuka; lapangan butuh dasar izin, penandatangan tanda bahaya, keputusan status alat (tanpa "menunggu"), versi aturan sama, tanggal valid dan bukan masa depan; `TokenData` bermerek tipe; CLI `npm run cek:otorisasi`; uji `tests/pintu-data.test.ts` (termasuk uji arsitektur satu-pintu) dan `tests/cli.test.ts` |
| AUD-0006-02 (S1) verifikator | Diterima | Semua nilai numerik (angka, string angka, angka+satuan, larik) wajib punya `klaim_id` di simpul/induk, apa pun nama kunci; `data/**` dipindai; non-JSON (PDF) di `data/` ditolak; mutasi V1–V8 menjadi uji |
| AUD-0006-03 (S1) lint | Diterima | camelCase/Unicode dinormalisasi, kunci non-ASCII ditolak, token pengenal, NIK/telepon berpemisah, nama dalam nilai; mutasi L1–L6 menjadi uji. Batas (nama dalam teks bebas) dinyatakan di kode |
| AUD-0006-04 (S1) skema jejak | Diterima | label harus persis `LABEL_PROTOTIPE`; masukan/keluaran hanya angka/boolean/null/kode tertutup; `klaim_id` minimal satu. `dikarantina` boleh punya sumber di skema tetapi verifikator menolak pemakaiannya |
| AUD-0006-05 (S1) penerimaan risiko Opsi B | **Menunggu pemilik** | Draf kalimat disiapkan di pesan ke pemilik; LEDGER diisi setelah pemilik menulisnya |
| AUD-0006-06 (S1) .gitignore | Diterima | `*.pdf`, `*.docx`, `*.xlsx`, `**/sumber2*/`, `DESIGN_PACKAGE.zip`; HTML desain di root belum diputuskan (menunggu tinjauan T7) |
| AUD-0006-07 (S2) commit | Menunggu pemilik | Commit hanya atas permintaan |
| AUD-0006-08 (S2) CI/kasus baku | Diterima | `.github/workflows/check.yml`; `tests/golden/README.md`; `npm run gate:m1a` gagal bila < 30 kasus atau belum disetujui (diuji) |
| AUD-0006-09 (S2) ADR | **Belum** | ADR-0004 masih menyebut `tests/registri.test.ts`; seharusnya `tests/fase-tag.test.ts`. Belum diperbaiki |
| AUD-0006-10 (S2) konstanta kode | Diterima | `src/tools/konstantaKode.ts` dalam `verify:claims` untuk `src/engine/**` (batas: deklarasi baris-tunggal) |
| AUD-0006-11 (S3) vitest baru | Diterima | dipin ke 5.0.4 (16 hari saat dipasang) |

Pertanyaan 5 (daftar mutasi eksekutor): verifikator (karantina dibolehkan; konstanta tanpa klaim diabaikan; belum tanpa label), lint (kunci diabaikan), tag (tag ganda), jejak (label demo tidak wajib).
