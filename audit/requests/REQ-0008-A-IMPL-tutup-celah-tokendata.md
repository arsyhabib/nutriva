# REQ-0008 — A-IMPL: Tutup celah `{} as TokenData` pada gerbang lapangan

- **Jenis audit:** A-IMPL (kecil; bagian dari penutupan AUD-0006-01 dan gerbang M0)
- **Tanggal:** 2026-10-31 · **Pengirim:** Eksekutor
- **Objek (SHA-256, 16 heks pertama; sebelum → sesudah):**
  - `src/engine/otorisasi.ts`: 3375d83db3008f8b → 10fcb1758e44bb0f
  - `tests/pintu-data.test.ts`: 8eab64103f5e169b → d681462b4d18b9bc
  - `docs/adr/ADR-0004-pembekuan-tag-fase.md`: 55315f20220fedea → 65e1c8b8d876b922
  - `docs/adr/ADR-0005-teknologi-fondasi.md`: 9f5ea5a7b2a913af → 039e474431fb6576
- **Hubungan dengan REQ-0007:** REQ-0007 dikirim sebelum perubahan ini dan masih menunggu RPT-0007. Penilaian REQ-0007 sebaiknya memakai keadaan "sebelum". REQ ini menilai keadaan "sesudah". REQ-0008 tidak menggantikan REQ-0007.
- **Item registri terkait:** J02, J07 (konfigurasi terkunci), B10 (gerbang data nyata)
- **Prioritas:** tinggi (blokir M0)

## 1. Tujuan perubahan

Saat menyiapkan REQ-0007, eksekutor menemukan bahwa `TokenData` dapat dibuat tanpa `bukaPintuData`. Penyebabnya: tipe bermerek hanya diperiksa kompilator, dan cast tunggal `{} as TokenData` lolos `tsc` (exit 0; diuji dengan berkas probe di folder scratchpad, di luar proyek). Uji arsitektur lama hanya mencari pola `as unknown as TokenData` di `src/`, jadi cast tunggal tidak tertangkap. Perubahan ini menambah lapisan runtime dan memperluas uji arsitektur.

## 2. Apa yang berubah

- `src/engine/otorisasi.ts`
  - `bukaPintuData` mencatat token yang dibuatnya di `WeakSet` privat `tokenSah`.
  - Fungsi baru `pastikanTokenData(token)` melempar galat bila token tidak tercatat. Fungsi data nyata di masa depan wajib memanggilnya. Belum ada fungsi data nyata, jadi kewajiban ini belum dapat diuji dari pemanggilnya.
  - Komentar modul diperbarui: kompilator tidak melarang cast manual.
- `tests/pintu-data.test.ts`
  - Empat uji runtime baru: token sah lolos; `{} as TokenData` ditolak; salinan dengan spread ditolak; `Object.freeze({}) as unknown as TokenData` ditolak.
  - Satu uji arsitektur baru: pola cast ke `TokenData` (`as TokenData`, `as unknown as TokenData`, `<TokenData>`) tidak boleh muncul di `src/` maupun `tests/`, kecuali `src/engine/otorisasi.ts`. Berkas uji ini sendiri dikecualikan karena sengaja memalsukan token.
- `docs/adr/ADR-0004-pembekuan-tag-fase.md`: nama berkas uji diperbaiki dari `tests/registri.test.ts` (tidak ada) menjadi `tests/fase-tag.test.ts` (AUD-0006-09). Riwayat ditambah.
- `docs/adr/ADR-0005-teknologi-fondasi.md`: versi vitest ditulis 5.0.4, sesuai `package.json` dan lock. Catatan pin ulang dari AUD-0006-11 ditambahkan. Status tetap "Diusulkan".
- Bukan kode: `TASKLIST.md` (status REQ-0006 sampai REQ-0008) dan `audit/LEDGER.md` (baris 0008).

## 3. Cara menjalankan dan memverifikasi

```
$env:Path = "C:\Program Files\nodejs;" + $env:Path
cd "C:\Users\habib\Documents\NUTRIVA RAHMA"
npm run check
```

Hasil eksekutor (2026-10-31): typecheck lulus; **106 uji lulus (8 berkas)**, naik 5 dari 101 pada REQ-0007; `verify:claims` OK; `lint:fixtures` OK.

Uji mutasi manual, dijalankan pada berkas proyek dengan cadangan. Setelah uji, berkas mutasi dihapus dan `otorisasi.ts` dipulihkan lalu dicocokkan byte demi byte dengan cadangan (`cmp`):

| Mutasi | Hasil |
|---|---|
| A: menambah `src/engine/uji-bocor.ts` berisi `export const bocor = {} as TokenData;` | **GAGAL** pada uji "cast ke TokenData … hanya di src/engine/otorisasi.ts" (menunjuk `src/engine/uji-bocor.ts`). Berkas mutasi dihapus |
| B: menghapus baris `tokenSah.add(token);` dari `otorisasi.ts` | **GAGAL** pada uji "token dari bukaPintuData lolos pastikanTokenData". Berkas dipulihkan; 16 uji di `pintu-data.test.ts` kembali lulus |

## 4. Kriteria penerimaan

- [ ] `{} as TokenData` ditolak saat runtime oleh `pastikanTokenData` (uji di `tests/pintu-data.test.ts`).
- [ ] Uji arsitektur menangkap cast tunggal di `src/` (mutasi A).
- [ ] Token sah dari `bukaPintuData` tetap lolos (mutasi B menunjukkan uji ini bekerja).
- [ ] ADR-0004 menunjuk berkas uji yang ada.
- [ ] ADR-0005 sesuai versi di `package.json` dan `package-lock.json`.
- [ ] `npm run check` hijau.

## 5. Klaim yang dibuat

- Tidak ada klaim ilmiah, angka, atau sumber baru.
- Klaim teknis: **token palsu yang dibuat dengan cast tidak lolos `pastikanTokenData`**. Ini TERKONFIRMASI oleh uji dan mutasi di atas.
- Dampak nyata: belum ada, karena belum ada fungsi data nyata. Klaim ini belum menjaga data nyata.

## 6. Hal yang paling saya cemaskan

- Lapisan runtime hanya melindungi bila setiap fungsi `simpan*/impor*/ekspor*/tulis*` kelak memanggil `pastikanTokenData`. Uji arsitektur saat ini hanya memeriksa parameter bertipe `TokenData`, bukan pemanggilan di tubuh fungsi. Ini celah yang belum tertutup.
- Pola regex hanya menangkap `as TokenData` dan `<TokenData>`. Cara lain (misalnya memakai `Object.create` atau mengubah nilai lewat modul lain) belum diuji.
- Uji arsitektur memakai regex, bukan analisis AST, sehingga penulisan yang tidak lazim bisa lolos.

## 7. Asumsi dan keterbatasan

- Belum ada fungsi simpan, impor, atau ekspor (M1a ke atas). Tidak ada data nyata yang diproses.
- Uji mutasi dilakukan manual (dua mutasi), bukan dengan alat mutation testing.
- Eksekutor tidak menulis `audit/reports/`, `audit/evidence/`, `audit/proposed_tests/`, atau `AUDITOR_PACKAGE/`.
- Belum ada sesi auditor yang aktif di mesin ini (daftar agen kosong). Permintaan ini tersimpan sebagai berkas dan menunggu sesi auditor dimulai dengan prompt rutin (`AUDITOR_PACKAGE/11_PROMPT_AUDITOR.md` bagian 2).

## 8. Yang TIDAK berubah (supaya tidak diaudit ulang)

- Verifikator klaim (`src/tools/verifikasiKlaim.ts`), lint fixture, skema klaim, sumber, dan jejak (`src/engine/schema/*`), `src/engine/konstanta.ts`.
- Tag fase, `data/claims.json`, `data/sources.json`, `data/fase_tag.snapshot.json`.
- `package.json`, `package-lock.json`, CI (`.github/workflows/check.yml`), `.gitignore`.
- `audit/responses/RSP-0006-A-GATE-M0.md` dan `audit/requests/REQ-0007-A-GATE-M0-ulang.md`.

## 9. Permintaan khusus kepada auditor

1. Cari jalur lain untuk memperoleh `TokenData` yang lolos `pastikanTokenData` tanpa `bukaPintuData`. Bila ada, tulis sebagai uji di `audit/proposed_tests/`.
2. Nilai apakah lapisan runtime cukup, atau perlu aturan tinjauan kode/uji bahwa setiap fungsi `simpan*/impor*/ekspor*/tulis*` memanggil `pastikanTokenData` di tubuhnya.
3. Nilai apakah AUD-0006-01 dapat ditutup setelah REQ-0007 dan REQ-0008 lulus, atau masih perlu A-IMPL lanjutan.
