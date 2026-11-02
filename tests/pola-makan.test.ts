import { describe, expect, it } from "vitest";
import { bangunPola, type MasukanPola } from "../src/engine/polaMakan";
import { buatDaftarBelanja } from "../src/engine/belanja";
import { DATA } from "../src/engine/data";

const dasar: MasukanPola = { usia_bulan: 10, hari: 7, benih: "uji", hindari: [], izinkan_hati: true, masih_asi: false };
const ATR = new Map(DATA.bahanAtribut.bahan.map((b) => [b.id, b] as const));
function ok(m: MasukanPola) {
  const r = bangunPola(m);
  if (r.hasil !== "ok") throw new Error("stop " + r.alasan);
  return r;
}

describe("bangunPola", () => {
  it("deterministik untuk benih sama, berbeda untuk benih lain", () => {
    expect(JSON.stringify(ok(dasar))).toBe(JSON.stringify(ok(dasar)));
    expect(JSON.stringify(ok(dasar).hari)).not.toBe(JSON.stringify(ok({ ...dasar, benih: "lain" }).hari));
  });
  it("stop di luar cakupan dan hari tidak valid", () => {
    for (const u of [5, 24, 7.5]) expect(bangunPola({ ...dasar, usia_bulan: u }).hasil).toBe("stop");
    for (const h of [0, 8, 1.5]) expect(bangunPola({ ...dasar, hari: h }).hasil).toBe("stop");
  });
  for (let usia = 6; usia <= 23; usia++) {
    it(`invarian usia ${usia} bulan, 40 benih`, () => {
      for (let b = 0; b < 40; b++) {
        const r = ok({ ...dasar, usia_bulan: usia, benih: "b" + b });
        let hatiHari = 0;
        for (const h of r.hari) {
          expect(h.energi_persen_target).toBeGreaterThanOrEqual(80);
          expect(h.energi_persen_target).toBeLessThanOrEqual(110);
          expect(h.jumlah_kelompok_mdd).toBeGreaterThanOrEqual(5);
          expect(h.mdd_tercapai).toBe(true);
          expect(h.vit_a_hewani_rae_mcg).toBeLessThanOrEqual(DATA.aturanPolaMakan.batas.vit_a_hewani_rae_mcg_per_hari);
          expect(h.peringatan).toEqual([]);
          const ids = h.slot.flatMap((s) => s.item.map((i) => i.bahan_id));
          let hatiG = 0;
          for (const s of h.slot) for (const i of s.item) {
            expect(ATR.get(i.bahan_id)?.usia_min_bulan ?? 99).toBeLessThanOrEqual(usia);
            expect(Number.isInteger(i.gram) && i.gram > 0).toBe(true);
            if (i.bahan_id === "hati") hatiG += i.gram;
          }
          expect(hatiG).toBeLessThanOrEqual(DATA.aturanPolaMakan.batas.hati_maks_g_per_porsi);
          if (ids.includes("hati")) hatiHari++;
        }
        expect(hatiHari).toBeLessThanOrEqual(DATA.aturanPolaMakan.batas.hati_maks_per_minggu);
      }
    });
  }
  it("hati tidak muncul bila tidak diizinkan", () => {
    for (let b = 0; b < 30; b++) {
      const r = ok({ ...dasar, izinkan_hati: false, benih: "n" + b });
      expect(JSON.stringify(r.hari)).not.toContain('"hati"');
    }
  });
  it("menghindari bahan dan alergen", () => {
    const alergenAda = new Set(DATA.bahanAtribut.bahan.flatMap((b) => b.alergen));
    expect(alergenAda.size).toBeGreaterThan(0);
    for (const a of ["telur", "ikan", "kedelai", ...alergenAda]) {
      const r = ok({ ...dasar, hindari: [a], benih: "h" + a });
      for (const h of r.hari) for (const s of h.slot) for (const i of s.item) {
        const at = ATR.get(i.bahan_id);
        expect(i.bahan_id).not.toBe(a);
        expect(at?.alergen.includes(a)).toBe(false);
      }
    }
  });
  it("jumlah slot sesuai pita usia", () => {
    const p = (u: number) => ok({ ...dasar, usia_bulan: u, hari: 1 }).hari[0]?.slot.length;
    expect(p(7)).toBe(3);
    expect(p(10)).toBe(4);
    expect(p(15)).toBe(5);
  });
  it("ASI menambah kelompok MDD", () => {
    const a = ok({ ...dasar, masih_asi: true, hari: 1 }).hari[0];
    expect(a?.kelompok_mdd).toContain("asi");
  });
});

describe("daftar belanja", () => {
  it("gram beli >= gram disajikan dan kelipatan 5; jumlah sesuai", () => {
    const r = ok(dasar);
    const d = buatDaftarBelanja(r.hari);
    let total = 0;
    for (const i of d.item) {
      expect(i.gram_beli % 5).toBe(0);
      expect(i.gram_beli).toBeGreaterThanOrEqual(Math.min(i.gram_disajikan, 5));
      total += i.gram_disajikan;
    }
    expect(total).toBe(r.hari.flatMap((h) => h.slot.flatMap((s) => s.item)).reduce((a, i) => a + i.gram, 0));
    expect(d.jumlah_per_kelas.murah + d.jumlah_per_kelas.sedang + d.jumlah_per_kelas.mahal).toBe(d.item.length);
  });
});

describe("perbaikan hasil audit", () => {
  it("hati paling banyak sekali per 7 hari berurutan walau diminta 1 hari", () => {
    // jatah ditentukan benih per pekan; panggilan 7 menu 1-hari dengan benih sama tidak boleh memuat hati lebih dari sekali
    let n = 0;
    for (let h = 1; h <= 7; h++) {
      const r = ok({ ...dasar, hari: h, benih: "pekan" });
      n += JSON.stringify(r.hari.slice(h - 1)).includes('"hati"') ? 1 : 0;
    }
    expect(n).toBeLessThanOrEqual(1);
  });
  it("hindari tidak peka huruf besar dan kode tak dikenal ditolak", () => {
    const r = ok({ ...dasar, hindari: [" Telur "] });
    expect(JSON.stringify(r.hari)).not.toContain('"telur"');
    expect(bangunPola({ ...dasar, hindari: ["xyz"] })).toMatchObject({ hasil: "stop", alasan: "hindari_tidak_dikenal" });
  });
  it("gandum menyingkirkan oat", () => {
    for (let b = 0; b < 20; b++) expect(JSON.stringify(ok({ ...dasar, hindari: ["gandum"], benih: "g" + b }).hari)).not.toContain('"oat"');
  });
  it("stop bila semua protein atau staple dihindari", () => {
    expect(bangunPola({ ...dasar, hindari: ["telur", "ikan", "kedelai", "daging"] }).hasil).toBeDefined();
    const semuaStaple = DATA.bahanAtribut.bahan.filter((b) => b.peran === "staple").map((b) => b.id);
    expect(bangunPola({ ...dasar, hindari: semuaStaple })).toMatchObject({ hasil: "stop", alasan: "tidak_ada_pilihan_staple" });
  });
  it("kembung dan jagung tidak muncul sebelum 9 bulan", () => {
    for (let b = 0; b < 30; b++) {
      const j = JSON.stringify(ok({ ...dasar, usia_bulan: 7, benih: "t" + b }).hari);
      expect(j).not.toContain('"kembung"');
      expect(j).not.toContain('"jagung"');
    }
  });
});
