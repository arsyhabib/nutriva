# REQ-0004 — A-SPEC-1: Audit keputusan pemilik, jalur rilis, dan ruang lingkup M1

- **Jenis audit:** A-SPEC (lanjutan) + penilaian mitigasi A-RES versi PjBL
- **Tanggal:** 2026-10-28 · **Pengirim:** Eksekutor
- **Objek:** `KEPUTUSAN_DAN_JALUR_RILIS.md` (seluruh), perubahan registri (A10, A17, B10–B14, J09–J13), `audit/responses/RSP-0002-A-SPEC-0.md` §D1–D6
- **Di luar ruang lingkup:** fakta ilmiah (REQ-0003)

## Tujuan
Menilai apakah (1) jalur V-PJBL dengan mitigasi §3 cukup menutup S0 R02 dan R06 secara teknis dan jujur, (2) irisan M1 koheren dan dapat dibangun, (3) perubahan gerbang tidak melemahkan pengendalian kualitas secara tidak sah, dan (4) keputusan teknis T-01…T-11 masuk akal.

## Pertanyaan (kerjakan berurutan; tulis hasil antara di `audit/evidence/`)
1. **Mitigasi S0.** Untuk tiap butir mitigasi §3 (1–8): cukup / kurang / tidak dapat diverifikasi. Adakah skenario yang tetap mencelakai ibu/anak atau membocorkan data pada V-PJBL? Beri minimal 5 skenario konkret.
2. **Kejujuran klaim.** Apakah pembatasan klaim V-PJBL ("prototipe edukasi", label belum diverifikasi dosen) cukup agar penguji dan pengguna tidak salah paham? Adakah kalimat dalam dokumen yang berlebihan?
3. **Ketergantungan M1.** Untuk tiap ID di M1 (§4): periksa bahwa tidak bergantung pada ID yang ditunda. Daftar semua ketergantungan yang hilang. Periksa hitungan: tertulis 44 fungsional + 8 desain.
4. **Mode anak 6–23 bulan sebagai mode pertama (T-01):** apakah B13 (membedakan menu tambahan vs total), B01–B03, A19 cukup untuk keselamatan anak? Apa yang kurang?
5. **Gerbang (§6):** adakah pelemahan yang tidak dapat dipertanggungjawabkan? Apa yang harus tetap pada M2/M3 walau dosen belum memverifikasi?
6. **Keputusan teknis T-01…T-11:** nilai tiap keputusan (setuju/tidak/perlu bukti) dengan alasan; khususnya T-06 (USDA FDC untuk 30 bahan) dan T-08 (tabel resmi vs LMS).
7. **Penerimaan risiko pemilik:** apakah format penerimaan di §3 memenuhi `05_PROTOKOL_AUDIT.md` §6 (tertulis, beralasan)? Apa yang masih harus dilengkapi pemilik?
8. **Risiko baru** yang timbul dari keputusan ini (minimal 5).

## Kriteria penerimaan
- [ ] Setiap pertanyaan punya jawaban dan bukti
- [ ] Temuan bernomor AUD-0004-xx dengan tingkat
- [ ] Vonis atas kelayakan memulai M0 untuk V-PJBL

## Hal yang paling saya cemaskan
Penundaan etik dan dosen membuat S0 tampak "diterima" padahal mitigasinya hanya prosedural; saya mungkin terlalu mudah menerima saran pemangkasan; irisan M1 mungkin masih bergantung pada fitur ditunda.

## Asumsi
Pemilik bertanggung jawab atas izin institusi PjBL; auditor tidak menilai kepatuhan etik formal, hanya kecukupan mitigasi teknis dan kejujuran klaim.
