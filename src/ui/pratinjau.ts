import { UKURAN_KERTAS, e, type Blok, type OpsiEkspor } from "./ekspor";
import { tataDokumen, type MetaTata } from "./ekspor-tata";
import { ikon } from "./ikon";

/**
 * Pratinjau dokumen di dalam aplikasi: halaman nyata (mm) diskalakan agar muat di layar, dan cetak memakai
 * elemen yang sama, jadi yang terlihat di pratinjau persis yang tercetak (sama di ponsel dan komputer).
 */
export interface OpsiPratinjau {
  blok: Blok[];
  opsi: OpsiEkspor;
  meta: MetaTata;
  judulBerkas: string;
  onTutup: () => void;
}

export interface PratinjauHandle {
  tutup: () => void;
}

const ID = "pratinjau-ekspor";

export async function bukaPratinjau(o: OpsiPratinjau): Promise<PratinjauHandle> {
  document.getElementById(ID)?.remove();
  const uk = UKURAN_KERTAS[o.opsi.kertas];
  const hasil = await tataDokumen(o.blok, o.opsi, o.meta);

  const wadah = document.createElement("div");
  wadah.id = ID;
  wadah.className = "pratinjau";
  wadah.setAttribute("role", "dialog");
  wadah.setAttribute("aria-modal", "true");
  wadah.setAttribute("aria-label", `Pratinjau dokumen: ${o.meta.judul}`);
  wadah.dataset.kertas = o.opsi.kertas;
  wadah.innerHTML = `
    <div class="pratinjau__bar">
      <button type="button" class="btn btn--ghost" data-pr="tutup">${ikon("panah-kiri")}<span>Kembali</span></button>
      <div class="pratinjau__info"><strong>${e(o.meta.judul)}</strong><span>${hasil.jumlah} halaman · ${e(o.opsi.kertas)}${o.opsi.hemat ? " · hemat tinta" : ""}</span></div>
      <div class="pratinjau__zoom" role="group" aria-label="Ukuran tampilan">
        <button type="button" class="btn btn--ghost" data-pr="kecil" aria-label="Perkecil">−</button>
        <button type="button" class="btn btn--ghost" data-pr="pas" aria-label="Pas lebar layar"><span data-pr-persen>100%</span></button>
        <button type="button" class="btn btn--ghost" data-pr="besar" aria-label="Perbesar">+</button>
      </div>
      <button type="button" class="btn btn--utama" data-pr="cetak">${ikon("pdf")}<span>Unduh PDF</span></button>
    </div>
    <div class="pratinjau__kanvas" tabindex="0" aria-label="Halaman dokumen"><div class="pratinjau__skala"></div></div>
    <p class="pratinjau__petunjuk">Tekan Unduh PDF, lalu di dialog yang muncul pilih &ldquo;Simpan sebagai PDF&rdquo; sebagai printer. Matikan &ldquo;Header dan footer&rdquo; bila ada; ukuran kertas sudah diatur otomatis.</p>`;
  document.body.appendChild(wadah);

  const kanvas = wadah.querySelector<HTMLElement>(".pratinjau__kanvas")!;
  const skala = wadah.querySelector<HTMLElement>(".pratinjau__skala")!;
  const persen = wadah.querySelector<HTMLElement>("[data-pr-persen]")!;
  skala.appendChild(hasil.dok);

  const pxPerMm = 96 / 25.4;
  const lebarPx = uk.l * pxPerMm;
  let mode: "pas" | number = "pas";
  const terapkan = (): void => {
    const tersedia = Math.max(160, kanvas.clientWidth - 24);
    const k = mode === "pas" ? Math.min(1, tersedia / lebarPx) : mode;
    const tinggi = hasil.dok.offsetHeight;
    skala.style.width = `${lebarPx * k}px`;
    skala.style.height = `${tinggi * k}px`;
    hasil.dok.style.transform = `scale(${k})`;
    persen.textContent = `${Math.round(k * 100)}%`;
  };
  const pengamat = typeof ResizeObserver !== "undefined" ? new ResizeObserver(() => terapkan()) : null;
  pengamat?.observe(kanvas);
  terapkan();

  const gaya = document.createElement("style");
  gaya.id = "nv-halaman";
  gaya.textContent = `@page{size:${uk.l}mm ${uk.t}mm;margin:0}`;
  const html = document.documentElement;
  const judulAsal = document.title;
  const pasangCetak = (): void => {
    if (!document.getElementById("nv-halaman")) document.head.appendChild(gaya);
    html.classList.add("nv-cetak");
    document.title = o.judulBerkas;
  };
  const bersihCetak = (): void => {
    html.classList.remove("nv-cetak");
    gaya.remove();
    document.title = judulAsal;
  };
  window.addEventListener("beforeprint", pasangCetak);
  window.addEventListener("afterprint", bersihCetak);

  let tertutup = false;
  const tutup = (): void => {
    if (tertutup) return;
    tertutup = true;
    window.removeEventListener("beforeprint", pasangCetak);
    window.removeEventListener("afterprint", bersihCetak);
    document.removeEventListener("keydown", tombol, true);
    pengamat?.disconnect();
    bersihCetak();
    wadah.remove();
    o.onTutup();
  };
  const tombol = (ev: KeyboardEvent): void => {
    if (ev.key === "Escape") { ev.preventDefault(); ev.stopPropagation(); tutup(); return; }
    if (ev.key === "Tab") {
      const f = Array.from(wadah.querySelectorAll<HTMLElement>("button, [tabindex='0']")).filter((x) => !x.hasAttribute("disabled"));
      if (!f.length) return;
      const a = document.activeElement as HTMLElement | null;
      const i = a ? f.indexOf(a) : -1;
      if (ev.shiftKey && i <= 0) { ev.preventDefault(); f[f.length - 1]!.focus({ preventScroll: true }); }
      else if (!ev.shiftKey && (i === f.length - 1 || i === -1)) { ev.preventDefault(); f[0]!.focus({ preventScroll: true }); }
    }
  };
  document.addEventListener("keydown", tombol, true);

  wadah.addEventListener("click", (ev) => {
    const t = (ev.target as HTMLElement).closest<HTMLElement>("[data-pr]");
    if (!t) return;
    const a = t.dataset.pr;
    if (a === "tutup") tutup();
    else if (a === "cetak") { pasangCetak(); setTimeout(() => window.print(), 60); }
    else if (a === "pas") { mode = "pas"; terapkan(); }
    else if (a === "besar" || a === "kecil") {
      const sekarang = mode === "pas" ? Math.min(1, Math.max(160, kanvas.clientWidth - 24) / lebarPx) : mode;
      mode = Math.max(0.3, Math.min(2.2, sekarang * (a === "besar" ? 1.2 : 1 / 1.2)));
      terapkan();
    }
  });
  wadah.querySelector<HTMLElement>("[data-pr='cetak']")?.focus({ preventScroll: true });
  return { tutup };
}
