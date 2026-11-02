# Laporan: Tata letak adaptif tanpa bingkai (2026-11-03)

## Masalah
Versi sebelumnya memaksa tampilan ponsel (bingkai smartphone 392×848) di desktop.

## Metode: "ruang", bukan "perangkat"
1. **Tanpa deteksi perangkat untuk tata letak.** Tidak ada UA sniffing. Satu DOM; cangkang adalah *size container* (`container: app / inline-size`). Tata letak mengikuti lebar kontainer yang sebenarnya lewat `@container`, sehingga jendela desktop yang disempitkan, tablet, lipat, dan ponsel landscape otomatis benar tanpa daftar perangkat.
2. **Tiga kelas ruang** (`data-ruang`, diselaraskan JS lewat ResizeObserver untuk perilaku & ARIA): ringkas <640 → nav bawah + lembar bawah; sedang 640–1023 → rel kiri 88 px + laci kanan; lega ≥1024 → sidebar 268 px + inspektur menempel (kolom grid, bukan overlay, `aria-modal=false`).
3. **Isi mengalir sendiri**: grid intrinsik `auto-fit/minmax` di dalam kontainer kedua, jadi 1 kolom di ponsel, 2–3 kolom di layar lebar tanpa breakpoint per layar. Judul fluid via `cqi`; ultra-lebar dibatasi 1320 px.
4. **Modalitas masukan terpisah dari ukuran**: `data-masukan=sentuh|kursor` dari `(pointer: coarse)`/`(any-pointer: fine)`, berpindah langsung saat `pointerType` berubah (laptop layar sentuh/hibrida). Mengubah kata "Ketuk/Klik", petunjuk pintasan 1–5 & Esc.
5. Ponsel landscape (`max-height:520px`) dipadatkan; target ≥48 px dipertahankan.

## Bukti
- `npm run check` hijau (451 uji), bundel 470,5 KiB (<1,5 MiB).
- `e2e/adaptif.cjs`: 1316 lulus/0 gagal (19 viewport 280–3840, tanpa bingkai/radius/border, tanpa gulir horizontal, nav di tempat tepat, lembar tiga bentuk, resize langsung, sentuh vs kursor, hibrida, teks 200%, rujukan).
- `e2e/smoke.cjs`: 1681 lulus/0 gagal.

## Batas yang jujur
Belum diuji pada perangkat fisik/pembaca layar nyata; performa ponsel murah belum diukur.
