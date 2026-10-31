import { describe, expect, it } from "vitest";
import { periksaKonstantaKode } from "../src/tools/konstantaKode";

describe("periksaKonstantaKode (AUD-0006-10)", () => {
  it("menerima konstanta dengan anotasi klaim di baris yang sama atau sebelumnya", () => {
    expect(periksaKonstantaKode("a.ts", "export const A = 800; // klaim: KL-AKG-1")).toEqual([]);
    expect(periksaKonstantaKode("a.ts", "// klaim: KL-AKG-2\nexport const B = 12;")).toEqual([]);
    expect(periksaKonstantaKode("a.ts", "// klaim: n/a — versi skema\nexport const V = 1 as const;")).toEqual([]);
  });

  it("menolak konstanta numerik tanpa anotasi", () => {
    const g = periksaKonstantaKode("a.ts", "export const BATAS_ATAS = 3000;");
    expect(g.length).toBe(1);
    expect(g[0]).toContain("a.ts:1");
  });

  it("n/a wajib disertai alasan", () => {
    expect(periksaKonstantaKode("a.ts", "// klaim: n/a\nconst X = 5;").length).toBe(1);
  });

  it("menandai konstanta bertipe eksplisit dan negatif", () => {
    expect(periksaKonstantaKode("a.ts", "const T: number = -3;").length).toBe(1);
  });

  it("mengabaikan non-angka dan variabel yang dihitung", () => {
    expect(periksaKonstantaKode("a.ts", 'const S = "teks"; const C = A + 1; const L = [1, 2];')).toEqual([]);
  });
});
