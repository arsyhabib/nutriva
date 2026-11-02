import type {
  KategoriBbpb,
  KategoriBbu,
  KategoriPbu,
} from "../engine/antropometri";

export const SIMBOL: Record<string, string> = {
  check:
    '<path d="M4.5 10.5L8.2 14.2L15.5 6.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  warn:
    '<path d="M10 3.2L17.4 16H2.6L10 3.2Z" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linejoin="round"/><path d="M10 8V11.4M10 13.8V14.2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
  danger:
    '<circle cx="10" cy="10" r="7.25" fill="none" stroke="currentColor" stroke-width="1.75"/><path d="M10 6.2V10.6M10 13.4V13.8" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>',
  info:
    '<circle cx="10" cy="10" r="7.25" fill="none" stroke="currentColor" stroke-width="1.65"/><path d="M10 9V13.6M10 6.5V6.9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
  unverif:
    '<path d="M10 2.5L16.5 5.2V9.8C16.5 13.7 13.8 16.6 10 17.6C6.2 16.6 3.5 13.7 3.5 9.8V5.2L10 2.5Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-dasharray="2.4 1.8"/><path d="M8.5 8.3C8.5 7.4 9.2 6.8 10.1 6.8C11 6.8 11.6 7.4 11.6 8.1C11.6 8.8 11.1 9.2 10.5 9.6C10.1 9.9 10 10.3 10 10.9M10 13.2V13.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
  profil:
    '<circle cx="10" cy="7" r="3.2" fill="none" stroke="currentColor" stroke-width="1.65"/><path d="M4 16.5C4.6 13.4 6.9 12 10 12C13.1 12 15.4 13.4 16 16.5" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round"/>',
  status:
    '<path d="M3.5 15.5V4.5M3.5 15.5H16.5" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round"/><path d="M6.2 12.2L9.2 9.2L11.8 11.4L15.6 6.4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
  piring:
    '<circle cx="10" cy="10" r="6.8" fill="none" stroke="currentColor" stroke-width="1.65"/><circle cx="10" cy="10" r="3.8" fill="none" stroke="currentColor" stroke-width="1.3" stroke-dasharray="2 1.6"/>',
  kolam:
    '<path d="M5 3.8H15L14.1 15.2C14 16.3 13.1 17 12 17H8C6.9 17 6 16.3 5.9 15.2L5 3.8Z" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linejoin="round"/><path d="M5.7 9.6C7.2 8.7 8.6 10.4 10 9.6C11.4 8.8 12.8 10.4 14.3 9.6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  kenapa:
    '<path d="M4.5 5.5H15.5V13.2H9L5.8 15.8V13.2H4.5V5.5Z" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linejoin="round"/><path d="M7.5 8.5H12.5M7.5 10.8H10.6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  audit:
    '<rect x="4" y="3.5" width="12" height="13" rx="1.6" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M7 7.2H13M7 10H13M7 12.8H10.4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  bahaya:
    '<path d="M10 2.6L17.6 15.8H2.4L10 2.6Z" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linejoin="round"/><path d="M10 7.6V11.3M10 13.6V14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  lock:
    '<rect x="4.5" y="9" width="11" height="7.5" rx="1.6" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M7 9V6.6C7 4.9 8.3 3.6 10 3.6C11.7 3.6 13 4.9 13 6.6V9" fill="none" stroke="currentColor" stroke-width="1.6"/>',
  trash:
    '<path d="M4.5 6H15.5M6.2 6L6.9 15.4C7 16.2 7.6 16.8 8.4 16.8H11.6C12.4 16.8 13 16.2 13.1 15.4L13.8 6M8 6V4.4C8 3.9 8.4 3.5 8.9 3.5H11.1C11.6 3.5 12 3.9 12 4.4V6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
  share:
    '<path d="M10 12.5V3.8M10 3.8L6.8 7M10 3.8L13.2 7" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><path d="M4.5 11.2V15.2C4.5 15.9 5.1 16.5 5.8 16.5H14.2C14.9 16.5 15.5 15.9 15.5 15.2V11.2" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
  phone:
    '<path d="M5.4 3.8H8L9.2 6.9L7.6 8.2C8.5 10 9.9 11.5 11.8 12.4L13.1 10.8L16.2 12V14.6C16.2 15.5 15.5 16.2 14.6 16.2C8.9 16.2 3.8 11.1 3.8 5.4C3.8 4.5 4.5 3.8 5.4 3.8Z" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linejoin="round"/>',
  offline:
    '<path d="M3.5 8.2C7.4 5 12.6 5 16.5 8.2M6.2 11.1C8.6 9.2 11.4 9.2 13.8 11.1M10 14.2V14.6" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M4 4L16 16" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
  clock:
    '<circle cx="10" cy="10" r="7" fill="none" stroke="currentColor" stroke-width="1.65"/><path d="M10 6.2V10.2L12.6 11.8" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round"/>',
  book:
    '<path d="M4 4.5H9.2C10.1 4.5 10.8 5.2 10.8 6.1V15.5C10.8 14.8 10.1 14.3 9.2 14.3H4V4.5ZM16 4.5H10.8V15.5C10.8 14.8 11.5 14.3 12.4 14.3H16V4.5Z" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linejoin="round"/>',
  sun:
    '<circle cx="10" cy="10" r="3.4" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M10 2.8V4.6M10 15.4V17.2M2.8 10H4.6M15.4 10H17.2M4.9 4.9L6.2 6.2M13.8 13.8L15.1 15.1M15.1 4.9L13.8 6.2M6.2 13.8L4.9 15.1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  moon:
    '<path d="M13.8 13.2C10.4 13.2 7.8 10.6 7.8 7.2C7.8 5.8 8.3 4.5 9.1 3.5C5.9 4 3.6 6.7 3.6 10C3.6 13.7 6.6 16.6 10.2 16.6C12.9 16.6 15.2 15 16.2 12.7C15.4 13 14.6 13.2 13.8 13.2Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
  arrowR:
    '<path d="M4.5 10H15.2M11.2 6L15.2 10L11.2 14" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>',
  arrowL:
    '<path d="M15.5 10H4.8M8.8 6L4.8 10L8.8 14" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>',
  chevD:
    '<path d="M5.5 7.8L10 12.2L14.5 7.8" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>',
  spark:
    '<path d="M10 3L11.6 8.4L17 10L11.6 11.6L10 17L8.4 11.6L3 10L8.4 8.4L10 3Z" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linejoin="round"/>',
};

export function pasangSprite(): void {
  if (typeof document === "undefined") return;
  if (document.getElementById("rona-svg-sprite")) return;
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.id = "rona-svg-sprite";
  svg.setAttribute("aria-hidden", "true");
  svg.style.cssText =
    "position:absolute;width:0;height:0;overflow:hidden;pointer-events:none;";
  svg.innerHTML = Object.entries(SIMBOL)
    .map(([k, v]) => `<symbol id="ic-${k}" viewBox="0 0 20 20">${v}</symbol>`)
    .join("");
  document.body.prepend(svg);
}

export function ikon(nama: string, ukuran = 15, kelas = ""): string {
  return `<svg class="ikon ${kelas}" width="${ukuran}" height="${ukuran}" viewBox="0 0 20 20" aria-hidden="true" focusable="false"><use href="#ic-${nama}"/></svg>`;
}

export function lencanaStatus(
  tingkat: "ok" | "perlu" | "awas" | "info",
  teks: string,
): string {
  const peta: Record<
    "ok" | "perlu" | "awas" | "info",
    { ic: string; kls: string }
  > = {
    ok: { ic: "check", kls: "lencana--ok" },
    perlu: { ic: "warn", kls: "lencana--perlu" },
    awas: { ic: "danger", kls: "lencana--awas" },
    info: { ic: "info", kls: "lencana--info" },
  };
  const m = peta[tingkat];
  return `<span class="lencana ${m.kls}">${ikon(m.ic, 13)}<span>${teks}</span></span>`;
}

export function lencanaVerif(belumDiverifikasi = true): string {
  if (belumDiverifikasi) {
    return `<span class="lencana lencana--unverif" title="Nilai numerik ini berasal dari tabel aturan yang belum diverifikasi dosen pengampu">${ikon("unverif", 12)}<span>Belum diverifikasi dosen</span></span>`;
  }
  return `<span class="lencana lencana--ok" title="Telah diverifikasi terhadap dokumen sumber resmi">${ikon("check", 12)}<span>Terverifikasi sumber</span></span>`;
}

/**
 * Memetakan posisi pita SD (tanpa angka Z-score kontinu, sesuai K-02 & INV-04)
 * ke persentase horizontal [0..100] pada lintasan pita WHO (-3 SD s.d. +3 SD).
 */
export function posisiKePersenPin(posisi: string | null): number {
  if (!posisi) return 50;
  const peta: Record<string, number> = {
    "<-3": 4,
    "tepat:-3": 8,
    "-3..-2": 14,
    "tepat:-2": 20,
    "-2..-1": 31,
    "tepat:-1": 40,
    "-1..0": 45,
    "-1..+1": 50,
    "tepat:0": 50,
    "0..+1": 56,
    "tepat:+1": 62,
    "+1..+2": 72,
    "tepat:+2": 80,
    "+2..+3": 88,
    "tepat:+3": 93,
    ">+3": 96,
  };
  return peta[posisi] ?? 50;
}

export function labelPosisiPita(posisi: string | null): string {
  if (!posisi) return "Di luar rentang tabel";
  const peta: Record<string, string> = {
    "<-3": "Pita di bawah -3 SD",
    "tepat:-3": "Tepat garis -3 SD",
    "-3..-2": "Pita -3 s.d. -2 SD",
    "tepat:-2": "Tepat garis -2 SD",
    "-2..-1": "Pita -2 s.d. -1 SD",
    "tepat:-1": "Tepat garis -1 SD",
    "-1..0": "Pita -1 SD s.d. Median",
    "-1..+1": "Pita -1 s.d. +1 SD (Rentang Tengah)",
    "tepat:0": "Tepat Median (0 SD)",
    "0..+1": "Pita Median s.d. +1 SD",
    "tepat:+1": "Tepat garis +1 SD",
    "+1..+2": "Pita +1 s.d. +2 SD",
    "tepat:+2": "Tepat garis +2 SD",
    "+2..+3": "Pita +2 s.d. +3 SD",
    "tepat:+3": "Tepat garis +3 SD",
    ">+3": "Pita di atas +3 SD",
  };
  return peta[posisi] ?? `Pita ${posisi} SD`;
}

export function tingkatVisualBBU(k: KategoriBbu): "ok" | "perlu" | "awas" {
  if (k === "bb_sangat_kurang") return "awas";
  if (k === "bb_normal") return "ok";
  return "perlu";
}

export function tingkatVisualPBU(k: KategoriPbu): "ok" | "perlu" | "awas" {
  if (k === "sangat_pendek") return "awas";
  if (k === "normal" || k === "tinggi") return "ok";
  return "perlu";
}

export function tingkatVisualBBPB(
  k: KategoriBbpb | "panjang_di_luar_tabel_setelah_pembulatan",
): "ok" | "perlu" | "awas" {
  if (k === "gizi_buruk" || k === "obesitas") return "awas";
  if (k === "gizi_baik") return "ok";
  return "perlu";
}
