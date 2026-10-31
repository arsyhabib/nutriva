import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { bukaPintuData, OtorisasiSchema, pastikanTokenData, type TokenData } from "../src/engine/otorisasi";

/**
 * AUD-0006-01 (S0): gerbang profil `lapangan` (ADR-0001) harus benar-benar ada dan teruji.
 */
const otorisasiValid = {
  versi_skema: 1,
  dasar_izin: { jenis: "pembebasan-etik", nomor: "SK-UJI-001", penerbit: "Institusi Uji", tanggal: "2026-11-01" },
  penandatangan_tanda_bahaya: { nama: "Dosen Uji", jabatan: "Dosen Gizi", tanggal: "2026-11-02", versi_daftar: "1.0" },
  keputusan_status_alat: { keputusan: "bukan-alat-kesehatan", rujukan: "Surat Uji", tanggal: "2026-11-03" },
  versi_aturan: "0.1.0",
};
const hariIni = "2026-12-01";
const dasar = { versiAturanAktif: "0.1.0", tanggalHariIni: hariIni };

describe("bukaPintuData", () => {
  it("profil demo TIDAK PERNAH terbuka, walau otorisasi lengkap dan valid", () => {
    const r = bukaPintuData({ profil: "demo", otorisasi: otorisasiValid, ...dasar });
    expect(r.terbuka).toBe(false);
    if (!r.terbuka) expect(r.alasan.join(" ")).toContain("demo");
  });

  it("lapangan tanpa otorisasi → tertutup", () => {
    for (const o of [undefined, null, {}, "x", 42]) {
      expect(bukaPintuData({ profil: "lapangan", otorisasi: o, ...dasar }).terbuka).toBe(false);
    }
  });

  it("lapangan dengan otorisasi tidak lengkap → tertutup (tiap bagian wajib)", () => {
    for (const bagian of ["dasar_izin", "penandatangan_tanda_bahaya", "keputusan_status_alat", "versi_aturan"]) {
      const { [bagian]: _hapus, ...sisa } = otorisasiValid as Record<string, unknown>;
      const r = bukaPintuData({ profil: "lapangan", otorisasi: sisa, ...dasar });
      expect(r.terbuka, bagian).toBe(false);
    }
  });

  it("keputusan status alat 'menunggu' tidak diterima", () => {
    const o = { ...otorisasiValid, keputusan_status_alat: { ...otorisasiValid.keputusan_status_alat, keputusan: "menunggu" } };
    expect(bukaPintuData({ profil: "lapangan", otorisasi: o, ...dasar }).terbuka).toBe(false);
  });

  it("versi aturan yang berbeda dari versi aktif → tertutup", () => {
    const r = bukaPintuData({ profil: "lapangan", otorisasi: otorisasiValid, versiAturanAktif: "0.2.0", tanggalHariIni: hariIni });
    expect(r.terbuka).toBe(false);
    if (!r.terbuka) expect(r.alasan.join(" ")).toContain("versi_aturan");
  });

  it("tanggal di masa depan atau bukan tanggal kalender → tertutup", () => {
    const masaDepan = { ...otorisasiValid, dasar_izin: { ...otorisasiValid.dasar_izin, tanggal: "2027-01-01" } };
    expect(bukaPintuData({ profil: "lapangan", otorisasi: masaDepan, ...dasar }).terbuka).toBe(false);
    const palsu = { ...otorisasiValid, dasar_izin: { ...otorisasiValid.dasar_izin, tanggal: "2026-02-30" } };
    expect(bukaPintuData({ profil: "lapangan", otorisasi: palsu, ...dasar }).terbuka).toBe(false);
    expect(bukaPintuData({ profil: "lapangan", otorisasi: otorisasiValid, versiAturanAktif: "0.1.0", tanggalHariIni: "bukan-tanggal" }).terbuka).toBe(false);
  });

  it("otorisasi lengkap dan valid → terbuka dan menghasilkan token beku", () => {
    const r = bukaPintuData({ profil: "lapangan", otorisasi: otorisasiValid, ...dasar });
    expect(r.terbuka).toBe(true);
    if (r.terbuka) expect(Object.isFrozen(r.token)).toBe(true);
  });

  it("jenis dasar izin hanya yang sah", () => {
    const o = { ...otorisasiValid, dasar_izin: { ...otorisasiValid.dasar_izin, jenis: "lisan" } };
    expect(OtorisasiSchema.safeParse(o).success).toBe(false);
  });
});

describe("token data tidak dapat dipalsukan secara tipe", () => {
  it("objek biasa bukan TokenData (diperiksa kompilator)", () => {
    // @ts-expect-error — objek literal tidak boleh dianggap TokenData
    const palsu: TokenData = {};
    expect(palsu).toBeDefined();
  });
});

/** Token sah: pintu terbuka untuk otorisasi lengkap. */
function tokenSahDariPintu(): TokenData {
  const r = bukaPintuData({ profil: "lapangan", otorisasi: otorisasiValid, ...dasar });
  if (!r.terbuka) throw new Error("uji salah: pintu seharusnya terbuka");
  return r.token;
}

describe("token data tidak dapat dipalsukan saat runtime (REQ-0008; celah `{} as TokenData`)", () => {
  it("token dari bukaPintuData lolos pastikanTokenData", () => {
    expect(() => pastikanTokenData(tokenSahDariPintu())).not.toThrow();
  });

  it("cast manual {} as TokenData ditolak saat runtime", () => {
    expect(() => pastikanTokenData({} as TokenData)).toThrow(/tidak sah/);
  });

  it("salinan token (spread) ditolak", () => {
    expect(() => pastikanTokenData({ ...tokenSahDariPintu() } as TokenData)).toThrow(/tidak sah/);
  });

  it("objek beku yang dicast ganda ditolak", () => {
    expect(() => pastikanTokenData(Object.freeze({}) as unknown as TokenData)).toThrow(/tidak sah/);
  });
});

describe("uji arsitektur: hanya satu pintu (jawaban pertanyaan 1 RPT-0006)", () => {
  const semuaTs = (dir: string): string[] =>
    readdirSync(dir).flatMap((n) => {
      const p = join(dir, n);
      return statSync(p).isDirectory() ? semuaTs(p) : p.endsWith(".ts") ? [p] : [];
    });
  const berkas = semuaTs("src").map((p) => ({ p: p.replaceAll("\\", "/"), teks: readFileSync(p, "utf8") }));

  it("token hanya dibuat di src/engine/otorisasi.ts", () => {
    const pembuat = berkas.filter((b) => /as unknown as TokenData/.test(b.teks)).map((b) => b.p);
    expect(pembuat).toEqual(["src/engine/otorisasi.ts"]);
  });

  it("cast ke TokenData (tunggal maupun ganda) hanya di src/engine/otorisasi.ts, termasuk di tests/", () => {
    const polaCast = /\bas\s+(?:unknown\s+as\s+)?TokenData\b|<TokenData>/;
    const berkasUji = semuaTs("tests")
      .filter((p) => !p.endsWith("pintu-data.test.ts"))
      .map((p) => ({ p: p.replaceAll("\\", "/"), teks: readFileSync(p, "utf8") }));
    const pelanggar = [...berkas, ...berkasUji]
      .filter((b) => b.p !== "src/engine/otorisasi.ts" && polaCast.test(b.teks))
      .map((b) => b.p);
    expect(pelanggar).toEqual([]);
  });

  it("fungsi data nyata (simpan*/impor*/ekspor*/tulis*) wajib menerima TokenData", () => {
    const pelanggar: string[] = [];
    for (const b of berkas) {
      for (const m of b.teks.matchAll(/export\s+(?:async\s+)?function\s+((?:simpan|impor|ekspor|tulis)\w*)\s*\(([^)]*)\)/g)) {
        if (!/TokenData/.test(m[2] ?? "")) pelanggar.push(`${b.p}: ${m[1]}`);
      }
    }
    expect(pelanggar).toEqual([]);
  });
});
