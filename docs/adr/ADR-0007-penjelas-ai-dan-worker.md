# ADR-0007: Penjelas AI opsional lewat Worker proksi

Status: ditulis dan diuji pada Hari 3; K-08 dan D-OR sudah disetujui pemilik, sambungan ke UI menunggu Hari 4. Tanggal: 2026-11-02.

## Konteks
K-08 mengembalikan penjelas AI dengan syarat: AI hanya menerjemahkan hasil mesin, tidak memutuskan angka atau keselamatan, selalu berperingatan, tidak pernah di layar Rujukan, dan gagal-aman. D-AI memilih Claude Haiku 5.5 lewat Worker. D-OR memilih rute OpenRouter.

## Keputusan
1. **Muatan tertutup** (`src/ai/kontrak.ts`, Zod `.strict()`): hanya kategori status, persen AKG bulat 0-999, kode celah, hitungan MDD, pita usia, versi. Tidak ada teks bebas, nama, tanggal, berat, atau panjang. Layar `rujukan` tidak ada dalam enum.
2. **Prompt di server** (`worker/prompt.ts`). Pesan pengguna disusun Worker dari muatan yang sudah lolos skema memakai glosarium baku, bukan meneruskan teks klien. Injeksi lewat kolom tidak mungkin karena semua kolom adalah enum atau bilangan bulat.
3. **Validator keluaran** (`src/ai/validator.ts`), dijalankan di Worker dan di klien. Pagar utamanya adalah **daftar putih kata** (`src/ai/kosakata.ts`): setiap kata keluaran harus ada di daftar (imbuhan umum dilepas), kata lain membuat keluaran ditolak dan UI memakai templat. Daftar sengaja tidak memuat obat, suplemen, madu, dosis, nama penyakit, dan sejenisnya (diuji). Di atasnya ada daftar terlarang dan pemeriksaan lain. Setelah normalisasi Unicode (NFKC, buang karakter tak terlihat, petakan huruf serupa Cyrillic/Yunani) ia memeriksa: panjang dan baris; tautan, markup, daftar poin; angka (persen harus cocok dengan zat yang disebut, bilangan kecil hanya dengan satuan hitung, tanpa kata bilangan besar atau angka dosis); kata dan tindakan terlarang (diagnosis, nama penyakit, obat, suplemen, madu, dosis, hentikan ASI, beri garam/gula, dst., termasuk yang disamarkan spasi atau tanda hubung); bahasa Inggris; frasa status yang tidak ada di muatan; klaim "normal/sehat" padahal ada status tidak normal; dan keharusan menyebut posyandu/puskesmas bila ada status tidak normal. Keluaran terpotong (`finish_reason=length`) ditolak. Ini pagar berbasis aturan, bukan pemahaman makna; ia diuji dengan sekitar 140 serangan dari dua gelombang red-team (semua ditolak) dan 29 keluaran Haiku 5.5 sungguhan yang dibuat dengan prompt Worker (semua lolos; `tests/fixtures/ai_contoh_haiku.json`). Daftar kata disetel dari 29 contoh itu; setelah rilis, tambah kata hanya lewat kalibrasi ulang dengan contoh baru.
4. **Fallback deterministik** (`src/ai/templat.ts`): bila AI mati, lambat, gagal, atau ditolak validator. Templat selalu lolos validator (diuji kombinatorial).
5. **Worker** (`worker/index.ts`): satu rute `POST /v1/jelaskan`, daftar putih origin, batas isi 2 KiB, batas laju per klien dan global (per isolat), sakelar `FITUR_AI`, batas waktu hulu 10 detik, `max_tokens` 350, tanpa `console.*`, `Cache-Control: no-store`, `provider.data_collection=deny`. Kunci hanya dari secret Worker.
6. **Peringatan dan privasi** (`src/ai/glosarium.ts`): `PERINGATAN_AI` dan `PERNYATAAN_PRIVASI_AI` adalah satu-satunya teks yang boleh dipakai UI.

## Konsekuensi dan batas yang diketahui
- `Origin` hanya melindungi lewat peramban; ia bukan kontrol akses. Batas biaya di kunci OpenRouter adalah pagar sebenarnya.
- Urgensi hasil (mis. gizi buruk) harus datang dari mesin rujukan (B03/B12/R07) dengan teks yang disetujui dosen; AI tidak memutuskannya. Teks cadangan saat ini hanya menyarankan pemeriksaan, belum bertingkat. Ini keputusan terbuka.
- Persetujuan AI terpisah dan dapat dicabut (B07) wajib sebelum profil `lapangan`; pada build `demo` yang hanya memakai preset risikonya kecil.
- Batas laju di memori bersifat per isolat, jadi hanya penahan kasar. Pasang aturan Rate Limiting Cloudflare di dasbor (lihat docs/DEPLOY_WORKER.md).
- Validator berbasis kata; ia mengurangi, bukan menjamin, bahwa AI tidak menulis hal keliru. Karena itu teks AI selalu berdampingan dengan hasil mesin dan peringatan.
- Data tetap melewati Cloudflare, OpenRouter, dan penyedia model. `data_collection=deny` membatasi rute ke penyedia yang menyatakan tidak mengumpulkan data, itu pernyataan penyedia, bukan jaminan teknis kita.
- Nama model di OpenRouter dapat berubah; ubah `AI_MODEL` tanpa menyentuh kode.
