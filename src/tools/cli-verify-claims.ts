import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join, relative } from "node:path";
import { KumpulanKlaimSchema, KumpulanSumberSchema } from "../engine/schema/klaim";
import { kumpulkanRujukan, verifikasiKlaim, type Rujukan } from "./verifikasiKlaim";
import { periksaKonstantaKode } from "./konstantaKode";

const akar = process.cwd();
const DIR_DATA = join(akar, "data");
const DIR_ENGINE = join(akar, "src", "engine");

/** Berkas registri yang bukan data aturan: tidak dipindai sebagai data. */
const BERKAS_REGISTRI = new Set(["claims.json", "sources.json", "fase_tag.snapshot.json"]);
/** Satu-satunya berkas non-JSON yang diperbolehkan di data/. */
const BERKAS_BOLEH_NON_JSON = new Set([".gitkeep", "README.md"]);

function semuaBerkas(dir: string): string[] {
  if (!existsSync(dir)) return [];
  const hasil: string[] = [];
  for (const nama of readdirSync(dir)) {
    const p = join(dir, nama);
    if (statSync(p).isDirectory()) hasil.push(...semuaBerkas(p));
    else hasil.push(p);
  }
  return hasil;
}

function muatJson(path: string): unknown {
  return JSON.parse(readFileSync(path, "utf8"));
}

const galat: string[] = [];

const klaim = KumpulanKlaimSchema.safeParse(muatJson(join(DIR_DATA, "claims.json")));
if (!klaim.success) {
  console.error("data/claims.json tidak valid:\n" + klaim.error.message);
  process.exit(1);
}
const sumber = KumpulanSumberSchema.safeParse(muatJson(join(DIR_DATA, "sources.json")));
if (!sumber.success) {
  console.error("data/sources.json tidak valid:\n" + sumber.error.message);
  process.exit(1);
}

const rujukan: Rujukan[] = [];
let jumlahBerkasData = 0;
for (const berkas of semuaBerkas(DIR_DATA)) {
  const nama = relative(akar, berkas).replaceAll("\\", "/");
  const sederhana = relative(DIR_DATA, berkas).replaceAll("\\", "/");
  const namaBerkas = sederhana.split("/").pop() as string;

  if (!namaBerkas.endsWith(".json")) {
    if (!BERKAS_BOLEH_NON_JSON.has(namaBerkas)) {
      galat.push(`${nama}: tipe berkas tidak diizinkan di data/ (hanya .json; sumber berhak cipta tidak boleh di sini)`);
    }
    continue;
  }
  if (BERKAS_REGISTRI.has(sederhana)) continue; // registri di akar data/ saja

  jumlahBerkasData++;
  try {
    const hasil = kumpulkanRujukan(nama, muatJson(berkas));
    rujukan.push(...hasil.rujukan);
    galat.push(...hasil.galat);
  } catch (e) {
    galat.push(`${nama}: bukan JSON valid (${(e as Error).message})`);
  }
}

let jumlahBerkasKode = 0;
for (const berkas of semuaBerkas(DIR_ENGINE)) {
  if (!berkas.endsWith(".ts")) continue;
  jumlahBerkasKode++;
  const nama = relative(akar, berkas).replaceAll("\\", "/");
  galat.push(...periksaKonstantaKode(nama, readFileSync(berkas, "utf8")));
}

const hasil = verifikasiKlaim(klaim.data.klaim, sumber.data.sumber, rujukan, galat);
if (!hasil.ok) {
  console.error("verify:claims GAGAL");
  for (const g of hasil.galat) console.error(" - " + g);
  process.exit(1);
}
console.log(
  `verify:claims OK — ${klaim.data.klaim.length} klaim, ${sumber.data.sumber.length} sumber, ${jumlahBerkasData} berkas data dan ${jumlahBerkasKode} berkas kode dipindai, ${rujukan.length} rujukan.`,
);
