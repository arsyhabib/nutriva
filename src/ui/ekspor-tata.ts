import { LOGO_DOK, UKURAN_KERTAS, e, type Blok, type OpsiEkspor } from "./ekspor";

/**
 * Mesin tata letak halaman. Konten diukur di DOM sebenarnya pada lebar kertas tetap (mm), lalu dibagi ke halaman:
 * judul selalu ikut blok sesudahnya, tabel terbelah per baris dengan kepala berulang, kartu tidak pernah terpotong.
 * Karena ukuran halaman tetap, hasilnya sama di ponsel, tablet, maupun komputer.
 */
export interface MetaTata {
  judul: string;
  label: string;
  tanggal: string;
}

export interface HasilTata {
  dok: HTMLElement;
  jumlah: number;
}

function buatHalaman(meta: MetaTata, kelas = "", polos = false): { hal: HTMLElement; badan: HTMLElement } {
  const hal = document.createElement("section");
  hal.className = `dok-hal ${kelas}`.trim();
  hal.innerHTML = polos
    ? `<div class="dok-hal__badan"></div>`
    : `<header class="dok-hal__kepala"><span class="dok-hal__logo">${LOGO_DOK}</span><span class="dok-hal__merek">NUTRIVA</span><span class="dok-hal__judul">${e(meta.judul)} · ${e(meta.label)}</span><span class="dok-hal__tgl">${e(meta.tanggal)}</span></header>
       <div class="dok-hal__badan"></div>
       <footer class="dok-hal__kaki"><span>Alat bantu edukasi, bukan diagnosis</span><span class="dok-penulis">E.13.1 feat H.A.te</span><span class="dok-hal__no"></span></footer>`;
  return { hal, badan: hal.querySelector(".dok-hal__badan") as HTMLElement };
}

const meluap = (badan: HTMLElement): boolean => badan.scrollHeight > badan.clientHeight + 0.5;

export async function tataDokumen(blok: Blok[], opsi: OpsiEkspor, meta: MetaTata): Promise<HasilTata> {
  try { await (document as Document & { fonts?: { ready: Promise<unknown> } }).fonts?.ready; } catch { /* font tak tersedia */ }
  const uk = UKURAN_KERTAS[opsi.kertas];
  const dok = document.createElement("div");
  dok.className = `dok${opsi.hemat ? " dok--hemat" : ""}${opsi.padat ? " dok--padat" : ""}`;
  dok.dataset.kertas = opsi.kertas;
  dok.style.setProperty("--hal-l", `${uk.l}mm`);
  dok.style.setProperty("--hal-t", `${uk.t}mm`);
  // Ukur di wadah tak terlihat pada lebar yang sama dengan hasil akhir.
  const wadah = document.createElement("div");
  wadah.setAttribute("aria-hidden", "true");
  wadah.style.cssText = "position:fixed;left:-20000px;top:0;visibility:hidden;pointer-events:none;";
  wadah.appendChild(dok);
  document.body.appendChild(wadah);

  type Pagina = { hal: HTMLElement; badan: HTMLElement };
  const halaman: HTMLElement[] = [];
  const halamanDari = new Map<string, number>();
  const S: { cur: Pagina | null } = { cur: null };
  let kepala: Blok[] = [];

  const baru = (kelas = "", polos = false): Pagina => {
    const h = buatHalaman(meta, kelas, polos);
    dok.appendChild(h.hal);
    halaman.push(h.hal);
    S.cur = h;
    return h;
  };
  const aktif = (): Pagina => S.cur ?? baru();
  const catatRef = (b: Blok): void => {
    if ("ref" in b && b.ref && !halamanDari.has(b.ref)) halamanDari.set(b.ref, halaman.length);
  };
  const el = (html: string): HTMLElement => {
    const t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstElementChild as HTMLElement;
  };
  const elemenKepala = (): HTMLElement[] => kepala.map((x) => el((x as Extract<Blok, { k: "alir" }>).html));

  /** Tambahkan beberapa elemen sekaligus; bila meluap, batalkan dan kembalikan false. */
  const coba = (badan: HTMLElement, elemen: HTMLElement[]): boolean => {
    for (const x of elemen) badan.appendChild(x);
    if (meluap(badan)) {
      for (const x of elemen) x.remove();
      return false;
    }
    return true;
  };

  const sisaRuang = (badan: HTMLElement): number => {
    let pakai = 0;
    for (const c of Array.from(badan.children) as HTMLElement[]) pakai = Math.max(pakai, c.offsetTop + c.offsetHeight);
    return Math.max(0, 1 - pakai / Math.max(1, badan.clientHeight));
  };

  for (const b of blok) {
    if (b.k === "halaman") {
      kepala = [];
      const h = baru(b.kelas, b.polos === true);
      h.badan.appendChild(el(b.html));
      catatRef(b);
      S.cur = null;
      continue;
    }
    if (b.k === "baru") {
      const c = S.cur;
      if (c && c.badan.children.length && (b.sisaMin === undefined || sisaRuang(c.badan) < b.sisaMin)) S.cur = null;
      continue;
    }
    // judul (jaga) menempel pada blok sesudahnya
    if (b.k === "alir" && b.jaga) { kepala.push(b); continue; }

    if (b.k === "alir") {
      const buat = (): HTMLElement[] => [...elemenKepala(), el(b.html)];
      let h = aktif();
      if (!coba(h.badan, buat())) {
        h = baru();
        // lebih besar dari satu halaman: tetap dipasang (terpotong aman) agar tidak berputar tanpa akhir
        if (!coba(h.badan, buat())) for (const x of buat()) h.badan.appendChild(x);
      }
      kepala.forEach(catatRef);
      catatRef(b);
      kepala = [];
      continue;
    }

    // tabel: terbelah per baris, kepala berulang di halaman lanjutan, minimal dua baris per potongan
    let idx = 0;
    let pertama = true;
    while (idx < b.baris.length) {
      const h = aktif();
      const kep = pertama ? elemenKepala() : [];
      const tbl = el(`<table class="${e(b.kelas)}${pertama ? "" : " dok-tabel--lanjut"}"><thead>${b.kepala}</thead><tbody></tbody></table>`);
      const tbody = tbl.querySelector("tbody") as HTMLElement;
      for (const x of kep) h.badan.appendChild(x);
      h.badan.appendChild(tbl);
      const kosongSebelum = h.badan.children.length === kep.length + 1;
      let masuk = 0;
      while (idx + masuk < b.baris.length) {
        tbody.insertAdjacentHTML("beforeend", b.baris[idx + masuk]!);
        if (meluap(h.badan)) { tbody.lastElementChild?.remove(); break; }
        masuk++;
      }
      const perlu = Math.min(2, b.baris.length - idx);
      if (masuk < perlu && !kosongSebelum) {
        for (const x of kep) x.remove();
        tbl.remove();
        S.cur = null;
        continue;
      }
      if (masuk === 0) { tbody.insertAdjacentHTML("beforeend", b.baris[idx]!); masuk = 1; } // halaman kosong pun tak muat: paksa satu baris
      idx += masuk;
      if (pertama) kepala.forEach(catatRef);
      catatRef(b);
      pertama = false;
      if (idx < b.baris.length) S.cur = null;
    }
    kepala = [];
  }
  if (kepala.length) {
    const h = aktif();
    for (const x of elemenKepala()) h.badan.appendChild(x);
  }
  if (halaman.length === 0) {
    const h = baru();
    h.badan.appendChild(el(`<p class="dok-kosong">Tidak ada bagian yang dipilih.</p>`));
  }

  const n = halaman.length;
  halaman.forEach((h, i) => {
    h.dataset.no = String(i + 1);
    const no = h.querySelector(".dok-hal__no");
    if (no) no.textContent = `Hal. ${i + 1} / ${n}`;
  });
  dok.querySelectorAll<HTMLElement>("[data-toc]").forEach((li) => {
    const w = halamanDari.get(li.dataset.toc ?? "");
    const t = li.querySelector(".dok-toc__hal");
    if (t) t.textContent = w ? String(w) : "";
  });

  wadah.remove();
  return { dok, jumlah: n };
}
