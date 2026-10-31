import { describe, expect, it } from "vitest";
import type { Klaim, Sumber } from "../src/engine/schema/klaim";
import { kumpulkanRujukan, verifikasiKlaim } from "../src/tools/verifikasiKlaim";

const sumber: Sumber[] = [
  {
    id: "S-A",
    jenis: "regulasi",
    penerbit: "P",
    judul: "J",
    edisi: "1",
    tanggal_akses: "2026-10-28",
    lisensi: "L",
    boleh_redistribusi: true,
    berkas_lokal: null,
    sha256: null,
    tingkat: "A",
  },
];

const klaim = (id: string, status: Klaim["status"], sumberId = "S-A"): Klaim => ({
  id,
  tipe: "nilai",
  pernyataan: "x",
  status,
  tingkat: "A",
  sumber: status === "dikarantina" || status === "dicabut" ? [] : [{ sumber_id: sumberId, locator: { halaman: 1 } }],
});

describe("kumpulkanRujukan: klaim_id dan nilai numerik", () => {
  it("mengumpulkan klaim_id dan klaim_ids di kedalaman berapa pun", () => {
    const { rujukan, galat } = kumpulkanRujukan("a.json", {
      aturan: [{ nilai: 1, klaim_id: "KL-1" }, { sub: { ambang: 2, klaim_ids: ["KL-2", "KL-3"] } }],
    });
    expect(galat).toEqual([]);
    expect(rujukan.map((r) => r.klaim_id)).toEqual(["KL-1", "KL-2", "KL-3"]);
  });

  it("klaim di induk menutupi angka di keturunannya", () => {
    const { galat } = kumpulkanRujukan("a.json", {
      bahan: { klaim_id: "KL-1", gizi: { energi: 52, protein: 0.3 }, urt: [1, 2] },
    });
    expect(galat).toEqual([]);
  });

  it("klaim di simpul saudara TIDAK menutupi angka", () => {
    const { galat } = kumpulkanRujukan("a.json", { a: { klaim_id: "KL-1", x: 1 }, b: { y: 2 } });
    expect(galat.length).toBe(1);
    expect(galat[0]).toContain("$.b.y");
  });

  it("subpohon _meta dikecualikan", () => {
    const { galat } = kumpulkanRujukan("a.json", { _meta: { jumlah_baris: 30 }, versi: "x" });
    expect(galat).toEqual([]);
  });

  it("mewarisi label_belum_diverifikasi dari induk", () => {
    const { rujukan } = kumpulkanRujukan("a.json", {
      label_belum_diverifikasi: true,
      isi: { nilai: 1, klaim_id: "KL-1" },
    });
    expect(rujukan[0]?.label_belum_diverifikasi).toBe(true);
  });

  it("teks biasa dan kode non-numerik bukan nilai numerik", () => {
    const { galat } = kumpulkanRujukan("a.json", { nilai: "teks", nama: "bayam", kode: "A-12" });
    expect(galat).toEqual([]);
  });

  // Mutasi V1–V5 dari RPT-0006 (AUD-0006-02): semua HARUS menjadi galat.
  const MUTASI_LOLOS_SEBELUMNYA: [string, unknown][] = [
    ["V1 larik angka", { aturan: { nilai: [800, 900] } }],
    ["V2 nama kunci lain", { aturan: { energi_kkal: 800 } }],
    ["V3 angka sebagai string", { aturan: { nilai: "800" } }],
    ["V3b angka + satuan dalam string", { aturan: { catatan: "800 kkal per hari" } }],
    ["V4 huruf besar", { aturan: { Nilai: 800 } }],
    ["V5 kunci batas_atas", { aturan: { batas_atas: 12 } }],
    ["V7 desimal koma sebagai string", { aturan: { x: "12,5" } }],
    ["V8 larik di dalam larik", { aturan: [[1, 2]] }],
  ];
  for (const [nama, data] of MUTASI_LOLOS_SEBELUMNYA) {
    it(`mutasi ${nama} menjadi galat`, () => {
      const { galat } = kumpulkanRujukan("a.json", data);
      expect(galat.length, nama).toBeGreaterThan(0);
    });
  }
});

describe("verifikasiKlaim", () => {
  it("lulus bila semua rujukan menunjuk klaim yang boleh dipakai", () => {
    const r = verifikasiKlaim(
      [klaim("KL-1", "teks-ditemukan-mesin")],
      sumber,
      [{ berkas: "a", jalur: "$", klaim_id: "KL-1", label_belum_diverifikasi: false }],
    );
    expect(r.ok).toBe(true);
  });

  it("gagal bila klaim tidak ada", () => {
    const r = verifikasiKlaim([], sumber, [{ berkas: "a", jalur: "$", klaim_id: "KL-X", label_belum_diverifikasi: false }]);
    expect(r.ok).toBe(false);
    expect(r.galat[0]).toContain("tidak ada");
  });

  it("karantina TTD: klaim dikarantina GAGAL walau berlabel (AUD-0003-02, ADR-0002)", () => {
    const k = klaim("KL-TTD-DOSIS", "dikarantina");
    for (const label of [false, true]) {
      const r = verifikasiKlaim([k], sumber, [
        { berkas: "aturan/ttd.json", jalur: "$.ttd", klaim_id: "KL-TTD-DOSIS", label_belum_diverifikasi: label },
      ]);
      expect(r.ok).toBe(false);
      expect(r.galat[0]).toContain("dikarantina");
    }
  });

  it("klaim dicabut tidak pernah boleh dipakai", () => {
    const r = verifikasiKlaim([klaim("KL-1", "dicabut")], sumber, [
      { berkas: "a", jalur: "$", klaim_id: "KL-1", label_belum_diverifikasi: true },
    ]);
    expect(r.ok).toBe(false);
  });

  it("klaim belum: gagal tanpa label, lulus dengan label", () => {
    const k = klaim("KL-1", "belum");
    const tanpa = verifikasiKlaim([k], sumber, [{ berkas: "a", jalur: "$", klaim_id: "KL-1", label_belum_diverifikasi: false }]);
    const dengan = verifikasiKlaim([k], sumber, [{ berkas: "a", jalur: "$", klaim_id: "KL-1", label_belum_diverifikasi: true }]);
    expect(tanpa.ok).toBe(false);
    expect(dengan.ok).toBe(true);
  });

  it("gagal bila klaim menunjuk sumber yang tidak terdaftar", () => {
    const r = verifikasiKlaim([klaim("KL-1", "teks-ditemukan-mesin", "S-TIDAK-ADA")], sumber, []);
    expect(r.ok).toBe(false);
    expect(r.galat[0]).toContain("tidak terdaftar");
  });

  it("meneruskan galat awal (nilai tanpa klaim) ke hasil", () => {
    const r = verifikasiKlaim([], sumber, [], ["a.json $.x: nilai numerik tanpa klaim_id"]);
    expect(r.ok).toBe(false);
  });
});
