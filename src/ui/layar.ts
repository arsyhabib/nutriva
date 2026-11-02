import { ringkasan, type MasukanRingkasan, type Ringkasan } from "../app/fasad";
import { urlWorkerAiDariEnv } from "../app/konfigurasi";
import {
  LABEL_BBPB,
  LABEL_BBU,
  LABEL_CELAH,
  LABEL_PBU,
  LABEL_PITA,
  NAMA_ZAT,
  PERINGATAN_AI,
  PERNYATAAN_PRIVASI_AI,
} from "../ai/glosarium";
import { mintaPenjelasan, type HasilPenjelasan } from "../ai/klien";
import type { MuatanAi } from "../ai/kontrak";
import { jelaskanTemplat } from "../ai/templat";
import { DATA } from "../engine/data";
import { LABEL_PROTOTIPE } from "../engine/konstanta";
import { daftarTandaBahaya } from "../engine/rujukan";
import type { KunciZat } from "../engine/schema/bahan";
import klaimData from "../../data/claims.json";
import sumberData from "../../data/sources.json";
import {
  BejanaNektar,
  geserKe,
  inisialisasiOptikGlobal,
  luncurkanTetesanNektar,
  Motion,
  pasangEfekOptik,
  Pegas,
  SutraField,
  Ticker,
  type ModeGerak,
  type StatusVisualRona,
  type TemaRona,
} from "./fisika";
import {
  ikon,
  labelPosisiPita,
  lencanaStatus,
  lencanaVerif,
  pasangSprite,
  posisiKePersenPin,
  tingkatVisualBBPB,
  tingkatVisualBBU,
  tingkatVisualPBU,
  type TingkatLencanaRona,
} from "./ikon";
import { klonMasukan, PRESET_SINTETIS, type KodePreset } from "./preset";

export type { TemaRona };

export type IdLayar =
  | "gerbang"
  | "profil"
  | "status"
  | "piring"
  | "kolam"
  | "kenapa"
  | "ahli"
  | "bahaya"
  | "tentang"
  | "kosong"
  | "memuat"
  | "luring"
  | "kedaluwarsa"
  | "galat"
  | "tidakLayak"
  | "dataTidakAda"
  | "hapus"
  | "kartuBagi";

export type PeranRona = "ibu" | "kader" | "ahli";

export interface InfoLayar {
  id: IdLayar;
  kode: string;
  label: string;
  kelompok: "Utama" | "Rujukan & Audit" | "Keadaan Sesi";
}

export const DAFTAR_LAYAR: readonly InfoLayar[] = [
  { id: "gerbang", kode: "A1", label: "Gerbang & Privasi", kelompok: "Utama" },
  { id: "profil", kode: "A2", label: "Profil & Skrining", kelompok: "Utama" },
  { id: "status", kode: "A3", label: "Peta Pertumbuhan", kelompok: "Utama" },
  { id: "piring", kode: "A4", label: "Sajian & Belanja", kelompok: "Utama" },
  { id: "kolam", kode: "A5", label: "Bejana Nektar AKG", kelompok: "Utama" },
  { id: "kenapa", kode: "A6", label: "Kenapa Hasil Ini?", kelompok: "Utama" },
  { id: "ahli", kode: "A7", label: "Mode Ahli & Sumber", kelompok: "Rujukan & Audit" },
  { id: "bahaya", kode: "A8", label: "Hening Darurat (Rujuk)", kelompok: "Rujukan & Audit" },
  { id: "tentang", kode: "A9", label: "Tentang & Hak Data", kelompok: "Rujukan & Audit" },
  { id: "kartuBagi", kode: "K10", label: "Kartu Ringkasan Posyandu", kelompok: "Rujukan & Audit" },
  { id: "kosong", kode: "K01", label: "Keadaan Awal / Kosong", kelompok: "Keadaan Sesi" },
  { id: "memuat", kode: "K02", label: "Menakar Porsi Menu", kelompok: "Keadaan Sesi" },
  { id: "luring", kode: "K03", label: "Mode Luring & Cadangan", kelompok: "Keadaan Sesi" },
  { id: "kedaluwarsa", kode: "K04", label: "Pengingat Ukur Ulang", kelompok: "Keadaan Sesi" },
  { id: "galat", kode: "K05", label: "Validasi Rentang Ukuran", kelompok: "Keadaan Sesi" },
  { id: "tidakLayak", kode: "K06", label: "Celah Nutrisi & Cakupan", kelompok: "Keadaan Sesi" },
  { id: "dataTidakAda", kode: "K07", label: "Transparansi Sel Kosong", kelompok: "Keadaan Sesi" },
  { id: "hapus", kode: "K09", label: "Reset Memori Sesi", kelompok: "Keadaan Sesi" },
];

const PETA_ATRIBUT = new Map(
  DATA.bahanAtribut.bahan.map((b) => [b.id, b] as const),
);
const PETA_GIZI_BAHAN = new Map(
  DATA.bahanGizi.bahan.map((b) => [b.id, b] as const),
);

const DAFTAR_ALERGEN_UI: readonly { kode: string; label: string }[] = [
  { kode: "telur", label: "Telur" },
  { kode: "ikan", label: "Ikan" },
  { kode: "kedelai", label: "Kedelai (Tempe/Tahu)" },
  { kode: "susu", label: "Susu Sapi / Olahan" },
  { kode: "udang", label: "Udang" },
  { kode: "gluten", label: "Gluten / Oat" },
];

const LABEL_PERAN_BAHAN: Record<string, string> = {
  staple: "Makanan Pokok",
  protein_hewani: "Protein Hewani",
  protein_nabati: "Protein Nabati",
  sayur: "Sayuran",
  buah: "Buah Segar",
  lemak: "Lemak Tambahan",
  susu: "Susu / Olahan",
};

const LABEL_KELOMPOK_MDD: Record<string, string> = {
  asi: "ASI",
  serealia: "Serealia & Umbi",
  kacang_biji: "Kacang & Olahan",
  susu_olahan: "Susu & Olahan",
  daging_ikan: "Daging, Hati & Ikan",
  telur: "Telur",
  sayur_buah_vit_a: "Sayur/Buah Kaya Vit A",
  sayur_buah_lain: "Sayur & Buah Lain",
};

const LABEL_KELAS_HARGA: Record<
  "murah" | "sedang" | "mahal",
  { teks: string; status: TingkatLencanaRona }
> = {
  murah: { teks: "Kelas Harga: Murah", status: "cukup" },
  sedang: { teks: "Kelas Harga: Sedang", status: "perhatian" },
  mahal: { teks: "Kelas Harga: Mahal", status: "celah" },
};

const DAFTAR_BENIH_VARIASI: readonly {
  benih: string;
  kode: string;
  judul: string;
  catatan: string;
}[] = [
  {
    benih: "rona-sintetis-a1",
    kode: "#A7F3",
    judul: "Variasi #A7F3 — Racikan Seimbang Harian",
    catatan:
      "Kombinasi makanan pokok, protein hewani/nabati, sayur kaya vitamin A, dan lemak tambahan sesuai pita usia.",
  },
  {
    benih: "rona-sintetis-v2",
    kode: "#3C9B",
    judul: "Variasi #3C9B — Alternatif Pesisir & Kebun",
    catatan:
      "Menukar sumber karbohidrat, lauk protein, dan sayuran lokal secara deterministik agar anak tidak bosan.",
  },
  {
    benih: "rona-sintetis-v3",
    kode: "#E1D0",
    judul: "Variasi #E1D0 — Padat Mikronutrien Lokal",
    catatan:
      "Mengutamakan variasi lauk hewani dan kacang-kacangan dengan buah penyerap zat besi.",
  },
  {
    benih: "rona-sintetis-v4",
    kode: "#C0DE",
    judul: "Variasi #C0DE — Rotasi Menu Keluarga",
    catatan:
      "Alternatif rotasi bahan dapur harian dengan tetap menjaga target minimal 5 dari 8 kelompok pangan MDD.",
  },
];

const ZAT_BEJANA_UTAMA: readonly {
  zat: KunciZat;
  label: string;
  viskositas: number;
  meniskus: number;
  catatan: string;
}[] = [
  {
    zat: "protein_g",
    label: "Protein Pertumbuhan",
    viskositas: 0.9,
    meniskus: 5.8,
    catatan:
      "Protein hewani (telur, ikan, ayam, hati) dan nabati (tempe, tahu) menyediakan asam amino esensial pertumbuhan jaringan.",
  },
  {
    zat: "besi_mg",
    label: "Zat Besi (Fe) — Nutrisi Kritis",
    viskositas: 0.85,
    meniskus: 6.8,
    catatan:
      "Target AKG 6–11 bln (11 mg/hari) sangat tinggi dibanding kapasitas lambung bayi; hati ayam, daging, dan ikan membantu memperkecil celah.",
  },
  {
    zat: "seng_mg",
    label: "Seng (Zn) — Imunitas & Pertumbuhan",
    viskositas: 0.88,
    meniskus: 5.4,
    catatan:
      "Mendukung pembelahan sel dan daya tahan saluran cerna; banyak terdapat pada lauk hewani dan kacang-kacangan.",
  },
  {
    zat: "kalsium_mg",
    label: "Kalsium (Ca) — Pertumbuhan Tulang",
    viskositas: 0.93,
    meniskus: 5.0,
    catatan:
      "Mendukung mineralisasi tulang dan gigi bersama Vitamin D dan fosfor.",
  },
  {
    zat: "vit_a_rae_mcg",
    label: "Vitamin A — Kesehatan Mata & Mukosa",
    viskositas: 0.95,
    meniskus: 4.6,
    catatan:
      "Berasal dari hati ayam, telur, wortel, bayam, labu kuning, dan pepaya (perhatikan perbedaan satuan RAE di USDA vs RE di AKG).",
  },
  {
    zat: "vit_c_mg",
    label: "Vitamin C — Penyerap Zat Besi",
    viskositas: 0.96,
    meniskus: 4.2,
    catatan:
      "Asam askorbat dari buah segar dan sayur membantu penyerapan zat besi non-heme di saluran cerna.",
  },
];

function fmtId(num: number | null | undefined, desimal = 1): string {
  if (num === null || num === undefined || !Number.isFinite(num)) return "—";
  return num.toFixed(desimal).replace(".", ",");
}

function escHtml(teks: string): string {
  return teks
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function takaranRumahTangga(gram: number, peran: string): string {
  if (peran === "lemak") {
    const sdt = Math.max(0.5, Math.round((gram / 5) * 2) / 2);
    return `${gram} g (~${fmtId(sdt, sdt % 1 === 0 ? 0 : 1)} sdt)`;
  }
  if (peran === "protein_hewani" || peran === "protein_nabati") {
    const ptg = Math.max(0.5, Math.round((gram / 30) * 2) / 2);
    return `${gram} g (~${fmtId(ptg, ptg % 1 === 0 ? 0 : 1)} potong kecil)`;
  }
  const sdm = Math.max(1, Math.round(gram / 15));
  return `${gram} g (~${sdm} sdm)`;
}

function namaSlotWaktu(kode: string): { judul: string; sub: string } {
  const peta: Record<string, { judul: string; sub: string }> = {
    makan_1: {
      judul: "Makan Utama Pagi (08.00)",
      sub: "Karbohidrat pokok + lauk protein + sayur + lemak tambahan",
    },
    makan_2: {
      judul: "Makan Utama Siang (12.30)",
      sub: "Rotasi lauk protein kedua + sayuran + lemak sehat",
    },
    makan_3: {
      judul: "Makan Utama Sore (17.00)",
      sub: "Makan utama ketiga untuk melengkapi kebutuhan energi harian",
    },
    selingan_1: {
      judul: "Selingan Pagi (10.00)",
      sub: "Buah kaya vitamin C & pelengkap energi di antara jam makan",
    },
    selingan_2: {
      judul: "Selingan Sore (15.00)",
      sub: "Selingan buah segar & pangan padat gizi sore hari",
    },
  };
  return peta[kode] ?? { judul: `Waktu Makan (${kode})`, sub: "Porsi terukur" };
}

export interface StateLayarRona {
  presetAktif: KodePreset;
  peran: PeranRona;
  tema: TemaRona;
  layar: IdLayar;
  hariMenuIdx: number;
  masukan: MasukanRingkasan;
  showStrata: boolean;
  modeAhli: boolean;
  tampilkanSemuaZat: boolean;
  layoutPenuh: boolean;
  aiStatus: HasilPenjelasan | null;
  aiMenuPerHari: Record<number, HasilPenjelasan>;
  sedangMemuatAi: boolean;
}

export interface OpsiLayarRona {
  presetAwal?: KodePreset;
  peranAwal?: PeranRona;
  temaAwal?: TemaRona;
  layarAwal?: IdLayar;
  urlWorkerAi?: string;
}

export class LayarRona {
  private akar: HTMLElement;
  private state: StateLayarRona;
  private urlWorkerAi: string | undefined;
  private htmlTerakhir = "";
  private sutraAtelier: SutraField | null = null;
  private sutraHp: SutraField | null = null;
  private bejanaInstances: BejanaNektar[] = [];
  private lembarTerbuka: { html: string; detent: "peek" | "half" | "full" } | null = null;

  constructor(akar: HTMLElement, opsi: OpsiLayarRona = {}) {
    this.akar = akar;
    const presetKode = opsi.presetAwal ?? "A";
    const preset = PRESET_SINTETIS[presetKode];
    const peran = opsi.peranAwal ?? "ibu";
    const tema =
      opsi.temaAwal ??
      (peran === "kader" ? "terik" : peran === "ahli" ? "lensa" : "fajar");

    this.urlWorkerAi = opsi.urlWorkerAi ?? urlWorkerAiDariEnv(import.meta.env as unknown as Record<string, unknown>);
    this.state = {
      presetAktif: presetKode,
      peran,
      tema,
      layar: opsi.layarAwal ?? "gerbang",
      hariMenuIdx: 0,
      masukan: klonMasukan(preset.masukan),
      showStrata: true,
      modeAhli: peran === "ahli" || opsi.layarAwal === "ahli",
      tampilkanSemuaZat: false,
      layoutPenuh: false,
      aiStatus: null,
      aiMenuPerHari: {},
      sedangMemuatAi: false,
    };
  }

  pasang(): void {
    pasangSprite();
    inisialisasiOptikGlobal();
    this.sinkronAtributDokumen();
    this.render();
  }

  ambilState(): Readonly<StateLayarRona> {
    return this.state;
  }

  ambilHtml(): string {
    return this.akar.innerHTML || this.htmlTerakhir;
  }

  hitungRingkasan(): Ringkasan {
    return ringkasan(this.state.masukan);
  }

  pilihPreset(kode: KodePreset): void {
    const p = PRESET_SINTETIS[kode] ?? PRESET_SINTETIS.A;
    this.state.presetAktif = p.id;
    this.state.masukan = klonMasukan(p.masukan);
    this.state.hariMenuIdx = 0;
    this.state.aiStatus = null;
    this.state.aiMenuPerHari = {};
    this.lembarTerbuka = null;
    this.render();
  }

  aturPeran(peran: PeranRona): void {
    this.state.peran = peran;
    this.state.modeAhli = peran === "ahli";
    if (peran === "kader") this.state.tema = "terik";
    else if (peran === "ahli") this.state.tema = "lensa";
    else if (this.state.tema === "terik" || this.state.tema === "lensa") {
      this.state.tema = "fajar";
    }
    this.sinkronAtributDokumen();
    this.render();
  }

  aturTema(tema: TemaRona): void {
    this.state.tema = tema;
    this.sinkronAtributDokumen();
    this.render();
  }

  bukaLayar(id: IdLayar): void {
    this.state.layar = id;
    if (id === "ahli") {
      this.state.modeAhli = true;
    }
    this.lembarTerbuka = null;
    this.render();
  }

  pilihHariMenu(idx: number): void {
    const r = this.hitungRingkasan();
    const maks =
      r.hasil === "ok" && r.pola ? Math.max(0, r.pola.hari.length - 1) : 0;
    this.state.hariMenuIdx = Math.max(0, Math.min(maks, idx));
    this.render();
  }

  gantiVariasiBenih(triggerEl?: HTMLElement | null): void {
    const cur = this.state.masukan.pola.benih;
    const idxCur = DAFTAR_BENIH_VARIASI.findIndex((b) => b.benih === cur);
    const nextIdx = (idxCur + 1) % DAFTAR_BENIH_VARIASI.length;
    const nextVar = DAFTAR_BENIH_VARIASI[nextIdx] ?? DAFTAR_BENIH_VARIASI[0]!;
    this.state.masukan.pola.benih = nextVar.benih;
    this.state.aiMenuPerHari = {};
    this.render();
    this.picuTetesan(triggerEl ?? null, `Benih ${nextVar.kode} Diterapkan`);
  }

  aturMasukanKustom(pengubah: (m: MasukanRingkasan) => void): void {
    pengubah(this.state.masukan);
    this.state.aiStatus = null;
    this.state.aiMenuPerHari = {};
    this.render();
  }

  resetSesiKeAwal(): void {
    this.state.presetAktif = "A";
    this.state.masukan = klonMasukan(PRESET_SINTETIS.A.masukan);
    this.state.hariMenuIdx = 0;
    this.state.layar = "gerbang";
    this.state.aiStatus = null;
    this.state.aiMenuPerHari = {};
    this.lembarTerbuka = null;
    this.render();
  }

  async segarkanPenjelasanAiStatus(): Promise<void> {
    const r = this.hitungRingkasan();
    if (r.hasil !== "ok" || !r.muatan_ai_status) return;
    this.state.sedangMemuatAi = true;
    this.render();
    const hasil = await mintaPenjelasan(r.muatan_ai_status, {
      urlWorker: this.urlWorkerAi,
    });
    this.state.aiStatus = hasil;
    this.state.sedangMemuatAi = false;
    this.render();
  }

  async segarkanPenjelasanAiMenu(hariIdx: number): Promise<void> {
    const r = this.hitungRingkasan();
    if (r.hasil !== "ok") return;
    const muatan = r.muatan_ai_menu[hariIdx];
    if (!muatan) return;
    this.state.sedangMemuatAi = true;
    this.render();
    const hasil = await mintaPenjelasan(muatan, {
      urlWorker: this.urlWorkerAi,
    });
    this.state.aiMenuPerHari[hariIdx] = hasil;
    this.state.sedangMemuatAi = false;
    this.render();
  }

  private sinkronAtributDokumen(): void {
    if (typeof document === "undefined" || !document.documentElement) return;
    document.documentElement.setAttribute("data-theme", this.state.tema);
    document.documentElement.setAttribute("data-peran", this.state.peran);
  }

  private ambilPenjelasanStatus(muatan: MuatanAi | null): HasilPenjelasan | null {
    if (!muatan) return null;
    if (this.state.aiStatus) return this.state.aiStatus;
    return {
      sumber: "templat",
      teks: jelaskanTemplat(muatan),
      alasan_templat: "bawaan_deterministik",
    };
  }

  private ambilPenjelasanMenu(
    hariIdx: number,
    muatan: MuatanAi | undefined,
  ): HasilPenjelasan | null {
    if (!muatan) return null;
    const simpanan = this.state.aiMenuPerHari[hariIdx];
    if (simpanan) return simpanan;
    return {
      sumber: "templat",
      teks: jelaskanTemplat(muatan),
      alasan_templat: "bawaan_deterministik",
    };
  }

  private bersihkanKanvas(): void {
    this.bejanaInstances.forEach((b) => b.destroy());
    this.bejanaInstances = [];
    if (this.sutraHp) {
      this.sutraHp.destroy();
      this.sutraHp = null;
    }
    if (this.sutraAtelier) {
      this.sutraAtelier.destroy();
      this.sutraAtelier = null;
    }
  }

  private render(): void {
    this.bersihkanKanvas();
    const r = this.hitungRingkasan();
    const darurat =
      this.state.layar === "bahaya" ||
      (r.hasil === "ok" && r.rujukan.tingkat === "rujuk");

    const isiLayar = this.bangunIsiLayar(r);
    const navHtml = this.bangunNavBawah();
    const dockHtml = this.bangunDockDesktop(r);
    const sheetOpen = this.lembarTerbuka !== null;
    const sheetDetent = this.lembarTerbuka?.detent ?? "half";

    const html = `
      <div class="rona-app-shell" data-theme="${this.state.tema}" data-peran="${this.state.peran}" data-layout="${this.state.layoutPenuh ? "penuh" : "bingkai"}">
        <canvas class="atelier-bg" id="rona-atelier-canvas" aria-hidden="true"></canvas>
        <div class="rona-app-stage">
          <main id="konten-utama" class="hp" data-theme="${this.state.tema}" aria-label="Aplikasi Mobile NUTRIVA Rona">
            <canvas class="sutra-bg" id="rona-hp-sutra" aria-hidden="true"></canvas>
            <div class="tetes-layer" id="rona-tetes-layer" aria-hidden="true"></div>

            <header class="hp__status">
              <span class="hp__status-pill">
                <span class="hp__status-dot"></span>
                <span>NUTRIVA Rona · Kasus ${this.state.presetAktif}</span>
              </span>
              <div class="hp__status-actions">
                <button type="button" class="hp__status-btn" data-open-kontrol="true" title="Buka Pengaturan Kasus, Tema & Semua Layar">
                  ${ikon("kontrol")}
                  <span>Kontrol &amp; Layar</span>
                </button>
                <button type="button" class="hp__status-btn" data-toggle-layout="true" title="Ubah Mode Layar Penuh / Bingkai Ponsel">
                  ${ikon("layar-penuh")}
                  <span>${this.state.layoutPenuh ? "Bingkai" : "Penuh"}</span>
                </button>
              </div>
            </header>

            <div class="pita-kejujuran" role="note">
              <strong>${escHtml(LABEL_PROTOTIPE)}</strong>
            </div>

            <div class="hp__scroll" id="rona-hp-scroll">
              ${isiLayar}
            </div>

            <div class="lembar-backdrop ${sheetOpen ? "is-open" : ""}" data-close-sheet="true"></div>
            <section
              class="lembar"
              role="dialog"
              aria-modal="true"
              aria-label="Lembar Rincian & Kontrol"
              ${sheetOpen ? `data-detent="${sheetDetent}"` : ""}
            >
              ${sheetOpen ? this.bangunKerangkaLembar(this.lembarTerbuka!.html, sheetDetent) : ""}
            </section>

            <nav class="hp__nav" aria-label="Navigasi Utama Aplikasi">
              ${navHtml}
            </nav>
          </main>

          ${dockHtml}
        </div>
      </div>
    `;

    this.htmlTerakhir = html;
    this.akar.innerHTML = html;

    this.hidupkanMesinVisual(darurat);
    this.ikatInteraksiDom(r);
  }

  private bangunKerangkaLembar(
    isiHtml: string,
    detent: "peek" | "half" | "full",
  ): string {
    return `
      <div class="lembar__pegangan" data-cycle-detent="true" title="Ketuk untuk ubah tinggi lembar"></div>
      <div class="lembar__kontrol">
        <div class="lembar__detents" role="group" aria-label="Tinggi lembar">
          <button type="button" class="lembar__detent-btn ${detent === "peek" ? "is-active" : ""}" data-set-detent="peek">Intip (36%)</button>
          <button type="button" class="lembar__detent-btn ${detent === "half" ? "is-active" : ""}" data-set-detent="half">Separuh (64%)</button>
          <button type="button" class="lembar__detent-btn ${detent === "full" ? "is-active" : ""}" data-set-detent="full">Penuh (88%)</button>
        </div>
        <button type="button" class="btn btn--ghost" data-close-sheet="true" style="min-height:32px;padding:4px 10px;font-size:11px;">
          ${ikon("aksi-tutup")}
          <span>Tutup</span>
        </button>
      </div>
      <div class="lembar__isi">
        ${isiHtml}
      </div>
    `;
  }

  public bukaLembar(
    isiHtml: string,
    detent: "peek" | "half" | "full" = "half",
  ): void {
    this.lembarTerbuka = { html: isiHtml, detent };
    this.render();
  }

  public bukaLembarBahan(bahanId: string, gram = 30): void {
    this.bukaLembar(this.bangunLembarInspeksiBahan(bahanId, gram), "half");
  }

  public bukaLembarBejana(zat: KunciZat): void {
    const r = this.hitungRingkasan();
    this.bukaLembar(this.bangunLembarInspeksiZat(zat, r), "half");
  }

  public tutupLembar(): void {
    if (!this.lembarTerbuka) return;
    this.lembarTerbuka = null;
    this.render();
  }

  public toggleStrata(): void {
    this.state.showStrata = !this.state.showStrata;
    this.render();
  }

  public toggleLayoutPenuh(): void {
    this.state.layoutPenuh = !this.state.layoutPenuh;
    this.render();
  }

  private bangunNavBawah(): string {
    const tabUtama: readonly { id: IdLayar; label: string; ic: string }[] = [
      { id: "gerbang", label: "Masuk", ic: "nav-gerbang" },
      { id: "profil", label: "Profil", ic: "nav-profil" },
      { id: "status", label: "Status", ic: "nav-status" },
      { id: "piring", label: "Sajian", ic: "nav-piring" },
      { id: "kolam", label: "Bejana", ic: "nav-kolam" },
    ];

    return tabUtama
      .map((t) => {
        const aktif =
          this.state.layar === t.id ||
          (t.id === "kolam" &&
            (this.state.layar === "kenapa" ||
              this.state.layar === "ahli" ||
              this.state.layar === "kartuBagi")) ||
          (t.id === "status" && this.state.layar === "bahaya") ||
          (t.id === "gerbang" && this.state.layar === "tentang");
        return `
          <button
            type="button"
            class="hp__nav-btn ${aktif ? "is-active" : ""}"
            data-go="${t.id}"
            ${aktif ? 'aria-current="page"' : ""}
          >
            ${ikon(t.ic)}
            <span>${t.label}</span>
          </button>
        `;
      })
      .join("");
  }

  private bangunDockDesktop(r: Ringkasan): string {
    const tingkatLabel =
      r.hasil === "stop"
        ? `BERHENTI (${r.alasan})`
        : r.rujukan.tingkat === "rujuk"
          ? "WAJIB RUJUK NAKES"
          : r.rujukan.tingkat === "perhatian"
            ? "PERLU PERHATIAN"
            : "PERTUMBUHAN NORMAL";

    return `
      <aside class="dock-panel" aria-label="Panel Kendali & Simulasi Penguji">
        <div class="dock-panel__head">
          <div>
            <div class="layar__kicker">Studio Pendamping · V-PJBL 2026</div>
            <div class="dock-panel__brand">NUTRIVA <em>Rona</em></div>
            <div class="dock-panel__sub">Aplikasi mobile MPASI &amp; antropometri deterministik berbasis Permenkes RI No. 2/2020 &amp; 28/2019.</div>
          </div>
        </div>

        <div class="dock-section">
          <span class="dock-section__label">Status Mesin Deterministik</span>
          <div style="display:flex;align-items:center;justify-content:space-between;gap:6px;flex-wrap:wrap;">
            ${lencanaStatus(
              r.hasil === "stop" || (r.hasil === "ok" && r.rujukan.tingkat === "rujuk")
                ? "bahaya"
                : r.hasil === "ok" && r.rujukan.tingkat === "perhatian"
                  ? "perhatian"
                  : "cukup",
              tingkatLabel,
            )}
            ${lencanaVerif("perlu")}
          </div>
        </div>

        <div class="dock-section">
          <span class="dock-section__label">1. Pilih Kasus Uji Sintetis (Tanpa Data Pribadi)</span>
          <div class="pilihan-grid">
            ${(["A", "B", "C"] as KodePreset[])
              .map((k) => {
                const p = PRESET_SINTETIS[k];
                const aktif = this.state.presetAktif === k;
                return `
                  <button type="button" class="dock-btn ${aktif ? "is-active" : ""}" data-pick-preset="${k}">
                    <span>${escHtml(p.label)}</span>
                    <small>${escHtml(p.ringkas)}</small>
                  </button>
                `;
              })
              .join("")}
          </div>
        </div>

        <div class="dock-section">
          <span class="dock-section__label">2. Tema Cahaya &amp; Peran Pengguna</span>
          <div class="dock-grid-2">
            ${(
              [
                { id: "fajar", nama: "Fajar", sub: "Pagi Hangat" },
                { id: "dekap", nama: "Dekap", sub: "Malam 02.00" },
                { id: "terik", nama: "Terik", sub: "Kontras AAA" },
                { id: "lensa", nama: "Lensa", sub: "Mode Ahli" },
              ] as const
            )
              .map(
                (t) => `
                <button type="button" class="dock-btn ${this.state.tema === t.id ? "is-active" : ""}" data-pick-theme="${t.id}">
                  <span>Tema ${t.nama}</span>
                  <small>${t.sub}</small>
                </button>
              `,
              )
              .join("")}
          </div>
          <div class="dock-grid-3" style="margin-top:4px;">
            ${(
              [
                { id: "ibu", label: "Ibu" },
                { id: "kader", label: "Kader" },
                { id: "ahli", label: "Ahli" },
              ] as const
            )
              .map(
                (pr) => `
                <button type="button" class="dock-btn ${this.state.peran === pr.id ? "is-active" : ""}" data-pick-role="${pr.id}">
                  <span>Peran ${pr.label}</span>
                </button>
              `,
              )
              .join("")}
          </div>
        </div>

        <div class="dock-section">
          <span class="dock-section__label">3. Fisika Optik &amp; Gerak</span>
          <div class="dock-grid-2">
            <button type="button" class="dock-btn ${!Motion.isHemat() ? "is-active" : ""}" data-pick-motion="penuh">
              <span>Fisika Penuh</span>
              <small>60fps + Meniskus</small>
            </button>
            <button type="button" class="dock-btn ${Motion.isHemat() ? "is-active" : ""}" data-pick-motion="hemat">
              <span>Hemat Gerak</span>
              <small>Tanpa Animasi</small>
            </button>
          </div>
        </div>

        <div class="dock-section">
          <span class="dock-section__label">4. Loncat Cepat (18 Layar Aplikasi)</span>
          <div class="dock-grid-2">
            ${DAFTAR_LAYAR.map(
              (l) => `
                <button type="button" class="dock-btn ${this.state.layar === l.id ? "is-active" : ""}" data-go="${l.id}">
                  <span>${l.kode} · ${escHtml(l.label)}</span>
                </button>
              `,
            ).join("")}
          </div>
        </div>
      </aside>
    `;
  }

  private bangunLembarKontrolMobile(): string {
    return `
      <div class="layar" style="gap:10px;">
        <div>
          <div class="layar__kicker">Pusat Kendali Aplikasi &amp; Pengujian</div>
          <div style="font-family:var(--f-display);font-size:1.35rem;color:var(--t-1);">Pilih Kasus, Tema &amp; <em>Layar</em></div>
        </div>

        <div class="kartu">
          <span class="kartu__label">Pilih Kasus Uji Sintetis</span>
          <div class="pilihan-grid">
            ${(["A", "B", "C"] as KodePreset[])
              .map((k) => {
                const p = PRESET_SINTETIS[k];
                const aktif = this.state.presetAktif === k;
                return `
                  <button type="button" class="pilihan-item ${aktif ? "is-selected" : ""}" data-pick-preset="${k}">
                    <div>
                      <div class="pilihan-item__nama">${escHtml(p.label)}</div>
                      <div class="pilihan-item__sub">${escHtml(p.ringkas)}</div>
                    </div>
                    <span class="pilihan-item__indikator"></span>
                  </button>
                `;
              })
              .join("")}
          </div>
        </div>

        <div class="kartu">
          <span class="kartu__label">Tema Cahaya &amp; Mode Gerak</span>
          <div class="baris-aksi">
            ${(["fajar", "dekap", "terik", "lensa"] as const)
              .map(
                (t) => `
                <button type="button" class="chip ${this.state.tema === t ? "is-active" : ""}" data-pick-theme="${t}">
                  Tema ${t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              `,
              )
              .join("")}
          </div>
          <div class="baris-aksi" style="margin-top:4px;">
            <button type="button" class="chip ${!Motion.isHemat() ? "is-active" : ""}" data-pick-motion="penuh">Fisika Penuh 60fps</button>
            <button type="button" class="chip ${Motion.isHemat() ? "is-active" : ""}" data-pick-motion="hemat">Hemat Gerak</button>
          </div>
        </div>

        <div class="kartu">
          <span class="kartu__label">Semua 18 Layar &amp; Keadaan Khusus</span>
          <div class="dock-grid-2">
            ${DAFTAR_LAYAR.map(
              (l) => `
                <button type="button" class="dock-btn ${this.state.layar === l.id ? "is-active" : ""}" data-go="${l.id}">
                  <span>${l.kode} · ${escHtml(l.label)}</span>
                </button>
              `,
            ).join("")}
          </div>
        </div>
      </div>
    `;
  }

  private bangunIsiLayar(r: Ringkasan): string {
    switch (this.state.layar) {
      case "gerbang":
        return this.layarGerbang();
      case "profil":
        return this.layarProfil(r);
      case "status":
        return this.layarStatus(r);
      case "piring":
        return this.layarPiring(r);
      case "kolam":
        return this.layarKolam(r);
      case "kenapa":
        return this.layarKenapa(r);
      case "ahli":
        return this.layarAhli(r);
      case "bahaya":
        return this.layarBahaya(r);
      case "tentang":
        return this.layarTentang();
      case "kartuBagi":
        return this.layarKartuBagi(r);
      case "kosong":
        return this.layarKondisiKosong();
      case "memuat":
        return this.layarKondisiMemuat();
      case "luring":
        return this.layarKondisiLuring();
      case "kedaluwarsa":
        return this.layarKondisiKedaluwarsa();
      case "galat":
        return this.layarKondisiGalat();
      case "tidakLayak":
        return this.layarKondisiTidakLayak(r);
      case "dataTidakAda":
        return this.layarKondisiDataTidakAda();
      case "hapus":
        return this.layarKondisiHapus();
      default:
        return this.layarGerbang();
    }
  }

  /* ---------- A1: Gerbang Konteks, Pemilihan Kasus Sintetis & Privasi Jujur ---------- */
  private layarGerbang(): string {
    const peranList: readonly { id: PeranRona; nama: string; sub: string }[] = [
      {
        id: "ibu",
        nama: "Ibu / Pengasuh Pendamping",
        sub: "Bahasa hangat, langkah memasak praktis & takaran sendok rumah tangga",
      },
      {
        id: "kader",
        nama: "Kader Posyandu / Pendamping Lapangan",
        sub: "Ringkas, kontras tinggi (Tema Terik AAA) untuk meja posyandu & skrining rujukan",
      },
      {
        id: "ahli",
        nama: "Dosen Penguji / Mode Audit Ilmiah",
        sub: "Buka tabel ambang SD 7-kolom, jejak ID klaim & silsilah sumber regulasi",
      },
    ];

    const presetAktif = PRESET_SINTETIS[this.state.presetAktif];

    return `
      <div class="layar">
        <div>
          <div class="layar__kicker">A1 · Gerbang Konteks · 1.000 Hari Pertama Kehidupan</div>
          <h2 class="layar__judul">Tenang meracik <em>MPASI</em> dengan kompas ilmiah yang jujur.</h2>
          <p class="layar__sub">Dirancang untuk mendampingi Ibu dan Kader memahami tumbuh kembang anak 6–23 bulan berbasis tabel resmi Permenkes RI No. 2/2020 &amp; AKG Permenkes RI No. 28/2019.</p>
        </div>

        <div class="kartu kartu--sorot">
          <div class="kartu__baris">
            <span class="kartu__label">1. Pilih Kasus Uji Sintetis (V-PJBL)</span>
            ${lencanaVerif("sah")}
          </div>
          <p class="kartu__isi">Profil rilis demonstrasi ini hanya memproses <strong>kasus sintetis tanpa nama anak pribadi</strong> demi perlindungan data kesehatan anak:</p>
          <div class="pilihan-grid" style="margin-top:4px;">
            ${(["A", "B", "C"] as KodePreset[])
              .map((k) => {
                const p = PRESET_SINTETIS[k];
                const aktif = this.state.presetAktif === k;
                return `
                  <button type="button" class="pilihan-item ${aktif ? "is-selected" : ""}" data-pick-preset="${k}">
                    <div>
                      <div class="pilihan-item__nama">${escHtml(p.label)}</div>
                      <div class="pilihan-item__sub">${escHtml(p.ringkas)}</div>
                    </div>
                    <span class="pilihan-item__indikator"></span>
                  </button>
                `;
              })
              .join("")}
          </div>
        </div>

        <div class="kartu">
          <div class="kartu__baris">
            <span class="kartu__label">2. Pilih Peran Pendampingan</span>
            <span class="lencana lencana--cukup">Tema: ${this.state.tema.toUpperCase()}</span>
          </div>
          <div class="pilihan-grid">
            ${peranList
              .map((p) => {
                const aktif = this.state.peran === p.id;
                return `
                  <button type="button" class="pilihan-item ${aktif ? "is-selected" : ""}" data-pick-role="${p.id}">
                    <div>
                      <div class="pilihan-item__nama">${escHtml(p.nama)}</div>
                      <div class="pilihan-item__sub">${escHtml(p.sub)}</div>
                    </div>
                    <span class="pilihan-item__indikator"></span>
                  </button>
                `;
              })
              .join("")}
          </div>
        </div>

        <div class="kartu">
          <div class="kartu__baris">
            <span class="kartu__label">3. Kejujuran Klinis &amp; Privasi</span>
            <button type="button" class="chip" data-go="tentang">
              ${ikon("nav-tentang")}
              <span>Rincian Privasi</span>
            </button>
          </div>
          <ul class="daftar-langkah">
            <li><strong>Gerbang keselamatan otomatis:</strong> Jika ada tanda bahaya klinis atau status gizi buruk/sangat kurang, penyusunan menu dihentikan dan aplikasi memandu rujukan ke Puskesmas.</li>
            <li><strong>Pita ambang SD resmi:</strong> Klasifikasi menggunakan tabel 7-kolom SD Permenkes 2/2020 (bukan taksiran rumus Z-score kontinu).</li>
            <li><strong>Memori sesi saja (ADR-0003):</strong> Tidak ada data anak yang disimpan ke penyimpanan permanen peramban atau basis data server.</li>
          </ul>
          <p class="kartu__isi" style="margin-top:6px;font-size:0.76rem;">${escHtml(PERNYATAAN_PRIVASI_AI)}</p>
        </div>

        <div class="baris-aksi">
          <button type="button" class="btn btn--utama btn--penuh" data-go="profil">
            <span>Lanjut Periksa Profil (${escHtml(presetAktif.kode)}) →</span>
          </button>
        </div>
      </div>
    `;
  }

  /* ---------- A2: Profil Anak, Antropometri, Alergi & Penapisan Tanda Bahaya ---------- */
  private layarProfil(r: Ringkasan): string {
    const m = this.state.masukan;
    const daftarBahaya = daftarTandaBahaya();
    const adaBahaya = m.tanda_bahaya.length > 0;

    return `
      <div class="layar">
        <div>
          <div class="layar__kicker">A2 · Profil &amp; Penapisan Keselamatan</div>
          <h2 class="layar__judul">Data tumbuh kembang <em>${escHtml(PRESET_SINTETIS[this.state.presetAktif].kode)}</em></h2>
          <p class="layar__sub">Usia dihitung dalam bulan penuh (6–23 bulan). Koreksi posisi ukur berdiri (+0,7 cm) dan pembulatan panjang ke 0,5 cm terdekat diterapkan otomatis sesuai Permenkes 2/2020.</p>
        </div>

        <div class="kartu kartu--sorot">
          <div class="kartu__baris">
            <span class="kartu__label">Preset Sintetis Aktif</span>
            <span class="lencana lencana--cukup">Kasus ${this.state.presetAktif}</span>
          </div>
          <p class="kartu__isi">${escHtml(PRESET_SINTETIS[this.state.presetAktif].catatan)}</p>
          <div class="baris-aksi" style="margin-top:4px;">
            ${(["A", "B", "C"] as KodePreset[])
              .map(
                (k) => `
                <button type="button" class="chip ${this.state.presetAktif === k ? "is-active" : ""}" data-pick-preset="${k}">
                  Kasus ${k}
                </button>
              `,
              )
              .join("")}
          </div>
        </div>

        <div class="kartu">
          <div class="kartu__baris">
            <span class="kartu__label">Antropometri &amp; Cara Ukur</span>
            ${lencanaVerif("perlu")}
          </div>
          <div class="form-grid form-grid--2">
            <div class="field">
              <label class="field__label" for="inp-usia-bulan">
                <span>Usia (Bulan Penuh)</span>
                <span class="field__unit">${m.status.umur.bulan} bln</span>
              </label>
              <input id="inp-usia-bulan" class="field__input" type="number" min="0" max="36" step="1" value="${m.status.umur.bulan}" data-field="bulan" />
            </div>
            <div class="field">
              <label class="field__label" for="inp-usia-hari">
                <span>Sisa Hari</span>
                <span class="field__unit">${m.status.umur.hari} hr</span>
              </label>
              <input id="inp-usia-hari" class="field__input" type="number" min="0" max="30" step="1" value="${m.status.umur.hari}" data-field="hari_umur" />
            </div>
            <div class="field">
              <label class="field__label" for="inp-jk">Jenis Kelamin</label>
              <select id="inp-jk" class="field__select" data-field="jk">
                <option value="P" ${m.status.jk === "P" ? "selected" : ""}>Perempuan (P)</option>
                <option value="L" ${m.status.jk === "L" ? "selected" : ""}>Laki-laki (L)</option>
              </select>
            </div>
            <div class="field">
              <label class="field__label" for="inp-cara-ukur">Posisi Ukur</label>
              <select id="inp-cara-ukur" class="field__select" data-field="cara_ukur">
                <option value="terlentang" ${m.status.cara_ukur === "terlentang" ? "selected" : ""}>Terlentang (PB)</option>
                <option value="berdiri" ${m.status.cara_ukur === "berdiri" ? "selected" : ""}>Berdiri (TB +0,7 cm)</option>
              </select>
            </div>
            <div class="field">
              <label class="field__label" for="inp-bb">
                <span>Berat Badan</span>
                <span class="field__unit">${fmtId(m.status.bb_kg, 1)} kg</span>
              </label>
              <input id="inp-bb" class="field__input" type="number" min="2" max="25" step="0.1" value="${m.status.bb_kg}" data-field="bb_kg" />
            </div>
            <div class="field">
              <label class="field__label" for="inp-pb">
                <span>Panjang / Tinggi</span>
                <span class="field__unit">${fmtId(m.status.pb_cm, 1)} cm</span>
              </label>
              <input id="inp-pb" class="field__input" type="number" min="40" max="115" step="0.5" value="${m.status.pb_cm}" data-field="pb_cm" />
            </div>
          </div>

          <div style="margin-top:8px;">
            <span class="kartu__label" style="display:block;margin-bottom:6px;">Konteks ASI &amp; Siklus Menu</span>
            <div class="baris-aksi">
              <button type="button" class="chip ${m.pola.masih_asi ? "is-active" : ""}" data-toggle-asi="true">
                ${ikon("info-asi")}
                <span>Masih Menyusu ASI: ${m.pola.masih_asi ? "Ya ✓" : "Tidak"}</span>
              </button>
              <button type="button" class="chip ${m.pola.izinkan_hati ? "is-active" : ""}" data-toggle-hati="true">
                <span>Sertakan Hati Ayam (≤1x/pekan): ${m.pola.izinkan_hati ? "Ya ✓" : "Tidak"}</span>
              </button>
            </div>
          </div>

          <div style="margin-top:8px;">
            <span class="kartu__label" style="display:block;margin-bottom:6px;">Pantangan / Alergi Bahan Pangan</span>
            <div class="baris-aksi">
              ${DAFTAR_ALERGEN_UI.map((al) => {
                const aktif = m.pola.hindari.includes(al.kode);
                return `
                  <button type="button" class="chip ${aktif ? "is-active" : ""}" data-toggle-hindari="${al.kode}">
                    <span>Pantang ${escHtml(al.label)}${aktif ? " ✓" : ""}</span>
                  </button>
                `;
              }).join("")}
            </div>
          </div>
        </div>

        <div class="kartu ${adaBahaya ? "kartu--bahaya" : ""}">
          <div class="kartu__baris">
            <span class="kartu__label">Skrining 7 Tanda Bahaya Klinis</span>
            ${lencanaStatus(
              adaBahaya ? "bahaya" : "cukup",
              adaBahaya ? `${m.tanda_bahaya.length} Tanda Bahaya Aktif` : "Tidak Ada Tanda Bahaya",
            )}
          </div>
          <p class="kartu__isi">Jika satu saja tanda bahaya di bawah ini ditemukan, kalkulator wajib menghentikan saran menu mandiri dan mengarahkan ke rujukan tenaga kesehatan:</p>
          <div class="pilihan-grid" style="margin-top:6px;">
            ${daftarBahaya
              .map((b) => {
                const aktif = m.tanda_bahaya.includes(b.kode);
                return `
                  <button type="button" class="pilihan-item ${aktif ? "is-danger" : ""}" data-toggle-bahaya="${b.kode}">
                    <div>
                      <div class="pilihan-item__nama">${escHtml(b.label)}</div>
                      <div class="pilihan-item__sub">Kode aturan: ${escHtml(b.kode)}</div>
                    </div>
                    <span class="pilihan-item__indikator"></span>
                  </button>
                `;
              })
              .join("")}
          </div>
        </div>

        <div class="baris-aksi">
          <button type="button" class="btn ${r.hasil === "ok" && r.rujukan.tingkat === "rujuk" ? "btn--bahaya" : "btn--utama"} btn--penuh" data-go="${r.hasil === "ok" && r.rujukan.tingkat === "rujuk" ? "bahaya" : "status"}">
            <span>${r.hasil === "ok" && r.rujukan.tingkat === "rujuk" ? "Tanda Bahaya Aktif — Buka Panduan Rujukan →" : "Lihat Peta Status Pertumbuhan (A3) →"}</span>
          </button>
        </div>
      </div>
    `;
  }

  /* ---------- A3: Peta Status Pertumbuhan Antropometri (Permenkes 2/2020) ---------- */
  private layarStatus(r: Ringkasan): string {
    const m = this.state.masukan;

    if (r.hasil === "stop") {
      const pesanStop: Record<string, { judul: string; isi: string }> = {
        usia_di_bawah_6_bulan: {
          judul: "Usia < 6 Bulan: Periode ASI Eksklusif",
          isi: "Untuk bayi di bawah 6 bulan penuh, pedoman Kemenkes RI dan WHO menganjurkan pemberian ASI Eksklusif tanpa makanan/minuman tambahan kecuali atas indikasi medis dokter.",
        },
        usia_24_bulan_atau_lebih_di_luar_cakupan: {
          judul: "Usia ≥ 24 Bulan: Di Luar Cakupan MPASI Baduta",
          isi: "Mesin perencanaan MPASI NUTRIVA v1 dikhususkan untuk anak usia 6–23 bulan (baduta). Anak usia 24 bulan ke atas mengikuti pedoman gizi seimbang keluarga.",
        },
        berat_tidak_valid: {
          judul: "Berat Badan Tidak Valid",
          isi: "Mohon periksa kembali angka berat badan (harus bernilai positif dalam satuan kilogram).",
        },
        panjang_di_luar_tabel: {
          judul: "Panjang Badan di Luar Rentang Tabel (45,0–110,0 cm)",
          isi: "Nilai panjang badan berada di luar cakupan tabel standar BB/PB Permenkes 2/2020. Pastikan satuan ukur adalah sentimeter (cm).",
        },
      };
      const info = pesanStop[r.alasan] ?? {
        judul: "Perhitungan Dihentikan oleh Gerbang Validasi",
        isi: `Alasan mesin: ${r.alasan}`,
      };

      return `
        <div class="layar">
          <div>
            <div class="layar__kicker">A3 · Gerbang Validasi Antropometri</div>
            <h2 class="layar__judul">${escHtml(info.judul)}</h2>
            <p class="layar__sub">Kode penghentian deterministik: <code>${escHtml(r.alasan)}</code></p>
          </div>
          <div class="kartu kartu--sorot">
            <div class="kartu__baris">
              ${lencanaStatus("perhatian", r.alasan)}
              ${lencanaVerif("sah")}
            </div>
            <p class="kartu__isi">${escHtml(info.isi)}</p>
            <div class="baris-aksi" style="margin-top:8px;">
              <button type="button" class="btn btn--utama" data-pick-preset="A">Kembalikan ke Kasus Sintetis A (9 bln)</button>
              <button type="button" class="btn btn--sekunder" data-go="profil">Ubah Profil Masukan</button>
            </div>
          </div>
        </div>
      `;
    }

    const st = r.status;
    const dikoreksiBerdiri = m.status.cara_ukur === "berdiri";

    const bbuRow = DATA.bbu[m.status.jk].baris.find(
      (b) => b.bulan === st.usia_bulan_penuh,
    );
    const pbuRow = DATA.pbu[m.status.jk].baris.find(
      (b) => b.bulan === st.usia_bulan_penuh,
    );
    const bbpbRow = DATA.bbpb[m.status.jk].baris.find(
      (b) => b.panjang_cm === st.panjang_tabel_cm,
    );

    const daftarIndeks = [
      {
        kode: "BB/U",
        nama: "Berat Badan menurut Umur",
        kategoriTeks: LABEL_BBU[st.bbu.kategori],
        posisi: st.bbu.posisi,
        tingkat: tingkatVisualBBU(st.bbu.kategori),
        klaimId: st.bbu.klaim_id,
        sdRow: bbuRow?.sd ?? null,
        acuanBaris: `Usia ${st.usia_bulan_penuh} bln (${m.status.jk}) · Nilai ukur: ${fmtId(m.status.bb_kg, 1)} kg`,
        arti:
          st.bbu.kategori === "bb_normal"
            ? "Berat badan anak berada dalam pita pertumbuhan normal untuk usianya."
            : st.bbu.kategori === "bb_sangat_kurang"
              ? "Berat badan berada di bawah garis -3 SD. Wajib dirujuk ke Puskesmas/tenaga kesehatan."
              : "Perlu pemantauan kenaikan berat badan secara berkala di Posyandu/Puskesmas.",
      },
      {
        kode: "PB/U",
        nama: "Panjang Badan menurut Umur",
        kategoriTeks: LABEL_PBU[st.pbu.kategori],
        posisi: st.pbu.posisi,
        tingkat: tingkatVisualPBU(st.pbu.kategori),
        klaimId: st.pbu.klaim_id,
        sdRow: pbuRow?.sd ?? null,
        acuanBaris: `Usia ${st.usia_bulan_penuh} bln (${m.status.jk}) · Panjang pakai: ${fmtId(st.panjang_dipakai_cm, 1)} cm`,
        arti:
          st.pbu.kategori === "normal" || st.pbu.kategori === "tinggi"
            ? "Pertumbuhan panjang linier berada pada jalur normal sesuai umur."
            : st.pbu.kategori === "sangat_pendek"
              ? "Panjang badan berada di bawah -3 SD. Memerlukan evaluasi tenaga kesehatan."
              : "Pertumbuhan linier perlu perhatian dan kecukupan protein hewani harian.",
      },
      {
        kode: "BB/PB",
        nama: "Berat Badan menurut Panjang Badan",
        kategoriTeks: LABEL_BBPB[st.bbpb.kategori],
        posisi: st.bbpb.posisi,
        tingkat: tingkatVisualBBPB(st.bbpb.kategori),
        klaimId: st.bbpb.klaim_id,
        sdRow: bbpbRow?.sd ?? null,
        acuanBaris: `Panjang tabel ${fmtId(st.panjang_tabel_cm, 1)} cm (${m.status.jk}) · Berat: ${fmtId(m.status.bb_kg, 1)} kg`,
        arti:
          st.bbpb.kategori === "gizi_baik"
            ? "Proporsi berat terhadap panjang badan seimbang (gizi baik)."
            : st.bbpb.kategori === "gizi_buruk"
              ? "Proporsi berat terhadap panjang masuk kategori gizi buruk. Segera rujuk ke fasilitas kesehatan."
              : "Proporsi berat terhadap panjang memerlukan perhatian pola asupan dan pemantauan nakes.",
      },
    ];

    const penjelasan = this.ambilPenjelasanStatus(r.muatan_ai_status);

    return `
      <div class="layar">
        <div>
          <div class="layar__kicker">A3 · Status Pertumbuhan · Permenkes RI No. 2/2020</div>
          <h2 class="layar__judul">Peta tumbuh <em>${escHtml(PRESET_SINTETIS[this.state.presetAktif].kode)}</em> (${st.usia_bulan_penuh} bln)</h2>
          <p class="layar__sub">
            Berat <strong>${fmtId(m.status.bb_kg, 1)} kg</strong> · Panjang pakai <strong>${fmtId(st.panjang_dipakai_cm, 1)} cm</strong> (tabel BB/PB: ${fmtId(st.panjang_tabel_cm, 1)} cm).
          </p>
        </div>

        ${
          dikoreksiBerdiri
            ? `
          <div class="kartu kartu--sorot">
            <div class="kartu__baris">
              ${lencanaStatus("perhatian", "Koreksi Cara Ukur Berdiri (+0,7 cm) Diterapkan")}
              ${lencanaVerif("sah")}
            </div>
            <p class="kartu__isi">Sesuai Permenkes 2/2020, anak usia di bawah 24 bulan yang diukur berdiri ditambah <strong>+0,7 cm</strong> untuk disetarakan menjadi Panjang Badan terlentang (${fmtId(m.status.pb_cm, 1)} cm → ${fmtId(st.panjang_dipakai_cm, 1)} cm).</p>
          </div>
        `
            : ""
        }

        ${
          r.rujukan.tingkat === "rujuk"
            ? `
          <div class="kartu kartu--bahaya">
            <div class="kartu__baris">
              ${lencanaStatus("bahaya", "INDIKASI RUJUKAN WAJIB KE NAKES")}
              <span style="font-family:var(--f-mono);font-size:10px;">KESELAMATAN UTAMA</span>
            </div>
            <div class="kartu__judul">Rekomendasi menu mandiri &amp; penjelas AI dinonaktifkan</div>
            <p class="kartu__isi">Ditemukan alasan rujukan: <strong>${escHtml(r.rujukan.alasan.join(", "))}</strong>. Silakan buka panduan rujukan darurat.</p>
            <div class="baris-aksi" style="margin-top:4px;">
              <button type="button" class="btn btn--bahaya btn--penuh" data-go="bahaya">Buka Panduan Rujukan Darurat (A8) →</button>
            </div>
          </div>
        `
            : ""
        }

        <div class="baris-aksi">
          <button type="button" class="chip ${this.state.modeAhli ? "is-active" : ""}" data-toggle-ahli="true">
            ${ikon("nav-ahli")}
            <span>${this.state.modeAhli ? "Sembunyikan Tabel Ambang SD" : "Tampilkan Tabel Ambang SD (Mode Ahli)"}</span>
          </button>
          <button type="button" class="chip" data-go="kenapa">
            ${ikon("nav-kenapa")}
            <span>Kenapa hasil ini?</span>
          </button>
        </div>

        ${daftarIndeks
          .map((ix) => {
            const pctPin = posisiKePersenPin(ix.posisi);
            const labelPita = labelPosisiPita(ix.posisi);
            return `
              <div class="kartu">
                <div class="kartu__baris">
                  <div>
                    <span class="kartu__label">${ix.kode} · ${escHtml(ix.nama)}</span>
                    <div class="kartu__judul" style="margin-top:2px;text-transform:capitalize;">${escHtml(ix.kategoriTeks)}</div>
                  </div>
                  ${lencanaStatus(ix.tingkat, labelPita)}
                </div>

                <div class="z-meter" aria-label="Posisi pada pita standar deviasi -3 SD hingga +3 SD">
                  <div class="z-meter__track"></div>
                  <div class="z-meter__pin" style="left:${pctPin.toFixed(1)}%" title="${escHtml(labelPita)}"></div>
                </div>
                <div class="z-meter__skala">
                  <span>-3 SD</span><span>-2 SD</span><span>Median (0)</span><span>+2 SD</span><span>+3 SD</span>
                </div>

                <p class="kartu__isi" style="margin-top:4px;">${escHtml(ix.arti)}</p>
                <div class="kartu__baris" style="margin-top:2px;">
                  <span style="font-family:var(--f-mono);font-size:10px;color:var(--t-3);">Klaim: ${escHtml(ix.klaimId)}</span>
                  ${lencanaVerif("perlu")}
                </div>

                ${
                  this.state.modeAhli && ix.sdRow
                    ? `
                  <div class="panel-ahli">
                    <div class="panel-ahli__baris">
                      <span>${escHtml(ix.acuanBaris)}</span>
                      <span>Pita: ${escHtml(ix.posisi ?? "—")}</span>
                    </div>
                    <table class="tabel-sd-mini" aria-label="Tabel 7 Kolom SD Permenkes 2/2020">
                      <thead>
                        <tr>
                          <th>-3 SD</th><th>-2 SD</th><th>-1 SD</th><th>Median</th><th>+1 SD</th><th>+2 SD</th><th>+3 SD</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>${fmtId(ix.sdRow[0], 1)}</td>
                          <td>${fmtId(ix.sdRow[1], 1)}</td>
                          <td>${fmtId(ix.sdRow[2], 1)}</td>
                          <td class="is-median">${fmtId(ix.sdRow[3], 1)}</td>
                          <td>${fmtId(ix.sdRow[4], 1)}</td>
                          <td>${fmtId(ix.sdRow[5], 1)}</td>
                          <td>${fmtId(ix.sdRow[6], 1)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                `
                    : ""
                }
              </div>
            `;
          })
          .join("")}

        ${
          penjelasan && r.rujukan.tingkat !== "rujuk"
            ? this.bangunKartuAi(penjelasan, "status")
            : ""
        }

        <div class="baris-aksi">
          <button type="button" class="btn btn--utama btn--penuh" data-go="${r.rujukan.tingkat === "rujuk" ? "bahaya" : "piring"}">
            <span>${r.rujukan.tingkat === "rujuk" ? "Lihat Panduan Rujukan Tenaga Kesehatan →" : "Susun Contoh Pola Makan & Belanja (A4) →"}</span>
          </button>
        </div>
      </div>
    `;
  }

  /* ---------- A4: Contoh Pola Makan Harian, Inspeksi Bahan & Daftar Belanja ---------- */
  private layarPiring(r: Ringkasan): string {
    if (r.hasil === "stop" || r.rujukan.tingkat === "rujuk" || !r.pola) {
      return `
        <div class="layar">
          <div>
            <div class="layar__kicker">A4 · Gerbang Keselamatan Menu</div>
            <h2 class="layar__judul"><em>Rekomendasi Menu Dihentikan Sementara</em></h2>
            <p class="layar__sub">Sesuai aturan keselamatan klinis NUTRIVA (K-04 &amp; K-08), ketika ditemukan tanda bahaya atau indikasi rujukan wajib, aplikasi tidak menampilkan saran menu mandiri maupun penjelasan AI.</p>
          </div>
          <div class="kartu kartu--bahaya">
            <div class="kartu__baris">
              ${lencanaStatus("bahaya", "Menu Mandiri Dinonaktifkan")}
              ${lencanaVerif("sah")}
            </div>
            <div class="kartu__judul">Prioritaskan pemeriksaan langsung oleh tenaga kesehatan</div>
            <p class="kartu__isi">Anak dengan tanda bahaya atau status gizi buruk memerlukan tata laksana medis terukur di Puskesmas/Rumah Sakit, bukan kalkulator menu rumah tangga.</p>
            <div class="baris-aksi" style="margin-top:8px;">
              <button type="button" class="btn btn--bahaya" data-go="bahaya">Buka Layar Rujukan Darurat (A8) →</button>
              <button type="button" class="btn btn--sekunder" data-pick-preset="A">Simulasikan Kasus Normal (Kasus A)</button>
            </div>
          </div>
        </div>
      `;
    }

    const pola = r.pola;
    const hariIdx = Math.min(this.state.hariMenuIdx, pola.hari.length - 1);
    const hariAktif = pola.hari[hariIdx]!;
    const infoBenih =
      DAFTAR_BENIH_VARIASI.find((b) => b.benih === pola.benih) ??
      DAFTAR_BENIH_VARIASI[0]!;
    const penjelasanMenu = this.ambilPenjelasanMenu(
      hariIdx,
      r.muatan_ai_menu[hariIdx],
    );

    return `
      <div class="layar">
        <div>
          <div class="layar__kicker">A4 · Contoh Pola Makan dari Aturan · Pita ${escHtml(LABEL_PITA[pola.pita])}</div>
          <h2 class="layar__judul">Racikan dapur <em>Hari ke-${hariAktif.hari_ke}</em></h2>
          <p class="layar__sub">Ketuk tombol <strong>Rincian / Ganti</strong> pada bahan makanan untuk melihat kandungan gizinya di Lembar Bawah atau menyaring bahan yang tidak tersedia di rumah.</p>
        </div>

        <div class="kartu kartu--sorot">
          <div class="kartu__baris">
            <div>
              <span class="kartu__label">Benih Deterministik · ${escHtml(infoBenih.kode)} (${escHtml(pola.benih)})</span>
              <div class="kartu__judul">${escHtml(infoBenih.judul)}</div>
            </div>
            <button type="button" class="btn btn--sekunder" data-cycle-benih="true" style="min-height:36px;padding:6px 12px;font-size:11.5px;">
              ${ikon("aksi-tukar")}
              <span>Varian Lain</span>
            </button>
          </div>
          <p class="kartu__isi">${escHtml(infoBenih.catatan)}</p>
          <div class="baris-aksi" style="margin-top:4px;">
            ${lencanaStatus(
              hariAktif.mdd_tercapai ? "cukup" : "perhatian",
              `Keragaman MDD: ${hariAktif.jumlah_kelompok_mdd}/8 kelompok (Target ≥5)`,
            )}
            ${lencanaStatus(
              "cukup",
              `Energi MPASI: ${Math.round(hariAktif.energi_kkal)} / ${hariAktif.energi_target_kkal} kkal (${hariAktif.energi_persen_target}%)`,
            )}
            ${lencanaVerif("perlu")}
          </div>
        </div>

        <div class="baris-aksi" role="tablist" aria-label="Pilih Hari Menu">
          ${pola.hari
            .map(
              (h, idx) => `
              <button
                type="button"
                role="tab"
                aria-selected="${idx === hariIdx ? "true" : "false"}"
                class="chip ${idx === hariIdx ? "is-active" : ""}"
                data-pick-hari="${idx}"
              >
                <span>HARI ${h.hari_ke}</span>
              </button>
            `,
            )
            .join("")}
        </div>

        ${hariAktif.slot
          .map((sl) => {
            const meta = namaSlotWaktu(sl.kode);
            return `
              <div class="sajian">
                <div class="sajian__kepala">
                  <div>
                    <div class="sajian__waktu">${escHtml(meta.judul)}</div>
                    <div class="sajian__meta">${escHtml(meta.sub)}</div>
                  </div>
                  <span class="lencana lencana--cukup">${sl.item.length} bahan</span>
                </div>
                <div class="sajian__item-list">
                  ${sl.item
                    .map((it) => {
                      const atr = PETA_ATRIBUT.get(it.bahan_id);
                      const gz = PETA_GIZI_BAHAN.get(it.bahan_id);
                      const nama = atr?.nama ?? it.bahan_id;
                      const peranLabel =
                        LABEL_PERAN_BAHAN[it.peran] ?? it.peran;
                      const fe =
                        ((gz?.per_100g.besi_mg ?? 0) * it.gram) / 100;
                      const prot =
                        ((gz?.per_100g.protein_g ?? 0) * it.gram) / 100;
                      return `
                        <div class="bahan-pil">
                          <div class="bahan-pil__info">
                            <div class="bahan-pil__nama">${escHtml(nama)}</div>
                            <div class="bahan-pil__takaran">
                              ${escHtml(takaranRumahTangga(it.gram, it.peran))} · ${escHtml(peranLabel)} · Prot ${fmtId(prot, 1)} g · Fe ${fmtId(fe, 1)} mg
                            </div>
                          </div>
                          <button
                            type="button"
                            class="bahan-pil__aksi"
                            data-inspect-bahan="${it.bahan_id}"
                            data-inspect-gram="${it.gram}"
                          >
                            ${ikon("aksi-tukar")}
                            <span>Rincian / Ganti</span>
                          </button>
                        </div>
                      `;
                    })
                    .join("")}
                </div>
              </div>
            `;
          })
          .join("")}

        ${
          r.belanja
            ? `
          <div class="kartu">
            <div class="kartu__baris">
              <div>
                <span class="kartu__label">Perkiraan Kebutuhan Bahan Mentah (D-kelas-harga)</span>
                <div class="kartu__judul">Daftar Belanja ${pola.hari.length} Hari</div>
              </div>
              ${lencanaVerif("draf")}
            </div>
            <p class="kartu__isi">Gram beli memperhitungkan bagian tidak dimakan (kulit/tulang/penyusutan) melalui <code>rasio_beli</code> dan dibulatkan ke atas per 5 gram. Bukan klaim harga Rupiah pasar:</p>
            <div class="baris-aksi" style="margin-top:4px;">
              ${lencanaStatus("cukup", `Murah: ${r.belanja.jumlah_per_kelas.murah} bahan`)}
              ${lencanaStatus("perhatian", `Sedang: ${r.belanja.jumlah_per_kelas.sedang} bahan`)}
              ${lencanaStatus("celah", `Mahal: ${r.belanja.jumlah_per_kelas.mahal} bahan`)}
            </div>
            <div class="belanja-list">
              ${r.belanja.item
                .map((b) => {
                  const kh = LABEL_KELAS_HARGA[b.kelas_harga];
                  return `
                    <div class="bahan-pil">
                      <div class="bahan-pil__info">
                        <div class="bahan-pil__nama">${escHtml(b.nama)}</div>
                        <div class="bahan-pil__takaran">
                          Disajikan ${b.gram_disajikan} g → <strong>Beli ~${b.gram_beli} g</strong> (${escHtml(LABEL_PERAN_BAHAN[b.peran] ?? b.peran)})
                        </div>
                      </div>
                      ${lencanaStatus(kh.status, kh.teks)}
                    </div>
                  `;
                })
                .join("")}
            </div>
          </div>
        `
            : ""
        }

        ${penjelasanMenu ? this.bangunKartuAi(penjelasanMenu, "menu", hariIdx) : ""}

        <div class="baris-aksi">
          <button type="button" class="btn btn--utama btn--penuh" data-go="kolam">
            <span>Periksa Bejana Nektar &amp; Celah AKG (A5) →</span>
          </button>
        </div>
      </div>
    `;
  }

  /* ---------- A5: Bejana Nektar Dual-Strata ASI+MPASI & Kejujuran Ketidakpastian ---------- */
  private layarKolam(r: Ringkasan): string {
    if (r.hasil === "stop" || r.rujukan.tingkat === "rujuk" || !r.pola) {
      return this.layarPiring(r);
    }

    const pola = r.pola;
    const hariIdx = Math.min(this.state.hariMenuIdx, pola.hari.length - 1);
    const hariAktif = pola.hari[hariIdx]!;
    const akgMap = new Map(hariAktif.akg.zat.map((z) => [z.zat, z] as const));
    const masihAsi = this.state.masukan.pola.masih_asi;

    // Estimasi proporsi visual strata ASI untuk membantu ibu melihat peran ASI + MPASI
    const estimasiAsiFrac = (zat: KunciZat, fillTotal: number): number => {
      if (!masihAsi) return 0;
      const rasioVisual: Partial<Record<KunciZat, number>> = {
        protein_g: 0.45,
        besi_mg: 0.03,
        seng_mg: 0.25,
        kalsium_mg: 0.55,
        vit_a_rae_mcg: 0.48,
        vit_c_mg: 0.4,
      };
      const rAsi = rasioVisual[zat] ?? 0.3;
      return Math.min(fillTotal * 0.85, rAsi);
    };

    return `
      <div class="layar">
        <div>
          <div class="layar__kicker">A5 · Bejana Nektar Dual-Strata · Permenkes 28/2019</div>
          <h2 class="layar__judul">Kecukupan &amp; <em>celah jujur</em> nutrisi</h2>
          <p class="layar__sub">Sentuh atau usap permukaan cairan untuk merasakan viskositasnya, atau ketuk kartu bejana untuk melihat kontribusi tiap bahan makanan di Lembar Bawah.</p>
        </div>

        <div class="baris-aksi">
          <button type="button" class="chip ${this.state.showStrata ? "is-active" : ""}" data-toggle-strata="true">
            ${ikon("info-asi")}
            <span>${this.state.showStrata ? "Strata Visual ASI + MPASI: Aktif" : "Tampilkan Strata ASI + MPASI"}</span>
          </button>
          <button type="button" class="chip" data-go="kenapa">
            ${ikon("nav-kenapa")}
            <span>Kenapa ada celah?</span>
          </button>
          <button type="button" class="chip" data-go="kartuBagi">
            ${ikon("aksi-bagikan")}
            <span>Kartu Bagikan</span>
          </button>
        </div>

        <div class="bejana-grid">
          ${ZAT_BEJANA_UTAMA.map((cfg) => {
            const itemAkg = akgMap.get(cfg.zat);
            if (!itemAkg) return "";
            const pct = itemAkg.persen;
            const fill = Math.max(0, Math.min(1.15, pct / 100));
            const lo = Math.max(0, fill * 0.9);
            const hi = Math.min(1.18, fill * 1.1);
            const asiFrac = estimasiAsiFrac(cfg.zat, fill);
            const statusVis: StatusVisualRona = !itemAkg.lengkap
              ? "kosong"
              : itemAkg.pita === "rendah"
                ? "celah"
                : itemAkg.pita === "sedang"
                  ? "perhatian"
                  : "cukup";
            const satuanTampil =
              cfg.zat === "vit_a_rae_mcg"
                ? "mcg RAE / RE"
                : cfg.zat.endsWith("_mcg")
                  ? "mcg"
                  : cfg.zat.endsWith("_mg")
                    ? "mg"
                    : "g";

            const teksAngka = `${fmtId(itemAkg.nilai, 1)} / ${fmtId(itemAkg.akg, 0)} ${satuanTampil} (${pct}% AKG)`;
            const teksRentang = itemAkg.satuan_beda
              ? "Catatan: USDA memakai RAE, AKG Permenkes memakai RE (tanpa konversi spekulatif)"
              : `Rentang variasi alami bahan: ~${Math.round(lo * 100)}%–${Math.round(hi * 100)}% AKG`;

            return `
              <div class="bejana" data-inspect-zat="${cfg.zat}" style="cursor:pointer;" title="Ketuk untuk rincian penyumbang ${escHtml(cfg.label)}">
                <div class="bejana__kepala">
                  <div>
                    <div class="bejana__nama">${escHtml(cfg.label)}</div>
                    <div class="bejana__angka">${escHtml(teksAngka)}</div>
                  </div>
                  ${lencanaStatus(
                    statusVis,
                    statusVis === "celah"
                      ? `Celah ${Math.max(0, 100 - pct)}%`
                      : `${pct}% AKG`,
                  )}
                </div>
                <canvas
                  class="bejana__kanvas"
                  data-bejana-canvas="${cfg.zat}"
                  data-fill="${fill.toFixed(3)}"
                  data-lo="${lo.toFixed(3)}"
                  data-hi="${hi.toFixed(3)}"
                  data-asi="${asiFrac.toFixed(3)}"
                  data-viskositas="${cfg.viskositas}"
                  data-meniskus="${cfg.meniskus}"
                  data-status="${statusVis}"
                ></canvas>
                <div class="bejana__kaki">
                  <span class="bejana__rentang">${escHtml(teksRentang)}</span>
                  ${lencanaVerif("perlu")}
                </div>
                <p class="kartu__isi" style="font-size:11.5px;margin-top:2px;">${escHtml(cfg.catatan)}</p>
              </div>
            `;
          }).join("")}
        </div>

        <div class="kartu">
          <div class="kartu__baris">
            <span class="kartu__label">Tabel Lengkap 23 Zat Gizi (Permenkes 28/2019)</span>
            <button type="button" class="chip" data-toggle-semua-zat="true">
              <span>${this.state.tampilkanSemuaZat ? "Ringkas Tabel" : "Buka Semua 23 Zat Gizi"}</span>
            </button>
          </div>
          ${
            this.state.tampilkanSemuaZat
              ? `
            <div class="sajian__item-list" style="margin-top:6px;">
              ${hariAktif.akg.zat
                .map((z) => {
                  const namaZat = NAMA_ZAT[z.zat] ?? z.zat;
                  const stLencana: TingkatLencanaRona =
                    z.pita === "rendah"
                      ? "celah"
                      : z.pita === "sedang"
                        ? "perhatian"
                        : "cukup";
                  return `
                    <div class="bahan-pil">
                      <div class="bahan-pil__info">
                        <div class="bahan-pil__nama" style="text-transform:capitalize;">${escHtml(namaZat)}</div>
                        <div class="bahan-pil__takaran">
                          Asupan MPASI: ${fmtId(z.nilai, 1)} dari target AKG ${fmtId(z.akg, 1)} ${z.satuan_beda ? "(satuan RAE vs RE)" : ""}
                        </div>
                      </div>
                      ${lencanaStatus(stLencana, `${z.persen}% AKG`)}
                    </div>
                  `;
                })
                .join("")}
            </div>
          `
              : `<p class="kartu__isi">Menampilkan 6 bejana nutrisi utama di atas. Ketuk tombol di kanan atas kartu ini untuk memeriksa seluruh 23 makro &amp; mikronutrien.</p>`
          }
        </div>

        <div class="kartu kartu--sorot">
          <div class="kartu__baris">
            <span class="kartu__label">Panduan Diskusi Posyandu &amp; Puskesmas</span>
            ${lencanaStatus("perhatian", "Tanpa Dosis Obat (T-10)")}
          </div>
          <p class="kartu__isi">Pada usia 6–11 bulan, target AKG zat besi (<strong>11 mg/hari</strong>) sulit dipenuhi dari porsi lambung bayi semata. Pertahankan lauk hewani setiap hari, dan diskusikan bersama bidan/dokter mengenai perlunya pangan fortifikasi atau tablet/tetes tambah darah sesuai anjuran bidan/dokter (aplikasi tidak meresepkan dosis suplemen).</p>
        </div>
      </div>
    `;
  }

  /* ---------- A6: Panel Penjelasan Berlapis "Kenapa?" ---------- */
  private layarKenapa(r: Ringkasan): string {
    const celahAktif =
      r.hasil === "ok" && r.pola
        ? r.pola.hari[0]?.peringatan ?? []
        : [];

    return `
      <div class="layar">
        <div>
          <div class="layar__kicker">A6 · Panel Penjelasan Berlapis (3 Tingkat)</div>
          <h2 class="layar__judul">Kenapa hasil ini <em>muncul?</em></h2>
          <p class="layar__sub">Setiap kesimpulan NUTRIVA dapat ditelusuri mulai dari bahasa sehari-hari untuk Ibu hingga batas fisiologis dan rujukan regulasi untuk Dosen Penguji.</p>
        </div>

        <div class="kartu kartu--sorot">
          <div class="kartu__baris">
            <span class="kartu__label">Lapis 1 · Bahasa Ibu &amp; Kader</span>
            ${lencanaStatus("perhatian", "Kapasitas Lambung vs Target AKG")}
          </div>
          <div class="kartu__judul">Mengapa zat besi pada MPASI alami sering tampak belum mencapai 100% AKG?</div>
          <p class="kartu__isi">Sejak usia 6 bulan, cadangan zat besi bawaan lahir bayi mulai menipis, sementara kapasitas lambung bayi masih kecil (sekitar 200–300 kkal dari MPASI pada usia 6–11 bulan). Itulah sebabnya setiap suapan perlu mengutamakan <strong>protein hewani padat besi</strong> (hati ayam, ikan, telur, daging) ditambah buah kaya Vitamin C.</p>
        </div>

        <div class="kartu">
          <div class="kartu__baris">
            <span class="kartu__label">Lapis 2 · Kendala Aturan &amp; Celah Terdeteksi</span>
            ${lencanaVerif("perlu")}
          </div>
          <ul class="daftar-langkah">
            <li><strong>Batas Porsi Fisiologis:</strong> Aturan mesin membatasi gram maksimum per waktu makan sesuai pita usia (<code>6-8</code>, <code>9-11</code>, <code>12-23</code> bulan) agar tidak menyarankan porsi yang mustahil dihabiskan bayi.</li>
            <li><strong>Batas Keamanan Vitamin A Hewani:</strong> Hati ayam dibatasi maksimal 1 kali per pekan (10 g/porsi) agar retinol hewani tidak melewati batas keamanan harian (600 mcg RAE/hari).</li>
            <li><strong>Keragaman Pangan (MDD ≥ 5/8):</strong> Mesin merotasi serealia, telur, daging/ikan, kacang-kacangan, sayur/buah vitamin A, dan sayur/buah lain.</li>
          </ul>
          ${
            celahAktif.length > 0
              ? `<p class="kartu__isi" style="margin-top:6px;">Celah terdeteksi pada kasus ini: <strong>${celahAktif.map((c) => (LABEL_CELAH as Record<string, string>)[c] ?? c).join("; ")}</strong>.</p>`
              : ""
          }
        </div>

        <div class="kartu">
          <div class="kartu__baris">
            <span class="kartu__label">Lapis 3 · Rujukan Regulasi &amp; Provenans</span>
            ${lencanaVerif("sah")}
          </div>
          <p class="kartu__isi">Standar antropometri merujuk pada <strong>Permenkes RI No. 2 Tahun 2020</strong>. Target kecukupan gizi merujuk pada <strong>Permenkes RI No. 28 Tahun 2019</strong>. Nilai gizi bahan pangan v1 dipetakan dari <strong>USDA FoodData Central SR Legacy (CC0 Domain Publik)</strong> dengan status menunggu verifikasi dosen pengampu.</p>
          <div class="baris-aksi" style="margin-top:8px;">
            <button type="button" class="btn btn--sekunder btn--penuh" data-go="ahli">Buka Mode Ahli &amp; Jejak Klaim Lengkap (A7) →</button>
          </div>
        </div>
      </div>
    `;
  }

  /* ---------- A7: Mode Ahli, Jejak Klaim & Silsilah Sumber Ilmiah ---------- */
  private layarAhli(r: Ringkasan): string {
    const klaimAktif = new Set<string>();
    if (r.hasil === "ok") {
      klaimAktif.add(r.status.bbu.klaim_id);
      klaimAktif.add(r.status.pbu.klaim_id);
      klaimAktif.add(r.status.bbpb.klaim_id);
      r.status.klaim_asumsi.forEach((k) => klaimAktif.add(k));
      if (r.pola) r.pola.klaim_ids.forEach((k) => klaimAktif.add(k));
      if (r.belanja) r.belanja.klaim_ids.forEach((k) => klaimAktif.add(k));
    }

    return `
      <div class="layar">
        <div>
          <div class="layar__kicker">A7 · Mode Ahli &amp; Silsilah Sumber Ilmiah</div>
          <h2 class="layar__judul">Audit deterministik &amp; <em>provenans</em></h2>
          <p class="layar__sub">Dirancang untuk pengujian akademik transparan. Tidak ada klaim yang disajikan sebagai terverifikasi bila masih berstatus asumsi atau belum diperiksa dosen.</p>
        </div>

        <div class="kartu kartu--sorot">
          <div class="kartu__baris">
            <span class="kartu__label">1. Telemetri Mesin &amp; Cap Versi</span>
            ${lencanaVerif("sah")}
          </div>
          <div class="panel-ahli">
            <div class="panel-ahli__baris">
              <span>Versi Mesin / Data / Aturan</span>
              <span>${r.hasil === "ok" ? `${r.versi.engine} / ${r.versi.data} / ${r.versi.rules}` : `${r.engine_version} / ${r.data_version}`}</span>
            </div>
            <div class="panel-ahli__baris">
              <span>Benih PRNG (Mulberry32)</span>
              <span>${escHtml(this.state.masukan.pola.benih)} (100% Deterministik)</span>
            </div>
            <div class="panel-ahli__baris">
              <span>Klaim Aktif pada Kasus Ini</span>
              <span>${klaimAktif.size} ID Klaim Terdaftar</span>
            </div>
          </div>
        </div>

        <div class="kartu">
          <div class="kartu__baris">
            <span class="kartu__label">2. Registri Klaim Ilmiah &amp; Asumsi (${klaimData.klaim.length} Klaim)</span>
            ${lencanaVerif("perlu")}
          </div>
          <div class="pilihan-grid">
            ${klaimData.klaim
              .map((k) => {
                const dipakai = klaimAktif.has(k.id);
                const daftarSumber = k.sumber.map((s) => s.sumber_id).join(", ") || "—";
                return `
                  <div class="pilihan-item ${dipakai ? "is-selected" : ""}" style="cursor:default;">
                    <div>
                      <div class="pilihan-item__nama">${escHtml(k.id)} · Tingkat ${escHtml(k.tingkat)}</div>
                      <div class="pilihan-item__sub">${escHtml(k.pernyataan)} (Sumber: ${escHtml(daftarSumber)})</div>
                    </div>
                    ${lencanaVerif(k.status === "terverifikasi-manusia" ? "sah" : k.tingkat === "D" ? "draf" : "perlu")}
                  </div>
                `;
              })
              .join("")}
          </div>
        </div>

        <div class="kartu">
          <div class="kartu__baris">
            <span class="kartu__label">3. Pustaka Sumber Primer &amp; Sekunder (${sumberData.sumber.length} Sumber)</span>
            ${lencanaVerif("sah")}
          </div>
          <div class="pilihan-grid">
            ${sumberData.sumber
              .map(
                (s) => `
                <div class="pilihan-item" style="cursor:default;">
                  <div>
                    <div class="pilihan-item__nama">${escHtml(s.id)} · ${escHtml(s.judul)}</div>
                    <div class="pilihan-item__sub">${escHtml(s.penerbit)} (${escHtml(s.edisi)}) · Lisensi: ${escHtml(s.lisensi)}</div>
                  </div>
                </div>
              `,
              )
              .join("")}
          </div>
        </div>
      </div>
    `;
  }

  /* ---------- A8: Hening Darurat / Tanda Bahaya & Rujukan Tenaga Kesehatan ---------- */
  private layarBahaya(r: Ringkasan): string {
    const daftarBahaya = daftarTandaBahaya();
    const petaBahaya = new Map(daftarBahaya.map((b) => [b.kode, b.label] as const));
    const alasanList =
      r.hasil === "ok" && r.rujukan.alasan.length > 0
        ? r.rujukan.alasan
        : ["tanda_bahaya:tidak_mau_minum_atau_menyusu"];

    return `
      <div class="layar">
        <div class="kartu kartu--bahaya">
          <div class="kartu__baris">
            ${lencanaStatus("bahaya", "BERHENTI · PRIORITAS KESELAMATAN")}
            <span style="font-family:var(--f-mono);font-size:10.5px;">A8 · HENING DARURAT</span>
          </div>
          <h2 class="layar__judul" style="color:var(--s-bahaya-t);margin-top:4px;">Segera bawa anak ke petugas kesehatan hari ini.</h2>
          <p class="kartu__isi" style="color:var(--t-1);font-weight:600;">
            Demi keselamatan anak pada skenario ini, NUTRIVA menghentikan penyusunan menu MPASI mandiri, menonaktifkan penjelas AI, dan membekukan animasi latar.
          </p>
          <div class="baris-aksi" style="margin-top:8px;">
            <a class="btn btn--bahaya btn--penuh" href="tel:119">
              ${ikon("phone")}
              <span>Hubungi Layanan Darurat 119 / Puskesmas</span>
            </a>
          </div>
        </div>

        <div class="kartu">
          <span class="kartu__label">Alasan Penghentian Kalkulator (Kode Audit)</span>
          <ul class="daftar-langkah" style="margin-top:6px;">
            ${alasanList
              .map((kode) => {
                const kBersih = kode.replace(/^tanda_bahaya:/, "");
                const arti = petaBahaya.get(kBersih);
                return `<li><strong>${escHtml(kode)}</strong>${arti ? ` — ${escHtml(arti)}` : ""}</li>`;
              })
              .join("")}
          </ul>
        </div>

        <div class="kartu">
          <span class="kartu__label">Langkah Pertolongan Pertama Saat Menuju Puskesmas / Bidan</span>
          <ol class="daftar-langkah" style="margin-top:6px;">
            <li><strong>Teruskan ASI / cairan sedikit demi sedikit</strong> jika anak masih sadar dan mampu menelan.</li>
            <li><strong>Jaga tubuh anak tetap hangat</strong> (dekap di dada Ibu dan selimuti).</li>
            <li><strong>Bawa Buku KIA / KMS</strong> dan sampaikan tanda bahaya serta ukuran terakhir kepada bidan atau dokter.</li>
          </ol>
        </div>

        <div class="baris-aksi">
          <button type="button" class="btn btn--sekunder btn--penuh" data-pick-preset="A">
            <span>Kembali ke Simulasi Kasus Normal (Kasus Sintetis A)</span>
          </button>
        </div>
      </div>
    `;
  }

  /* ---------- A9: Tentang, Batas Alat, Privasi Jujur & Hak Reset Sesi ---------- */
  private layarTentang(): string {
    return `
      <div class="layar">
        <div>
          <div class="layar__kicker">A9 · Tentang, Batas Alat &amp; Privasi Jujur</div>
          <h2 class="layar__judul">Kendali penuh &amp; <em>transparansi</em></h2>
          <p class="layar__sub">Aplikasi ini dirancang sebagai alat bantu edukasi dan demonstrasi akademik V-PJBL, bukan alat diagnosis medis maupun pengganti tenaga kesehatan.</p>
        </div>

        <div class="kartu kartu--sorot">
          <div class="kartu__baris">
            <span class="kartu__label">Pernyataan Privasi &amp; Arsitektur Data (K-08 &amp; K-12)</span>
            ${lencanaVerif("sah")}
          </div>
          <p class="kartu__isi">${escHtml(PERNYATAAN_PRIVASI_AI)}</p>
        </div>

        <div class="kartu">
          <span class="kartu__label">Apa yang Dilakukan &amp; Tidak Dilakukan Alat Ini</span>
          <ul class="daftar-langkah" style="margin-top:6px;">
            <li><strong>Bukan diagnosis medis:</strong> Status antropometri dan contoh pola makan adalah bahan diskusi bersama kader Posyandu atau bidan/dokter.</li>
            <li><strong>Tidak meresepkan dosis suplemen:</strong> Bila ada celah zat besi, alat menyarankan konsultasi ke tenaga kesehatan tanpa menyebut miligram obat.</li>
            <li><strong>Inti deterministik bekerja tanpa jaringan:</strong> Perhitungan status pertumbuhan, pola makan, daftar belanja, dan penjelasan templat cadangan berjalan langsung di peramban perangkat; hanya fitur penjelasan AI opsional yang memerlukan koneksi jaringan.</li>
          </ul>
        </div>

        <div class="kartu">
          <div class="kartu__baris">
            <span class="kartu__label">Memori Sesi Saja (ADR-0003)</span>
            <span class="lencana lencana--cukup">Tanpa Penyimpanan Disk</span>
          </div>
          <p class="kartu__isi">Seluruh perubahan angka simulasi hanya berada di memori RAM sementara dan hilang otomatis saat tab ditutup, atau dapat direset seketika:</p>
          <div class="baris-aksi" style="margin-top:8px;">
            <button type="button" class="btn btn--bahaya btn--penuh" data-go="hapus">
              ${ikon("aksi-hapus")}
              <span>Reset Memori Sesi Sekarang</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  /* ---------- K10: Kartu Ringkasan Posyandu / WhatsApp ---------- */
  private layarKartuBagi(r: Ringkasan): string {
    const m = this.state.masukan;
    const pola = r.hasil === "ok" ? r.pola : null;
    const hari1 = pola?.hari[0];

    return `
      <div class="layar">
        <div class="layar__kicker">Kondisi Khusus 10 · Kartu Ringkasan Edukasi Posyandu</div>
        <div class="kartu-bagi">
          <div class="kartu__baris">
            <span class="kartu__label">RINGKASAN SIMULASI EDUKASI MPASI</span>
            <span style="font-family:var(--f-mono);font-size:10px;">${escHtml(m.pola.benih)}</span>
          </div>
          <div style="font-family:var(--f-display);font-size:21px;color:var(--t-1);">
            ${escHtml(PRESET_SINTETIS[this.state.presetAktif].label)} · ${m.status.umur.bulan} bln (${fmtId(m.status.bb_kg, 1)} kg / ${fmtId(m.status.pb_cm, 1)} cm)
          </div>
          <div class="baris-aksi" style="margin:6px 0;">
            ${
              r.hasil === "ok"
                ? `
                  ${lencanaStatus(tingkatVisualBBU(r.status.bbu.kategori), `BB/U: ${LABEL_BBU[r.status.bbu.kategori]}`)}
                  ${lencanaStatus(tingkatVisualBBPB(r.status.bbpb.kategori), `BB/PB: ${LABEL_BBPB[r.status.bbpb.kategori]}`)}
                  ${hari1 ? lencanaStatus("cukup", `MDD ${hari1.jumlah_kelompok_mdd}/8 kelompok`) : ""}
                `
                : lencanaStatus("perhatian", `Status: ${r.alasan}`)
            }
          </div>
          <p class="kartu__isi" style="font-size:11.5px;">
            ${
              hari1
                ? `Contoh racikan Hari 1 mencakup ${hari1.slot.length} waktu makan (${Math.round(hari1.energi_kkal)} kkal dari target MPASI ${hari1.energi_target_kkal} kkal).`
                : "Rekomendasi menu mandiri tidak ditampilkan pada kondisi rujukan/penghentian."
            }
          </p>
          <div class="kartu-bagi__cap">
            ${escHtml(LABEL_PROTOTIPE)}
          </div>
        </div>
        <div class="baris-aksi">
          <button type="button" class="btn btn--sekunder btn--penuh" data-go="kolam">← Kembali ke Bejana Nektar</button>
        </div>
      </div>
    `;
  }

  /* ---------- 8 Keadaan Khusus Lainnya (K01–K09) ---------- */
  private layarKondisiKosong(): string {
    return `
      <div class="layar">
        <div class="layar__kicker">Kondisi Khusus 01 · Keadaan Awal / Siap Diisi</div>
        <h2 class="layar__judul">Bejana siap <em>diisi</em></h2>
        <div class="kartu kartu--sorot" style="text-align:center;padding:22px 16px;">
          <div style="font-family:var(--f-display);font-size:26px;color:var(--aksen);">Pilih Kasus Sintetis atau Isi Ukuran</div>
          <p class="kartu__isi" style="margin-top:6px;">Masukkan usia (6–23 bulan), berat badan, dan panjang badan untuk menyalakan pita pertumbuhan Permenkes 2/2020 dan racikan MPASI deterministik.</p>
          <div class="baris-aksi" style="justify-content:center;margin-top:12px;">
            <button type="button" class="btn btn--utama" data-go="profil">Buka Formulir Profil →</button>
          </div>
        </div>
      </div>
    `;
  }

  private layarKondisiMemuat(): string {
    return `
      <div class="layar">
        <div class="layar__kicker">Kondisi Khusus 02 · Menakar Porsi Deterministik</div>
        <h2 class="layar__judul">Menyusun <em>kombinasi bahan...</em></h2>
        <div class="kartu">
          <div class="kartu__baris">
            <span class="kartu__label">Mesin Heuristik Slot + PRNG Mulberry32</span>
            <span class="lencana lencana--perhatian">&lt; 5 ms</span>
          </div>
          <p class="kartu__isi">Memilih bahan pangan lokal sesuai pita usia, menyaring alergen, memeriksa batas keamanan retinol hati ayam, dan menghitung persen kecukupan 23 zat gizi AKG.</p>
          <div style="height:10px;border-radius:999px;background:var(--permukaan-2);overflow:hidden;margin-top:8px;">
            <div style="width:78%;height:100%;background:var(--aksen);border-radius:999px;"></div>
          </div>
        </div>
        <div class="baris-aksi">
          <button type="button" class="btn btn--sekunder btn--penuh" data-go="piring">Lihat Hasil Sajian →</button>
        </div>
      </div>
    `;
  }

  private layarKondisiLuring(): string {
    return `
      <div class="layar">
        <div class="layar__kicker">Kondisi Khusus 03 · Mode Tanpa Jaringan &amp; Cadangan Deterministik</div>
        <h2 class="layar__judul">Tanpa sinyal, <em>inti tetap jalan</em></h2>
        <div class="kartu kartu--sorot">
          <div class="kartu__baris">
            ${lencanaStatus("cukup", "Inti Deterministik + Service Worker Aktif")}
            ${lencanaVerif("sah")}
          </div>
          <p class="kartu__isi">Seluruh perhitungan status gizi Permenkes 2/2020, contoh pola makan, dan daftar belanja berjalan langsung di perangkat. Saat koneksi internet terputus, kartu penjelasan otomatis beralih ke <strong>templat deterministik lokal</strong> tanpa galat.</p>
        </div>
        <div class="baris-aksi">
          <button type="button" class="btn btn--sekunder btn--penuh" data-go="status">Kembali ke Peta Pertumbuhan</button>
        </div>
      </div>
    `;
  }

  private layarKondisiKedaluwarsa(): string {
    return `
      <div class="layar">
        <div class="layar__kicker">Kondisi Khusus 04 · Pengingat Pembaruan Ukuran Bulanan</div>
        <h2 class="layar__judul">Saatnya <em>timbang ulang</em> di Posyandu</h2>
        <div class="kartu">
          <div class="kartu__baris">
            ${lencanaStatus("perhatian", "Pertumbuhan Bayi Berubah Cepat")}
            ${lencanaVerif("perlu")}
          </div>
          <p class="kartu__isi">Pada usia 6–23 bulan, kebutuhan energi MPASI dan tekstur makanan meningkat seiring bertambahnya bulan usia (pita 6–8 bln, 9–11 bln, dan 12–23 bln). Pastikan menggunakan hasil penimbangan terbaru bulan ini.</p>
          <div class="baris-aksi" style="margin-top:8px;">
            <button type="button" class="btn btn--utama btn--penuh" data-go="profil">Perbarui Usia &amp; Ukuran Anak →</button>
          </div>
        </div>
      </div>
    `;
  }

  private layarKondisiGalat(): string {
    return `
      <div class="layar">
        <div class="layar__kicker">Kondisi Khusus 05 · Validasi Rentang Ukuran &amp; Koreksi Posisi</div>
        <h2 class="layar__judul">Periksa kembali <em>satuan ukur</em></h2>
        <div class="kartu">
          <div class="kartu__baris">
            ${lencanaStatus("perhatian", "Panjang di Luar Tabel BB/PB (45–110 cm)")}
          </div>
          <p class="kartu__isi">Jika panjang badan yang dimasukkan berada di luar rentang <strong>45,0 hingga 110,0 cm</strong>, mesin menolak menebak status BB/PB dan meminta pemeriksaan ulang alat ukur (pastikan satuan sentimeter, bukan inci).</p>
        </div>
        <div class="kartu kartu--sorot">
          <span class="kartu__label">Koreksi Otomatis Posisi Ukur (+0,7 cm) &amp; Pembulatan D-6</span>
          <p class="kartu__isi">Anak usia &lt;24 bulan yang diukur berdiri ditambah <strong>+0,7 cm</strong> secara otomatis, lalu dibulatkan ke kelipatan <strong>0,5 cm terdekat (setengah naik)</strong> agar dapat dicocokkan secara presisi pada tabel BB/PB Permenkes 2/2020.</p>
        </div>
      </div>
    `;
  }

  private layarKondisiTidakLayak(r: Ringkasan): string {
    const feItem =
      r.hasil === "ok" && r.pola
        ? r.pola.hari[0]?.akg.zat.find((z) => z.zat === "besi_mg")
        : null;
    const pct = feItem?.persen ?? 41;
    const fill = Math.max(0.1, Math.min(1, pct / 100));

    return `
      <div class="layar">
        <div class="layar__kicker">Kondisi Khusus 06 · Transparansi Celah Zat Besi &amp; Batas Cakupan</div>
        <h2 class="layar__judul">Kejujuran <em>celah nutrisi</em></h2>
        <div class="bejana">
          <div class="bejana__kepala">
            <div>
              <div class="bejana__nama">Zat Besi (Fe) — Nutrisi Kritis Baduta</div>
              <div class="bejana__angka">${feItem ? `${fmtId(feItem.nilai, 1)} / ${fmtId(feItem.akg, 0)} mg (${pct}% AKG)` : "Celah Zat Besi MPASI"}</div>
            </div>
            ${lencanaStatus("celah", `Celah ${Math.max(0, 100 - pct)}%`)}
          </div>
          <canvas
            class="bejana__kanvas"
            data-bejana-canvas="fe-khusus"
            data-fill="${fill.toFixed(3)}"
            data-lo="${(fill * 0.88).toFixed(3)}"
            data-hi="${(fill * 1.12).toFixed(3)}"
            data-asi="0.03"
            data-viskositas="0.85"
            data-meniskus="6.8"
            data-status="celah"
          ></canvas>
          <div class="bejana__kaki">
            <span class="bejana__rentang">Matriks titik = celah AKG yang jujur ditampilkan</span>
            ${lencanaVerif("perlu")}
          </div>
        </div>
        <div class="kartu">
          <p class="kartu__isi">Sistem menolak memalsukan porsi tidak masuk akal demi memaksakan angka 100% di layar. Celah ditampilkan jujur agar Ibu dan Kader dapat berdiskusi dengan bidan/dokter Puskesmas.</p>
        </div>
      </div>
    `;
  }

  private layarKondisiDataTidakAda(): string {
    return `
      <div class="layar">
        <div class="layar__kicker">Kondisi Khusus 07 · Transparansi Sel Data Belum Lengkap</div>
        <h2 class="layar__judul">Bukan <em>nol persen</em></h2>
        <div class="bejana">
          <div class="bejana__kepala">
            <div>
              <div class="bejana__nama">Mikronutrien dengan Sel Tabel Kosong</div>
              <div class="bejana__angka">Data sumber belum lengkap ≠ Asupan 0 mg</div>
            </div>
            ${lencanaStatus("kosong", "Data Belum Lengkap")}
          </div>
          <canvas
            class="bejana__kanvas"
            data-bejana-canvas="zn-khusus"
            data-fill="0"
            data-lo="0"
            data-hi="0"
            data-asi="0"
            data-status="kosong"
          ></canvas>
          <div class="bejana__kaki">
            <span class="bejana__rentang">Kisi kristal kering = nilai sumber tidak tersedia</span>
            ${lencanaVerif("perlu")}
          </div>
        </div>
        <div class="kartu">
          <p class="kartu__isi">Menampilkan angka 0% ketika tabel sumber belum memuat nilai zat gizi tertentu akan menyesatkan pengguna. Mesin menandai <code>lengkap: false</code> dan menggambar kisi kristal kering.</p>
        </div>
      </div>
    `;
  }

  private layarKondisiHapus(): string {
    return `
      <div class="layar">
        <div class="layar__kicker">Kondisi Khusus 09 · Reset Memori Sesi (ADR-0003)</div>
        <h2 class="layar__judul">Mulai ulang <em>sesi simulasi?</em></h2>
        <div class="kartu kartu--bahaya">
          <p class="kartu__isi" style="color:var(--t-1);">
            Sesuai keputusan arsitektur <strong>ADR-0003</strong>, NUTRIVA tidak menyimpan data pribadi di penyimpanan peramban. Menekan tombol di bawah akan mengatur ulang seluruh masukan di memori RAM kembali ke kondisi awal <strong>Kasus Sintetis A</strong>.
          </p>
          <div class="baris-aksi" style="margin-top:10px;">
            <button type="button" class="btn btn--bahaya" data-confirm-reset="true">
              ${ikon("aksi-hapus")}
              <span>Ya, Mulai Ulang Sesi</span>
            </button>
            <button type="button" class="btn btn--sekunder" data-go="tentang">Batal</button>
          </div>
        </div>
      </div>
    `;
  }

  /* ---------- Kartu Penjelas Bahasa Sederhana (AI Opsional + Fallback Templat) ---------- */
  private bangunKartuAi(
    penjelasan: HasilPenjelasan,
    jenis: "status" | "menu",
    hariIdx = 0,
  ): string {
    const labelSumber =
      penjelasan.sumber === "ai"
        ? "AI Tervalidasi Pagar Deterministik"
        : "Templat Deterministik Lokal";

    return `
      <div class="kartu-ai" aria-live="polite">
        <div class="kartu__baris">
          <div>
            <span class="kartu__label">Penjelas Bahasa Sederhana (K-08)</span>
            <div class="kartu__judul" style="display:flex;align-items:center;gap:6px;">
              ${ikon("spark")}
              <span>Ringkasan untuk Ibu &amp; Kader</span>
            </div>
          </div>
          ${lencanaStatus(penjelasan.sumber === "ai" ? "cukup" : "perhatian", labelSumber)}
        </div>

        <p class="kartu-ai__isi" data-ai-teks="true">${escHtml(penjelasan.teks)}</p>

        <div class="kartu-ai__peringatan" role="note">
          ${escHtml(PERINGATAN_AI)}
        </div>

        <div class="kartu__baris">
          <span style="font-family:var(--f-mono);font-size:10px;color:var(--t-3);">
            ${this.urlWorkerAi ? "Proksi AI tersedia" : "Mode tanpa Worker: otomatis memakai templat deterministik"}
          </span>
          <button
            type="button"
            class="chip"
            data-refresh-ai="${jenis}"
            data-hari-idx="${hariIdx}"
            ${this.state.sedangMemuatAi ? "disabled" : ""}
          >
            ${ikon("spark")}
            <span>${this.state.sedangMemuatAi ? "Meminta Penjelasan..." : "Segarkan Penjelasan"}</span>
          </button>
        </div>
      </div>
    `;
  }

  /* ---------- Lembar Bawah Inspeksi Bahan & Substitusi ---------- */
  private bangunLembarInspeksiBahan(bahanId: string, gram: number): string {
    const atr = PETA_ATRIBUT.get(bahanId);
    const gz = PETA_GIZI_BAHAN.get(bahanId);
    if (!atr || !gz) {
      return `<p class="kartu__isi">Data bahan tidak ditemukan.</p>`;
    }

    const faktor = gram / 100;
    const energi = (gz.per_100g.energi_kkal ?? 0) * faktor;
    const protein = (gz.per_100g.protein_g ?? 0) * faktor;
    const lemak = (gz.per_100g.lemak_g ?? 0) * faktor;
    const besi = (gz.per_100g.besi_mg ?? 0) * faktor;
    const seng = (gz.per_100g.seng_mg ?? 0) * faktor;
    const kalsium = (gz.per_100g.kalsium_mg ?? 0) * faktor;
    const vitA = (gz.per_100g.vit_a_rae_mcg ?? 0) * faktor;
    const vitC = (gz.per_100g.vit_c_mg ?? 0) * faktor;

    const bahanSejenis = DATA.bahanAtribut.bahan.filter(
      (b) =>
        b.peran === atr.peran &&
        b.id !== bahanId &&
        b.usia_min_bulan <= this.state.masukan.status.umur.bulan &&
        !this.state.masukan.pola.hindari.includes(b.id),
    );

    return `
      <div class="layar" style="gap:10px;">
        <div>
          <div class="layar__kicker">Inspeksi Bahan Pangan · ${escHtml(LABEL_PERAN_BAHAN[atr.peran] ?? atr.peran)}</div>
          <div style="font-family:var(--f-display);font-size:1.4rem;color:var(--t-1);">
            ${escHtml(atr.nama)} <em>(${escHtml(takaranRumahTangga(gram, atr.peran))})</em>
          </div>
          <p class="layar__sub">Kelompok MDD: <strong>${escHtml(LABEL_KELOMPOK_MDD[atr.kelompok_mdd] ?? atr.kelompok_mdd)}</strong> · Rasio beli mentah: ${fmtId(atr.rasio_beli, 2)}x (${escHtml(LABEL_KELAS_HARGA[atr.kelas_harga].teks)}).</p>
        </div>

        <div class="kartu kartu--sorot">
          <div class="kartu__baris">
            <span class="kartu__label">Kandungan Gizi per Porsi Saji (${gram} g matang)</span>
            ${lencanaVerif("perlu")}
          </div>
          <div class="dock-grid-2" style="margin-top:4px;">
            <div class="bahan-pil"><span>Energi</span><strong>${fmtId(energi, 0)} kkal</strong></div>
            <div class="bahan-pil"><span>Protein</span><strong>${fmtId(protein, 1)} g</strong></div>
            <div class="bahan-pil"><span>Lemak</span><strong>${fmtId(lemak, 1)} g</strong></div>
            <div class="bahan-pil"><span>Zat Besi (Fe)</span><strong>${fmtId(besi, 2)} mg</strong></div>
            <div class="bahan-pil"><span>Seng (Zn)</span><strong>${fmtId(seng, 2)} mg</strong></div>
            <div class="bahan-pil"><span>Kalsium</span><strong>${fmtId(kalsium, 0)} mg</strong></div>
            <div class="bahan-pil"><span>Vitamin A</span><strong>${fmtId(vitA, 0)} mcg RAE</strong></div>
            <div class="bahan-pil"><span>Vitamin C</span><strong>${fmtId(vitC, 1)} mg</strong></div>
          </div>
        </div>

        <div class="kartu">
          <span class="kartu__label">Ingin Mengganti Bahan Ini di Dapur?</span>
          <p class="kartu__isi">Ketuk tombol di bawah untuk memutar variasi benih menu atau menandai <strong>${escHtml(atr.nama)}</strong> sebagai bahan yang sedang tidak tersedia hari ini (otomatis diganti dengan ${bahanSejenis.slice(0, 3).map((b) => b.nama).join(" / ") || "bahan sejenis"}):</p>
          <div class="baris-aksi" style="margin-top:6px;">
            <button type="button" class="btn btn--utama" data-cycle-benih="true">
              ${ikon("aksi-tukar")}
              <span>Putar Variasi Menu Lain</span>
            </button>
            <button type="button" class="btn btn--sekunder" data-toggle-hindari="${atr.id}">
              <span>Hindari ${escHtml(atr.nama)} &amp; Hitung Ulang</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  /* ---------- Lembar Bawah Inspeksi Penyumbang Zat Gizi Bejana ---------- */
  private bangunLembarInspeksiZat(zat: KunciZat, r: Ringkasan): string {
    if (r.hasil !== "ok" || !r.pola) {
      return `<p class="kartu__isi">Menu belum tersedia.</p>`;
    }
    const hariIdx = Math.min(this.state.hariMenuIdx, r.pola.hari.length - 1);
    const hariAktif = r.pola.hari[hariIdx]!;
    const itemAkg = hariAktif.akg.zat.find((z) => z.zat === zat);
    const namaZat = NAMA_ZAT[zat] ?? zat;

    const kontribusi: { nama: string; gram: number; nilai: number }[] = [];
    for (const sl of hariAktif.slot) {
      for (const it of sl.item) {
        const atr = PETA_ATRIBUT.get(it.bahan_id);
        const gz = PETA_GIZI_BAHAN.get(it.bahan_id);
        const v100 = gz?.per_100g[zat] ?? 0;
        const val = (v100 * it.gram) / 100;
        kontribusi.push({
          nama: atr?.nama ?? it.bahan_id,
          gram: it.gram,
          nilai: val,
        });
      }
    }
    kontribusi.sort((a, b) => b.nilai - a.nilai);

    return `
      <div class="layar" style="gap:10px;">
        <div>
          <div class="layar__kicker">Rincian Bejana Nektar · Hari ke-${hariAktif.hari_ke}</div>
          <div style="font-family:var(--f-display);font-size:1.4rem;color:var(--t-1);text-transform:capitalize;">
            Penyumbang <em>${escHtml(namaZat)}</em>
          </div>
          <p class="layar__sub">
            Total dari MPASI: <strong>${fmtId(itemAkg?.nilai ?? 0, 1)}</strong> dari target AKG <strong>${fmtId(itemAkg?.akg ?? 0, 1)}</strong> (${itemAkg?.persen ?? 0}% AKG).
          </p>
        </div>

        <div class="kartu">
          <span class="kartu__label">Urutan Kontribusi Bahan pada Menu Hari Ini</span>
          <div class="sajian__item-list" style="margin-top:6px;">
            ${kontribusi
              .map(
                (k) => `
                <div class="bahan-pil">
                  <div class="bahan-pil__info">
                    <div class="bahan-pil__nama">${escHtml(k.nama)}</div>
                    <div class="bahan-pil__takaran">Porsi saji: ${k.gram} g</div>
                  </div>
                  <span class="lencana lencana--cukup">+${fmtId(k.nilai, 2)}</span>
                </div>
              `,
              )
              .join("")}
          </div>
        </div>
      </div>
    `;
  }

  /* ---------- Penghidup Fisika Visual, Kanvas & Koreografi Mikro ---------- */
  private hidupkanMesinVisual(darurat: boolean): void {
    if (typeof window === "undefined" || typeof this.akar.querySelectorAll !== "function") {
      return;
    }

    const cvAtelier = this.akar.querySelector<HTMLCanvasElement>("#rona-atelier-canvas");
    if (cvAtelier) {
      this.sutraAtelier = new SutraField(cvAtelier, {
        cols: 40,
        rows: 24,
        ribbons: 5,
        motes: 16,
        interactive: true,
      });
      this.sutraAtelier.setBeku(darurat);
    }

    const cvHp = this.akar.querySelector<HTMLCanvasElement>("#rona-hp-sutra");
    if (cvHp) {
      this.sutraHp = new SutraField(cvHp, {
        cols: 32,
        rows: 20,
        ribbons: 5,
        motes: 14,
        interactive: true,
      });
      this.sutraHp.setBeku(darurat);
    }

    this.akar.querySelectorAll<HTMLCanvasElement>("[data-bejana-canvas]").forEach((cv) => {
      const fill = parseFloat(cv.getAttribute("data-fill") || "0.75");
      const lo = parseFloat(cv.getAttribute("data-lo") || "0.68");
      const hi = parseFloat(cv.getAttribute("data-hi") || "0.82");
      const asi = parseFloat(cv.getAttribute("data-asi") || "0");
      const visk = parseFloat(cv.getAttribute("data-viskositas") || "0.92");
      const men = parseFloat(cv.getAttribute("data-meniskus") || "5.5");
      const st = (cv.getAttribute("data-status") || "cukup") as StatusVisualRona;

      const inst = new BejanaNektar(cv, {
        fill,
        lo,
        hi,
        asiFrac: asi,
        showStrata: this.state.showStrata,
        viskositas: visk,
        meniskus: men,
        status: st,
        interactive: true,
      });
      this.bejanaInstances.push(inst);
    });

    const scrollEl = this.akar.querySelector<HTMLElement>("#rona-hp-scroll");
    if (scrollEl) {
      const blok = scrollEl.querySelectorAll<HTMLElement>(
        ".kartu, .sajian, .bejana, .kartu-bagi, .kartu-ai, .baris-aksi",
      );
      blok.forEach((item, idx) => {
        if (item.style && item.style.setProperty) {
          item.style.setProperty("--urutan", String(idx));
        }
        if (item.classList) {
          item.classList.add("rona-masuk");
        }
      });

      if (!Motion.isHemat()) {
        scrollEl.querySelectorAll<HTMLElement>(".z-meter__pin").forEach((pin) => {
          const targetPct = parseFloat((pin.style && pin.style.left) || "50");
          if (Number.isNaN(targetPct)) return;
          const pegasPin = new Pegas(50, "sutra");
          pegasPin.ke(targetPct);
          const stepPin = (dt: number): void => {
            const cur = pegasPin.langkah(dt);
            pin.style.left = `${cur.toFixed(2)}%`;
            if (pegasPin.diam()) {
              Ticker.remove(stepPin);
            }
          };
          Ticker.add(stepPin);
        });
      }

      geserKe(scrollEl, 10, darurat ? "hening" : "sutra");
    }

    pasangEfekOptik(this.akar);
  }

  private picuTetesan(sourceEl: HTMLElement | null, labelDelta: string): void {
    if (typeof this.akar.querySelector !== "function") return;
    const hpRoot = this.akar.querySelector<HTMLElement>(".hp");
    const dropLayer = this.akar.querySelector<HTMLElement>("#rona-tetes-layer");
    const targetEl =
      this.akar.querySelector<HTMLElement>(".bejana__kanvas") ||
      this.akar.querySelector<HTMLElement>('[data-go="kolam"]');
    luncurkanTetesanNektar(
      hpRoot,
      dropLayer,
      sourceEl,
      targetEl,
      labelDelta,
      this.bejanaInstances,
    );
  }

  private ikatInteraksiDom(r: Ringkasan): void {
    if (typeof this.akar.querySelectorAll !== "function") return;

    // Navigasi antar layar data-go
    this.akar.querySelectorAll<HTMLElement>("[data-go]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const tujuan = btn.getAttribute("data-go") as IdLayar | null;
        if (tujuan) this.bukaLayar(tujuan);
      });
    });

    // Pilih Kasus Sintetis A / B / C
    this.akar.querySelectorAll<HTMLElement>("[data-pick-preset]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const kode = btn.getAttribute("data-pick-preset") as KodePreset | null;
        if (kode && PRESET_SINTETIS[kode]) {
          this.pilihPreset(kode);
        }
      });
    });

    // Pilih Peran
    this.akar.querySelectorAll<HTMLElement>("[data-pick-role]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const peran = btn.getAttribute("data-pick-role") as PeranRona | null;
        if (peran) this.aturPeran(peran);
      });
    });

    // Pilih Tema
    this.akar.querySelectorAll<HTMLElement>("[data-pick-theme]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const tema = btn.getAttribute("data-pick-theme") as TemaRona | null;
        if (tema) this.aturTema(tema);
      });
    });

    // Pilih Mode Gerak
    this.akar.querySelectorAll<HTMLElement>("[data-pick-motion]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const m = btn.getAttribute("data-pick-motion") as ModeGerak | null;
        if (m) {
          Motion.setMode(m, true);
          this.render();
        }
      });
    });

    // Toggle Layout Penuh / Bingkai Ponsel
    this.akar.querySelectorAll<HTMLElement>("[data-toggle-layout]").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.state.layoutPenuh = !this.state.layoutPenuh;
        this.render();
      });
    });

    // Buka Lembar Kontrol Mobile
    this.akar.querySelectorAll<HTMLElement>("[data-open-kontrol]").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.bukaLembar(this.bangunLembarKontrolMobile(), "half");
      });
    });

    // Kontrol Detent & Tutup Lembar Bawah
    this.akar.querySelectorAll<HTMLElement>("[data-close-sheet]").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.tutupLembar();
      });
    });

    this.akar.querySelectorAll<HTMLElement>("[data-set-detent]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const dt = btn.getAttribute("data-set-detent") as "peek" | "half" | "full" | null;
        if (dt && this.lembarTerbuka) {
          this.lembarTerbuka.detent = dt;
          this.render();
        }
      });
    });

    this.akar.querySelectorAll<HTMLElement>("[data-cycle-detent]").forEach((el) => {
      el.addEventListener("click", () => {
        if (!this.lembarTerbuka) return;
        const urutan: ("peek" | "half" | "full")[] = ["peek", "half", "full"];
        const idx = urutan.indexOf(this.lembarTerbuka.detent);
        this.lembarTerbuka.detent = urutan[(idx + 1) % urutan.length]!;
        this.render();
      });
    });

    // Input Formulir Profil A2
    this.akar.querySelectorAll<HTMLInputElement | HTMLSelectElement>("[data-field]").forEach((inp) => {
      inp.addEventListener("change", () => {
        const f = inp.getAttribute("data-field");
        if (!f) return;
        this.aturMasukanKustom((m) => {
          if (f === "jk" && (inp.value === "L" || inp.value === "P")) {
            m.status.jk = inp.value;
          } else if (
            f === "cara_ukur" &&
            (inp.value === "terlentang" || inp.value === "berdiri")
          ) {
            m.status.cara_ukur = inp.value;
          } else if (f === "bulan") {
            const v = parseInt(inp.value, 10);
            if (!Number.isNaN(v)) m.status.umur.bulan = v;
          } else if (f === "hari_umur") {
            const v = parseInt(inp.value, 10);
            if (!Number.isNaN(v)) m.status.umur.hari = Math.max(0, Math.min(30, v));
          } else if (f === "bb_kg") {
            const v = parseFloat(inp.value.replace(",", "."));
            if (!Number.isNaN(v)) m.status.bb_kg = v;
          } else if (f === "pb_cm") {
            const v = parseFloat(inp.value.replace(",", "."));
            if (!Number.isNaN(v)) m.status.pb_cm = v;
          }
        });
      });
    });

    // Toggle ASI & Hati Ayam
    this.akar.querySelectorAll<HTMLElement>("[data-toggle-asi]").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.aturMasukanKustom((m) => {
          m.pola.masih_asi = !m.pola.masih_asi;
        });
      });
    });

    this.akar.querySelectorAll<HTMLElement>("[data-toggle-hati]").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.aturMasukanKustom((m) => {
          m.pola.izinkan_hati = !m.pola.izinkan_hati;
        });
      });
    });

    // Toggle Hindari Alergen / Bahan
    this.akar.querySelectorAll<HTMLElement>("[data-toggle-hindari]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const kode = btn.getAttribute("data-toggle-hindari");
        if (!kode) return;
        this.lembarTerbuka = null;
        this.aturMasukanKustom((m) => {
          const idx = m.pola.hindari.indexOf(kode);
          if (idx === -1) m.pola.hindari.push(kode);
          else m.pola.hindari.splice(idx, 1);
        });
        this.picuTetesan(btn, `Filter ${kode} diperbarui`);
      });
    });

    // Toggle Tanda Bahaya
    this.akar.querySelectorAll<HTMLElement>("[data-toggle-bahaya]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const kode = btn.getAttribute("data-toggle-bahaya");
        if (!kode) return;
        this.aturMasukanKustom((m) => {
          const idx = m.tanda_bahaya.indexOf(kode);
          if (idx === -1) m.tanda_bahaya.push(kode);
          else m.tanda_bahaya.splice(idx, 1);
        });
      });
    });

    // Toggle Mode Ahli di A3
    this.akar.querySelectorAll<HTMLElement>("[data-toggle-ahli]").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.state.modeAhli = !this.state.modeAhli;
        this.render();
      });
    });

    // Pilih Hari Menu di A4
    this.akar.querySelectorAll<HTMLElement>("[data-pick-hari]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.getAttribute("data-pick-hari") || "0", 10);
        if (!Number.isNaN(idx)) {
          this.pilihHariMenu(idx);
          this.picuTetesan(btn, `Menu Hari ke-${idx + 1}`);
        }
      });
    });

    // Siklus Variasi Benih di A4
    this.akar.querySelectorAll<HTMLElement>("[data-cycle-benih]").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.lembarTerbuka = null;
        this.gantiVariasiBenih(btn);
      });
    });

    // Inspeksi Bahan Pangan di Lembar Bawah
    this.akar.querySelectorAll<HTMLElement>("[data-inspect-bahan]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-inspect-bahan");
        const gram = parseInt(btn.getAttribute("data-inspect-gram") || "30", 10);
        if (id) {
          this.bukaLembar(this.bangunLembarInspeksiBahan(id, gram), "half");
        }
      });
    });

    // Inspeksi Penyumbang Zat Gizi pada Bejana di A5
    this.akar.querySelectorAll<HTMLElement>("[data-inspect-zat]").forEach((card) => {
      card.addEventListener("click", (e) => {
        const target = e.target as HTMLElement | null;
        if (target && target.tagName === "CANVAS") return;
        const zat = card.getAttribute("data-inspect-zat") as KunciZat | null;
        if (zat) {
          this.bukaLembar(this.bangunLembarInspeksiZat(zat, r), "half");
        }
      });
    });

    // Toggle Strata ASI + MPASI di A5
    this.akar.querySelectorAll<HTMLElement>("[data-toggle-strata]").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.state.showStrata = !this.state.showStrata;
        this.render();
      });
    });

    // Toggle Tabel 23 Zat Gizi di A5
    this.akar.querySelectorAll<HTMLElement>("[data-toggle-semua-zat]").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.state.tampilkanSemuaZat = !this.state.tampilkanSemuaZat;
        this.render();
      });
    });

    // Segarkan Penjelasan AI
    this.akar.querySelectorAll<HTMLElement>("[data-refresh-ai]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const jenis = btn.getAttribute("data-refresh-ai");
        const hariIdx = parseInt(btn.getAttribute("data-hari-idx") || "0", 10);
        if (jenis === "status") {
          void this.segarkanPenjelasanAiStatus();
        } else if (jenis === "menu") {
          void this.segarkanPenjelasanAiMenu(hariIdx);
        }
      });
    });

    // Konfirmasi Reset Sesi di Layar Hapus
    this.akar.querySelectorAll<HTMLElement>("[data-confirm-reset]").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.resetSesiKeAwal();
      });
    });
  }
}
