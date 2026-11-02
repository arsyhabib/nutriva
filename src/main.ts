import { LayarRona, type OpsiLayarRona } from "./ui/layar";

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

if (typeof document !== "undefined") {
  const el = document.getElementById("app");
  if (el) {
    pasangAplikasiRona(el);
    daftarkanServiceWorker();
  }
}
