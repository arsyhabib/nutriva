# ADR-0001 — Opsi B: aplikasi mampu data nyata, dua profil build, penguncian teknis

- **Tanggal:** 2026-10-28 · **Status:** Diusulkan (menunggu REQ-0006) · **Keputusan pemilik:** lihat `KEPUTUSAN_DAN_JALUR_RILIS.md` v3 §0

## Konteks
Pemilik memilih Opsi B (aplikasi dibangun untuk data nyata; etik diurus bersama dosen kemudian) dan meminta cakupan tidak dikurangi. Auditor (RPT-0004, RPT-0005) menunjukkan bahwa label "sintetis" yang dikendalikan pengguna tidak aman (S-1…S-4) dan bahwa data nyata sebelum etik adalah S0.

## Keputusan
Satu basis kode, dua profil build:
- `demo`: preset kasus tetap, tanpa teks bebas, tanpa ekspor, tanpa riwayat/draf, label pada setiap keluaran. Aman secara bawaan.
- `lapangan`: fitur penuh dan data nyata, **terkunci** sampai berkas otorisasi lokal (`otorisasi.lokal.json`, tidak masuk repositori) memuat `dasar_izin`, `penandatangan_tanda_bahaya`, `keputusan_status_alat`, dan `versi_aturan` yang valid. Tidak ada jalan pintas atau mode "paksa".

## Konsekuensi
- Pembangunan dapat berjalan penuh sekarang; penggunaan data nyata digerbang oleh pemilik + dosen + institusi, bukan oleh label pengguna.
- Dua profil harus diuji terpisah dan dipisahkan origin-nya (ADR-0003).
- Biaya: kode tambahan untuk mekanisme profil; manfaat: kendali teknis atas S0.

## Alternatif yang ditolak
Satu build dengan tombol "sintetis" (ditolak: S-1/S-4); menunda seluruh pembangunan sampai etik (ditolak pemilik: kualitas dan cakupan).
