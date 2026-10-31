# RSP-0002 — Tanggapan atas RPT-0002 (A-SPEC-0)

- **Tanggal:** 2026-10-28 · **Penulis:** Eksekutor · **Status:** sebagian menunggu keputusan pemilik; sebagian menunggu verifikasi ulang (REQ-0003)

Vonis DITOLAK sebagai dasar M0 **diterima**. M0 tidak dimulai.

## Catatan metodologis tentang laporan
1. RPT-0002 menyebut "AUD-0002-01 sampai -03" di vonis, tetapi **ID itu tidak didefinisikan**; temuan hanya ada sebagai R01–R17. Mohon diberi nomor resmi (lihat REQ-0003).
2. Klaim "daftar Fondasi P0 memuat ratusan ID" **tidak akurat**: baris Fondasi memuat 21 rentang ± 75 ID; seluruh registri 143 ID dengan **80 P0, 56 P1, 7 P2** (hitungan `grep` saya). Kesimpulan auditor (terlalu besar untuk MVP) **tetap benar**: 80 P0 terlalu banyak.
3. R11 (kunci Supabase di V8) berpremis **keliru**: `config.js` V8 berisi placeholder kosong. Premis itu berasal dari kesalahan **saya** di `10_RINGKASAN_LEGACY_V8.md`, yang sudah dikoreksi. Tidak ada kunci.
4. Auditor menyarankan A04 ditunda sekaligus mempertahankan "kalkulator status anak minimal"; kedua kalimat tidak konsisten. Saya membaca maksudnya: A04 tidak di M1 tetapi di M2.

## Tanggapan per risiko/temuan

| ID | Tingkat | Sikap | Tindakan |
|---|---|---|---|
| R02 data anak sebelum etik | S0 | **Diterima** | Registri B10: data nyata hanya setelah etik+persetujuan; sebelum itu sintetis. Pemilik harus memastikan status etik (pertanyaan terbuka) |
| R06 tanda bahaya belum baku | S0 | **Diterima** | B11: daftar bertanda dosen = gerbang M2; tanpa itu aplikasi tidak dirilis |
| R01 lisensi TKPI | S1 | **Diterima** | Blocker M3; keputusan tertulis/izin; alternatif: USDA FDC (CC0, terkonfirmasi), data TKPI hanya dipakai bila hak jelas |
| R03 status alat kesehatan | S1 | **Diterima** | Pertanyaan ke dosen/instansi; sebelum itu aplikasi diposisikan sebagai edukasi dan alat bantu hitung, tanpa klaim diagnosis |
| R05 determinisme lintas peramban | S1 | **Diterima** | INV-02 direvisi; J12 uji lintas peramban; klasifikasi memakai tabel resmi |
| R07 kategori khusus | S1 | **Diterima** | B12 (tandai dan rujuk) |
| R08 service worker | S1 | **Diterima** | J09 |
| R10 HP bersama | S1 | **Diterima** | J10 |
| R14 dua standar | S1 | **Diterima** | ADR di M0 setelah keputusan dosen (lihat RSP-0001 AUD-0001-04) |
| R04 skor A10 | S2 | **Diterima** | A10 ditangguhkan (P2); komponen ditampilkan apa adanya |
| R09 IndexedDB hilang | S2 | **Diterima** | Ekspor manual dan peringatan (masuk G08/J01 saat M1) |
| R11 kunci V8 | S2 | **Ditolak (premis keliru)** | Lihat catatan 3. Tetap: V8 tidak diimpor |
| R12 lembar review dosen | S2 | **Diterima** | Uji alur dengan sampel pada M3 |
| R13 stigma | S2 | **Diterima** | L11 dan B14 (pustaka kalimat terlarang) |
| R15 threat model | S2 | **Diterima** | J11 |
| R16 satu dosen | S2 | **Diterima** | Pertanyaan untuk pemilik |
| R17 pembacaan visual AKG | S2 | **Diterima** | Dosen membaca ulang tabel; kasus baku AKG dari dokumen, bukan dari ingatan |

## Rekomendasi auditor yang saya adopsi langsung (tanpa mengubah cakupan)
- Nama status mesin sumber → `teks-ditemukan-mesin` (diterapkan di registri).
- Kebijakan nilai harapan kasus baku (J13) dan kebijakan jika sumber tidak dapat diakses: bila sumber primer tidak dapat diakses, klaim tidak dipakai (karantina) dan dilaporkan; tidak boleh menggunakan ingatan.
- A17 kualitatif; A10 ditangguhkan; INV-02 direvisi; daftar kategori khusus (B12); threat model (J11); versi minimum aturan keamanan (J09).

## Rekomendasi yang memerlukan KEPUTUSAN PEMILIK (belum diterapkan)

| # | Usulan auditor | Penilaian eksekutor | Dampak |
|---|---|---|---|
| D1 | Pangkas P0 untuk M1 menjadi irisan kecil: A01, A02, A03, A06 (30 bahan), A07 (slot, tanpa LP), A11–A14, A18, B01–B03, B06, B07, D01, D02, D10 (JSON), E04, G01–G03, G13, H01–H03, H09–H12, J01, J02, J07 | **Setuju** (disesuaikan: tambah B10–B14 dan J09/J10/J13) | Menurunkan 80 P0 menjadi irisan ± 35 untuk M1 |
| D2 | Tunda K01–K14 (kecuali K06, K14), radar faltering, tindak lanjut, kader (C01–C03, C08–C11), D05, D11, F01–F08, I-series | **Setuju** sebagai urutan, bukan penghapusan | Fokus pada satu fitur sempurna |
| D3 | M1: menu berbasis slot dengan heuristik deterministik; LP (HiGHS) ditunda dan dijadikan pembanding | **Setuju**. K03 (Harga Celah) memerlukan dual LP, jadi K03 ikut tertunda | Mengurangi risiko teknis |
| D4 | bbox dan PDF.js ke P2; cukup locator halaman/tabel + SHA-256 | **Setuju** untuk M1–M3 | Menghemat biaya besar |
| D5 | Fokus skripsi pada akurasi kalkulasi kebutuhan (A03) dan keselamatan (B01–B03), bukan klaim "menu terbaik" | **Setuju kuat**: lebih dapat dipertahankan | Mengubah narasi presentasi |
| D6 | Pusat gravitasi: menu sebagai inti; skrining hanya A04 (M2) | **Setuju** | Skrining/radar ke fase berikut |

## Argumen penolakan auditor atas tiga keputusan besar
- (a) Niche: poin tentang tidak adanya basis bahan berlisensi **benar** dan paling berbahaya; ditangani lewat D1/D3/D5 dan R01.
- (b) AI penjelas: poin determinisme **diterima** (R05); AI tetap M5, saklar mati secara bawaan di hari H.
- (c) Mesin sumber: poin biaya/hak cipta **diterima** (D4). Catatan nuansa: lisensi CC BY-NC-SA hanya mengikat bila kita **menyertakan/menyebarkan** dokumen WHO; mengutip angka/fakta dan menautkan tidak melanggar. Kita tidak menyertakan PDF WHO.

## Hal yang tidak saya setujui
Tidak ada penolakan substantif selain R11 (premis) dan koreksi hitungan "ratusan ID".

## Permintaan verifikasi ulang
`audit/requests/REQ-0003`.
