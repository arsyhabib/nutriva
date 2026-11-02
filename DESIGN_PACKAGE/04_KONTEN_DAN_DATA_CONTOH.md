# 04 — Konten dan Data Contoh (SINTETIS dan ILUSTRATIF)

> **Semua angka di bawah rekaan untuk keperluan desain.** Jangan dipakai sebagai data gizi. Angka gizi nyata berasal dari standar resmi dan sedang diverifikasi.

## 1. Kosakata dan nada

| Pakai | Hindari |
|---|---|
| "contoh pola makan dari aturan" | "rekomendasi menu", "resep terbaik", "diet" |
| "bawa ke petugas kesehatan hari ini" | "Anda harus", "bahaya!" |
| "belum diverifikasi dosen" | "terbukti", "dijamin", "pasti" |
| "kebutuhan harian dari standar" | "target yang gagal", "kurang bagus" |
| "perlu perhatian", "tanyakan petugas" | "diagnosis", "penyakit", "obat", dosis apa pun |
| "tidak ada data" | menampilkan 0 untuk data yang tidak ada |
Kalimat pendek; pecah angka menjadi makna; sapaan hangat tetapi tidak sok akrab; jangan menyalahkan. Format Indonesia: "12,5 kg", "9 bulan 2 minggu" (usia dihitung bulan penuh pada sistem).

## 2. Teks wajib (tidak boleh dihilangkan atau diubah maknanya)
- Label profil demo, pada **setiap** layar keluaran dan **tertanam di tangkapan layar/cetak**: *"Prototipe PjBL — belum diverifikasi dosen; bukan pengganti petugas kesehatan."*
- Saat rujukan: *"Bawa anak ke petugas kesehatan hari ini."* (inti pesan; kalimat sekitarnya bebas)
- Sumber: setiap angka punya penanda sumber dan status verifikasi yang dapat dibuka.

## 3. Contoh profil sintetis
```
Anak (contoh preset A): 9 bulan · perempuan · 8,1 kg · 71,0 cm (diukur berbaring)
ASI: masih menyusu · prematur: tidak · bengkak: tidak · kondisi khusus: tidak
Alergi: tidak ada · Anggaran: Rp 15.000/hari · Bahan di rumah: beras, telur, bayam
```
```
Anak (contoh preset B): 14 bulan · laki-laki · 7,6 kg · 72,0 cm  → [skenario rancangan: hasil berkategori berat sehingga rujukan tanpa menu; angka rekaan, BUKAN penilaian klinis]
```
```
Anak (contoh preset C): 18 bulan · alergi telur · anggaran Rp 8.000/hari   → [kendala ketat]
```

## 4. Contoh hasil status gizi (ilustratif)
```
Berat menurut umur: normal            Panjang menurut umur: normal
Berat menurut panjang: gizi baik     (kategori resmi; angka batas dari tabel standar)
```
Kategori resmi yang dapat muncul (nama sebenarnya dari standar): BB/U: berat badan sangat kurang · kurang · normal · risiko berat badan lebih. PB/TB menurut umur: sangat pendek · pendek · normal · tinggi. BB menurut PB/TB: gizi buruk · gizi kurang · gizi baik · berisiko gizi lebih · gizi lebih · obesitas.

## 5. Contoh pola makan (ilustratif)
```
Slot          Contoh bahan (ilustratif)         Ukuran rumah tangga     Catatan
Karbohidrat   bubur nasi lembut                  3 sendok makan          tekstur: lembut
Lauk hewani   telur ayam matang                 1 butir (dibagi 2 kali) 
Lauk nabati   tempe kukus halus                  1 potong kecil
Sayur         bayam rebus cincang                2 sendok makan
Buah          pisang matang dilumatkan           ½ buah
```
- Tombol per baris: "Tidak punya ini" → padanan; "Kenapa ini?".
- Kontrol global: "Hitung ulang" (variasi baru), kode benih `#A7F3`, perkiraan biaya "sekitar Rp 11.000–14.000".
- Label bahan yang disaring: "madu tidak disertakan: belum boleh untuk bayi di bawah 12 bulan".

## 6. Contoh kecukupan (ilustratif)
```
Energi          ███████░░░  ≈ 72% dari kebutuhan harian  
Protein         █████████░  ≈ 94%
Zat besi        ████░░░░░░  ≈ 41%   ← celah: sulit ditutup dari makanan saja → tanyakan petugas tentang suplemen
Kalsium         ███████░░░  ≈ 68%
Vitamin A       ██████████  ≈ 100%
Seng            ──          tidak ada data (bukan nol)
```
(Bentuk batang hanya ilustrasi; Anda bebas menemukan cara yang lebih baik untuk membuat kecukupan **terasa** tanpa menjadi nilai ujian.)

## 7. Contoh jejak "Kenapa" (Mode Ahli, ilustratif)
```
1. Masukan: 9 bulan, perempuan, ASI ya                         [versi data 0.1.0 · mesin 0.1.0 · benih #A7F3]
2. Kebutuhan energi total (standar nasional, tabel 1, hlm. 6)  800 kkal   → sumber [S1] tingkat A · status: teks-ditemukan-mesin
3. Bagian dari makanan pendamping (konsep WHO/PAHO)           ± 300 kkal → sumber [S2] tingkat B · status: belum diverifikasi
4. Aturan keselamatan: madu disaring (anak < 12 bulan)         → sumber [S3] tingkat B · status: belum diverifikasi
5. Pemilihan bahan: slot × batas porsi × anggaran              → asumsi pengembang [D1] tingkat D
```
Status verifikasi dan tingkat bukti harus mudah dibedakan sekilas tanpa mengandalkan warna saja.

## 8. Contoh "daftar sumber" (ilustratif)
```
[S1] Peraturan Menteri Kesehatan No. 28/2019 · Angka Kecukupan Gizi · Lampiran I, Tabel 1 · hlm. 6  ·  tingkat A
     Status: teks-ditemukan-mesin · diverifikasi manusia: belum · hash berkas: 7e3a…c91
[S2] ... 
```

## 9. Contoh tanda bahaya (ilustratif; daftar sebenarnya sedang disusun dengan sumber primer)
Kejang · napas sangat cepat/sesak · tidak mau menyusu atau minum sama sekali · lemas/sulit dibangunkan · muntah terus-menerus · diare berdarah. Pesan inti: *bawa ke petugas kesehatan hari ini.*

## 10. Contoh keadaan khusus
- Usia di luar rentang: "Aplikasi ini untuk anak 6–23 bulan. Untuk bayi di bawah 6 bulan, ASI saja sudah cukup." / "Untuk usia 24 bulan ke atas, versi berikutnya."
- Aturan kedaluwarsa: "Aturan keselamatan perlu diperbarui sebelum menyusun pola makan. Sambungkan ke internet sebentar."
- Hasil tidak layak: "Dengan anggaran dan bahan ini, zat besi belum bisa tercukupi dari makanan. Ini wajar; tanyakan petugas."
