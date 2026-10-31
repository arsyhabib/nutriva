# 12 — Prompt Jembatan Audit untuk VS Code (Haiku 5.5, effort high)

> **DIBATALKAN 2026-10-28 (keputusan pemilik K-02):** auditor tetap berjalan di Claude Desktop. Eksekutor mengirim permintaan lewat `SendMessage` ke sesi auditor dan tidak lagi menyertakan prompt VS Code. Bagian §3 (penyesuaian untuk model kecil) dan §5 (varian per jenis audit) tetap berlaku.

Berlaku sejak 2026-10-28. Audit berikutnya dijalankan pemilik produk di **VS Code** (sesi terpisah dari sesi pengembangan) dengan **Haiku 5.5 effort high**, agar batas penggunaan sesi pengembangan tidak habis.

## 1. Kewajiban Eksekutor setiap selesai mengerjakan sesuatu

1. Tulis `audit/requests/REQ-XXXX-<ringkas>.md` (templat `templates/PERMINTAAN_AUDIT.md`), **kecil dan terfokus** (lihat §3).
2. Tambahkan baris di `audit/LEDGER.md`.
3. Di akhir jawaban kepada pemilik produk, sertakan satu blok kode berjudul **"PROMPT JEMBATAN VS CODE"** yang **dapat ditempel apa adanya** (diisi dari templat §2). Pemilik tidak perlu menyunting.
4. Jangan menyatakan pekerjaan "selesai/lulus"; nyatakan "menunggu audit".
5. Setelah laporan auditor ada di `audit/reports/`, baca sendiri buktinya, uji ulang temuan yang meragukan (auditor model kecil dapat salah), lalu tulis `audit/responses/RSP-XXXX-*.md`.

## 2. Templat prompt jembatan (isi bagian dalam `<...>`)

```
PERAN: Anda AUDITOR INDEPENDEN proyek NUTRIVA (mesin gizi 1000 HPK untuk ibu, anak, kader posyandu;
PjBL/skripsi kedokteran). Ada EKSEKUTOR lain yang membangun. Tugas Anda mencari kesalahan, celah, dan
risiko dengan BUKTI. Bahasa: Indonesia. Folder kerja = folder proyek yang terbuka di VS Code ("NUTRIVA RAHMA").

LANGKAH 0 (konteks, baca berurutan, satu berkas per langkah; setelah tiap berkas tulis 2 baris catatan
di audit/evidence/catatan-sesi-<REQ>.md):
  1) CLAUDE.md   2) AUDITOR_PACKAGE/00_BACA_DULU.md   3) 02_HARAPAN_EKSEKUTOR.md
  4) 05_PROTOKOL_AUDIT.md   5) 04_ARSITEKTUR_DAN_ATURAN.md (invarian)   6) checklist yang relevan di 06_CHECKLIST_PER_TAHAP.md: <bagian>
  Jika Anda sudah membaca paket di sesi ini, cukup baca ulang 05_ dan bagian checklist.

ATURAN KERAS:
- TULIS hanya di audit/reports/, audit/proposed_tests/, audit/evidence/, dan kolom auditor di audit/LEDGER.md.
  JANGAN mengedit kode, data, registri, strategi, tasklist, docs/, atau AUDITOR_PACKAGE/.
- Jangan menjalankan perintah git yang mengubah keadaan (commit, checkout, reset, merge, push, stash).
- Jangan percaya klaim eksekutor. Jangan menyimpulkan dari ringkasan: BUKA berkasnya.
- Setiap temuan wajib memuat lokasi (berkas:baris atau halaman sumber), bukti, dan cara reproduksi.
  Dilarang mengarang sitasi, nomor peraturan, halaman, angka, atau hasil uji. Bila tidak yakin tulis
  TIDAK DAPAT DIVERIFIKASI beserta alasannya.
- Skala S0-S4, label keyakinan (TERKONFIRMASI/KEMUNGKINAN/DUGAAN), vonis: ikuti 05_PROTOKOL_AUDIT.md.
- Bila ragu antara dua tingkat keparahan, pilih yang lebih tinggi dan jelaskan.

TUGAS: Audit <jenis: A-IMPL/A-DATA/A-SAFE/A-UX/A-AI/A-RES/A-GATE/A-SRC/A-SPEC> atas permintaan
audit/requests/<REQ-XXXX-...>.md. Objek: <berkas/folder/versi>. Ruang lingkup: <batas>.
Di luar ruang lingkup: <daftar>.

LANGKAH KERJA (ikuti urutan; simpan hasil antara di audit/evidence/ pada tiap langkah):
  A. Baca REQ. Periksa syarat "siap diaudit" (02_HARAPAN_EKSEKUTOR.md §5). Jika tidak terpenuhi -> vonis TIDAK DAPAT DIAUDIT.
  B. FASE BUTA: <besaran/nilai yang harus Anda turunkan sendiri dari sumber primer SEBELUM membuka implementasi>. Tulis
     di audit/evidence/buta-<REQ>.md. JANGAN membuka: <berkas hasil eksekutor yang dilarang dibuka dulu>.
  C. Fase terstruktur: jalankan checklist <bagian 06_> butir demi butir; tandai tiap butir LULUS/GAGAL/TIDAK DAPAT DIVERIFIKASI dengan bukti.
  D. Fase improvisasi (>= 30% usaha): coba minimal 10 skenario dari 07_RED_TEAM_DAN_IMPROVISASI.md yang relevan
     DITAMBAH minimal 5 skenario buatan Anda sendiri. Catat yang TIDAK menemukan masalah juga.
  E. Fase proses: uji-dulu, commit, ADR, ruang lingkup, kesesuaian klaim vs kenyataan.
  F. Tulis laporan di audit/reports/RPT-<nomor>-<ringkas>.md memakai AUDITOR_PACKAGE/templates/LAPORAN_AUDIT.md.
     Mulai dengan vonis dan lima temuan teratas. Wajib ada "Yang tidak saya periksa".
  G. Perbarui audit/LEDGER.md (kolom RPT, Vonis, S0, S1, S2).

SELESAI bila: laporan ada, setiap temuan punya bukti, LEDGER terbarui. Akhiri dengan ringkasan <= 10 baris untuk
pemilik produk. Jangan menunggu tanggapan eksekutor.
```

## 3. Penyesuaian untuk model kecil (Haiku)

- **REQ kecil:** satu tujuan per REQ; objek ≤ ~10 berkas atau ≤ ~30 klaim. Pisahkan audit besar menjadi beberapa REQ berurutan.
- **Tulis eksplisit** apa yang harus diperiksa (daftar butir) dan **nilai harapan** apa yang harus diturunkan buta, supaya tidak bergantung pada inisiatif model.
- **Langkah bernomor** dan **berkas catatan antara** (`audit/evidence/`) mengurangi hilangnya konteks pada dokumen panjang.
- **Cuplikan terpilih:** sebutkan berkas dan bagian persisnya untuk dibaca, bukan seluruh folder.
- **Verifikasi silang oleh Eksekutor:** setiap temuan S0/S1 dan setiap klaim "LULUS" pada area klinis diuji ulang oleh Eksekutor sebelum diterima; ketidaksepakatan dieskalasi ke pemilik.
- Untuk audit klinis berisiko tinggi (A-SAFE, A-GATE M2), pemilik dapat memakai model lebih besar dan membandingkan dua laporan.

## 4. Daftar pengiriman untuk pemilik produk

- [ ] Buka folder `NUTRIVA RAHMA` (akar proyek) di VS Code
- [ ] Sesi baru, model **Haiku 5.5**, effort **high**, akses web aktif bila audit memerlukan sumber
- [ ] Tempel **seluruh** blok "PROMPT JEMBATAN VS CODE" dari Eksekutor
- [ ] Jangan jalankan dua auditor yang menulis berkas laporan yang sama
- [ ] Setelah selesai, kembali ke sesi Eksekutor dan beri tahu (cukup: "audit REQ-XXXX selesai")

## 5. Varian per jenis audit (bagian yang diganti pada templat §2)

| Jenis | Fase buta | Larangan buka dulu | Checklist |
|---|---|---|---|
| A-SRC | Nilai/ambang dari sumber primer | `docs/verifikasi_eksekutor/` | 06 §B2, B5 |
| A-SPEC | Alternatif rancangan dan argumen penolakan | — | 06 Pra-M0 |
| A-IMPL | Nilai harapan dari AKG/Permenkes/WHO untuk kasus uji | Implementasi fungsi yang diuji | 06 §B1, §C |
| A-DATA | 10% baris data dicek ke sumber | Kolom nilai di data (lihat sumber lebih dulu) | 06 §B2 |
| A-SAFE | Matriks kondisi × bahan × usia dari pedoman | Daftar aturan eksekutor | 06 §B3 |
| A-UX | Tugas pengguna dan kriteria WCAG | — | 06 §B4 |
| A-AI | Daftar serangan (07 §7) | Prompt sistem AI | 06 §B6 |
| A-RES | Persyaratan etik dan UU PDP | Formulir consent | 06 §B7 |
