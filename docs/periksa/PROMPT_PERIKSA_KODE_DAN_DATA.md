# Prompt pemeriksaan silang untuk kode dan keluaran (Gemini atau ChatGPT, hanya membaca)

Lampirkan hasil `npm run check`, `src/engine/`, `tests/golden/kasus_status.json`, dan `tests/golden/hitung_golden.py`.
1. Pilih 15 kasus golden secara acak. Hitung ulang SENDIRI dari `data/tabel_sd/*.json` dan aturan di `hitung_golden.py`. Laporkan kasus yang hasilnya berbeda dari `harapan`.
2. Periksa apakah `src/engine/` memberi hasil yang sama untuk semua kasus (tanpa menjalankan; baca logika). Catat perbedaan aturan (batas kategori, usia bulan penuh, koreksi +0,7 cm).
3. Cari angka, ambang, atau teks medis yang tertanam di kode atau UI tanpa `klaim_id`.
4. Cari kalimat privasi yang bertentangan dengan K-08 (mis. "tidak ada data keluar", "Local Storage").
Hasil: Markdown, tabel temuan (berkas:baris, masalah, tingkat keparahan), tanpa mengubah berkas.
