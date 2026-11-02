import { describe, expect, it } from "vitest";
import { DAFTAR_EKSPOR, bangunDokumen, judulBerkas } from "../src/ui/ekspor";
import { ringkasan } from "../src/app/fasad";
import { PRESET_SINTETIS } from "../src/ui/preset";

describe("dokumen ekspor PDF", () => {
  const p = PRESET_SINTETIS.A;
  const masukan = p.masukan;
  const r = ringkasan(masukan);
  if (r.hasil !== "ok") throw new Error("preset harus valid");
  const c = { r, masukan, labelContoh: p.label, hariIdx: 0, tanggal: new Date("2026-11-03T00:00:00Z"), labelAlasan: "" } as never;
  it.each(DAFTAR_EKSPOR.map((d) => d.jenis))("jenis %s: bersih, bermerek, tanpa kata terlarang", (jenis) => {
    const h = bangunDokumen(jenis, c);
    const teks = h.replace(/<[^>]+>/g, " ");
    expect(h).toContain("dok-");
    expect(teks).not.toMatch(/dosen|verifikasi|PjBL|sintetis|gerbang konteks|audit ilmiah/i);
    expect(h).not.toMatch(/<script|on\w+=/i);
    expect(judulBerkas(jenis, c)).toMatch(/^NUTRIVA - /);
  });
});
