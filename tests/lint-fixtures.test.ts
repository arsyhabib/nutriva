import { describe, expect, it } from "vitest";
import { lintFixture, normalisasiKunci } from "../src/tools/lintFixtures";

const dasar = { sintetis: true, asal: "dibuat-pengembang", usia_bulan: 9 };

describe("lintFixture: dasar", () => {
  it("menerima fixture sintetis tanpa pengenal", () => {
    expect(lintFixture("f.json", dasar)).toEqual([]);
    expect(lintFixture("f.json", { ...dasar, keterangan: "Contoh rekaan untuk uji; bukan anak sungguhan" })).toEqual([]);
    expect(lintFixture("f.json", { ...dasar, alergi: ["telur"], nama_bahan: "bayam" })).toEqual([]);
  });

  it("menolak fixture tanpa sintetis:true atau tanpa asal yang benar", () => {
    expect(lintFixture("f.json", { ...dasar, sintetis: false }).length).toBeGreaterThan(0);
    const { asal: _asal, ...tanpaAsal } = dasar;
    expect(lintFixture("f.json", tanpaAsal).length).toBeGreaterThan(0);
    expect(lintFixture("f.json", { ...dasar, asal: "salin-dari-buku-kia" }).length).toBeGreaterThan(0);
  });

  it("menolak akar yang bukan objek", () => {
    expect(lintFixture("f.json", [1, 2])).not.toEqual([]);
  });

  it("menolak kunci pengenal pribadi di kedalaman berapa pun", () => {
    expect(lintFixture("f.json", { ...dasar, nama: "Budi" }).length).toBe(1);
    expect(lintFixture("f.json", { ...dasar, anak: { Tanggal_Lahir: "2026-01-01" } }).length).toBe(1);
    expect(lintFixture("f.json", { ...dasar, daftar: [{ "no-hp": "x" }] }).length).toBe(1);
  });
});

describe("normalisasiKunci", () => {
  it("camelCase, spasi, strip, dan huruf besar menjadi snake_case", () => {
    expect(normalisasiKunci("namaAnak")).toBe("nama_anak");
    expect(normalisasiKunci("TanggalLahir")).toBe("tanggal_lahir");
    expect(normalisasiKunci("no hp")).toBe("no_hp");
    expect(normalisasiKunci("No-HP")).toBe("no_hp");
  });
});

// Mutasi L1–L6 dari RPT-0006 (AUD-0006-03): semua HARUS menjadi galat.
describe("mutasi yang sebelumnya lolos (RPT-0006 L1–L6)", () => {
  const kasus: [string, Record<string, unknown>][] = [
    ["L1 camelCase namaAnak", { ...dasar, namaAnak: "x" }],
    ["L2 camelCase tanggalLahir", { ...dasar, tanggalLahir: "x" }],
    ["L3 homoglif Kiril pada kunci", { ...dasar, ["nаma"]: "x" }],
    ["L4 nama dalam nilai (bernama)", { ...dasar, keterangan: "anak bernama Budi" }],
    ["L4b sebutan + nama", { ...dasar, keterangan: "anak Budi umur 9 bulan" }],
    ["L5 telepon berpemisah", { ...dasar, catatan: "0812-3456-7890" }],
    ["L5b telepon +62", { ...dasar, catatan: "+62 812 3456 7890" }],
    ["L6 NIK berspasi", { ...dasar, catatan: "3201 2345 6789 0001" }],
    ["L6b NIK berstrip", { ...dasar, catatan: "3201-2345-6789-0001" }],
    ["email", { ...dasar, catatan: "ibu@contoh.id" }],
    ["huruf non-Latin dalam nilai", { ...dasar, catatan: "ibu Буди" }],
    ["kunci non-ASCII sederhana", { ...dasar, ["catatan​"]: "x" }],
  ];
  for (const [nama, fixture] of kasus) {
    it(nama, () => {
      expect(lintFixture("f.json", fixture).length, nama).toBeGreaterThan(0);
    });
  }

  it("tidak salah menandai teks sintetis yang wajar (tanpa positif palsu)", () => {
    const wajar = {
      ...dasar,
      berat_kg: 8.1,
      keterangan: "Contoh rekaan: alergi telur dan anggaran kecil. Anak 18 bulan, ASI masih berlanjut.",
      kode: "preset_a",
    };
    expect(lintFixture("f.json", wajar)).toEqual([]);
  });
});
