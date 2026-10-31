import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join, relative } from "node:path";
import { lintFixture } from "./lintFixtures";

const akar = process.cwd();
const DIR = join(akar, "tests", "fixtures");

function semuaJson(dir: string): string[] {
  if (!existsSync(dir)) return [];
  const hasil: string[] = [];
  for (const nama of readdirSync(dir)) {
    const p = join(dir, nama);
    if (statSync(p).isDirectory()) hasil.push(...semuaJson(p));
    else if (nama.endsWith(".json")) hasil.push(p);
  }
  return hasil;
}

const galat: string[] = [];
const berkas = semuaJson(DIR);
for (const b of berkas) {
  const nama = relative(akar, b).replaceAll("\\", "/");
  try {
    galat.push(...lintFixture(nama, JSON.parse(readFileSync(b, "utf8"))));
  } catch (e) {
    galat.push(`${nama}: bukan JSON valid (${(e as Error).message})`);
  }
}

if (galat.length > 0) {
  console.error("lint:fixtures GAGAL");
  for (const g of galat) console.error(" - " + g);
  process.exit(1);
}
console.log(`lint:fixtures OK — ${berkas.length} fixture sintetis diperiksa.`);
