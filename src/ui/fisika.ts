import { buatAcak } from "../engine/prng";

/* ============================================================================
 * NUTRIVA RONA — MESIN FISIKA OPTIK & FLUIDA (ADAPTASI DETERMINISTIK)
 * Pendaran Bawah-Permukaan (SSS), Refleksi Fresnel, Bias Snellius,
 * Emulsi Cairan Keruh SutraField, Bejana Dual-Strata & Koreografi Pegas.
 * Menggunakan PRNG deterministik (buatAcak) tanpa Math.random().
 * ============================================================================ */

const prngFisika = buatAcak("rona-fisika-optik-v1");

function acakDeterministik(): number {
  return prngFisika();
}

export type ModeGerak = "penuh" | "hemat";
export type NamaPresetPegas = "sutra" | "nektar" | "batu" | "hening";
export type TemaRona = "fajar" | "dekap" | "terik" | "lensa";
export type StatusVisualRona = "cukup" | "perhatian" | "celah" | "bahaya" | "kosong";

/* ---------- 1. Pengendali Gerak & Skala Waktu ---------- */
const mqReduced =
  typeof window !== "undefined" && typeof window.matchMedia === "function"
    ? window.matchMedia("(prefers-reduced-motion: reduce)")
    : { matches: false, addEventListener: undefined };

export const Motion = {
  mode: (mqReduced.matches ? "hemat" : "penuh") as ModeGerak,
  userOverride: null as ModeGerak | null,
  timeScale: 1.0,
  isHemat(): boolean {
    return this.mode === "hemat";
  },
  setMode(m: ModeGerak, fromUser = false): void {
    if (fromUser) this.userOverride = m;
    this.mode = m === "hemat" ? "hemat" : "penuh";
    if (typeof document !== "undefined" && document.documentElement) {
      document.documentElement.setAttribute("data-motion", this.mode);
    }
    if (typeof window !== "undefined" && typeof window.dispatchEvent === "function") {
      window.dispatchEvent(
        new CustomEvent("rona:motion", {
          detail: { mode: this.mode, timeScale: this.timeScale },
        }),
      );
    }
  },
  setTimeScale(scale: number): void {
    this.timeScale = Math.max(0.1, Math.min(2.0, Number(scale) || 1.0));
    if (typeof document !== "undefined" && document.documentElement) {
      document.documentElement.setAttribute("data-timescale", String(this.timeScale));
    }
    if (typeof window !== "undefined" && typeof window.dispatchEvent === "function") {
      window.dispatchEvent(
        new CustomEvent("rona:timescale", { detail: { timeScale: this.timeScale } }),
      );
    }
  },
};

if (mqReduced.addEventListener) {
  mqReduced.addEventListener("change", (e: MediaQueryListEvent) => {
    if (!Motion.userOverride) {
      Motion.setMode(e.matches ? "hemat" : "penuh", false);
    }
  });
}
if (typeof document !== "undefined" && document.documentElement) {
  document.documentElement.setAttribute("data-motion", Motion.mode);
}

/* ---------- 2. Penjadwal RAF Tunggal (60fps Terkunci) & Frustum Culling ---------- */
export type TickerCallback = (
  dt: number,
  now: number,
  rawDt: number,
  frameCount: number,
) => void;

const tasks = new Set<TickerCallback>();
let rafId = 0;
let lastT = typeof performance !== "undefined" ? performance.now() : 0;
let frameCount = 0;

function tick(now: number): void {
  frameCount = (frameCount + 1) | 0;
  const rawDt = Math.min(0.045, Math.max(0.001, (now - lastT) / 1000));
  lastT = now;
  const dt = rawDt * Motion.timeScale;
  tasks.forEach((fn) => {
    try {
      fn(dt, now, rawDt, frameCount);
    } catch {
      tasks.delete(fn);
    }
  });
  if (tasks.size > 0 && typeof requestAnimationFrame === "function") {
    rafId = requestAnimationFrame(tick);
  } else {
    rafId = 0;
  }
}

export const Ticker = {
  add(fn: TickerCallback): void {
    tasks.add(fn);
    if (!rafId && typeof requestAnimationFrame === "function") {
      lastT = typeof performance !== "undefined" ? performance.now() : 0;
      rafId = requestAnimationFrame(tick);
    }
  },
  remove(fn: TickerCallback): void {
    tasks.delete(fn);
    if (tasks.size === 0 && rafId && typeof cancelAnimationFrame === "function") {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
  },
  count(): number {
    return tasks.size;
  },
  frame(): number {
    return frameCount;
  },
};

interface CachedRect {
  left: number;
  top: number;
  width: number;
  height: number;
  gen: number;
}

let rectGeneration = 1;
const rectMap = new WeakMap<Element, CachedRect>();

if (typeof window !== "undefined" && typeof window.addEventListener === "function") {
  const bumpRectGen = (): void => {
    rectGeneration = (rectGeneration + 1) | 0;
  };
  window.addEventListener("scroll", bumpRectGen, { passive: true, capture: true });
  window.addEventListener("resize", bumpRectGen, { passive: true });
}

export function ambilRectCepat(el: Element | null, paksaSegar = false): CachedRect {
  if (!el || typeof el.getBoundingClientRect !== "function") {
    return { left: 0, top: 0, width: 0, height: 0, gen: rectGeneration };
  }
  let entry = rectMap.get(el);
  if (!entry || entry.gen !== rectGeneration || paksaSegar) {
    const r = el.getBoundingClientRect();
    entry = {
      left: r.left,
      top: r.top,
      width: r.width,
      height: r.height,
      gen: rectGeneration,
    };
    rectMap.set(el, entry);
  }
  return entry;
}

const visCallbacks = new WeakMap<Element, (vis: boolean) => void>();
const io =
  typeof IntersectionObserver !== "undefined"
    ? new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const cb = visCallbacks.get(entry.target);
            if (cb) cb(entry.isIntersecting);
          });
        },
        { rootMargin: "24px 0px" },
      )
    : null;

export function observe(el: Element | null, cb: (vis: boolean) => void): () => void {
  if (!el) return () => {};
  if (!io) {
    cb(true);
    return () => {};
  }
  visCallbacks.set(el, cb);
  io.observe(el);
  return () => {
    visCallbacks.delete(el);
    io.unobserve(el);
  };
}

/* ---------- 3. Penyelesai Pegas Sub-Langkah (Semi-Implicit Euler) ---------- */
const PRESET_PEGAS: Record<NamaPresetPegas, { k: number; c: number }> = {
  sutra: { k: 210, c: 22 }, // ζ ≈ 0.76 — ayunan sutra hangat
  nektar: { k: 145, c: 20 }, // ζ ≈ 0.83 — endapan nektar kental
  batu: { k: 290, c: 32 }, // ζ ≈ 0.94 — mantap & tenang
  hening: { k: 420, c: 41 }, // ζ = 1.00 — redaman kritis tanpa pantulan (Darurat A8)
};

export class Pegas {
  x: number;
  target: number;
  v: number;
  k: number;
  c: number;

  constructor(
    nilaiAwal = 0,
    presetAtauOpsi: NamaPresetPegas | { k?: number; c?: number } = "sutra",
  ) {
    const p =
      typeof presetAtauOpsi === "string"
        ? PRESET_PEGAS[presetAtauOpsi] || PRESET_PEGAS.sutra
        : { ...PRESET_PEGAS.sutra, ...presetAtauOpsi };
    this.x = nilaiAwal;
    this.target = nilaiAwal;
    this.v = 0;
    this.k = p.k;
    this.c = p.c;
  }

  setPreset(nama: NamaPresetPegas): void {
    const p = PRESET_PEGAS[nama] || PRESET_PEGAS.sutra;
    this.k = p.k;
    this.c = p.c;
  }

  ke(targetBaru: number, doronganV?: number): void {
    this.target = targetBaru;
    if (typeof doronganV === "number") this.v += doronganV;
    if (Motion.isHemat()) {
      this.x = targetBaru;
      this.v = 0;
    }
  }

  langkah(dt: number): number {
    if (Motion.isHemat()) {
      this.x = this.target;
      this.v = 0;
      return this.x;
    }
    const steps = 4;
    const h = Math.min(0.032, dt) / steps;
    for (let i = 0; i < steps; i++) {
      const f = -this.k * (this.x - this.target) - this.c * this.v;
      this.v += f * h;
      this.x += this.v * h;
    }
    if (Math.abs(this.x - this.target) < 0.0003 && Math.abs(this.v) < 0.0003) {
      this.x = this.target;
      this.v = 0;
    }
    return this.x;
  }

  diam(): boolean {
    return Math.abs(this.x - this.target) < 0.0006 && Math.abs(this.v) < 0.0006;
  }
}

export function geserKe(
  el: HTMLElement | null,
  dariY = 14,
  presetNama: NamaPresetPegas = "sutra",
): void {
  if (!el || !el.style) return;
  if (Motion.isHemat()) {
    el.style.transform = "";
    return;
  }
  const pegas = new Pegas(dariY, presetNama);
  pegas.ke(0);
  const step: TickerCallback = (dt) => {
    const y = pegas.langkah(dt);
    el.style.transform = `translate3d(0,${y.toFixed(2)}px,0)`;
    if (pegas.diam()) {
      el.style.transform = "";
      Ticker.remove(step);
    }
  };
  Ticker.add(step);
}

/* ---------- 4. OptikRona — Sumber Cahaya Tunggal Global, Refleksi Fresnel & Riak Sentuh ---------- */
export const CahayaGlobal = {
  x: 0.24,
  y: 0.14,
  pegasX: new Pegas(0.24, "nektar"),
  pegasY: new Pegas(0.14, "nektar"),
  phase: 0,
  aktif: false,
};

let optikGlobalSudahJalan = false;

export function inisialisasiOptikGlobal(): void {
  if (optikGlobalSudahJalan) return;
  if (typeof window === "undefined" || typeof document === "undefined" || !document.documentElement) {
    return;
  }
  optikGlobalSudahJalan = true;
  const docEl = document.documentElement;
  let vw = window.innerWidth || 1280;
  let vh = window.innerHeight || 800;
  let lastDomX = -1;
  let lastDomY = -1;

  window.addEventListener(
    "resize",
    () => {
      vw = window.innerWidth || 1280;
      vh = window.innerHeight || 800;
    },
    { passive: true },
  );

  window.addEventListener(
    "pointermove",
    (e: PointerEvent) => {
      if (Motion.isHemat()) return;
      const nx = Math.max(0.04, Math.min(0.96, e.clientX / vw));
      const ny = Math.max(0.04, Math.min(0.96, e.clientY / vh));
      CahayaGlobal.pegasX.ke(0.22 + (nx - 0.5) * 0.56);
      CahayaGlobal.pegasY.ke(0.14 + (ny - 0.5) * 0.48);
      CahayaGlobal.aktif = true;
    },
    { passive: true },
  );

  Ticker.add((dt, _now, _rawDt, fCount) => {
    if (Motion.isHemat()) return;
    CahayaGlobal.phase += dt * 0.55;
    if (!CahayaGlobal.aktif) {
      CahayaGlobal.pegasX.ke(0.24 + Math.sin(CahayaGlobal.phase) * 0.08);
      CahayaGlobal.pegasY.ke(0.14 + Math.cos(CahayaGlobal.phase * 0.8) * 0.05);
    }
    CahayaGlobal.x = CahayaGlobal.pegasX.langkah(dt);
    CahayaGlobal.y = CahayaGlobal.pegasY.langkah(dt);

    if ((fCount & 1) === 0) {
      const dx = Math.abs(CahayaGlobal.x - lastDomX);
      const dy = Math.abs(CahayaGlobal.y - lastDomY);
      if (dx > 0.0025 || dy > 0.0025) {
        lastDomX = CahayaGlobal.x;
        lastDomY = CahayaGlobal.y;
        const sudut =
          Math.atan2(0.5 - CahayaGlobal.y, 0.5 - CahayaGlobal.x) * (180 / Math.PI) + 90;
        docEl.style.setProperty("--cahaya-x", `${(CahayaGlobal.x * 100).toFixed(1)}%`);
        docEl.style.setProperty("--cahaya-y", `${(CahayaGlobal.y * 100).toFixed(1)}%`);
        docEl.style.setProperty("--cahaya-sudut", `${sudut.toFixed(1)}deg`);
        docEl.style.setProperty("--bayangan-x", `${((0.5 - CahayaGlobal.x) * 18).toFixed(1)}px`);
        docEl.style.setProperty("--bayangan-y", `${((0.6 - CahayaGlobal.y) * 22).toFixed(1)}px`);
      }
    }
  });
}

const WeakOptikBound = new WeakSet<Element>();

export function pasangEfekOptik(rootEl: ParentNode | null): void {
  if (!rootEl || typeof rootEl.querySelectorAll !== "function") return;

  const selektorKartu = ".kartu, .bejana, .sajian, .kartu-bagi, .dock-panel";
  const selektorKlik =
    ".btn, .chip, .pilihan-item, .bahan-pil__aksi, .preset-btn, .jump-btn, .seg-btn, .hp__nav-btn, .lembar__detent-btn";

  rootEl.querySelectorAll<HTMLElement>(selektorKartu).forEach((card) => {
    if (WeakOptikBound.has(card)) return;
    WeakOptikBound.add(card);

    let cardRaf = 0;
    let cx = 0;
    let cy = 0;

    card.addEventListener(
      "pointerenter",
      () => {
        if (Motion.isHemat()) return;
        ambilRectCepat(card, true);
      },
      { passive: true },
    );

    card.addEventListener(
      "pointermove",
      (e: PointerEvent) => {
        if (Motion.isHemat()) return;
        cx = e.clientX;
        cy = e.clientY;
        if (!cardRaf && typeof requestAnimationFrame === "function") {
          cardRaf = requestAnimationFrame(() => {
            cardRaf = 0;
            const r = ambilRectCepat(card, false);
            if (!r.width || !r.height) return;
            const relX = (cx - r.left) / r.width;
            const relY = (cy - r.top) / r.height;
            const lx = relX * 100;
            const ly = relY * 100;
            const degX = ((0.5 - relY) * 3.2).toFixed(2);
            const degY = ((relX - 0.5) * 3.6).toFixed(2);
            card.style.setProperty("--lx", `${lx.toFixed(1)}%`);
            card.style.setProperty("--ly", `${ly.toFixed(1)}%`);
            card.style.setProperty("--tilt-x", `${degX}deg`);
            card.style.setProperty("--tilt-y", `${degY}deg`);
            card.style.setProperty("--fresnel-alpha", "1");
          });
        }
      },
      { passive: true },
    );

    card.addEventListener(
      "pointerleave",
      () => {
        if (cardRaf && typeof cancelAnimationFrame === "function") {
          cancelAnimationFrame(cardRaf);
          cardRaf = 0;
        }
        card.style.setProperty("--tilt-x", "0deg");
        card.style.setProperty("--tilt-y", "0deg");
        card.style.setProperty("--fresnel-alpha", "0.55");
      },
      { passive: true },
    );
  });

  rootEl.querySelectorAll<HTMLElement>(selektorKlik).forEach((btn) => {
    if (WeakOptikBound.has(btn)) return;
    WeakOptikBound.add(btn);

    let btnRaf = 0;
    let bx = 0;
    let by = 0;

    btn.addEventListener(
      "pointerenter",
      () => {
        if (Motion.isHemat()) return;
        ambilRectCepat(btn, true);
      },
      { passive: true },
    );

    btn.addEventListener(
      "pointermove",
      (e: PointerEvent) => {
        if (Motion.isHemat()) return;
        bx = e.clientX;
        by = e.clientY;
        if (!btnRaf && typeof requestAnimationFrame === "function") {
          btnRaf = requestAnimationFrame(() => {
            btnRaf = 0;
            const r = ambilRectCepat(btn, false);
            if (!r.width || !r.height) return;
            btn.style.setProperty("--bx", `${(((bx - r.left) / r.width) * 100).toFixed(1)}%`);
            btn.style.setProperty("--by", `${(((by - r.top) / r.height) * 100).toFixed(1)}%`);
          });
        }
      },
      { passive: true },
    );

    btn.addEventListener(
      "pointerdown",
      (e: PointerEvent) => {
        if (Motion.isHemat() || typeof document === "undefined") return;
        const r = ambilRectCepat(btn, true);
        if (!r.width || !r.height) return;
        const rx = e.clientX - r.left;
        const ry = e.clientY - r.top;
        const riak = document.createElement("span");
        riak.className = "riak-cahaya";
        riak.style.left = `${rx.toFixed(1)}px`;
        riak.style.top = `${ry.toFixed(1)}px`;
        btn.appendChild(riak);
        setTimeout(() => {
          if (riak.parentNode) riak.parentNode.removeChild(riak);
        }, 680);
      },
      { passive: true },
    );
  });
}

/* ---------- 5. SutraField — Warna Bertingkat + Emulsi Cairan Keruh + 1 Sumber Cahaya ---------- */
interface PaletSutra {
  tier0: string;
  tier1: string;
  tier2: string;
  tier3: string;
  keruhSusu: string;
  keruhRose: string;
  keruhSage: string;
  cahayaInti: string;
  cahayaHalo: string;
  rose: string;
  amber: string;
  sage: string;
  kilauPuncak: string;
  beku: string;
}

const PALET_SUTRA: Record<TemaRona, PaletSutra> = {
  dekap: {
    tier0: "#231621",
    tier1: "#191118",
    tier2: "#130D12",
    tier3: "#0C080B",
    keruhSusu: "rgba(247, 222, 206, 0.11)",
    keruhRose: "rgba(244, 143, 162, 0.16)",
    keruhSage: "rgba(104, 212, 180, 0.11)",
    cahayaInti: "rgba(255, 222, 192, 0.34)",
    cahayaHalo: "rgba(244, 143, 162, 0.14)",
    rose: "rgba(244, 143, 162, 0.15)",
    amber: "rgba(245, 184, 100, 0.12)",
    sage: "rgba(104, 212, 180, 0.11)",
    kilauPuncak: "rgba(255, 240, 228, 0.62)",
    beku: "rgba(255, 133, 122, 0.18)",
  },
  terik: {
    tier0: "#FFFDF9",
    tier1: "#FAF3E8",
    tier2: "#F3E9D8",
    tier3: "#EBDEC8",
    keruhSusu: "rgba(255, 255, 255, 0.45)",
    keruhRose: "rgba(122, 24, 46, 0.05)",
    keruhSage: "rgba(13, 74, 56, 0.05)",
    cahayaInti: "rgba(255, 252, 240, 0.55)",
    cahayaHalo: "rgba(212, 132, 28, 0.07)",
    rose: "rgba(122, 24, 46, 0.07)",
    amber: "rgba(92, 50, 0, 0.06)",
    sage: "rgba(13, 74, 56, 0.06)",
    kilauPuncak: "rgba(122, 24, 46, 0.25)",
    beku: "rgba(158, 17, 17, 0.14)",
  },
  lensa: {
    tier0: "#F8F8FD",
    tier1: "#EFEFF8",
    tier2: "#E6E7F4",
    tier3: "#DDDFF0",
    keruhSusu: "rgba(255, 255, 255, 0.55)",
    keruhRose: "rgba(59, 66, 159, 0.09)",
    keruhSage: "rgba(23, 94, 73, 0.07)",
    cahayaInti: "rgba(255, 255, 255, 0.72)",
    cahayaHalo: "rgba(59, 66, 159, 0.12)",
    rose: "rgba(59, 66, 159, 0.09)",
    amber: "rgba(158, 42, 66, 0.07)",
    sage: "rgba(23, 94, 73, 0.08)",
    kilauPuncak: "rgba(59, 66, 159, 0.34)",
    beku: "rgba(180, 30, 30, 0.14)",
  },
  fajar: {
    tier0: "#FFF9F4",
    tier1: "#FAF0E6",
    tier2: "#F3E3D5",
    tier3: "#EBD5C3",
    keruhSusu: "rgba(255, 252, 248, 0.58)",
    keruhRose: "rgba(184, 58, 84, 0.12)",
    keruhSage: "rgba(29, 104, 82, 0.09)",
    cahayaInti: "rgba(255, 250, 242, 0.85)",
    cahayaHalo: "rgba(224, 128, 68, 0.16)",
    rose: "rgba(184, 58, 84, 0.12)",
    amber: "rgba(212, 132, 28, 0.11)",
    sage: "rgba(29, 104, 82, 0.09)",
    kilauPuncak: "rgba(255, 255, 255, 0.88)",
    beku: "rgba(184, 30, 30, 0.15)",
  },
};

interface AtlasSutra {
  siap: boolean;
  awan: (HTMLCanvasElement | null)[];
  wake: HTMLCanvasElement | null;
  lightCone: HTMLCanvasElement | null;
  lightOrb: HTMLCanvasElement | null;
  bokeh: (HTMLCanvasElement | null)[];
  bokehPuncak: HTMLCanvasElement | null;
}

const ATLAS_SUTRA: Partial<Record<TemaRona, AtlasSutra>> = {};

function buatSpriteRadial(
  size: number,
  innerRatio: number,
  stops: [number, string][],
): HTMLCanvasElement | null {
  if (typeof document === "undefined" || typeof document.createElement !== "function") return null;
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const gCtx = c.getContext ? c.getContext("2d") : null;
  if (!gCtx || typeof gCtx.createRadialGradient !== "function") return null;
  const half = size * 0.5;
  const grad = gCtx.createRadialGradient(
    half,
    half,
    Math.max(0.5, half * innerRatio),
    half,
    half,
    half,
  );
  for (let i = 0; i < stops.length; i++) {
    const st = stops[i];
    if (st) grad.addColorStop(st[0], st[1]);
  }
  gCtx.fillStyle = grad;
  gCtx.fillRect(0, 0, size, size);
  return c;
}

function ambilAtlasSutra(theme: TemaRona): AtlasSutra {
  const key: TemaRona = PALET_SUTRA[theme] ? theme : "fajar";
  const cached = ATLAS_SUTRA[key];
  if (cached) return cached;
  const pal = PALET_SUTRA[key];
  const warnaKeruh = [pal.keruhSusu, pal.keruhRose, pal.keruhSage];
  const colors = [pal.rose, pal.amber, pal.sage];

  const awan = [0, 1, 2].map((t) =>
    buatSpriteRadial(128, 0.06, [
      [0, warnaKeruh[t] ?? pal.keruhSusu],
      [0.55, warnaKeruh[(t + 1) % 3] ?? pal.keruhRose],
      [1, "rgba(0, 0, 0, 0)"],
    ]),
  );
  const wake = buatSpriteRadial(96, 0.04, [
    [0, pal.cahayaInti],
    [0.5, pal.keruhRose],
    [1, "rgba(0, 0, 0, 0)"],
  ]);
  const lightCone = buatSpriteRadial(256, 0.008, [
    [0.0, pal.cahayaInti],
    [0.32, pal.cahayaHalo],
    [1.0, "rgba(0, 0, 0, 0)"],
  ]);
  const lightOrb = buatSpriteRadial(96, 0.02, [
    [0, pal.kilauPuncak],
    [0.4, pal.cahayaInti],
    [1, "rgba(0, 0, 0, 0)"],
  ]);
  const bokeh = [0, 1, 2].map((hIdx) =>
    buatSpriteRadial(36, 0.04, [
      [0, colors[hIdx] ?? pal.rose],
      [1, "rgba(0, 0, 0, 0)"],
    ]),
  );
  const bokehPuncak = buatSpriteRadial(36, 0.04, [
    [0, pal.kilauPuncak],
    [1, "rgba(0, 0, 0, 0)"],
  ]);

  const atlas: AtlasSutra = {
    siap: Boolean(awan[0] && wake && lightCone && lightOrb && bokeh[0] && bokehPuncak),
    awan,
    wake,
    lightCone,
    lightOrb,
    bokeh,
    bokehPuncak,
  };
  ATLAS_SUTRA[key] = atlas;
  return atlas;
}

export interface OpsiSutraField {
  cols?: number;
  rows?: number;
  damping?: number;
  ribbons?: number;
  motes?: number;
  interactive?: boolean;
}

let sutraInstanceCounter = 0;

export class SutraField {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D | null;
  lodId: number;
  opts: Required<OpsiSutraField>;
  isAtelierBg: boolean;
  isHovered = false;
  private _accDt = 0;
  u: Float32Array;
  uPrev: Float32Array;
  private _ribbonY: Float32Array;
  private _bgGrad: CanvasGradient | null = null;
  private _bgTheme = "";
  private _bgW = 0;
  private _bgH = 0;
  beku = false;
  bekuAlpha = 0;
  phase: number;
  visible = false;
  dpr = 1;
  w = 300;
  h = 200;
  lightX = new Pegas(0.24, "nektar");
  lightY = new Pegas(0.14, "nektar");
  pointerX = 0.24;
  pointerY = 0.14;
  pointerActive = false;
  awanKeruh: {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    tipe: number;
  }[] = [];
  jejakKeruh: { x: number; y: number; r: number; alpha: number }[] = [];
  partikel: {
    x: number;
    y: number;
    r: number;
    vx: number;
    vy: number;
    hue: number;
  }[] = [];
  private _step: TickerCallback;
  private _ro: ResizeObserver | null = null;
  private _unobserve: () => void = () => {};

  constructor(canvas: HTMLCanvasElement, opts?: OpsiSutraField) {
    this.canvas = canvas;
    this.ctx = canvas.getContext ? canvas.getContext("2d") : null;
    this.lodId = ++sutraInstanceCounter;
    this.opts = {
      cols: opts?.cols ?? 32,
      rows: opts?.rows ?? 20,
      damping: opts?.damping ?? 0.972,
      ribbons: opts?.ribbons ?? 5,
      motes: opts?.motes ?? 14,
      interactive: opts?.interactive ?? true,
    };

    this.isAtelierBg = Boolean(canvas.classList && canvas.classList.contains("atelier-bg"));
    const n = this.opts.cols * this.opts.rows;
    this.u = new Float32Array(n);
    this.uPrev = new Float32Array(n);
    this._ribbonY = new Float32Array(29);
    this.phase = acakDeterministik() * 10;

    for (let k = 0; k < 7; k++) {
      this.awanKeruh.push({
        x: 0.12 + (k / 6) * 0.76,
        y: 0.18 + ((k * 37) % 100) / 145,
        vx: (acakDeterministik() - 0.5) * 0.015,
        vy: (acakDeterministik() - 0.5) * 0.012,
        radius: 0.24 + (k % 3) * 0.08,
        tipe: k % 3,
      });
    }

    for (let i = 0; i < this.opts.motes; i++) {
      this.partikel.push({
        x: acakDeterministik(),
        y: acakDeterministik(),
        r: 1.8 + acakDeterministik() * 3.8,
        vx: (acakDeterministik() - 0.5) * 0.012,
        vy: -0.005 - acakDeterministik() * 0.01,
        hue: i % 3,
      });
    }

    this._step = (dt) => {
      this._accDt = 0;
      this.langkah(dt);
    };

    this.resize();
    if (typeof ResizeObserver !== "undefined") {
      this._ro = new ResizeObserver(() => this.resize());
      this._ro.observe(canvas);
    }

    this._unobserve = observe(canvas, (vis) => {
      this.visible = vis;
      if (vis && !Motion.isHemat()) {
        Ticker.add(this._step);
      } else {
        Ticker.remove(this._step);
        if (vis) this.gambarStatis();
      }
    });

    if (this.opts.interactive && typeof window !== "undefined") {
      const targetListener: EventTarget = this.isAtelierBg
        ? window
        : canvas.parentElement || canvas;

      const handlePointer = (e: Event, isDown: boolean): void => {
        if (this.beku || Motion.isHemat()) return;
        const pe = e as PointerEvent;
        const r = this.isAtelierBg
          ? { left: 0, top: 0, width: this.w, height: this.h }
          : ambilRectCepat(canvas, false);
        if (!r.width || !r.height) return;
        const nx = (pe.clientX - r.left) / r.width;
        const ny = (pe.clientY - r.top) / r.height;
        if (nx < -0.15 || nx > 1.15 || ny < -0.15 || ny > 1.15) return;

        const cx = Math.max(0.02, Math.min(0.98, nx));
        const cy = Math.max(0.02, Math.min(0.98, ny));
        this.pointerX = cx;
        this.pointerY = cy;
        this.pointerActive = true;

        this.lightX.ke(0.22 + (cx - 0.5) * 0.54);
        this.lightY.ke(0.14 + (cy - 0.5) * 0.46);

        for (let k = 0; k < this.awanKeruh.length; k++) {
          const aw = this.awanKeruh[k];
          if (!aw) continue;
          const dx = aw.x - cx;
          const dy = aw.y - cy;
          const dist = Math.hypot(dx, dy) + 0.001;
          if (dist < 0.38) {
            const push = ((0.38 - dist) / 0.38) * (isDown ? 0.095 : 0.032);
            aw.vx += (dx / dist) * push;
            aw.vy += (dy / dist) * push;
          }
        }

        if (this.jejakKeruh.length < 16) {
          this.jejakKeruh.push({
            x: cx,
            y: cy,
            r: isDown ? 0.15 : 0.09,
            alpha: isDown ? 0.52 : 0.28,
          });
        }

        this.tetes(cx, cy, isDown ? 1.45 : 0.58);
      };

      targetListener.addEventListener("pointermove", (e) => handlePointer(e, false), {
        passive: true,
      });
      targetListener.addEventListener("pointerdown", (e) => handlePointer(e, true), {
        passive: true,
      });

      window.addEventListener("rona:motion", () => {
        if (Motion.isHemat()) {
          Ticker.remove(this._step);
          this.gambarStatis();
        } else if (this.visible) {
          Ticker.add(this._step);
        }
      });
    }
  }

  destroy(): void {
    Ticker.remove(this._step);
    this._unobserve();
    if (this._ro) this._ro.disconnect();
  }

  resize(): void {
    const r = ambilRectCepat(this.canvas, true);
    const rw =
      r.width ||
      this.canvas.clientWidth ||
      (typeof window !== "undefined" ? window.innerWidth : 392) ||
      392;
    const rh =
      r.height ||
      this.canvas.clientHeight ||
      (typeof window !== "undefined" ? window.innerHeight : 848) ||
      848;
    const nativeDpr = Math.min(
      typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1,
      2,
    );
    this.dpr = this.isAtelierBg
      ? Math.max(0.55, Math.min(nativeDpr, 1.5) * 0.6)
      : Math.min(nativeDpr, 1.5);
    this.w = Math.max(60, Math.round(rw));
    this.h = Math.max(60, Math.round(rh));
    this.canvas.width = Math.round(this.w * this.dpr);
    this.canvas.height = Math.round(this.h * this.dpr);
    this._bgGrad = null;
    this.gambarStatis();
  }

  tetes(nx: number, ny: number, kuat: number): void {
    if (this.beku) return;
    const cols = this.opts.cols;
    const rows = this.opts.rows;
    const cx = Math.floor(nx * cols);
    const cy = Math.floor(ny * rows);
    for (let dy = -2; dy <= 2; dy++) {
      for (let dx = -2; dx <= 2; dx++) {
        const x = cx + dx;
        const y = cy + dy;
        if (x > 0 && x < cols - 1 && y > 0 && y < rows - 1) {
          const d2 = dx * dx + dy * dy;
          if (d2 <= 4) {
            const idx = y * cols + x;
            this.u[idx] = (this.u[idx] ?? 0) + kuat * Math.exp(-d2 * 0.55);
          }
        }
      }
    }
  }

  setBeku(statusBeku: boolean): void {
    this.beku = Boolean(statusBeku);
    if (this.beku) {
      this.u.fill(0);
      this.uPrev.fill(0);
      this.gambarStatis();
    }
  }

  ambilTemaKey(): TemaRona {
    const host =
      (this.canvas.closest && this.canvas.closest("[data-theme]")) ||
      (typeof document !== "undefined" ? document.documentElement : null);
    const theme = ((host && host.getAttribute("data-theme")) || "fajar") as TemaRona;
    return PALET_SUTRA[theme] ? theme : "fajar";
  }

  langkah(dt: number): void {
    if (!this.visible) return;
    const cols = this.opts.cols;
    const rows = this.opts.rows;
    const damp = this.beku ? 0.82 : this.opts.damping;

    this.lightX.langkah(dt);
    this.lightY.langkah(dt);

    if (!this.beku) {
      this.phase += dt * 0.85;
      if (!this.pointerActive) {
        this.lightX.ke(0.24 + Math.sin(this.phase * 0.45) * 0.09);
        this.lightY.ke(0.15 + Math.cos(this.phase * 0.35) * 0.06);
      }
      if (acakDeterministik() < 0.048) {
        this.tetes(
          0.2 + acakDeterministik() * 0.6,
          0.2 + acakDeterministik() * 0.6,
          0.35,
        );
      }

      const decay = Math.pow(0.45, dt);
      for (let k = 0; k < this.awanKeruh.length; k++) {
        const aw = this.awanKeruh[k];
        if (!aw) continue;
        aw.x += aw.vx * dt;
        aw.y += aw.vy * dt;
        aw.vx *= decay;
        aw.vy *= decay;
        aw.x += Math.sin(this.phase * 0.6 + k * 1.7) * 0.014 * dt;
        aw.y += Math.cos(this.phase * 0.5 + k * 2.1) * 0.011 * dt;
        if (aw.x < 0.05) aw.vx += 0.04 * dt;
        if (aw.x > 0.95) aw.vx -= 0.04 * dt;
        if (aw.y < 0.05) aw.vy += 0.04 * dt;
        if (aw.y > 0.95) aw.vy -= 0.04 * dt;
      }

      for (let j = this.jejakKeruh.length - 1; j >= 0; j--) {
        const jk = this.jejakKeruh[j];
        if (!jk) continue;
        jk.r += dt * 0.17;
        jk.alpha -= dt * 0.36;
        if (jk.alpha <= 0.005) {
          this.jejakKeruh.splice(j, 1);
        }
      }

      const u = this.u;
      const uPrev = this.uPrev;
      for (let y = 1; y < rows - 1; y++) {
        const rowOffset = y * cols;
        for (let x = 1; x < cols - 1; x++) {
          const idx = rowOffset + x;
          const lap =
            ((u[idx - 1] ?? 0) +
              (u[idx + 1] ?? 0) +
              (u[idx - cols] ?? 0) +
              (u[idx + cols] ?? 0)) *
              0.5 -
            (uPrev[idx] ?? 0);
          uPrev[idx] = lap * damp;
        }
      }
      this.u = uPrev;
      this.uPrev = u;
    } else {
      this.bekuAlpha = Math.min(1, this.bekuAlpha + dt * 6);
    }

    this.gambar(dt);
  }

  gambar(dt = 0): void {
    const ctx = this.ctx;
    if (!ctx) return;
    const w = this.w;
    const h = this.h;
    const themeKey = this.ambilTemaKey();
    const pal = PALET_SUTRA[themeKey];
    const atlas = ambilAtlasSutra(themeKey);
    const canBlit = Boolean(atlas && atlas.siap && typeof ctx.drawImage === "function");
    const maxDim = Math.max(w, h);

    ctx.save();
    ctx.scale(this.dpr, this.dpr);

    if (!this._bgGrad || this._bgTheme !== themeKey || this._bgW !== w || this._bgH !== h) {
      const bg = ctx.createLinearGradient(w * 0.12, 0, w * 0.88, h);
      bg.addColorStop(0.0, pal.tier0);
      bg.addColorStop(0.36, pal.tier1);
      bg.addColorStop(0.72, pal.tier2);
      bg.addColorStop(1.0, pal.tier3);
      this._bgGrad = bg;
      this._bgTheme = themeKey;
      this._bgW = w;
      this._bgH = h;
    }
    ctx.fillStyle = this._bgGrad;
    ctx.fillRect(0, 0, w, h);

    if (this.beku) {
      ctx.strokeStyle = pal.beku;
      ctx.lineWidth = 1.25;
      for (let i = 1; i <= 4; i++) {
        const y = (h / 5) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
      ctx.restore();
      return;
    }

    const lx = this.lightX.x * w;
    const ly = this.lightY.x * h;

    const warnaKeruh = [pal.keruhSusu, pal.keruhRose, pal.keruhSage];
    for (let k = 0; k < this.awanKeruh.length; k++) {
      const aw = this.awanKeruh[k];
      if (!aw) continue;
      const cx = aw.x * w;
      const cy = aw.y * h;
      const rad = aw.radius * maxDim;
      const spAwan = atlas.awan[aw.tipe];
      if (canBlit && spAwan) {
        ctx.drawImage(spAwan, cx - rad, cy - rad, rad * 2, rad * 2);
      } else {
        const gKeruh = ctx.createRadialGradient(cx, cy, rad * 0.06, cx, cy, rad);
        gKeruh.addColorStop(0, warnaKeruh[aw.tipe] ?? pal.keruhSusu);
        gKeruh.addColorStop(0.55, warnaKeruh[(aw.tipe + 1) % 3] ?? pal.keruhRose);
        gKeruh.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = gKeruh;
        ctx.beginPath();
        ctx.arc(cx, cy, rad, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    if (this.jejakKeruh.length > 0) {
      for (let j = 0; j < this.jejakKeruh.length; j++) {
        const jk = this.jejakKeruh[j];
        if (!jk) continue;
        const jx = jk.x * w;
        const jy = jk.y * h;
        const jr = jk.r * maxDim;
        const alphaWake = Math.max(0, Math.min(1, jk.alpha * 1.85));
        if (canBlit && atlas.wake) {
          ctx.globalAlpha = alphaWake;
          ctx.drawImage(atlas.wake, jx - jr, jy - jr, jr * 2, jr * 2);
        } else {
          const gWake = ctx.createRadialGradient(jx, jy, jr * 0.04, jx, jy, jr);
          gWake.addColorStop(0, pal.cahayaInti);
          gWake.addColorStop(0.5, pal.keruhRose);
          gWake.addColorStop(1, "rgba(0, 0, 0, 0)");
          ctx.globalAlpha = alphaWake;
          ctx.fillStyle = gWake;
          ctx.beginPath();
          ctx.arc(jx, jy, jr, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1.0;
    }

    const lightRadius = maxDim * 0.82;
    if (canBlit && atlas.lightCone) {
      ctx.drawImage(
        atlas.lightCone,
        lx - lightRadius,
        ly - lightRadius,
        lightRadius * 2,
        lightRadius * 2,
      );
    } else {
      const gLight = ctx.createRadialGradient(lx, ly, 2, lx, ly, lightRadius);
      gLight.addColorStop(0.0, pal.cahayaInti);
      gLight.addColorStop(0.32, pal.cahayaHalo);
      gLight.addColorStop(1.0, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = gLight;
      ctx.fillRect(0, 0, w, h);
    }

    const orbRad = Math.min(w, h) * 0.14;
    if (canBlit && atlas.lightOrb) {
      ctx.drawImage(atlas.lightOrb, lx - orbRad, ly - orbRad, orbRad * 2, orbRad * 2);
    } else {
      const gOrb = ctx.createRadialGradient(lx, ly, 1, lx, ly, orbRad);
      gOrb.addColorStop(0, pal.kilauPuncak);
      gOrb.addColorStop(0.4, pal.cahayaInti);
      gOrb.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = gOrb;
      ctx.beginPath();
      ctx.arc(lx, ly, orbRad, 0, Math.PI * 2);
      ctx.fill();
    }

    const ribbons = this.opts.ribbons;
    const colors = [pal.rose, pal.amber, pal.sage];
    const cols = this.opts.cols;
    const rows = this.opts.rows;
    const segs = 28;
    const invSegs = 1 / segs;
    const stepX = w * invSegs;
    const ribbonY = this._ribbonY;
    const normLx = Math.max(0.06, Math.min(0.94, this.lightX.x));

    for (let r = 0; r < ribbons; r++) {
      const baseY = ((r + 0.8) / (ribbons + 0.6)) * h;
      const colChoice = colors[r % colors.length] ?? pal.rose;
      const gy = Math.min(rows - 2, Math.max(1, Math.floor(((r + 1) / (ribbons + 1)) * rows)));
      const rowBase = gy * cols;
      const phaseR1 = this.phase * (0.7 + r * 0.14) + r * 1.3;
      const ampR1 = 10 + r * 2.5;
      const phaseR2 = -this.phase * 0.55 + r;

      ctx.beginPath();
      ctx.moveTo(0, h);
      ctx.lineTo(0, baseY);

      for (let s = 0; s <= segs; s++) {
        const nx = s * invSegs;
        const gx = Math.min(cols - 2, Math.max(1, (nx * cols) | 0));
        const waveVal = this.u[rowBase + gx] || 0;
        const y =
          baseY +
          Math.sin(nx * 4.2 + phaseR1) * ampR1 +
          Math.cos(nx * 7.1 + phaseR2) * 4.5 +
          waveVal * 28;
        ribbonY[s] = y;
        ctx.lineTo(s * stepX, y);
      }
      ctx.lineTo(w, h);
      ctx.closePath();
      ctx.fillStyle = colChoice;
      ctx.fill();

      const gradSpec = ctx.createLinearGradient(0, baseY, w, baseY);
      gradSpec.addColorStop(0, colChoice);
      gradSpec.addColorStop(Math.max(0, normLx - 0.24), colChoice);
      gradSpec.addColorStop(normLx, pal.kilauPuncak);
      gradSpec.addColorStop(Math.min(1, normLx + 0.24), colChoice);
      gradSpec.addColorStop(1, colChoice);

      ctx.beginPath();
      ctx.moveTo(0, ribbonY[0] ?? baseY);
      for (let s = 1; s <= segs; s++) {
        ctx.lineTo(s * stepX, ribbonY[s] ?? baseY);
      }
      ctx.strokeStyle = gradSpec;
      ctx.lineWidth = 1.6;
      ctx.stroke();
    }

    const stepDt = dt || 0;
    const invMaxDim = 1 / maxDim;
    for (let i = 0; i < this.partikel.length; i++) {
      const p = this.partikel[i];
      if (!p) continue;
      if (stepDt > 0) {
        p.x += p.vx * stepDt;
        p.y += p.vy * stepDt;
        if (this.pointerActive) {
          const dx = p.x - this.pointerX;
          const dy = p.y - this.pointerY;
          const d2 = dx * dx + dy * dy;
          if (d2 > 0.000001 && d2 < 0.0576) {
            const d = Math.sqrt(d2);
            const push = ((0.24 - d) / d) * 0.22 * stepDt;
            p.x += dx * push;
            p.y += dy * push;
          }
        }
        if (p.y < -0.05) p.y = 1.05;
        if (p.x < -0.05) p.x = 1.05;
        if (p.x > 1.05) p.x = -0.05;
      }
      const px = p.x * w;
      const py = p.y * h;
      const distLight = Math.hypot(px - lx, py - ly) * invMaxDim;
      const glow = Math.max(0.45, 1.35 - distLight * 1.15);
      const rDraw = p.r * glow * 2.2;
      const spBokeh = distLight < 0.34 ? atlas.bokehPuncak : atlas.bokeh[p.hue];
      if (canBlit && spBokeh) {
        ctx.drawImage(spBokeh, px - rDraw, py - rDraw, rDraw * 2, rDraw * 2);
      } else {
        const gBokeh = ctx.createRadialGradient(px, py, 0.5, px, py, rDraw);
        gBokeh.addColorStop(
          0,
          distLight < 0.34 ? pal.kilauPuncak : (colors[p.hue] ?? pal.rose),
        );
        gBokeh.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = gBokeh;
        ctx.beginPath();
        ctx.arc(px, py, rDraw, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();
  }

  gambarStatis(): void {
    this.gambar(0);
  }
}

/* ---------- 6. BejanaNektar — Bejana Kaca Silindris, Bias Snellius & Pendaran SSS ---------- */
interface WarnaStatusBejana {
  depan: string;
  dalam: string;
  pendar: string;
  belakang: string;
  kilau: string;
  garis: string;
}

interface PaletBejanaTema {
  cukup: WarnaStatusBejana;
  perhatian: WarnaStatusBejana;
  celah: WarnaStatusBejana;
  bahaya: WarnaStatusBejana;
  asi: { depan: string; dalam: string; garis: string; teks: string };
  rentang: string;
  celahMatriks: string;
  target: string;
  kisiBias: string;
  kacaTepi: string;
}

const WARNA_BEJANA: Record<TemaRona, PaletBejanaTema> = {
  fajar: {
    cukup: {
      depan: "rgba(29, 104, 82, 0.80)",
      dalam: "rgba(16, 68, 52, 0.92)",
      pendar: "rgba(130, 232, 194, 0.48)",
      belakang: "rgba(42, 138, 109, 0.36)",
      kilau: "rgba(232, 255, 246, 0.94)",
      garis: "#1D6852",
    },
    perhatian: {
      depan: "rgba(180, 105, 14, 0.82)",
      dalam: "rgba(122, 66, 4, 0.94)",
      pendar: "rgba(255, 212, 128, 0.52)",
      belakang: "rgba(219, 142, 38, 0.38)",
      kilau: "rgba(255, 246, 220, 0.95)",
      garis: "#784300",
    },
    celah: {
      depan: "rgba(158, 42, 66, 0.80)",
      dalam: "rgba(104, 20, 38, 0.94)",
      pendar: "rgba(255, 164, 184, 0.50)",
      belakang: "rgba(204, 76, 102, 0.36)",
      kilau: "rgba(255, 232, 238, 0.94)",
      garis: "#9E2A42",
    },
    bahaya: {
      depan: "rgba(163, 29, 29, 0.84)",
      dalam: "rgba(110, 14, 14, 0.95)",
      pendar: "rgba(255, 150, 150, 0.48)",
      belakang: "rgba(209, 60, 60, 0.38)",
      kilau: "rgba(255, 228, 228, 0.94)",
      garis: "#A31D1D",
    },
    asi: {
      depan: "rgba(238, 206, 152, 0.85)",
      dalam: "rgba(204, 162, 98, 0.92)",
      garis: "rgba(145, 92, 22, 0.80)",
      teks: "#5C3806",
    },
    rentang: "rgba(84, 62, 70, 0.22)",
    celahMatriks: "rgba(158, 42, 66, 0.38)",
    target: "rgba(33, 21, 25, 0.45)",
    kisiBias: "rgba(45, 24, 32, 0.14)",
    kacaTepi: "rgba(255, 255, 255, 0.68)",
  },
  dekap: {
    cukup: {
      depan: "rgba(88, 204, 168, 0.74)",
      dalam: "rgba(28, 102, 80, 0.90)",
      pendar: "rgba(164, 255, 226, 0.45)",
      belakang: "rgba(54, 148, 118, 0.36)",
      kilau: "rgba(220, 255, 244, 0.90)",
      garis: "#68D4B4",
    },
    perhatian: {
      depan: "rgba(245, 184, 100, 0.76)",
      dalam: "rgba(148, 92, 24, 0.90)",
      pendar: "rgba(255, 228, 168, 0.48)",
      belakang: "rgba(186, 126, 46, 0.38)",
      kilau: "rgba(255, 244, 215, 0.90)",
      garis: "#F5B864",
    },
    celah: {
      depan: "rgba(244, 143, 162, 0.76)",
      dalam: "rgba(142, 48, 68, 0.90)",
      pendar: "rgba(255, 196, 208, 0.48)",
      belakang: "rgba(184, 78, 98, 0.38)",
      kilau: "rgba(255, 232, 238, 0.90)",
      garis: "#F48FA2",
    },
    bahaya: {
      depan: "rgba(255, 133, 122, 0.80)",
      dalam: "rgba(152, 42, 34, 0.92)",
      pendar: "rgba(255, 190, 184, 0.48)",
      belakang: "rgba(190, 68, 58, 0.40)",
      kilau: "rgba(255, 228, 224, 0.92)",
      garis: "#FF857A",
    },
    asi: {
      depan: "rgba(219, 179, 118, 0.72)",
      dalam: "rgba(162, 122, 64, 0.88)",
      garis: "rgba(248, 219, 170, 0.80)",
      teks: "#FCEAD2",
    },
    rentang: "rgba(247, 238, 232, 0.24)",
    celahMatriks: "rgba(244, 143, 162, 0.42)",
    target: "rgba(247, 238, 232, 0.45)",
    kisiBias: "rgba(247, 238, 232, 0.14)",
    kacaTepi: "rgba(255, 235, 242, 0.36)",
  },
  terik: {
    cukup: {
      depan: "rgba(13, 74, 56, 0.88)",
      dalam: "rgba(7, 48, 36, 0.96)",
      pendar: "rgba(110, 212, 180, 0.35)",
      belakang: "rgba(29, 104, 82, 0.42)",
      kilau: "rgba(255, 255, 255, 0.98)",
      garis: "#0D4A38",
    },
    perhatian: {
      depan: "rgba(92, 50, 0, 0.88)",
      dalam: "rgba(62, 32, 0, 0.96)",
      pendar: "rgba(235, 172, 76, 0.35)",
      belakang: "rgba(140, 82, 10, 0.42)",
      kilau: "rgba(255, 255, 255, 0.98)",
      garis: "#5C3200",
    },
    celah: {
      depan: "rgba(122, 24, 46, 0.88)",
      dalam: "rgba(82, 12, 28, 0.96)",
      pendar: "rgba(232, 118, 142, 0.35)",
      belakang: "rgba(168, 48, 74, 0.42)",
      kilau: "rgba(255, 255, 255, 0.98)",
      garis: "#7A182E",
    },
    bahaya: {
      depan: "rgba(128, 13, 13, 0.90)",
      dalam: "rgba(88, 6, 6, 0.96)",
      pendar: "rgba(235, 110, 110, 0.35)",
      belakang: "rgba(178, 32, 32, 0.44)",
      kilau: "rgba(255, 255, 255, 0.98)",
      garis: "#800D0D",
    },
    asi: {
      depan: "rgba(212, 166, 92, 0.88)",
      dalam: "rgba(178, 132, 62, 0.94)",
      garis: "#4A2B00",
      teks: "#2B1800",
    },
    rentang: "rgba(15, 8, 11, 0.28)",
    celahMatriks: "rgba(122, 24, 46, 0.50)",
    target: "rgba(15, 8, 11, 0.65)",
    kisiBias: "rgba(15, 8, 11, 0.20)",
    kacaTepi: "rgba(255, 255, 255, 0.75)",
  },
  lensa: {
    cukup: {
      depan: "rgba(23, 94, 73, 0.82)",
      dalam: "rgba(12, 64, 48, 0.94)",
      pendar: "rgba(124, 228, 196, 0.44)",
      belakang: "rgba(45, 128, 103, 0.36)",
      kilau: "rgba(238, 255, 248, 0.94)",
      garis: "#175E49",
    },
    perhatian: {
      depan: "rgba(110, 62, 0, 0.82)",
      dalam: "rgba(76, 40, 0, 0.94)",
      pendar: "rgba(245, 192, 108, 0.44)",
      belakang: "rgba(166, 102, 18, 0.36)",
      kilau: "rgba(255, 246, 228, 0.94)",
      garis: "#6E3E00",
    },
    celah: {
      depan: "rgba(59, 66, 159, 0.82)",
      dalam: "rgba(34, 40, 112, 0.94)",
      pendar: "rgba(162, 170, 255, 0.46)",
      belakang: "rgba(96, 104, 196, 0.36)",
      kilau: "rgba(236, 238, 255, 0.94)",
      garis: "#3B429F",
    },
    bahaya: {
      depan: "rgba(158, 22, 22, 0.84)",
      dalam: "rgba(108, 10, 10, 0.94)",
      pendar: "rgba(255, 156, 156, 0.44)",
      belakang: "rgba(204, 52, 52, 0.38)",
      kilau: "rgba(255, 232, 232, 0.94)",
      garis: "#9E1616",
    },
    asi: {
      depan: "rgba(222, 188, 132, 0.84)",
      dalam: "rgba(188, 150, 92, 0.92)",
      garis: "#5E3D08",
      teks: "#3B2504",
    },
    rentang: "rgba(22, 22, 34, 0.24)",
    celahMatriks: "rgba(59, 66, 159, 0.42)",
    target: "rgba(22, 22, 34, 0.55)",
    kisiBias: "rgba(22, 22, 34, 0.15)",
    kacaTepi: "rgba(255, 255, 255, 0.78)",
  },
};

const BEJANA_N = 40;
const CAP_RISE_LUT = new Float32Array(BEJANA_N);
const NX_LUT = new Float32Array(BEJANA_N);
for (let i = 0; i < BEJANA_N; i++) {
  const nx = i / (BEJANA_N - 1);
  NX_LUT[i] = nx;
  const dEdge = Math.min(nx, 1 - nx);
  CAP_RISE_LUT[i] = Math.exp(-dEdge * 16);
}

export interface OpsiBejanaNektar {
  fill?: number;
  lo?: number;
  hi?: number;
  asiFrac?: number;
  showStrata?: boolean;
  status?: StatusVisualRona;
  viskositas?: number;
  meniskus?: number;
  indeksBias?: number;
  interactive?: boolean;
}

let bejanaInstanceCounter = 0;

export class BejanaNektar {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D | null;
  lodId: number;
  isHovered = false;
  status: StatusVisualRona;
  viskositas: number;
  meniskus: number;
  indeksBias: number;
  showStrata: boolean;
  pegasFill: Pegas;
  pegasLo: Pegas;
  pegasHi: Pegas;
  pegasAsi: Pegas;
  N = BEJANA_N;
  hFront = new Float32Array(BEJANA_N);
  vFront = new Float32Array(BEJANA_N);
  hBack = new Float32Array(BEJANA_N);
  vBack = new Float32Array(BEJANA_N);
  hMid = new Float32Array(BEJANA_N);
  vMid = new Float32Array(BEJANA_N);
  private _yBuf = new Float32Array(BEJANA_N);
  private _gLeftWall: CanvasGradient | null = null;
  private _gRightWall: CanvasGradient | null = null;
  private _wallW = 0;
  private _wallKaca = "";
  gelembung: { x: number; y: number; r: number; vy: number; wobble: number }[] = [];
  phase: number;
  visible = false;
  dpr = 1;
  w = 240;
  h = 68;
  private _step: TickerCallback;
  private _ro: ResizeObserver | null = null;
  private _unobserve: () => void = () => {};

  constructor(canvas: HTMLCanvasElement, opts?: OpsiBejanaNektar) {
    this.canvas = canvas;
    this.ctx = canvas.getContext ? canvas.getContext("2d") : null;
    this.lodId = ++bejanaInstanceCounter;
    const fill = opts?.fill ?? 0.75;
    const lo = opts?.lo ?? fill * 0.9;
    const hi = opts?.hi ?? fill * 1.1;
    const asiFrac = opts?.asiFrac ?? 0;

    this.status = opts?.status ?? "cukup";
    this.viskositas = opts?.viskositas ?? 0.92;
    this.meniskus = opts?.meniskus ?? 5.5;
    this.indeksBias = opts?.indeksBias ?? 1.36;
    this.showStrata = opts?.showStrata ?? true;

    this.pegasFill = new Pegas(fill, "nektar");
    this.pegasLo = new Pegas(lo, "nektar");
    this.pegasHi = new Pegas(hi, "nektar");
    this.pegasAsi = new Pegas(asiFrac, "nektar");
    this.phase = acakDeterministik() * Math.PI * 2;

    this._step = (dt) => {
      this.langkah(dt);
    };

    this.resize();
    if (typeof ResizeObserver !== "undefined") {
      this._ro = new ResizeObserver(() => this.resize());
      this._ro.observe(canvas);
    }

    this._unobserve = observe(canvas, (vis) => {
      this.visible = vis;
      if (vis && !Motion.isHemat()) {
        Ticker.add(this._step);
      } else {
        Ticker.remove(this._step);
        if (vis) this.gambar();
      }
    });

    if (opts?.interactive !== false) {
      let lastX: number | null = null;
      canvas.addEventListener(
        "pointerenter",
        () => {
          this.isHovered = true;
          ambilRectCepat(canvas, true);
        },
        { passive: true },
      );
      canvas.addEventListener(
        "pointermove",
        (e: PointerEvent) => {
          if (Motion.isHemat() || this.status === "kosong") return;
          const r = ambilRectCepat(canvas, false);
          if (!r.width) return;
          const nx = Math.max(0.05, Math.min(0.95, (e.clientX - r.left) / r.width));
          const vx = lastX !== null ? (nx - lastX) * 44 : 0.45;
          lastX = nx;
          this.aduk(nx, vx);
        },
        { passive: true },
      );
      canvas.addEventListener(
        "pointerleave",
        () => {
          this.isHovered = false;
          lastX = null;
        },
        { passive: true },
      );
      canvas.addEventListener(
        "pointerdown",
        (e: PointerEvent) => {
          if (Motion.isHemat() || this.status === "kosong") return;
          const r = ambilRectCepat(canvas, true);
          if (!r.width) return;
          const nx = Math.max(0.08, Math.min(0.92, (e.clientX - r.left) / r.width));
          this.splash(nx, 1.2);
        },
        { passive: true },
      );
    }
  }

  destroy(): void {
    Ticker.remove(this._step);
    this._unobserve();
    if (this._ro) this._ro.disconnect();
  }

  resize(): void {
    const r = ambilRectCepat(this.canvas, true);
    const rw = r.width || this.canvas.clientWidth || 300;
    const rh = r.height || this.canvas.clientHeight || 68;
    const nativeDpr = Math.min(
      typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1,
      2,
    );
    this.dpr = nativeDpr;
    this.w = Math.max(80, Math.round(rw));
    this.h = Math.max(36, Math.round(rh));
    this.canvas.width = Math.round(this.w * this.dpr);
    this.canvas.height = Math.round(this.h * this.dpr);
    this._gLeftWall = null;
    this._gRightWall = null;
    this.gambar();
  }

  aduk(nx: number, dorongan: number): void {
    if (Motion.isHemat() || this.status === "kosong") return;
    const idx = Math.floor(nx * (this.N - 1));
    const amp = Math.max(-14, Math.min(14, dorongan * 9));
    for (let i = -3; i <= 3; i++) {
      const k = idx + i;
      if (k >= 0 && k < this.N) {
        const w = Math.exp(-(i * i) * 0.35);
        this.vFront[k] = (this.vFront[k] ?? 0) + amp * w;
        this.vBack[k] = (this.vBack[k] ?? 0) - amp * 0.65 * w;
        this.vMid[k] = (this.vMid[k] ?? 0) + amp * 0.42 * w;
      }
    }
    if (acakDeterministik() < 0.38 && this.gelembung.length < 20) {
      this.gelembung.push({
        x: nx + (acakDeterministik() - 0.5) * 0.08,
        y: 0.92,
        r: 1.5 + acakDeterministik() * 2.4,
        vy: 0.35 + acakDeterministik() * 0.45,
        wobble: acakDeterministik() * 6,
      });
    }
  }

  splash(nx = 0.5, kuat = 1): void {
    if (Motion.isHemat() || this.status === "kosong") return;
    const idx = Math.floor(nx * (this.N - 1));
    const mag = kuat * 48;
    for (let i = -4; i <= 4; i++) {
      const k = idx + i;
      if (k >= 0 && k < this.N) {
        const w = Math.cos((i / 5) * (Math.PI * 0.5));
        this.vFront[k] = (this.vFront[k] ?? 0) - mag * w;
        this.vBack[k] = (this.vBack[k] ?? 0) + mag * 0.72 * w;
        this.vMid[k] = (this.vMid[k] ?? 0) - mag * 0.48 * w;
      }
    }
    const count = Math.min(8, Math.round(3 + kuat * 3));
    for (let b = 0; b < count; b++) {
      if (this.gelembung.length < 22) {
        this.gelembung.push({
          x: Math.max(0.08, Math.min(0.92, nx + (acakDeterministik() - 0.5) * 0.18)),
          y: 0.85 + acakDeterministik() * 0.12,
          r: 1.4 + acakDeterministik() * 2.6,
          vy: 0.42 + acakDeterministik() * 0.55,
          wobble: acakDeterministik() * Math.PI * 2,
        });
      }
    }
  }

  guncangMomentum(arahY = 0.6): void {
    if (Motion.isHemat() || this.status === "kosong") return;
    const s = Math.max(-1.4, Math.min(1.4, arahY));
    for (let i = 0; i < this.N; i++) {
      const tilt = (i / (this.N - 1) - 0.5) * 2;
      this.vFront[i] = (this.vFront[i] ?? 0) + tilt * s * 28;
      this.vBack[i] = (this.vBack[i] ?? 0) - tilt * s * 20;
      this.vMid[i] = (this.vMid[i] ?? 0) + tilt * s * 14;
    }
  }

  langkah(dt: number): void {
    if (!this.visible) return;
    this.pegasFill.langkah(dt);
    this.pegasLo.langkah(dt);
    this.pegasHi.langkah(dt);
    this.pegasAsi.langkah(dt);

    if (this.status !== "kosong") {
      this.phase += dt * 2.1;
      const N = this.N;
      const tension = 165;
      const spread = 190;
      const damp = Math.pow(this.viskositas, dt * 18);

      const stepWave = (
        hArr: Float32Array,
        vArr: Float32Array,
        phaseMul: number,
        ampIdle: number,
      ): void => {
        for (let i = 0; i < N; i++) {
          const idle = Math.sin(i * 0.28 + phaseMul) * ampIdle;
          const f = -tension * ((hArr[i] ?? 0) - idle);
          vArr[i] = ((vArr[i] ?? 0) + f * dt) * damp;
        }
        for (let j = 0; j < 2; j++) {
          for (let i = 0; i < N; i++) {
            if (i > 0) {
              const dL = spread * ((hArr[i] ?? 0) - (hArr[i - 1] ?? 0)) * dt;
              vArr[i - 1] = (vArr[i - 1] ?? 0) + dL;
              vArr[i] = (vArr[i] ?? 0) - dL;
            }
            if (i < N - 1) {
              const dR = spread * ((hArr[i] ?? 0) - (hArr[i + 1] ?? 0)) * dt;
              vArr[i + 1] = (vArr[i + 1] ?? 0) + dR;
              vArr[i] = (vArr[i] ?? 0) - dR;
            }
          }
        }
        for (let i = 0; i < N; i++) {
          hArr[i] = (hArr[i] ?? 0) + (vArr[i] ?? 0) * dt;
        }
      };

      stepWave(this.hFront, this.vFront, this.phase, 1.35);
      stepWave(this.hBack, this.vBack, -this.phase * 0.85 + 1.4, 1.05);
      if (this.pegasAsi.x > 0.02) {
        stepWave(this.hMid, this.vMid, this.phase * 0.6 + 0.8, 0.75);
      }

      for (let i = this.gelembung.length - 1; i >= 0; i--) {
        const g = this.gelembung[i];
        if (!g) continue;
        g.y -= g.vy * dt;
        g.wobble += dt * 5;
        if (g.y <= 1 - Math.min(1, this.pegasFill.x) + 0.04) {
          this.gelembung.splice(i, 1);
        }
      }
    }

    this.gambar();
  }

  ambilTema(): PaletBejanaTema {
    const host =
      (this.canvas.closest && this.canvas.closest("[data-theme]")) ||
      (typeof document !== "undefined" ? document.documentElement : null);
    const t = ((host && host.getAttribute("data-theme")) || "fajar") as TemaRona;
    return WARNA_BEJANA[t] || WARNA_BEJANA.fajar;
  }

  gambar(): void {
    const ctx = this.ctx;
    if (!ctx) return;
    const w = this.w;
    const h = this.h;
    const tema = this.ambilTema();

    ctx.save();
    ctx.scale(this.dpr, this.dpr);
    ctx.clearRect(0, 0, w, h);

    if (this.status === "kosong") {
      ctx.strokeStyle = tema.rentang;
      ctx.lineWidth = 1.1;
      ctx.setLineDash([4, 4]);
      const step = 16;
      for (let x = -h; x < w + h; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x + h, h);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x + h, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      ctx.setLineDash([]);
      ctx.fillStyle = tema.target;
      ctx.font = '600 10px "Atkinson Next", sans-serif';
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("DATA SUMBER BELUM LENGKAP — BUKAN 0%", w / 2, h / 2);
      ctx.restore();
      return;
    }

    const pal = tema[this.status] || tema.cukup;
    const fill = Math.max(0, Math.min(1.08, this.pegasFill.x));
    const lo = Math.max(0, Math.min(1.08, this.pegasLo.x));
    const hi = Math.max(0, Math.min(1.08, this.pegasHi.x));
    const asi = Math.max(0, Math.min(fill, this.pegasAsi.x));
    const normLx = Math.max(0.08, Math.min(0.92, CahayaGlobal.x));

    const yUntuk = (fraksi: number): number => {
      const clamped = Math.max(0, Math.min(1.06, fraksi));
      return h - (clamped / 1.06) * (h - 8) - 2;
    };

    const yFill = yUntuk(fill);
    const yLo = yUntuk(lo);
    const yHi = yUntuk(hi);
    const yTarget = yUntuk(1.0);
    const N = this.N;
    const meniskus = Motion.isHemat() ? 0 : this.meniskus;

    // 1. Kisi Ukur Optik dengan Pembiasan Snellius
    const kolomKisi = 8;
    ctx.strokeStyle = tema.kisiBias;
    ctx.lineWidth = 1.0;
    for (let c = 1; c < kolomKisi; c++) {
      const nx = c / kolomKisi;
      const xAtas = nx * w;
      const idxWave = Math.min(N - 2, Math.max(1, Math.floor(nx * (N - 1))));
      const slope = ((this.hFront[idxWave + 1] ?? 0) - (this.hFront[idxWave - 1] ?? 0)) * 0.5;
      const yPermukaan = yFill + (Motion.isHemat() ? 0 : (this.hFront[idxWave] ?? 0));
      const shiftBias = (this.indeksBias - 1.0) * (slope * 6.5 + (nx - normLx) * 14);

      ctx.beginPath();
      ctx.moveTo(xAtas, 0);
      ctx.lineTo(xAtas, Math.max(0, yPermukaan));
      ctx.lineTo(xAtas + shiftBias, h);
      ctx.stroke();
    }

    // 2. Matriks Titik Celah
    if (this.status === "celah" && hi < 0.98) {
      ctx.fillStyle = tema.celahMatriks;
      const topY = Math.max(4, yTarget);
      const botY = Math.min(h - 4, yHi);
      for (let py = topY + 4; py < botY - 2; py += 6) {
        for (let px = 8; px < w - 8; px += 8) {
          ctx.beginPath();
          ctx.arc(px + (py % 12 === 0 ? 3 : 0), py, 1.15, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // 3. Pita Rentang Ketidakpastian
    if (Math.abs(yLo - yHi) > 2) {
      const topBand = Math.min(yLo, yHi);
      const botBand = Math.max(yLo, yHi);
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, topBand, w, botBand - topBand);
      ctx.clip();
      ctx.strokeStyle = tema.rentang;
      ctx.lineWidth = 1.25;
      for (let x = -h; x < w + h; x += 9) {
        ctx.beginPath();
        ctx.moveTo(x, botBand);
        ctx.lineTo(x + (botBand - topBand) * 1.2, topBand);
        ctx.stroke();
      }
      ctx.restore();
    }

    const yBuf = this._yBuf;
    const isHemat = Motion.isHemat();
    const gambarLapisanCairan = (
      yDasar: number,
      hArr: Float32Array,
      warnaAtas: string,
      warnaBawah: string | null,
      warnaPendar: string | null,
      warnaGaris: string | null,
      warnaKilau: string | null,
    ): void => {
      ctx.beginPath();
      ctx.moveTo(0, h + 2);
      for (let i = 0; i < N; i++) {
        const capRise = meniskus * (CAP_RISE_LUT[i] ?? 0);
        const waveDy = isHemat ? 0 : (hArr[i] ?? 0);
        const y = yDasar + waveDy - capRise;
        yBuf[i] = y;
        ctx.lineTo((NX_LUT[i] ?? 0) * w, y);
      }
      ctx.lineTo(w, h + 2);
      ctx.closePath();

      if (warnaBawah) {
        const gVol = ctx.createLinearGradient(w * normLx, Math.max(0, yDasar - 6), w * 0.5, h);
        gVol.addColorStop(0, warnaAtas);
        gVol.addColorStop(1, warnaBawah);
        ctx.fillStyle = gVol;
      } else {
        ctx.fillStyle = warnaAtas;
      }
      ctx.fill();

      if (warnaPendar) {
        ctx.save();
        ctx.clip();
        const lxPx = normLx * w;
        const gSSS = ctx.createRadialGradient(
          lxPx,
          yDasar + 4,
          2,
          lxPx,
          yDasar + 16,
          Math.max(w * 0.55, 90),
        );
        gSSS.addColorStop(0, warnaPendar);
        gSSS.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = gSSS;
        ctx.fillRect(0, Math.max(0, yDasar - 12), w, h - yDasar + 16);
        ctx.restore();
      }

      if (warnaGaris) {
        ctx.beginPath();
        ctx.moveTo(0, yBuf[0] ?? yDasar);
        for (let i = 1; i < N; i++) {
          ctx.lineTo((NX_LUT[i] ?? 0) * w, yBuf[i] ?? yDasar);
        }
        ctx.strokeStyle = warnaGaris;
        ctx.lineWidth = 1.7;
        ctx.stroke();
      }

      if (warnaKilau) {
        ctx.beginPath();
        ctx.moveTo((NX_LUT[1] ?? 0) * w, (yBuf[1] ?? yDasar) + 1.5);
        for (let i = 2; i < N - 1; i++) {
          ctx.lineTo((NX_LUT[i] ?? 0) * w, (yBuf[i] ?? yDasar) + 1.5);
        }
        ctx.strokeStyle = warnaKilau;
        ctx.lineWidth = 1.15;
        ctx.stroke();
      }
    };

    // 4. Gelombang Belakang
    gambarLapisanCairan(yFill + 1.8, this.hBack, pal.belakang, null, null, null, null);

    // 5. Gelombang Depan
    gambarLapisanCairan(
      yFill,
      this.hFront,
      pal.depan,
      pal.dalam,
      pal.pendar,
      pal.garis,
      pal.kilau,
    );

    // 6. Strata Dasar ASI
    if (this.showStrata && asi > 0.02) {
      const yAsi = yUntuk(asi);
      gambarLapisanCairan(
        yAsi,
        this.hMid,
        tema.asi.depan,
        tema.asi.dalam,
        "rgba(255, 248, 224, 0.45)",
        tema.asi.garis,
        "rgba(255, 252, 240, 0.85)",
      );

      if (h >= 48) {
        ctx.font = '600 9.5px "Atkinson Mono", monospace';
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        if (h - yAsi > 13) {
          ctx.fillStyle = tema.asi.teks;
          ctx.fillText(`ASI ${Math.round(asi * 100)}%`, 10, Math.min(h - 7, (yAsi + h) / 2));
        }
        if (yAsi - yFill > 13) {
          ctx.fillStyle = "#FFFFFF";
          ctx.fillText(
            `MPASI +${Math.max(0, Math.round((fill - asi) * 100))}%`,
            10,
            (yFill + yAsi) / 2,
          );
        }
      }
    }

    // 7. Pantulan Kaustik Dasar Bejana
    if (fill > 0.08) {
      const gCaustic = ctx.createLinearGradient(0, h - 5, w, h - 5);
      gCaustic.addColorStop(0, "rgba(0,0,0,0)");
      gCaustic.addColorStop(normLx, pal.kilau);
      gCaustic.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = gCaustic;
      ctx.globalAlpha = 0.42;
      ctx.fillRect(8, h - 4, w - 16, 2.5);
      ctx.globalAlpha = 1.0;
    }

    // 8. Gelembung Mikro Efervesen
    if (!isHemat && this.gelembung.length > 0) {
      for (let i = 0; i < this.gelembung.length; i++) {
        const g = this.gelembung[i];
        if (!g) continue;
        const gx = g.x * w + Math.sin(g.wobble) * 2.5;
        const gy = g.y * h;
        if (gy > yFill + 3) {
          ctx.beginPath();
          ctx.arc(gx, gy, g.r, 0, Math.PI * 2);
          ctx.strokeStyle = pal.kilau;
          ctx.lineWidth = 1.0;
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(gx - g.r * 0.32, gy - g.r * 0.32, g.r * 0.35, 0, Math.PI * 2);
          ctx.fillStyle = "#FFFFFF";
          ctx.fill();
        }
      }
    }

    // 9. Garis Target 100% AKG
    ctx.save();
    ctx.strokeStyle = tema.target;
    ctx.lineWidth = 1.1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(0, yTarget);
    ctx.lineTo(w, yTarget);
    ctx.stroke();
    ctx.restore();

    // 10. Refleksi Fresnel Dinding Kaca Silindris
    if (!this._gLeftWall || this._wallW !== w || this._wallKaca !== tema.kacaTepi) {
      const gL = ctx.createLinearGradient(0, 0, 14, 0);
      gL.addColorStop(0, tema.kacaTepi);
      gL.addColorStop(1, "rgba(255,255,255,0)");
      const gR = ctx.createLinearGradient(w - 12, 0, w, 0);
      gR.addColorStop(0, "rgba(255,255,255,0)");
      gR.addColorStop(1, tema.kacaTepi);
      this._gLeftWall = gL;
      this._gRightWall = gR;
      this._wallW = w;
      this._wallKaca = tema.kacaTepi;
    }
    ctx.fillStyle = this._gLeftWall;
    ctx.fillRect(0, 0, 14, h);
    if (this._gRightWall) {
      ctx.fillStyle = this._gRightWall;
      ctx.fillRect(w - 12, 0, 12, h);
    }

    ctx.restore();
  }
}

/* ---------- 7. Lintasan Tetesan Nektar Kurva Bezier ---------- */
export function luncurkanTetesanNektar(
  hpRoot: HTMLElement | null,
  dropLayer: HTMLElement | null,
  sourceEl: HTMLElement | null,
  targetEl: HTMLElement | null,
  labelDelta: string | null,
  bejanaInstances: BejanaNektar[],
): void {
  if (
    !hpRoot ||
    !dropLayer ||
    Motion.isHemat() ||
    typeof document === "undefined" ||
    typeof hpRoot.getBoundingClientRect !== "function"
  ) {
    return;
  }
  const hpRect = hpRoot.getBoundingClientRect();
  if (!hpRect.width) return;

  const srcRect =
    sourceEl && typeof sourceEl.getBoundingClientRect === "function"
      ? sourceEl.getBoundingClientRect()
      : {
          left: hpRect.left + hpRect.width * 0.5,
          top: hpRect.top + 160,
          width: 40,
          height: 24,
        };

  const tgtRect =
    targetEl && typeof targetEl.getBoundingClientRect === "function"
      ? targetEl.getBoundingClientRect()
      : {
          left: hpRect.left + hpRect.width * 0.55,
          top: hpRect.top + hpRect.height - 40,
          width: 60,
          height: 36,
        };

  const p0x = srcRect.left - hpRect.left + srcRect.width * 0.5;
  const p0y = srcRect.top - hpRect.top + srcRect.height * 0.5;
  const p2x = tgtRect.left - hpRect.left + tgtRect.width * 0.55;
  const p2y = tgtRect.top - hpRect.top + tgtRect.height * 0.5;

  if (labelDelta) {
    const badge = document.createElement("div");
    badge.className = "tetes-delta";
    badge.textContent = labelDelta;
    badge.style.left = `${Math.max(16, Math.min(hpRect.width - 170, p0x - 40))}px`;
    badge.style.top = `${Math.max(60, p0y - 16)}px`;
    dropLayer.appendChild(badge);
    setTimeout(() => {
      badge.style.transition =
        "transform 520ms cubic-bezier(0.22,1,0.36,1), opacity 520ms ease";
      badge.style.transform = "translate3d(0, -26px, 0)";
      badge.style.opacity = "0";
    }, 40);
    setTimeout(() => {
      if (badge.parentNode) badge.parentNode.removeChild(badge);
    }, 620);
  }

  const warnaTetes = ["#9E2A42", "#D4841C", "#1D6852"];
  for (let idx = 0; idx < 3; idx++) {
    const drop = document.createElement("div");
    drop.className = "tetes-bola";
    drop.style.background = `radial-gradient(circle at 30% 30%, #FFF9F5, ${warnaTetes[idx % 3]})`;
    dropLayer.appendChild(drop);

    const cpx = (p0x + p2x) * 0.5 + (idx - 1) * 44;
    const cpy = Math.min(p0y, p2y) - 58 - idx * 18;
    const dur = 0.48 + idx * 0.07;
    let t = -idx * 0.06;

    const stepDrop: TickerCallback = (dt) => {
      t += dt / dur;
      if (t < 0) return;
      if (t >= 1) {
        if (drop.parentNode) drop.parentNode.removeChild(drop);
        Ticker.remove(stepDrop);
        bejanaInstances.forEach((b) => {
          b.splash(0.45 + idx * 0.12, 1.05);
        });
        return;
      }
      const te = t * t * (3 - 2 * t);
      const ue = 1 - te;
      const x = ue * ue * p0x + 2 * ue * te * cpx + te * te * p2x;
      const y = ue * ue * p0y + 2 * ue * te * cpy + te * te * p2y;

      const vx = 2 * ue * (cpx - p0x) + 2 * te * (p2x - cpx);
      const vy = 2 * ue * (cpy - p0y) + 2 * te * (p2y - cpy);
      const angle = (Math.atan2(vy, vx) * 180) / Math.PI;
      const stretch = 1 + Math.min(0.65, Math.hypot(vx, vy) / 420);

      drop.style.transform = `translate3d(${(x - 7).toFixed(1)}px,${(y - 7).toFixed(1)}px,0) rotate(${angle.toFixed(1)}deg) scale(${stretch.toFixed(2)},${(1 / Math.sqrt(stretch)).toFixed(2)})`;
    };
    Ticker.add(stepDrop);
  }
}
