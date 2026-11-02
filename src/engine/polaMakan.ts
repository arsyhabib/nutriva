import { DATA } from "./data";
import { acakUrut, buatAcak, pilih, type Acak } from "./prng";
import { hitungGizi, persenAkg, bulatPersen, type ItemMenu, type LaporanAkg, type TotalGizi } from "./gizi";
import { DATA_VERSION, ENGINE_VERSION, RULES_VERSION } from "./versi";
import type { BahanAtribut } from "./schema/bahan";

/**
 * Contoh pola makan 6-23 bulan. Deterministik: hasil hanya bergantung pada masukan dan benih.
 * Hasil adalah CONTOH dari aturan (asumsi pengembang KL-ASUMSI-POLA-MAKAN), bukan anjuran resmi.
 * Tanpa DOM, tanpa Date, tanpa Math.random.
 */

export interface MasukanPola {
  usia_bulan: number;
  /** jumlah hari 1..7 */
  hari: number;
  benih: string;
  /** id bahan atau kode alergen yang dihindari */
  hindari: string[];
  izinkan_hati: boolean;
  masih_asi: boolean;
}

export type KodePeringatan =
  | "usia_di_luar_cakupan"
  | "hari_tidak_valid"
  | "hindari_tidak_dikenal"
  | "tidak_ada_pilihan_staple"
  | "tidak_ada_pilihan_protein"
  | "tidak_ada_pilihan_sayur"
  | "tidak_ada_pilihan_buah"
  | "tidak_ada_pilihan_susu"
  | "mdd_belum_tercapai"
  | "vit_a_hewani_melebihi_batas";

export interface ItemSlot extends ItemMenu {
  peran: string;
}
export interface Slot {
  kode: string;
  item: ItemSlot[];
}
export interface MenuHari {
  hari_ke: number;
  slot: Slot[];
  gizi: TotalGizi;
  akg: LaporanAkg;
  energi_kkal: number;
  energi_target_kkal: number;
  energi_persen_target: number;
  kelompok_mdd: string[];
  jumlah_kelompok_mdd: number;
  mdd_tercapai: boolean;
  vit_a_hewani_rae_mcg: number;
  peringatan: KodePeringatan[];
}
export type KeluaranPola =
  | { hasil: "stop"; alasan: KodePeringatan; engine_version: string; data_version: string; rules_version: string }
  | {
      hasil: "ok";
      benih: string;
      pita: "6-8" | "9-11" | "12-23";
      hari: MenuHari[];
      klaim_ids: string[];
      label_belum_diverifikasi: true;
      engine_version: string;
      data_version: string;
      rules_version: string;
    };

type Atr = BahanAtribut["bahan"][number];
const ATR = new Map(DATA.bahanAtribut.bahan.map((b) => [b.id, b] as const));
const GIZI = new Map(DATA.bahanGizi.bahan.map((b) => [b.id, b] as const));

function pitaDariUsia(usia: number): "6-8" | "9-11" | "12-23" {
  return usia <= 8 ? "6-8" : usia <= 11 ? "9-11" : "12-23";
}

function kkalPerGram(id: string): number {
  const b = GIZI.get(id);
  const e = b?.per_100g.energi_kkal;
  if (e === undefined || e <= 0) throw new Error(`energi tidak tersedia untuk ${id}`);
  return e / 100;
}

function gramUntukEnergi(id: string, kkal: number, maksGram: number): number {
  const g = Math.floor(kkal / kkalPerGram(id) + 0.5);
  return Math.max(1, Math.min(g, maksGram));
}

function boleh(a: Atr, usia: number, hindari: ReadonlySet<string>): boolean {
  if (a.usia_min_bulan > usia) return false;
  if (hindari.has(a.id)) return false;
  return !a.alergen.some((x) => hindari.has(x));
}

function acakBeda(acak: Acak, daftar: readonly Atr[], terpakai: Set<string>): Atr | undefined {
  const baru = daftar.filter((a) => !terpakai.has(a.id));
  const p = pilih(acak, baru.length > 0 ? baru : daftar);
  if (p) terpakai.add(p.id);
  return p;
}

export function bangunPola(m: MasukanPola): KeluaranPola {
  const cap = { engine_version: ENGINE_VERSION, data_version: DATA_VERSION, rules_version: RULES_VERSION };
  if (!Number.isInteger(m.usia_bulan) || m.usia_bulan < 6 || m.usia_bulan > 23)
    return { hasil: "stop", alasan: "usia_di_luar_cakupan", ...cap };
  if (!Number.isInteger(m.hari) || m.hari < 1 || m.hari > 7) return { hasil: "stop", alasan: "hari_tidak_valid", ...cap };

  const A = DATA.aturanPolaMakan;
  const pitaKode = pitaDariUsia(m.usia_bulan);
  const pita = A.pita[pitaKode];
  const norm = m.hindari.map((x) => x.trim().toLowerCase());
  const alias: Record<string, string> = { gandum: "gluten" };
  const dikenal = new Set<string>([...DATA.bahanAtribut.bahan.map((b) => b.id), ...DATA.bahanAtribut.bahan.flatMap((b) => b.alergen), ...Object.keys(alias)]);
  if (norm.some((x) => !dikenal.has(x))) return { hasil: "stop", alasan: "hindari_tidak_dikenal", ...cap };
  const hindari = new Set<string>(norm.map((x) => alias[x] ?? x));
  const semua = DATA.bahanAtribut.bahan.filter((a) => boleh(a, m.usia_bulan, hindari));
  const hatiOk = m.izinkan_hati && semua.some((a) => a.id === "hati");
  const rngRencana = buatAcak(`${m.benih}|rencana|${pitaKode}`);
  // jatah hati satu kali per pekan (7 hari): hari terpilih dari 0..6, dipakai hanya bila jatuh di dalam rentang hari yang diminta
  const hariHati = hatiOk ? Math.floor(rngRencana() * 7) : -1;

  const staple = semua.filter((a) => a.peran === "staple");
  const telur = semua.filter((a) => a.kelompok_mdd === "telur");
  const fleshBiasa = semua.filter((a) => a.kelompok_mdd === "daging_ikan" && a.id !== "hati");
  const legum = semua.filter((a) => a.kelompok_mdd === "kacang_biji");
  const sayurA = semua.filter((a) => a.peran === "sayur" && a.kelompok_mdd === "sayur_buah_vit_a");
  const sayurL = semua.filter((a) => a.peran === "sayur" && a.kelompok_mdd === "sayur_buah_lain");
  const buahA = semua.filter((a) => a.peran === "buah" && a.kelompok_mdd === "sayur_buah_vit_a");
  const buahL = semua.filter((a) => a.peran === "buah" && a.kelompok_mdd === "sayur_buah_lain");
  const lemak = semua.filter((a) => a.peran === "lemak");
  const susu = semua.filter((a) => a.peran === "susu");

  if (staple.length === 0) return { hasil: "stop", alasan: "tidak_ada_pilihan_staple", ...cap };
  if (telur.length + fleshBiasa.length + legum.length === 0) return { hasil: "stop", alasan: "tidak_ada_pilihan_protein", ...cap };
  if (sayurA.length + sayurL.length === 0) return { hasil: "stop", alasan: "tidak_ada_pilihan_sayur", ...cap };

  const hari: MenuHari[] = [];
  for (let d = 0; d < m.hari; d++) {
    const acak = buatAcak(`${m.benih}|hari${d + 1}|${pitaKode}`);
    const peringatan = new Set<KodePeringatan>();
    const terpakai = new Set<string>();
    const slot: Slot[] = [];
    const P = A.porsi_energi;
    const E = pita.energi_mpasi_kkal;
    const kkalUtama = (E * P.makan_utama_dari_total) / pita.makan_utama;
    const rencanaProtein = acakUrut(
      acak,
      pita.makan_utama >= 3 ? ["telur", "daging_ikan", "kacang_biji"] : ["telur", "daging_ikan"],
    );
    const urutSayur = pita.makan_utama >= 3 ? ["a", "l", "a"] : ["a", "l"];

    for (let s = 0; s < pita.makan_utama; s++) {
      const item: ItemSlot[] = [];
      const st = acakBeda(acak, staple, terpakai);
      if (st) item.push({ bahan_id: st.id, gram: gramUntukEnergi(st.id, kkalUtama * P.staple, pita.porsi_maks_g.staple), peran: "staple" });
      else peringatan.add("tidak_ada_pilihan_staple");

      const jenis = rencanaProtein[s] as string;
      const kkalProtein = kkalUtama * P.protein;
      const daftarJenis = jenis === "telur" ? telur : jenis === "daging_ikan" ? fleshBiasa : legum;
      const cadangan = [...telur, ...fleshBiasa, ...legum];
      if (jenis === "daging_ikan" && d === hariHati && !item.some((x) => x.bahan_id === "hati")) {
        const gHati = A.batas.hati_maks_g_per_porsi;
        item.push({ bahan_id: "hati", gram: gHati, peran: "protein_hewani" });
        const sisa = Math.max(0, kkalProtein - kkalPerGram("hati") * gHati);
        const lain = acakBeda(acak, fleshBiasa, terpakai);
        if (lain && sisa > 0) item.push({ bahan_id: lain.id, gram: gramUntukEnergi(lain.id, sisa, pita.porsi_maks_g.protein), peran: lain.peran });
      } else {
        const pr = acakBeda(acak, daftarJenis.length > 0 ? daftarJenis : cadangan, terpakai);
        if (pr) item.push({ bahan_id: pr.id, gram: gramUntukEnergi(pr.id, kkalProtein, pita.porsi_maks_g.protein), peran: pr.peran });
        else peringatan.add("tidak_ada_pilihan_protein");
      }

      const sayurDaftar = urutSayur[s] === "a" ? (sayurA.length > 0 ? sayurA : sayurL) : sayurL.length > 0 ? sayurL : sayurA;
      const sy = acakBeda(acak, sayurDaftar, terpakai);
      if (sy) item.push({ bahan_id: sy.id, gram: gramUntukEnergi(sy.id, kkalUtama * P.sayur, pita.porsi_maks_g.sayur), peran: "sayur" });
      else peringatan.add("tidak_ada_pilihan_sayur");

      const lm = pilih(acak, lemak);
      if (lm) item.push({ bahan_id: lm.id, gram: gramUntukEnergi(lm.id, kkalUtama * P.lemak, pita.porsi_maks_g.lemak), peran: "lemak" });
      slot.push({ kode: `makan_${s + 1}`, item });
    }

    const kkalSelingan = pita.selingan > 0 ? (E * (1 - P.makan_utama_dari_total)) / pita.selingan : 0;
    for (let s = 0; s < pita.selingan; s++) {
      const item: ItemSlot[] = [];
      const daftarBuah = s === 0 ? (buahA.length > 0 ? buahA : buahL) : buahL.length > 0 ? buahL : buahA;
      const bh = acakBeda(acak, daftarBuah, terpakai);
      if (bh) item.push({ bahan_id: bh.id, gram: gramUntukEnergi(bh.id, kkalSelingan * P.selingan_buah, pita.porsi_maks_g.buah), peran: "buah" });
      else peringatan.add("tidak_ada_pilihan_buah");
      if (s === 0) {
        const sb = pilih(acak, susu);
        if (sb) item.push({ bahan_id: sb.id, gram: gramUntukEnergi(sb.id, kkalSelingan * P.selingan_susu, pita.porsi_maks_g.susu), peran: "susu" });
        else peringatan.add("tidak_ada_pilihan_susu");
      } else {
        const st = acakBeda(acak, staple, new Set<string>());
        if (st) item.push({ bahan_id: st.id, gram: gramUntukEnergi(st.id, kkalSelingan * P.selingan_susu, pita.porsi_maks_g.staple), peran: "staple" });
      }
      slot.push({ kode: `selingan_${s + 1}`, item });
    }

    const semuaItem: ItemMenu[] = slot.flatMap((x) => x.item.map((i) => ({ bahan_id: i.bahan_id, gram: i.gram })));
    const gizi = hitungGizi(semuaItem);
    const kel = new Set<string>();
    let vitAHewani = 0;
    for (const it of semuaItem) {
      const a = ATR.get(it.bahan_id) as Atr;
      if (a.kelompok_mdd !== "lemak") kel.add(a.kelompok_mdd);
      if (a.hewani) vitAHewani += ((GIZI.get(it.bahan_id)?.per_100g.vit_a_rae_mcg ?? 0) * it.gram) / 100;
    }
    if (m.masih_asi) kel.add("asi");
    const jumlah = kel.size;
    const mdd = jumlah >= A.batas.mdd_minimal_kelompok;
    if (!mdd) peringatan.add("mdd_belum_tercapai");
    if (vitAHewani > A.batas.vit_a_hewani_rae_mcg_per_hari) peringatan.add("vit_a_hewani_melebihi_batas");
    hari.push({
      hari_ke: d + 1,
      slot,
      gizi,
      akg: persenAkg(gizi, m.usia_bulan),
      energi_kkal: gizi.total.energi_kkal,
      energi_target_kkal: E,
      energi_persen_target: bulatPersen((gizi.total.energi_kkal / E) * 100),
      kelompok_mdd: [...kel].sort(),
      jumlah_kelompok_mdd: jumlah,
      mdd_tercapai: mdd,
      vit_a_hewani_rae_mcg: vitAHewani,
      peringatan: [...peringatan].sort(),
    });
  }

  return {
    hasil: "ok",
    benih: m.benih,
    pita: pitaKode,
    hari,
    klaim_ids: [
      "KL-AKG-ANAK",
      "KL-BAHAN-USDA-SRLEGACY",
      "KL-ENERGI-MPASI",
      "KL-MDD-8-KELOMPOK",
      "KL-ASUMSI-POLA-MAKAN",
      "KL-ASUMSI-BATAS-VITA",
      "KL-ASUMSI-BAHAN-ATRIBUT",
    ],
    label_belum_diverifikasi: true,
    ...cap,
  };
}
