# 00 — BACA DULU (Paket Auditor NUTRIVA)

Versi paket: **1.0** · Disusun oleh: Eksekutor (Claude, sesi pengembangan) · Tanggal: 2026-10-28
Bahasa kerja: **Bahasa Indonesia** (istilah teknis boleh Inggris).

## 1. Untuk apa paket ini

Proyek NUTRIVA dikerjakan oleh dua agent dengan peran terpisah dan sengaja berseberangan:

| Peran | Siapa | Tugas |
|---|---|---|
| **Eksekutor** | Claude, sesi pengembangan | Merancang dan membangun |
| **Auditor** | Agent independen (Anda, bila membaca ini sebagai auditor) | Mencari kesalahan, celah, dan risiko pada setiap langkah |
| **Pemilik produk** | Pengguna manusia (mahasiswa kedokteran) | Memutuskan; wewenang akhir |
| **Verifikator domain** | Dosen ahli gizi | Memvalidasi isi gizi pada gerbang (bukan agent) |

Tujuan audit: **meminimalkan kesalahan sebelum mencapai ibu, anak, kader, penguji, dan juri**. Satu kesalahan angka gizi atau satu aturan keamanan yang lolos bisa merugikan pengguna dan meruntuhkan seluruh pembelaan skripsi.

Paket ini memindahkan seluruh konteks, pengetahuan, harapan, dan kejujuran eksekutor tentang kelemahannya sendiri, sehingga Anda **tidak mulai dari nol dan tidak bergantung pada narasi eksekutor**.

## 2. Urutan baca (wajib, berurutan)

| # | Berkas | Isi | Perkiraan |
|---|---|---|---|
| 1 | `01_MISI_DAN_KONTEKS.md` | Siapa, mengapa, keputusan sejauh ini | 10 mnt |
| 2 | `02_HARAPAN_EKSEKUTOR.md` | Apa yang diharapkan dari Anda dan dijanjikan eksekutor | 10 mnt |
| 3 | `03_BASIS_PENGETAHUAN.md` | Pengetahuan domain minimum agar setara | 25 mnt |
| 4 | `04_ARSITEKTUR_DAN_ATURAN.md` | Aturan teknis dan invarian yang harus dijaga | 10 mnt |
| 5 | `05_PROTOKOL_AUDIT.md` | Cara kerja, tingkat temuan, vonis, gerbang | 10 mnt |
| 6 | `06_CHECKLIST_PER_TAHAP.md` | Daftar periksa per tahap dan per jenis artefak | 20 mnt |
| 7 | `07_RED_TEAM_DAN_IMPROVISASI.md` | Ruang improvisasi dan skenario serangan | 15 mnt |
| 8 | `08_REGISTER_KLAIM_DAN_RUJUKAN.md` | **Semua klaim ilmiah eksekutor yang belum diverifikasi** | 15 mnt |
| 9 | `09_PENGUNGKAPAN_EKSEKUTOR.md` | Kelemahan, asumsi, dan kemungkinan bias eksekutor | 10 mnt |
| 10 | `10_RINGKASAN_LEGACY_V8.md` | Apa itu aplikasi lama dan mengapa ditinggalkan | 5 mnt |
| 11 | `11_PROMPT_AUDITOR.md` | Prompt awal sesi dan perintah rutin | 5 mnt |
| — | `templates/` | Templat laporan, temuan, permintaan, tanggapan | referensi |
| — | `../REGISTRI_FITUR_NUTRIVA.md` | Backlog fitur (ID A01 dst.) | referensi |
| — | `../STRATEGI_PENGEMBANGAN.md` | Strategi, arsitektur, milestone | referensi |

## 3. Zona tulis (supaya dua sesi di folder yang sama tidak bertabrakan)

| Zona | Eksekutor | Auditor |
|---|---|---|
| `src/`, `data/`, `docs/`, kode, konfigurasi, `REGISTRI_*`, `STRATEGI_*` | **Tulis** | **Baca saja** |
| `audit/requests/` | **Tulis** | Baca |
| `audit/reports/`, `audit/proposed_tests/`, `audit/evidence/` | Baca | **Tulis** |
| `audit/responses/` | **Tulis** | Baca |
| `audit/LEDGER.md` | Tulis kolom "tanggapan" | Tulis kolom "vonis/temuan" |
| `AUDITOR_PACKAGE/` | Tulis (perubahan dicatat di CHANGELOG paket) | Baca; usulan perubahan lewat laporan |

Auditor **tidak mengedit kode atau data proyek**. Uji yang gagal ditulis di `audit/proposed_tests/` dan dilaporkan; eksekutor yang memindahkannya ke suite uji resmi bila disetujui.
Auditor tidak menjalankan `git commit`, `git checkout`, `git reset`, atau mengubah status cabang. Perintah baca (`git log`, `git diff`, `git show`) diperbolehkan.

## 4. Lima aturan emas

1. **Bukti, bukan opini.** Setiap temuan menyertakan lokasi (berkas:baris), keluaran perintah, atau halaman sumber.
2. **Buta dulu.** Sebelum membaca implementasi eksekutor untuk perhitungan penting, turunkan sendiri nilai yang diharapkan dari sumber primer.
3. **Jangan percaya klaim eksekutor,** termasuk yang ada di paket ini. Semua yang bertanda `BELUM DIVERIFIKASI` harus dibuktikan atau dicabut.
4. **Tidak tahu itu hasil yang sah.** Tulis `TIDAK DAPAT DIVERIFIKASI` dengan alasan, jangan menebak.
5. **Keselamatan pengguna mengalahkan kenyamanan jadwal.** Temuan S0/S1 menahan gerbang, apa pun tekanan waktunya.

## 5. Cara memulai

1. Pemilik produk membuka sesi baru di folder yang sama, memilih peran auditor.
2. Tempel prompt pada `11_PROMPT_AUDITOR.md`, bagian "Prompt awal".
3. Auditor membaca paket sesuai urutan, lalu menjalankan **Audit Awal A-SRC-0** (verifikasi register klaim) dan **A-SPEC-0** (audit rancangan: registri + strategi). Laporan disimpan di `audit/reports/`.
4. Eksekutor menanggapi di `audit/responses/`. Tidak ada tahap pembangunan (M0 dst.) sebelum A-SRC-0 dan A-SPEC-0 berstatus LULUS atau LULUS BERSYARAT dengan keputusan pemilik produk.
