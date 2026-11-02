import { randomBytes } from "node:crypto";
import { writeFileSync } from "node:fs";
import { createInterface } from "node:readline";
import { tamarkan, bukaTamar } from "../ai/tamar";

/**
 * Pasang atau hapus kunci OpenRouter bawaan. Jalankan di komputer Anda sendiri; kunci tidak melewati pihak lain.
 *   npm run kunci:pasang            (diminta mengetik kunci, tidak ditampilkan)
 *   OPENROUTER_KUNCI_BAWAAN=... npm run kunci:pasang
 *   npm run kunci:pasang -- --hapus
 * Hasil: src/ai/kunci-bawaan.ts berisi kunci yang TERSAMAR (bukan terenkripsi). Lalu build dan commit sendiri.
 */
const BERKAS = "src/ai/kunci-bawaan.ts";

function tulis(isi: string): void {
  writeFileSync(
    BERKAS,
    `import type { KunciTersamar } from "./tamar";\n\n/**\n * Kunci OpenRouter bawaan (tersamar). Berkas ini DITULIS ULANG oleh \`npm run kunci:pasang\`; jangan menyunting tangan.\n * null = tidak ada kunci bawaan (pengguna memakai kunci sendiri atau teks cadangan).\n */\nexport const KUNCI_BAWAAN: KunciTersamar | null = ${isi};\n`,
  );
}

async function tanyaTersembunyi(prompt: string): Promise<string> {
  const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });
  const asli = (rl as unknown as { _writeToOutput: (s: string) => void })._writeToOutput;
  process.stdout.write(prompt);
  (rl as unknown as { _writeToOutput: (s: string) => void })._writeToOutput = () => undefined;
  return new Promise((selesai) => rl.question("", (jawab) => {
    (rl as unknown as { _writeToOutput: (s: string) => void })._writeToOutput = asli;
    rl.close();
    process.stdout.write("\n");
    selesai(jawab.trim());
  }));
}

async function utama(): Promise<void> {
  if (process.argv.includes("--hapus")) {
    tulis("null");
    console.log("Kunci bawaan dihapus dari", BERKAS);
    return;
  }
  const kunci = (process.env["OPENROUTER_KUNCI_BAWAAN"] ?? "").trim() || (await tanyaTersembunyi("Tempel kunci OpenRouter (tidak ditampilkan): "));
  if (!/^sk-or-[A-Za-z0-9_-]{16,}$/.test(kunci)) {
    console.error("Format kunci tidak dikenali (diharapkan diawali sk-or-). Tidak ada yang ditulis.");
    process.exitCode = 1;
    return;
  }
  const hasil = tamarkan(kunci, new Uint8Array(randomBytes(16)));
  if (bukaTamar(hasil) !== kunci) {
    console.error("Pemeriksaan bolak-balik gagal. Tidak ada yang ditulis.");
    process.exitCode = 1;
    return;
  }
  tulis(JSON.stringify(hasil));
  console.log(`Kunci bawaan tersamar ditulis ke ${BERKAS}.`);
  console.log("Berikutnya: npm run check, npm run build, lalu commit dan push sendiri.");
  console.log("Ingat: ini penyamaran, bukan enkripsi. Beri batas kredit pada kunci ini di OpenRouter dan ganti berkala.");
}

void utama();
