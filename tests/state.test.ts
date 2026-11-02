import { describe, expect, it } from "vitest";
import { buatStatusMemori } from "../src/engine/state";

describe("status memori-saja", () => {
  it("menulis, membaca, dan memberi tahu pelanggan tanpa penyimpanan peramban", () => {
    const s = buatStatusMemori({ a: 1, b: "x" });
    const lihat: number[] = [];
    const lepas = s.langgan((v) => lihat.push(v.a));
    s.tulis({ a: 2 });
    lepas();
    s.tulis({ a: 3 });
    expect(s.baca()).toEqual({ a: 3, b: "x" });
    expect(lihat).toEqual([2]);
    expect(Object.isFrozen(s.baca())).toBe(true);
  });
});
