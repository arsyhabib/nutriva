import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { bukaTamar, tamarkan } from "../src/ai/tamar";
import { KUNCI_BAWAAN } from "../src/ai/kunci-bawaan";

const PALSU = "sk-or-v1-PALSU-UNTUK-UJI-0123456789abcdef-tanpa-nilai";

describe("kunci bawaan tersamar", () => {
  it("bolak-balik tamar/buka tepat, dengan garam berbeda hasilnya berbeda", () => {
    const g1 = Uint8Array.from({ length: 16 }, (_, i) => i + 1);
    const g2 = Uint8Array.from({ length: 16 }, (_, i) => 200 - i);
    const a = tamarkan(PALSU, g1);
    const b = tamarkan(PALSU, g2);
    expect(bukaTamar(a)).toBe(PALSU);
    expect(bukaTamar(b)).toBe(PALSU);
    expect(JSON.stringify(a)).not.toBe(JSON.stringify(b));
  });
  it("hasil tersamar tidak memuat kunci mentah atau pola kunci", () => {
    const t = JSON.stringify(tamarkan(PALSU, Uint8Array.from({ length: 16 }, (_, i) => i * 7)));
    expect(t).not.toContain("sk-or");
    expect(t).not.toContain("PALSU");
  });
  it("masukan rusak tidak melempar, hasilnya kosong", () => {
    expect(bukaTamar(null)).toBe("");
    expect(bukaTamar({ v: 1, s: "!!", u: [0, 1, 2], p: ["a", "b", "c"] })).toBe("");
    expect(bukaTamar({ v: 2 } as never)).toBe("");
  });
  it("berkas kunci bawaan di repo tidak berisi kunci mentah dan, bila terisi, dapat dibuka", () => {
    const sumber = readFileSync("src/ai/kunci-bawaan.ts", "utf8");
    expect(sumber).not.toMatch(/sk-or-/);
    if (KUNCI_BAWAAN) expect(bukaTamar(KUNCI_BAWAAN)).toMatch(/^sk-or-/);
  });
});
