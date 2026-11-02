import { describe, expect, it } from "vitest";
import { PILIHAN_CEPAT, DAFTAR_BAGIAN, OPSI_BAWAAN, bagianUntukLayar, judulBerkas, ketersediaan, susunBlok, type BagianId, type KonteksEkspor } from "../src/ui/ekspor";
import { ringkasan } from "../src/app/fasad";
import { PRESET_SINTETIS } from "../src/ui/preset";

function konteks(kode: "A" | "B" | "C"): KonteksEkspor {
  const p = PRESET_SINTETIS[kode];
  const r = ringkasan(p.masukan);
  if (r.hasil !== "ok") throw new Error("preset harus valid");
  return { r, masukan: p.masukan, labelContoh: p.label, hariIdx: 0, tanggal: new Date("2026-11-03T00:00:00Z"), labelAlasan: (k) => k.replace(/[:_]/g, " ") };
}
const semua: BagianId[] = DAFTAR_BAGIAN.map((b) => b.id);
const teksBlok = (b: ReturnType<typeof susunBlok>): string =>
  b.blok.map((x) => (x.k === "alir" || x.k === "halaman" ? x.html : x.k === "tabel" ? x.kepala + x.baris.join("") : "")).join(" ");

describe("dokumen ekspor", () => {
  for (const kode of ["A", "B", "C"] as const) {
    const c = konteks(kode);
    it(`contoh ${kode}: semua bagian tersedia tersusun, bersih, tanpa kata terlarang`, () => {
      const ada = ketersediaan(c);
      const dok = susunBlok({ ...OPSI_BAWAAN, bagian: semua }, c);
      const tersedia = semua.filter((b) => ada[b] === true);
      expect(dok.isi.map((x) => x.id).sort()).toEqual(tersedia.sort());
      const h = teksBlok(dok);
      const teks = h.replace(/<[^>]+>/g, " ");
      expect(teks).not.toMatch(/dosen|verifikasi|PjBL|sintetis|gerbang konteks|audit ilmiah|belum teruji/i);
      expect(h).not.toMatch(/<script|\son\w+=/i);
      expect(judulBerkas({ ...OPSI_BAWAAN, bagian: semua }, c)).toMatch(/^NUTRIVA - /);
    });
  }

  it("satu bagian tanpa sampul, banyak bagian dengan sampul dan daftar isi", () => {
    const c = konteks("A");
    const satu = susunBlok({ ...OPSI_BAWAAN, bagian: ["status"] }, c);
    expect(satu.blok.some((b) => b.k === "halaman" && b.kelas.includes("sampul"))).toBe(false);
    const banyak = susunBlok({ ...OPSI_BAWAAN, bagian: ["status", "menu"] }, c);
    const sampul = banyak.blok[0]!;
    expect(sampul.k === "halaman" && sampul.kelas.includes("sampul")).toBe(true);
    expect(sampul.k === "halaman" && sampul.html).toContain('data-toc="menu"');
  });

  it("opsi sampul dimatikan menghilangkan sampul", () => {
    const dok = susunBlok({ ...OPSI_BAWAAN, sampul: false, bagian: ["status", "menu"] }, konteks("A"));
    expect(dok.blok.some((b) => b.k === "halaman" && b.kelas.includes("sampul"))).toBe(false);
  });

  it("gizi memuat semua hari menu, bukan hanya satu", () => {
    const c = konteks("A");
    const n = c.r.pola?.hari.length ?? 0;
    const dok = susunBlok({ ...OPSI_BAWAAN, bagian: ["gizi"] }, c);
    expect(n).toBeGreaterThan(1);
    const h = teksBlok(dok);
    for (let i = 1; i <= n; i++) expect(h).toContain(`Hari ke-${i}`);
  });

  it("jejak memakai kolom Tingkat kepastian dan tidak memuat status verifikasi", () => {
    const dok = susunBlok({ ...OPSI_BAWAAN, bagian: ["ahli"] }, konteks("A"));
    const h = teksBlok(dok);
    expect(h).toContain("Tingkat kepastian");
    expect(h).toMatch(/Peraturan nasional|Pedoman internasional|Basis data pangan|Asumsi program/);
    expect(h).not.toMatch(/\bbelum (?:dibaca|diverifikasi|diperiksa)|dikarantina|teks-ditemukan|sumber primer/i);
  });

  it("bagian yang tidak berlaku dilewati: lembar rujukan hanya saat rujuk, menu tidak saat rujuk", () => {
    const c = konteks("A");
    expect(ketersediaan(c).rujukan).not.toBe(true);
    const rujuk = { ...c, r: { ...c.r, rujukan: { ...c.r.rujukan, tingkat: "rujuk" as const, alasan: ["bbpb:gizi_buruk"] }, pola: null, belanja: null } } as KonteksEkspor;
    const ada = ketersediaan(rujuk);
    expect(ada.rujukan).toBe(true);
    expect(ada.menu).not.toBe(true);
    const dok = susunBlok({ ...OPSI_BAWAAN, bagian: semua }, rujuk);
    expect(dok.isi.map((x) => x.id)).toContain("rujukan");
    expect(dok.isi.map((x) => x.id)).not.toContain("menu");
  });

  it("pilihan awal mengikuti halaman aplikasi", () => {
    expect(bagianUntukLayar("piring")).toEqual(["menu", "belanja", "resep"]);
    expect(bagianUntukLayar("kartuBagi")).toEqual(["kartu"]);
    expect(bagianUntukLayar("gerbang").length).toBeGreaterThan(3);
  });

  const GAMBAR = "data:image/png;base64," + "A".repeat(200);
  const resepContoh = (c: KonteksEkspor) => {
    const h = c.r.pola!.hari[0]!;
    const sl = h.slot[0]!;
    return {
      id: "r1", hari: h.hari_ke, slotJudul: "Makan 1", pita: "9 sampai 11",
      bahan: sl.item.map((it) => ({ nama: it.bahan_id, gram: it.gram, peran: it.peran })),
      teks: "### Bubur\n**Langkah**\n1. Kukus sampai empuk.", ai: true, gambar: GAMBAR, modelGambar: "openai/gpt-image-2",
    };
  };

  it("resep: tidak tersedia tanpa resep, tersedia dengan resep, memuat gambar dan hanya yang dipilih", () => {
    const c = konteks("A");
    expect(ketersediaan(c)["resep"]).not.toBe(true);
    const r1 = resepContoh(c);
    const c2: KonteksEkspor = { ...c, resep: [r1, { ...r1, id: "r2", slotJudul: "Makan 2", gambar: undefined }] };
    expect(ketersediaan(c2)["resep"]).toBe(true);
    const semuaResep = teksBlok(susunBlok({ ...OPSI_BAWAAN, bagian: ["resep"] }, c2));
    expect(semuaResep).toContain("dok-resep__img");
    expect(semuaResep).toContain("Makan 2");
    const satu = teksBlok(susunBlok({ ...OPSI_BAWAAN, bagian: ["resep"], resepIds: ["r2"] }, c2));
    expect(satu).toContain("Makan 2");
    expect(satu).not.toContain(GAMBAR);
  });

  it("resep: gambar bukan data URL gambar yang sah dibuang", () => {
    const c = konteks("A");
    const r1 = { ...resepContoh(c), gambar: 'https://x.test/a.png" onerror="alert(1)' };
    const h = teksBlok(susunBlok({ ...OPSI_BAWAAN, bagian: ["resep"] }, { ...c, resep: [r1] }));
    expect(h).not.toContain("x.test");
    expect(h).not.toContain("onerror");
  });

  it("Ultimate memuat ringkasan sesi, resep, penjelasan, dan semua bagian yang tersedia", () => {
    const c = konteks("A");
    const c2: KonteksEkspor = { ...c, resep: [resepContoh(c)], penjelasan: { teks: "Ringkasan.", ai: false }, penjelasMenu: [{ hari: 1, teks: "Menu hari ini.", ai: true }] };
    const u = PILIHAN_CEPAT.find((q) => q.id === "ultimate")!;
    const ada = ketersediaan(c2);
    const dok = susunBlok({ ...OPSI_BAWAAN, bagian: [...u.bagian] }, c2);
    const ids = dok.isi.map((x) => x.id);
    for (const b of u.bagian.filter((x) => ada[x] === true)) expect(ids).toContain(b);
    expect(ids[0]).toBe("sesi");
    expect(ids).toContain("resep");
    expect(ids).toContain("penjelas");
    expect(dok.judul).toBe("Arsip sesi lengkap");
    const h = teksBlok(dok);
    expect(h).toContain("1 resep, 1 dengan gambar");
  });
});
