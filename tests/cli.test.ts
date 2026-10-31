import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { spawnSync } from "node:child_process";
import { cpSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

/**
 * Uji ujung-ke-ujung untuk alat CLI (syarat M0 RPT-0005 §10 butir 2):
 * "uji yang gagal bila klaim karantina dipakai", ditambah mutasi V6 dari RPT-0006.
 */
const REPO = resolve(".");
const TSX = join(REPO, "node_modules", "tsx", "dist", "cli.mjs");

function jalankan(skrip: string, cwd: string, args: string[] = []) {
  return spawnSync(process.execPath, [TSX, join(REPO, "src", "tools", skrip), ...args], {
    cwd,
    encoding: "utf8",
  });
}

let tmp: string;
beforeEach(() => {
  tmp = mkdtempSync(join(tmpdir(), "nutriva-uji-"));
  mkdirSync(join(tmp, "data", "aturan"), { recursive: true });
  mkdirSync(join(tmp, "data", "bahan"), { recursive: true });
  mkdirSync(join(tmp, "src", "engine"), { recursive: true });
  mkdirSync(join(tmp, "tests", "fixtures"), { recursive: true });
  cpSync(join(REPO, "data", "claims.json"), join(tmp, "data", "claims.json"));
  cpSync(join(REPO, "data", "sources.json"), join(tmp, "data", "sources.json"));
});
afterEach(() => rmSync(tmp, { recursive: true, force: true }));

describe("CLI verify:claims", () => {
  it("lulus pada data kosong", () => {
    expect(jalankan("cli-verify-claims.ts", tmp).status).toBe(0);
  });

  it("GAGAL bila aturan memakai klaim TTD yang dikarantina", () => {
    writeFileSync(join(tmp, "data", "aturan", "ttd.json"), JSON.stringify({ ttd: { nilai: 60, klaim_id: "KL-TTD-DOSIS" } }));
    const r = jalankan("cli-verify-claims.ts", tmp);
    expect(r.status).toBe(1);
    expect(r.stderr).toContain("dikarantina");
  });

  it("GAGAL bila ada nilai numerik tanpa klaim_id (nama kunci apa pun)", () => {
    writeFileSync(join(tmp, "data", "aturan", "x.json"), JSON.stringify({ aturan: { energi_kkal: 800 } }));
    const r = jalankan("cli-verify-claims.ts", tmp);
    expect(r.status).toBe(1);
    expect(r.stderr).toContain("tanpa klaim_id");
  });

  it("V6: GAGAL bila berkas data di luar data/aturan dan data/bahan memuat nilai tanpa klaim", () => {
    writeFileSync(join(tmp, "data", "menu.json"), JSON.stringify({ porsi: { nilai: 800 } }));
    const r = jalankan("cli-verify-claims.ts", tmp);
    expect(r.status).toBe(1);
    expect(r.stderr).toContain("data/menu.json");
  });

  it("GAGAL bila ada PDF atau berkas non-JSON di data/", () => {
    writeFileSync(join(tmp, "data", "bahan", "buku_kia_2024.pdf"), "x");
    const r = jalankan("cli-verify-claims.ts", tmp);
    expect(r.status).toBe(1);
    expect(r.stderr).toContain("tipe berkas tidak diizinkan");
  });

  it("GAGAL bila claims.json rusak", () => {
    writeFileSync(join(tmp, "data", "claims.json"), JSON.stringify({ versi: "1", klaim: [{ id: "salah" }] }));
    expect(jalankan("cli-verify-claims.ts", tmp).status).toBe(1);
  });

  it("GAGAL bila kode mesin punya konstanta numerik tanpa anotasi klaim; lulus bila beranotasi", () => {
    writeFileSync(join(tmp, "src", "engine", "uji.ts"), "export const BATAS_ATAS = 3000;\n");
    const gagal = jalankan("cli-verify-claims.ts", tmp);
    expect(gagal.status).toBe(1);
    expect(gagal.stderr).toContain("konstanta numerik tanpa anotasi");
    writeFileSync(join(tmp, "src", "engine", "uji.ts"), "// klaim: n/a — konstanta uji\nexport const BATAS_ATAS = 3000;\n");
    expect(jalankan("cli-verify-claims.ts", tmp).status).toBe(0);
  });
});

describe("CLI lint:fixtures", () => {
  it("lulus pada fixture sintetis", () => {
    writeFileSync(join(tmp, "tests", "fixtures", "ok.json"), JSON.stringify({ sintetis: true, asal: "dibuat-pengembang", usia_bulan: 9 }));
    expect(jalankan("cli-lint-fixtures.ts", tmp).status).toBe(0);
  });

  it("GAGAL pada fixture berisi nama atau tanpa tanda sintetis", () => {
    writeFileSync(join(tmp, "tests", "fixtures", "buruk.json"), JSON.stringify({ sintetis: false, asal: "buku-kia", nama: "Budi" }));
    const r = jalankan("cli-lint-fixtures.ts", tmp);
    expect(r.status).toBe(1);
    expect(r.stderr).toContain("lint:fixtures GAGAL");
  });

  it("GAGAL pada berkas yang bukan JSON", () => {
    writeFileSync(join(tmp, "tests", "fixtures", "rusak.json"), "{bukan json");
    expect(jalankan("cli-lint-fixtures.ts", tmp).status).toBe(1);
  });
});

describe("CLI cek:otorisasi (gerbang lapangan)", () => {
  const argumen = ["--versi-aturan", "0.1.0", "--tanggal", "2026-12-01"];
  const valid = {
    versi_skema: 1,
    dasar_izin: { jenis: "pembebasan-etik", nomor: "SK-UJI-001", penerbit: "Institusi Uji", tanggal: "2026-11-01" },
    penandatangan_tanda_bahaya: { nama: "Dosen Uji", jabatan: "Dosen Gizi", tanggal: "2026-11-02", versi_daftar: "1.0" },
    keputusan_status_alat: { keputusan: "bukan-alat-kesehatan", rujukan: "Surat Uji", tanggal: "2026-11-03" },
    versi_aturan: "0.1.0",
  };

  it("tanpa berkas otorisasi.lokal.json → TERTUTUP (keluar 1)", () => {
    const r = jalankan("cli-cek-otorisasi.ts", tmp, argumen);
    expect(r.status).toBe(1);
    expect(r.stderr).toContain("TERTUTUP");
  });

  it("berkas lengkap dan valid → TERBUKA (keluar 0)", () => {
    writeFileSync(join(tmp, "otorisasi.lokal.json"), JSON.stringify(valid));
    expect(jalankan("cli-cek-otorisasi.ts", tmp, argumen).status).toBe(0);
  });

  it("versi aturan tidak cocok → TERTUTUP", () => {
    writeFileSync(join(tmp, "otorisasi.lokal.json"), JSON.stringify({ ...valid, versi_aturan: "0.0.9" }));
    expect(jalankan("cli-cek-otorisasi.ts", tmp, argumen).status).toBe(1);
  });

  it("berkas bukan JSON → TERTUTUP", () => {
    writeFileSync(join(tmp, "otorisasi.lokal.json"), "{rusak");
    expect(jalankan("cli-cek-otorisasi.ts", tmp, argumen).status).toBe(1);
  });
});

describe("CLI gate:m1a", () => {
  it("kasus baku kosong BUKAN lulus (AUD-0006-08)", () => {
    const r = jalankan("cli-gate-m1a.ts", tmp);
    expect(r.status).toBe(1);
    expect(r.stderr).toContain("kasus baku 0");
  });
});
