import { describe, expect, it, vi } from "vitest";
import { ambilTeks, GalatBaca, kirimUlang, panggilChat, potongRapi } from "../src/ai/transport";
import { pesanAlasan, URL_OPENROUTER } from "../src/ai/klien";
import { mintaGambarSaja, mintaResepBergambar, mintaResepSaja, resepBerbentuk, URL_OPENROUTER_GAMBAR, type MasukanResep } from "../src/ai/resep";

const js = (status: number, body: unknown, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", ...headers } });
const ok = (content: unknown, finish = "stop") => js(200, { choices: [{ message: { content }, finish_reason: finish }] });
const TEKS = "Pertumbuhan anak sudah baik. Lanjutkan pola makan beragam dan pantau berat badan setiap bulan di posyandu.";
const dasar = (f: unknown, lebih: Record<string, unknown> = {}) => ({
  kunci: "kunci-palsu-uji", model: "m/x", pesan: [{ role: "system" as const, content: "S" }, { role: "user" as const, content: "U" }],
  maxTokens: 100, suhu: 0.3, url: "https://x/y", fetchFn: f as typeof fetch, batasMs: 500, jedaMs: 0, ...lebih,
});

describe("panggilChat: ketahanan", () => {
  it("batas laju 429 lalu sukses = diulang otomatis", async () => {
    const f = vi.fn().mockResolvedValueOnce(js(429, {})).mockResolvedValueOnce(js(503, {})).mockResolvedValueOnce(ok(TEKS));
    const h = await panggilChat(dasar(f));
    expect(h).toMatchObject({ ok: true, teks: TEKS, terpotong: false, percobaan: 3 });
  });
  it("galat yang datang bersama status 200 diulang", async () => {
    const f = vi.fn().mockResolvedValueOnce(js(200, { error: { code: 502, message: "penyedia jatuh" } })).mockResolvedValueOnce(ok(TEKS));
    expect(await panggilChat(dasar(f))).toMatchObject({ ok: true, teks: TEKS });
  });
  it("keluaran kosong diulang, lalu dilaporkan bila tetap kosong", async () => {
    const f = vi.fn().mockImplementation(async () => ok(""));
    const h = await panggilChat(dasar(f));
    expect(h).toEqual({ ok: false, alasan: "keluaran_kosong" });
    expect(f).toHaveBeenCalledTimes(3);
  });
  it("401, 402, 403, 404 tidak diulang", async () => {
    for (const st of [401, 402, 403, 404]) {
      const f = vi.fn().mockResolvedValue(js(st, {}));
      expect(await panggilChat(dasar(f))).toEqual({ ok: false, alasan: `status_${st}` });
      expect(f).toHaveBeenCalledTimes(1);
    }
  });
  it("400 karena parameter penalaran: diulang tanpa parameter itu", async () => {
    const f = vi.fn().mockResolvedValueOnce(js(400, {})).mockResolvedValueOnce(ok(TEKS));
    const h = await panggilChat(dasar(f));
    expect(h.ok).toBe(true);
    const badan1 = JSON.parse(String((f.mock.calls[0] as [string, RequestInit])[1].body));
    const badan2 = JSON.parse(String((f.mock.calls[1] as [string, RequestInit])[1].body));
    expect(badan1.reasoning).toEqual({ enabled: false });
    expect(badan2.reasoning).toBeUndefined();
  });
  it("terpotong: diminta ulang dengan ruang dua kali lipat dan petunjuk ringkas", async () => {
    const f = vi.fn().mockResolvedValueOnce(ok("Awal yang panjang tetapi terpo", "length")).mockResolvedValueOnce(ok(TEKS));
    const h = await panggilChat(dasar(f, { petunjukRingkas: "RINGKAS" }));
    expect(h).toMatchObject({ ok: true, teks: TEKS, terpotong: false });
    const b2 = JSON.parse(String((f.mock.calls[1] as [string, RequestInit])[1].body));
    expect(b2.max_tokens).toBe(200);
    expect(b2.messages[0].content).toContain("RINGKAS");
  });
  it("tetap terpotong sampai habis percobaan: dikembalikan ditandai terpotong", async () => {
    const f = vi.fn().mockImplementation(async () => ok("Kalimat satu selesai. Kalimat dua terpo", "length"));
    const h = await panggilChat(dasar(f, { maxTokens: 3000 }));
    expect(h).toMatchObject({ ok: true, terpotong: true });
  });
  it("isi berupa larik bagian dan blok pikiran dibersihkan", async () => {
    const f = vi.fn().mockImplementation(async () => ok([{ type: "text", text: "<think>rahasia</think>" }, { type: "text", text: TEKS }]));
    const h = await panggilChat(dasar(f));
    expect(h).toMatchObject({ ok: true, teks: TEKS });
    expect(ambilTeks("<thinking>x</thinking>Halo")).toBe("Halo");
    // bagian penalaran dari larik tidak boleh bocor
    expect(ambilTeks([{ type: "reasoning", text: "PIKIRAN RAHASIA" }, { type: "text", text: "Jawab" }])).toBe("Jawab");
  });
  it("waktu habis diulang lalu dilaporkan sebagai waktu_habis", async () => {
    const f = vi.fn((_u: string, init: RequestInit) => new Promise<Response>((_r, rej) => init.signal?.addEventListener("abort", () => rej(new Error("abort")))));
    const h = await panggilChat(dasar(f, { batasMs: 20, cobaMaks: 2 }));
    expect(h).toEqual({ ok: false, alasan: "waktu_habis" });
    expect(f).toHaveBeenCalledTimes(2);
  });
  it("tidak pernah melempar bila fetch melempar", async () => {
    const f = vi.fn().mockRejectedValue(new Error("putus"));
    expect(await panggilChat(dasar(f))).toEqual({ ok: false, alasan: "galat_jaringan" });
  });
});

describe("panggilChat: kasus audit", () => {
  it("400 pertama melepas penalaran tanpa memakai jatah percobaan, walau didahului 429 dan 503", async () => {
    const f = vi.fn().mockResolvedValueOnce(js(429, {})).mockResolvedValueOnce(js(503, {})).mockResolvedValueOnce(js(400, {})).mockResolvedValueOnce(ok(TEKS));
    const h = await panggilChat(dasar(f, { cobaMaks: 3 }));
    expect(h.ok).toBe(true);
  });
  it("400 dalam badan 200 juga melepas penalaran", async () => {
    const f = vi.fn().mockResolvedValueOnce(js(200, { error: { code: 400 } })).mockResolvedValueOnce(ok(TEKS));
    expect((await panggilChat(dasar(f))).ok).toBe(true);
    const b2 = JSON.parse(String((f.mock.calls[1] as [string, RequestInit])[1].body));
    expect(b2.reasoning).toBeUndefined();
  });
  it("402 dan 404 dalam badan 200 tidak diulang", async () => {
    for (const kode of [402, 404]) {
      const f = vi.fn().mockImplementation(async () => js(200, { error: { code: kode } }));
      expect(await panggilChat(dasar(f))).toEqual({ ok: false, alasan: `status_${kode}` });
      expect(f).toHaveBeenCalledTimes(1);
    }
  });
  it("badan terputus oleh batas waktu dilaporkan waktu_habis", async () => {
    const f = vi.fn((_u: string, init: RequestInit) => Promise.resolve({
      ok: true, status: 200, headers: new Headers(),
      json: () => new Promise((_r, rej) => init.signal?.addEventListener("abort", () => rej(new Error("abort")))),
    } as unknown as Response));
    expect(await panggilChat(dasar(f, { batasMs: 20, cobaMaks: 1 }))).toEqual({ ok: false, alasan: "waktu_habis" });
  });
});

describe("kirimUlang: kasus audit", () => {
  it("galat bawaan peramban pada badan diulang; GalatBaca tidak", async () => {
    const f = vi.fn().mockResolvedValueOnce(new Response("<html>", { status: 200 })).mockResolvedValueOnce(js(200, { a: 1 }));
    const r = await kirimUlang("https://x", {}, { fetchFn: f as unknown as typeof fetch, batasMs: 500, jedaMs: 0 }, async (res) => (await res.json()) as { a: number });
    expect(r).toEqual({ ok: true, nilai: { a: 1 } });
    const g = vi.fn().mockImplementation(async () => js(200, {}));
    const r2 = await kirimUlang("https://x", {}, { fetchFn: g as unknown as typeof fetch, batasMs: 500, jedaMs: 0 }, async () => { throw new GalatBaca("status_402"); });
    expect(r2).toEqual({ ok: false, alasan: "status_402" });
    expect(g).toHaveBeenCalledTimes(1);
  });
  it("waktu habis tidak diulang bila ulangiWaktuHabis=false", async () => {
    const f = vi.fn((_u: string, init: RequestInit) => new Promise<Response>((_r, rej) => init.signal?.addEventListener("abort", () => rej(new Error("abort")))));
    const r = await kirimUlang("https://x", {}, { fetchFn: f as unknown as typeof fetch, batasMs: 20, cobaMaks: 3, jedaMs: 0, ulangiWaktuHabis: false }, async () => 1);
    expect(r).toEqual({ ok: false, alasan: "waktu_habis" });
    expect(f).toHaveBeenCalledTimes(1);
  });
});

describe("potongRapi", () => {
  it("membuang baris gantung dan judul yatim", () => {
    expect(potongRapi("Satu kalimat utuh.\nKalimat dua yang terpo")).toBe("Satu kalimat utuh.");
    expect(potongRapi("Pembuka.\n\n**Langkah**\n1. Cuci bahan.\n2. Kukus selama 10 men")).toBe("Pembuka.\n\n**Langkah**\n1. Cuci bahan.");
    expect(potongRapi("Pembuka selesai.\n### Judul gantung")).toBe("Pembuka selesai.");
  });
  it("tidak membuang daftar bahan dan langkah yang utuh tanpa tanda baca akhir", () => {
    const r = "### Bubur\nPembuka.\n\n**Bahan**\n- Bayam: 1,5 g\n- Beras putih: 40 g\n\n**Langkah**\n1. Kukus wortel 10 menit\n2. Haluskan lalu campur\n3. Sajikan han";
    const h = potongRapi(r);
    expect(h).toContain("- Bayam: 1,5 g");
    expect(h).toContain("2. Haluskan lalu campur");
    expect(h).not.toContain("3. Sajikan han");
  });
  it("nomor yatim dan label bertitik dua di ujung dibuang", () => {
    expect(potongRapi("Pembuka selesai.\n1. Cuci bahan.\n2.")).toBe("Pembuka selesai.\n1. Cuci bahan.");
    expect(potongRapi("Pembuka selesai.\n**Langkah**:")).toBe("Pembuka selesai.");
  });
  it("pemotongan satu baris tidak berhenti di angka atau singkatan", () => {
    const t = "Beri 1,5 sdm bubur lalu amati reaksi anak sambil berkonsultasi dengan Dr. Ani yang ramah dan sabar untuk lan";
    expect(potongRapi(t)).toBe(t); // tidak ada akhir kalimat yang sah: dibiarkan utuh
    expect(potongRapi(t).endsWith("Dr.")).toBe(false);
  });
  it("satu baris panjang dipotong di akhir kalimat terakhir", () => {
    const t = "Anak Anda tumbuh baik dan asupan sudah beragam. Lanjutkan pemantauan setiap bulan lalu perhatikan ten";
    expect(potongRapi(t)).toBe("Anak Anda tumbuh baik dan asupan sudah beragam.");
  });
  it("teks yang sudah rapi tidak diubah", () => {
    const t = "Selesai dengan baik.\n- Poin satu.\n- Poin dua.";
    expect(potongRapi(t)).toBe(t);
  });
  it("menutup tebal yang terbuka", () => {
    expect(potongRapi("Halo semua. Ini **penting")).not.toContain("**");
  });
});

describe("kirimUlang", () => {
  it("mengulang status sementara dan membaca badan dalam batas waktu", async () => {
    const f = vi.fn().mockResolvedValueOnce(js(502, {})).mockResolvedValueOnce(js(200, { a: 1 }));
    const r = await kirimUlang("https://x", {}, { fetchFn: f as unknown as typeof fetch, batasMs: 500, jedaMs: 0 }, async (res) => (await res.json()) as { a: number });
    expect(r).toEqual({ ok: true, nilai: { a: 1 } });
  });
  it("galat pembacaan terminal (GalatBaca) tidak diulang", async () => {
    const f = vi.fn().mockImplementation(async () => js(200, {}));
    const r = await kirimUlang("https://x", {}, { fetchFn: f as unknown as typeof fetch, batasMs: 500, jedaMs: 0 }, async () => { throw new GalatBaca("gambar_tak_sah"); });
    expect(r).toEqual({ ok: false, alasan: "gambar_tak_sah" });
    expect(f).toHaveBeenCalledTimes(1);
  });
});

const M: MasukanResep = { judulSlot: "Makan pagi", pita: "9-11", bahan: [{ nama: "Beras putih", gram: 40 }, { nama: "Hati ayam", gram: 20 }] };
const RESEP = `### Bubur hati ayam\nBubur lembut untuk si kecil.\n\n**Bahan**\n- Beras putih: 40 g\n- Hati ayam: 20 g\n\n**Langkah**\n1. Cuci bahan.\n2. Masak beras sampai menjadi bubur, sekitar 25 menit.\n3. Masukkan hati ayam sampai matang dan haluskan.\n\n**Tekstur dan penyajian**\nSajikan hangat.`;
const PNG = "iVBORw0KGgo" + "A".repeat(200);
const KUNCI = { kunci: "kunci-palsu-uji", model: "m/x" };

describe("resep: konsistensi dan stabilitas", () => {
  it("jawaban bukan resep (mis. penolakan) diulang sekali, lalu resep cadangan", async () => {
    const f = vi.fn().mockImplementation(async () => ok("Maaf, saya tidak dapat membantu permintaan itu dengan baik sekarang ini ya."));
    const h = await mintaResepSaja(M, { kunciSendiri: KUNCI, fetchFn: f as unknown as typeof fetch, jedaMs: 0 });
    expect(h.sumber).toBe("templat");
    expect(h.alasan).toBe("resep_tak_berbentuk");
    expect(f).toHaveBeenCalledTimes(2);
  });
  it("percobaan kedua yang berbentuk dipakai", async () => {
    const f = vi.fn().mockResolvedValueOnce(ok("Maaf, saya tidak bisa.")).mockResolvedValueOnce(ok(RESEP));
    const h = await mintaResepSaja(M, { kunciSendiri: KUNCI, fetchFn: f as unknown as typeof fetch, jedaMs: 0 });
    expect(h).toMatchObject({ sumber: "ai" });
  });
  it("resep terpotong dirapikan, bukan ditampilkan separuh", async () => {
    const f = vi.fn().mockImplementation(async () => ok(RESEP + "\n4. Dinginkan sebentar sampai han", "length"));
    const h = await mintaResepSaja(M, { kunciSendiri: KUNCI, fetchFn: f as unknown as typeof fetch, jedaMs: 0 });
    expect(h.sumber).toBe("ai");
    expect(h.teks).not.toContain("sampai han");
  });
  it("429 pada resep diulang dan akhirnya berhasil", async () => {
    const f = vi.fn().mockResolvedValueOnce(js(429, {})).mockResolvedValueOnce(ok(RESEP));
    expect((await mintaResepSaja(M, { kunciSendiri: KUNCI, fetchFn: f as unknown as typeof fetch, jedaMs: 0 })).sumber).toBe("ai");
  });
  it("gambar: 503 diulang; galat 200 diulang", async () => {
    const f = vi.fn().mockResolvedValueOnce(js(503, {})).mockResolvedValueOnce(js(200, { error: { code: 500 } })).mockResolvedValue(js(200, { data: [{ b64_json: PNG, media_type: "image/png" }] }));
    const g = await mintaGambarSaja(M, { kunciSendiri: KUNCI, fetchFn: f as unknown as typeof fetch, jedaMs: 0 });
    expect(g.ok).toBe(false); // cobaMaks gambar = 2: dua percobaan pertama gagal
    const f2 = vi.fn().mockResolvedValueOnce(js(503, {})).mockResolvedValue(js(200, { data: [{ b64_json: PNG, media_type: "image/png" }] }));
    expect((await mintaGambarSaja(M, { kunciSendiri: KUNCI, fetchFn: f2 as unknown as typeof fetch, jedaMs: 0 })).ok).toBe(true);
  });
  it("resep tampil lebih dulu bila gambar lambat (penangkap progresif)", async () => {
    const urutan: string[] = [];
    const f = (async (url: string) => {
      if (url === URL_OPENROUTER_GAMBAR) { await new Promise((r) => setTimeout(r, 40)); return js(200, { data: [{ b64_json: PNG, media_type: "image/png" }] }); }
      return ok(RESEP);
    }) as unknown as typeof fetch;
    await mintaResepBergambar(M, { kunciSendiri: KUNCI, fetchFn: f, jedaMs: 0 }, { resep: () => urutan.push("resep"), gambar: () => urutan.push("gambar") });
    expect(urutan).toEqual(["resep", "gambar"]);
  });
  it("resepBerbentuk menolak penolakan dan menerima resep", () => {
    expect(resepBerbentuk("Maaf, tidak bisa.")).toBe(false);
    expect(resepBerbentuk(RESEP)).toBe(true);
  });
});

describe("pesanAlasan baru", () => {
  it("memetakan waktu habis, galat penyedia, dan keluaran kosong", () => {
    expect(pesanAlasan("waktu_habis")).toMatch(/lama/);
    expect(pesanAlasan("status_503")).toMatch(/bermasalah/);
    expect(pesanAlasan("keluaran_kosong")).toMatch(/tidak memberi jawaban/);
    expect(pesanAlasan("status_429")).toMatch(/membatasi/);
  });
  it("tujuan URL tetap OpenRouter", () => { expect(URL_OPENROUTER).toContain("openrouter.ai"); });
});

