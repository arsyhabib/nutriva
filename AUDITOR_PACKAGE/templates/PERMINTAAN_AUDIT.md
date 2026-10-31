# REQ-XXXX — <judul singkat>

- **Jenis audit:** A-SRC / A-SPEC / A-IMPL / A-DATA / A-SAFE / A-UX / A-AI / A-RES / A-GATE / A-REL
- **Tanggal:** YYYY-MM-DD
- **Pengirim:** Eksekutor
- **Objek:** commit/tag/versi: `<hash>` · berkas/folder: `<jalur>`
- **Item registri terkait:** <ID mis. A03, B01>
- **Prioritas:** rendah / normal / tinggi (tanpa tekanan waktu)

## 1. Tujuan perubahan
<apa dan mengapa, dua-tiga kalimat>

## 2. Apa yang berubah
- <berkas/modul>: <ringkasan>
- Invarian yang tersentuh: INV-xx
- Skema/versi yang berubah: engine `x.y.z`, data `x.y.z`, trace `x`

## 3. Cara menjalankan dan memverifikasi
```
<perintah dari nol: instal, uji, jalankan>
```
Hasil uji eksekutor: <lulus/gagal, jumlah, cakupan; lampirkan keluaran ringkas>

## 4. Kriteria penerimaan
- [ ] <kriteria terukur 1>
- [ ] <kriteria terukur 2>

## 5. Klaim yang dibuat
| Klaim | Dasar (ID klaim di register / sumber) | Status verifikasi |
|---|---|---|

## 6. Hal yang paling saya cemaskan
<tempat eksekutor jujur: apa yang menurut saya paling mungkin salah>

## 7. Asumsi dan keterbatasan
<daftar>

## 8. Yang TIDAK berubah (supaya tidak diaudit ulang)
<daftar>

## 9. Permintaan khusus kepada auditor
<mis. fokus pada perilaku batas usia; uji diferensial vs WHO Anthro>
