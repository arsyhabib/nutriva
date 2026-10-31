# RPT-0006 — A-GATE M0: fondasi proyek tanpa fitur

- **Menjawab:** REQ-0006-A-GATE-M0-fondasi · **Jenis:** A-GATE (M0)
- **Auditor:** Auditor independen · **Tanggal:** 2026-10-28
- **Objek yang diaudit:** pohon kerja tanpa commit (git: 0 commit; 0 berkas ter-commit). Berkas: `src/`, `tests/`, `data/`, `docs/adr/`, `package.json`, `package-lock.json`, `.gitignore`, `tsconfig.json`, `vitest.config.ts`.
- **Bukti:** `audit/evidence/EVD-0006-hasil-antara-REQ-0006.md`; mutasi di salinan `scratchpad\mut`.

## VONIS

**DITOLAK sebagai gerbang M0: M0 BELUM SELESAI.**

- **M0 selesai?** Belum. `npm run check` hijau (53 uji, verifikator dan lint lulus), tetapi satu kontrol keselamatan yang menjadi dasar keputusan pemilik (Opsi B, profil `lapangan` terkunci) **tidak diimplementasikan** (AUD-0006-01, S0).
- **M1a boleh dimulai?** **Tidak.** Syarat penutupan ada di §8.
- **Tafsiran syarat 2–7 sebagai "definisi selesai M0" (RSP-0005):** **sah** dengan dua koreksi: (a) DoD M0 harus mencakup kunci lapangan dan CI/kasus baku kosong yang sudah disebut dokumen sendiri; (b) syarat 1 (keputusan pemilik) harus diperbarui untuk Opsi B (lihat AUD-0006-05).

## 1. Ringkasan (≤10 baris)
- `npm run check` lulus: 53 uji; typecheck; verifikator klaim; lint fixture; `npm audit` 0 kerentanan. Versi dependensi ada di npm dengan integritas sama seperti lock.
- Uji tag fase (ADR-0004) bekerja: satu tag diubah → 4 uji gagal. Kode engine bersih (tanpa DOM/jaringan/waktu acak; `strict`).
- **S0:** kunci `lapangan` (ADR-0001, v3 §0.3) tidak ada di kode; uji "profil lapangan terkunci" hanya memeriksa berkas tidak ada.
- **S1:** verifikator klaim dapat dilewati (6 dari 7 mutasi nyata lolos: nama kunci lain, array, string, huruf besar, folder lain).
- **S1:** lint fixture lolos camelCase (`namaAnak`, `tanggalLahir`), homoglif, nama di dalam nilai, telepon/NIK berpemisah (6 dari 6 mutasi lolos).
- **S1:** skema jejak menerima label demo sembarang dan teks bebas identitas dalam masukan.
- **S1:** belum ada penerimaan risiko S0 tertulis untuk Opsi B; kutipan pemilik sah sebagai pilihan tetapi tidak menyebut konsekuensinya.
- **S1:** `.gitignore` tidak menangkap PDF sumber di luar `sumber/`; berkas tak terlacak di akar belum diatur.
- S2: belum ada commit baseline; belum ada CI dan kasus baku kosong; ADR merujuk test yang tidak ada.

## 2. Ruang lingkup dan metode
- **Diperiksa:** kode engine dan skema; verifikator; lint fixture; uji tag; `.gitignore`; `package.json` dan lock; ADR; syarat 1–7 RPT-0005 §10.
- **Metode:** (a) `npm run check` pada pohon kerja (langkah 2); (b) mutasi pada salinan di scratchpad (lihat EVD-0006 §2–§5); (c) pembacaan kode; (d) pemeriksaan rantai pasok read-only (`npm view`, `npm audit`); (e) penelusuran improvisasi (§6).
- **Lingkungan:** Windows 11; Node v24.22.1 (dari `C:\Program Files\nodejs`); npm 11.x; PowerShell 5.1 untuk mutasi, berkas JSON ditulis tanpa BOM (uji awal dengan BOM dibuang).

## 3. Temuan bernomor

| ID | Tingkat | Keyakinan | Ringkasan | Status |
|---|---|---|---|---|
| AUD-0006-01 | **S0** | TERKONFIRMASI | Kunci teknis profil `lapangan` tidak diimplementasikan (tidak ada pembacaan `otorisasi.lokal.json`, tidak ada validasi `dasar_izin`/`penandatangan_tanda_bahaya`/`keputusan_status_alat`/`versi_aturan`, tidak ada gerbang). Uji `pagar-repo` bernama "profil lapangan terkunci" hanya memeriksa berkas tidak ada. Opsi B (v3 §0.3) bergantung pada kunci ini | Terbuka: blok M0 |
| AUD-0006-02 | S1 | TERKONFIRMASI | Verifikator klaim dapat dilewati. Lolos: `energi_kkal`, `batas_atas`, `Nilai` (huruf besar), `nilai: [800,900]`, `nilai: "800"`, dan berkas di luar `data/aturan`/`data/bahan` (`data/menu.json`). Pemindai hanya `.json` dan hanya dua folder; `src/` tidak dipindai. Kontrol dan karantina TTD tetap tertangkap (V0, V7) | Terbuka |
| AUD-0006-03 | S1 | TERKONFIRMASI | Lint fixture lolos: `namaAnak`, `tanggalLahir` (camelCase), `nаma` (homoglif Kiril), nama dalam nilai ("anak bernama Budi"), telepon `0812-3456-7890`, NIK `3201 2345 6789 0001`. Denylist kunci + regex digit berurutan | Terbuka |
| AUD-0006-04 | S1 | TERKONFIRMASI | `JejakSchema`: label profil `demo` hanya diperiksa keberadaannya (`label: "x"` lolos); `masukan` menerima teks bebas identitas (`"anak Budi"` lolos). Komentar "tidak memuat teks bebas" tidak ditegakkan. `KlaimSchema`: status `dikarantina` dengan sumber terisi lolos | Terbuka |
| AUD-0006-05 | S1 | TERKONFIRMASI | Opsi B belum memiliki penerimaan risiko S0 tertulis. Kutipan pemilik ("pakai opsi b … tentukan keputusan untuk saya") sah sebagai pilihan, tetapi tidak menyebut bahwa data nyata akan dapat diproses sebelum etik (lewat kunci) dan bahwa kunci belum ada. LEDGER "Risiko diterima pemilik" kosong | Terbuka: butuh kalimat pemilik |
| AUD-0006-06 | S1 | TERKONFIRMASI | `.gitignore` tidak mencakup PDF sumber di luar `sumber/` (`data/bahan/buku_kia_2024.pdf` dan `sumber2/tkpi.pdf` tidak diabaikan). `DESIGN_PACKAGE/`, `DESIGN_PACKAGE.zip`, dan dua berkas HTML akar belum diatur (isi tidak diperiksa) | Terbuka |
| AUD-0006-07 | S2 | TERKONFIRMASI | Belum ada commit (`git log`: tidak ada). Objek audit tidak dapat ditunjuk dengan hash commit; reproduksi bergantung pada SHA berkas | Terbuka (keputusan pemilik) |
| AUD-0006-08 | S2 | TERKONFIRMASI | Belum ada CI uji (`.github/` tidak ada) dan kasus baku kosong (`golden/` tidak ada), padahal STRATEGI M0 dan RPT-0005 §9 mencantumkannya | Terbuka |
| AUD-0006-09 | S2 | TERKONFIRMASI | ADR-0004 merujuk `tests/registri.test.ts` (tidak ada; yang ada `tests/fase-tag.test.ts`). ADR-0001..0005 masih berstatus "Diusulkan" | Terbuka |
| AUD-0006-10 | S2 | TERKONFIRMASI | Verifikator dan lint tidak memeriksa `src/` dan berkas data non-JSON. INV-04 belum dapat dijaga untuk konstanta kode (aman untuk M0 karena belum ada konstanta, tetapi wajib sebelum M1a) | Terbuka (syarat M1a) |
| AUD-0006-11 | S3 | TERKONFIRMASI | Rantai pasok: vitest 5.0.5 dipublikasikan 15 Okt 2026 (13 hari sebelum audit); esbuild dan fsevents memiliki skrip instalasi (dipasang dengan `--ignore-scripts`). Tidak ada kerentanan (`npm audit`, 0). Integritas paket cocok dengan lock | Dicatat |

## 4. Jawaban per permintaan khusus

### Permintaan 1 — Celah verifikator klaim
Dijawab dengan mutasi (EVD-0006 §2). Lolos: nama kunci lain (V2), huruf besar (V4), batas (V5), array (V1), string (V3), berkas di luar folder (V6). Tertangkap: konstanta tanpa klaim (V0), klaim karantina (V7). Penyebab di kode: `KUNCI_KONSTANTA` berupa Set sensitif huruf besar; cek hanya `typeof === "number"`; `telusuri` tidak memindai `src/`. **Perbaikan:** (a) pindai semua nilai numerik di bawah kunci apa pun, bukan denylist nama; (b) pindai `data/**` (semua tipe) dan `src/**` untuk konstanta bertanda; (c) tolak angka sebagai string bila di kunci bernilai; (d) uji ke-6 mutasi di atas dalam `tests/` (uji pencegah).

### Permintaan 2 — Celah lint fixture
Dijawab dengan mutasi (EVD-0006 §3). Denylist berbasis nama tidak cukup. **Perbaikan:** (a) normalisasi camelCase (`namaAnak` → `nama_anak`) dan Unicode (NFKD + hapus diakritik + tolak non-ASCII pada kunci); (b) pemindai nilai untuk pola nama lazim (kata "bernama", "anak"+kata kapital) hanya sebagai peringatan, karena nama tidak bisa dikenali dengan pasti; (c) pola telepon dan NIK toleran pemisah; (d) uji pencegah untuk tiap mutasi L1–L6.

### Permintaan 3 — Mutasi suite (≥5)
Dilakukan 15 mutasi pada salinan:
- Verifikator: 8 mutasi (V0–V7). Kontrol V0 dan V7 tertangkap; mutasi nyata V1–V6 **6 dari 6 lolos**.
- Lint: 8 mutasi (L0–L7). Kontrol L0 dan L7 tertangkap; mutasi nyata L1–L6 **6 dari 6 lolos**.
- Skema: 3 (I1, I2, I4) lolos; I3 kontrol ditolak.
- Tag registri: 1 mutasi tertangkap (4 uji gagal).

Suite kuat untuk **tag** dan **kontrol dasar**, lemah untuk **verifikator dan lint** (yang justru menjadi pagar S0/S1). Klaim eksekutor "6 dari 6 tertangkap" tidak dapat saya ulang karena daftar mutasinya tidak ada di EVD-0006 eksekutor; saya tidak menilai angkanya.

### Permintaan 4 — Kontrak skema untuk INV-04/INV-05 pada M1a
- **INV-04** (setiap konstanta punya `claim_id` valid): skema tidak memeriksa; hanya verifikator (lihat AUD-0006-02, -10). Kurang: aturan wajib pada JSON skema aturan (`claim_id` wajib untuk setiap nilai numerik), pemeriksaan kode untuk konstanta.
- **INV-05** (jumlah per bahan = total; tiap langkah menunjuk klaim): `JejakSchema` memeriksa `klaim_id` ada dan nomor langkah berurutan; **tidak** memeriksa kesesuaian jumlah (itu bukan tugas skema; perlu uji properti di mesin M1a). Kurang: uji properti "jumlah langkah = total" dan "setiap langkah klaim_id tidak kosong".
- **INV-17** (teks pengguna tidak ditafsirkan): skema menerima string bebas (AUD-0006-04). Kurang: batasi `masukan` pada angka, boolean, dan kode tertutup; tolak string bebas.
- **Kesimpulan:** kontrak skema belum cukup untuk M1a. Perbaikan di §8.

### Permintaan 5 — Syarat 1–7 RPT-0005 §10

| # | Syarat | Status | Bukti dan catatan |
|---|---|---|---|
| 1 | Keputusan pemilik dengan kalimatnya sendiri | **SEBAGIAN** | Kutipan Opsi B ada di LEDGER dan v3 §0. Tetapi RPT-0005 mensyaratkan keputusan tentang Opsi A dan ketiadaan data nyata; Opsi B mengubah premis itu. Kutipan memuat "tentukan keputusan untuk saya" (delegasi). Perlu kalimat pemilik tentang Opsi B dan residual S0 (AUD-0006-05) |
| 2 | Karantina teknis TTD | **SEBAGIAN** | Dua klaim dikarantina di `claims.json`; verifikator menolak pemakaian (V7 tertangkap; uji karantina lulus). Kelemahan: pemakaian lewat nama kunci lain, string, atau berkas di luar folder dapat lolos (AUD-0006-02). Angka TTD dalam skema sumber tidak diperiksa |
| 3 | Tanpa data nyata/fixture nyata | **SEBAGIAN** | Fixture diberi `sintetis: true` (2 berkas, isi sintetis); `.gitignore` menutup `sumber/*`. Lint fixture lolos mutasi nama (AUD-0006-03). PDF sumber di luar `sumber/` tidak diabaikan (AUD-0006-06) |
| 4 | Arsip V8 tidak diimpor/dijalankan | **TERPENUHI** (dengan catatan) | `.gitignore` memuat zip dan `audit/evidence/legacy_v8/`; grep kode tidak menemukan impor. Uji `pagar-repo` memeriksa enam berkas tertentu saja; cukup untuk M0 |
| 5 | Git diinisialisasi, `.gitignore`, tanpa rahasia | **TERPENUHI** (dengan catatan) | `git init` (main) ada; `.gitignore` ada; pencarian kata kunci kosong. Catatan: belum ada commit (AUD-0006-07); `.gitignore` belum lengkap (AUD-0006-06); `package-lock.json` ada dan dikunci |
| 6 | Skema tag dibekukan | **TERPENUHI** | `data/fase_tag.snapshot.json` (153 ID); uji 153, per-fase, dan deteksi perubahan lulus; mutasi tag tertangkap. Catatan ADR-0004 merujuk berkas uji yang tidak ada (AUD-0006-09) |
| 7 | ADR awal | **SEBAGIAN** | ADR-0001..0005 ada dan masuk akal; tetapi ADR-0001 menjanjikan penguncian teknis yang tidak ada (AUD-0006-01); ADR masih "Diusulkan" (AUD-0006-09) |

### Permintaan 6 — Rantai pasok
- `package.json`: 5 dependensi, semuanya versi eksak (tanpa `^`/`~`). `package-lock.json`: lockfileVersion 3, 112 paket, semua `resolved` dari `registry.npmjs.org`, integritas cocok dengan `npm view` untuk kelima paket utama.
- `npm view` (baca saja): typescript 7.0.2 dipublikasi 2026-07-08; vitest 5.0.5 2026-10-15 (13 hari); tsx 4.23.15 2026-09-20; @types/node 26.6.5 2026-10-09; zod 4.6.7 2026-10-12. Semua ada di registri.
- **Kekhawatiran:** tidak ada paket tak dikenal. vitest 5.0.5 baru (13 hari) — dicatat S3 (AUD-0006-11); aturan 2 minggu di CLAUDE.md untuk CDN, bukan npm, tetapi tetap disarankan.
- `esbuild` dan `fsevents` memiliki skrip instalasi; `--ignore-scripts` dipakai. Jika `esbuild` memerlukan postinstall pada platform tertentu, `npm run check` dapat gagal pada mesin lain; belum diuji di mesin lain.
- `npm audit`: 0 kerentanan (2026-10-28).

### Permintaan 7 — Vonis (lihat VONIS di atas)
- M0: **DITOLAK** (belum selesai). Dapat dinilai ulang setelah §8.
- M1a: **tidak boleh dimulai.**

## 5. Syarat penutupan sebelum M0 dinyatakan selesai (§8)
Semua wajib, dengan bukti yang dapat diulang auditor (`npm run check` + uji baru):
1. **AUD-0006-01:** implementasikan gerbang profil `lapangan`: fungsi murni yang menerima profil dan berkas otorisasi (skema Zod: `dasar_izin`, `penandatangan_tanda_bahaya`, `keputusan_status_alat`, `versi_aturan`); menolak bila tidak valid; uji: build `lapangan` tanpa otorisasi → tolak; dengan otorisasi tidak lengkap → tolak; profil `demo` tidak pernah menerima data nyata (uji). Uji "pagar" yang sekarang hanya memeriksa berkas harus diganti.
2. **AUD-0006-02:** perbaiki verifikator (§4 Permintaan 1) dan tambahkan 6 mutasi V1–V6 sebagai uji.
3. **AUD-0006-03:** perbaiki lint fixture (§4 Permintaan 2) dan tambahkan mutasi L1–L6 sebagai uji.
4. **AUD-0006-04:** batasi `JejakSchema.masukan` pada tipe non-teks bebas; `label` demo harus persis `LABEL_PROTOTIPE`; `dikarantina` tidak boleh punya sumber (atau tidak diizinkan dipakai).
5. **AUD-0006-05:** kalimat pemilik tertulis sendiri tentang Opsi B dan residual S0 (profil lapangan hanya setelah otorisasi valid), dicatat di LEDGER "Risiko diterima pemilik" dengan batas tinjau.
6. **AUD-0006-06:** `.gitignore`: tambahkan `*.pdf` di luar folder tertentu (atau `data/**/*.pdf`, `**/sumber*/`), dan putuskan status `DESIGN_PACKAGE/` serta berkas HTML akar (ignore atau tracked) sebelum commit.
7. **AUD-0006-08:** CI uji minimal (`npm run check` pada setiap perubahan) dan folder kasus baku kosong dengan uji yang tahu bahwa kasus kosong tidak boleh dianggap lulus.
8. **AUD-0006-07/-09:** commit baseline bila pemilik setuju; ADR-0004 diperbaiki (nama uji); ADR disetujui pemilik atau eksplisit "menunggu".

**Syarat M1a (tambahan, dari RPT-0005 §10 dan RSP-0005):** kontrak sumber primer B01/B03; penutupan AUD-0005-01, -02, -04, -07, -15; dependensi A12/A19 (RSP-0005 sudah menerima); kriteria T-06 (AUD-0005-16) dengan pemetaan 30 bahan; J13 untuk `demo` disetujui pembimbing (v3 §0.7).

## 6. Penelusuran improvisasi (≥30% usaha; buatan auditor)
Porsi usaha kira-kira 40% dari audit ini dihabiskan untuk penelusuran di luar daftar REQ:
- **I-A (kunci lapangan dengan mengubah konstanta):** pada profil `lapangan` tidak ada gerbang; siapa pun yang mengubah `PROFIL_RILIS` atau menambah `if` akan lolos (tidak diuji). Termasuk AUD-0006-01.
- **I-B (berkas sumber disalin ke `data/`):** `data/bahan/buku_kia_2024.pdf` tidak diabaikan (AUD-0006-06). Lebih buruk: `data/bahan/*.json` dengan angka dari PDF tanpa `claim_id` akan dibaca verifikator hanya bila kunci namanya pas; tidak terdeteksi bila nama kunci berbeda (AUD-0006-02).
- **I-C (nama di nilai fixture):** `"keterangan": "anak bernama Budi"` lolos (AUD-0006-03). Tidak ada cara teknis yang andal mendeteksi nama; ini batas pagar teknis, dan harus ditulis sebagai aturan kode-tinjau (DoD M1a).
- **I-D (salinan jejak demo dengan label palsu):** `label: "x"` lolos (AUD-0006-04). Pengguna `demo` tidak melihat label jika frontend menampilkannya dari jejak; belum ada frontend, tetapi label harus berasal dari konstanta, bukan dari data.
- **I-E (stempel uji hijau):** `npm run check` hijau karena uji tidak memeriksa yang seharusnya (lapangan, bypass). Hijau hanya membuktikan yang diuji. Ini bukan temuan terpisah; menjadi dasar AUD-0006-01 dan -08.
- **I-F (dependensi baru diam-diam):** tidak ada dependensi di luar lima paket; `package-lock.json` 112 paket transitif. Tidak ada temuan.
- **I-G (karantina lewat folder baru):** `data/aturan` dan `data/bahan` diperiksa; `data/` lain tidak. Termasuk AUD-0006-02.
- **I-H (tanggal dan zona):** `Date.now` tidak ada di `src/`; ini baik (INV-11, INV-16 belum diuji karena belum ada logika tanggal).
- **I-I (pesan galat CLI):** karantina hanya tercatat sebagai teks di stderr; CI bisa mengabaikan teks. Saran: keluar dengan kode berbeda per jenis galat (kecil; S4).

Hasil: sembilan penelusuran; empat menghasilkan temuan baru yang belum tercatat di RPT lain (I-A, I-B, I-D, I-G) yang sudah masuk AUD-0006-01..06; satu (I-C) dinyatakan batas pagar teknis. Tidak ada temuan dari I-F dan I-H.

## 7. Yang TIDAK saya periksa
- **Berkas HTML akar dan `DESIGN_PACKAGE/`** (di luar ruang lingkup REQ-0006; tidak dibuka). Ketegangan dengan `.gitignore` dinilai dari nama saja (AUD-0006-06).
- **Penerapan lapangan di tempat lain** (frontend, server): belum ada.
- **Kesesuaian dengan data nyata atau AKG:** tidak ada data pangan M0; tidak dinilai.
- **Uji mutasi eksekutor (6 dari 6):** daftar mutasinya tidak tersedia; angka tidak diulang.
- **Determinisme lintas peramban (J12) dan ukuran bundel:** belum ada prototipe; ADR-0005 menunda.
- **Kebenaran isi ADR** (keputusan arsitektur) selain status dan konsistensi dengan kode; tidak dinilai secara teknis mendalam.
- **Commit atau keadaan git:** tidak diubah (dilarang); hanya dibaca.
- **Instalasi di mesin lain:** tidak diuji; `--ignore-scripts` belum diverifikasi lintas platform.
- **Lisensi dan kelayakan TKPI/USDA/WHO:** di luar M0 (REQ terpisah).

## 8. Vonis dan langkah berikutnya
- **M0:** DITOLAK (belum selesai). Penilaian ulang melalui REQ baru (REQ-0007) setelah §5 butir 1–8 ditutup, dengan uji pencegah baru dan `npm run check` hijau.
- **M1a:** tidak boleh dimulai sebelum AUD-0006-01..-05 tertutup dan syarat M1a di §5 terpenuhi.

## 9. Pertanyaan untuk eksekutor
1. Apakah gerbang `lapangan` akan berupa fungsi tunggal yang dipanggil setiap jalur data? Bagaimana dijamin tidak ada jalur lain?
2. Mengapa `JejakSchema.masukan` menerima string? Adakah kebutuhan nyata untuk masukan teks?
3. Apakah `data/` akan memuat PDF? Jika ya, di mana?
4. Apakah commit baseline akan dibuat setelah audit ini, dan oleh siapa (pemilik)?
5. Apa isi daftar mutasi "6 dari 6" pada REQ-0006? Mohon dilampirkan agar dapat diulang.

## 10. Rekomendasi audit berikutnya
- **A-IMPL** pada gerbang `lapangan` (begitu ditulis) dengan mutasi pencegah.
- **A-SAFE** pada daftar B01/B03 setelah sumber primer diterima.
- **A-DATA** pada pemetaan T-06 (30 bahan) sebelum M1a.

## 11. Verifikasi ulang (diisi setelah RSP)
| Temuan | Bukti verifikasi ulang | Hasil |
|---|---|---|
| AUD-0006-01..06 | — | Terbuka |
| AUD-0006-07..10 | — | Terbuka |
| AUD-0006-11 | — | Dicatat |
