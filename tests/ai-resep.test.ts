import { describe, expect, it } from "vitest";
import { validasiResep } from "../src/ai/validator";
import { mintaResepBergambar, resepTemplat, susunPerintahGambar, susunPesanResep, URL_OPENROUTER_GAMBAR, type MasukanResep } from "../src/ai/resep";
import { URL_OPENROUTER } from "../src/ai/klien";

const M: MasukanResep = {
  judulSlot: "Makan pagi",
  pita: "9-11",
  bahan: [
    { nama: "Beras putih", gram: 40 },
    { nama: "Hati ayam", gram: 20 },
    { nama: "Bayam", gram: 15 },
  ],
};

const BAIK = `### Bubur hati ayam bayam
**Bahan**
- Beras putih: 40 g
- Hati ayam: 20 g
- Bayam: 15 g

**Langkah**
1. Cuci bersih beras, hati ayam, dan bayam.
2. Masak beras dengan air sampai menjadi bubur lembut, sekitar 25 menit.
3. Masukkan hati ayam dan bayam, masak sampai matang, sekitar 8 menit.
4. Cincang halus atau haluskan sampai teksturnya lembut dengan potongan sangat kecil.

**Tekstur dan penyajian**
Sajikan selagi hangat dalam mangkuk kecil. Bunda bisa menyuapi sedikit demi sedikit sesuai kemauan si kecil.`;

describe("validasiResep (longgar)", () => {
  it("menerima resep wajar, termasuk bumbu dan bahan tambahan yang wajar", () => {
    expect(validasiResep(BAIK, M.bahan)).toMatchObject({ ok: true });
    expect(validasiResep(BAIK + "\nBoleh ditambah sedikit bawang putih dan telur rebus.", M.bahan)).toMatchObject({ ok: true });
    expect(validasiResep(BAIK + "\nMasak 3 menit saja.", M.bahan)).toMatchObject({ ok: true });
  });
  it("tetap menolak hal berbahaya: tautan, obat/suplemen/dosis, madu, penyakit", () => {
    for (const x of ["Lihat [di sini](http://x.com)", "Beri suplemen setiap hari.", "Tambahkan madu agar manis.", "Resep ini menyembuhkan anemia.", "Dosis 2 sendok.", "<b>tebal</b>"]) {
      expect(validasiResep(BAIK + "\n" + x, M.bahan).ok, x).toBe(false);
    }
  });
  it("menolak teks bukan string, terlalu pendek, dan terlalu panjang", () => {
    expect(validasiResep(undefined, M.bahan).ok).toBe(false);
    expect(validasiResep("Bubur.", M.bahan).ok).toBe(false);
    expect(validasiResep(BAIK + "x".repeat(4000), M.bahan).ok).toBe(false);
  });
});

describe("pesan dan perintah gambar tidak memuat data anak", () => {
  it("hanya bahan, gram, dan rentang usia", () => {
    const p = susunPesanResep(M) + " " + susunPerintahGambar(M);
    expect(p).toMatch(/Beras putih/);
    expect(p).not.toMatch(/\bkg\b|cm\b|tanggal|nama anak|alergi/i);
  });
  it("resep cadangan lolos pemeriksaan bentuk dasar", () => {
    const t = resepTemplat(M);
    expect(t).toMatch(/Beras putih: 40 g/);
    expect(t).not.toMatch(/sendok/);
  });
});

const PNG = "iVBORw0KGgo" + "A".repeat(200);
function pasangan(opsi: { teks?: () => Response; gambar?: () => Response }) {
  const panggilan: { url: string; body: Record<string, unknown>; auth: string | undefined }[] = [];
  const f = (async (url: string, init: RequestInit) => {
    panggilan.push({ url, body: JSON.parse(String(init.body)), auth: (init.headers as Record<string, string>)["Authorization"] });
    if (url === URL_OPENROUTER) return (opsi.teks ?? (() => new Response(JSON.stringify({ choices: [{ message: { content: BAIK }, finish_reason: "stop" }] }))))();
    if (url === URL_OPENROUTER_GAMBAR) return (opsi.gambar ?? (() => new Response(JSON.stringify({ data: [{ b64_json: PNG, media_type: "image/png" }] }))))();
    throw new Error("url tak terduga " + url);
  }) as unknown as typeof fetch;
  return { f, panggilan };
}
const KUNCI = { kunci: "kunci-palsu-uji", model: "anthropic/claude-haiku-5.5" };

describe("mintaResepBergambar", () => {
  it("satu panggilan menghasilkan resep dan gambar bersamaan", async () => {
    const { f, panggilan } = pasangan({});
    const h = await mintaResepBergambar(M, { kunciSendiri: KUNCI, fetchFn: f });
    expect(h.resep.sumber).toBe("ai");
    expect(h.gambar.ok).toBe(true);
    if (h.gambar.ok) expect(h.gambar.src.startsWith("data:image/png;base64,")).toBe(true);
    expect(panggilan.map((p) => p.url).sort()).toEqual([URL_OPENROUTER, URL_OPENROUTER_GAMBAR].sort());
    expect(panggilan.every((p) => p.auth === "Bearer kunci-palsu-uji")).toBe(true);
    const g = panggilan.find((p) => p.url === URL_OPENROUTER_GAMBAR)!.body;
    expect(g["model"]).toBe("openai/gpt-image-2");
    expect(g["aspect_ratio"]).toBe("3:2");
  });
  it("tanpa penyaring: teks AI tampil apa adanya, gambar tetap ada", async () => {
    const aneh = BAIK + "\nBoleh ditambah bawang putih sedikit.";
    const { f } = pasangan({ teks: () => new Response(JSON.stringify({ choices: [{ message: { content: aneh }, finish_reason: "stop" }] })) });
    const h = await mintaResepBergambar(M, { kunciSendiri: KUNCI, fetchFn: f });
    expect(h.resep.sumber).toBe("ai");
    expect(h.resep.teks).toContain("bawang putih");
    expect(h.gambar.ok).toBe(true);
  });
  it("keluaran kosong dari model jatuh ke resep cadangan", async () => {
    const { f } = pasangan({ teks: () => new Response(JSON.stringify({ choices: [{ message: { content: "" }, finish_reason: "stop" }] })) });
    const h = await mintaResepBergambar(M, { kunciSendiri: KUNCI, fetchFn: f });
    expect(h.resep.sumber).toBe("templat");
    expect(h.resep.alasan).toBe("keluaran_kosong");
  });
  it("gambar gagal: resep AI tetap tampil", async () => {
    const { f } = pasangan({ gambar: () => new Response("{}", { status: 402 }) });
    const h = await mintaResepBergambar(M, { kunciSendiri: KUNCI, fetchFn: f });
    expect(h.resep.sumber).toBe("ai");
    expect(h.gambar).toEqual({ ok: false, alasan: "status_402" });
  });
  it("menolak gambar dengan isi tak sah atau tipe aneh", async () => {
    for (const body of [{ data: [{ b64_json: "<script>" + "A".repeat(200) }] }, { data: [{ b64_json: PNG, media_type: "image/svg+xml" }] }, { data: [] }]) {
      const { f } = pasangan({ gambar: () => new Response(JSON.stringify(body)) });
      const h = await mintaResepBergambar(M, { kunciSendiri: KUNCI, fetchFn: f });
      expect(h.gambar.ok).toBe(false);
    }
  });
  it("jaringan putus tidak melempar", async () => {
    const f = (async () => { throw new Error("putus"); }) as unknown as typeof fetch;
    const h = await mintaResepBergambar(M, { kunciSendiri: KUNCI, fetchFn: f });
    expect(h.resep.sumber).toBe("templat");
    expect(h.gambar.ok).toBe(false);
  });
});
