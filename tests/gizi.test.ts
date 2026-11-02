import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { hitungGizi, persenAkg } from "../src/engine/gizi";
import { bulatAtasLima } from "../src/engine/belanja";
import { DATA } from "../src/engine/data";

interface Kasus {
  usia: number;
  item: [string, number][];
  energi_kkal: number;
  zat: Record<string, { nilai: number; persen: number; pita: string }>;
  belanja_gram: Record<string, number>;
}
const kasus = JSON.parse(readFileSync("tests/golden/kasus_gizi.json", "utf8")) as Kasus[];

describe("golden gizi (hitung tangan Python independen)", () => {
  for (const k of kasus) {
    it(`usia ${k.usia} bulan: total, persen, pita, belanja`, () => {
      const t = hitungGizi(k.item.map(([bahan_id, gram]) => ({ bahan_id, gram })));
      expect(Math.abs(t.total.energi_kkal - k.energi_kkal)).toBeLessThan(1e-9);
      const lap = persenAkg(t, k.usia);
      for (const z of lap.zat) {
        const g = k.zat[z.zat];
        expect(g, z.zat).toBeDefined();
        expect(Math.abs(z.nilai - (g?.nilai ?? NaN)), z.zat).toBeLessThan(1e-9);
        expect(z.persen, z.zat).toBe(g?.persen);
        expect(z.pita, z.zat).toBe(g?.pita);
      }
      for (const [id, gram] of k.item) {
        const a = DATA.bahanAtribut.bahan.find((b) => b.id === id);
        expect(bulatAtasLima(gram * (a?.rasio_beli ?? NaN)), id).toBe(k.belanja_gram[id]);
      }
    });
  }
  it("bahan tidak dikenal dan gram negatif ditolak", () => {
    expect(() => hitungGizi([{ bahan_id: "xx", gram: 1 }])).toThrow();
    expect(() => hitungGizi([{ bahan_id: "nasi", gram: -1 }])).toThrow();
  });
  it("zat hilang ditandai tidak_lengkap, bukan 0 diam-diam", () => {
    const t = hitungGizi([{ bahan_id: "nasi", gram: 100 }]);
    const lap = persenAkg(t, 12);
    for (const z of lap.zat) expect(z.lengkap).toBe(!t.tidak_lengkap.includes(z.zat));
  });
});
