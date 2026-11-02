import { describe, expect, it } from "vitest";
import { renderMarkdown, teksPolos, adaMarkupTerlarang } from "../src/ai/markdown";

describe("mesin markdown", () => {
  it("memformat inline: tebal, miring, coret, kode, sub/sup", () => {
    const h = renderMarkdown("**tebal** *miring* ~~coret~~ `kode`");
    expect(h).toContain("<strong>tebal</strong>");
    expect(h).toContain("<em>miring</em>");
    expect(h).toContain("<del>coret</del>");
    expect(h).toContain("<code");
  });
  it("memformat judul, daftar bernomor/bullet, kutipan, tabel, garis", () => {
    const h = renderMarkdown("# Judul\n\n- a\n- b\n\n1. satu\n2. dua\n\n> kutipan\n\n| A | B |\n|---|---|\n| 1 | 2 |\n\n---");
    expect(h).toMatch(/<h[1-6]/);
    expect(h).toContain("<ul");
    expect(h).toContain("<ol");
    expect(h).toContain("<blockquote");
    expect(h).toContain("<table");
    expect(h).toContain("<hr");
  });
  it("menetralkan HTML, skrip, dan atribut berbahaya (XSS)", () => {
    const h = renderMarkdown('<script>alert(1)</script><img src=x onerror=alert(1)> [x](javascript:alert(1)) <b onclick="x">b</b>');
    expect(h).not.toMatch(/<script/i);
    expect(h).not.toMatch(/<img/i);
    expect(h).not.toMatch(/<[a-z][^>]*\son\w+\s*=/i);
    expect(h).not.toMatch(/<b[\s>]/i);
    expect(h).not.toMatch(/href\s*=\s*["']?javascript:/i);
  });
  it("tidak melempar untuk masukan kacau dan kosong", () => {
    for (const s of ["", "**", "|||", "```", "- ", "> > > >", "\u0000", "*".repeat(5000)]) {
      expect(() => renderMarkdown(s)).not.toThrow();
    }
  });
  it("teksPolos membuang markup; tautan/HTML ditandai terlarang", () => {
    expect(teksPolos("**halo** dunia")).toBe("halo dunia");
    expect(adaMarkupTerlarang("lihat [ini](https://x.id)")).toBe(true);
    expect(adaMarkupTerlarang("kalimat **biasa** saja")).toBe(false);
  });
});

import { validasiKeluaranAi } from "../src/ai/validator";
import { MuatanAiSchema } from "../src/ai/kontrak";

describe("regresi hasil audit", () => {
  const m = MuatanAiSchema.parse({ skema: 1, layar: "status", pita_usia: "9-11", status: { bbu: "bb_normal", pbu: "normal", bbpb: "gizi_baik" }, akg: [{ zat: "besi_mg", persen: 24 }], versi: { engine: "0.2.0", data: "2026-11-02", rules: "0.1.0" } });
  it("masukan raksasa penanda tak berpasangan tidak membuat macet", () => {
    const t0 = Date.now();
    renderMarkdown("*a ".repeat(7000));
    const v = validasiKeluaranAi("*a ".repeat(30000), m);
    expect(v.ok).toBe(false);
    expect(Date.now() - t0).toBeLessThan(1500);
  });
  it("nomor awal daftar dihitung sebagai angka oleh teksPolos", () => {
    expect(teksPolos("99999. Teruskan pemberian ASI ya.")).toContain("99999");
  });
  it("karakter format tak terlihat dibuang dari teks yang lolos", () => {
    const v = validasiKeluaranAi("Berat badan anak sesuai umur dan panjang badannya normal. Zat besi baru 24 persen dari kebutuhan.‮", m);
    if (v.ok) expect(v.teks).not.toMatch(/‮/);
  });
});
