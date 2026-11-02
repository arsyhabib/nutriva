import { DATA } from "./data";
import { DATA_VERSION, ENGINE_VERSION } from "./versi";
import { KOLOM_SD, type Sd7 } from "./schema/tabelSd";

/**
 * Antropometri anak 6–23 bulan (Permenkes 2/2020). Fungsi murni: tanpa DOM, tanpa Date.now,
 * tanpa Math.random. Hanya kategori dan posisi antar-garis SD; TIDAK menghitung z-score.
 */

export type JenisKelamin = "L" | "P";
export type CaraUkur = "terlentang" | "berdiri";

export interface MasukanStatus {
  jk: JenisKelamin;
  /** Usia bulan penuh + sisa hari. Hari tidak pernah membulatkan bulan ke atas. */
  umur: { bulan: number; hari: number };
  bb_kg: number;
  pb_cm: number;
  cara_ukur: CaraUkur;
}

export type AlasanStop =
  | "usia_di_bawah_6_bulan"
  | "usia_24_bulan_atau_lebih_di_luar_cakupan"
  | "berat_tidak_valid"
  | "panjang_di_luar_tabel";

export type KategoriBbu = "bb_sangat_kurang" | "bb_kurang" | "bb_normal" | "risiko_bb_lebih";
export type KategoriPbu = "sangat_pendek" | "pendek" | "normal" | "tinggi";
export type KategoriBbpb =
  | "gizi_buruk"
  | "gizi_kurang"
  | "gizi_baik"
  | "risiko_gizi_lebih"
  | "gizi_lebih"
  | "obesitas";

export interface HasilIndikator<K extends string> {
  kategori: K;
  /** "<-3", ">+3", "tepat:-2", atau "-2..-1"; null bila tak dapat dibaca. */
  posisi: string | null;
  klaim_id: string;
  label_belum_diverifikasi: boolean;
}

export interface CapVersi {
  engine_version: string;
  data_version: string;
}

export type KeluaranStatus =
  | ({ hasil: "stop"; alasan: AlasanStop } & CapVersi)
  | ({
      hasil: "ok";
      usia_bulan_penuh: number;
      panjang_dipakai_cm: number;
      panjang_tabel_cm: number;
      bbu: HasilIndikator<KategoriBbu>;
      pbu: HasilIndikator<KategoriPbu>;
      bbpb: HasilIndikator<KategoriBbpb | "panjang_di_luar_tabel_setelah_pembulatan">;
      /** Klaim asumsi yang berlaku pada pembulatan panjang BB/PB (D-6). */
      klaim_asumsi: string[];
    } & CapVersi);

const KLAIM_PEMBULATAN = "KL-ASUMSI-PEMBULATAN-PANJANG";
// klaim: n/a — skala bilangan bulat untuk pembulatan desimal tepat, bukan konstanta ilmiah
const SKALA = 1_000_000;
// klaim: n/a — usia terendah cakupan aplikasi (6 bulan); belum punya klaim_id sendiri (keputusan terbuka)
const USIA_MIN_BULAN = 6;
// klaim: n/a — usia batas atas eksklusif cakupan (24 bulan; ambiguitas C-022); belum punya klaim_id sendiri
const USIA_BATAS_ATAS_BULAN = 24;
// klaim: n/a — koreksi +0,7 cm ukur berdiri <24 bulan (Permenkes 2/2020); belum punya klaim_id sendiri (keputusan terbuka)
const KOREKSI_BERDIRI_CM = 0.7;
// klaim: KL-SD-BBPB-L
const PANJANG_MIN_CM = 45;
// klaim: KL-SD-BBPB-L
const PANJANG_MAKS_CM = 110;

/** Bilangan desimal -> bilangan bulat berskala (hindari galat float pada pembulatan). */
function keSkala(x: number): number {
  return Math.round(x * SKALA);
}
/** Pembulatan setengah-naik bilangan bulat berskala ke kelipatan `langkah` (juga berskala). */
function bulatSetengahNaik(nilai: number, langkah: number): number {
  return Math.floor((nilai + langkah / 2) / langkah) * langkah;
}
function dariSkala(n: number): number {
  return n / SKALA;
}

function posisi(nilai: number, sd: Sd7): string {
  if (nilai < sd[0]) return "<-3";
  if (nilai > sd[6]) return ">+3";
  for (let k = 0; k < 7; k++) if (nilai === sd[k]) return `tepat:${KOLOM_SD[k]}`;
  for (let k = 0; k < 6; k++) {
    if ((sd[k] as number) < nilai && nilai < (sd[k + 1] as number)) return `${KOLOM_SD[k]}..${KOLOM_SD[k + 1]}`;
  }
  /* c8 ignore next */
  throw new Error("posisi SD tak terjangkau (tabel tidak monoton?)");
}

function katBbu(n: number, sd: Sd7): KategoriBbu {
  if (n < sd[0]) return "bb_sangat_kurang";
  if (n < sd[1]) return "bb_kurang";
  if (n <= sd[4]) return "bb_normal";
  return "risiko_bb_lebih";
}
function katPbu(n: number, sd: Sd7): KategoriPbu {
  if (n < sd[0]) return "sangat_pendek";
  if (n < sd[1]) return "pendek";
  if (n <= sd[6]) return "normal";
  return "tinggi";
}
function katBbpb(n: number, sd: Sd7): KategoriBbpb {
  if (n < sd[0]) return "gizi_buruk";
  if (n < sd[1]) return "gizi_kurang";
  if (n <= sd[4]) return "gizi_baik";
  if (n <= sd[5]) return "risiko_gizi_lebih";
  if (n <= sd[6]) return "gizi_lebih";
  return "obesitas";
}

const CAP: CapVersi = { engine_version: ENGINE_VERSION, data_version: DATA_VERSION };

function stop(alasan: AlasanStop): KeluaranStatus {
  return { hasil: "stop", alasan, ...CAP };
}

export function hitungStatus(m: MasukanStatus): KeluaranStatus {
  const bulan = m.umur.bulan;
  if (bulan < USIA_MIN_BULAN) return stop("usia_di_bawah_6_bulan");
  if (bulan >= USIA_BATAS_ATAS_BULAN) return stop("usia_24_bulan_atau_lebih_di_luar_cakupan");
  if (!(m.bb_kg > 0) || !Number.isFinite(m.bb_kg)) return stop("berat_tidak_valid");
  if (!Number.isFinite(m.pb_cm)) return stop("panjang_di_luar_tabel");

  // Koreksi berdiri (<24 bulan): +0,7 cm, dibulatkan 1 desimal setengah-naik.
  let pbS = keSkala(m.pb_cm);
  if (m.cara_ukur === "berdiri") pbS = bulatSetengahNaik(pbS + keSkala(KOREKSI_BERDIRI_CM), SKALA / 10);
  const pb = dariSkala(pbS);
  if (!(pb >= PANJANG_MIN_CM && pb <= PANJANG_MAKS_CM)) return stop("panjang_di_luar_tabel");

  const bbuRow = DATA.bbu[m.jk].baris.find((r) => r.bulan === bulan);
  const pbuRow = DATA.pbu[m.jk].baris.find((r) => r.bulan === bulan);
  if (!bbuRow || !pbuRow) throw new Error(`tabel SD tidak memuat bulan ${bulan}`);

  const bbu: HasilIndikator<KategoriBbu> = {
    kategori: katBbu(m.bb_kg, bbuRow.sd),
    posisi: posisi(m.bb_kg, bbuRow.sd),
    klaim_id: DATA.bbu[m.jk].klaim_id,
    label_belum_diverifikasi: DATA.bbu[m.jk].label_belum_diverifikasi === true,
  };
  const pbu: HasilIndikator<KategoriPbu> = {
    kategori: katPbu(pb, pbuRow.sd),
    posisi: posisi(pb, pbuRow.sd),
    klaim_id: DATA.pbu[m.jk].klaim_id,
    label_belum_diverifikasi: DATA.pbu[m.jk].label_belum_diverifikasi === true,
  };

  // D-6: panjang dibulatkan ke kelipatan 0,5 cm terdekat, setengah naik.
  const pbTabel = dariSkala(bulatSetengahNaik(pbS, SKALA / 2));
  const tabelBbpb = DATA.bbpb[m.jk];
  const rowBbpb = tabelBbpb.baris.find((r) => r.panjang_cm === pbTabel);
  const meta = {
    klaim_id: tabelBbpb.klaim_id,
    label_belum_diverifikasi: tabelBbpb.label_belum_diverifikasi === true,
  };
  const bbpb: HasilIndikator<KategoriBbpb | "panjang_di_luar_tabel_setelah_pembulatan"> = rowBbpb
    ? { kategori: katBbpb(m.bb_kg, rowBbpb.sd), posisi: posisi(m.bb_kg, rowBbpb.sd), ...meta }
    : { kategori: "panjang_di_luar_tabel_setelah_pembulatan", posisi: null, ...meta };

  return {
    hasil: "ok",
    usia_bulan_penuh: bulan,
    panjang_dipakai_cm: pb,
    panjang_tabel_cm: pbTabel,
    bbu,
    pbu,
    bbpb,
    klaim_asumsi: [KLAIM_PEMBULATAN],
    ...CAP,
  };
}
