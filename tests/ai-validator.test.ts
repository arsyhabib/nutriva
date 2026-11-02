import { describe, expect, it } from "vitest";
import { MuatanAiSchema } from "../src/ai/kontrak";
import { validasiKeluaranAi } from "../src/ai/validator";

const m = MuatanAiSchema.parse({
  skema: 1,
  layar: "status",
  pita_usia: "9-11",
  status: { bbu: "bb_normal", pbu: "pendek", bbpb: "gizi_baik" },
  akg: [
    { zat: "besi_mg", persen: 24 },
    { zat: "kalsium_mg", persen: 19 },
  ],
  versi: { engine: "0.2.0", data: "2026-11-02", rules: "0.1.0" },
});
const baik =
  "Berat badan anak sesuai umur dan berat menurut panjang badannya baik. Panjang badan masuk kategori pendek, jadi sebaiknya diperiksa ulang di posyandu. Zat besi baru 24 persen dari kebutuhan dan kalsium 19 persen.";
const alasan = (t: unknown) => {
  const v = validasiKeluaranAi(t, m);
  return v.ok ? [] : v.alasan;
};

describe("validator keluaran AI", () => {
  it("menerima teks wajar", () => expect(validasiKeluaranAi(baik, m)).toMatchObject({ ok: true }));
  it("menolak bukan teks, terlalu pendek, terlalu panjang, terlalu banyak baris", () => {
    expect(alasan(42)).toContain("bukan_teks");
    expect(alasan(null)).toContain("bukan_teks");
    expect(alasan("Baik.")).toContain("terlalu_pendek");
    expect(alasan(baik + " kata".repeat(700))).toContain("terlalu_panjang");
    expect(alasan(Array.from({ length: 45 }, () => baik.slice(0, 50)).join("\n"))).toContain("terlalu_banyak_baris");
  });
  it("menolak tautan, domain telanjang, markup, dan kode", () => {
    for (const x of ["https://contoh.com", "www.contoh.org", "kunjungi contoh.id sekarang", "[klik](x)", "<b>tebal</b>", "```kode```", "![gambar](x)", "`kode`", "&amp;"]) {
      expect(alasan(baik + " " + x), x).toContain("ada_tautan_atau_markup");
    }
  });
  it("mengizinkan format Markdown (tebal, miring, judul, daftar, tabel, kutipan) tanpa menganggap tandanya sebagai kata atau angka", () => {
    for (const x of [
      "**Pastikan** anak makan teratur.",
      "*Pastikan* anak makan teratur.",
      "### Pastikan anak makan teratur",
      "- Pastikan anak makan teratur\n- Pastikan anak makan teratur",
      "1. Pastikan anak makan teratur\n2. Pastikan anak makan teratur",
      "> Pastikan anak makan teratur.",
      "| Zat | Hasil |\n|---|---|\n| Pastikan | anak |",
      "---\nPastikan anak makan teratur.",
    ]) {
      expect(alasan(baik + "\n\n" + x), x).toEqual([]);
    }
  });
  it("menolak angka yang tidak ada di muatan, termasuk desimal dan angka berkomposisi", () => {
    for (const x of ["Zat besi 25 persen.", "Kalsium 19,5 persen.", "Berat 8,8 kg.", "Energi 300 kkal."]) expect(alasan(baik + " " + x), x).toContain("angka_asing");
  });
  it("mengizinkan nama vitamin berangka dan angka dari muatan", () => {
    expect(alasan(baik + " Vitamin B12 dan vitamin B6 tetap perlu.")).toEqual([]);
  });
  it("menolak kata terlarang dan tidak salah menolak kata mirip", () => {
    for (const x of ["Beri suplemen zat besi.", "Anak ini stunting.", "Berikan obat cacing.", "Dosis dua kali.", "Pasti sembuh.", "Beri madu."]) {
      expect(alasan(baik + " " + x), x).toContain("kata_terlarang");
    }
    expect(alasan(baik + " Pastikan anak makan teratur.")).toEqual([]);
  });
  it("menolak label status yang tidak ada di muatan", () => {
    for (const x of ["Anak ini obesitas.", "Termasuk gizi buruk.", "Anak sangat pendek.", "Anak tampak kurus.", "Gizi lebih."]) {
      expect(alasan(baik + " " + x), x).toContain("status_asing");
    }
  });
  it("mengizinkan label yang sesuai muatan", () => expect(alasan(baik)).toEqual([]));
});
