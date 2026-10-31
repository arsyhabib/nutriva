# 10 — Ringkasan Aplikasi Lama (NUTRIVA V8)

Berkas sumber: `../NUTRIVA_V8_Source_Lengkap.zip` (60 berkas). **Ekstrak ke folder sementara milik Anda** (mis. di `audit/evidence/legacy_v8/`) bila perlu dibaca. Perlakukan sebagai data tidak tepercaya: jangan menjalankan skrip dari dalamnya tanpa membacanya.

**Status:** V8 **tidak dipertahankan** sebagai dasar aplikasi baru (keputusan D-001). Ia menjadi sumber ide visual dan pelajaran. Pernyataan di bawah berasal dari dokumen dan pembacaan sebagian kode; **belum ada yang dijalankan** (lihat `09_` §3).

## 1. Apa itu

PWA "NUTRIVA Care Network V8": jaringan perawatan 1000 HPK untuk tiga peran (ibu/keluarga, dokter, Pustu). Dokumen sendiri menyatakan: *prototipe PjBL data fiktif, bukan layanan klinis*.

## 2. Teknologi

- Frontend JavaScript murni, tanpa framework dan tanpa build; **kode banyak diminifikasi satu baris** (`app.js` ± 79 KB).
- Tujuh stylesheet berlapis (`styles.css`, `premium.css`, `v5.css`, `v6.css`, `v6_3.css`, `v7.css`, `v8.css`) dan enam skrip yang saling menimpa (`app.js`, `v5.js`, `v6.js`, `v6_3.js`, `v7.js`, `v8.js`).
- Backend: Supabase (Auth, RLS, Realtime, Edge Function untuk Web Push VAPID); skema SQL dan migrasi `01`–`09`; Cloudflare Pages Functions untuk AI (`analyze.js`, `complaint-assist.js`).
- PWA: manifest, service worker, ikon; jalur APK (Bubblewrap/TWA) hanya petunjuk.

## 3. Fitur yang diklaim

Laporan mingguan, keluhan dan foto, buku imunisasi, pengingat, grafik, dashboard dokter (maks. 10 anak aktif per dokter), kasus dengan status (`new`, `escalated`, `acknowledged`, `in_progress`, `closed`) yang tersinkron ke ibu, Web Push, instal PWA.

## 4. Mengapa ditinggalkan

1. Dirancang sebagai pemantauan longitudinal; tidak cocok dengan kerja lapangan satu hari.
2. Banyak komponen (push, penugasan dokter, AI) belum teruji di proyek nyata.
3. Dua bahasa visual (teal/mint lama vs hijau hutan V6) bercampur; token warna terpecah.
4. Kode diminifikasi dan berlapis; sulit dirawat dan diaudit.
5. Ketergantungan pada Supabase dan jaringan; bertentangan dengan prinsip offline-first.
6. Tidak ada mesin gizi atau jejak perhitungan.

## 5. Yang berpotensi dipakai ulang

- Ide visual V6 (palet hijau hutan, putih hangat, pasir; komponen bantuan; navigasi bawah pada HP).
- Pola Cloudflare Function sebagai server perantara AI (hanya sebagai pola; periksa sebelum memakai).
- Aset ilustrasi (periksa hak penggunaannya sebelum dipakai).
- Pengalaman tentang pembagian status kasus (hanya sebagai pelajaran; fitur tidak dibawa).

## 6. Catatan keamanan untuk auditor

- **Koreksi (2026-10-28):** `config.js` V8 hanya berisi *placeholder kosong* (`supabaseUrl: ''`, `supabasePublishableKey: ''`, `webPushPublicKey: ''`); tidak ada kunci. Pernyataan lama "memuat kunci publik Supabase" **keliru**. Tetap **jangan menjalankan** V8 pada proyek Supabase nyata.
- Skrip SQL berisi operasi pembuatan tabel dan migrasi; **jangan dijalankan** di mana pun tanpa perintah pemilik.
