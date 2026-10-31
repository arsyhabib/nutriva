import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { KlaimSchema, KumpulanKlaimSchema, KumpulanSumberSchema, SumberSchema } from "../src/engine/schema/klaim";

const klaimDasar = {
  id: "KL-UJI-1",
  tipe: "nilai",
  pernyataan: "contoh",
  status: "teks-ditemukan-mesin",
  tingkat: "A",
  sumber: [{ sumber_id: "S-UJI", locator: { halaman: 6, tabel: "Tabel 1" } }],
};

describe("skema klaim", () => {
  it("menerima klaim yang valid", () => {
    expect(KlaimSchema.safeParse(klaimDasar).success).toBe(true);
  });

  it("menolak terverifikasi-manusia tanpa nama, tanggal, dan versi", () => {
    const r = KlaimSchema.safeParse({ ...klaimDasar, status: "terverifikasi-manusia" });
    expect(r.success).toBe(false);
  });

  it("menerima terverifikasi-manusia dengan identitas verifikator", () => {
    const r = KlaimSchema.safeParse({
      ...klaimDasar,
      status: "terverifikasi-manusia",
      diverifikasi_oleh: { nama: "Verifikator Uji", tanggal: "2026-10-28", versi: "0.1.0" },
    });
    expect(r.success).toBe(true);
  });

  it("menolak klaim bukan-asumsi tanpa sumber (kecuali dikarantina/dicabut)", () => {
    expect(KlaimSchema.safeParse({ ...klaimDasar, sumber: [] }).success).toBe(false);
    expect(KlaimSchema.safeParse({ ...klaimDasar, sumber: [], status: "dikarantina" }).success).toBe(true);
    expect(KlaimSchema.safeParse({ ...klaimDasar, sumber: [], status: "dicabut" }).success).toBe(true);
  });

  it("mewajibkan asumsi bertingkat bukti D", () => {
    expect(KlaimSchema.safeParse({ ...klaimDasar, tipe: "asumsi", sumber: [], tingkat: "A" }).success).toBe(false);
    expect(KlaimSchema.safeParse({ ...klaimDasar, tipe: "asumsi", sumber: [], tingkat: "D" }).success).toBe(true);
  });

  it("menolak status yang tidak dikenal, termasuk nama lama terverifikasi-mesin", () => {
    expect(KlaimSchema.safeParse({ ...klaimDasar, status: "terverifikasi-mesin" }).success).toBe(false);
  });

  it("menolak id klaim ganda", () => {
    const r = KumpulanKlaimSchema.safeParse({ versi: "1", klaim: [klaimDasar, klaimDasar] });
    expect(r.success).toBe(false);
  });

  it("membatasi kutipan pendek (batas hak cipta)", () => {
    const panjang = "x".repeat(201);
    const r = KlaimSchema.safeParse({
      ...klaimDasar,
      sumber: [{ sumber_id: "S-UJI", locator: { kutipan_pendek: panjang } }],
    });
    expect(r.success).toBe(false);
  });
});

describe("skema sumber", () => {
  const sumberDasar = {
    id: "S-UJI",
    jenis: "regulasi",
    penerbit: "Penerbit Uji",
    judul: "Judul Uji",
    edisi: "2026",
    tanggal_akses: "2026-10-28",
    lisensi: "domain publik",
    boleh_redistribusi: true,
    berkas_lokal: null,
    sha256: null,
    tingkat: "A",
  };

  it("menerima sumber valid dan menolak sha256 yang bukan heksadesimal 64", () => {
    expect(SumberSchema.safeParse(sumberDasar).success).toBe(true);
    expect(SumberSchema.safeParse({ ...sumberDasar, sha256: "abc" }).success).toBe(false);
  });

  it("menolak id sumber ganda", () => {
    expect(KumpulanSumberSchema.safeParse({ versi: "1", sumber: [sumberDasar, sumberDasar] }).success).toBe(false);
  });
});

describe("berkas data M0", () => {
  it("data/claims.json dan data/sources.json valid", () => {
    const klaim = JSON.parse(readFileSync("data/claims.json", "utf8"));
    const sumber = JSON.parse(readFileSync("data/sources.json", "utf8"));
    expect(KumpulanKlaimSchema.safeParse(klaim).success).toBe(true);
    expect(KumpulanSumberSchema.safeParse(sumber).success).toBe(true);
  });

  it("klaim TTD berstatus dikarantina (AUD-0003-02)", () => {
    const klaim = KumpulanKlaimSchema.parse(JSON.parse(readFileSync("data/claims.json", "utf8")));
    const ttd = klaim.klaim.filter((k) => k.id.startsWith("KL-TTD-"));
    expect(ttd.length).toBeGreaterThanOrEqual(2);
    for (const k of ttd) expect(k.status).toBe("dikarantina");
  });
});
