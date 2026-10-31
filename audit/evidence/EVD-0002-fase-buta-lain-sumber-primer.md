# EVD-0002 — Fase buta: klaim lain dari sumber primer / sekunder terbaca

- **Dibuat oleh:** Auditor · **Tanggal:** 2026-10-28
- **Urutan:** dibuat SEBELUM membuka `docs/verifikasi_eksekutor/HASIL_VERIFIKASI.md`.
- **Lingkup:** klaim C-001…C-098 yang dapat dicek dalam sesi ini. Sisanya ditandai tidak diperiksa (lihat bagian akhir).

## A. Permenkes 2/2020 — teks resmi (PDF dari pasal.id, tautan redirect JDIH) — DIBACA LANGSUNG

Sumber: PDF "permenkes-no-2-tahun-2020", diekstrak dengan `pdftotext -layout` (teks lapisan tersedia). Salinan berada di scratchpad sesi auditor (`permenkes2_2020.pdf`, `p2020.txt`).

| Butir | Nilai di sumber primer | Lokasi |
|---|---|---|
| Penetapan / pengundangan | Ditetapkan 2 Januari 2020; diundangkan 8 Januari 2020 (LN 2020 No. 7) | halaman judul (pasal.id, bukan PDF halaman 1 — tercatat sebagai sekunder untuk tanggal) |
| Usia | "dihitung dalam bulan penuh" (2 bln 29 hari = 2 bln) | Penjelasan, ~baris 432 p2020.txt |
| PB vs TB | PB untuk **0–24 bulan** (terlentang); TB untuk **di atas 24 bulan** (berdiri) | ~baris 436–440 |
| Koreksi posisi | PB berdiri 0–24 bln → **+0,7 cm**; TB terlentang >24 bln → **−0,7 cm** | ~baris 440–445 |
| Pasal 4(2) BB/U | sangat kurang; kurang; normal; **risiko berat badan lebih** | Pasal 4 ayat (2) |
| Pasal 4(3) PB/U atau TB/U | sangat pendek; pendek; normal; tinggi | Pasal 4 ayat (3) |
| Pasal 4(4) BB/PB atau BB/TB | gizi buruk; gizi kurang; gizi baik; berisiko gizi lebih; gizi lebih; obesitas | Pasal 4 ayat (4) |
| Pasal 4(5) IMT/U 0–60 bln | gizi buruk; gizi kurang; gizi baik; berisiko gizi lebih; gizi lebih; obesitas | Pasal 4 ayat (5) |
| Pasal 6(4) | tabel kenaikan BB dan PB/TB untuk 0–24 bln: risiko *weight faltering* dan perlambatan pertumbuhan linear | Pasal 6 ayat (4) |
| Ambang BB/U | sangat kurang **< −3 SD**; kurang **−3 SD s.d. < −2 SD**; normal **−2 SD s.d. +1 SD**; risiko lebih **> +1 SD** | Bagian B, ~baris 500–506 |
| Ambang PB/U atau TB/U | sangat pendek **< −3**; pendek **−3 s.d. < −2**; normal **−2 s.d. +3**; tinggi **> +3** | ~baris 508–513 |
| Ambang BB/PB atau BB/TB | gizi buruk **< −3**; gizi kurang **−3 s.d. < −2**; gizi baik **−2 s.d. +1**; berisiko gizi lebih **> +1 s.d. +2**; gizi lebih **> +2 s.d. +3**; obesitas **> +3** | ~baris 514–522 |
| Ambang IMT/U 0–60 bln | gizi buruk **< −3**; gizi kurang **−3 s.d. < −2**; gizi baik **−2 s.d. +1**; berisiko gizi lebih **> +1 s.d. +2**, lalu **> +2 s.d. +3** dst. (tabel dibaca dari teks; batas gizi baik/berisiko tampak tidak konsisten dalam pemisahan kolom → perlu cek visual) | ~baris 524–531 |
| Metode tabel | Standar disajikan sebagai **tabel SD per bulan** (Tabel 1–16, mis. Tabel 1 BB/U laki-laki baris 600); bukan rumus LMS | Bagian C, baris 575–2794 |
| Dasar standar | WHO Child Growth Standards untuk 0–5 th; WHO Reference 2007 untuk 5–18 th | ~baris 430 |
| Tanpa penyebutan | LMS, rumus z-score, ambang BIV, penyesuaian ±3 SD, prematur, edema, sindrom: **tidak ditemukan** dalam teks Permenkes 2/2020 | grep p2020.txt |

**Catatan:** Ambang IMT/U 0–60 bulan memiliki dua baris "Gizi lebih" dan "Obesitas" yang tampak tergabung pada teks ekstraksi; saya tandai sebagai butuh pemeriksaan visual, bukan kesimpulan.

## B. AKG Permenkes/PMK 28/2019 — dibaca dari citra halaman (lihat EVD-0001)

Angka tambahan hamil dan menyusui (energi, protein), dan tambahan mikronutrien serta footnote besi 75% heme dan seng, tercantum di EVD-0001.

## C. WHO / UNICEF (sumber web yang diambil langsung dari situs WHO GHO)

| Klaim | Hasil fase buta | Sumber |
|---|---|---|
| MDD anak 6–23 bln = **≥ 5 dari 8** kelompok (IYCF 2021) | Terkonfirmasi. Definisi GHO: "at least five out of eight defined food groups during the previous day". Delapan kelompok: ASI; sereal/akar/umbi; kacang-kacangan/biji; susu & produk (termasuk susu formula); daging/ikan/unggas/organ; telur; buah-sayur kaya vitamin A; buah-sayur lain. Versi lama: 4 dari 7. | who.int GHO indicator page (diambil via WebFetch, 2026-10-28); sitasi WHO/UNICEF 2021 |
| MAD (MDD + meal frequency + dua kali minum susu untuk non-ASI) | Terkonfirmasi definisi MAD; angka frekuensi minimum tidak tertulis di halaman GHO | who.int GHO MAD page |

## D. Sumber sekunder (dibaca sebagai petunjuk, BUKAN verifikasi primer)

| Klaim | Hasil sekunder | Catatan |
|---|---|---|
| C-093/C-022 — PB/TB 24 bulan | Permenkes 2/2020 memakai PB untuk 0–24 bulan dan TB untuk >24 bulan (primer). WHO (menurut klaim register) memakai panjang <24 bln dan tinggi ≥24 bln. **Perbedaan batas tepat 24 bulan terdokumentasi** | Primer untuk Permenkes; WHO belum dibuka langsung |
| C-021 — BIV WHO | CDC SAS untuk WHO charts: BB/U < −6 atau ≥ +5; TB/U < −6 atau ≥ +6 (sekunder). Permenkes 2/2020 tidak memuat BIV. | Primer WHO Anthro manual tidak terbuka |
| C-030 — UL retinol 3000 µg | Sekunder (Drugs.com; artikel konsumen): 3000 µg RAE/hari untuk dewasa termasuk hamil; sebagian sumber menyebut retinol saja | Dokumen IOM 2001 tidak terbuka |
| C-010 — TTD | Sekunder: 60 mg besi elemental + 0,4 mg atau 0,25 mg folat; sumber saling bertentangan. Katalog SATUSEHAT/KFA (Kemenkes) mencantumkan produk Ferrous Fumarate 60 mg / Folic Acid 0,4 mg sebagai "tablet tambah darah" | Pedoman Kemenkes tidak terbuka |
| C-011 — LiLA < 23,5 cm = risiko KEK | Sekunder konsisten (skripsi/jurnal mengutip Kemenkes 2024 dan WHO 2015); dokumen Kemenkes primer tidak ditemukan | — |
| C-005 — Permenkes 21/2021 | Sekunder (BPK/pasal.id): Permenkes 21/2021 ditetapkan 12 Juli 2021; **pasal.id menyatakan tidak berlaku**; BPK (halaman Permenkes 2/2025) menyebut pencabutan, belum dikonfirmasi dari teks | Perlu cek status |
| C-005 — Perpres 72/2021 | Ditetapkan 5 Agustus 2021; terdaftar berlaku di BPK; draf pengganti disebut Bappenas (status belum dikonfirmasi) | — |
| C-004 — UU 27/2022 | Disahkan 17 Oktober 2022. Pasal 4 ayat (2) menyebut data spesifik termasuk **data dan informasi kesehatan** dan **data anak** (sekunder); Pasal 57 denda administratif (sekunder, sumber menyebut ≤2% pendapatan). Putusan MK tahun 2025 menyatakan kata "dan" pada Pasal 53(1)b bertentangan dengan UUD 1945 sejak 30 Juli 2025 (sekunder, anotasi MK) | Teks primer JDIH Kemenkeu ada, belum dibaca penuh |
| C-006/C-073 — TKPI/ketersediaan basis data harga | Tidak diperiksa dalam sesi ini | — |

## E. Yang tidak terbaca dalam fase buta ini

- Permenkes 41/2014 (pedoman gizi seimbang) — tidak dicari.
- Buku KIA edisi terbaru (C-007) — tidak dicari.
- WHO CGS 2006 dokumen komputasi z-score (C-020) — tidak terbuka langsung.
- IOM 2001 (C-030/C-031) — tidak terbuka langsung.
- FAO/WHO 2004 bioavailabilitas besi (C-028), IZiNCG (C-029) — tidak dicari.
- Gibson 2005 77% (C-032) — pencarian tidak menemukan angka 77%; tidak diverifikasi.
- Semua sitasi akademik (C-033–C-039, C-050–C-056), standar teknis (WCAG, SUS, CVI), dan basis data (C-070–C-077) — tidak diperiksa dalam sesi ini.
- Klaim penalaran (R-001–R-007) — bukan sumber tunggal; tidak dinilai di fase buta.
