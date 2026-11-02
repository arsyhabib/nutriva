/**
 * Mesin render Markdown aman untuk teks AI. Fungsi murni, tanpa DOM, tanpa dependensi.
 * Semua teks di-escape; HTML mentah tidak pernah diteruskan. Tautan hanya http, https, mailto.
 *
 * Mendukung ragam format ala pengolah kata:
 *  - blok: judul (#, setext), paragraf, garis pemisah, kutipan bersarang, kotak catatan [!NOTE]/[!TIP]/[!WARNING]/[!IMPORTANT]/[!CAUTION],
 *    daftar poin/bernomor bersarang (nomor awal dihormati), daftar centang, tabel dengan perataan kolom, blok kode berpagar
 *  - inline: tebal, miring, tebal-miring, coret (~~), sorot (==), garis bawah (++), pangkat (^x^), indeks (~x~), kode, tautan, tautan otomatis,
 *    escape dengan backslash, pindah baris keras
 */

export type Inline =
  | { t: "teks"; v: string }
  | { t: "kode"; v: string }
  | { t: "br" }
  | { t: "tebal" | "miring" | "coret" | "sorot" | "garis" | "pangkat" | "indeks"; c: Inline[] }
  | { t: "tautan"; href: string; judul?: string; c: Inline[] };

export type Rata = "kiri" | "tengah" | "kanan" | null;
export type Blok =
  | { t: "judul"; n: 1 | 2 | 3 | 4 | 5 | 6; c: Inline[] }
  | { t: "para"; c: Inline[] }
  | { t: "garis" }
  | { t: "kutipan"; c: Blok[]; kotak?: "NOTE" | "TIP" | "WARNING" | "IMPORTANT" | "CAUTION" }
  | { t: "daftar"; urut: boolean; mulai: number; butir: { centang: boolean | null; c: Blok[] }[] }
  | { t: "tabel"; rata: Rata[]; kepala: Inline[][]; baris: Inline[][][] }
  | { t: "kode"; bahasa: string; v: string };

// klaim: n/a — batas rekayasa agar masukan sangat besar/bersarang dalam tidak membebani peramban
const MAKS_PANJANG = 20_000;
const MAKS_DALAM = 8;

const RE_URL_BOLEH = /^(?:https?:\/\/|mailto:)[^\s<>"'`]+$/i;

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

/* ------------------------------ inline ------------------------------ */

const ESCAPABLE = "\\`*_{}[]()#+-.!|~^=<>:\"'&/";

function cariPenutup(s: string, mulai: number, tanda: string): number {
  const batas = Math.min(s.length, mulai + 2000); // jendela terbatas: cegah biaya kuadratik pada penanda tak berpasangan
  for (let i = mulai; i < batas; i++) {
    const c = s[i];
    if (c === "\\") { i++; continue; }
    if (c === "`") {
      const m = /^`+/.exec(s.slice(i));
      const n = m ? m[0].length : 1;
      const tutup = s.indexOf("`".repeat(n), i + n);
      if (tutup >= 0) { i = tutup + n - 1; continue; }
    }
    if (s.startsWith(tanda, i)) {
      const sebelum = s[i - 1] ?? "";
      if (i > mulai && !/\s/.test(sebelum)) return i;
    }
  }
  return -1;
}

export function parseInline(src: string, dalam = 0): Inline[] {
  const hasil: Inline[] = [];
  let buf = "";
  const dorong = (): void => { if (buf) { hasil.push({ t: "teks", v: buf }); buf = ""; } };
  if (dalam > MAKS_DALAM) return [{ t: "teks", v: src }];
  const s = src;
  let i = 0;
  const kata = (c: string | undefined): boolean => c !== undefined && /[\p{L}\p{N}]/u.test(c);

  while (i < s.length) {
    const c = s[i] as string;

    if (c === "\\") {
      const nx = s[i + 1];
      if (nx === "\n") { dorong(); hasil.push({ t: "br" }); i += 2; continue; }
      if (nx !== undefined && ESCAPABLE.includes(nx)) { buf += nx; i += 2; continue; }
      buf += c; i++; continue;
    }

    if (c === "\n") {
      if (/ {2,}$/.test(buf)) { buf = buf.replace(/ +$/, ""); dorong(); hasil.push({ t: "br" }); }
      else { buf = buf.replace(/ +$/, "") + " "; }
      i++;
      while (s[i] === " ") i++;
      continue;
    }

    if (c === "`") {
      const m = /^`+/.exec(s.slice(i)) as RegExpExecArray;
      const n = m[0].length;
      const tutup = s.indexOf("`".repeat(n), i + n);
      if (tutup > i + n - 1 && s.slice(tutup + n, tutup + n + 1) !== "`") {
        dorong();
        let isi = s.slice(i + n, tutup).replace(/\n/g, " ");
        if (isi.length > 2 && isi.startsWith(" ") && isi.endsWith(" ")) isi = isi.slice(1, -1);
        hasil.push({ t: "kode", v: isi });
        i = tutup + n;
        continue;
      }
      buf += m[0]; i += n; continue;
    }

    if (c === "[") {
      const m = /^\[((?:[^\[\]\\]|\\.)*)\]\(\s*<?([^\s)<>]+)>?(?:\s+"((?:[^"\\]|\\.)*)")?\s*\)/.exec(s.slice(i));
      if (m) {
        dorong();
        const href = m[2] as string;
        const label = parseInline(m[1] as string, dalam + 1);
        if (RE_URL_BOLEH.test(href)) hasil.push({ t: "tautan", href, ...(m[3] ? { judul: m[3] } : {}), c: label });
        else hasil.push(...label);
        i += m[0].length;
        continue;
      }
    }

    if (c === "!" && s[i + 1] === "[") {
      // Gambar tidak dirender (tanpa pemuatan sumber luar): hanya teks alternatif.
      const m = /^!\[((?:[^\[\]\\]|\\.)*)\]\([^)]*\)/.exec(s.slice(i));
      if (m) { dorong(); hasil.push(...parseInline(m[1] as string, dalam + 1)); i += m[0].length; continue; }
    }

    if (c === "<") {
      const m = /^<((?:https?:\/\/|mailto:)[^\s<>]+)>/i.exec(s.slice(i));
      if (m) { dorong(); hasil.push({ t: "tautan", href: m[1] as string, c: [{ t: "teks", v: m[1] as string }] }); i += m[0].length; continue; }
      buf += c; i++; continue;
    }

    if ((c === "h" || c === "H") && /^https?:\/\//i.test(s.slice(i, i + 8)) && !kata(s[i - 1])) {
      const m = /^https?:\/\/[^\s<>"'`]+/i.exec(s.slice(i)) as RegExpExecArray;
      const url = m[0].replace(/[.,;:!?)\]]+$/, "");
      dorong(); hasil.push({ t: "tautan", href: url, c: [{ t: "teks", v: url }] }); i += url.length; continue;
    }

    const pasang = (tanda: string, jenis: "tebal" | "miring" | "coret" | "sorot" | "garis" | "pangkat" | "indeks", aturanKata = false): boolean => {
      if (!s.startsWith(tanda, i)) return false;
      const setelah = s[i + tanda.length];
      if (setelah === undefined || /\s/.test(setelah)) return false;
      if (aturanKata && kata(s[i - 1])) return false;
      const tutup = cariPenutup(s, i + tanda.length, tanda);
      if (tutup < 0) return false;
      if (aturanKata && kata(s[tutup + tanda.length])) return false;
      const isi = s.slice(i + tanda.length, tutup);
      if (jenis === "pangkat" || jenis === "indeks") { if (/\s/.test(isi) || isi.length > 24) return false; }
      dorong();
      hasil.push({ t: jenis, c: parseInline(isi, dalam + 1) });
      i = tutup + tanda.length;
      return true;
    };

    if (c === "*" || c === "_") {
      const aturan = c === "_";
      if (s.startsWith(c.repeat(3), i) && !/\s/.test(s[i + 3] ?? " ")) {
        const tutup = cariPenutup(s, i + 3, c.repeat(3));
        if (tutup >= 0 && !(aturan && (kata(s[i - 1]) || kata(s[tutup + 3])))) {
          dorong();
          hasil.push({ t: "tebal", c: [{ t: "miring", c: parseInline(s.slice(i + 3, tutup), dalam + 1) }] });
          i = tutup + 3;
          continue;
        }
      }
      if (pasang(c + c, "tebal", aturan)) continue;
      if (pasang(c, "miring", aturan)) continue;
    }
    if (c === "~" && pasang("~~", "coret")) continue;
    if (c === "=" && pasang("==", "sorot")) continue;
    if (c === "+" && pasang("++", "garis")) continue;
    if (c === "^" && pasang("^", "pangkat")) continue;
    if (c === "~" && s[i + 1] !== "~" && pasang("~", "indeks")) continue;

    buf += c;
    i++;
  }
  dorong();
  return hasil;
}

/* ------------------------------ blok ------------------------------ */

const RE_GARIS = /^ {0,3}(?:(?:\*[ \t]*){3,}|(?:-[ \t]*){3,}|(?:_[ \t]*){3,})$/;
const RE_JUDUL = /^ {0,3}(#{1,6})[ \t]+(.*?)(?:[ \t]+#+)?[ \t]*$/;
const RE_PAGAR = /^ {0,3}(`{3,}|~{3,})[ \t]*([\w+#.-]*)[^`]*$/;
const RE_POIN = /^( {0,3})([-*+])([ \t]+|$)/;
const RE_NOMOR = /^( {0,3})(\d{1,9})([.)])([ \t]+|$)/;
const RE_TABEL_PEMISAH = /^ {0,3}\|?[ \t]*:?-+:?[ \t]*(?:\|[ \t]*:?-+:?[ \t]*)*\|?[ \t]*$/;

function bagiSel(baris: string): string[] {
  let b = baris.trim();
  if (b.startsWith("|")) b = b.slice(1);
  if (b.endsWith("|") && !b.endsWith("\\|")) b = b.slice(0, -1);
  const sel: string[] = [];
  let cur = "";
  for (let i = 0; i < b.length; i++) {
    if (b[i] === "\\" && b[i + 1] === "|") { cur += "|"; i++; continue; }
    if (b[i] === "`") {
      const tutup = b.indexOf("`", i + 1);
      if (tutup > 0) { cur += b.slice(i, tutup + 1); i = tutup; continue; }
    }
    if (b[i] === "|") { sel.push(cur.trim()); cur = ""; continue; }
    cur += b[i];
  }
  sel.push(cur.trim());
  return sel;
}

function adaAwalBlok(l: string): boolean {
  return RE_JUDUL.test(l) || RE_PAGAR.test(l) || RE_GARIS.test(l) || /^ {0,3}>/.test(l) || RE_POIN.test(l) || RE_NOMOR.test(l);
}

export function parseBlok(src: string, dalam = 0): Blok[] {
  const baris = src.replace(/\r\n?/g, "\n").replace(/\t/g, "    ").split("\n");
  return parseBaris(baris, dalam);
}

function parseBaris(baris: string[], dalam: number): Blok[] {
  const keluar: Blok[] = [];
  if (dalam > MAKS_DALAM) {
    keluar.push({ t: "para", c: [{ t: "teks", v: baris.join(" ") }] });
    return keluar;
  }
  let i = 0;
  while (i < baris.length) {
    const l = baris[i] as string;
    if (l.trim() === "") { i++; continue; }

    let m = RE_PAGAR.exec(l);
    if (m) {
      const pagar = m[1] as string;
      const isi: string[] = [];
      i++;
      while (i < baris.length && !(new RegExp(`^ {0,3}${pagar[0] === "`" ? "`" : "~"}{${pagar.length},}[ \\t]*$`).test(baris[i] as string))) { isi.push(baris[i] as string); i++; }
      i++;
      keluar.push({ t: "kode", bahasa: (m[2] ?? "").slice(0, 24), v: isi.join("\n") });
      continue;
    }

    m = RE_JUDUL.exec(l);
    if (m) { keluar.push({ t: "judul", n: (m[1] as string).length as 1 | 2 | 3 | 4 | 5 | 6, c: parseInline((m[2] as string).trim()) }); i++; continue; }

    if (RE_GARIS.test(l)) { keluar.push({ t: "garis" }); i++; continue; }

    if (/^ {0,3}>/.test(l)) {
      const isi: string[] = [];
      while (i < baris.length && (baris[i] as string).trim() !== "" && (/^ {0,3}>/.test(baris[i] as string) || (isi.length > 0 && !adaAwalBlok(baris[i] as string)))) {
        isi.push((baris[i] as string).replace(/^ {0,3}> ?/, ""));
        i++;
      }
      let kotak: "NOTE" | "TIP" | "WARNING" | "IMPORTANT" | "CAUTION" | undefined;
      const k = /^\[!(NOTE|TIP|WARNING|IMPORTANT|CAUTION)\][ \t]*$/i.exec(isi[0] ?? "");
      if (k) { kotak = (k[1] as string).toUpperCase() as typeof kotak; isi.shift(); }
      keluar.push({ t: "kutipan", c: parseBaris(isi, dalam + 1), ...(kotak ? { kotak } : {}) });
      continue;
    }

    const poin = RE_POIN.exec(l);
    const nomor = poin ? null : RE_NOMOR.exec(l);
    if (poin || nomor) {
      const urut = !poin;
      const mulai = nomor ? parseInt(nomor[2] as string, 10) : 1;
      const butir: { centang: boolean | null; c: Blok[] }[] = [];
      let tutupBatas = true;
      while (i < baris.length) {
        const cur = baris[i] as string;
        const mm = urut ? RE_NOMOR.exec(cur) : RE_POIN.exec(cur);
        if (!mm) break;
        if (urut && mm[3] !== (nomor as RegExpExecArray)[3]) break;
        if (!urut && mm[2] !== (poin as RegExpExecArray)[2]) break;
        const lebarPenanda = mm[0].length;
        const isiPertama = cur.slice(lebarPenanda);
        const indent = Math.max(lebarPenanda, (mm[1] as string).length + 2);
        const isi: string[] = [isiPertama];
        i++;
        while (i < baris.length) {
          const nx = baris[i] as string;
          if (nx.trim() === "") {
            // baris kosong: lanjut hanya bila baris berikutnya masih menjorok di bawah butir ini
            let j = i + 1;
            while (j < baris.length && (baris[j] as string).trim() === "") j++;
            if (j < baris.length && /^ +/.test(baris[j] as string) && (baris[j] as string).search(/\S/) >= indent) { isi.push(""); i++; continue; }
            break;
          }
          if ((nx.search(/\S/)) >= indent) { isi.push(nx.slice(indent)); i++; continue; }
          if (!adaAwalBlok(nx) && isi[isi.length - 1] !== "") { isi.push(nx.trimStart()); i++; continue; }
          break;
        }
        let centang: boolean | null = null;
        const cb = /^\[([ xX])\][ \t]+/.exec(isi[0] as string);
        if (cb) { centang = cb[1] !== " "; isi[0] = (isi[0] as string).slice(cb[0].length); }
        butir.push({ centang, c: parseBaris(isi, dalam + 1) });
        // lewati satu baris kosong antar butir
        let j = i;
        while (j < baris.length && (baris[j] as string).trim() === "") j++;
        if (j > i && j < baris.length && (urut ? RE_NOMOR : RE_POIN).test(baris[j] as string)) { i = j; tutupBatas = false; }
      }
      void tutupBatas;
      keluar.push({ t: "daftar", urut, mulai, butir });
      continue;
    }

    // tabel
    if (l.includes("|") && i + 1 < baris.length && RE_TABEL_PEMISAH.test(baris[i + 1] as string) && (baris[i + 1] as string).includes("-")) {
      const kepalaSel = bagiSel(l);
      const pemisah = bagiSel(baris[i + 1] as string);
      if (kepalaSel.length === pemisah.length && pemisah.every((p) => /^:?-+:?$/.test(p))) {
        const rata: Rata[] = pemisah.map((p) => (p.startsWith(":") && p.endsWith(":") ? "tengah" : p.endsWith(":") ? "kanan" : p.startsWith(":") ? "kiri" : null));
        i += 2;
        const rows: Inline[][][] = [];
        while (i < baris.length && (baris[i] as string).trim() !== "" && (baris[i] as string).includes("|") && rows.length < 200) {
          const sel = bagiSel(baris[i] as string);
          rows.push(rata.map((_, k) => parseInline(sel[k] ?? "")));
          i++;
        }
        keluar.push({ t: "tabel", rata, kepala: kepalaSel.map((x) => parseInline(x)), baris: rows });
        continue;
      }
    }

    // paragraf (dengan judul setext)
    const para: string[] = [l.trim()];
    i++;
    let setext: 1 | 2 | null = null;
    while (i < baris.length) {
      const nx = baris[i] as string;
      if (nx.trim() === "") break;
      if (/^ {0,3}=+[ \t]*$/.test(nx)) { setext = 1; i++; break; }
      if (/^ {0,3}-+[ \t]*$/.test(nx) && !RE_POIN.test(nx)) { setext = 2; i++; break; }
      if (adaAwalBlok(nx) && !(RE_NOMOR.exec(nx) && (RE_NOMOR.exec(nx) as RegExpExecArray)[2] !== "1")) break;
      if (nx.includes("|") && i + 1 < baris.length && RE_TABEL_PEMISAH.test(baris[i + 1] as string)) break;
      para.push(nx.replace(/^\s+/, (x) => (/ {2,}$/.test(para[para.length - 1] as string) ? "" : "")));
      i++;
    }
    const teks = para.join("\n");
    if (setext) keluar.push({ t: "judul", n: setext, c: parseInline(teks.replace(/\n/g, " ")) });
    else keluar.push({ t: "para", c: parseInline(teks) });
  }
  return keluar;
}

/* ------------------------------ render HTML ------------------------------ */

function htmlInline(daftar: Inline[]): string {
  let h = "";
  for (const n of daftar) {
    switch (n.t) {
      case "teks": h += esc(n.v); break;
      case "kode": h += `<code class="md-kode">${esc(n.v)}</code>`; break;
      case "br": h += "<br>"; break;
      case "tebal": h += `<strong>${htmlInline(n.c)}</strong>`; break;
      case "miring": h += `<em>${htmlInline(n.c)}</em>`; break;
      case "coret": h += `<del>${htmlInline(n.c)}</del>`; break;
      case "sorot": h += `<mark class="md-sorot">${htmlInline(n.c)}</mark>`; break;
      case "garis": h += `<u>${htmlInline(n.c)}</u>`; break;
      case "pangkat": h += `<sup>${htmlInline(n.c)}</sup>`; break;
      case "indeks": h += `<sub>${htmlInline(n.c)}</sub>`; break;
      case "tautan":
        h += `<a href="${esc(n.href)}" rel="noopener noreferrer nofollow" target="_blank"${n.judul ? ` title="${esc(n.judul)}"` : ""}>${htmlInline(n.c)}</a>`;
        break;
    }
  }
  return h;
}

const NAMA_KOTAK: Record<string, string> = { NOTE: "Catatan", TIP: "Tips", WARNING: "Perhatian", IMPORTANT: "Penting", CAUTION: "Awas" };
const ALIGN: Record<string, string> = { kiri: "left", tengah: "center", kanan: "right" };

function htmlBlok(daftar: Blok[]): string {
  let h = "";
  for (const b of daftar) {
    switch (b.t) {
      case "judul": h += `<h${b.n} class="md-j md-j${b.n}">${htmlInline(b.c)}</h${b.n}>`; break;
      case "para": h += `<p>${htmlInline(b.c)}</p>`; break;
      case "garis": h += `<hr class="md-garis">`; break;
      case "kode":
        h += `<pre class="md-pre"${b.bahasa ? ` data-bahasa="${esc(b.bahasa)}"` : ""} tabindex="0"><code>${esc(b.v)}</code></pre>`;
        break;
      case "kutipan":
        if (b.kotak) h += `<aside class="md-kotak md-kotak--${b.kotak.toLowerCase()}" role="note"><strong class="md-kotak__judul">${NAMA_KOTAK[b.kotak]}</strong>${htmlBlok(b.c)}</aside>`;
        else h += `<blockquote class="md-kutipan">${htmlBlok(b.c)}</blockquote>`;
        break;
      case "daftar": {
        const tag = b.urut ? "ol" : "ul";
        const adaCentang = b.butir.some((x) => x.centang !== null);
        h += `<${tag}${b.urut && b.mulai !== 1 ? ` start="${b.mulai}"` : ""} class="md-daftar${adaCentang ? " md-daftar--centang" : ""}">`;
        for (const x of b.butir) {
          const tanda = x.centang === null ? "" : `<span class="md-cek${x.centang ? " md-cek--ya" : ""}" role="img" aria-label="${x.centang ? "selesai" : "belum"}"></span>`;
          const isi = x.c.length === 1 && x.c[0]?.t === "para" ? htmlInline((x.c[0] as { c: Inline[] }).c) : htmlBlok(x.c);
          h += `<li${x.centang !== null ? ' class="md-butir-cek"' : ""}>${tanda}${isi}</li>`;
        }
        h += `</${tag}>`;
        break;
      }
      case "tabel": {
        const sel = (isi: Inline[], k: number, tag: "th" | "td"): string => {
          const r = b.rata[k];
          return `<${tag}${r ? ` style="text-align:${ALIGN[r]}"` : ""}${tag === "th" ? ' scope="col"' : ""}>${htmlInline(isi)}</${tag}>`;
        };
        h += `<div class="md-tabel" role="region" tabindex="0" aria-label="Tabel"><table><thead><tr>${b.kepala.map((x, k) => sel(x, k, "th")).join("")}</tr></thead><tbody>${b.baris.map((r) => `<tr>${r.map((x, k) => sel(x, k, "td")).join("")}</tr>`).join("")}</tbody></table></div>`;
        break;
      }
    }
  }
  return h;
}

/** Render ke HTML aman. Masukan terlalu panjang dipotong. */
export function renderMarkdown(src: string): string {
  const s = String(src ?? "").slice(0, MAKS_PANJANG);
  return htmlBlok(parseBlok(s));
}

/* ------------------------------ teks polos & pemeriksaan ------------------------------ */

function polosInline(daftar: Inline[]): string {
  return daftar
    .map((n) => (n.t === "teks" || n.t === "kode" ? n.v : n.t === "br" ? " " : polosInline(n.c)))
    .join("");
}

function polosBlok(daftar: Blok[]): string[] {
  const out: string[] = [];
  for (const b of daftar) {
    switch (b.t) {
      case "judul": case "para": out.push(polosInline(b.c)); break;
      case "garis": break;
      case "kode": out.push(b.v); break;
      case "kutipan": out.push(...polosBlok(b.c)); break;
      case "daftar": if (b.urut && b.mulai !== 1) out.push(String(b.mulai)); for (const x of b.butir) out.push(...polosBlok(x.c)); break;
      case "tabel": out.push(b.kepala.map(polosInline).join(" ")); for (const r of b.baris) out.push(r.map(polosInline).join(" ")); break;
    }
  }
  return out;
}

/** Teks tanpa penanda format, satu baris per blok. Dipakai pemeriksa isi agar tanda format tidak dianggap kata/angka. */
export function teksPolos(src: string): string {
  return polosBlok(parseBlok(String(src ?? "").slice(0, MAKS_PANJANG))).join("\n");
}

/** Konstruksi yang tidak boleh ada pada keluaran AI: HTML mentah, tautan/URL, gambar, blok kode. */
export function adaMarkupTerlarang(src: string): boolean {
  const s = String(src ?? "");
  if (/<\/?[a-z!][^>]*>/i.test(s) || /&#?\w+;/.test(s)) return true;
  if (/```|~~~|`/.test(s)) return true;
  const blok = parseBlok(s);
  let ada = false;
  const telusurInline = (d: Inline[]): void => {
    for (const n of d) {
      if (n.t === "tautan") ada = true;
      else if (n.t === "teks" || n.t === "kode" || n.t === "br") continue;
      else telusurInline(n.c);
    }
  };
  const telusur = (d: Blok[]): void => {
    for (const b of d) {
      if (b.t === "kode") ada = true;
      else if (b.t === "judul" || b.t === "para") telusurInline(b.c);
      else if (b.t === "kutipan") telusur(b.c);
      else if (b.t === "daftar") b.butir.forEach((x) => telusur(x.c));
      else if (b.t === "tabel") { b.kepala.forEach(telusurInline); b.baris.forEach((r) => r.forEach(telusurInline)); }
    }
  };
  telusur(blok);
  if (ada) return true;
  if (/!\[|\]\(|https?:|www\.|:\/\//i.test(s)) return true;
  return false;
}
