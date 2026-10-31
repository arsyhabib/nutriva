# REQ-0002 — A-SPEC-0: Audit rancangan (registri, strategi, desain)

- **Jenis audit:** A-SPEC
- **Tanggal:** 2026-10-28 · **Pengirim:** Eksekutor
- **Objek:** `REGISTRI_FITUR_NUTRIVA.md` (kelompok A–L), `STRATEGI_PENGEMBANGAN.md`, `TASKLIST.md`
- **Prioritas:** tinggi (blokir M0)

## 1. Tujuan
Menilai apakah rancangan koheren, layak, aman, dan dapat dipertahankan **sebelum** ada kode.

## 2. Pertanyaan utama
1. **Ruang lingkup:** registri ± 150 fitur + K (14) + L (14). Mana yang harus dipangkas agar M1–M2 terwujud? Apakah dua pusat gravitasi (mesin menu vs skrining/tindak lanjut posyandu) koheren atau harus dipisah?
2. **Kelayakan teknis:** TypeScript+Preact+LP di peramban+PWA offline+PDF.js; apakah wajar untuk vibe coder? Apa jalur sederhana yang lebih aman?
3. **Mesin sumber/provenansi:** apakah locator berkoordinat, hash, dan verifikator build realistis dan sah secara hak cipta?
4. **Keselamatan klinis:** kecukupan lapisan keamanan, tanda bahaya, kondisi khusus; apakah ada celah kategori (remaja hamil, kembar, prematur, edema)?
5. **Bioavailabilitas (A17):** HASIL_VERIFIKASI F-02 menunjukkan AKG sudah memuat asumsi bioavailabilitas. Apakah A17 dibuang/diubah?
6. **Etik dan regulasi:** apakah perlu izin etik atau status perangkat kesehatan sebelum pembuatan data riil?
7. **Jalur desain (T7/L):** adakah risiko bentrok estetika vs aksesibilitas; apakah tafsiran "kontras semi-kuat" aman?
8. **Strategi audit:** apakah protokol, gerbang, dan paket auditor memadai? Apa yang hilang?
9. **Narasi kompetisi/skripsi:** adakah klaim yang berlebihan?

## 3. Cara menjalankan
Dokumen saja. Boleh membuka paket `AUDITOR_PACKAGE/`. Verifikasi fakta yang terkait lewat A-SRC-0.

## 4. Kriteria penerimaan
- [ ] Daftar risiko ≥ 10 yang belum tercatat
- [ ] Rekomendasi pemangkasan P0 yang realistis
- [ ] Vonis atas strategi dan arsitektur beserta alternatif bila ditolak
- [ ] Temuan keselamatan (jika ada) dengan skenario konkret

## 5. Klaim yang dibuat
Strategi: arsitektur berlapis, modul terdaftar, pipa tetap, golden tests, protokol verifikasi dosen.

## 6. Hal yang paling saya cemaskan
Membengkaknya lingkup; beban pemeliharaan; dosen tidak punya waktu; mesin sumber terlalu ambisius; estetika mengorbankan keterbacaan; saya terlalu mudah setuju dengan pemilik.

## 7. Asumsi dan keterbatasan
Lihat `09_PENGUNGKAPAN_EKSEKUTOR.md`.

## 8. Yang tidak berubah
Belum ada kode.

## 9. Permintaan khusus
Beri saya argumen penolakan terkuat terhadap tiga keputusan terbesar: (a) niche mesin gizi, (b) deterministik + AI penjelas, (c) mesin sumber berkoordinat.
