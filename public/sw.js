/**
 * Service Worker NUTRIVA (V-PJBL 2026)
 * Menyimpan cangkang aplikasi dan aset statis agar mesin deterministik
 * dapat berjalan secara luring (offline-capable). Permintaan ke proxy AI
 * (/v1/jelaskan) tidak pernah disimpan di cache (ADR-0003 & K-08).
 */
const NAMA_CACHE = "nutriva-inti-v0.2.0";
const ASET_INTI = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(NAMA_CACHE)
      .then((cache) => cache.addAll(ASET_INTI))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((kunciList) =>
        Promise.all(
          kunciList
            .filter((k) => k !== NAMA_CACHE)
            .map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") {
    return;
  }

  const url = new URL(req.url);
  if (url.pathname.includes("/v1/jelaskan")) {
    return;
  }

  if (url.origin !== self.location.origin) {
    return;
  }

  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const salinan = res.clone();
          caches.open(NAMA_CACHE).then((c) => c.put("./index.html", salinan));
          return res;
        })
        .catch(() =>
          caches.match("./index.html").then((r) => r || caches.match("./")),
        ),
    );
    return;
  }

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) {
        return cached;
      }
      return fetch(req).then((res) => {
        if (res && res.status === 200 && res.type === "basic") {
          const salinan = res.clone();
          caches.open(NAMA_CACHE).then((c) => c.put(req, salinan));
        }
        return res;
      });
    }),
  );
});
