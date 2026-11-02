# Inventaris Rona untuk Hari 4

Sumber: `NUTRIVA Rona.html` (482 KB, satu berkas, tanpa jaringan). BOM yang terselip di tengah berkas (offset 499, di dalam `<style id="rona-fonts">`) sudah dibuang pada kedua berkas Rona.

## Struktur
| Blok | Baris | Nasib |
|---|---|---|
| CSS, hero, galeri | 1-3327 | Dipakai sebagai cangkang visual. Bagian galeri/pameran tidak dibawa ke bundel (K-12/K-13). |
| `<script id="rona-physics">` | 3328-5294 | Dikecualikan (efek visual; 22 pemanggilan `Math.random`). |
| `<script id="rona-app">` | 5295-7919 | Diganti: berisi `hitungKecukupan` (baris 5836), data preset sintetis, dan 17 layar. Layar diambil, logika dibuang. |
| `<script id="rona-exhibition">` | 7920-8720 | Dikecualikan. |
| `lisensi-font` | 8721+ | Dipertahankan (SIL OFL). |

## Layar pada `rona-app` dan sumbernya dari mesin
| Layar Rona | Sumber data baru (`ringkasan()` di `src/app/fasad.ts`) |
|---|---|
| gerbang, tentang, kenapa | Teks statis; pernyataan privasi dari `PERNYATAAN_PRIVASI_AI` + `LABEL_PROTOTIPE` |
| profil | Masukan `MasukanRingkasan.status` + daftar `daftarTandaBahaya()` + alergi (`hindari`) |
| status | `ringkasan().status` (kategori + posisi antar garis SD, tanpa z-score) dan `rujukan` |
| piring | `ringkasan().pola` (per hari, slot, gram) dan "hitung ulang" lewat `benih` baru |
| kolam | `pola.hari[i].akg` (persen AKG per zat, dengan label belum diverifikasi) |
| ahli | Jejak: `klaim_ids`, versi, label status klaim (bukan Z-score/LP) |
| bahaya | `rujukan.tingkat === "rujuk"`: menu dan AI tidak tampil |
| hapus | Tidak ada data yang disimpan (status memori-saja, ADR-0003); tombol menjadi "Mulai ulang" |
| kartuBagi | Kartu bagikan dengan cap prototipe dari `LABEL_PROTOTIPE` |
| kosong, memuat, luring, kedaluwarsa, galat, tidakLayak, dataTidakAda | Keadaan UI; `tidakLayak` dan `dataTidakAda` dipetakan ke `hasil: "stop"` |

## Isi Rona yang bertentangan dengan keputusan dan harus diganti
| Temuan | Jumlah/lokasi | Tindakan |
|---|---|---|
| Z-score, "Z = -3,2 SD" (preset B, kartu galeri) | 17 baris (mis. 2437, 2512, 2557, 2897, 3139) | Ganti dengan kategori + posisi antar garis SD. Mesin tidak menghitung z-score. |
| Anggaran rupiah / Linear Programming ("Rp 15.000", "Σ c_j x_j") | 8 baris (mis. 2438, 2614, 2897) | Dibuang; v1 memakai daftar belanja dengan kelas harga murah/sedang/mahal (D-kelas-harga). |
| "100% LURING" / "Bekerja 100% luring" | 2351, 6600, 7394 | Ganti: AI opsional butuh jaringan; teks cadangan jalan tanpa jaringan. |
| "Local Storage", "penyimpanan lokal murni (tanpa server)", "tanpa kirim" | 2566, 6600, 6643, 7387, 7402 | Ganti dengan `PERNYATAAN_PRIVASI_AI`; tidak ada penyimpanan (ADR-0003). |
| "Ukuran dan nama anak tersimpan di perangkat" | 6643 | Dibuang; aplikasi tidak menyimpan dan tidak meminta nama. |
| Preset Ayla, Bima, Citra | 2436-2438 | Ganti dengan preset sintetis yang dihitung oleh mesin; tetap berlabel prototipe. |
| "Proyeksi 05 AI berpagar deterministik" | 3144 | Sesuaikan dengan K-08. |
| Skrip inline (4 blok) | seluruh berkas | CSP `public/_headers` memakai `script-src 'self'`; skrip harus keluar ke berkas `.js` hasil bundel (atau diberi hash). |

## Aturan untuk Hari 4
1. UI tidak menghitung gizi/status sendiri; hanya menampilkan `ringkasan()`.
2. Teks AI hanya tampil bersama `PERINGATAN_AI` dan tidak pernah di layar bahaya/rujukan.
3. Semua kategori memakai label dari `src/ai/glosarium.ts` agar teks mesin, templat, dan AI konsisten.
4. Setiap layar yang menampilkan hasil memakai `LABEL_PROTOTIPE` dan penanda "belum diverifikasi" bila `label_belum_diverifikasi`.
5. Uji penerimaan: semua layar dapat dirender dari `ringkasan()` untuk 3 preset sintetis tanpa kesalahan konsol, lolos `npm run check`, ukuran bundel di bawah batas `cek:bundel`.
