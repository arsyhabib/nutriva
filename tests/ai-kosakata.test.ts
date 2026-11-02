import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { KOSAKATA, kataDikenal } from "../src/ai/kosakata";
import { MuatanAiSchema } from "../src/ai/kontrak";
import { validasiKeluaranAi } from "../src/ai/validator";

describe("daftar putih kata", () => {
  it("tidak memuat kata berbahaya atau terlarang", () => {
    const berbahaya = [
      "obat", "madu", "suplemen", "dosis", "sirup", "sirop", "tablet", "kapsul", "pil", "sachet", "serbuk", "bubuk", "ramuan", "jamu", "herbal", "tetes",
      "stunting", "wasting", "diagnosis", "penyakit", "anemia", "diare", "kanker", "diabetes", "infeksi", "rakitis", "marasmus", "kwashiorkor", "busung",
      "sembuh", "menyembuhkan", "kesembuhan", "pasti", "dijamin", "terjamin", "ampuh", "rokok", "alkohol", "vaksin", "imunisasi", "sapih", "menyapih",
      "puasa", "berpuasa", "diet", "paksa", "memaksa", "berhenti", "henti", "hentikan", "menghentikan", "formula", "kerdil", "cacing",
      "sendok", "gerogot", "terapi", "antibiotik", "injeksi", "infus", "multivitamin",
    ];
    for (const k of berbahaya) expect(KOSAKATA.has(k), k).toBe(false);
  });
  it("bentuk berimbuhan dari kata berbahaya juga tidak dikenal", () => {
    for (const k of ["obatnya", "pengobatan", "mengobati", "madunya", "suplemennya", "setetes", "sesendok", "kesembuhan", "menyapih", "memaksa", "berhenti", "menghentikan", "terjamin", "pil", "sirop", "kecacingan"]) {
      expect(kataDikenal(k), k).toBe(false);
    }
  });
  it("bentuk wajar dikenal", () => {
    for (const k of ["memberikan", "diberikan", "sayurnya", "makanannya", "memilih", "pilihan", "menimbang", "ditimbang", "menyusui", "perhatikan"]) {
      expect(kataDikenal(k), k).toBe(true);
    }
  });
});

describe("keluaran model sungguhan (Haiku 5.5, dengan prompt Worker) harus lolos", () => {
  const berkas = JSON.parse(readFileSync("tests/fixtures/ai_contoh_haiku.json", "utf8")) as { contoh: { id: string; muatan: unknown; teks: string }[] };
  const contoh = berkas.contoh;
  it("ada contoh", () => expect(contoh.length).toBeGreaterThanOrEqual(25));
  for (const c of contoh) {
    it(c.id, () => {
      const m = MuatanAiSchema.parse(c.muatan);
      const v = validasiKeluaranAi(c.teks, m);
      expect(v, c.teks).toMatchObject({ ok: true });
    });
  }
});

describe("bahasa wajar bergaya markdown tidak ditolak karena kosakata", () => {
  it("menyapa 'Bunda' dan 'si kecil', menyebut 'proporsi'", () => {
    const m = MuatanAiSchema.parse(JSON.parse(readFileSync("tests/fixtures/ai_contoh_haiku.json", "utf8")).contoh[0].muatan);
    const v = validasiKeluaranAi("Bunda, ini gambaran umum menu untuk si kecil. Proporsi bahan hari ini sudah seimbang.", m);
    if (!v.ok) expect(v.alasan).not.toContain("kata_di_luar_daftar");
  });
});
