import type {
  KategoriBbpb,
  KategoriBbu,
  KategoriPbu,
} from "../engine/antropometri";

export const SIMBOL: Record<string, string> = {
  "status-cukup":
    '<circle cx="12" cy="12" r="8.5"/><path d="M8.3 12.3l2.4 2.4 5-5.2"/>',
  "status-perhatian":
    '<path d="M12 3.8l8.8 15.4H3.2L12 3.8z"/><path d="M12 10v4.2"/><circle cx="12" cy="16.8" r="0.8" fill="currentColor"/>',
  "status-celah":
    '<polygon points="12,3.2 20.8,12 12,20.8 3.2,12" stroke-dasharray="3 2"/><path d="M9 12h6"/>',
  "status-bahaya":
    '<polygon points="8.4,3.2 15.6,3.2 20.8,8.4 20.8,15.6 15.6,20.8 8.4,20.8 3.2,15.6 3.2,8.4"/><path d="M12 8v4.8"/><circle cx="12" cy="15.8" r="0.9" fill="currentColor"/>',
  "status-kosong":
    '<rect x="4" y="4" width="16" height="16" rx="3" stroke-dasharray="3 3"/><path d="M8.5 12h7"/>',
  "verif-sah":
    '<path d="M12 3l7 3.2v5.3c0 4.6-3 7.9-7 9.5-4-1.6-7-4.9-7-9.5V6.2L12 3z"/><path d="M8.8 12.2l2.1 2.2 4.5-4.6"/>',
  "pdf": '<path d="M7 3.5h7l4 4V20a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5V4a.5.5 0 0 1 .5-.5z"/><path d="M14 3.5V8h4"/><path d="M9 14.5h6M9 17.5h4"/>',
  "panah-kiri": '<path d="M14.5 6l-6 6 6 6"/>',
  "panah-kanan": '<path d="M9.5 6l6 6-6 6"/>',
  "kunci": '<circle cx="8.5" cy="14.5" r="3.5"/><path d="M11 12l8-8m-3 3l2.5 2.5M14 9l2 2"/>',
  "verif-perlu":
    '<circle cx="12" cy="12" r="8.5" stroke-dasharray="4 2.5"/><path d="M12 8.2v4.4"/><circle cx="12" cy="15.6" r="0.8" fill="currentColor"/>',
  "verif-draf":
    '<rect x="4" y="4" width="16" height="16" rx="3" stroke-dasharray="3 3"/><path d="M8 15.5l2.5-6.5 5-1.5-1.5 5-6 3z"/>',
  "nav-gerbang":
    '<path d="M12 3.5c4.2 3.5 6.8 6.8 6.8 10.2A6.8 6.8 0 1 1 5.2 13.7C5.2 10.3 7.8 7 12 3.5z"/>',
  "nav-profil":
    '<circle cx="12" cy="8.5" r="3.8"/><path d="M5.2 19.5c1.4-3.3 3.9-5 6.8-5s5.4 1.7 6.8 5"/>',
  "nav-status":
    '<path d="M4 18.5h16"/><path d="M6.5 15.5c2.2-5.5 4.4-8 6.8-4.2 1.6 2.5 3.1 1.2 4.7-4.3"/>',
  "nav-piring":
    '<circle cx="12" cy="12" r="8.2"/><circle cx="12" cy="12" r="4.2"/>',
  "nav-kolam":
    '<path d="M5 6.5h14v9a5.5 5.5 0 0 1-5.5 5.5h-3A5.5 5.5 0 0 1 5 15.5v-9z"/><path d="M5 12.2c2.3-1.4 4.7 1.4 7 0s4.7 1.4 7 0"/>',
  "nav-kenapa":
    '<circle cx="12" cy="12" r="8.5"/><path d="M9.6 9.5a2.5 2.5 0 1 1 3.7 2.2c-.9.5-1.3 1.1-1.3 2.1"/><circle cx="12" cy="16.8" r="0.8" fill="currentColor"/>',
  "nav-ahli":
    '<circle cx="10.5" cy="10.5" r="5.8"/><path d="M15 15l4.5 4.5"/><path d="M8.2 10.5h4.6"/><path d="M10.5 8.2v4.6"/>',
  "nav-tentang":
    '<rect x="5" y="4" width="14" height="16" rx="2.5"/><path d="M8.5 9h7"/><path d="M8.5 13h7"/><path d="M8.5 17h4.5"/>',
  "aksi-tukar":
    '<path d="M7 8h11l-3-3"/><path d="M17 16H6l3 3"/>',
  "aksi-bagikan":
    '<path d="M12 15V4"/><path d="M8 8l4-4 4 4"/><path d="M5 13v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5"/>',
  "aksi-hapus":
    '<path d="M4.5 7h15"/><path d="M9.5 7V4.8h5V7"/><path d="M7 7l1 12.2a1.8 1.8 0 0 0 1.8 1.8h4.4a1.8 1.8 0 0 0 1.8-1.8L17 7"/>',
  "aksi-tutup":
    '<path d="M6.5 6.5l11 11"/><path d="M17.5 6.5l-11 11"/>',
  "aksi-kembali":
    '<path d="M15 6l-6 6 6 6"/>',
  "info-asi":
    '<path d="M12 3.8c3.6 3.4 5.8 6.4 5.8 9.4a5.8 5.8 0 1 1-11.6 0c0-3 2.2-6 5.8-9.4z"/><circle cx="10" cy="13.5" r="1.1" fill="currentColor"/>',
  "spark":
    '<path d="M12 3.5l1.9 6.1L20 11.5l-6.1 1.9L12 19.5l-1.9-6.1L4 11.5l6.1-1.9L12 3.5z"/>',
  "phone":
    '<path d="M6.5 4.5h3.1l1.4 3.7-1.9 1.6a13 13 0 0 0 5.1 5.1l1.6-1.9 3.7 1.4v3.1a2 2 0 0 1-2 2C9.8 19.5 4.5 14.2 4.5 6.5a2 2 0 0 1 2-2z"/>',
  "kontrol":
    '<circle cx="12" cy="12" r="3.2"/><path d="M12 3.5v2.2M12 18.3v2.2M3.5 12h2.2M18.3 12h2.2M6 6l1.6 1.6M16.4 16.4L18 18M18 6l-1.6 1.6M7.6 16.4L6 18"/>',
  "layar-penuh":
    '<path d="M8 3.8H3.8V8M16 3.8h4.2V8M8 20.2H3.8V16M16 20.2h4.2V16"/>',
};

/** Tanda merek NUTRIVA: tetes nektar dengan tinggi cairan emas dan huruf N. Vektor murni; warna merek tetap di semua tema. */
const LOGO_ISI =
  '<defs><linearGradient id="nv-g1" x1="0.15" y1="0" x2="0.85" y2="1"><stop offset="0" stop-color="#BE3A55"/><stop offset="1" stop-color="#651226"/></linearGradient>' +
  '<linearGradient id="nv-g2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F6DEA8"/><stop offset="1" stop-color="#B98A2E"/></linearGradient>' +
  '<clipPath id="nv-c"><path d="M60 8C60 8 95 45 95 74a35 35 0 0 1-70 0C25 45 60 8 60 8Z"/></clipPath></defs>' +
  '<path d="M60 8C60 8 95 45 95 74a35 35 0 0 1-70 0C25 45 60 8 60 8Z" fill="url(#nv-g1)"/>' +
  '<g clip-path="url(#nv-c)"><path d="M20 93C34 85 46 100 60 93S86 85 100 93V120H20Z" fill="url(#nv-g2)" opacity=".92"/><path d="M20 99C34 91 46 106 60 99S86 91 100 99V120H20Z" fill="#fff" opacity=".18"/></g>' +
  '<path d="M60 8C60 8 95 45 95 74a35 35 0 0 1-70 0C25 45 60 8 60 8Z" fill="none" stroke="url(#nv-g2)" stroke-width="2" stroke-linejoin="round"/>' +
  '<path d="M44 80V50L76 80V50" fill="none" stroke="#FFF6EA" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>' +
  '<path d="M37 54C39 45 45 36 52 28" fill="none" stroke="#FFF6EA" stroke-opacity=".5" stroke-width="2.4" stroke-linecap="round"/>';

/** Logo sebagai gambar dekoratif (nama merek selalu ada sebagai teks di dekatnya). */
export function logo(kelas = "", ukuran = 32): string {
  return `<svg class="logo ${kelas}" width="${ukuran}" height="${ukuran}" viewBox="0 0 120 120" aria-hidden="true" focusable="false"><use href="#nv-logo"></use></svg>`;
}

export function pasangSprite(): void {
  if (typeof document === "undefined" || !document.body) return;
  if (document.getElementById("rona-svg-sprite")) return;
  const div = document.createElement("div");
  div.id = "rona-svg-sprite";
  // Bukan display:none: gradien di dalam sprite tidak tergambar bila wadahnya disembunyikan.
  div.setAttribute("aria-hidden", "true");
  div.style.cssText = "position:absolute;width:0;height:0;overflow:hidden;pointer-events:none";
  let inner = `<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" focusable="false"><symbol id="nv-logo" viewBox="0 0 120 120">${LOGO_ISI}</symbol></svg><svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" focusable="false">`;
  for (const [id, path] of Object.entries(SIMBOL)) {
    inner += `<symbol id="ikon-${id}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${path}</symbol>`;
  }
  inner += "</svg>";
  div.innerHTML = inner;
  document.body.insertBefore(div, document.body.firstChild);
}

export function ikon(id: string, cls = ""): string {
  return `<svg class="ikon ${cls}" aria-hidden="true"><use href="#ikon-${id}"></use></svg>`;
}

export type TingkatLencanaRona =
  | "cukup"
  | "perhatian"
  | "celah"
  | "bahaya"
  | "kosong";

export function lencanaStatus(
  status: TingkatLencanaRona,
  labelKustom?: string,
): string {
  const peta: Record<
    TingkatLencanaRona,
    { cls: string; ikon: string; teks: string }
  > = {
    cukup: {
      cls: "lencana--cukup",
      ikon: "status-cukup",
      teks: "Cukup / Normal",
    },
    perhatian: {
      cls: "lencana--perhatian",
      ikon: "status-perhatian",
      teks: "Perlu Perhatian",
    },
    celah: {
      cls: "lencana--celah",
      ikon: "status-celah",
      teks: "Celah Nutrisi",
    },
    bahaya: {
      cls: "lencana--bahaya",
      ikon: "status-bahaya",
      teks: "Berhenti / Rujuk",
    },
    kosong: {
      cls: "lencana--kosong",
      ikon: "status-kosong",
      teks: "Belum Ada Data",
    },
  };
  const m = peta[status] || peta.cukup;
  return `<span class="lencana ${m.cls}">${ikon(m.ikon)}<span>${labelKustom || m.teks}</span></span>`;
}

/** Penanda asal klaim. Hanya asumsi pengembang yang diberi tanda; rujukan lain tidak ditandai agar tampilan tetap bersih. */
export function lencanaVerif(kode: "sah" | "perlu" | "draf" = "perlu"): string {
  if (kode === "draf") {
    return `<span class="verif verif--draf" title="Asumsi pengembang">${ikon("verif-draf")}<span>Asumsi</span></span>`;
  }
  return "";
}

/**
 * Memetakan posisi pita SD (tanpa angka Z-score kontinu, sesuai K-02 & INV-04)
 * ke persentase horizontal [0..100] pada lintasan pita WHO (-3 SD s.d. +3 SD).
 */
export function posisiKePersenPin(posisi: string | null): number {
  if (!posisi) return 50;
  const peta: Record<string, number> = {
    "<-3": 5,
    "tepat:-3": 9,
    "-3..-2": 16,
    "tepat:-2": 22,
    "-2..-1": 33,
    "tepat:-1": 41,
    "-1..0": 46,
    "-1..+1": 50,
    "tepat:0": 50,
    "0..+1": 55,
    "tepat:+1": 61,
    "+1..+2": 70,
    "tepat:+2": 78,
    "+2..+3": 87,
    "tepat:+3": 92,
    ">+3": 96,
  };
  return peta[posisi] ?? 50;
}

export function labelPosisiPita(posisi: string | null): string {
  if (!posisi) return "Di luar rentang tabel";
  const peta: Record<string, string> = {
    "<-3": "Di bawah garis -3 SD",
    "tepat:-3": "Tepat garis -3 SD",
    "-3..-2": "Pita -3 SD s.d. -2 SD",
    "tepat:-2": "Tepat garis -2 SD",
    "-2..-1": "Pita -2 SD s.d. -1 SD",
    "tepat:-1": "Tepat garis -1 SD",
    "-1..0": "Pita -1 SD s.d. Median",
    "-1..+1": "Pita -1 SD s.d. +1 SD",
    "tepat:0": "Tepat Median (0 SD)",
    "0..+1": "Pita Median s.d. +1 SD",
    "tepat:+1": "Tepat garis +1 SD",
    "+1..+2": "Pita +1 SD s.d. +2 SD",
    "tepat:+2": "Tepat garis +2 SD",
    "+2..+3": "Pita +2 SD s.d. +3 SD",
    "tepat:+3": "Tepat garis +3 SD",
    ">+3": "Di atas garis +3 SD",
  };
  return peta[posisi] ?? `Pita ${posisi} SD`;
}

export function tingkatVisualBBU(k: KategoriBbu): TingkatLencanaRona {
  if (k === "bb_sangat_kurang") return "bahaya";
  if (k === "bb_normal") return "cukup";
  return "perhatian";
}

export function tingkatVisualPBU(k: KategoriPbu): TingkatLencanaRona {
  if (k === "sangat_pendek") return "bahaya";
  if (k === "normal" || k === "tinggi") return "cukup";
  return "perhatian";
}

export function tingkatVisualBBPB(
  k: KategoriBbpb | "panjang_di_luar_tabel_setelah_pembulatan",
): TingkatLencanaRona {
  if (
    k === "gizi_buruk" ||
    k === "obesitas" ||
    k === "panjang_di_luar_tabel_setelah_pembulatan"
  ) {
    return "bahaya";
  }
  if (k === "gizi_baik") return "cukup";
  return "perhatian";
}
