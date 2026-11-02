/* Uji asap (smoke) & e2e NUTRIVA di Chromium nyata.
 * Jalankan: npm run build && npx vite preview --port 4173  (terminal lain), lalu: node e2e/smoke.cjs
 * Perlu paket playwright terpasang secara global (tidak menjadi dependensi proyek).
 * Variabel: URL (default http://localhost:4173/) */
const { chromium } = require("playwright");
const URL = process.env.URL || "http://localhost:4173/";
let lulus = 0, gagal = 0; const catatan = [];
function cek(nama, ok, info = "") { if (ok) lulus++; else { gagal++; catatan.push(`GAGAL ${nama} ${info}`); } }

const LAYAR = ["gerbang","profil","status","piring","kolam","kenapa","ahli","bahaya","tentang","kartuBagi","kosong","memuat","luring","kedaluwarsa","galat","tidakLayak","dataTidakAda","hapus"];
const VIEWPORT = [[360,740],[390,844],[412,915],[768,1024],[1280,800]];

async function buka(browser, [w, h], opsi = {}) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, ...opsi });
  const p = await ctx.newPage(); const err = [];
  p.on("pageerror", (e) => err.push("pageerror: " + e.message));
  p.on("console", (m) => { if (m.type() === "error") err.push("console: " + m.text()); });
  await p.goto(URL); await p.waitForSelector(".hp__scroll"); await p.waitForTimeout(300);
  return { ctx, p, err };
}
const sheetBuka = (p) => p.evaluate(() => document.querySelector(".lembar").hasAttribute("data-detent"));
async function pastikanSheet(p) { if (!(await sheetBuka(p))) { await p.evaluate(() => document.querySelector("[data-open-kontrol]").click()); await p.waitForTimeout(120); } }
async function tutupSheet(p) { if (await sheetBuka(p)) { await p.evaluate(() => document.querySelector(".lembar-backdrop").click()); await p.waitForTimeout(100); } }
async function atur(p, sel) { await pastikanSheet(p); await p.evaluate((s) => document.querySelector(`.lembar ${s}`).click(), sel); await p.waitForTimeout(120); }
const ke = async (p, id) => {
  await tutupSheet(p);
  const ada = await p.evaluate((i) => { const e = document.querySelector(`.hp__nav [data-go="${i}"], .hp__scroll [data-go="${i}"]`); if (e) { e.click(); return true; } return false; }, id);
  if (!ada) { await p.evaluate((i) => { window.location.hash = ""; window.location.hash = "#" + i; }, id); }
  await p.waitForTimeout(120);
};

(async () => {
  const browser = await chromium.launch();

  // 1. Matriks: kasus × tema × viewport × layar-utama
  for (const vp of VIEWPORT) {
    const { ctx, p, err } = await buka(browser, vp);
    for (const preset of ["A", "B", "C"]) {
      await atur(p, `[data-pick-preset="${preset}"]`);
      for (const tema of ["fajar","dekap","terik","lensa"]) {
        await atur(p, `[data-pick-theme="${tema}"]`);
        for (const id of ["gerbang","profil","status","piring","kolam","kenapa","ahli","bahaya","tentang"]) {
          await ke(p, id);
          const m = await p.evaluate(() => {
            const sc = document.querySelector(".hp__scroll");
            const lbl = document.querySelector(".pita-kejujuran")?.textContent || "";
            return { ow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1, sw: sc.scrollWidth > sc.clientWidth + 1, lbl, tema: document.documentElement.getAttribute("data-theme") };
          });
          const k = `${vp[0]}x${vp[1]} ${preset}/${tema}/${id}`;
          cek(`tanpa gulir horizontal ${k}`, !m.ow && !m.sw);
          cek(`label prototipe ${k}`, /Prototipe PjBL/.test(m.lbl));
          cek(`tema terpasang ${k}`, m.tema === tema);
        }
      }
    }
    cek(`tanpa galat konsol/halaman ${vp.join("x")}`, err.length === 0, err.slice(0, 3).join(" | "));
    await ctx.close();
  }

  // 2. Semua 18 layar & keadaan khusus dapat dibuka
  {
    const { ctx, p, err } = await buka(browser, [390, 844]);
    for (const id of LAYAR) {
      await ke(p, id);
      const teks = await p.evaluate(() => document.querySelector(".hp__scroll").innerText.trim().length);
      cek(`layar ${id} tidak kosong`, teks > 20, String(teks));
    }
    cek("18 layar tanpa galat", err.length === 0, err.join(" | "));
    await ctx.close();
  }

  // 3. Target sentuh >= 48 px dan tidak ada tombol tanpa nama
  {
    const { ctx, p } = await buka(browser, [360, 740]);
    for (const id of ["gerbang","profil","status","piring","kolam","tentang"]) {
      await ke(p, id); await p.waitForTimeout(900);
      const kecil = await p.evaluate(() => [...document.querySelectorAll(".hp button, .hp a, .hp [role=tab]")].filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && (r.height < 47.5 || r.width < 47.5); }).map((e) => (e.getAttribute("data-go") || e.className || e.tagName) + ":" + Math.round(e.getBoundingClientRect().width) + "x" + Math.round(e.getBoundingClientRect().height)));
      cek(`target sentuh ${id}`, kecil.length === 0, kecil.slice(0, 4).join(","));
      const tanpaNama = await p.evaluate(() => [...document.querySelectorAll(".hp button")].filter((b) => !(b.innerText || b.getAttribute("aria-label") || "").trim()).length);
      cek(`tombol bernama ${id}`, tanpaNama === 0, String(tanpaNama));
    }
    await ctx.close();
  }

  // 4. Bejana: hidup, tidak macet, tahan CPU lambat (regresi glitch NaN)
  {
    const { ctx, p, err } = await buka(browser, [390, 844]);
    await ke(p, "kolam"); await p.waitForTimeout(600);
    const cdp = await ctx.newCDPSession(p);
    for (const laju of [1, 4, 8]) {
      await cdp.send("Emulation.setCPUThrottlingRate", { rate: laju });
      await p.waitForTimeout(1200);
      const h = async () => p.evaluate(() => { const c = document.querySelector("[data-bejana-canvas]"); const x = c.getContext("2d"); const d = x.getImageData(0, 0, c.width, c.height).data; let s = 0, n = 0; for (let i = 3; i < d.length; i += 4) { if (d[i] > 0) n++; s = (s * 31 + d[i - 3] + d[i - 1]) >>> 0; } return { s, n }; });
      const a = await h(); await p.waitForTimeout(500); const b = await h();
      cek(`bejana terisi (CPU×${laju})`, a.n > 100, JSON.stringify(a));
      cek(`bejana beranimasi (CPU×${laju})`, a.s !== b.s);
    }
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 1 });
    cek("bejana tanpa galat", err.length === 0, err.join("|"));
    // interaksi sentuh pada permukaan
    const box = await (await p.$("[data-bejana-canvas]")).boundingBox();
    await p.mouse.move(box.x + 20, box.y + box.height / 2); await p.mouse.move(box.x + box.width - 20, box.y + box.height / 2, { steps: 12 });
    await p.waitForTimeout(400);
    cek("bejana tahan usapan", (await p.evaluate(() => !!document.querySelector("[data-bejana-canvas]"))) && err.length === 0);
    await ctx.close();
  }

  // 5. Kerangka & latar persisten saat state berubah di layar yang sama (tanpa kedip)
  {
    const { ctx, p } = await buka(browser, [390, 844]);
    await ke(p, "piring");
    await p.evaluate(() => { window.__s = document.querySelector("#rona-hp-sutra"); window.__h = document.querySelector(".hp"); });
    await p.evaluate(() => document.querySelector("[data-pick-hari='1']").click()); await p.waitForTimeout(150);
    await p.evaluate(() => document.querySelector("[data-pick-hari='2']").click()); await p.waitForTimeout(150);
    const sama = await p.evaluate(() => window.__s === document.querySelector("#rona-hp-sutra") && window.__h === document.querySelector(".hp"));
    cek("kanvas latar & kerangka tidak dibuat ulang", sama);
    await p.evaluate(() => { const s = document.querySelector(".hp__scroll"); s.scrollTop = 300; });
    await p.evaluate(() => document.querySelector("[data-pick-hari='0']").click()); await p.waitForTimeout(150);
    cek("posisi gulir dipertahankan di layar yang sama", (await p.evaluate(() => document.querySelector(".hp__scroll").scrollTop)) > 100);
    await ctx.close();
  }

  // 6. Interaksi inti
  {
    const { ctx, p, err } = await buka(browser, [390, 844]);
    await ke(p, "piring");
    await p.evaluate(() => document.querySelector("[data-inspect-bahan]").click()); await p.waitForTimeout(200);
    cek("lembar inspeksi bahan terbuka", await p.evaluate(() => /Inspeksi/i.test(document.querySelector(".lembar").innerText)));
    await p.evaluate(() => document.querySelector(".lembar .btn, .lembar [data-close-sheet]").click()); await p.waitForTimeout(150);
    cek("lembar menutup", await p.evaluate(() => !document.querySelector(".lembar").hasAttribute("data-detent")));
    await p.evaluate(() => document.querySelector("[data-cycle-benih]").click()); await p.waitForTimeout(150);
    await ke(p, "kolam");
    await p.evaluate(() => document.querySelector("[data-inspect-zat]").click()); await p.waitForTimeout(200);
    cek("lembar penyumbang zat terbuka", await p.evaluate(() => document.querySelector(".lembar").hasAttribute("data-detent")));
    await p.evaluate(() => document.querySelector("[data-open-kontrol]").click()); await p.waitForTimeout(150);
    await p.mouse.click(180, 40); await p.waitForTimeout(200);
    cek("ketuk latar menutup pengaturan", await p.evaluate(() => !document.querySelector(".lembar").hasAttribute("data-detent")));
    // masukan di luar rentang ditolak
    await ke(p, "profil");
    await p.fill("#inp-bb", "999"); await p.dispatchEvent("#inp-bb", "change"); await p.waitForTimeout(150);
    cek("BB 999 ditolak", await p.evaluate(() => document.querySelector("#inp-bb").value !== "999"));
    await p.fill("#inp-bb", "9,5"); await p.dispatchEvent("#inp-bb", "change"); await p.waitForTimeout(150);
    cek("koma desimal diterima", await p.evaluate(() => document.querySelector("#inp-bb").value === "9,5"));
    // pengaturan: teks besar & tema
    await p.evaluate(() => document.querySelector("[data-open-kontrol]").click()); await p.waitForTimeout(150);
    await p.evaluate(() => document.querySelector("[data-toggle-teks]").click()); await p.waitForTimeout(100);
    cek("teks besar aktif", await p.evaluate(() => document.documentElement.getAttribute("data-zoom") === "200"));
    await p.evaluate(() => document.querySelector("[data-toggle-teks]").click());
    await p.evaluate(() => document.querySelector("[data-pick-motion='hemat']").click()); await p.waitForTimeout(100);
    cek("tanpa galat setelah hemat gerak", err.length === 0, err.join("|"));
    // Kasus B: gerbang keselamatan
    await p.evaluate(() => document.querySelector("[data-pick-preset='B']").click()); await p.waitForTimeout(150);
    await p.evaluate(() => document.querySelector(".lembar-backdrop").click());
    await ke(p, "piring");
    const t = await p.evaluate(() => document.querySelector(".hp__scroll").innerText);
    cek("kasus B menghentikan menu", /Dihentikan Sementara/i.test(t) && !/Daftar Belanja/.test(t));
    await ke(p, "bahaya");
    const t2 = await p.evaluate(() => document.querySelector(".hp__scroll").innerText);
    cek("rujukan tanpa nomor/saran karangan", !/119|Pertolongan Pertama/.test(t2) && /petugas kesehatan/i.test(t2));
    await ctx.close();
  }

  // 7. Luring: setelah dimuat sekali, muat ulang tanpa jaringan tetap berjalan
  {
    const { ctx, p } = await buka(browser, [390, 844]);
    await p.waitForTimeout(1500);
    const sw = await p.evaluate(async () => { const r = await navigator.serviceWorker.getRegistration(); return !!r; });
    cek("service worker terdaftar", sw);
    await p.evaluate(async () => { await navigator.serviceWorker.ready; });
    await p.waitForTimeout(1500);
    await ctx.setOffline(true);
    await p.reload(); await p.waitForSelector(".hp__scroll", { timeout: 8000 }).catch(() => {});
    const ada = await p.evaluate(() => !!document.querySelector(".hp__scroll") && document.fonts.check('16px "Plus Jakarta Sans"'));
    cek("muat ulang luring berhasil dengan font", ada);
    await ke(p, "kolam");
    cek("hitung ulang luring", await p.evaluate(() => document.querySelectorAll("[data-bejana-canvas]").length >= 4));
    await ctx.close();
  }

  // 8. Tahan pakai: 200 perpindahan acak tanpa galat & tanpa penumpukan simpul
  {
    const { ctx, p, err } = await buka(browser, [390, 844]);
    for (let i = 0; i < 200; i++) await p.evaluate((i) => { const b = [...document.querySelectorAll(".hp [data-go], .hp [data-pick-hari], .hp [data-toggle-asi]")]; if (b.length) b[(i * 7) % b.length].click(); }, i);
    await p.waitForTimeout(300);
    const nSimpul = await p.evaluate(() => document.querySelectorAll("*").length);
    cek("tanpa galat setelah 200 aksi", err.length === 0, err.slice(0, 2).join("|"));
    cek("jumlah simpul DOM wajar", nSimpul < 2500, String(nSimpul));
    await ctx.close();
  }

  await browser.close();
  console.log(`E2E: ${lulus} lulus, ${gagal} gagal`);
  catatan.slice(0, 40).forEach((c) => console.log(c));
  process.exit(gagal ? 1 : 0);
})();
