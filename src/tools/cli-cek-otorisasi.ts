import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { bukaPintuData } from "../engine/otorisasi";

/**
 * Memeriksa apakah profil `lapangan` boleh dibuka di mesin ini.
 * Pemakaian: tsx src/tools/cli-cek-otorisasi.ts --versi-aturan <versi> [--tanggal YYYY-MM-DD]
 * Keluar 0 bila pintu terbuka, 1 bila tertutup.
 */
function argumen(nama: string): string | undefined {
  const i = process.argv.indexOf(nama);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

const versiAturan = argumen("--versi-aturan");
if (!versiAturan) {
  console.error("cek:otorisasi: wajib --versi-aturan <versi aktif>");
  process.exit(2);
}
const hariIni = argumen("--tanggal") ?? new Date().toISOString().slice(0, 10);

const berkas = join(process.cwd(), "otorisasi.lokal.json");
let otorisasi: unknown = undefined;
if (existsSync(berkas)) {
  try {
    otorisasi = JSON.parse(readFileSync(berkas, "utf8"));
  } catch (e) {
    console.error(`cek:otorisasi: otorisasi.lokal.json bukan JSON valid (${(e as Error).message})`);
    process.exit(1);
  }
}

const hasil = bukaPintuData({
  profil: "lapangan",
  otorisasi,
  versiAturanAktif: versiAturan,
  tanggalHariIni: hariIni,
});

if (hasil.terbuka) {
  console.log("cek:otorisasi: pintu data nyata TERBUKA untuk profil lapangan.");
  process.exit(0);
}
console.error("cek:otorisasi: pintu data nyata TERTUTUP");
for (const a of hasil.alasan) console.error(" - " + a);
process.exit(1);
