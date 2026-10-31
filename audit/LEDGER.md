# LEDGER Audit NUTRIVA

Satu baris per permintaan audit. Eksekutor mengisi kolom REQ dan Tanggapan; auditor mengisi RPT, Vonis, dan Temuan; pemilik produk mengisi Keputusan.

| No | Jenis | Objek | REQ | RPT | Vonis | S0 | S1 | S2 | Tanggapan (RSP) | Keputusan pemilik | Gerbang |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 0001 | A-SRC-0 | Verifikasi register klaim `08_` | REQ-0001-A-SRC-0-verifikasi-klaim | RPT-0001-A-SRC-0 | DITOLAK | 0 | 3 | 2 | RSP-0001-A-SRC-0 (semua diterima; klaim dikarantina) | | Pra-M0 |
| 0002 | A-SPEC-0 | Registri + Strategi + Tasklist | REQ-0002-A-SPEC-0-audit-rancangan | RPT-0002-A-SPEC-0 | DITOLAK | 2 | 7 | 8 | RSP-0002-A-SPEC-0 (diterima hampir semua; R11 ditolak; D1–D6 menunggu keputusan pemilik) | | Pra-M0 |
| 0003 | A-SRC lanjutan | Verifikasi ulang RSP-0001/0002 + 4 klaim | REQ-0003-verifikasi-ulang-RSP-0001-0002 | RPT-0003-verifikasi-ulang | DITOLAK (AUD-0001-01 TTD tetap S1 terbuka) | 0 | 1 | 3 | RSP-0003-verifikasi-ulang (semua diterima; TTD ditutup sebagian) | | Pra-M0 |
| 0004 | A-SPEC-1 | Keputusan pemilik, jalur rilis, ruang lingkup M1 | REQ-0004-A-SPEC-1-keputusan-dan-jalur-rilis | RPT-0004-A-SPEC-1 | TIDAK LAYAK memulai M0 untuk V-PJBL (syarat LAYAK BERSYARAT 1-8) | 4 | 4 | 4 | RSP-0004-A-SPEC-1 (semua diterima; Opsi A: tanpa data nyata; M1 dibagi M1a/M1b) | | Pra-M0 |
| 0005 | A-SPEC-2 | Keputusan v2 (Opsi A) + kelayakan M0 | REQ-0005-A-SPEC-2-verifikasi-keputusan-v2 | RPT-0005-A-SPEC-2 | LAYAK BERSYARAT untuk M0 (fondasi tanpa fitur); syarat 1–7 RPT-0005 §10 | 5 | 8 | 3 | | | Pra-M0 |
| 0006 | A-GATE M0 | Fondasi proyek tanpa fitur (53 uji, verifikator klaim, lint fixture, tag beku, ADR-0001…0005) | REQ-0006-A-GATE-M0-fondasi | RPT-0006-A-GATE-M0 | DITOLAK: M0 belum selesai (kunci lapangan tidak ada); M1a tidak boleh dimulai | 1 | 5 | 4 | | | M0 |
| 0007 | A-GATE M0 (ulang) | Verifikasi perbaikan RPT-0006 | REQ-0007-A-GATE-M0-ulang | | | | | | | | M0 |
| 0008 | A-IMPL | Celah `{} as TokenData` ditutup; ADR-0004/0005 diperbaiki. Diubah **setelah** REQ-0007 dikirim: `src/engine/otorisasi.ts`, `tests/pintu-data.test.ts`, `docs/adr/ADR-0004`, `ADR-0005`. REQ-0007 menilai keadaan sebelum perubahan (hash di REQ-0008) | REQ-0008-A-IMPL-tutup-celah-tokendata | | | | | | | | M0 |

## Risiko diterima pemilik
| Tanggal | Temuan | Tingkat | Alasan tertulis pemilik | Batas waktu tinjau |
|---|---|---|---|---|

## Keputusan pemilik (ringkas)
| Tanggal | Keputusan | Terkait |
|---|---|---|
| 2026-10-28 | Setuju seluruh saran eksekutor (D1–D6); keputusan terbaik diserahkan ke eksekutor | RSP-0002; `KEPUTUSAN_DAN_JALUR_RILIS.md` K-01 |
| 2026-10-28 | Auditor tetap di Claude Desktop (bukan VS Code) | K-02 |
| 2026-10-28 | Etik diurus setelah aplikasi siap dan lulus PjBL; dosen verifikator memverifikasi setelah PjBL; TKPI diurus saat kompetisi | K-04, K-05, K-06; menyentuh S0 R02/R06 |
| 2026-10-28 | "tentukan keputusan untuk saya tanpa mengurangi kualitas dan cakupan kebermanfaatan aplikasi yang akan kita buat, pakai opsi b, etik akan diurus dengan dosen nanti, sekarang kita kerjakan saja aplikasinya dulu" (kutipan pemilik) | `KEPUTUSAN_DAN_JALUR_RILIS.md` v3 §0; ADR-0001. Data nyata hanya melalui profil `lapangan` yang terkunci otorisasi; belum ada penerimaan risiko S0 |
| 2026-10-31 | Desain: paket **NUTRIVA Rona** dipilih sebagai basis desain. Tinjauan eksekutor: `docs/desain/TINJAUAN_RONA.md` (RN-01…RN-13; perbaikan wajib RN-01, RN-02, RN-03, RN-05 belum dikerjakan) | `TASKLIST.md` §4; batas mutlak `DESIGN_PACKAGE/05` |
| 2026-10-31 | Commit baseline `50f0c40` di `main` atas permintaan pemilik ("Ya, commit"). Desain HTML dan `DESIGN_PACKAGE/` tidak di-commit | AUD-0006-07 |

## Catatan perubahan paket auditor
| Tanggal | Versi | Perubahan |
|---|---|---|
| 2026-10-28 | 1.0 | Paket awal |
