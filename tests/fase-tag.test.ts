import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { bandingkanDenganSnapshot, parseRegistri, type SnapshotFase } from "../src/tools/faseTag";

const registri = readFileSync("REGISTRI_FITUR_NUTRIVA.md", "utf8");
const snapshot = JSON.parse(readFileSync("data/fase_tag.snapshot.json", "utf8")) as SnapshotFase;

describe("tag fase registri (ADR-0004)", () => {
  const { fase, galat } = parseRegistri(registri);

  it("setiap ID punya tepat satu tag fase yang dikenal dan tidak ada ID ganda", () => {
    expect(galat).toEqual([]);
  });

  it("jumlah ID 153", () => {
    expect(Object.keys(fase).length).toBe(153);
  });

  it("registri sama dengan snapshot beku", () => {
    expect(bandingkanDenganSnapshot(fase, snapshot)).toEqual([]);
  });

  it("hitungan per fase sesuai keputusan v3 (M1 = 61: 31 + 30)", () => {
    const hitung = (f: string) => Object.values(fase).filter((x) => x === f).length;
    expect(hitung("M1a")).toBe(31);
    expect(hitung("M1b")).toBe(30);
    expect(hitung("M2")).toBe(16);
    expect(hitung("M3")).toBe(6);
    expect(hitung("M3+")).toBe(56);
    expect(hitung("M4")).toBe(1);
    expect(hitung("M5")).toBe(2);
    expect(hitung("Tunda")).toBe(11);
  });

  it("instrumen kegunaan dan consent berada di M2, bukan M5 (AUD-0005-10)", () => {
    for (const id of ["B07", "F01", "F02", "F03", "F04"]) expect(fase[id]).toBe("M2");
  });

  it("mendeteksi perubahan tag tanpa pembaruan snapshot", () => {
    const berubah = { ...fase, A01: "Tunda" };
    expect(bandingkanDenganSnapshot(berubah, snapshot).length).toBe(1);
  });

  it("parser menolak baris tanpa tag atau dengan tag ganda", () => {
    const buruk = "| Z01 | tanpa tag | x |\n| A99 | dua `[M1a]` `[M2]` | x |\n";
    // Z01 bukan rentang A–L sehingga diabaikan; A99 harus dilaporkan
    const r = parseRegistri(buruk);
    expect(r.galat.some((g) => g.startsWith("A99"))).toBe(true);
  });
});
