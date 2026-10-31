# RSP-0001 — Tanggapan atas RPT-0001 (A-SRC-0)

- **Tanggal:** 2026-10-28 · **Penulis:** Eksekutor · **Status:** menunggu verifikasi ulang (REQ-0003)

Vonis DITOLAK **diterima**. Dampaknya pada perilaku saya: seluruh klaim berstatus selain TERVERIFIKASI **dikarantina** (tidak boleh masuk data, aturan, atau teks aplikasi) sampai terverifikasi; verifikator build (rancangan) akan menolak klaim berstatus `belum` yang dipakai.

## Tanggapan per temuan

| Temuan | Sikap | Tindakan / alasan | Bukti | Uji pencegah |
|---|---|---|---|---|
| AUD-0001-01 (TTD, S1) | **Diterima** | Karantina C-010. Aplikasi tidak memuat angka dosis/kadar TTD sebelum pedoman Kemenkes primer terbaca; teks rujukan hanya "tablet tambah darah sesuai anjuran bidan/dokter". Percobaan saya membuka halaman pedoman Kemenkes gagal (HTTP 503), jadi saya tidak dapat menyelesaikannya sendiri; mohon auditor/dosen mencari berkas primer | Hasil pencarian saya: 90 tablet dan 60 mg besi konsisten di sekunder; folat 0,25 vs 0,4 mg bertentangan | Verifikator build: klaim `belum` dipakai → gagal |
| AUD-0001-02 (77%, S1) | **Diterima** | Dicabut dari `03_` §4.2. Catatan: `HASIL_VERIFIKASI.md` **tidak** memakai 77% sebagai aturan (hanya menyebut Gibson di daftar yang belum terbaca); 77% hanya ada di `03_` dan `08_` C-032. Pencarian saya menunjukkan angka itu setara aritmetika "RDA = EAR + 2 SD, CV 15%", bukan kutipan terverifikasi dari Gibson | Berkas `03_` diedit | Uji: tidak ada ambang kecukupan tanpa `claim_id` |
| AUD-0001-03 (75% heme, S1) | **Diterima sebagian** | Saya setuju: tidak bisa dipastikan salah ketik; **saya mencatatnya sebagai "mungkin", itu spekulasi** dan harus dibuang. Asumsi AKG diperlakukan apa adanya. A17 diubah menjadi kualitatif dan **bukan pengali** | Registri A17 diedit | Uji: tidak ada pengali bioavailabilitas pada total gizi |
| AUD-0001-04 (24 bulan, S2) | **Diterima** | Sumber sekunder (CRAN/DHS, merujuk laporan teknis WHO-UNICEF 2019) menunjukkan WHO: < 24 bulan → panjang, ≥ 24 bulan → tinggi; Permenkes: "0–24" dan "di atas 24". Keputusan belum saya ambil: perlu dosen. Usulan: ikuti Permenkes (kewajiban hukum Pasal 3) dan tampilkan catatan pada tepat 24 bulan | Teks Permenkes hlm. 12 | ADR dan kasus uji usia 23/24/25 bulan |
| AUD-0001-05 (Permenkes 21/2021, S2) | **Diterima** | Pencarian BPK: dicabut Permenkes 2/2025 (20 Feb 2025). Dicoret dari `03_`; tidak dipakai | `03_` diedit | — |

## Hal yang dikoreksi dari sisi eksekutor dan catatan untuk auditor

1. **Cakupan:** banyak klaim berstatus TIDAK DAPAT DIVERIFIKASI karena tidak diperiksa, bukan karena salah. Saya mengerti itu sebagai celah cakupan; klaim-klaim itu tetap karantina. REQ-0003 meminta verifikasi sisa klaim secara bertahap.
2. **C-013 (obesitas/gizi lebih):** saya membaca halaman 14–15 sebagai gambar (bukan ekstraksi teks): BB/PB-TB: gizi lebih > +2 s.d. +3; obesitas > +3; IMT/U 0–60 bulan: berisiko > +1 s.d. +2 (hlm. 14), gizi lebih > +2 s.d. +3 dan obesitas > +3 (hlm. 15). Mohon auditor mengonfirmasi dengan render halaman.
3. **C-020:** dokumen WHO yang saya baca adalah *Computation of centiles and z-scores* referensi 2007 (5–19 tahun), hlm. 1–3 dari 5, berisi rumus LMS dan penyesuaian ±3 SD untuk indikator berbasis berat. Dokumen standar 2006 (0–5 tahun) **belum** saya baca; klaim itu SEBAGIAN, bukan TERVERIFIKASI untuk 0–5 tahun. Permenkes 2/2020 memang tidak memuat LMS (selaras HASIL F-06).
4. **Ketidakkonsistenan di laporan auditor:** `EVD-0001` §2 menulis folat sebagai "DFE" padahal `RPT-0001` F-01 menyatakan tabel tercetak "mcg tanpa DFE". Mohon diseragamkan. Hasil pembacaan saya: "Folat (mcg)", tanpa DFE.
5. **Konfirmasi independen yang berharga:** angka AKG utama (energi/protein hamil dan menyusui; besi, seng, iodium, kalsium) cocok antara pembacaan auditor dan pembacaan saya; kesalahan besi T3 (+6) pada auditor terkoreksi menjadi +9 (sama dengan saya). Ini menunjukkan risiko salah baca visual; dosen tetap harus membaca ulang halaman asli.
6. **Lampiran II (Cost of the Diet):** saya membaca teks lapisan PDF hlm. 31–32 (bukan citra); mohon diverifikasi (F-07).

## Perubahan artefak
`AUDITOR_PACKAGE/03_BASIS_PENGETAHUAN.md` (77% dicabut, Permenkes 21/2021 dicoret), `REGISTRI_FITUR_NUTRIVA.md` (A17, status sumber). Register `08_` tidak diubah (milik verifikasi auditor).

## Permintaan verifikasi ulang
Lihat `audit/requests/REQ-0003`.
