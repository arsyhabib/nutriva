import { describe, expect, it } from "vitest";
import { buatAcak } from "../src/engine/prng";
import { BATAS_TINGGI_GELOMBANG, PARAM_GELOMBANG, langkahGelombang } from "../src/ui/fisika";

const N = 40;

function jalankan(dt: number, detik: number, impuls: boolean, viskositas = 0.92): { maks: number; akhir: number; selisih: number } {
  const h = new Float32Array(N);
  const v = new Float32Array(N);
  const acak = buatAcak("uji-gelombang");
  let fase = 0;
  let maks = 0;
  const langkah = Math.round(detik / dt);
  for (let t = 0; t < langkah; t++) {
    if (impuls && t % 40 === 0) {
      const k = Math.floor(acak() * N);
      v[k] = (v[k] ?? 0) + (acak() - 0.5) * 60;
    }
    fase += dt * 2.1;
    langkahGelombang(h, v, dt, fase, 1.35, { ...PARAM_GELOMBANG, viskositas });
    for (let i = 0; i < N; i++) maks = Math.max(maks, Math.abs(h[i] ?? 0));
  }
  let akhir = 0;
  let selisih = 0;
  for (let i = 0; i < N; i++) {
    akhir = Math.max(akhir, Math.abs(h[i] ?? 0));
    if (i > 0) selisih = Math.max(selisih, Math.abs((h[i] ?? 0) - (h[i - 1] ?? 0)));
  }
  return { maks, akhir, selisih };
}

/** Skema lama (sebelum perbaikan), dipertahankan di sini hanya untuk membuktikan bahwa ia memang tidak stabil. */
function skemaLama(dt: number, detik: number): number {
  const h = new Float32Array(N);
  const v = new Float32Array(N);
  let maks = 0;
  const damp = Math.pow(0.92, dt * 18);
  for (let t = 0; t < Math.round(detik / dt); t++) {
    for (let i = 0; i < N; i++) v[i] = ((v[i] ?? 0) + -165 * ((h[i] ?? 0) - Math.sin(i * 0.28 + t * dt * 2.1) * 1.35) * dt) * damp;
    for (let j = 0; j < 2; j++)
      for (let i = 0; i < N; i++) {
        if (i > 0) {
          const d = 190 * ((h[i] ?? 0) - (h[i - 1] ?? 0)) * dt;
          v[i - 1] = (v[i - 1] ?? 0) + d;
          v[i] = (v[i] ?? 0) - d;
        }
        if (i < N - 1) {
          const d = 190 * ((h[i] ?? 0) - (h[i + 1] ?? 0)) * dt;
          v[i + 1] = (v[i + 1] ?? 0) + d;
          v[i] = (v[i] ?? 0) - d;
        }
      }
    for (let i = 0; i < N; i++) {
      h[i] = (h[i] ?? 0) + (v[i] ?? 0) * dt;
      maks = Math.max(maks, Math.abs(h[i] ?? 0));
    }
  }
  return maks;
}

describe("solver gelombang bejana: stabil pada semua laju bingkai", () => {
  it("skema lama meledak (NaN) pada bingkai lambat 45 ms: akar penyebab belang dan bejana macet", () => {
    expect(Number.isFinite(skemaLama(1 / 60, 3))).toBe(true);
    expect(Number.isFinite(skemaLama(0.045, 3))).toBe(false);
  });

  for (const [nama, dt] of [["60 fps", 1 / 60], ["30 fps", 1 / 30], ["20 fps", 1 / 20], ["bingkai terlambat 45 ms", 0.045]] as const) {
    it(`tetap terbatas dan halus pada ${nama} dengan gangguan acak`, () => {
      const r = jalankan(dt, 20, true);
      expect(Number.isFinite(r.maks)).toBe(true);
      expect(r.maks).toBeLessThanOrEqual(BATAS_TINGGI_GELOMBANG);
      expect(r.maks).toBeLessThan(23);
    });
    it(`tenang kembali tanpa gangguan pada ${nama} (tidak belang antar-kolom)`, () => {
      const r = jalankan(dt, 12, false);
      expect(r.akhir).toBeLessThan(3);
      // beda tinggi antar kolom bertetangga kecil: tidak ada pola papan catur
      expect(r.selisih).toBeLessThan(1.2);
    });
  }

  it("redam: setelah gangguan berhenti, amplitudo menurun", () => {
    const h = new Float32Array(N);
    const v = new Float32Array(N);
    v[20] = 40;
    let fase = 0;
    for (let t = 0; t < 120; t++) langkahGelombang(h, v, 1 / 60, (fase += 0.035), 0, PARAM_GELOMBANG);
    const awal = Math.max(...Array.from(h, Math.abs));
    for (let t = 0; t < 600; t++) langkahGelombang(h, v, 1 / 60, (fase += 0.035), 0, PARAM_GELOMBANG);
    const akhir = Math.max(...Array.from(h, Math.abs));
    expect(akhir).toBeLessThan(awal * 0.05 + 0.01);
  });

  it("masukan dt tidak sah (NaN, negatif, nol) tidak merusak keadaan", () => {
    const h = new Float32Array(N);
    const v = new Float32Array(N);
    for (const dt of [NaN, -1, 0, Infinity]) langkahGelombang(h, v, dt, 0, 1, PARAM_GELOMBANG);
    expect(Array.from(h).every(Number.isFinite)).toBe(true);
  });
});
