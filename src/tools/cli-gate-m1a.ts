import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Gerbang M1a (AUD-0006-08): kasus baku KOSONG bukan lulus.
 * Tidak termasuk `npm run check`; dijalankan saat menilai kesiapan M1a/M2.
 */
const MINIMUM_KASUS_BAKU = 30; // klaim: n/a — target proses (RPT-0005 §6 butir 7), bukan konstanta ilmiah

const dir = join(process.cwd(), "tests", "golden");
const galat: string[] = [];

const berkas = existsSync(dir) ? readdirSync(dir).filter((n) => /^\d{3}-.+\.json$/.test(n)) : [];
if (berkas.length < MINIMUM_KASUS_BAKU) {
  galat.push(`kasus baku ${berkas.length} < minimum ${MINIMUM_KASUS_BAKU}`);
}

for (const n of berkas) {
  try {
    const k = JSON.parse(readFileSync(join(dir, n), "utf8")) as Record<string, unknown>;
    if (k["sintetis"] !== true) galat.push(`${n}: tidak bertanda sintetis`);
    if (typeof k["sumber_harapan"] !== "string" || k["sumber_harapan"] === "") {
      galat.push(`${n}: tanpa sumber_harapan independen`);
    }
    if (typeof k["disetujui_oleh"] !== "string" || k["disetujui_oleh"] === "") {
      galat.push(`${n}: belum disetujui (disetujui_oleh kosong)`);
    }
  } catch (e) {
    galat.push(`${n}: bukan JSON valid (${(e as Error).message})`);
  }
}

if (galat.length > 0) {
  console.error("gate:m1a BELUM LULUS");
  for (const g of galat) console.error(" - " + g);
  process.exit(1);
}
console.log(`gate:m1a OK — ${berkas.length} kasus baku disetujui.`);
