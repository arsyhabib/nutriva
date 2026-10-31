/**
 * Pemeriksa konstanta numerik dalam kode mesin (INV-04; AUD-0006-10).
 * Setiap deklarasi `const NAMA = <angka>` di `src/engine/**` wajib diberi anotasi
 *   // klaim: KL-XXXX            (konstanta ilmiah)
 *   // klaim: n/a — <alasan>     (bukan konstanta ilmiah, mis. versi skema)
 * pada baris yang sama atau baris sebelumnya.
 *
 * Batas yang diketahui: hanya mendeteksi pola deklarasi baris-tunggal; objek/larik angka dan
 * angka dalam ekspresi tidak dideteksi (wajib tinjauan kode; DoD M1a).
 */
const POLA_DEKLARASI = /^\s*(?:export\s+)?const\s+[A-Za-z_][A-Za-z0-9_]*\s*(?::[^=]+)?=\s*[-+]?\d/;
const POLA_ANOTASI = /\/\/\s*klaim:\s*(?:KL-[A-Za-z0-9_-]+|n\/a\s*[—-]\s*\S.*)/;

export function periksaKonstantaKode(berkas: string, teks: string): string[] {
  const galat: string[] = [];
  const baris = teks.split(/\r?\n/);
  baris.forEach((b, i) => {
    if (!POLA_DEKLARASI.test(b)) return;
    const sebelumnya = i > 0 ? (baris[i - 1] as string) : "";
    if (!POLA_ANOTASI.test(b) && !POLA_ANOTASI.test(sebelumnya)) {
      galat.push(`${berkas}:${i + 1}: konstanta numerik tanpa anotasi "// klaim:"`);
    }
  });
  return galat;
}
