# ADR-0003 — Origin per profil, tanpa keadaan di URL

- **Tanggal:** 2026-10-28 · **Status:** Diusulkan (menunggu REQ-0006)

## Konteks
Auditor menemukan: data profil `lapangan` bisa terbawa ke `demo` bila origin sama (AUD-0005-05) dan masukan bisa bocor lewat URL/log (AUD-0005-06).

## Keputusan
1. Profil `demo` dan `lapangan` **dilayani dari origin berbeda** (domain/subdomain berbeda), sehingga IndexedDB, localStorage, dan service worker terpisah. Pilihan hosting dikunci setelah memastikan hal ini dapat dilakukan; uji lintas-origin dilakukan sebelum rilis.
2. Service worker dan penyimpanan dinamai per profil; build `demo` tidak membaca penyimpanan profil lain.
3. **Tidak ada keadaan masukan di URL** (path/query/hash). Navigasi memakai rute tanpa data. Uji: URL tidak berubah menurut masukan.
4. Build `demo`: tanpa teks bebas (pilihan tertutup), tanpa ekspor per profil, tanpa draf/riwayat; keluaran berlabel (tertanam pada gambar/cetak).

## Konsekuensi
Dua penyebaran yang harus dipelihara; uji tambahan; mencegah kelas kebocoran S1.
