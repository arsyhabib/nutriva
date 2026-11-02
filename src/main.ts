import { DAFTAR_LAYAR, LayarRona, type IdLayar, type OpsiLayarRona } from "./ui/layar";

export function pasangAplikasiRona(
  akar: HTMLElement,
  opsi?: OpsiLayarRona,
): LayarRona {
  const app = new LayarRona(akar, opsi);
  app.pasang();
  return app;
}

function daftarkanServiceWorker(): void {
  if (typeof window === "undefined" || typeof navigator === "undefined") return;
  if (!("serviceWorker" in navigator)) return;
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {
      // Abaikan secara senyap pada lingkungan pratinjau/pengujian tanpa HTTPS
    });
  });
}

/** Tautan dalam: `#kolam`, `#kenapa`, dst. Hanya id layar yang dikenal yang diterima. */
export function layarDariHash(hash: string): IdLayar | null {
  const id = hash.replace(/^#\/?/, "");
  return DAFTAR_LAYAR.find((l) => l.id === id)?.id ?? null;
}

if (typeof document !== "undefined") {
  const el = document.getElementById("app");
  if (el) {
    const app = pasangAplikasiRona(el);
    const awal = layarDariHash(window.location.hash);
    if (awal) app.bukaLayar(awal);
    window.addEventListener("hashchange", () => {
      const id = layarDariHash(window.location.hash);
      if (id) app.bukaLayar(id);
    });
    daftarkanServiceWorker();
  }
}
