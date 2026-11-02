import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const BATAS_BYTE = 1.5 * 1024 * 1024;
const DIR = "dist";

function semua(d: string): string[] {
  return readdirSync(d).flatMap((n) => {
    const p = join(d, n);
    return statSync(p).isDirectory() ? semua(p) : [p];
  });
}

let berkas: string[];
try {
  berkas = semua(DIR);
} catch {
  console.error(`cek:bundel GAGAL — folder ${DIR}/ tidak ada; jalankan npm run build dahulu.`);
  process.exit(1);
}
const total = berkas.reduce((n, p) => n + statSync(p).size, 0);
console.log(`Ukuran ${DIR}/: ${total} byte (${(total / 1024).toFixed(1)} KiB) dari batas ${BATAS_BYTE} byte, ${berkas.length} berkas`);

if (total > BATAS_BYTE) {
  console.error("cek:bundel GAGAL — melebihi 1,5 MB (sebelum gzip).");
  process.exit(1);
}
console.log("cek:bundel OK");
