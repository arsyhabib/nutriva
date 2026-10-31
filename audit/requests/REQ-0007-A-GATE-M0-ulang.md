# REQ-0007 — A-GATE M0 (ulang setelah RPT-0006)

- **Tanggal:** 2026-10-28 · Objek: pohon kerja tanpa commit. Jalankan: `$env:Path = "C:\Program Files\nodejs;" + $env:Path; npm run check` (hasil eksekutor: 101 uji hijau).
- **Tugas:** (1) verifikasi tiap tanggapan di `audit/responses/RSP-0006-A-GATE-M0.md`; (2) ulangi mutasi V1–V8 dan L1–L6 pada SALINAN dan cari mutasi baru yang lolos (verifikator, lint, skema jejak, gerbang `bukaPintuData`); (3) nilai `src/engine/otorisasi.ts`: adakah jalan memperoleh `TokenData` tanpa otorisasi sah; (4) nilai uji arsitektur satu-pintu; (5) vonis: M0 selesai? M1a boleh dimulai? Tulis `audit/reports/RPT-0007-*.md`, isi LEDGER 0007.
- **Belum dikerjakan eksekutor (jangan dianggap selesai):** AUD-0006-05 (menunggu pemilik), -07 (commit), -09 (ADR-0004 salah nama uji).
