import { describe, expect, it, vi } from "vitest";
import { MuatanAiSchema } from "../src/ai/kontrak";
import { MODEL_AI_BAWAAN, URL_OPENROUTER, mintaPenjelasan, pesanAlasan, ujiKunci } from "../src/ai/klien";

const KUNCI_UJI = "kunci-palsu-untuk-uji";
const m = MuatanAiSchema.parse({
  skema: 1,
  layar: "status",
  pita_usia: "9-11",
  status: { bbu: "bb_normal", pbu: "pendek", bbpb: "gizi_baik" },
  akg: [{ zat: "besi_mg", persen: 24 }],
  versi: { engine: "0.2.0", data: "2026-11-02", rules: "0.1.0" },
});
const res = (status: number, body: unknown = {}) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

describe("AI dengan kunci sendiri", () => {
  it("model bawaan Haiku 5.5 lewat OpenRouter, kunci hanya ke OpenRouter", async () => {
    const f = vi.fn().mockResolvedValue(res(401));
    await mintaPenjelasan(m, { kunciSendiri: { kunci: KUNCI_UJI }, urlWorker: "https://w.example", fetchFn: f as unknown as typeof fetch, jedaMs: 0 });
    expect(f).toHaveBeenCalledTimes(1); // 401 tidak diulang
    const [url, init] = f.mock.calls[0] as [string, RequestInit];
    expect(url).toBe(URL_OPENROUTER);
    expect(JSON.parse(String(init.body)).model).toBe(MODEL_AI_BAWAAN);
    expect(MODEL_AI_BAWAAN).toBe("anthropic/claude-haiku-5.5");
    expect(String(init.body)).not.toContain(KUNCI_UJI);
  });
  it("kunci kosong dan tanpa Worker = templat, tanpa jaringan", async () => {
    const f = vi.fn();
    const h = await mintaPenjelasan(m, { kunciSendiri: { kunci: "  " }, fetchFn: f as unknown as typeof fetch });
    expect(h.sumber).toBe("templat");
    expect(f).not.toHaveBeenCalled();
  });
  it("kegagalan apa pun jatuh ke templat dan tidak melempar", async () => {
    const f = vi.fn().mockRejectedValue(new Error("putus"));
    const h = await mintaPenjelasan(m, { kunciSendiri: { kunci: KUNCI_UJI }, fetchFn: f as unknown as typeof fetch, jedaMs: 0 });
    expect(h.sumber).toBe("templat");
    expect(f).toHaveBeenCalledTimes(3); // gangguan jaringan diulang sampai 3 kali
  });
  it("ujiKunci memetakan status", async () => {
    expect(await ujiKunci(KUNCI_UJI, (async () => res(200)) as unknown as typeof fetch)).toBe("sah");
    expect(await ujiKunci(KUNCI_UJI, (async () => res(401)) as unknown as typeof fetch)).toBe("ditolak");
    expect(await ujiKunci(KUNCI_UJI, (async () => res(500)) as unknown as typeof fetch)).toBe("gagal");
    expect(await ujiKunci("", (async () => res(200)) as unknown as typeof fetch)).toBe("ditolak");
    expect(await ujiKunci(KUNCI_UJI, (async () => { throw new Error("x"); }) as unknown as typeof fetch)).toBe("gagal");
  });
  it("pesanAlasan ramah dan tidak membocorkan kunci", () => {
    expect(pesanAlasan("status_401")).toContain("ditolak");
    expect(pesanAlasan("ai_mati")).toBeNull();
    expect(pesanAlasan("apa_saja")).not.toBeNull();
  });
  describe("ketahanan", () => {
    const ok = (content: string, finish = "stop") => res(200, { choices: [{ message: { content }, finish_reason: finish }] });
    const TEKS = "### Ringkasan\nPertumbuhan anak sudah baik. Lanjutkan pola makan beragam dan pantau di posyandu setiap bulan.";
    const opsi = (f: unknown) => ({ kunciSendiri: { kunci: KUNCI_UJI }, fetchFn: f as typeof fetch, jedaMs: 0 });
    it("429 lalu sukses: pengguna tetap mendapat jawaban AI", async () => {
      const f = vi.fn().mockResolvedValueOnce(res(429)).mockResolvedValueOnce(ok(TEKS));
      const h = await mintaPenjelasan(m, opsi(f));
      expect(h.sumber).toBe("ai");
    });
    it("galat status 200 lalu sukses", async () => {
      const f = vi.fn().mockResolvedValueOnce(res(200, { error: { code: 502, message: "x" } })).mockResolvedValueOnce(ok(TEKS));
      expect((await mintaPenjelasan(m, opsi(f))).sumber).toBe("ai");
    });
    it("terpotong: diminta ulang, hasil utuh tampil", async () => {
      const f = vi.fn().mockResolvedValueOnce(ok("### Ringkasan\nPertumbuhan anak sudah ba", "length")).mockResolvedValueOnce(ok(TEKS));
      const h = await mintaPenjelasan(m, opsi(f));
      expect(h).toMatchObject({ sumber: "ai", teks: TEKS });
    });
    it("terpotong terus: dirapikan sampai kalimat utuh, tidak berhenti di tengah kata", async () => {
      const f = vi.fn().mockImplementation(async () => ok("Anak Anda tumbuh baik dan asupan beragam. Teruskan pemantauan bulanan lalu perhat", "length"));
      const h = await mintaPenjelasan(m, { ...opsi(f), batasMs: 2000 });
      expect(h.sumber).toBe("ai");
      expect(h.teks.endsWith("beragam.")).toBe(true);
    });
    it("kegagalan total: templat dengan alasan yang bisa dijelaskan", async () => {
      const f = vi.fn().mockResolvedValue(res(503));
      const h = await mintaPenjelasan(m, opsi(f));
      expect(h.sumber).toBe("templat");
      expect(h.alasan_templat).toBe("status_503");
      expect(pesanAlasan(h.alasan_templat)).toMatch(/bermasalah/);
    });
    it("Worker: 502 diulang sekali", async () => {
      const f = vi.fn().mockResolvedValueOnce(res(502)).mockResolvedValueOnce(res(200, { teks: "x" }));
      await mintaPenjelasan(m, { urlWorker: "https://w.example", fetchFn: f as unknown as typeof fetch, jedaMs: 0 });
      expect(f).toHaveBeenCalledTimes(2);
    });
  });
});
