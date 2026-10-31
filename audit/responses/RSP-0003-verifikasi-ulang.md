# RSP-0003 — Tanggapan atas RPT-0003 (verifikasi ulang)

- **Tanggal:** 2026-10-28 · **Penulis:** Eksekutor · Menunggu verifikasi ulang (REQ-0005)

Vonis DITOLAK (karena TTD, AUD-0003-02) **diterima**.

| Temuan | Sikap | Tindakan | Bukti |
|---|---|---|---|
| AUD-0003-01 (S2) Permenkes 21/2021 dicabut sebagian | **Diterima** | `03_` dikoreksi: dicabut sebagian (Pasal 85 huruf d Permenkes 2/2025); **tidak dipakai** sebagai dasar aturan aplikasi | `03_` bagian regulasi |
| AUD-0003-02 (S1) TTD | **Diterima; ditutup sebagian** | Angka 0,25 mg dicabut; satu tablet = 60 mg besi + 400 µg asam folat menurut pedoman Kemenkes rematri/WUS (dibaca auditor). "90 tablet selama hamil" tetap **BELUM TERVERIFIKASI**; penelusuran saya menunjukkan halaman resmi Kemenkes (ayosehat.kemkes.go.id, bagian rekomendasi suplemen kehamilan dan Buku Bacaan Kader TTD) menyebut minimal 90 tablet dan 60 mg/400 µg, tetapi saya belum membaca halaman itu langsung (HTTP 503 saat dicoba). **Aplikasi tidak memuat dosis (T-10)**, sehingga angka ini tidak memengaruhi keluaran. Saya meminta berkas primer dari pemilik (folder `sumber/`) | `03_` baris TTD; `KEPUTUSAN` T-10 |
| AUD-0003-03 (S2) WHO 24 bulan | **Diterima** | C-022 untuk bagian WHO diturunkan menjadi tidak terverifikasi; aturan Permenkes tetap terverifikasi. Perilaku tepat 24 bulan tidak dipakai di M1 (mode 6–23 bulan) | `KEPUTUSAN` T-02 |
| AUD-0003-04, -05, -06 (S3) | **Diterima** (ditutup oleh auditor) | Saya mengapresiasi koreksi premis R11; kesalahan awal berasal dari `10_` saya | — |
| AUD-0003-07 (S2) sitasi IOM 2000 | **Diterima** | Diubah menjadi "judul tercantum di National Academies; isi belum dibaca; BELUM DIVERIFIKASI". Catatan: hasil pencarian saya memang menampilkan halaman "Dietary Reference Intakes: Applications in Dietary Assessment (2000)" di nationalacademies.org, tetapi saya belum membuka isinya | `03_` §4.2 |

## Catatan
- Saya tidak mengubah `08_` (register milik verifikasi auditor).
- Rekomendasi 1–4 RPT-0003 sudah dijalankan (kecuali menutup AUD-0003-02 sepenuhnya, menunggu primer).
