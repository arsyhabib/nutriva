import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const ronaPath = resolve(root, "NUTRIVA Rona.html");
const distDir = resolve(root, "dist");

if (!existsSync(ronaPath)) {
  console.error("Berkas NUTRIVA Rona.html tidak ditemukan!");
  process.exit(1);
}

let rona = readFileSync(ronaPath, "utf8");

// Pasang PWA manifest & icon ke head jika belum ada
if (!rona.includes("manifest.webmanifest")) {
  rona = rona.replace(
    "</head>",
    `  <link rel="manifest" href="./manifest.webmanifest" />\n  <link rel="icon" type="image/svg+xml" href="./icon.svg" />\n</head>`,
  );
}

// Pasang service worker registration ke akhir body jika belum ada
if (!rona.includes("navigator.serviceWorker")) {
  rona = rona.replace(
    "</body>",
    `<script>\nif ('serviceWorker' in navigator) {\n  window.addEventListener('load', () => {\n    navigator.serviceWorker.register('./sw.js').catch(() => {});\n  });\n}\n</script>\n</body>`,
  );
}

mkdirSync(distDir, { recursive: true });
writeFileSync(resolve(distDir, "index.html"), rona, "utf8");

// Salin berkas pendukung PWA ke dist
const berkasPublik = ["manifest.webmanifest", "icon.svg", "sw.js", ".nojekyll"];
for (const b of berkasPublik) {
  const sumber = resolve(root, "public", b);
  if (existsSync(sumber)) {
    copyFileSync(sumber, resolve(distDir, b));
  }
}

console.log("paketkan-single-file OK — dist/index.html disiapkan dari NUTRIVA Rona.html penuh.");
