/**
 * Kunci orientasi tegak untuk ponsel. NUTRIVA dirancang untuk tegak; aplikasi tidak boleh ikut berputar walau putar otomatis
 * di ponsel aktif. Tiga lapis:
 *  1. manifest `orientation: portrait` (PWA terpasang di Android),
 *  2. `screen.orientation.lock("portrait")` bila peramban mengizinkan (Android Chrome, mode PWA/layar penuh),
 *  3. cadangan bagi peramban yang tidak bisa mengunci (iPhone, tab biasa): tata letak TIDAK ikut berputar. Selama ponsel
 *     mendatar, selembar penutup meminta ponsel ditegakkan kembali; keadaan aplikasi di baliknya tidak berubah.
 * Tablet, laptop, dan layar lebar tidak terpengaruh: yang dikunci hanya perangkat sentuh dengan sisi pendek < 600 px.
 */

// klaim: n/a — batas sisi pendek layar (px CSS) untuk menggolongkan perangkat sebagai ponsel; keputusan rekayasa
const SISI_PENDEK_PONSEL = 600;

interface LingkunganOrientasi {
  sentuhKasar: boolean;
  sisiPendek: number;
  tipeOrientasi: string | null;
  sudutLama: number | null;
  lebarJendela: number;
  tinggiJendela: number;
}

export function adalahPonsel(l: LingkunganOrientasi): boolean {
  return l.sentuhKasar && l.sisiPendek > 0 && l.sisiPendek < SISI_PENDEK_PONSEL;
}

/** Mendatar menurut API orientasi layar (tahan terhadap papan ketik layar yang mengecilkan tinggi jendela). */
export function sedangMendatar(l: LingkunganOrientasi): boolean {
  if (l.tipeOrientasi) return l.tipeOrientasi.startsWith("landscape");
  if (l.sudutLama !== null) return Math.abs(l.sudutLama) === 90;
  return l.lebarJendela > l.tinggiJendela;
}

function baca(): LingkunganOrientasi {
  const so = typeof screen !== "undefined" ? screen : undefined;
  return {
    sentuhKasar: typeof window.matchMedia === "function" && window.matchMedia("(pointer: coarse)").matches && !window.matchMedia("(any-pointer: fine)").matches,
    sisiPendek: so ? Math.min(so.width || 0, so.height || 0) : 0,
    tipeOrientasi: so?.orientation?.type ?? null,
    sudutLama: typeof (window as { orientation?: unknown }).orientation === "number" ? ((window as { orientation?: number }).orientation as number) : null,
    lebarJendela: window.innerWidth,
    tinggiJendela: window.innerHeight,
  };
}

export function pasangKunciTegak(): void {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  const html = document.documentElement;
  let penutup: HTMLElement | null = null;

  const pastikanPenutup = (): HTMLElement => {
    if (penutup && penutup.isConnected) return penutup;
    const el = document.createElement("div");
    el.className = "putar-tegak";
    el.setAttribute("role", "alertdialog");
    el.setAttribute("aria-live", "assertive");
    el.setAttribute("aria-label", "Putar ponsel ke posisi tegak");
    el.hidden = true;
    el.innerHTML =
      '<div class="putar-tegak__isi"><svg class="putar-tegak__ikon" viewBox="0 0 64 64" width="72" height="72" aria-hidden="true" focusable="false">' +
      '<rect x="22" y="6" width="20" height="36" rx="4" fill="none" stroke="currentColor" stroke-width="3"/>' +
      '<path d="M14 50c8 8 28 8 36 0" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>' +
      '<path d="M46 44l4 6-7 1" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
      '<p class="putar-tegak__judul">Putar ponsel ke posisi tegak</p>' +
      '<p class="putar-tegak__isi-teks">NUTRIVA dirancang untuk layar tegak agar angka dan kartu mudah dibaca. Data Anda tetap aman di tempatnya.</p></div>';
    document.body.appendChild(el);
    penutup = el;
    return el;
  };

  const coba = (): void => {
    const l = baca();
    const ponsel = adalahPonsel(l);
    html.setAttribute("data-ponsel", ponsel ? "ya" : "tidak");
    if (!ponsel) {
      if (penutup) penutup.hidden = true;
      html.removeAttribute("data-mendatar");
      return;
    }
    // Lapis 2: minta kunci; gagal senyap bila tidak diizinkan (tab biasa, iOS).
    try {
      const p = (screen.orientation as { lock?: (o: string) => Promise<void> } | undefined)?.lock?.("portrait");
      if (p && typeof p.catch === "function") p.catch(() => { /* tidak diizinkan: pakai penutup */ });
    } catch { /* abaikan */ }
    // Lapis 3: penutup selama mendatar.
    const mendatar = sedangMendatar(l);
    if (mendatar) {
      html.setAttribute("data-mendatar", "ya");
      pastikanPenutup().hidden = false;
    } else {
      html.removeAttribute("data-mendatar");
      if (penutup) penutup.hidden = true;
    }
  };

  coba();
  window.addEventListener("orientationchange", coba);
  window.addEventListener("resize", coba);
  try { screen.orientation?.addEventListener?.("change", coba); } catch { /* abaikan */ }
  // Kunci tertentu hanya diizinkan setelah ada interaksi pengguna.
  window.addEventListener("pointerdown", coba, { once: true, passive: true });
  document.addEventListener("visibilitychange", () => { if (!document.hidden) coba(); });
}
