/* Uji ketahanan AI di peramban nyata dengan jaringan tiruan (kunci palsu, tanpa internet).
 * Jalankan: node e2e/ai.cjs  (vite preview di :4173, playwright global) */
const { chromium } = require("playwright"); const fs = require("fs"); const path = require("path");
const URL = process.env.URL || "http://localhost:4173/";
const PNG = fs.readFileSync(path.join(__dirname, "gambar-uji.b64"), "utf8").trim();
let lulus = 0, gagal = 0; const cat = [];
const cek = (n, ok, info = "") => { if (ok) lulus++; else { gagal++; cat.push(`GAGAL ${n} ${info}`); } };
const tidur = (ms) => new Promise((r) => setTimeout(r, ms));
const js = (route, status, body, h = {}) => route.fulfill({ status, contentType: "application/json", headers: h, body: JSON.stringify(body) });
const resepDari = (user) => {
  const bahan = [...user.matchAll(/^- (.+): ([\d,]+) g$/gm)].map((m) => [m[1], m[2]]);
  return `### Bubur hangat\nSajian lembut untuk si kecil.\n\n**Bahan**\n${bahan.map(([n, g]) => `- ${n}: ${g} g`).join("\n")}\n\n**Langkah**\n1. Cuci bersih semua bahan.\n2. Kukus bahan sampai empuk, sekitar 15 menit.\n3. Haluskan sesuai tekstur yang disarankan.\n4. Campur lalu sajikan hangat.\n\n**Tekstur dan penyajian**\nSajikan selagi hangat.`;
};
const PENJELASAN = "### Ringkasan\nPertumbuhan anak sudah baik. Lanjutkan pola makan beragam dan pantau berat badan setiap bulan di posyandu.";

async function mulai(browser, router) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const p = await ctx.newPage(); const err = [];
  p.on("pageerror", (e) => err.push(e.message)); p.on("console", (m) => { if (m.type() === "error" && !/Failed to load resource/.test(m.text())) err.push(m.text()); });
  await p.route("https://openrouter.ai/**", router);
  await p.addInitScript(() => { sessionStorage.setItem("nutriva.kunci-ai", "kunci-palsu-uji"); });
  await p.goto(URL); await p.waitForSelector(".hp__isi"); await p.waitForTimeout(500);
  await p.evaluate(() => document.querySelector("[data-mulai-sendiri]").click()); await p.waitForTimeout(500);
  for (const [id, v] of [["#inp-bb", "8,1"], ["#inp-pb", "71"], ["#inp-usia-bulan", "10"]]) { await p.fill(id, v); await p.dispatchEvent(id, "change"); await p.waitForTimeout(250); }
  return { ctx, p, err };
}
const keResep = async (p) => { await p.evaluate(() => { location.hash = "#piring"; }); await p.waitForSelector("[data-resep-buat]", { timeout: 8000 }); await p.locator("[data-resep-buat]").first().scrollIntoViewIfNeeded(); };

(async () => {
  const browser = await chromium.launch();

  // S1: resep tampil lebih dulu (setelah 429 sekali), gambar menyusul, PDF aktif setelah semuanya siap
  {
    let teksKe = 0;
    const t = await mulai(browser, async (route) => {
      const u = route.request().url();
      if (u.endsWith("/chat/completions")) {
        teksKe++;
        if (teksKe === 1) return js(route, 429, { error: { message: "rate" } }, { "retry-after": "0" });
        return js(route, 200, { choices: [{ message: { content: resepDari(JSON.parse(route.request().postData()).messages[1].content) }, finish_reason: "stop" }] });
      }
      if (u.endsWith("/images")) { await tidur(3500); return js(route, 200, { data: [{ b64_json: PNG, media_type: "image/png" }] }); }
      return js(route, 200, {});
    });
    await keResep(t.p);
    await t.p.locator("[data-resep-buat]").first().click();
    await t.p.waitForSelector(".resep-kartu__isi.md", { timeout: 12000 });
    cek("S1 resep tampil sebelum gambar", (await t.p.locator(".resep-kartu .resep-skeleton").count()) > 0 && (await t.p.locator(".resep-kartu img").count()) === 0);
    cek("S1 429 sekali tetap menghasilkan resep AI", /ditulis AI/.test(await t.p.locator(".resep-kartu .kartu-ai__peringatan").first().innerText()));
    cek("S1 tombol PDF dikunci selagi gambar dimuat", await t.p.locator("[data-resep-pdf]").first().isDisabled());
    await t.p.waitForSelector(".resep-kartu img", { timeout: 15000 });
    cek("S1 gambar menyusul", true);
    cek("S1 tombol PDF aktif setelah siap", await t.p.locator("[data-resep-pdf]").first().isEnabled());
    cek("S1 tanpa galat konsol", t.err.length === 0, t.err.join("|"));
    await t.ctx.close();
  }

  // S2: gambar gagal -> "Coba gambar lagi" -> berhasil, resep tidak berubah
  {
    let gambarKe = 0, teksKe = 0;
    const t = await mulai(browser, async (route) => {
      const u = route.request().url();
      if (u.endsWith("/chat/completions")) { teksKe++; return js(route, 200, { choices: [{ message: { content: resepDari(JSON.parse(route.request().postData()).messages[1].content) }, finish_reason: "stop" }] }); }
      if (u.endsWith("/images")) { gambarKe++; if (gambarKe <= 2) return js(route, 503, {}); return js(route, 200, { data: [{ b64_json: PNG, media_type: "image/png" }] }); }
      return js(route, 200, {});
    });
    await keResep(t.p);
    await t.p.locator("[data-resep-buat]").first().click();
    await t.p.waitForSelector("[data-resep-ulang=gambar]", { timeout: 15000 });
    cek("S2 gambar gagal: ada tombol Coba gambar lagi", true);
    cek("S2 gambar gagal: resep AI tetap ada", /ditulis AI/.test(await t.p.locator(".resep-kartu .kartu-ai__peringatan").first().innerText()));
    const teksSebelum = await t.p.locator(".resep-kartu__isi.md").first().innerText();
    await t.p.locator("[data-resep-ulang=gambar]").first().click();
    await t.p.waitForSelector(".resep-kartu img", { timeout: 15000 });
    cek("S2 coba lagi: gambar muncul", true);
    cek("S2 coba lagi: resep tidak diminta ulang", teksKe === 1 && teksSebelum === (await t.p.locator(".resep-kartu__isi.md").first().innerText()), `teksKe=${teksKe}`);
    await t.ctx.close();
  }

  // S3: model menjawab bukan resep -> diulang sekali -> cadangan -> "Buat ulang resep" berhasil
  {
    let teksKe = 0;
    const t = await mulai(browser, async (route) => {
      const u = route.request().url();
      if (u.endsWith("/chat/completions")) {
        teksKe++;
        const isi = teksKe <= 2 ? "Maaf, saya tidak bisa menulis resep itu untuk saat ini ya." : resepDari(JSON.parse(route.request().postData()).messages[1].content);
        return js(route, 200, { choices: [{ message: { content: isi }, finish_reason: "stop" }] });
      }
      if (u.endsWith("/images")) return js(route, 200, { data: [{ b64_json: PNG, media_type: "image/png" }] });
      return js(route, 200, {});
    });
    await keResep(t.p);
    await t.p.locator("[data-resep-buat]").first().click();
    await t.p.waitForSelector("[data-resep-ulang=resep]", { timeout: 15000 });
    cek("S3 penolakan model -> resep cadangan + tombol Buat ulang resep", /cadangan/i.test(await t.p.locator(".resep-kartu .kartu-ai__peringatan").first().innerText()));
    cek("S3 gambar tidak terganggu", (await t.p.locator(".resep-kartu img").count()) === 1);
    await t.p.locator("[data-resep-ulang=resep]").first().click();
    await t.p.waitForFunction(() => /ditulis AI/.test(document.querySelector(".resep-kartu .kartu-ai__peringatan")?.innerText || ""), null, { timeout: 15000 });
    cek("S3 ulang resep -> resep AI", true);
    cek("S3 gambar tetap ada setelah ulang resep", (await t.p.locator(".resep-kartu img").count()) === 1);
    await t.ctx.close();
  }

  // S4: penjelasan terpotong lalu utuh; hasil lama dibuang bila data berubah selama menunggu
  {
    let ke = 0; let lambat = false;
    const t = await mulai(browser, async (route) => {
      const u = route.request().url();
      if (u.endsWith("/chat/completions")) {
        ke++;
        if (lambat) { await tidur(1800); return js(route, 200, { choices: [{ message: { content: "### Lama\nJawaban untuk data yang sudah diganti, tidak boleh tampil di layar ini sama sekali." }, finish_reason: "stop" }] }); }
        if (ke === 1) return js(route, 200, { choices: [{ message: { content: "### Ringkasan\nPertumbuhan anak sudah ba" }, finish_reason: "length" }] });
        return js(route, 200, { choices: [{ message: { content: PENJELASAN }, finish_reason: "stop" }] });
      }
      return js(route, 200, {});
    });
    await t.p.evaluate(() => { location.hash = "#status"; }); await t.p.waitForSelector("[data-refresh-ai]", { timeout: 8000 });
    await t.p.locator("[data-refresh-ai]").first().click();
    await t.p.waitForFunction(() => /Pertumbuhan anak sudah baik/.test(document.querySelector("[data-ai-teks]")?.innerText || ""), null, { timeout: 15000 });
    const teks = await t.p.locator("[data-ai-teks]").first().innerText();
    cek("S4 terpotong diminta ulang: teks utuh tampil", /posyandu/.test(teks) && !/sudah ba$/.test(teks.trim()), teks);
    lambat = true;
    await t.p.locator("[data-refresh-ai]").first().click();
    await t.p.waitForTimeout(300);
    await t.p.evaluate(() => { location.hash = "#profil"; }); await t.p.waitForSelector("#inp-bb");
    await t.p.fill("#inp-bb", "9,4"); await t.p.dispatchEvent("#inp-bb", "change"); await t.p.waitForTimeout(300);
    await t.p.evaluate(() => { location.hash = "#status"; });
    await t.p.waitForTimeout(2800);
    const sesudah = await t.p.evaluate(() => document.querySelector("[data-ai-teks]")?.innerText || "");
    cek("S4 hasil lama dibuang saat data berubah", !/tidak boleh tampil/.test(sesudah), sesudah.slice(0, 80));
    await t.ctx.close();
  }

  // S5: data sendiri belum diisi -> kartu menjelaskan (bukan tombol bisu); setelah dikonfirmasi tombol bekerja; penghitung detik berjalan
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const p = await ctx.newPage();
    await p.route("https://openrouter.ai/**", async (route) => {
      const u = route.request().url();
      if (u.endsWith("/chat/completions")) { await tidur(2600); return js(route, 200, { choices: [{ message: { content: resepDari(JSON.parse(route.request().postData()).messages[1].content) }, finish_reason: "stop" }] }); }
      if (u.endsWith("/images")) { await tidur(3200); return js(route, 200, { data: [{ b64_json: PNG, media_type: "image/png" }] }); }
      return js(route, 200, {});
    });
    await p.addInitScript(() => { sessionStorage.setItem("nutriva.kunci-ai", "kunci-palsu-uji"); });
    await p.goto(URL); await p.waitForSelector(".hp__isi"); await p.waitForTimeout(500);
    await p.evaluate(() => document.querySelector("[data-mulai-sendiri]").click()); await p.waitForTimeout(500);
    await p.evaluate(() => { location.hash = "#piring"; }); await p.waitForTimeout(1200);
    cek("S5 belum diisi: tidak ada tombol bisu", (await p.locator("[data-resep-buat]").count()) === 0);
    cek("S5 belum diisi: ada penjelasan dan jalan keluar", (await p.locator(".resep-ajak--tegak [data-ukuran-sesuai]").count()) > 0);
    await p.locator(".resep-ajak--tegak [data-ukuran-sesuai]").first().tap(); await p.waitForTimeout(500);
    await p.evaluate(() => { location.hash = "#piring"; }); await p.waitForSelector("[data-resep-buat]", { timeout: 8000 });
    await p.locator("[data-resep-buat]").first().scrollIntoViewIfNeeded();
    await p.locator("[data-resep-buat]").first().tap();
    await p.waitForSelector(".resep-detik", { timeout: 4000 });
    await p.waitForTimeout(2300);
    const detik = await p.locator(".resep-detik").first().innerText();
    cek("S5 penghitung detik berjalan", /^[1-9]\d* dtk$/.test(detik.trim()), detik);
    await p.waitForSelector(".resep-kartu img", { timeout: 15000 });
    cek("S5 setelah dikonfirmasi: resep dan gambar tampil", (await p.locator(".resep-kartu__isi.md").count()) === 1);
    await ctx.close();
  }

  // S6: teks AI sangat panjang tidak terpotong di PDF (dibagi antarhalaman dengan penanda lanjutan)
  {
    const LONG = (n) => Array.from({ length: n }, (_, i) => `Kalimat panjang nomor ${i + 1} tentang pertumbuhan anak dan pola makan beragam yang perlu dipantau setiap bulan di posyandu terdekat.`).join(" ");
    const PENJ = "### Ringkasan\n" + LONG(14) + "\n\n### Yang sudah baik\n" + Array.from({ length: 8 }, (_, i) => `- Poin ${i + 1} yang cukup panjang untuk membungkus ke beberapa baris pada halaman kertas.`).join("\n") + "\n\n### Langkah berikutnya\n" + LONG(10) + " AKHIRPENJELASAN";
    const RES = (u) => { const b = [...u.matchAll(/^- (.+): ([\d,]+) g$/gm)].map((m) => `- ${m[1]}: ${m[2]} g`).join("\n"); return `### Bubur\nEnak sekali.\n\n**Bahan**\n${b}\n\n**Langkah**\n` + Array.from({ length: 14 }, (_, i) => `${i + 1}. Langkah panjang nomor ${i + 1}: cuci, kukus, aduk perlahan, haluskan, lalu sajikan hangat.`).join("\n") + "\n\n**Tekstur dan penyajian**\n" + LONG(12) + " AKHIRRESEP"; };
    const t = await mulai(browser, async (route) => {
      const u = route.request().url();
      if (u.endsWith("/chat/completions")) {
        const sys = JSON.parse(route.request().postData()).messages[0].content;
        const isRes = /resep/i.test(sys.slice(0, 200));
        return js(route, 200, { choices: [{ message: { content: isRes ? RES(JSON.parse(route.request().postData()).messages[1].content) : PENJ }, finish_reason: "stop" }] });
      }
      if (u.endsWith("/images")) return js(route, 200, { data: [{ b64_json: PNG, media_type: "image/png" }] });
      return js(route, 200, {});
    });
    await t.p.evaluate(() => { location.hash = "#status"; }); await t.p.waitForSelector("[data-refresh-ai]");
    await t.p.locator("[data-refresh-ai]").first().click();
    await t.p.waitForFunction(() => /AKHIRPENJELASAN/.test(document.querySelector("[data-ai-teks]")?.innerText || ""), null, { timeout: 15000 });
    await t.p.evaluate(() => { location.hash = "#piring"; }); await t.p.waitForSelector("[data-resep-buat]");
    await t.p.locator("[data-resep-buat]").first().click();
    await t.p.waitForFunction(() => /AKHIRRESEP/.test(document.querySelector(".resep-kartu__isi")?.innerText || "") && document.querySelector(".resep-kartu img"), null, { timeout: 15000 });
    await t.p.evaluate(() => document.querySelector("[data-buka-ekspor]").click()); await t.p.waitForTimeout(600);
    await t.p.evaluate(() => document.querySelector("[data-eks-ultimate]").click());
    await t.p.waitForSelector("#pratinjau-ekspor .dok-hal", { timeout: 15000 }); await t.p.waitForTimeout(2000);
    const r = await t.p.evaluate(() => {
      const hal = [...document.querySelectorAll(".dok-hal")];
      const ov = hal.map((h) => { const bd = h.querySelector(".dok-hal__badan"); return bd ? bd.scrollHeight - bd.clientHeight : 0; }).filter((x) => x > 1);
      const semua = hal.map((h) => h.innerText).join("\n");
      const nomor = (pre) => new Set([...semua.matchAll(new RegExp(pre + " (\\d+)", "g"))].map((m) => m[1])).size;
      return { ov, penj: /AKHIRPENJELASAN/.test(semua), res: /AKHIRRESEP/.test(semua), lanjut: hal.filter((h) => h.querySelector(".dok-lanjut")).length, kal: nomor("Kalimat panjang nomor"), lng: nomor("Langkah panjang nomor") };
    });
    cek("S6 PDF: tidak ada halaman meluap", r.ov.length === 0, JSON.stringify(r.ov));
    cek("S6 PDF: akhir penjelasan dan resep AI ada", r.penj && r.res);
    cek("S6 PDF: semua 14 langkah dan 14 kalimat ada", r.lng === 14 && r.kal === 14, JSON.stringify(r));
    cek("S6 PDF: halaman lanjutan bertanda", r.lanjut >= 2, String(r.lanjut));
    await t.ctx.close();
  }

  await browser.close();
  console.log(`AI E2E: ${lulus} lulus, ${gagal} gagal`); cat.forEach((c) => console.log(c)); process.exit(gagal ? 1 : 0);
})();
