import { defineConfig, type Plugin } from "vite";

const BLOK_TERLARANG = [
  "rona-physics",
  "rona-app",
  "rona-exhibition",
  "rona-export",
  "rona-verify",
] as const;

function keluarkanBlokRona(): Plugin {
  return {
    name: "nutriva-keluarkan-blok-rona",
    enforce: "pre",
    transformIndexHtml(html) {
      let hasil = html;
      for (const id of BLOK_TERLARANG) {
        const pola = new RegExp(
          `<script[^>]*\\bid=["']${id}["'][^>]*>[\\s\\S]*?<\\/script>`,
          "gi",
        );
        hasil = hasil.replace(pola, "");
      }
      return hasil;
    },
  };
}

/**
 * GitHub Pages tidak membaca `_headers`, jadi CSP ikut ditanam sebagai meta saat build.
 * style-src 'unsafe-inline' dipertahankan karena markup memakai atribut style=; skrip tetap 'self' saja.
 */
const CSP =
  "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self' https://*.workers.dev; object-src 'none'; base-uri 'none'; form-action 'none'";

function tanamCsp(): Plugin {
  return {
    name: "nutriva-tanam-csp",
    apply: "build",
    transformIndexHtml(html) {
      return html.replace("<head>", `<head>\n    <meta http-equiv="Content-Security-Policy" content="${CSP}" />`);
    },
  };
}

export default defineConfig({
  base: "./",
  plugins: [keluarkanBlokRona(), tanamCsp()],
  build: { outDir: "dist", emptyOutDir: true, target: "es2022", assetsInlineLimit: 0 },
});
