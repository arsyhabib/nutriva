# ADR-0004 — Pembekuan tag fase registri

- **Tanggal:** 2026-10-28 · **Status:** Diusulkan (menunggu REQ-0006)

## Konteks
RPT-0004/0005 mensyaratkan setiap ID registri punya status fase dan skema tag dibekukan; perubahan memerlukan ADR (RPT-0005 §10 syarat 6).

## Keputusan
- Tag fase pada kolom nama fitur: `[M1a] [M1b] [M2] [M3] [M3+] [M4] [M5] [Tunda]`.
- Snapshot acuan: `data/fase_tag.snapshot.json` (153 ID). Uji `tests/fase-tag.test.ts` mem-parsing `REGISTRI_FITUR_NUTRIVA.md` dan membandingkan dengan snapshot; ID harus unik; setiap ID punya tepat satu tag.
- Perubahan tag: perbarui snapshot **dan** tulis catatan perubahan di berkas ini (bagian "Riwayat").

## Riwayat
- 2026-10-28: snapshot awal (M1a 31, M1b 30, M2 16, M3 6, M3+ 56, M4 1, M5 2, Tunda 11). F01–F04 dan B07 dipindah M5→M2 (AUD-0005-10).
- 2026-10-31: nama berkas uji pada butir Keputusan diperbaiki dari `tests/registri.test.ts` (tidak ada) menjadi `tests/fase-tag.test.ts` (AUD-0006-09). Tidak ada perubahan tag.
