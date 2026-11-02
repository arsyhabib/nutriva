import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { hitungStatus, type MasukanStatus } from "../src/engine/antropometri";

interface Kasus extends MasukanStatus {
  id: string;
  keterangan: string;
  harapan: Record<string, unknown> & {
    hasil: "ok" | "stop";
    bbu?: { kategori: string; posisi: string | null };
    pbu?: { kategori: string; posisi: string | null };
    bbpb?: { kategori: string; posisi: string | null };
  };
}

const berkas = JSON.parse(
  readFileSync(new URL("./golden/kasus_status.json", import.meta.url), "utf8"),
) as { kasus: Kasus[] };

describe("golden status gizi (hitung tangan independen)", () => {
  it("memuat 129 kasus dan tidak ada yang dilewati", () => {
    expect(berkas.kasus).toHaveLength(129);
  });

  for (const k of berkas.kasus) {
    it(`${k.id}: ${k.keterangan}`, () => {
      const out = hitungStatus(k);
      const h = k.harapan;
      expect(out.hasil).toBe(h.hasil);
      if (h.hasil === "stop" && out.hasil === "stop") {
        expect(out.alasan).toBe(h["alasan"]);
        return;
      }
      if (out.hasil !== "ok") throw new Error(`mesin berhenti (${out.alasan}), golden mengharapkan ok`);
      expect(out.usia_bulan_penuh).toBe(h["usia_bulan_penuh"]);
      expect(out.panjang_dipakai_cm).toBe(h["panjang_dipakai_cm"]);
      expect(out.panjang_tabel_cm).toBe(h["panjang_tabel_cm"]);
      for (const ind of ["bbu", "pbu", "bbpb"] as const) {
        expect({ kategori: out[ind].kategori, posisi: out[ind].posisi }).toEqual(h[ind]);
        expect(out[ind].klaim_id).toMatch(/^KL-SD-/);
      }
      expect(out.engine_version).toBeTruthy();
      expect(out.data_version).toBeTruthy();
    });
  }
});
