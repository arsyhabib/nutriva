import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { ringkasan } from "../src/app/fasad";
import { LABEL_PROTOTIPE } from "../src/engine/konstanta";
import { DAFTAR_LAYAR, LayarRona } from "../src/ui/layar";
import { PRESET_SINTETIS, type KodePreset } from "../src/ui/preset";

const akarPalsu = (): HTMLElement => ({ innerHTML: "", addEventListener: () => {} }) as unknown as HTMLElement;
const PRESETS: KodePreset[] = ["A", "B", "C"];
const PERAN = ["ibu", "kader", "ahli"] as const;

function semuaHtml(): { kunci: string; html: string }[] {
  const hasil: { kunci: string; html: string }[] = [];
  for (const pr of PRESETS) {
    const app = new LayarRona(akarPalsu());
    app.pasang();
    app.pilihPreset(pr);
    for (const peran of PERAN) {
      app.aturPeran(peran);
      for (const l of DAFTAR_LAYAR) {
        app.aturPeran(peran);
        app.bukaLayar(l.id);
        hasil.push({ kunci: `${pr}/${peran}/${l.id}`, html: app.ambilHtml() });
      }
    }
  }
  return hasil;
}
const SEMUA = semuaHtml();

describe("kejujuran isi UI (tanpa angka/klaim karangan)", () => {
  it("menghasilkan 3 kasus × 3 peran × semua layar", () => {
    expect(SEMUA.length).toBe(3 * 3 * DAFTAR_LAYAR.length);
    expect(DAFTAR_LAYAR.length).toBe(18);
  });

  const LARANGAN: [string, RegExp][] = [
    ["jam makan karangan", /\(\d{2}\.\d{2}\)/],
    ["takaran sdm/sdt/potong tebakan", /~\s*\d+(?:,\d)?\s*(sdm|sdt|potong)/i],
    ["persentase ASI karangan", /ASI\s+\d+%/],
    ["rentang variasi alami karangan", /Rentang variasi alami/],
    ["nomor darurat tanpa sumber", /tel:|\b119\b/],
    ["nama variasi karangan", /Pesisir|Padat Mikronutrien|Rotasi Menu Keluarga|Racikan Seimbang/],
    ["udang (kode tak dikenal mesin)", /udang/i],
    ["lencana acuan resmi menyesatkan", /ACUAN RESMI/],
    ["istilah internal ADR/K-xx", /ADR-0\d+|K-0\d &amp; K-0\d/],
    ["kode layar pengembang di kicker", /layar__kicker">\s*[A-K]\d{1,2}\s·/],
    ["dock pengembang", /dock-panel|Kontrol &amp; Layar|NUTRIVA Rona/],
    ["angka AKG hardcode", /11 mg\/hari|600 mcg RAE\/hari|200–300 kkal/],
    ["skor atau z-score kontinu", /Z\s*=\s*-?\d/],
  ];
  for (const [nama, pola] of LARANGAN) {
    it(`tidak memuat ${nama}`, () => {
      const kena = SEMUA.filter((x) => pola.test(x.html)).map((x) => x.kunci);
      expect(kena, kena.slice(0, 5).join(", ")).toEqual([]);
    });
  }

  it("kode alasan mentah hanya tampil di Mode Ahli", () => {
    const kena = SEMUA.filter((x) => !x.kunci.includes("/ahli/") && !x.kunci.endsWith("/ahli") && /<code>(tanda_bahaya|bbu|pbu|bbpb)[:_]/.test(x.html)).map((x) => x.kunci);
    expect(kena).toEqual([]);
  });

  it("tampilan bersih: tanpa label prototipe, kata dosen, atau istilah verifikasi; tanpa skrip inline", () => {
    for (const x of SEMUA) {
      expect(x.html, x.kunci).not.toContain(LABEL_PROTOTIPE);
      const tanpaBenih = x.html.replace(/rona-sintetis-[a-z0-9]+/g, ""); // id benih PRNG bukan teks untuk pembaca
      expect(/dosen|diverifikasi|verifikasi|Prototipe PjBL|Gerbang Konteks|sintetis|Penguji|Audit Ilmiah/i.test(tanpaBenih), x.kunci + " " + (tanpaBenih.match(/.{30}(dosen|diverifikasi|verifikasi|Prototipe PjBL|Gerbang Konteks|sintetis|Penguji|Audit Ilmiah).{30}/i)?.[0] ?? "")).toBe(false);
      expect(/<script/i.test(x.html), x.kunci).toBe(false);
      expect(/\son[a-z]+=/i.test(x.html), x.kunci).toBe(false);
    }
  });

  it("setiap tombol data-go mengarah ke layar yang ada", () => {
    const id = new Set(DAFTAR_LAYAR.map((l) => l.id));
    for (const x of SEMUA) {
      for (const m of x.html.matchAll(/data-go="([^"]+)"/g)) expect(id.has(m[1] as never), `${x.kunci} → ${m[1]}`).toBe(true);
    }
  });

  it("K06 pada kasus rujuk tidak menampilkan angka celah karangan", () => {
    const app = new LayarRona(akarPalsu(), { presetAwal: "B", layarAwal: "tidakLayak" });
    app.pasang();
    const h = app.ambilHtml();
    expect(h).not.toMatch(/Celah \d+%/);
    expect(h).toContain("Data tidak tersedia");
  });

  it("bejana tidak membawa strata ASI atau rentang karangan", () => {
    const app = new LayarRona(akarPalsu(), { presetAwal: "A", layarAwal: "kolam" });
    app.pasang();
    const h = app.ambilHtml();
    const kanvas = [...h.matchAll(/<canvas[^>]*data-bejana-canvas[^>]*>/g)].map((m) => m[0]);
    expect(kanvas.length).toBeGreaterThanOrEqual(4);
    for (const k of kanvas) {
      expect(k).toMatch(/data-asi="0\.000"/);
      const lo = /data-lo="([\d.]+)"/.exec(k)?.[1];
      const hi = /data-hi="([\d.]+)"/.exec(k)?.[1];
      const fill = /data-fill="([\d.]+)"/.exec(k)?.[1];
      expect(lo).toBe(fill);
      expect(hi).toBe(fill);
    }
  });

  it("setiap alergen pada UI dikenal mesin (menu tetap tersusun)", () => {
    const src = readFileSync(resolve(__dirname, "../src/ui/layar.ts"), "utf8");
    const kode = [...src.matchAll(/\{ kode: "([a-z]+)", label: "[^"]+" \}/g)].map((m) => m[1]!);
    expect(kode.length).toBeGreaterThanOrEqual(5);
    for (const k of kode) {
      const m = structuredClone(PRESET_SINTETIS.A.masukan);
      m.pola.hindari = [k];
      const r = ringkasan(m);
      expect(r.hasil, k).toBe("ok");
      if (r.hasil === "ok") expect(r.pola, k).not.toBeNull();
    }
  });
});

describe("kode sumber UI", () => {
  const dir = resolve(__dirname, "../src/ui");
  const berkas = readdirSync(dir).filter((f) => f.endsWith(".ts"));
  it("tidak memakai Math.random, eval, atau new Function", () => {
    for (const f of berkas) {
      const isi = readFileSync(resolve(dir, f), "utf8").replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
      expect(/Math\.random\s*\(/.test(isi), f).toBe(false);
      expect(/\beval\s*\(|new Function\s*\(/.test(isi), f).toBe(false);
    }
  });
});

function rgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255) as [number, number, number];
}
function lum(hex: string): number {
  const [r, g, b] = rgb(hex).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
const kontras = (a: string, b: string): number => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p) as [number, number];
  return (x + 0.05) / (y + 0.05);
};

describe("kontras token tema (WCAG AA)", () => {
  const css = readFileSync(resolve(__dirname, "../src/ui/rona.css"), "utf8");
  for (const tema of ["fajar", "dekap", "terik", "lensa"]) {
    const m = new RegExp(`(?:^|\\n)(?::root,\\s*)?\\[data-theme="${tema}"\\]\\s*\\{([\\s\\S]*?)\\n\\}`).exec(css);
    it(`tema ${tema}: teks utama, sekunder, dan tombol utama ≥ 4,5:1`, () => {
      expect(m, tema).not.toBeNull();
      const v = (n: string): string | undefined => new RegExp(`--${n}:\\s*(#[0-9A-Fa-f]{6})`).exec(m![1]!)?.[1];
      const [bg, t1, t2, ak, akt] = [v("bg-0"), v("t-1"), v("t-2"), v("aksen"), v("aksen-teks")];
      expect([bg, t1, t2, ak, akt].every(Boolean)).toBe(true);
      expect(kontras(t1!, bg!)).toBeGreaterThanOrEqual(4.5);
      expect(kontras(t2!, bg!)).toBeGreaterThanOrEqual(4.5);
      expect(kontras(akt!, ak!)).toBeGreaterThanOrEqual(4.5);
      expect(kontras(ak!, bg!)).toBeGreaterThanOrEqual(3);
    });
  }
});

describe("render parsial", () => {
  it("pergantian layar, peran, dan tema berulang kali tidak melempar galat", () => {
    const app = new LayarRona(akarPalsu());
    app.pasang();
    for (let i = 0; i < 60; i++) {
      app.bukaLayar(DAFTAR_LAYAR[i % DAFTAR_LAYAR.length]!.id);
      app.aturTema((["fajar", "dekap", "terik", "lensa"] as const)[i % 4]!);
      app.aturPeran(PERAN[i % 3]!);
      app.pilihPreset(PRESETS[i % 3]!);
    }
    expect(app.ambilHtml()).not.toContain(LABEL_PROTOTIPE);
  });
});

import { BATAS_RUANG, ruangDariLebar } from "../src/ui/layar";

describe("kelas ruang adaptif", () => {
  it("ambang ruang tepat dan monoton", () => {
    expect(ruangDariLebar(0)).toBe("ringkas");
    expect(ruangDariLebar(320)).toBe("ringkas");
    expect(ruangDariLebar(639)).toBe("ringkas");
    expect(ruangDariLebar(640)).toBe("sedang");
    expect(ruangDariLebar(1023)).toBe("sedang");
    expect(ruangDariLebar(1024)).toBe("lega");
    expect(ruangDariLebar(7680)).toBe("lega");
    expect(ruangDariLebar(Number.NaN)).toBe("ringkas");
  });
  it("ambang di CSS (@container) sama dengan di kode", () => {
    const css = readFileSync(resolve(__dirname, "../src/ui/rona.css"), "utf8");
    expect(css).toContain(`@container app (min-width: ${BATAS_RUANG.sedang}px)`);
    expect(css).toContain(`@container app (min-width: ${BATAS_RUANG.lega}px)`);
  });
  it("tidak ada bingkai ponsel tersisa di CSS maupun markup", () => {
    const css = readFileSync(resolve(__dirname, "../src/ui/rona.css"), "utf8");
    expect(css).not.toMatch(/border:\s*10px solid #2A1820/);
    expect(css).not.toMatch(/width:\s*392px|height:\s*848px|416px;\s*\n\s*height: min\(868px/);
    for (const x of SEMUA.slice(0, 20)) expect(x.html).not.toMatch(/data-layout|dock-panel|rona-app-stage/);
  });
});
