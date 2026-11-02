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

export default defineConfig({
  base: "./",
  plugins: [keluarkanBlokRona()],
  build: { outDir: "dist", emptyOutDir: true, target: "es2022" },
});
