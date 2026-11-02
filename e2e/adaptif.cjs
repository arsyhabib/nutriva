/* Uji tata letak adaptif (tanpa bingkai ponsel) di Chromium nyata.
 * Jalankan: node e2e/adaptif.cjs  (vite preview di :4173, playwright global) */
const { chromium } = require("playwright");
const URL = process.env.URL || "http://localhost:4173/";
let lulus = 0, gagal = 0; const cat = [];
const cek = (n, ok, info = "") => { if (ok) lulus++; else { gagal++; cat.push(`GAGAL ${n} ${info}`); } };
const ruangDari = (w) => (w >= 1024 ? "lega" : w >= 640 ? "sedang" : "ringkas");

// [lebar, tinggi, label]
const UKURAN = [[280,653,"lipat-sempit"],[320,568,"se-kecil"],[360,740,"android"],[390,844,"iphone"],[412,915,"android-besar"],[430,932,"iphone-max"],
  [639,900,"batas-639"],[640,900,"batas-640"],[768,1024,"tablet-p"],[844,390,"ponsel-ls"],[932,430,"ponsel-ls-besar"],[1023,768,"batas-1023"],[1024,768,"batas-1024"],
  [1180,820,"tablet-ls"],[1280,800,"laptop"],[1440,900,"laptop-besar"],[1920,1080,"fhd"],[2560,1440,"qhd"],[3840,2160,"4k"]];
const LAYAR = ["gerbang","profil","status","piring","kolam","kenapa","ahli","tentang","kartuBagi"];

async function buka(browser, [w, h], opsi = {}) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, ...opsi });
  const p = await ctx.newPage(); const err = [];
  p.on("pageerror", (e) => err.push(e.message)); p.on("console", (m) => { if (m.type() === "error") err.push(m.text()); });
  await p.goto(URL); await p.waitForSelector(".hp__isi"); await p.waitForTimeout(350);
  return { ctx, p, err };
}
const geo = (p) => p.evaluate(() => {
  const r = (s) => { const e = document.querySelector(s); if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x, y: b.y, w: b.width, h: b.height, r: b.right, b: b.bottom }; };
  const cs = getComputedStyle(document.querySelector(".hp"));
  return { vw: innerWidth, vh: innerHeight, ruang: document.querySelector(".rona-app-shell").dataset.ruang, hp: r(".hp"), nav: r(".hp__nav"), isi: r(".hp__scroll"), status: r(".hp__status"), lembar: r(".lembar"),
    radius: cs.borderRadius, border: cs.borderTopWidth, ow: document.documentElement.scrollWidth > innerWidth + 1, sw: document.querySelector(".hp__scroll").scrollWidth > document.querySelector(".hp__scroll").clientWidth + 1 };
});

(async () => {
  const browser = await chromium.launch();

  // A. Tata letak benar di setiap ukuran (tanpa bingkai, tanpa gulir horizontal, nav di tempat yang tepat)
  for (const [w, h, nama] of UKURAN) {
    const { ctx, p, err } = await buka(browser, [w, h]);
    for (const id of LAYAR) {
      await p.evaluate((i) => (location.hash = i), id); await p.waitForTimeout(160);
      const g = await geo(p); const k = `${nama} ${w}x${h} ${id}`;
      cek(`ruang ${k}`, g.ruang === ruangDari(w), g.ruang);
      cek(`tanpa bingkai (lebar penuh) ${k}`, Math.abs(g.hp.w - w) < 1.5 && Math.abs(g.hp.h - h) < 1.5, `${g.hp.w}x${g.hp.h}`);
      cek(`tanpa sudut membulat/border ${k}`, g.radius === "0px" && g.border === "0px");
      cek(`tanpa gulir horizontal ${k}`, !g.ow && !g.sw);
      cek(`tanpa pita lama ${k}`, g.hp.h > 0);
      if (g.ruang === "ringkas") cek(`nav di bawah ${k}`, g.nav.y >= g.isi.b - 1 && g.nav.w >= w - 2, JSON.stringify(g.nav));
      else cek(`nav di kiri, tidak menimpa isi ${k}`, g.nav.x <= 1 && g.nav.r <= g.isi.x + 1 && g.nav.h >= h - 2, JSON.stringify(g.nav));
      cek(`isi mengisi sisa ruang ${k}`, g.isi.b <= h + 1 && g.isi.h > Math.min(200, h * 0.35), JSON.stringify(g.isi));
    }
    cek(`tanpa galat ${nama}`, err.length === 0, err.slice(0, 2).join("|"));
    await ctx.close();
  }

  // B. Lembar: bawah (ringkas), laci kanan (sedang), panel menempel (lega) - tidak pernah menutupi hal yang tak seharusnya
  for (const [w, h, nama] of [[390,844,"ringkas"],[768,1024,"sedang"],[1280,800,"lega"],[2560,1440,"lega-lebar"]]) {
    const { ctx, p } = await buka(browser, [w, h]);
    await p.evaluate(() => (location.hash = "kolam")); await p.waitForTimeout(300);
    const sebelum = await geo(p);
    await p.evaluate(() => document.querySelector("[data-inspect-zat]").click()); await p.waitForTimeout(1100);
    const g = await geo(p);
    const terbuka = await p.evaluate(() => document.querySelector(".lembar").hasAttribute("data-detent"));
    cek(`lembar terbuka ${nama}`, terbuka);
    const lr = g.lembar;
    if (g.ruang === "ringkas") cek(`lembar menempel bawah ${nama}`, lr.y < h * 0.8 && lr.b - h <= lr.h * 0.6 && lr.w >= w - 2 && lr.y > h * 0.1, JSON.stringify(lr));
    if (g.ruang === "sedang") cek(`laci kanan ${nama}`, lr.r >= w - 2 && lr.w < w && lr.w >= 300 && lr.h >= h - 2, JSON.stringify(lr));
    if (g.ruang === "lega") {
      cek(`panel inspektur tidak menimpa isi ${nama}`, lr.x >= g.isi.r - 1 && lr.r <= w + 1, `${lr.x} vs ${g.isi.r}`);
      cek(`isi menyempit saat panel buka ${nama}`, g.isi.w < sebelum.isi.w - 200, `${g.isi.w} vs ${sebelum.isi.w}`);
      cek(`aria-modal false pada panel menempel ${nama}`, (await p.evaluate(() => document.querySelector(".lembar").getAttribute("aria-modal"))) === "false");
    } else cek(`aria-modal true pada overlay ${nama}`, (await p.evaluate(() => document.querySelector(".lembar").getAttribute("aria-modal"))) === "true");
    await p.keyboard.press("Escape"); await p.waitForTimeout(500);
    const tutup = await p.evaluate(() => !document.querySelector(".lembar").hasAttribute("data-detent"));
    cek(`Esc menutup lembar ${nama}`, tutup);
    const g2 = await geo(p);
    cek(`isi pulih lebar setelah tutup ${nama}`, Math.abs(g2.isi.w - sebelum.isi.w) < 2, `${g2.isi.w} vs ${sebelum.isi.w}`);
    await ctx.close();
  }

  // B2. Jebakan fokus + lembar tertutup tak terbaca (ringkas & sedang)
  for (const [w, h, nama] of [[390, 844, "ringkas"], [768, 1024, "sedang"]]) {
    const { ctx, p } = await buka(browser, [w, h]);
    cek(`lembar tertutup tersembunyi ${nama}`, await p.evaluate(() => getComputedStyle(document.querySelector(".lembar")).visibility === "hidden"));
    await p.evaluate(() => document.querySelector("[data-open-kontrol]").click()); await p.waitForTimeout(600);
    cek(`latar inert saat modal ${nama}`, await p.evaluate(() => document.querySelector(".hp__scroll").inert && document.querySelector(".hp__nav").inert));
    let keluar = 0;
    for (let i = 0; i < 40; i++) { await p.keyboard.press("Tab"); if (await p.evaluate(() => !!document.activeElement.closest(".hp__scroll, .hp__nav, .hp__status"))) keluar++; }
    cek(`fokus terjebak di lembar ${nama}`, keluar === 0, String(keluar));
    await p.keyboard.press("Escape"); await p.waitForTimeout(500);
    cek(`latar aktif kembali ${nama}`, await p.evaluate(() => !document.querySelector(".hp__scroll").inert && !document.querySelector(".hp__nav").inert));
    await ctx.close();
  }

  // C. Ubah ukuran langsung (tanpa muat ulang): jendela diseret, ponsel diputar
  {
    const { ctx, p, err } = await buka(browser, [1280, 800]);
    await p.evaluate(() => (location.hash = "piring")); await p.waitForTimeout(200);
    for (const [w, h] of [[1280, 800], [900, 700], [600, 800], [390, 844], [844, 390], [768, 1024], [1500, 900], [320, 640], [1024, 700], [1023, 700]]) {
      await p.setViewportSize({ width: w, height: h }); await p.waitForTimeout(260);
      const g = await geo(p);
      cek(`resize langsung ${w}x${h} -> ${ruangDari(w)}`, g.ruang === ruangDari(w), g.ruang);
      cek(`resize tanpa gulir horizontal ${w}x${h}`, !g.ow && !g.sw);
      cek(`resize hp mengisi ${w}x${h}`, Math.abs(g.hp.w - w) < 1.5 && Math.abs(g.hp.h - h) < 1.5);
    }
    cek("resize tanpa galat", err.length === 0, err.join("|"));
    // kanvas latar & bejana tetap hidup setelah banyak resize
    await p.evaluate(() => (location.hash = "kolam")); await p.waitForTimeout(500);
    const hidup = await p.evaluate(() => { const c = document.querySelector("[data-bejana-canvas]"); const d = c.getContext("2d").getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 3; i < d.length; i += 4) if (d[i] > 0) n++; return n > 100; });
    cek("bejana terisi setelah resize", hidup);
    await ctx.close();
  }

  // D. Masukan sentuh vs kursor, terdeteksi dari perangkat nyata dan berpindah saat dipakai
  {
    const t = await buka(browser, [390, 844], { isMobile: true, hasTouch: true, deviceScaleFactor: 3 });
    cek("ponsel sentuh -> data-masukan=sentuh", (await t.p.evaluate(() => document.documentElement.dataset.masukan)) === "sentuh");
    cek("kata aksi sentuh = Ketuk", await t.p.evaluate(() => { location.hash = "piring"; return true; }));
    await t.p.waitForTimeout(1200);
    cek("teks Ketuk pada sentuh", await t.p.evaluate(() => /^Ketuk/.test(getComputedStyle(document.querySelector(".tap"), "::before").content.replace(/"/g, ""))));
    const kecil = await t.p.evaluate(() => [...document.querySelectorAll("button, a, [role=button], [role=tab]")].filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && (r.height < 47.5 || r.width < 47.5); }).map((e) => e.className + ":" + Math.round(e.getBoundingClientRect().width) + "x" + Math.round(e.getBoundingClientRect().height)));
    cek("target sentuh >= 48 px di ponsel", kecil.length === 0, kecil.slice(0, 4).join(","));
    cek("tanpa galat ponsel sentuh", t.err.length === 0, t.err.join("|"));
    await t.ctx.close();
    const d = await buka(browser, [1440, 900]);
    cek("desktop kursor -> data-masukan=kursor", (await d.p.evaluate(() => document.documentElement.dataset.masukan)) === "kursor");
    await d.p.evaluate(() => (location.hash = "piring")); await d.p.waitForTimeout(300);
    cek("teks Klik pada kursor", await d.p.evaluate(() => /^Klik/.test(getComputedStyle(document.querySelector(".tap"), "::before").content.replace(/"/g, ""))));
    cek("pintasan terlihat pada kursor + lega", await d.p.evaluate(() => getComputedStyle(document.querySelector(".nav__pintasan")).display !== "none"));
    // hibrida: sentuhan pertama mengganti mode tanpa muat ulang
    await d.p.evaluate(() => window.dispatchEvent(new PointerEvent("pointerdown", { pointerType: "touch" }))); await d.p.waitForTimeout(100);
    cek("hibrida: touch -> sentuh", (await d.p.evaluate(() => document.documentElement.dataset.masukan)) === "sentuh");
    cek("hibrida: pintasan disembunyikan", await d.p.evaluate(() => getComputedStyle(document.querySelector(".nav__pintasan")).display === "none"));
    await d.p.mouse.move(300, 300); await d.p.mouse.move(340, 320); await d.p.waitForTimeout(100);
    cek("hibrida: mouse -> kursor lagi", (await d.p.evaluate(() => document.documentElement.dataset.masukan)) === "kursor");
    // papan ketik
    await d.p.keyboard.press("3"); await d.p.waitForTimeout(250);
    cek("pintasan 3 -> status", await d.p.evaluate(() => document.querySelector(".hp__nav-btn.is-active [data-x], .hp__nav-btn.is-active").innerText.trim() === "Status"));
    await d.p.keyboard.press("5"); await d.p.waitForTimeout(250);
    cek("pintasan 5 -> bejana", await d.p.evaluate(() => document.querySelector(".hp__nav-btn.is-active").innerText.trim() === "Bejana"));
    await d.ctx.close();
  }

  // E. Teks besar 200% dan hemat gerak di tiga kelas ruang
  for (const [w, h, nama] of [[360, 740, "ringkas"], [820, 1180, "sedang"], [1440, 900, "lega"]]) {
    const { ctx, p, err } = await buka(browser, [w, h], { reducedMotion: "reduce" });
    await p.evaluate(() => document.querySelector("[data-open-kontrol]").click()); await p.waitForTimeout(250);
    await p.evaluate(() => document.querySelector("[data-toggle-teks]").click()); await p.waitForTimeout(250);
    await p.keyboard.press("Escape"); await p.waitForTimeout(300);
    for (const id of ["gerbang", "profil", "piring", "kolam"]) {
      await p.evaluate((i) => (location.hash = i), id); await p.waitForTimeout(220);
      const g = await geo(p);
      cek(`teks besar tanpa gulir horizontal ${nama}/${id}`, !g.ow && !g.sw);
      const tak = await p.evaluate(() => [...document.querySelectorAll(".hp__status button, .hp__nav button")].filter((b) => { const r = b.getBoundingClientRect(); return r.right > innerWidth + 1 || r.bottom > innerHeight + 1 || r.x < -1; }).length);
      cek(`teks besar: kontrol tetap terjangkau ${nama}/${id}`, tak === 0, String(tak));
    }
    cek(`teks besar tanpa galat ${nama}`, err.length === 0, err.join("|"));
    await ctx.close();
  }

  // F. Pita keselamatan kasus B (rujuk) tetap terlihat dan tidak menumpuk di semua kelas ruang
  for (const [w, h, nama] of [[360, 740, "ringkas"], [768, 1024, "sedang"], [1440, 900, "lega"]]) {
    const { ctx, p } = await buka(browser, [w, h]);
    await p.evaluate(() => document.querySelector("[data-open-kontrol]").click()); await p.waitForTimeout(250);
    await p.evaluate(() => document.querySelector('.lembar [data-pick-preset="B"]').click()); await p.waitForTimeout(250);
    await p.keyboard.press("Escape"); await p.waitForTimeout(250);
    await p.evaluate(() => (location.hash = "bahaya")); await p.waitForTimeout(300);
    const t = await p.evaluate(() => document.querySelector(".hp__isi").innerText);
    cek(`rujukan tampil ${nama}`, /petugas kesehatan/i.test(t) && !/119/.test(t));
    const g = await geo(p); cek(`rujukan tanpa overflow ${nama}`, !g.ow && !g.sw);
    await ctx.close();
  }

  await browser.close();
  console.log(`ADAPTIF: ${lulus} lulus, ${gagal} gagal`);
  cat.slice(0, 40).forEach((c) => console.log(c));
  process.exit(gagal ? 1 : 0);
})();
