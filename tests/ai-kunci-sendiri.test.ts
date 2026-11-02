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
    const f = vi.fn().mockResolvedValue(res(500));
    await mintaPenjelasan(m, { kunciSendiri: { kunci: KUNCI_UJI }, urlWorker: "https://w.example", fetchFn: f as unknown as typeof fetch });
    expect(f).toHaveBeenCalledTimes(1);
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
    const h = await mintaPenjelasan(m, { kunciSendiri: { kunci: KUNCI_UJI }, fetchFn: f as unknown as typeof fetch });
    expect(h.sumber).toBe("templat");
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
});
