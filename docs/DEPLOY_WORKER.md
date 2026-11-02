# Memasang Worker AI (langkah di laptop pemilik)

Semua perintah dijalankan di folder proyek. Kunci TIDAK ditulis di berkas apa pun. Perilaku `wrangler` di bawah ditulis berdasarkan dokumentasi umum; bila ada langkah yang berbeda di versi terpasang, ikuti pesan wrangler dan catat bedanya.

## A. Persiapan
1. **Ganti kunci OpenRouter lebih dulu.** Kunci lama pernah ditempel di percakapan. Buat kunci baru di dasbor OpenRouter, cabut yang lama, dan beri batas kredit kecil pada kunci baru. Batas kredit adalah pagar biaya yang sebenarnya.
2. `npx wrangler login` (peramban terbuka, masuk ke akun Cloudflare).

## B. Pasang Worker
3. `npx wrangler deploy` (tanpa kunci dulu; Worker akan menjawab 503 `tidak_dikonfigurasi`). Catat URL `https://nutriva-ai.<akun>.workers.dev`.
4. `npx wrangler secret put OPENROUTER_API_KEY`, tempel kunci BARU di prompt. Nilai tidak tampil dan tidak masuk repo.

## C. Pasang situs (Hari 5) lalu kunci origin
5. Deploy situs ke Cloudflare Pages. Di pengaturan Pages > Environment variables isi `VITE_URL_WORKER_AI` = URL Worker, lalu build ulang (variabel `VITE_` dibakar saat build; mengubahnya perlu build ulang). Tanpa variabel ini UI selalu memakai teks cadangan.
6. Edit `wrangler.toml`, `IZIN_ORIGIN`: isi alamat produksi persis (mis. `https://nutriva.pages.dev`), pisah koma, tanpa garis miring akhir. **Hapus entri `http://localhost:...` sebelum rilis publik.** Alamat preview Pages (`https://<hash>.nutriva.pages.dev`) tidak diizinkan; tambahkan satu per satu bila perlu menguji. Deploy ulang Worker.
7. Uji asap: `npx tsx src/tools/cli-uji-worker.ts https://nutriva-ai.<akun>.workers.dev https://nutriva.pages.dev`. Mencetak OK/GAGAL untuk: sukses (memakai kredit sungguhan, sangat kecil), origin asing ditolak, muatan layar rujukan ditolak.

## D. Batas penyalahgunaan (penting)
`Origin` bukan autentikasi: skrip non-peramban bisa memalsukannya. Perlindungan sebenarnya berlapis: (a) batas kredit pada kunci OpenRouter, (b) batas laju di kode Worker (12 per menit per IP, 120 per menit global, per isolat Cloudflare sehingga hanya penahan kasar), (c) aturan Rate Limiting Cloudflare bila Anda memasang domain sendiri pada zona Cloudflare (aturan WAF bekerja per zona; belum diverifikasi apakah dapat dipakai pada `*.workers.dev`). Tanpa domain sendiri, andalkan (a) dan (b).
Angka (b) adalah angka resmi; jangan membuat angka berbeda di tempat lain.

## E. Mematikan, rotasi, uji lokal
- Matikan cepat (tanpa deploy): `npx wrangler secret delete OPENROUTER_API_KEY` (Worker menjawab 503, UI jatuh ke templat). Matikan resmi: `FITUR_AI = "0"` di `wrangler.toml` lalu deploy.
- Rotasi: `npx wrangler secret put OPENROUTER_API_KEY` dengan kunci baru; cabut kunci lama di OpenRouter.
- Uji lokal: buat `.dev.vars` (sudah di `.gitignore`) berisi `OPENROUTER_API_KEY=...`, jalankan `npx wrangler dev`.

## Sambungan di UI (Hari 4)
UI memanggil `mintaPenjelasan(muatan, { urlWorker })` dari `src/ai/klien.ts`, menampilkan `PERINGATAN_AI` di samping teks bila `sumber === "ai"`, dan `PERNYATAAN_PRIVASI_AI` di halaman privasi. Layar Rujukan tidak pernah memanggilnya. Ada tombol nyala/mati AI di UI agar kalimat "bersifat opsional" benar.
