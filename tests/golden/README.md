# Kasus baku (golden cases)

Kasus baku adalah masukan sintetis dengan **nilai harapan yang berasal dari sumber independen**
(tabel resmi Permenkes, perhitungan tangan, WHO Anthro), BUKAN dari keluaran mesin sendiri (J13).
Berkas: `NNN-ringkas.json` dengan `sintetis: true`, `asal: "dibuat-pengembang"`, `masukan`, `harapan`,
`sumber_harapan`, dan `disetujui_oleh` (pembimbing/dosen; kosong = belum disetujui).

Kasus baku KOSONG bukan lulus. `npm run gate:m1a` gagal bila jumlah kasus < 30 atau ada kasus
yang belum bertanda persetujuan.
