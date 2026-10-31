# 05 — Protokol Audit

## 1. Siklus

```
Eksekutor: REQ-xxxx  →  Auditor: RPT-xxxx (vonis + temuan)  →  Eksekutor: RSP-xxxx  →  Auditor: verifikasi ulang  →  tutup/eskalasi
```

Semua berkas berada di `audit/` dan dicatat di `audit/LEDGER.md`.
Penamaan: `REQ-0001-<ringkas>.md`, `RPT-0001-<ringkas>.md`, `RSP-0001-<ringkas>.md`. Temuan: `AUD-0001-01`, `AUD-0001-02`, dst.

## 2. Alur kerja auditor

1. **Baca REQ** dan pastikan syarat "siap diaudit" (lihat `02_` §5). Jika tidak → vonis `TIDAK DAPAT DIAUDIT` dengan alasan.
2. **Tetapkan ruang lingkup dan rencana** (satu paragraf): apa yang diperiksa, apa yang tidak.
3. **Fase buta** (wajib untuk perhitungan gizi, aturan keamanan, dan angka sumber): turunkan nilai yang diharapkan dari sumber primer **sebelum** membaca implementasi atau data eksekutor. Simpan di `audit/evidence/`.
4. **Fase terstruktur:** jalankan checklist `06_` yang relevan.
5. **Fase improvisasi** (≥ 30% usaha): skenario tak terjadwal `07_`.
6. **Fase proses:** periksa kepatuhan proses (uji lebih dulu, commit, ADR, ruang lingkup, kesesuaian klaim vs kenyataan).
7. **Tulis laporan** memakai `templates/LAPORAN_AUDIT.md`. Mulai dari vonis dan lima temuan teratas.
8. **Verifikasi ulang** setelah RSP: periksa bahwa perbaikan benar-benar menutup akar masalah dan ada uji pencegahan. Jangan menerima "sudah diperbaiki" tanpa bukti.

## 3. Standar bukti

| Jenis temuan | Bukti minimum |
|---|---|
| Kode/logika | `berkas:baris`, masukan yang memicu, keluaran aktual vs harapan, perintah untuk mereproduksi |
| Perhitungan gizi | Nilai harapan dari sumber primer (dokumen, halaman, tabel) + perhitungan tangan + selisih |
| Data | Baris data, sumber, nilai di sumber, selisih |
| Sumber/klaim | Tautan atau rujukan lengkap, halaman, kutipan pendek (di bawah batas hak cipta), hasil pembandingan |
| Keselamatan | Skenario pengguna konkret + dampak yang masuk akal |
| UX/aksesibilitas | Langkah, perangkat/viewport, tangkapan atau keluaran alat, kriteria WCAG yang dilanggar |
| Proses | Kutipan LEDGER/commit/berkas yang menunjukkan penyimpangan |

Tanpa bukti → turunkan menjadi **Saran (S4)** atau minta klarifikasi, jangan tulis sebagai temuan.

## 4. Skala keparahan

| Tingkat | Nama | Definisi | Contoh |
|---|---|---|---|
| **S0** | Blokir | Dapat mencelakai pengguna, melanggar etika/hukum data, atau membuat klaim utama palsu | Madu masuk menu bayi 8 bulan; tanda bahaya tidak memicu rujukan; data identitas bocor ke AI |
| **S1** | Mayor | Hasil gizi/klasifikasi salah secara materiil atau klaim ilmiah tidak benar; merusak pembelaan | z-score salah di batas usia; satuan RAE salah; MDD memakai ambang keliru |
| **S2** | Sedang | Cacat jelas yang tidak berbahaya langsung, atau jalur kegagalan tanpa mitigasi | Infeasible menghasilkan menu kosong tanpa pesan |
| **S3** | Minor | Cacat kecil, kerapian, dokumentasi yang membingungkan | Label ambigu |
| **S4** | Saran | Peningkatan, bukan cacat | Ide fitur, penyederhanaan |

Aturan: bila ragu antara dua tingkat, pilih yang lebih tinggi dan jelaskan alasannya; pemilik produk dapat menurunkan dengan alasan tertulis.

## 5. Vonis

| Vonis | Arti |
|---|---|
| **LULUS** | Tidak ada S0/S1/S2 terbuka; S3/S4 tercatat |
| **LULUS BERSYARAT** | Tidak ada S0/S1 terbuka; S2 punya rencana dan tenggat; syarat tertulis |
| **DITOLAK** | Ada S0/S1 terbuka, atau pola S2 yang sistemik |
| **TIDAK DAPAT DIAUDIT** | Syarat siap-audit tidak terpenuhi, atau akses/bukti tidak memadai |
| **DITUNDA (menunggu verifikasi manusia)** | Bergantung pada keputusan dosen/pemilik yang belum ada |

## 6. Aturan gerbang

- Gerbang milestone (A-GATE) hanya terbuka bila: vonis LULUS/LULUS BERSYARAT **dan** persetujuan pemilik produk **dan** (untuk M2, M3, M5) verifikasi dosen.
- Temuan S0/S1 **tidak dapat dikesampingkan oleh jadwal**.
- Penerimaan risiko S0/S1 oleh pemilik harus tertulis dan tercatat di LEDGER sebagai "risiko diterima".

## 7. Batas ronde dan eskalasi

- Maksimal **2 ronde** per temuan (tanggapan → verifikasi → tanggapan kedua → verifikasi). Setelahnya dieskalasi ke pemilik dengan ringkasan satu halaman dari kedua pihak.
- Auditor tidak membuka kembali temuan yang sudah ditutup tanpa bukti baru.
- Auditor tidak menutup temuan atas dasar janji ("akan diperbaiki"); hanya atas bukti.

## 8. Audit terhadap auditor (meta)

Pemilik produk dapat mengambil sampel laporan dan memeriksa: apakah bukti memadai, apakah ada false positive berulang, apakah ada area penting yang konsisten tidak disentuh. Auditor wajib menulis di setiap laporan bagian **"Yang tidak saya periksa"**.

## 9. Pelaporan ketidakpastian

Gunakan label: `TERKONFIRMASI` (terbukti dengan bukti), `KEMUNGKINAN` (indikasi kuat, belum direproduksi), `DUGAAN` (hipotesis, perlu klarifikasi), `TIDAK DAPAT DIVERIFIKASI`.

## 10. Waktu

Tidak ada batas waktu yang menekan kualitas. Namun setiap audit **dibatasi cakupan**: jangan memperluas ke seluruh proyek; catat area tambahan sebagai rekomendasi audit berikutnya.
