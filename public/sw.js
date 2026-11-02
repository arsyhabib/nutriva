/**
 * Service Worker NUTRIVA (V-PJBL 2026)
 * Menyimpan cangkang aplikasi dan aset statis agar mesin deterministik
 * dapat berjalan secara luring (offline-capable). Permintaan ke proxy AI
 * (/v1/jelaskan) tidak pernah disimpan di cache (ADR-0003 & K-08).
 */
const NAMA_CACHE = "nutriva-inti-v0.3.0";
const ASET_INTI = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon.svg",
  "./icon-192.png",
];

/** Muat shell + seluruh aset berhash (JS, CSS, font) saat instal agar kunjungan luring pertama berhasil. */
async function prakirim(cache) {
  await cache.addAll(ASET_INTI);
  const resp = await fetch("./index.html", { cache: "reload" });
  const html = await resp.text();
  const tautan = new Set();
  for (const m of html.matchAll(/(?:src|href)="(\.?\/?assets\/[^"]+)"/g)) tautan.add(m[1]);
  for (const t of [...tautan]) {
    const url = new URL(t, self.registration.scope);
    await cache.add(url.href).catch(() => {});
    if (url.pathname.endsWith(".css")) {
      const css = await (await cache.match(url.href))?.text();
      for (const f of (css || "").matchAll(/url\(["']?([^"')]+?)["']?\)/g)) {
        if (f[1].startsWith("data:")) continue;
        await cache.add(new URL(f[1], url.href).href).catch(() => {});
      }
    }
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(NAMA_CACHE)
      .then((cache) => prakirim(cache))
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
          caches.match("./index.html", { ignoreVary: true }).then((r) => r || caches.match("./")),
        ),
    );
    return;
  }

  event.respondWith(
    caches.match(req, { ignoreVary: true }).then((cached) => {
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
