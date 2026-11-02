import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { PERINGATAN_AI, PERNYATAAN_PRIVASI_AI } from "../src/ai/glosarium";
import { LABEL_PROTOTIPE } from "../src/engine/konstanta";
import { DAFTAR_LAYAR, LayarRona } from "../src/ui/layar";
import { PRESET_SINTETIS, type KodePreset } from "../src/ui/preset";

function buatAkarPalsu(): HTMLElement {
  return {
    innerHTML: "",
    addEventListener: () => {},
  } as unknown as HTMLElement;
}

describe("Integrasi UI NUTRIVA Rona (Hari 4 & 5)", () => {
  it("merender seluruh 18 layar pada ketiga kasus sintetis (A, B, C) dan ketiga peran tanpa galat", () => {
    const akar = buatAkarPalsu();
    const app = new LayarRona(akar);
    app.pasang();

    for (const preset of ["A", "B", "C"] as KodePreset[]) {
      app.pilihPreset(preset);
      for (const peran of ["ibu", "kader", "ahli"] as const) {
        app.aturPeran(peran);
        for (const info of DAFTAR_LAYAR) {
          app.bukaLayar(info.id);
          const html = app.ambilHtml();
          expect(html.length).toBeGreaterThan(200);
          // Wajib memuat LABEL_PROTOTIPE di setiap layar
          expect(html).toContain(LABEL_PROTOTIPE);
          // Dilarang memuat angka Z-score kontinu atau rumus LMS (K-02, INV-04)
          expect(html).not.toMatch(/Z\s*=\s*-?\d/);
          expect(html).not.toContain("((X/M)^L");
          // Dilarang memuat rumus LP atau klaim harga Rupiah (K-06, INV-07)
          expect(html).not.toContain("Σ c_j");
          expect(html).not.toContain("Rp 15.000");
          // Dilarang memuat klaim privasi/luring palsu (K-08, K-09, K-12)
          expect(html).not.toContain("100% LURING");
          expect(html).not.toContain("Local Storage");
          expect(html).not.toContain("tanpa kirim data");
          expect(html).not.toContain(
            "Ukuran dan nama anak tersimpan di perangkat",
          );
          // Dilarang memuat nama anak pribadi dari prototipe lama (D-1, INV-17)
          expect(html).not.toContain("Ayla");
          expect(html).not.toContain("Bima");
          expect(html).not.toContain("Citra");
        }
      }
    }
  });

  it("Kasus Sintetis A (9 bln, normal) menampilkan pita SD, menu 3 hari, daftar belanja kelas harga, dan penjelasan templat + PERINGATAN_AI", () => {
    const akar = buatAkarPalsu();
    const app = new LayarRona(akar, { presetAwal: "A", layarAwal: "status" });
    app.pasang();

    const r = app.hitungRingkasan();
    expect(r.hasil).toBe("ok");
    if (r.hasil !== "ok") return;
    expect(r.rujukan.tingkat).toBe("normal");
    expect(r.pola).not.toBeNull();
    expect(r.belanja).not.toBeNull();

    const htmlStatus = app.ambilHtml();
    expect(htmlStatus).toContain("berat badan normal menurut umur");
    expect(htmlStatus).toContain("gizi baik");
    expect(htmlStatus).toContain(PERINGATAN_AI);
    expect(htmlStatus).toContain('data-ai-teks="true"');

    app.bukaLayar("piring");
    const htmlPiring = app.ambilHtml();
    expect(htmlPiring).toContain("Daftar Belanja 3 Hari");
    expect(htmlPiring).toContain("Kelas Harga:");
    expect(htmlPiring).toContain("Beli ~");
    expect(htmlPiring).toContain(PERINGATAN_AI);

    // Pindah hari menu & ganti variasi benih deterministik
    app.pilihHariMenu(1);
    expect(app.ambilHtml()).toContain("HARI 2");
    const benihAwal = app.ambilState().masukan.pola.benih;
    app.gantiVariasiBenih();
    expect(app.ambilState().masukan.pola.benih).not.toBe(benihAwal);
  });

  it("Kasus Sintetis B (14 bln, tanda bahaya) mengaktifkan gerbang rujukan wajib, menyembunyikan menu mandiri, dan menonaktifkan AI (K-04 & K-08)", () => {
    const akar = buatAkarPalsu();
    const app = new LayarRona(akar, { presetAwal: "B", layarAwal: "status" });
    app.pasang();

    const r = app.hitungRingkasan();
    expect(r.hasil).toBe("ok");
    if (r.hasil !== "ok") return;
    expect(r.rujukan.tingkat).toBe("rujuk");
    expect(r.pola).toBeNull();
    expect(r.belanja).toBeNull();
    expect(r.muatan_ai_status).toBeNull();
    expect(r.muatan_ai_menu).toHaveLength(0);

    // Di layar status, kartu AI tidak boleh muncul saat tingkat === "rujuk"
    expect(app.ambilHtml()).not.toContain('data-ai-teks="true"');

    // Jika pengguna membuka layar piring pada kondisi rujuk, menu mandiri dihentikan
    app.bukaLayar("piring");
    expect(app.ambilHtml()).toContain("Rekomendasi Menu Dihentikan Sementara");
    expect(app.ambilHtml()).not.toContain('data-ai-teks="true"');

    // Di layar bahaya, terdapat nomor darurat 119 dan alasan rujukan
    app.bukaLayar("bahaya");
    const htmlBahaya = app.ambilHtml();
    expect(htmlBahaya).toContain("tel:119");
    expect(htmlBahaya).toContain("tanda_bahaya:tidak_mau_minum_atau_menyusu");
    expect(htmlBahaya).not.toContain('data-ai-teks="true"');
  });

  it("Kasus Sintetis C (18 bln, pantang telur) menyaring alergen telur dari seluruh menu dan daftar belanja", () => {
    const akar = buatAkarPalsu();
    const app = new LayarRona(akar, { presetAwal: "C", layarAwal: "piring" });
    app.pasang();

    const r = app.hitungRingkasan();
    expect(r.hasil).toBe("ok");
    if (r.hasil !== "ok" || !r.pola || !r.belanja) return;

    for (const h of r.pola.hari) {
      for (const s of h.slot) {
        for (const it of s.item) {
          expect(it.bahan_id).not.toContain("telur");
        }
      }
    }
    for (const b of r.belanja.item) {
      expect(b.bahan_id).not.toContain("telur");
    }
  });

  it("mendukung koreksi cara ukur berdiri (+0,7 cm), penghentian usia di luar 6–23 bulan, pernyataan privasi jujur, dan reset memori sesi", () => {
    const akar = buatAkarPalsu();
    const app = new LayarRona(akar, { presetAwal: "A", layarAwal: "gerbang" });
    app.pasang();

    expect(app.ambilHtml()).toContain(PERNYATAAN_PRIVASI_AI);

    // Ubah cara ukur ke berdiri -> koreksi +0,7 cm muncul di layar status
    app.aturMasukanKustom((m) => {
      m.status.cara_ukur = "berdiri";
    });
    app.bukaLayar("status");
    expect(app.ambilHtml()).toContain(
      "Koreksi Cara Ukur Berdiri (+0,7 cm) Diterapkan",
    );

    // Ubah usia ke 4 bulan -> di luar cakupan (ASI Eksklusif)
    app.aturMasukanKustom((m) => {
      m.status.umur.bulan = 4;
    });
    const rStop = app.hitungRingkasan();
    expect(rStop.hasil).toBe("stop");
    app.bukaLayar("status");
    expect(app.ambilHtml()).toContain("usia_di_bawah_6_bulan");
    expect(app.ambilHtml()).toContain("ASI Eksklusif");

    // Reset sesi kembali ke Kasus Sintetis A dan layar gerbang
    app.resetSesiKeAwal();
    expect(app.ambilState().presetAktif).toBe("A");
    expect(app.ambilState().layar).toBe("gerbang");
    expect(app.ambilState().masukan.status.umur.bulan).toBe(
      PRESET_SINTETIS.A.masukan.status.umur.bulan,
    );
  });

  it("memiliki berkas PWA (manifest.webmanifest & sw.js) dan index.html yang patuh CSP script-src 'self'", () => {
    const rootDir = resolve(__dirname, "..");
    const manifestPath = resolve(rootDir, "public/manifest.webmanifest");
    const swPath = resolve(rootDir, "public/sw.js");
    const indexPath = resolve(rootDir, "index.html");

    expect(existsSync(manifestPath)).toBe(true);
    expect(existsSync(swPath)).toBe(true);
    expect(existsSync(indexPath)).toBe(true);

    const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as Record<
      string,
      unknown
    >;
    expect(manifest.lang).toBe("id");
    expect(manifest.display).toBe("standalone");

    const swIsi = readFileSync(swPath, "utf8");
    expect(swIsi).toContain("/v1/jelaskan");
    expect(swIsi).toContain("caches.open");

    const indexIsi = readFileSync(indexPath, "utf8");
    expect(indexIsi).toContain('rel="manifest" href="/manifest.webmanifest"');
    expect(indexIsi).toContain('id="lisensi-font"');
    expect(indexIsi).not.toContain("100% LURING");

    // Pastikan tidak ada <script> inline yang dieksekusi (hanya type="text/plain" dan type="module" src="...")
    const scriptTags = indexIsi.match(/<script\b[^>]*>/gi) ?? [];
    expect(scriptTags.length).toBe(2);
    for (const tag of scriptTags) {
      const aman =
        tag.includes('type="text/plain"') ||
        (tag.includes('type="module"') && tag.includes('src="/src/main.ts"'));
      expect(aman).toBe(true);
    }
  });
});
