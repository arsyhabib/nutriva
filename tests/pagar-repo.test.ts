import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { JejakSchema } from "../src/engine/schema/jejak";
import { LABEL_PROTOTIPE, SKEMA_JEJAK_VERSI } from "../src/engine/konstanta";

describe("pagar repositori (syarat M0 RPT-0005 §10; AUD-0006-06)", () => {
  const gitignore = readFileSync(".gitignore", "utf8").split(/\r?\n/);

  it(".gitignore mengecualikan rahasia, sumber berhak cipta, PDF di mana pun, dan arsip V8", () => {
    for (const baris of [
      ".env",
      "sumber/*",
      "*.pdf",
      "*.docx",
      "*.xlsx",
      "NUTRIVA_V8_Source_Lengkap.zip",
      "audit/evidence/legacy_v8/",
      "node_modules/",
      "otorisasi.lokal.json",
    ]) {
      expect(gitignore).toContain(baris);
    }
  });

  it("dependensi dikunci eksak (tanpa ^ atau ~)", () => {
    const pkg = JSON.parse(readFileSync("package.json", "utf8")) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
    const semua = { ...pkg.dependencies, ...pkg.devDependencies };
    expect(Object.keys(semua).length).toBeGreaterThan(0);
    for (const [nama, versi] of Object.entries(semua)) {
      expect(versi, nama).toMatch(/^\d+\.\d+\.\d+$/);
    }
  });

  it("package-lock.json ada (rantai pasok terkunci)", () => {
    expect(existsSync("package-lock.json")).toBe(true);
  });

  it("CI menjalankan npm run check dengan --ignore-scripts", () => {
    const ci = readFileSync(".github/workflows/check.yml", "utf8");
    expect(ci).toContain("npm ci --ignore-scripts");
    expect(ci).toContain("npm run check");
  });

  it("tidak ada PDF atau berkas non-JSON di data/ (verifikator juga menolaknya)", () => {
    const semua = (dir: string): string[] =>
      readdirSync(dir).flatMap((n) => {
        const p = join(dir, n);
        return statSync(p).isDirectory() ? semua(p) : [p];
      });
    for (const p of semua("data")) {
      const nama = p.split(/[\\/]/).pop() as string;
      expect([".gitkeep", "README.md"].includes(nama) || nama.endsWith(".json"), p).toBe(true);
    }
  });

  it("arsip V8 tidak diimpor oleh kode sumber atau uji mana pun", () => {
    const semuaTs = (dir: string): string[] =>
      readdirSync(dir).flatMap((n) => {
        const p = join(dir, n);
        return statSync(p).isDirectory() ? semuaTs(p) : p.endsWith(".ts") ? [p] : [];
      });
    const pola = new RegExp(["V8", "Source"].join("_") + "|" + ["legacy", "v8"].join("_"));
    for (const b of [...semuaTs("src"), ...semuaTs("tests").filter((p) => !p.endsWith("pagar-repo.test.ts"))]) {
      expect(readFileSync(b, "utf8"), b).not.toMatch(pola);
    }
  });
});

describe("label prototipe dan skema jejak (AUD-0006-04)", () => {
  const jejakDasar = {
    skema_versi: SKEMA_JEJAK_VERSI,
    engine_version: "0.0.0",
    data_version: "0.0.1",
    benih: "a7f3",
    profil_rilis: "demo",
    label: LABEL_PROTOTIPE,
    langkah: [
      { no: 1, deskripsi: "contoh", masukan: { usia_bulan: 9, status_asi: "masih_menyusu" }, keluaran: { ok: true }, klaim_id: ["KL-UJI-1"] },
    ],
  };

  it("label prototipe memuat makna wajib", () => {
    expect(LABEL_PROTOTIPE).toContain("Prototipe PjBL");
    expect(LABEL_PROTOTIPE).toContain("belum diverifikasi dosen");
    expect(LABEL_PROTOTIPE).toContain("bukan pengganti petugas kesehatan");
  });

  it("jejak profil demo valid hanya bila memuat label PERSIS konstanta", () => {
    expect(JejakSchema.safeParse(jejakDasar).success).toBe(true);
    expect(JejakSchema.safeParse({ ...jejakDasar, label: "x" }).success).toBe(false);
    expect(JejakSchema.safeParse({ ...jejakDasar, label: LABEL_PROTOTIPE + " " }).success).toBe(false);
    const { label: _l, ...tanpaLabel } = jejakDasar;
    expect(JejakSchema.safeParse(tanpaLabel).success).toBe(false);
  });

  it("profil lapangan tidak wajib label tetapi tetap divalidasi", () => {
    const { label: _l, ...tanpaLabel } = jejakDasar;
    expect(JejakSchema.safeParse({ ...tanpaLabel, profil_rilis: "lapangan" }).success).toBe(true);
    expect(JejakSchema.safeParse({ ...tanpaLabel, profil_rilis: "produksi" }).success).toBe(false);
  });

  it("langkah berurutan, menunjuk minimal satu klaim, berformat id klaim", () => {
    const salah = { ...jejakDasar, langkah: [{ ...jejakDasar.langkah[0], no: 2 }] };
    expect(JejakSchema.safeParse(salah).success).toBe(false);
    const tanpaKlaim = { ...jejakDasar, langkah: [{ ...jejakDasar.langkah[0], klaim_id: [] }] };
    expect(JejakSchema.safeParse(tanpaKlaim).success).toBe(false);
    const formatSalah = { ...jejakDasar, langkah: [{ ...jejakDasar.langkah[0], klaim_id: ["bukan-id-klaim"] }] };
    expect(JejakSchema.safeParse(formatSalah).success).toBe(false);
  });

  it("menolak versi skema lain", () => {
    expect(JejakSchema.safeParse({ ...jejakDasar, skema_versi: 2 }).success).toBe(false);
  });

  it("masukan/keluaran menolak teks bebas dan identitas (INV-17)", () => {
    const dengan = (masukan: Record<string, unknown>) => ({
      ...jejakDasar,
      langkah: [{ ...jejakDasar.langkah[0], masukan }],
    });
    expect(JejakSchema.safeParse(dengan({ catatan: "anak Budi" })).success).toBe(false);
    expect(JejakSchema.safeParse(dengan({ catatan: "Budi" })).success).toBe(false);
    expect(JejakSchema.safeParse(dengan({ catatan: "ibu sari, 0812-3456" })).success).toBe(false);
    expect(JejakSchema.safeParse(dengan({ "Kunci Besar": 1 })).success).toBe(false);
    expect(JejakSchema.safeParse(dengan({ kode: "asi_penuh", angka: 9, daftar: ["telur", "ikan"] })).success).toBe(true);
  });
});
