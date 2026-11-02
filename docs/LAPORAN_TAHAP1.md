# Laporan Tahap 1 (Hari 1, bagian data) — 2026-11-02

## Hasil
| Item | Status |
|---|---|
| Enam tabel SD (BB/U, PB/U, BB/PB × L/P) di `data/tabel_sd/` | Selesai; 0 selisih terhadap tabel WHO dan hitung ulang LMS |
| Pencocokan visual ke Permenkes 2/2020 | BB/U L (hlm. 16–17), BB/U P (34–35), PB/U L (19), PB/U P (37): seluruh baris 6–23 bulan cocok di kolom terbaca. BB/PB: sampel 25 baris L (hlm. 22) dan 25 baris P (hlm. 41) cocok |
| AKG anak 6–11 bulan dan 1–3 tahun (36 zat) `data/akg_anak.json` | Selesai; dibaca dua kali dari PDF Permenkes 28/2019; nilai makro, vit A, besi, seng, kalsium, folat, vit C selaras dengan pembacaan awal |
| Sumber dan klaim | `data/sources.json` (3 sumber), `data/claims.json` (+7 klaim); lolos skema Zod `klaim.ts` |
| Keputusan K-08..K-13, D-1 | Ditulis di `KEPUTUSAN_DAN_JALUR_RILIS.md` §00 dan `CLAUDE.md` |
| Golden test | 129 kasus (`tests/golden/kasus_status.json`) dengan penghitung independen `hitung_golden.py` |
| Prompt pemeriksaan silang | `docs/periksa/` |
| Prompt Claude Code Hari 1 | `docs/prompt/HARI1_CLAUDE_CODE.md` |

## Yang belum, dan jujur
1. Kolom merah (−3/−2/+2/+3 SD) sulit dibaca pada resolusi layar; kolom itu ditopang hitung ulang LMS dan perlu diperiksa silang (`PROMPT_PERIKSA_SILANG.md`).
2. BB/PB baru 50 dari 262 baris yang dicek visual (status klaim `belum`, wajib berlabel).
3. Catatan kaki besi, seng (Tabel 3) dan faktor aktivitas fisik (Tabel 1) terpotong saat dibaca; teksnya perlu dibaca ulang penuh sebelum dikutip. Jangan memakai kalimat "75% besi heme" dari pembacaan awal: pembacaan ulang menunjukkan potongan "non-heme", jadi tertulis ambigu.
4. Buku KIA 2024, TKPI, pedoman TTD: tidak dapat diunduh dari sini. Tidak memblokir Hari 2 (data bahan memakai USDA, K-06 menunda TKPI).
5. Keputusan pemilik terbuka: tidak ada lagi yang menghalangi: D-1, D-6, lisensi, AI, hosting diputuskan eksekutor 2026-11-02 (lihat KEPUTUSAN §00).
6. PDF sumber tidak tersimpan di `sumber/` (jaringan terbatas); URL dan nomor halaman tercatat di `sources.json` dan `claims.json`.

## Hasil `npm run check` di terminal cloud (2026-11-02)
Dijalankan di salinan proyek (Node 22, npm 10, bukan Node 24 di laptop): typecheck lulus; 8 berkas uji, 106 uji lulus; `verify:claims` OK (9 klaim, 3 sumber, 7 berkas data, 7 rujukan); `lint:fixtures` OK.
Temuan saat uji: verifikator menolak klaim berstatus `belum` tanpa `label_belum_diverifikasi: true`; sudah diperbaiki pada `bbpb_L.json`, `bbpb_P.json`, `akg_anak.json`.
Catatan: `vitest` 5.0.4 membutuhkan `vite` (peer dependency) yang tidak tercantum di `package.json`; npm 10 gagal memasangnya otomatis. Claude Code akan menambahkan Vite eksak pada Hari 1 (langkah 5).
