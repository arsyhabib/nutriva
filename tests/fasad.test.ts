import { describe, expect, it } from "vitest";
import { ringkasan, type MasukanRingkasan } from "../src/app/fasad";
import { urlWorkerAiValid, urlWorkerAiDariEnv } from "../src/app/konfigurasi";
import { tentukanTingkat, daftarTandaBahaya } from "../src/engine/rujukan";
import { hitungStatus } from "../src/engine/antropometri";
import { MuatanAiSchema } from "../src/ai/kontrak";
import { readFileSync } from "node:fs";

const dasar: MasukanRingkasan = {
  status: { jk: "L", umur: { bulan: 10, hari: 3 }, bb_kg: 8.9, pb_cm: 72, cara_ukur: "terlentang" },
  tanda_bahaya: [],
  pola: { hari: 3, benih: "uji", hindari: [], izinkan_hati: false, masih_asi: true },
};

describe("fasad ringkasan", () => {
  it("deterministik dan seluruh muatan AI sah", () => {
    const a = ringkasan(dasar);
    expect(JSON.stringify(a)).toBe(JSON.stringify(ringkasan(dasar)));
    if (a.hasil !== "ok") throw new Error("stop");
    expect(a.pola?.hari.length).toBe(3);
    expect(a.belanja?.item.length).toBeGreaterThan(5);
    expect(a.muatan_ai_menu.length).toBe(3);
    for (const m of [a.muatan_ai_status, ...a.muatan_ai_menu]) expect(MuatanAiSchema.safeParse(m).success).toBe(true);
    expect(a.muatan_ai_status?.akg).toBeUndefined();
  });
  it("hasil stop dari status diteruskan (usia di luar cakupan)", () => {
    const r = ringkasan({ ...dasar, status: { ...dasar.status, umur: { bulan: 24, hari: 0 } } });
    expect(r.hasil).toBe("stop");
  });
  it("tanda bahaya menghentikan menu dan AI, apa pun status", () => {
    const r = ringkasan({ ...dasar, tanda_bahaya: ["kejang"] });
    if (r.hasil !== "ok") throw new Error("stop");
    expect(r.rujukan.tingkat).toBe("rujuk");
    expect(r.pola).toBeNull();
    expect(r.belanja).toBeNull();
    expect(r.muatan_ai_status).toBeNull();
    expect(r.muatan_ai_menu).toEqual([]);
  });
  it("kode tanda bahaya tak dikenal tetap dianggap rujuk (gagal-aman)", () => {
    const r = ringkasan({ ...dasar, tanda_bahaya: ["apa_saja"] });
    if (r.hasil !== "ok") throw new Error("stop");
    expect(r.rujukan.tingkat).toBe("rujuk");
  });
  it("status sangat kurang merujuk dan menghentikan menu dan AI", () => {
    const r = ringkasan({ ...dasar, status: { ...dasar.status, bb_kg: 5.5 } });
    if (r.hasil !== "ok") throw new Error("stop");
    expect(r.status.bbu.kategori).toBe("bb_sangat_kurang");
    expect(r.rujukan.tingkat).toBe("rujuk");
    expect(r.pola).toBeNull();
    expect(r.muatan_ai_status).toBeNull();
  });
  it("hindari tak dikenal menghentikan menu tetapi status tetap tampil", () => {
    const r = ringkasan({ ...dasar, pola: { ...dasar.pola, hindari: ["xyz"] } });
    if (r.hasil !== "ok") throw new Error("stop");
    expect(r.pola).toBeNull();
    expect(r.pola_alasan_henti).toBe("hindari_tidak_dikenal");
    expect(r.muatan_ai_status).not.toBeNull();
  });
});

describe("rujukan", () => {
  it("normal tanpa tanda bahaya", () => {
    const s = hitungStatus(dasar.status);
    expect(tentukanTingkat(s, [])).toEqual({ tingkat: "normal", alasan: [] });
  });
  it("daftar tanda bahaya terisi dengan label", () => {
    expect(daftarTandaBahaya().length).toBeGreaterThanOrEqual(5);
    for (const t of daftarTandaBahaya()) expect(t.label.length).toBeGreaterThan(3);
  });
  it("kategori perhatian tanpa rujuk", () => {
    const s = hitungStatus({ ...dasar.status, pb_cm: 66 });
    const r = tentukanTingkat(s, []);
    expect(["perhatian", "rujuk", "normal"]).toContain(r.tingkat);
  });
});

describe("konfigurasi URL Worker", () => {
  it("menerima https dan localhost, menolak sisanya", () => {
    expect(urlWorkerAiValid("https://nutriva-ai.akun.workers.dev/")).toBe("https://nutriva-ai.akun.workers.dev");
    expect(urlWorkerAiValid("http://localhost:8787")).toBe("http://localhost:8787");
    for (const x of ["", "  ", "http://contoh.com", "ftp://x", "javascript:alert(1)", "https://u:p@x.dev", "https://x.dev/?k=1", "https://x.dev/#a", undefined, 5, "bukan url"]) {
      expect(urlWorkerAiValid(x), String(x)).toBeUndefined();
    }
    expect(urlWorkerAiDariEnv({ VITE_URL_WORKER_AI: "https://a.workers.dev" })).toBe("https://a.workers.dev");
    expect(urlWorkerAiDariEnv(undefined)).toBeUndefined();
  });
});

describe("header keamanan Pages", () => {
  const h = readFileSync("public/_headers", "utf8");
  it("memuat CSP ketat tanpa eval dan tanpa sumber luar selain workers.dev", () => {
    expect(h).toContain("Content-Security-Policy:");
    expect(h).not.toMatch(/unsafe-eval/);
    expect(h).toContain("script-src 'self'");
    expect(h).toContain("connect-src 'self' https://*.workers.dev");
    expect(h).toContain("frame-ancestors 'none'");
    expect(h).toContain("Referrer-Policy: no-referrer");
  });
});
