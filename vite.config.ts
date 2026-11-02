import { defineConfig, type Plugin } from "vite";

/**
 * K-13: blok fisika/pameran Rona tidak masuk bundel produk.
 * Menghapus <script id="rona-physics">…</script> dan <script id="rona-exhibition">…</script> dari HTML.
 */
const BLOK_DIKELUARKAN = ["rona-physics", "rona-exhibition"] as const;

function keluarkanBlokRona(): Plugin {
  return {
    name: "nutriva-keluarkan-blok-rona",
    enforce: "pre",
    transformIndexHtml(html) {
      let hasil = html;
      for (const id of BLOK_DIKELUARKAN) {
        const pola = new RegExp("<script[^>]*\\bid=[\"']" + id + "[\"'][^>]*>[\\s\\S]*?<\\/script>", "g");
        hasil = hasil.replace(pola, "");
      }
      return hasil;
    },
    generateBundle(_, bundle) {
      for (const [nama, berkas] of Object.entries(bundle)) {
        const isi = berkas.type === "chunk" ? berkas.code : String(berkas.source);
        for (const id of BLOK_DIKELUARKAN) {
          if (isi.includes(`id="${id}"`) || isi.includes(`id='${id}'`)) {
            this.error(`K-13 dilanggar: blok "${id}" masih ada di ${nama}`);
          }
        }
      }
    },
  };
}

export default defineConfig({
  base: "./",
  plugins: [keluarkanBlokRona()],
  build: { outDir: "dist", emptyOutDir: true, target: "es2022" },
});
