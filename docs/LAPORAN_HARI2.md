# Laporan Hari 2 (data pangan, AKG persen, pola makan, belanja)

Status: `npm run check` hijau (273 tes), build dan cek:bundel OK. Semua data pangan berlabel "belum diverifikasi".

## Isi
- `data/bahan/bahan.json`: 30 bahan, USDA SR Legacy 2018-04 (CC0), per 100 g, nilai hilang dibiarkan hilang (bukan 0). Catatan: nasi = beras putih berfortifikasi; vitamin A hanya RAE (AKG memakai RE); iodium tidak tersedia.
- `data/bahan/atribut.json`: peran, kelompok MDD, alergen, usia minimal, rasio beli, kelas harga (asumsi pengembang).
- `data/aturan/pola_makan.json`: pita energi MP-ASI, porsi, batas asumsi (hati, vitamin A hewani), ambang tampilan.
- `src/engine/{gizi,polaMakan,belanja,prng}.ts`, skema `schema/{bahan,aturan}.ts`.
- Tes: `tests/gizi.test.ts` (golden Python independen `tests/golden/hitung_gizi_golden.py`), `tests/pola-makan.test.ts` (invarian 6-23 bulan x 40 benih).

## Audit berlapis (Haiku)
1. Hitung ulang independen: semua cocok dengan golden, tidak ada nilai mustahil.
2. Kewajaran USDA: 7 lolos, 1 tidak terverifikasi (lele; sudah cocok dengan CSV USDA saat ekstraksi).
3. Keamanan generator: 19 temuan. Diperbaiki: jatah hati 1 kali per 7 hari, `hindari` dinormalisasi dan divalidasi, alias gandum-gluten, stop bila staple/protein/sayur habis, kembung dan jagung baru dari usia 9 bulan, penamaan batas sebagai asumsi.

## Belum dikerjakan (catat untuk Hari 3-5)
- Instruksi tekstur (haluskan jagung/kacang, buang duri ikan) harus tampil di UI.
- Yogurt usia 6 bulan dan batas hati/vitamin A hewani perlu sumber primer (IDAI/Kemenkes).
- Padanan USDA untuk pangan lokal (kembung = mackerel dll.) perlu ditandai di UI.
- Jatah hati antar panggilan: UI harus mengirim `izinkan_hati=false` setelah hati dipakai pekan itu.
