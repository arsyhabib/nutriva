import { describe, expect, it } from "vitest";
import { MuatanAiSchema } from "../src/ai/kontrak";
import { mintaPenjelasan } from "../src/ai/klien";
import { jelaskanTemplat } from "../src/ai/templat";

const m = MuatanAiSchema.parse({
  skema: 1,
  layar: "status",
  pita_usia: "12-23",
  status: { bbu: "bb_normal", pbu: "normal", bbpb: "gizi_baik" },
  versi: { engine: "0.2.0", data: "2026-11-02", rules: "0.1.0" },
});
const AI = "Semua hasil anak berada pada rentang normal. Teruskan pemberian makan yang beragam dan tetap timbang rutin di posyandu setiap bulan.";
const balas = (b: unknown, status = 200) => (async () => new Response(JSON.stringify(b), { status })) as unknown as typeof fetch;

describe("klien penjelas AI", () => {
  it("tanpa URL Worker langsung templat", async () => {
    const r = await mintaPenjelasan(m, {});
    expect(r).toMatchObject({ sumber: "templat", alasan_templat: "ai_mati", teks: jelaskanTemplat(m) });
  });
  it("jawaban AI sah dipakai", async () => {
    const r = await mintaPenjelasan(m, { urlWorker: "https://w.example/", fetchFn: balas({ teks: AI }) });
    expect(r).toEqual({ sumber: "ai", teks: AI });
  });
  it("mengirim hanya muatan tertutup, tanpa kredensial dan tanpa referrer", async () => {
    let dilihat: { url: string; init: RequestInit } | undefined;
    const f = (async (url: string, init: RequestInit) => {
      dilihat = { url, init };
      return new Response(JSON.stringify({ teks: AI }));
    }) as unknown as typeof fetch;
    await mintaPenjelasan(m, { urlWorker: "https://w.example///", fetchFn: f });
    expect(dilihat?.url).toBe("https://w.example/v1/jelaskan");
    expect(JSON.parse(dilihat?.init.body as string)).toEqual(m);
    expect(dilihat?.init.credentials).toBe("omit");
    expect(dilihat?.init.referrerPolicy).toBe("no-referrer");
  });
  it("status non-200, bentuk salah, dan jaringan gagal jatuh ke templat", async () => {
    expect((await mintaPenjelasan(m, { urlWorker: "https://w", fetchFn: balas({ galat: "x" }, 502) })).sumber).toBe("templat");
    expect((await mintaPenjelasan(m, { urlWorker: "https://w", fetchFn: balas({ bukan: "teks" }) })).sumber).toBe("templat");
    expect((await mintaPenjelasan(m, { urlWorker: "https://w", fetchFn: (async () => { throw new Error("x"); }) as unknown as typeof fetch })).sumber).toBe("templat");
  });
  it("keluaran AI yang melanggar validator ditolak walau Worker lolos", async () => {
    const r = await mintaPenjelasan(m, { urlWorker: "https://w", fetchFn: balas({ teks: AI + " Beri suplemen zat besi 30 mg." }) });
    expect(r.sumber).toBe("templat");
    expect(r.alasan_templat).toMatch(/^ditolak_/);
  });
  it("habis waktu menjadi templat", async () => {
    const lambat = ((_u: string, init: RequestInit) =>
      new Promise((_s, tolak) => init.signal?.addEventListener("abort", () => tolak(new DOMException("a", "AbortError"))))) as unknown as typeof fetch;
    const r = await mintaPenjelasan(m, { urlWorker: "https://w", fetchFn: lambat, batasMs: 20 });
    expect(r.sumber).toBe("templat");
  });
  it("muatan tidak sah tidak pernah dikirim", async () => {
    let dipanggil = false;
    const f = (async () => { dipanggil = true; return new Response("{}"); }) as unknown as typeof fetch;
    const r = await mintaPenjelasan({ ...m, layar: "rujukan" } as never, { urlWorker: "https://w", fetchFn: f });
    expect(dipanggil).toBe(false);
    expect(r.alasan_templat).toBe("muatan_tidak_valid");
  });
});
