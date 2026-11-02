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
import { gambarSemuaBejana } from "./bejana";
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
} from "./ikon";
import { klonMasukan, PRESET_SINTETIS, type KodePreset } from "./preset";

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

export type TemaRona = "fajar" | "dekap" | "terik" | "lensa";
export type PeranRona = "ibu" | "kader" | "ahli";

export interface InfoLayar {
  id: IdLayar;
  label: string;
  kelompok: "Utama" | "Rujukan & Audit" | "Keadaan Sesi";
}

export const DAFTAR_LAYAR: readonly InfoLayar[] = [
  { id: "gerbang", label: "01 · Gerbang & Privasi", kelompok: "Utama" },
  { id: "profil", label: "02 · Masukan & Skrining", kelompok: "Utama" },
  { id: "status", label: "03 · Pita Pertumbuhan", kelompok: "Utama" },
  { id: "piring", label: "04 · Piring & Belanja", kelompok: "Utama" },
  { id: "kolam", label: "05 · Kolam Kecukupan AKG", kelompok: "Utama" },
  { id: "kenapa", label: "06 · Mengapa Rekomendasi Ini?", kelompok: "Utama" },
  { id: "bahaya", label: "07 · Rujukan Wajib (Bahaya)", kelompok: "Rujukan & Audit" },
  { id: "ahli", label: "08 · Jejak Audit & Klaim", kelompok: "Rujukan & Audit" },
  { id: "tentang", label: "09 · Tentang & Lisensi", kelompok: "Rujukan & Audit" },
  { id: "kartuBagi", label: "10 · Kartu Ringkasan Posyandu", kelompok: "Rujukan & Audit" },
  { id: "kosong", label: "11 · Keadaan Kosong", kelompok: "Keadaan Sesi" },
  { id: "memuat", label: "12 · Keadaan Memuat", kelompok: "Keadaan Sesi" },
  { id: "luring", label: "13 · Mode Luring & AI Cadangan", kelompok: "Keadaan Sesi" },
  { id: "kedaluwarsa", label: "14 · Pengingat Ukur Ulang", kelompok: "Keadaan Sesi" },
  { id: "galat", label: "15 · Validasi Rentang Ukuran", kelompok: "Keadaan Sesi" },
  { id: "tidakLayak", label: "16 · Usia di Luar 6–23 Bulan", kelompok: "Keadaan Sesi" },
  { id: "dataTidakAda", label: "17 · Transparansi Sel Gizi Kosong", kelompok: "Keadaan Sesi" },
  { id: "hapus", label: "18 · Reset Memori Sesi", kelompok: "Keadaan Sesi" },
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
  { kode: "susu", label: "Susu Sapi / Olahan" },
  { kode: "kedelai", label: "Kedelai (Tahu/Tempe)" },
  { kode: "kacang", label: "Kacang Tanah" },
  { kode: "gluten", label: "Gluten / Gandum" },
];

const LABEL_PERAN_BAHAN: Record<string, { label: string; warna: string }> = {
  staple: { label: "Makanan Pokok", warna: "var(--c-pokok)" },
  protein_hewani: { label: "Protein Hewani", warna: "var(--c-hewani)" },
  protein_nabati: { label: "Protein Nabati", warna: "var(--c-nabati)" },
  sayur: { label: "Sayur", warna: "var(--c-sayur)" },
  buah: { label: "Buah / Selingan", warna: "var(--c-sayur)" },
  lemak: { label: "Lemak Tambahan", warna: "var(--c-lemak)" },
  susu: { label: "Susu / Olahan", warna: "var(--asi-color)" },
};

const LABEL_KELAS_HARGA: Record<
  "murah" | "sedang" | "mahal",
  { teks: string; tingkat: "ok" | "perlu" | "info" }
> = {
  murah: { teks: "Kelas Harga: Ekonomis", tingkat: "ok" },
  sedang: { teks: "Kelas Harga: Menengah", tingkat: "info" },
  mahal: { teks: "Kelas Harga: Tinggi", tingkat: "perlu" },
};

export interface StateRona {
  layar: IdLayar;
  tema: TemaRona;
  peran: PeranRona;
  presetAktif: KodePreset | "KUSTOM";
  masukan: MasukanRingkasan;
  hariMenuAktif: number;
  indeksVariasi: number;
  tampilkanLisensiFont: boolean;
  aiCache: Record<string, { memuat: boolean; hasil: HasilPenjelasan }>;
}

export interface OpsiLayarRona {
  layarAwal?: IdLayar;
  presetAwal?: KodePreset;
  urlWorkerAi?: string;
}

export class LayarRona {
  private akar: HTMLElement;
  private state: StateRona;
  private urlWorkerAi: string | undefined;

  constructor(akar: HTMLElement, opsi: OpsiLayarRona = {}) {
    this.akar = akar;
    const presetAwal = opsi.presetAwal ?? "A";
    const envMeta = (import.meta as unknown as { env?: Record<string, unknown> })
      .env;
    this.urlWorkerAi =
      opsi.urlWorkerAi !== undefined
        ? opsi.urlWorkerAi
        : urlWorkerAiDariEnv(envMeta);

    this.state = {
      layar: opsi.layarAwal ?? "gerbang",
      tema: "fajar",
      peran: "ibu",
      presetAktif: presetAwal,
      masukan: klonMasukan(PRESET_SINTETIS[presetAwal].masukan),
      hariMenuAktif: 0,
      indeksVariasi: 1,
      tampilkanLisensiFont: false,
      aiCache: {},
    };
  }

  public pasang(): void {
    pasangSprite();
    this.terapkanAtributDokumen();
    this.renderKerangkaPenuh();
    this.ikatDelegasiKlik();
  }

  public ambilState(): Readonly<StateRona> {
    return this.state;
  }

  public ambilHtml(): string {
    return this.akar.innerHTML;
  }

  public hitungRingkasan(): Ringkasan {
    return ringkasan(this.state.masukan);
  }

  public pilihHariMenu(hari: number): void {
    if (Number.isInteger(hari) && hari >= 0) {
      this.state.hariMenuAktif = hari;
      this.perbaruiTampilan();
    }
  }

  public gantiVariasiBenih(): void {
    this.state.indeksVariasi += 1;
    const basis =
      this.state.presetAktif === "KUSTOM"
        ? "kustom"
        : this.state.presetAktif.toLowerCase();
    this.state.masukan.pola.benih = `rona-sintetis-${basis}${this.state.indeksVariasi}`;
    this.perbaruiTampilan();
  }

  public aturMasukanKustom(ubah: (m: MasukanRingkasan) => void): void {
    this.state.presetAktif = "KUSTOM";
    ubah(this.state.masukan);
    this.perbaruiTampilan();
  }

  public async mintaPenjelasanAiAktif(): Promise<void> {
    const r = this.hitungRingkasan();
    if (r.hasil !== "ok" || r.rujukan.tingkat === "rujuk") return;
    const muatan =
      this.state.layar === "piring"
        ? (r.muatan_ai_menu[this.state.hariMenuAktif] ?? r.muatan_ai_status)
        : r.muatan_ai_status;
    if (muatan) {
      await this.picuPenjelasanAi(muatan);
    }
  }

  public bukaLayar(id: IdLayar): void {
    this.state.layar = id;
    this.perbaruiTampilan();
  }

  public pilihPreset(kode: KodePreset): void {
    this.state.presetAktif = kode;
    this.state.masukan = klonMasukan(PRESET_SINTETIS[kode].masukan);
    this.state.hariMenuAktif = 0;
    this.state.indeksVariasi = 1;
    const hasil = this.hitungRingkasan();
    if (hasil.hasil === "stop") {
      this.state.layar =
        hasil.alasan === "berat_tidak_valid" ||
        hasil.alasan === "panjang_di_luar_tabel"
          ? "galat"
          : "tidakLayak";
    } else if (
      hasil.rujukan.tingkat === "rujuk" &&
      (this.state.layar === "piring" ||
        this.state.layar === "kolam" ||
        this.state.layar === "status")
    ) {
      this.state.layar = "bahaya";
    }
    this.perbaruiTampilan();
  }

  public aturTema(tema: TemaRona): void {
    this.state.tema = tema;
    this.terapkanAtributDokumen();
    this.perbaruiTampilan();
  }

  public aturPeran(peran: PeranRona): void {
    this.state.peran = peran;
    this.terapkanAtributDokumen();
    this.perbaruiTampilan();
  }

  public resetSesiKeAwal(): void {
    this.state.presetAktif = "A";
    this.state.masukan = klonMasukan(PRESET_SINTETIS.A.masukan);
    this.state.hariMenuAktif = 0;
    this.state.indeksVariasi = 1;
    this.state.aiCache = {};
    this.state.layar = "gerbang";
    this.perbaruiTampilan();
  }

  private terapkanAtributDokumen(): void {
    if (typeof document === "undefined") return;
    document.documentElement.setAttribute("data-theme", this.state.tema);
    document.documentElement.setAttribute("data-peran", this.state.peran);
  }

  private kunciCacheAi(muatan: MuatanAi): string {
    return JSON.stringify(muatan);
  }

  private ambilAtauSiapkanAi(muatan: MuatanAi): {
    kunci: string;
    memuat: boolean;
    hasil: HasilPenjelasan;
  } {
    const kunci = this.kunciCacheAi(muatan);
    const ada = this.state.aiCache[kunci];
    if (ada) {
      return { kunci, memuat: ada.memuat, hasil: ada.hasil };
    }
    const cadangan: HasilPenjelasan = {
      teks: jelaskanTemplat(muatan),
      sumber: "templat",
    };
    this.state.aiCache[kunci] = { memuat: false, hasil: cadangan };
    return { kunci, memuat: false, hasil: cadangan };
  }

  private async picuPenjelasanAi(muatan: MuatanAi): Promise<void> {
    const kunci = this.kunciCacheAi(muatan);
    const cadangan: HasilPenjelasan = {
      teks: jelaskanTemplat(muatan),
      sumber: "templat",
    };
    this.state.aiCache[kunci] = { memuat: true, hasil: cadangan };
    this.perbaruiTampilan();

    const hasil = await mintaPenjelasan(muatan, {
      urlWorker: this.urlWorkerAi,
    });
    this.state.aiCache[kunci] = { memuat: false, hasil };
    this.perbaruiTampilan();
  }

  private renderKartuAi(muatan: MuatanAi | null, judul: string): string {
    if (!muatan) return "";
    const { kunci, memuat, hasil } = this.ambilAtauSiapkanAi(muatan);
    const lencanaSumber =
      hasil.sumber === "ai"
        ? lencanaStatus("info", "Sumber: Penjelasan AI (Claude Haiku 4.5)")
        : lencanaStatus("ok", "Sumber: Templat Deterministik (Luring)");

    const infoWorker = this.urlWorkerAi
      ? "Proxy Worker AI terkonfigurasi"
      : "Proxy Worker AI belum disetel — memakai templat deterministik";

    return `
      <section class="kartu-ai" aria-label="${judul}">
        <div class="kartu-ai__kepala">
          <div class="kartu-ai__judul">
            ${ikon("spark", 15)}
            <span>${judul}</span>
          </div>
          ${lencanaSumber}
        </div>
        <div class="kartu-ai__isi" data-ai-teks="true">
          ${memuat ? "Meminta penjelasan ringkasan berkode ke proxy AI..." : hasil.teks}
        </div>
        <div class="kartu-ai__peringatan" role="note">
          <strong>Peringatan AI Wajib:</strong> ${PERINGATAN_AI}
        </div>
        <div class="kartu-ai__aksi">
          <span class="teks-detail-kader" style="font-family:var(--f-mono);font-size:10.5px;color:var(--ink-3);">
            Muatan berkode: layar=<code>${muatan.layar}</code> · pita=<code>${muatan.pita_usia}</code> (${infoWorker})
          </span>
          <button
            type="button"
            class="tombol tombol--sekunder tombol--kecil"
            data-aksi="minta-ai"
            data-kunci-ai="${encodeURIComponent(kunci)}"
            ${memuat ? "disabled" : ""}
          >
            ${ikon("spark", 13)}
            <span>${memuat ? "Memuat..." : "Segarkan Penjelasan AI"}</span>
          </button>
        </div>
      </section>
    `;
  }

  private labelKasusAktif(): string {
    if (this.state.presetAktif === "KUSTOM") {
      const s = this.state.masukan.status;
      return `Kasus Sintetis Kustom (${s.umur.bulan} bln ${s.umur.hari} hr · ${s.jk} · ${s.bb_kg} kg · ${s.pb_cm} cm)`;
    }
    return PRESET_SINTETIS[this.state.presetAktif].label;
  }

  private renderKerangkaPenuh(): void {
    const r = this.hitungRingkasan();
    this.akar.innerHTML = `
      <div class="studio-shell">
        <header class="studio-bar" role="region" aria-label="Bilah Kendali Studio NUTRIVA">
          <div class="studio-bar__brand">
            <span class="studio-bar__badge">V-PJBL 2026 · MESIN v${r.hasil === "ok" ? r.versi.engine : r.engine_version}</span>
            <span class="studio-bar__title">NUTRIVA Rona — Perencana MPASI &amp; Antropometri Deterministik</span>
          </div>
          <div class="studio-bar__controls">
            <div class="ctrl-group" role="group" aria-label="Pilih Kasus Uji Sintetis">
              <span class="ctrl-group__label">Kasus Sintetis</span>
              ${(["A", "B", "C"] as const)
                .map(
                  (k) => `
                <button
                  type="button"
                  class="ctrl-chip"
                  data-aksi="pilih-preset"
                  data-preset="${k}"
                  aria-pressed="${this.state.presetAktif === k}"
                >
                  Kasus ${k}
                </button>
              `,
                )
                .join("")}
            </div>
            <div class="ctrl-group" role="group" aria-label="Pilih Peran Pengguna">
              <span class="ctrl-group__label">Peran</span>
              ${(
                [
                  ["ibu", "Ibu/Pengasuh"],
                  ["kader", "Kader"],
                  ["ahli", "Ahli/Dosen"],
                ] as const
              )
                .map(
                  ([kode, lbl]) => `
                <button
                  type="button"
                  class="ctrl-chip"
                  data-aksi="pilih-peran"
                  data-peran="${kode}"
                  aria-pressed="${this.state.peran === kode}"
                >
                  ${lbl}
                </button>
              `,
                )
                .join("")}
            </div>
            <div class="ctrl-group" role="group" aria-label="Pilih Tema Visual">
              <span class="ctrl-group__label">Tema</span>
              ${(
                [
                  ["fajar", "Fajar"],
                  ["dekap", "Dekap"],
                  ["terik", "Terik"],
                  ["lensa", "Lensa"],
                ] as const
              )
                .map(
                  ([kode, lbl]) => `
                <button
                  type="button"
                  class="ctrl-chip"
                  data-aksi="pilih-tema"
                  data-tema="${kode}"
                  aria-pressed="${this.state.tema === kode}"
                >
                  ${lbl}
                </button>
              `,
                )
                .join("")}
            </div>
            <div class="ctrl-group">
              <label class="ctrl-group__label" for="loncat-layar-select">Layar (18)</label>
              <select id="loncat-layar-select" class="ctrl-select" data-aksi="loncat-layar-select">
                ${DAFTAR_LAYAR.map(
                  (l) => `
                  <option value="${l.id}" ${this.state.layar === l.id ? "selected" : ""}>
                    ${l.label}
                  </option>
                `,
                ).join("")}
              </select>
            </div>
          </div>
        </header>

        <div class="studio-stage">
          <aside class="studio-panel" aria-label="Ringkasan Mesin Deterministik">
            ${this.renderPanelKiri(r)}
          </aside>

          <div class="phone-frame" role="region" aria-label="Perangkat NUTRIVA Rona">
            <div class="phone-viewport">
              <div class="pita-prototipe" role="status">
                <span>${LABEL_PROTOTIPE}</span>
                <span>6–23 BLN</span>
              </div>
              ${this.renderBilahAtasHp(r)}
              <main id="konten-utama" class="layar-scroll" tabindex="-1">
                ${this.renderIsiLayar(this.state.layar, r)}
              </main>
              ${this.renderNavigasiBawah(r)}
            </div>
          </div>

          <aside class="studio-panel" aria-label="Inspektur Aturan &amp; Invarian">
            ${this.renderPanelKanan(r)}
          </aside>
        </div>
      </div>
    `;
    gambarSemuaBejana(this.akar);
  }

  private perbaruiTampilan(): void {
    this.renderKerangkaPenuh();
  }

  private renderBilahAtasHp(r: Ringkasan): string {
    const s = this.state.masukan.status;
    const lencanaTindak =
      r.hasil === "stop"
        ? lencanaStatus("perlu", "Di Luar Cakupan")
        : r.rujukan.tingkat === "rujuk"
          ? lencanaStatus("awas", "Rujuk Faskes")
          : r.rujukan.tingkat === "perhatian"
            ? lencanaStatus("perlu", "Perlu Perhatian")
            : lencanaStatus("ok", "Lanjut Mandiri");

    return `
      <div class="app-topbar">
        <div class="app-topbar__kiri">
          <span class="app-topbar__app">NUTRIVA · ${this.state.presetAktif === "KUSTOM" ? "KUSTOM" : `KASUS ${this.state.presetAktif}`}</span>
          <span class="app-topbar__anak">${s.umur.bulan} bln ${s.umur.hari} hr · ${s.jk === "L" ? "Laki-laki" : "Perempuan"} · ${s.bb_kg.toFixed(1).replace(".", ",")} kg</span>
        </div>
        <div class="app-topbar__kanan">
          ${lencanaTindak}
        </div>
      </div>
    `;
  }

  private renderNavigasiBawah(r: Ringkasan): string {
    const rujukAktif = r.hasil === "ok" && r.rujukan.tingkat === "rujuk";
    const butir: { id: IdLayar; ic: string; label: string; bahaya?: boolean }[] =
      [
        { id: "profil", ic: "profil", label: "Profil" },
        { id: "status", ic: "status", label: "Status" },
        rujukAktif
          ? { id: "bahaya", ic: "bahaya", label: "Rujukan", bahaya: true }
          : { id: "piring", ic: "piring", label: "Piring" },
        { id: "kolam", ic: "kolam", label: "AKG" },
        { id: "kenapa", ic: "kenapa", label: "Kenapa" },
      ];

    return `
      <nav class="app-nav" aria-label="Navigasi Utama Aplikasi">
        ${butir
          .map(
            (b) => `
          <button
            type="button"
            class="app-nav__item ${b.bahaya ? "app-nav__item--bahaya" : ""}"
            data-aksi="buka-layar"
            data-layar="${b.id}"
            aria-current="${this.state.layar === b.id ? "page" : "false"}"
          >
            ${ikon(b.ic, 18)}
            <span>${b.label}</span>
          </button>
        `,
          )
          .join("")}
      </nav>
    `;
  }

  private renderPanelKiri(r: Ringkasan): string {
    return `
      <div class="studio-card">
        <h2 class="studio-card__h">Kasus Sintetis Aktif</h2>
        <p class="studio-card__p">
          <strong>${this.labelKasusAktif()}</strong><br/>
          ${
            this.state.presetAktif !== "KUSTOM"
              ? PRESET_SINTETIS[this.state.presetAktif].catatan
              : "Parameter antropometri atau skrining telah disesuaikan secara manual di memori sesi."
          }
        </p>
        <div class="studio-kv">
          <div class="studio-kv__row">
            <span>Status Mesin</span>
            <span class="studio-kv__val">${r.hasil.toUpperCase()}</span>
          </div>
          <div class="studio-kv__row">
            <span>Tindak Lanjut</span>
            <span class="studio-kv__val">${r.hasil === "ok" ? r.rujukan.tingkat.toUpperCase() : r.alasan}</span>
          </div>
          <div class="studio-kv__row">
            <span>Penyimpanan</span>
            <span class="studio-kv__val">Memori Sesi (Tanpa PII)</span>
          </div>
        </div>
      </div>

      <div class="studio-card">
        <h2 class="studio-card__h">Daftar 18 Layar Rona</h2>
        <div style="display:flex;flex-direction:column;gap:4px;">
          ${DAFTAR_LAYAR.map(
            (l) => `
            <button
              type="button"
              class="ctrl-chip"
              style="justify-content:space-between;width:100%;text-align:left;"
              data-aksi="buka-layar"
              data-layar="${l.id}"
              aria-pressed="${this.state.layar === l.id}"
            >
              <span>${l.label}</span>
              <span style="opacity:0.7;font-size:10px;">${l.kelompok}</span>
            </button>
          `,
          ).join("")}
        </div>
      </div>
    `;
  }

  private renderPanelKanan(r: Ringkasan): string {
    return `
      <div class="studio-card">
        <h2 class="studio-card__h">Jaminan Deterministik (K-01..K-13)</h2>
        <div class="studio-kv">
          <div class="studio-kv__row">
            <span>Antropometri</span>
            <span class="studio-kv__val">Pita SD Diskret (Tanpa Z/LMS)</span>
          </div>
          <div class="studio-kv__row">
            <span>Koreksi PB/TB</span>
            <span class="studio-kv__val">Berdiri &lt;24 bln: +0,7 cm</span>
          </div>
          <div class="studio-kv__row">
            <span>Daftar Belanja</span>
            <span class="studio-kv__val">Gram Beli &amp; Kelas Harga</span>
          </div>
          <div class="studio-kv__row">
            <span>Penjelas AI</span>
            <span class="studio-kv__val">${r.hasil === "ok" && r.rujukan.tingkat === "rujuk" ? "Nonaktif (Rujukan)" : "Muatan Berkode + Templat"}</span>
          </div>
        </div>
      </div>

      <div class="studio-card">
        <h2 class="studio-card__h">Pintasan Cepat</h2>
        <div style="display:flex;flex-wrap:wrap;gap:6px;">
          <button type="button" class="tombol tombol--sekunder tombol--kecil" data-aksi="buka-layar" data-layar="ahli">
            ${ikon("audit", 13)}<span>Buku Besar Klaim</span>
          </button>
          <button type="button" class="tombol tombol--sekunder tombol--kecil" data-aksi="buka-layar" data-layar="kartuBagi">
            ${ikon("share", 13)}<span>Kartu Posyandu</span>
          </button>
          <button type="button" class="tombol tombol--sekunder tombol--kecil" data-aksi="buka-layar" data-layar="luring">
            ${ikon("offline", 13)}<span>Info Luring &amp; AI</span>
          </button>
          <button type="button" class="tombol tombol--sekunder tombol--kecil" data-aksi="buka-layar" data-layar="hapus">
            ${ikon("trash", 13)}<span>Reset Sesi</span>
          </button>
        </div>
      </div>
    `;
  }

  private renderIsiLayar(id: IdLayar, r: Ringkasan): string {
    switch (id) {
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
      case "kosong":
        return this.layarKosong();
      case "memuat":
        return this.layarMemuat();
      case "luring":
        return this.layarLuring();
      case "kedaluwarsa":
        return this.layarKedaluwarsa();
      case "galat":
        return this.layarGalat(r);
      case "tidakLayak":
        return this.layarTidakLayak(r);
      case "dataTidakAda":
        return this.layarDataTidakAda();
      case "hapus":
        return this.layarHapus();
      case "kartuBagi":
        return this.layarKartuBagi(r);
    }
  }

  /* ========================================================================
     01 · LAYAR GERBANG
     ======================================================================== */
  private layarGerbang(): string {
    return `
      <section class="kepala-layar">
        <span class="kepala-layar__eyebrow">Edisi Lapangan Posyandu · V-PJBL 2026</span>
        <h1 class="kepala-layar__judul">Timbang dengan tenang, susun piring dengan terang.</h1>
        <p class="kepala-layar__sub">
          Alat bantu edukasi dan perencanaan MPASI bayi <strong>6 sampai 23 bulan</strong> berbasis tabel pita baku Kemenkes RI (Permenkes 2/2020), AKG 2019, dan bahan pangan lokal.
        </p>
      </section>

      <div class="pita-batas" role="note">
        ${ikon("warn", 18)}
        <div class="pita-batas__teks">
          <strong>${LABEL_PROTOTIPE}</strong>
          Aplikasi ini untuk edukasi gizi dan simulasi perencanaan MPASI; tidak menggantikan pemeriksaan tenaga kesehatan di Posyandu, Puskesmas, atau rumah sakit.
        </div>
      </div>

      <article class="kartu">
        <div class="kartu__kepala">
          <div>
            <h2 class="kartu__judul">Pilih Peran Tampilan</h2>
            <p class="kartu__sub">Menyesuaikan kedalaman penjelasan tanpa mengubah hasil hitungan mesin</p>
          </div>
        </div>
        <div class="pilihan-grup" role="group" aria-label="Pilih Peran">
          ${(
            [
              ["ibu", "Ibu / Pengasuh", "Bahasa hangat & langkah praktis"],
              ["kader", "Kader Posyandu", "Disertai kode aturan & batas pita"],
              ["ahli", "Ahli / Dosen", "Tabel pita SD & buku besar klaim"],
            ] as const
          )
            .map(
              ([kode, judul, sub]) => `
            <button
              type="button"
              class="pilihan-chip"
              data-aksi="pilih-peran"
              data-peran="${kode}"
              aria-pressed="${this.state.peran === kode}"
            >
              <span>${judul}</span>
              <span class="pilihan-chip__sub">${sub}</span>
            </button>
          `,
            )
            .join("")}
        </div>
      </article>

      <article class="kartu kartu--aksen">
        <div class="kartu__kepala">
          <div>
            <h2 class="kartu__judul">${ikon("lock", 15)} Privasi &amp; Mode Kerja</h2>
            <p class="kartu__sub">Transparansi penyimpanan sesi &amp; penjelas AI opsional (ADR-0003 &amp; K-08)</p>
          </div>
          ${lencanaStatus("ok", "Tanpa Nama & Tanggal Lahir")}
        </div>
        <p style="font-size:var(--fs-xs);color:var(--ink-2);line-height:1.55;">
          Perhitungan status antropometri, skrining rujukan, susunan menu MPASI, dan daftar belanja berjalan <strong>sepenuhnya di memori sesi perangkat Anda</strong> (dapat bekerja secara luring setelah dimuat Service Worker) tanpa menyimpan data pribadi ke penyimpanan lokal maupun basis data server.
        </p>
        <p style="font-size:11.5px;color:var(--ink-3);line-height:1.5;">
          ${PERNYATAAN_PRIVASI_AI}
        </p>
      </article>

      <div class="baris-tombol">
        <button type="button" class="tombol tombol--utama tombol--penuh" data-aksi="buka-layar" data-layar="profil">
          <span>Mulai Skrining &amp; Susun MPASI</span>
          ${ikon("arrowR", 16)}
        </button>
        <button type="button" class="tombol tombol--sekunder tombol--penuh" data-aksi="buka-layar" data-layar="tentang">
          ${ikon("book", 15)}
          <span>Baca Sumber Ilmiah &amp; Lisensi Font</span>
        </button>
      </div>
    `;
  }

  /* ========================================================================
     02 · LAYAR PROFIL & SKRINING
     ======================================================================== */
  private layarProfil(r: Ringkasan): string {
    const m = this.state.masukan;
    const s = m.status;
    const daftarBahaya = daftarTandaBahaya();

    return `
      <section class="kepala-layar">
        <span class="kepala-layar__eyebrow">Langkah 1 dari 4 · Tanpa Data Identitas Pribadi</span>
        <h1 class="kepala-layar__judul">Ukuran Antropometri &amp; Skrining Bahaya</h1>
        <p class="kepala-layar__sub">
          Pilih salah satu kasus sintetis di bawah atau ubah angka usia, berat, dan panjang badan secara langsung.
        </p>
      </section>

      <article class="kartu">
        <div class="kartu__kepala">
          <div>
            <h2 class="kartu__judul">Kasus Uji Sintetis (Tanpa Nama Anak)</h2>
            <p class="kartu__sub">Tiga skenario rujukan untuk pengujian cepat (INV-17)</p>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:8px;">
          ${(["A", "B", "C"] as const)
            .map((k) => {
              const p = PRESET_SINTETIS[k];
              const aktif = this.state.presetAktif === k;
              return `
                <button
                  type="button"
                  class="pilihan-chip"
                  style="text-align:left;align-items:flex-start;"
                  data-aksi="pilih-preset"
                  data-preset="${k}"
                  aria-pressed="${aktif}"
                >
                  <span style="font-weight:700;">${p.label}</span>
                  <span class="pilihan-chip__sub">${p.ringkas}</span>
                </button>
              `;
            })
            .join("")}
        </div>
      </article>

      <article class="kartu">
        <div class="kartu__kepala">
          <div>
            <h2 class="kartu__judul">Data Pengukuran Anak</h2>
            <p class="kartu__sub">Cakupan mesin: usia 6 s.d. 23 bulan penuh (Permenkes 2/2020)</p>
          </div>
        </div>

        <div class="bidang">
          <span class="bidang__label">Jenis Kelamin</span>
          <div class="pilihan-grup">
            <button type="button" class="pilihan-chip" data-aksi="set-jk" data-jk="L" aria-pressed="${s.jk === "L"}">
              <span>Laki-laki (L)</span>
              <span class="pilihan-chip__sub">Tabel WHO Putra</span>
            </button>
            <button type="button" class="pilihan-chip" data-aksi="set-jk" data-jk="P" aria-pressed="${s.jk === "P"}">
              <span>Perempuan (P)</span>
              <span class="pilihan-chip__sub">Tabel WHO Putri</span>
            </button>
          </div>
        </div>

        <div class="input-angka-baris">
          <div class="input-angka-kotak">
            <label for="in-umur-bulan">Usia (Bulan Penuh)</label>
            <input id="in-umur-bulan" type="number" min="0" max="36" step="1" value="${s.umur.bulan}" data-input="umur-bulan" />
          </div>
          <div class="input-angka-kotak">
            <label for="in-umur-hari">Sisa Hari (0–30)</label>
            <input id="in-umur-hari" type="number" min="0" max="30" step="1" value="${s.umur.hari}" data-input="umur-hari" />
          </div>
          <div class="input-angka-kotak">
            <label for="in-bb-kg">Berat Badan (kg)</label>
            <input id="in-bb-kg" type="number" min="1" max="30" step="0.1" value="${s.bb_kg}" data-input="bb-kg" />
          </div>
          <div class="input-angka-kotak">
            <label for="in-pb-cm">Panjang / Tinggi (cm)</label>
            <input id="in-pb-cm" type="number" min="40" max="120" step="0.1" value="${s.pb_cm}" data-input="pb-cm" />
          </div>
        </div>

        <div class="bidang">
          <span class="bidang__label">Cara Pengukuran Panjang / Tinggi Badan</span>
          <div class="pilihan-grup">
            <button type="button" class="pilihan-chip" data-aksi="set-cara-ukur" data-cara="terlentang" aria-pressed="${s.cara_ukur === "terlentang"}">
              <span>Terlentang (Infantometer)</span>
              <span class="pilihan-chip__sub">Standar anak &lt; 24 bln (koreksi 0,0 cm)</span>
            </button>
            <button type="button" class="pilihan-chip" data-aksi="set-cara-ukur" data-cara="berdiri" aria-pressed="${s.cara_ukur === "berdiri"}">
              <span>Berdiri (Microtoise)</span>
              <span class="pilihan-chip__sub">Otomatis ditambah +0,7 cm menjadi PB</span>
            </button>
          </div>
        </div>
      </article>

      <article class="kartu">
        <div class="kartu__kepala">
          <div>
            <h2 class="kartu__judul">Preferensi ASI &amp; Pantangan Alergen</h2>
            <p class="kartu__sub">Menentukan pembagian strata AKG dan penyaringan bahan MPASI</p>
          </div>
        </div>

        <div class="pilihan-grup">
          <button type="button" class="pilihan-chip" data-aksi="toggle-asi" aria-pressed="${m.pola.masih_asi}">
            <span>Masih Menyusu ASI: ${m.pola.masih_asi ? "Ya" : "Tidak"}</span>
            <span class="pilihan-chip__sub">Ketuk untuk mengubah status ASI</span>
          </button>
          <button type="button" class="pilihan-chip" data-aksi="toggle-hati" aria-pressed="${m.pola.izinkan_hati}">
            <span>Hati Ayam/Sapi: ${m.pola.izinkan_hati ? "Diizinkan" : "Dihindari"}</span>
            <span class="pilihan-chip__sub">Maks. 1 kali/pekan (batas Vit. A hewani)</span>
          </button>
        </div>

        <div class="bidang">
          <span class="bidang__label">Hindari Alergen / Bahan Pangan</span>
          <div class="pilihan-grup" style="grid-template-columns:repeat(3, 1fr);">
            ${DAFTAR_ALERGEN_UI.map((al) => {
              const aktif = m.pola.hindari.includes(al.kode);
              return `
                <button
                  type="button"
                  class="pilihan-chip"
                  data-aksi="toggle-alergen"
                  data-alergen="${al.kode}"
                  aria-pressed="${aktif}"
                >
                  <span>${al.label}</span>
                  <span class="pilihan-chip__sub">${aktif ? "Dihindari" : "Boleh"}</span>
                </button>
              `;
            }).join("")}
          </div>
        </div>
      </article>

      <article class="kartu ${m.tanda_bahaya.length > 0 ? "kartu--bahaya" : ""}">
        <div class="kartu__kepala">
          <div>
            <h2 class="kartu__judul">${ikon("bahaya", 16)} Skrining Tanda Bahaya Klinis</h2>
            <p class="kartu__sub">Jika satu saja dipilih, mesin menghentikan rekomendasi menu mandiri dan mengarahkan ke Rujukan Wajib (K-04)</p>
          </div>
          ${lencanaVerif(DATA.aturanRujukan.label_belum_diverifikasi)}
        </div>
        <div class="daftar-cek-bahaya">
          ${daftarBahaya
            .map((tb) => {
              const aktif = m.tanda_bahaya.includes(tb.kode);
              return `
              <label class="item-cek-bahaya" data-aktif="${aktif}">
                <input
                  type="checkbox"
                  data-aksi="toggle-bahaya"
                  data-kode="${tb.kode}"
                  ${aktif ? "checked" : ""}
                />
                <span>${tb.label}</span>
              </label>
            `;
            })
            .join("")}
        </div>
      </article>

      <div class="baris-tombol">
        <button
          type="button"
          class="tombol ${r.hasil === "ok" && r.rujukan.tingkat === "rujuk" ? "tombol--bahaya" : "tombol--utama"} tombol--penuh"
          data-aksi="lanjut-dari-profil"
        >
          <span>${
            r.hasil === "stop"
              ? "Lihat Penjelasan Batas Cakupan"
              : r.rujukan.tingkat === "rujuk"
                ? "Tanda Bahaya / Rujukan Terdeteksi — Buka Layar Rujukan"
                : "Lihat Status Pertumbuhan & Susunan Piring"
          }</span>
          ${ikon("arrowR", 16)}
        </button>
      </div>
    `;
  }

  /* ========================================================================
     03 · LAYAR STATUS ANTROPOMETRI (PITA SD — TANPA ANGKA Z-SCORE)
     ======================================================================== */
  private layarStatus(r: Ringkasan): string {
    if (r.hasil === "stop") {
      return this.layarTidakLayak(r);
    }

    const { status: st, rujukan } = r;
    const s = this.state.masukan.status;
    const koreksiAktif = s.cara_ukur === "berdiri";

    const tabelBbu = DATA.bbu[s.jk].baris.find(
      (b) => b.bulan === st.usia_bulan_penuh,
    );
    const tabelPbu = DATA.pbu[s.jk].baris.find(
      (b) => b.bulan === st.usia_bulan_penuh,
    );
    const tabelBbpb = DATA.bbpb[s.jk].baris.find(
      (b) => Math.abs(b.panjang_cm - st.panjang_tabel_cm) < 0.01,
    );

    const indikatorList = [
      {
        kode: "BB/U",
        judul: "Berat Badan menurut Umur (BB/U)",
        nilaiUkur: `${s.bb_kg.toFixed(1).replace(".", ",")} kg pada usia ${st.usia_bulan_penuh} bln`,
        kategoriLabel: LABEL_BBU[st.bbu.kategori],
        tingkat: tingkatVisualBBU(st.bbu.kategori),
        posisi: st.bbu.posisi,
        klaimId: st.bbu.klaim_id,
        belumVerif: st.bbu.label_belum_diverifikasi,
        sdRow: tabelBbu?.sd,
        acuanLabel: `Usia ${st.usia_bulan_penuh} bulan (${s.jk})`,
      },
      {
        kode: "PB/U",
        judul: "Panjang Badan menurut Umur (PB/U)",
        nilaiUkur: `${st.panjang_dipakai_cm.toFixed(1).replace(".", ",")} cm ${koreksiAktif ? "(setelah koreksi +0,7 cm dari ukur berdiri)" : "(ukur terlentang)"}`,
        kategoriLabel: LABEL_PBU[st.pbu.kategori],
        tingkat: tingkatVisualPBU(st.pbu.kategori),
        posisi: st.pbu.posisi,
        klaimId: st.pbu.klaim_id,
        belumVerif: st.pbu.label_belum_diverifikasi,
        sdRow: tabelPbu?.sd,
        acuanLabel: `Usia ${st.usia_bulan_penuh} bulan (${s.jk})`,
      },
      {
        kode: "BB/PB",
        judul: "Berat Badan menurut Panjang Badan (BB/PB)",
        nilaiUkur: `${s.bb_kg.toFixed(1).replace(".", ",")} kg terhadap acuan panjang ${st.panjang_tabel_cm.toFixed(1).replace(".", ",")} cm`,
        kategoriLabel: LABEL_BBPB[st.bbpb.kategori],
        tingkat: tingkatVisualBBPB(st.bbpb.kategori),
        posisi: st.bbpb.posisi,
        klaimId: st.bbpb.klaim_id,
        belumVerif: st.bbpb.label_belum_diverifikasi,
        sdRow: tabelBbpb?.sd,
        acuanLabel: `Panjang tabel ${st.panjang_tabel_cm.toFixed(1).replace(".", ",")} cm (${s.jk})`,
      },
    ];

    return `
      <section class="kepala-layar">
        <span class="kepala-layar__eyebrow">Langkah 2 dari 4 · Klasifikasi Pita Pertumbuhan WHO 2006 / Permenkes 2/2020</span>
        <h1 class="kepala-layar__judul">Posisi pada Pita Baku Pertumbuhan</h1>
        <p class="kepala-layar__sub">
          Menampilkan kategori resmi dan posisi pita simpangan baku (SD) tanpa menampilkan angka indeks kontinu yang rawan salah tafsir (K-02).
        </p>
      </section>

      ${
        rujukan.tingkat === "rujuk"
          ? `
        <article class="kartu kartu--bahaya" role="alert">
          <div class="kartu__kepala">
            <div>
              <h2 class="kartu__judul">${ikon("bahaya", 16)} Indikasi Rujukan Wajib ke Fasilitas Kesehatan</h2>
              <p class="kartu__sub">Alasan pemicu: <code>${rujukan.alasan.join(", ")}</code></p>
            </div>
            ${lencanaStatus("awas", "Rujuk Segera")}
          </div>
          <p style="font-size:var(--fs-sm);color:var(--ink-2);">
            Sesuai aturan keselamatan NUTRIVA (K-04 &amp; K-08), perencanaan menu MPASI mandiri dan penjelas AI dinonaktifkan pada kondisi rujukan. Silakan bawa anak ke Puskesmas, Posyandu, atau rumah sakit.
          </p>
          <button type="button" class="tombol tombol--bahaya tombol--penuh" data-aksi="buka-layar" data-layar="bahaya">
            ${ikon("bahaya", 16)}
            <span>Buka Panduan Rujukan Wajib</span>
          </button>
        </article>
      `
          : rujukan.tingkat === "perhatian"
            ? `
        <div class="pita-batas" role="status">
          ${ikon("warn", 18)}
          <div class="pita-batas__teks">
            <strong>Perlu Pemantauan Lebih Dekat (${rujukan.alasan.join(", ")})</strong>
            Anak berada pada pita yang memerlukan pemantauan rutin di Posyandu/Puskesmas sambil mengoptimalkan kepadatan gizi MPASI.
          </div>
        </div>
      `
            : ""
      }

      ${
        koreksiAktif
          ? `
        <article class="kartu kartu--aksen">
          <div class="kartu__kepala">
            <div>
              <h2 class="kartu__judul">Koreksi Cara Ukur Berdiri (+0,7 cm) Diterapkan</h2>
              <p class="kartu__sub">Aturan standar WHO 2006 &amp; Permenkes 2/2020 untuk anak usia &lt; 24 bulan</p>
            </div>
            ${lencanaStatus("info", `${s.pb_cm.toFixed(1).replace(".", ",")} -> ${st.panjang_dipakai_cm.toFixed(1).replace(".", ",")} cm`)}
          </div>
          <p style="font-size:var(--fs-xs);color:var(--ink-2);">
            Karena anak berusia <strong>${st.usia_bulan_penuh} bulan</strong> (&lt; 24 bulan) tetapi diukur dalam posisi berdiri, mesin secara deterministik menambahkan <strong>0,7 cm</strong> agar setara dengan panjang badan terlentang (PB) sebelum mencocokkan tabel (dibulatkan ke 0,5 cm terdekat menjadi <strong>${st.panjang_tabel_cm.toFixed(1).replace(".", ",")} cm</strong> untuk tabel BB/PB).
          </p>
        </article>
      `
          : ""
      }

      ${indikatorList
        .map((ind) => {
          const persenPin = posisiKePersenPin(ind.posisi);
          const pitaTeks = labelPosisiPita(ind.posisi);
          return `
          <article class="kartu">
            <div class="kartu__kepala">
              <div>
                <h2 class="kartu__judul">${ind.judul}</h2>
                <p class="kartu__sub">${ind.nilaiUkur}</p>
              </div>
              ${lencanaStatus(ind.tingkat, ind.kategoriLabel)}
            </div>

            <div class="z-meter" aria-label="Pita Pertumbuhan ${ind.kode}">
              <div class="z-meter__head">
                <span class="z-meter__indikator">${ind.kode} · ${pitaTeks}</span>
                ${lencanaVerif(ind.belumVerif)}
              </div>
              <div class="z-meter__track">
                <div class="z-meter__seg z-meter__seg--danger" title="Di bawah -3 SD"></div>
                <div class="z-meter__seg z-meter__seg--warn" title="-3 SD s.d. -2 SD"></div>
                <div class="z-meter__seg z-meter__seg--ok" title="-2 SD s.d. +1 SD"></div>
                <div class="z-meter__seg z-meter__seg--ok" title="Median s.d. +2 SD"></div>
                <div class="z-meter__seg z-meter__seg--warn" title="+2 SD s.d. +3 SD"></div>
                <div class="z-meter__seg z-meter__seg--danger" title="Di atas +3 SD"></div>
                <div class="z-meter__pin" style="left:${persenPin}%;" title="${pitaTeks}">
                  <span class="z-meter__pin-tag">${pitaTeks}</span>
                </div>
              </div>
              <div class="z-meter__ticks" aria-hidden="true">
                <span>-3 SD</span>
                <span>-2 SD</span>
                <span>-1 SD</span>
                <span>Median</span>
                <span>+1 SD</span>
                <span>+2 SD</span>
                <span>+3 SD</span>
              </div>
            </div>

            ${
              ind.sdRow
                ? `
              <div class="teks-detail-kader" style="font-family:var(--f-mono);font-size:11px;color:var(--ink-3);background:var(--bg-2);padding:8px 10px;border-radius:var(--r-sm);">
                <strong>Batas Pita Tabel (${ind.acuanLabel} · ${ind.klaimId}):</strong><br/>
                -3 SD: ${ind.sdRow[0]} · -2 SD: ${ind.sdRow[1]} · -1 SD: ${ind.sdRow[2]} · Median: <strong>${ind.sdRow[3]}</strong> · +1 SD: ${ind.sdRow[4]} · +2 SD: ${ind.sdRow[5]} · +3 SD: ${ind.sdRow[6]}
              </div>
            `
                : ""
            }
          </article>
        `;
        })
        .join("")}

      ${
        rujukan.tingkat !== "rujuk"
          ? this.renderKartuAi(
              r.muatan_ai_status,
              "Penjelasan Status Pertumbuhan",
            )
          : ""
      }

      <div class="baris-tombol">
        ${
          rujukan.tingkat === "rujuk"
            ? `
          <button type="button" class="tombol tombol--bahaya tombol--penuh" data-aksi="buka-layar" data-layar="bahaya">
            ${ikon("bahaya", 16)}
            <span>Buka Panduan Rujukan Wajib</span>
          </button>
        `
            : `
          <button type="button" class="tombol tombol--utama tombol--penuh" data-aksi="buka-layar" data-layar="piring">
            <span>Lanjut ke Susunan Piring &amp; Daftar Belanja</span>
            ${ikon("arrowR", 16)}
          </button>
        `
        }
      </div>
    `;
  }

  /* ========================================================================
     04 · LAYAR PIRING HARIAN & DAFTAR BELANJA (TANPA LP RUPIAH)
     ======================================================================== */
  private layarPiring(r: Ringkasan): string {
    if (r.hasil === "stop") {
      return this.layarTidakLayak(r);
    }
    if (r.rujukan.tingkat === "rujuk" || !r.pola) {
      return `
        <section class="kepala-layar">
          <span class="kepala-layar__eyebrow">Gerbang Keselamatan Aktif (K-04)</span>
          <h1 class="kepala-layar__judul">Rekomendasi Menu Dihentikan Sementara</h1>
          <p class="kepala-layar__sub">
            Karena hasil skrining menunjukkan <strong>indikasi rujukan wajib</strong> (<code>${r.rujukan.alasan.join(", ") || r.pola_alasan_henti}</code>), NUTRIVA tidak menampilkan susunan menu mandiri agar penanganan medis di fasilitas kesehatan tidak tertunda.
          </p>
        </section>
        <article class="kartu kartu--bahaya">
          <p style="font-size:var(--fs-sm);color:var(--ink-2);">
            Pemberian makan pada anak dengan tanda bahaya klinis atau gizi buruk memerlukan evaluasi langsung oleh dokter, bidan, atau tenaga gizi Puskesmas/RS.
          </p>
          <button type="button" class="tombol tombol--bahaya tombol--penuh" data-aksi="buka-layar" data-layar="bahaya">
            ${ikon("bahaya", 16)}
            <span>Lihat Langkah Rujukan ke Faskes</span>
          </button>
        </article>
      `;
    }

    const pola = r.pola;
    const aturanPita = DATA.aturanPolaMakan.pita[pola.pita];
    const teksturAnjuran =
      pola.pita === "6-8"
        ? "Bubur kental saring / lumat halus"
        : pola.pita === "9-11"
          ? "Cincang halus / kasar & makanan genggam (finger food)"
          : "Makanan keluarga yang dihaluskan/dipotong seperlunya";
    const idxHari = Math.min(
      Math.max(0, this.state.hariMenuAktif),
      pola.hari.length - 1,
    );
    const menuHari = pola.hari[idxHari] ?? pola.hari[0];
    if (!menuHari) return "";
    const muatanAiHari = r.muatan_ai_menu[idxHari] ?? null;
    const belanja = r.belanja;

    return `
      <section class="kepala-layar">
        <span class="kepala-layar__eyebrow">Langkah 3 dari 4 · Contoh Menu Deterministik (${LABEL_PITA[pola.pita]})</span>
        <h1 class="kepala-layar__judul">Susunan Piring Harian &amp; Daftar Belanja</h1>
        <p class="kepala-layar__sub">
          Disusun secara deterministik dari aturan kelompok usia <strong>${pola.pita} bulan</strong> tanpa klaim optimasi biaya linear programming (INV-07).
        </p>
      </section>

      <article class="kartu kartu--aksen">
        <div class="kartu__kepala">
          <div>
            <h2 class="kartu__judul">Aturan Tekstur &amp; Frekuensi (${pola.pita} Bulan)</h2>
            <p class="kartu__sub">Klaim aturan: <code>${pola.klaim_ids.join(", ")}</code></p>
          </div>
          ${lencanaVerif(pola.label_belum_diverifikasi)}
        </div>
        <div class="studio-kv">
          <div class="studio-kv__row">
            <span>Tekstur Anjuran</span>
            <span class="studio-kv__val">${teksturAnjuran}</span>
          </div>
          <div class="studio-kv__row">
            <span>Frekuensi Harian</span>
            <span class="studio-kv__val">${aturanPita.makan_utama}x makan utama + ${aturanPita.selingan}x selingan</span>
          </div>
          <div class="studio-kv__row">
            <span>Target Energi MPASI</span>
            <span class="studio-kv__val">${menuHari.energi_target_kkal} kkal/hari (tercapai ${menuHari.energi_kkal} kkal · ${menuHari.energi_persen_target}%)</span>
          </div>
          <div class="studio-kv__row">
            <span>Keragaman Pangan (MDD)</span>
            <span class="studio-kv__val">${menuHari.jumlah_kelompok_mdd}/8 kelompok (${menuHari.mdd_tercapai ? "Tercapai ≥5" : "Belum mencapai 5"})</span>
          </div>
        </div>
      </article>

      <article class="kartu">
        <div class="kartu__kepala">
          <div>
            <h2 class="kartu__judul">Pilih Hari &amp; Variasi Benih</h2>
            <p class="kartu__sub">Benih deterministik aktif: <code>${pola.benih}</code></p>
          </div>
          <button type="button" class="tombol tombol--sekunder tombol--kecil" data-aksi="ganti-benih">
            ${ikon("spark", 13)}
            <span>Ganti Variasi Menu</span>
          </button>
        </div>

        <div class="tab-hari" role="tablist" aria-label="Pilih Hari Menu">
          ${pola.hari
            .map(
              (h, i) => `
            <button
              type="button"
              role="tab"
              class="tab-hari__item"
              data-aksi="pilih-hari-menu"
              data-hari="${i}"
              aria-selected="${i === idxHari}"
            >
              Hari ke-${h.hari_ke} (${h.energi_kkal} kkal)
            </button>
          `,
            )
            .join("")}
        </div>

        <div class="piring-wrap" style="margin-top:8px;">
          <svg class="piring-svg" viewBox="0 0 220 220" role="img" aria-label="Proporsi Piring MPASI Hari ke-${menuHari.hari_ke}">
            <circle cx="110" cy="110" r="98" fill="var(--bg-2)" stroke="var(--hairline-strong)" stroke-width="2"/>
            <path d="M110,110 L110,18 A92,92 0 0,1 196,144 Z" fill="var(--c-pokok)" opacity="0.82"/>
            <path d="M110,110 L196,144 A92,92 0 0,1 72,194 Z" fill="var(--c-hewani)" opacity="0.85"/>
            <path d="M110,110 L72,194 A92,92 0 0,1 22,82 Z" fill="var(--c-nabati)" opacity="0.82"/>
            <path d="M110,110 L22,82 A92,92 0 0,1 110,18 Z" fill="var(--c-sayur)" opacity="0.82"/>
            <circle cx="110" cy="110" r="34" fill="var(--surface-elev)" stroke="var(--c-lemak)" stroke-width="4"/>
            <text x="110" y="106" text-anchor="middle" font-family="var(--f-mono)" font-size="11" font-weight="700" fill="var(--ink)">HARI ${menuHari.hari_ke}</text>
            <text x="110" y="121" text-anchor="middle" font-family="var(--f-mono)" font-size="9.5" fill="var(--ink-2)">${menuHari.energi_kkal} kkal</text>
          </svg>
          <div class="piring-legenda">
            <div class="piring-legenda__item">
              <span class="piring-legenda__dot" style="background:var(--c-pokok);"></span>
              <span>Makanan Pokok</span>
              <span class="piring-legenda__gram">${Math.round(DATA.aturanPolaMakan.porsi_energi.staple * 100)}%</span>
            </div>
            <div class="piring-legenda__item">
              <span class="piring-legenda__dot" style="background:var(--c-hewani);"></span>
              <span>Protein Hewani &amp; Nabati</span>
              <span class="piring-legenda__gram">${Math.round(DATA.aturanPolaMakan.porsi_energi.protein * 100)}%</span>
            </div>
            <div class="piring-legenda__item">
              <span class="piring-legenda__dot" style="background:var(--c-sayur);"></span>
              <span>Sayur &amp; Buah</span>
              <span class="piring-legenda__gram">${Math.round(DATA.aturanPolaMakan.porsi_energi.sayur * 100)}%</span>
            </div>
            <div class="piring-legenda__item">
              <span class="piring-legenda__dot" style="background:var(--c-lemak);"></span>
              <span>Lemak Tambahan</span>
              <span class="piring-legenda__gram">${Math.round(DATA.aturanPolaMakan.porsi_energi.lemak * 100)}%</span>
            </div>
          </div>
        </div>
      </article>

      ${menuHari.slot
        .map((sl) => {
          const judulSlot = sl.kode.startsWith("makan_")
            ? `Makan Utama ${sl.kode.replace("makan_", "#")}`
            : `Selingan ${sl.kode.replace("selingan_", "#")}`;
          return `
            <article class="kartu">
              <div class="kartu__kepala">
                <div>
                  <h2 class="kartu__judul">${judulSlot}</h2>
                  <p class="kartu__sub">Hari ke-${menuHari.hari_ke} · Gram bagian dapat dimakan (matang/siap saji)</p>
                </div>
              </div>
              <div class="belanja-daftar">
                ${sl.item
                  .map((it) => {
                    const atr = PETA_ATRIBUT.get(it.bahan_id);
                    const gz = PETA_GIZI_BAHAN.get(it.bahan_id);
                    const infoPeran = LABEL_PERAN_BAHAN[it.peran] ?? {
                      label: it.peran,
                      warna: "var(--accent)",
                    };
                    const kkal = gz?.per_100g.energi_kkal
                      ? Math.round((gz.per_100g.energi_kkal * it.gram) / 100)
                      : 0;
                    const prot = gz?.per_100g.protein_g
                      ? ((gz.per_100g.protein_g * it.gram) / 100)
                          .toFixed(1)
                          .replace(".", ",")
                      : "0,0";
                    return `
                    <div class="belanja-baris">
                      <div class="belanja-baris__info">
                        <span class="belanja-baris__nama">${atr?.nama ?? it.bahan_id}</span>
                        <span class="belanja-baris__meta">${infoPeran.label} · ${kkal} kkal · Protein ${prot} g</span>
                      </div>
                      <div class="belanja-baris__kanan">
                        <span style="font-family:var(--f-mono);font-weight:700;font-size:var(--fs-sm);color:var(--ink);">
                          ${it.gram} g
                        </span>
                      </div>
                    </div>
                  `;
                  })
                  .join("")}
              </div>
            </article>
          `;
        })
        .join("")}

      ${this.renderKartuAi(
        muatanAiHari,
        `Penjelasan Menu Hari ke-${menuHari.hari_ke}`,
      )}

      ${
        belanja
          ? `
        <article class="kartu">
          <div class="kartu__kepala">
            <div>
              <h2 class="kartu__judul">Daftar Belanja ${pola.hari.length} Hari &amp; Kelas Harga Relatif</h2>
              <p class="kartu__sub">Gram beli dihitung dengan faktor bagian dapat dimakan (rasio beli) dan dibulatkan ke kelipatan 5 g — bukan estimasi harga Rupiah (K-06 &amp; INV-07)</p>
            </div>
            ${lencanaVerif(belanja.label_belum_diverifikasi)}
          </div>
          <div class="studio-kv" style="margin-bottom:8px;">
            <div class="studio-kv__row">
              <span>Bahan Kelas Ekonomis (Murah)</span>
              <span class="studio-kv__val">${belanja.jumlah_per_kelas.murah} bahan</span>
            </div>
            <div class="studio-kv__row">
              <span>Bahan Kelas Menengah (Sedang)</span>
              <span class="studio-kv__val">${belanja.jumlah_per_kelas.sedang} bahan</span>
            </div>
            <div class="studio-kv__row">
              <span>Bahan Kelas Tinggi (Mahal)</span>
              <span class="studio-kv__val">${belanja.jumlah_per_kelas.mahal} bahan</span>
            </div>
          </div>
          <div class="belanja-daftar">
            ${belanja.item
              .map((b) => {
                const kh = LABEL_KELAS_HARGA[b.kelas_harga];
                return `
                  <div class="belanja-baris">
                    <div class="belanja-baris__info">
                      <span class="belanja-baris__nama">${b.nama}</span>
                      <span class="belanja-baris__meta">Disajikan ${b.gram_disajikan} g total (${pola.hari.length} hari)</span>
                    </div>
                    <div class="belanja-baris__kanan">
                      <span style="font-family:var(--f-mono);font-weight:700;font-size:var(--fs-sm);">
                        Beli ~${b.gram_beli} g
                      </span>
                      ${lencanaStatus(kh.tingkat, kh.teks)}
                    </div>
                  </div>
                `;
              })
              .join("")}
          </div>
        </article>
      `
          : ""
      }

      <div class="baris-tombol">
        <button type="button" class="tombol tombol--utama tombol--penuh" data-aksi="buka-layar" data-layar="kolam">
          <span>Lihat Bejana Kecukupan AKG (ASI + MPASI)</span>
          ${ikon("arrowR", 16)}
        </button>
      </div>
    `;
  }

  /* ========================================================================
     05 · LAYAR KOLAM AKG (BEJANA DUAL-STRATA)
     ======================================================================== */
  private layarKolam(r: Ringkasan): string {
    if (r.hasil === "stop") {
      return this.layarTidakLayak(r);
    }
    if (r.rujukan.tingkat === "rujuk" || !r.pola) {
      return this.layarPiring(r);
    }

    const pola = r.pola;
    const idxHari = Math.min(
      Math.max(0, this.state.hariMenuAktif),
      pola.hari.length - 1,
    );
    const menuHari = pola.hari[idxHari] ?? pola.hari[0];
    if (!menuHari) return "";
    const masihAsi = this.state.masukan.pola.masih_asi;
    const persenAsiAsumsi = masihAsi
      ? pola.pita === "6-8"
        ? 65
        : pola.pita === "9-11"
          ? 50
          : 30
      : 0;

    const kunciUtama: {
      zat: KunciZat;
      label: string;
      satuan: string;
      asiKontribPct: number;
    }[] = [
      {
        zat: "protein_g",
        label: "Protein",
        satuan: "g",
        asiKontribPct: masihAsi ? Math.round(persenAsiAsumsi * 0.6) : 0,
      },
      {
        zat: "besi_mg",
        label: "Zat Besi (Fe)",
        satuan: "mg",
        asiKontribPct: masihAsi ? 5 : 0,
      },
      {
        zat: "seng_mg",
        label: "Seng (Zn)",
        satuan: "mg",
        asiKontribPct: masihAsi ? 15 : 0,
      },
      {
        zat: "kalsium_mg",
        label: "Kalsium (Ca)",
        satuan: "mg",
        asiKontribPct: masihAsi ? 40 : 0,
      },
      {
        zat: "vit_a_rae_mcg",
        label: "Vitamin A",
        satuan: "RE/RAE",
        asiKontribPct: masihAsi ? 35 : 0,
      },
      {
        zat: "vit_c_mg",
        label: "Vitamin C",
        satuan: "mg",
        asiKontribPct: masihAsi ? 30 : 0,
      },
    ];

    return `
      <section class="kepala-layar">
        <span class="kepala-layar__eyebrow">Langkah 4 dari 4 · Kecukupan Gizi Harian (Permenkes 28/2019)</span>
        <h1 class="kepala-layar__judul">Bejana Dual-Strata ASI &amp; MPASI</h1>
        <p class="kepala-layar__sub">
          Menampilkan kontribusi MPASI Hari ke-${menuHari.hari_ke} terhadap AKG kelompok <strong>${menuHari.akg.kelompok.replace("_", " ")}</strong>. Zat besi (Fe) dan seng (Zn) pada usia 6–11 bulan hampir seluruhnya harus dipenuhi dari MPASI padat gizi hewani.
        </p>
      </section>

      <article class="kartu">
        <div class="kartu__kepala">
          <div>
            <h2 class="kartu__judul">Enam Bejana Zat Gizi Utama (Hari ke-${menuHari.hari_ke})</h2>
            <p class="kartu__sub">Klaim AKG: <code>${menuHari.akg.klaim_id}</code> · Sumber gizi bahan: USDA SR Legacy (<code>KL-BAHAN-USDA-SRLEGACY</code>)</p>
          </div>
          ${lencanaVerif(menuHari.akg.label_belum_diverifikasi)}
        </div>

        <div class="kolam-grid">
          ${kunciUtama
            .map((ku) => {
              const pz = menuHari.akg.zat.find((z) => z.zat === ku.zat);
              if (!pz) return "";
              const statusBejana = !pz.lengkap
                ? "kosong"
                : pz.pita === "rendah"
                  ? "awas"
                  : pz.pita === "sedang"
                    ? "perlu"
                    : "ok";
              return `
                <div class="bejana" data-status="${statusBejana}">
                  <div class="bejana__atas">
                    <span class="bejana__nama">${ku.label}</span>
                    <span class="bejana__persen">${pz.persen}%</span>
                  </div>
                  <div class="bejana__visual">
                    <canvas
                      class="bejana__kanvas"
                      data-status="${statusBejana}"
                      data-asi="${ku.asiKontribPct}"
                      data-mpasi="${pz.persen}"
                      aria-label="Bejana ${ku.label}: MPASI ${pz.persen}% dari AKG"
                    ></canvas>
                  </div>
                  <div class="bejana__meta">
                    <span>MPASI: <strong>${pz.nilai.toFixed(1).replace(".", ",")}</strong> / ${pz.akg} ${ku.satuan}</span>
                    <span>Status: <strong>${!pz.lengkap ? "Data sebagian" : pz.pita.toUpperCase()}</strong></span>
                  </div>
                </div>
              `;
            })
            .join("")}
        </div>
      </article>

      <article class="kartu">
        <div class="kartu__kepala">
          <div>
            <h2 class="kartu__judul">Tabel Lengkap 23 Zat Gizi Mikro &amp; Makro</h2>
            <p class="kartu__sub">Transparansi sel tidak lengkap &amp; perbedaan satuan RAE vs RE (K-07)</p>
          </div>
        </div>
        <div class="belanja-daftar">
          ${menuHari.akg.zat
            .map((z) => {
              const nama = NAMA_ZAT[z.zat] ?? z.zat;
              const tkt =
                z.pita === "cukup"
                  ? "ok"
                  : z.pita === "sedang"
                    ? "perlu"
                    : "awas";
              return `
                <div class="belanja-baris">
                  <div class="belanja-baris__info">
                    <span class="belanja-baris__nama" style="text-transform:capitalize;">${nama}</span>
                    <span class="belanja-baris__meta">
                      Asupan MPASI: ${z.nilai.toFixed(1).replace(".", ",")} dari target AKG ${z.akg}
                      ${z.satuan_beda ? " · (Catatan: USDA memakai RAE, AKG memakai RE)" : ""}
                      ${!z.lengkap ? " · (Batas bawah: sebagian bahan belum memiliki nilai zat ini)" : ""}
                    </span>
                  </div>
                  <div class="belanja-baris__kanan">
                    ${lencanaStatus(tkt, `${z.persen}% AKG`)}
                  </div>
                </div>
              `;
            })
            .join("")}
        </div>
      </article>

      <div class="baris-tombol">
        <button type="button" class="tombol tombol--utama tombol--penuh" data-aksi="buka-layar" data-layar="kenapa">
          <span>Lihat Alur Penalaran ("Mengapa Rekomendasi Ini?")</span>
          ${ikon("arrowR", 16)}
        </button>
      </div>
    `;
  }

  /* ========================================================================
     06 · LAYAR KENAPA (RANTAI ATURAN DETERMINISTIK)
     ======================================================================== */
  private layarKenapa(r: Ringkasan): string {
    if (r.hasil === "stop") {
      return this.layarTidakLayak(r);
    }

    const s = this.state.masukan.status;
    const st = r.status;
    const ruj = r.rujukan;
    const pola = r.pola;

    return `
      <section class="kepala-layar">
        <span class="kepala-layar__eyebrow">Transparansi Algoritma · Tanpa Kotak Hitam</span>
        <h1 class="kepala-layar__judul">Mengapa Rekomendasi Ini Diberikan?</h1>
        <p class="kepala-layar__sub">
          Setiap kesimpulan NUTRIVA berasal dari rantai aturan deterministik yang dapat diaudit langkah demi langkah.
        </p>
      </section>

      <article class="kartu">
        <div class="kartu__kepala">
          <div>
            <h2 class="kartu__judul">1. Penentuan Usia Bulan Penuh &amp; Koreksi Posisi</h2>
            <p class="kartu__sub">Fungsi murni: <code>hitungStatus()</code> di <code>src/engine/antropometri.ts</code></p>
          </div>
          ${lencanaStatus("ok", `${st.usia_bulan_penuh} Bulan Penuh`)}
        </div>
        <p style="font-size:var(--fs-xs);color:var(--ink-2);line-height:1.55;">
          Sesuai standar WHO 2006 dan Permenkes 2/2020, sisa <strong>${s.umur.hari} hari</strong> tidak pernah membulatkan bulan ke atas, sehingga tabel yang dipakai adalah <strong>${st.usia_bulan_penuh} bulan penuh</strong>. Panjang badan yang dimasukkan (${s.pb_cm} cm, cara ukur <strong>${s.cara_ukur}</strong>) menjadi <strong>${st.panjang_dipakai_cm} cm</strong>.
        </p>
      </article>

      <article class="kartu">
        <div class="kartu__kepala">
          <div>
            <h2 class="kartu__judul">2. Pembacaan Pita Tabel Baku (BB/U, PB/U, BB/PB)</h2>
            <p class="kartu__sub">Klaim: <code>${st.bbu.klaim_id}</code>, <code>${st.pbu.klaim_id}</code>, <code>${st.bbpb.klaim_id}</code></p>
          </div>
          ${lencanaVerif(st.bbu.label_belum_diverifikasi || st.pbu.label_belum_diverifikasi || st.bbpb.label_belum_diverifikasi)}
        </div>
        <p style="font-size:var(--fs-xs);color:var(--ink-2);line-height:1.55;">
          Mesin membandingkan ukuran anak terhadap 7 kolom garis SD (-3, -2, -1, Median, +1, +2, +3 SD) dan menghasilkan:
          <br/>• <strong>BB/U:</strong> ${LABEL_BBU[st.bbu.kategori]} (${labelPosisiPita(st.bbu.posisi)})
          <br/>• <strong>PB/U:</strong> ${LABEL_PBU[st.pbu.kategori]} (${labelPosisiPita(st.pbu.posisi)})
          <br/>• <strong>BB/PB:</strong> ${LABEL_BBPB[st.bbpb.kategori]} (${labelPosisiPita(st.bbpb.posisi)})
        </p>
      </article>

      <article class="kartu">
        <div class="kartu__kepala">
          <div>
            <h2 class="kartu__judul">3. Gerbang Keselamatan &amp; Tindak Lanjut</h2>
            <p class="kartu__sub">Fungsi murni: <code>tentukanTingkat()</code> di <code>src/engine/rujukan.ts</code></p>
          </div>
          ${lencanaStatus(ruj.tingkat === "rujuk" ? "awas" : ruj.tingkat === "perhatian" ? "perlu" : "ok", `Tingkat: ${ruj.tingkat.toUpperCase()}`)}
        </div>
        <p style="font-size:var(--fs-xs);color:var(--ink-2);line-height:1.55;">
          ${
            ruj.alasan.length > 0
              ? `Pemicu terdeteksi: <code>${ruj.alasan.join(", ")}</code>.`
              : "Tidak ditemukan tanda bahaya klinis maupun kategori antropometri yang memicu rujukan/perhatian khusus."
          }
        </p>
      </article>

      ${
        pola
          ? `
        <article class="kartu">
          <div class="kartu__kepala">
            <div>
              <h2 class="kartu__judul">4. Penyusunan Menu &amp; Daftar Belanja</h2>
              <p class="kartu__sub">Fungsi murni: <code>bangunPola()</code> &amp; <code>buatDaftarBelanja()</code></p>
            </div>
            ${lencanaVerif(pola.label_belum_diverifikasi)}
          </div>
          <p style="font-size:var(--fs-xs);color:var(--ink-2);line-height:1.55;">
            Untuk kelompok usia <strong>${LABEL_PITA[pola.pita]}</strong>, mesin menyusun ${pola.hari.length} hari menu menggunakan PRNG deterministik berbenih <code>${pola.benih}</code>, menyaring alergen (<code>${this.state.masukan.pola.hindari.join(", ") || "tidak ada"}</code>), membatasi frekuensi hati maksimal 1 kali sepekan, dan mengonversi gram saji ke gram beli menggunakan faktor rasio beli.
          </p>
        </article>
      `
          : ""
      }

      ${
        ruj.tingkat !== "rujuk"
          ? this.renderKartuAi(
              r.muatan_ai_status,
              "Ringkasan Edukasi (AI / Templat)",
            )
          : ""
      }

      <div class="baris-tombol">
        <button type="button" class="tombol tombol--sekunder tombol--penuh" data-aksi="buka-layar" data-layar="ahli">
          ${ikon("audit", 15)}
          <span>Buka Buku Besar Klaim &amp; Sumber (Mode Audit)</span>
        </button>
      </div>
    `;
  }

  /* ========================================================================
     07 · LAYAR BAHAYA (RUJUKAN WAJIB — AI & MENU DINONAKTIFKAN)
     ======================================================================== */
  private layarBahaya(r: Ringkasan): string {
    const alasan =
      r.hasil === "ok" && r.rujukan.alasan.length > 0
        ? r.rujukan.alasan
        : ["simulasi_mode_rujukan_wajib"];

    return `
      <section class="kepala-layar">
        <span class="kepala-layar__eyebrow" style="color:var(--danger);">Gerbang Keselamatan Klinis · K-04 &amp; K-08</span>
        <h1 class="kepala-layar__judul">Segera Bawa Anak ke Fasilitas Kesehatan</h1>
        <p class="kepala-layar__sub">
          NUTRIVA menghentikan rekomendasi menu MPASI mandiri dan menonaktifkan penjelas AI karena ditemukan tanda bahaya atau status gizi yang memerlukan pemeriksaan tenaga kesehatan secara langsung.
        </p>
      </section>

      <article class="kartu kartu--bahaya" role="alert">
        <div class="kartu__kepala">
          <div>
            <h2 class="kartu__judul">${ikon("bahaya", 18)} Pemicu Rujukan yang Terdeteksi</h2>
            <p class="kartu__sub">Aturan konservatif: <code>KL-ASUMSI-RUJUKAN</code></p>
          </div>
          ${lencanaVerif(DATA.aturanRujukan.label_belum_diverifikasi)}
        </div>
        <ul style="margin:0;padding-left:18px;font-size:var(--fs-sm);color:var(--ink);line-height:1.6;">
          ${alasan.map((a) => `<li><code>${a}</code></li>`).join("")}
        </ul>
      </article>

      <article class="kartu">
        <div class="kartu__kepala">
          <div>
            <h2 class="kartu__judul">Langkah Pertolongan &amp; Persiapan Rujukan</h2>
            <p class="kartu__sub">Panduan komunikasi untuk ibu/pengasuh dan kader Posyandu</p>
          </div>
        </div>
        <ol style="margin:0;padding-left:18px;font-size:var(--fs-xs);color:var(--ink-2);line-height:1.65;">
          <li><strong>Jangan tunda kunjungan:</strong> Segera menuju Puskesmas, IGD rumah sakit, atau bidan/dokter terdekat hari ini.</li>
          <li><strong>Bawa Buku KIA (KMS):</strong> Tunjukkan catatan berat badan, panjang badan, dan riwayat keluhan anak kepada petugas.</li>
          <li><strong>Pertahankan cairan / ASI:</strong> Bila anak masih sadar dan mampu menelan, tetap berikan ASI sedikit demi sedikit selama perjalanan.</li>
          <li><strong>Jangan memberikan obat/suplemen dosis tinggi tanpa resep:</strong> Penanganan gizi buruk atau tanda bahaya memerlukan protokol klinis resmi (Tata Laksana Gizi Buruk Kemenkes).</li>
        </ol>
      </article>

      <div class="baris-tombol">
        <a class="tombol tombol--bahaya tombol--penuh" href="tel:119" style="text-decoration:none;">
          ${ikon("phone", 16)}
          <span>Hubungi Layanan Darurat Kesehatan 119</span>
        </a>
        <button type="button" class="tombol tombol--sekunder tombol--penuh" data-aksi="buka-layar" data-layar="profil">
          ${ikon("arrowL", 15)}
          <span>Kembali ke Skrining &amp; Masukan</span>
        </button>
      </div>
    `;
  }

  /* ========================================================================
     08 · LAYAR AHLI (JEJAK AUDIT, KLAIM, DAN SUMBER RESMI)
     ======================================================================== */
  private layarAhli(r: Ringkasan): string {
    return `
      <section class="kepala-layar">
        <span class="kepala-layar__eyebrow">Buku Besar Verifikasi · K-01 s.d. K-13</span>
        <h1 class="kepala-layar__judul">Jejak Audit Mesin, Klaim, &amp; Sumber Primer</h1>
        <p class="kepala-layar__sub">
          Menampilkan versi mesin deterministik, status verifikasi setiap klaim ilmiah di <code>data/claims.json</code>, dan daftar pustaka primer di <code>data/sources.json</code>.
        </p>
      </section>

      <article class="kartu">
        <div class="kartu__kepala">
          <div>
            <h2 class="kartu__judul">Cap Versi &amp; Jejak Fasad Deterministik</h2>
            <p class="kartu__sub">Dihasilkan murni oleh <code>ringkasan()</code> di <code>src/app/fasad.ts</code></p>
          </div>
          ${lencanaStatus("info", r.hasil === "ok" ? `Engine v${r.versi.engine}` : `Engine v${r.engine_version}`)}
        </div>
        <div class="studio-kv">
          <div class="studio-kv__row">
            <span>engine_version / data_version</span>
            <span class="studio-kv__val">${r.hasil === "ok" ? `${r.versi.engine} / ${r.versi.data}` : `${r.engine_version} / ${r.data_version}`}</span>
          </div>
          <div class="studio-kv__row">
            <span>Metode Antropometri</span>
            <span class="studio-kv__val">Pencocokan Pita SD Tabel Baku (Tanpa LMS Kontinu)</span>
          </div>
          <div class="studio-kv__row">
            <span>Metode Perencanaan Menu</span>
            <span class="studio-kv__val">Aturan Porsi &amp; PRNG Berbenih (Tanpa Solver LP)</span>
          </div>
        </div>
      </article>

      <article class="kartu">
        <div class="kartu__kepala">
          <div>
            <h2 class="kartu__judul">Daftar Sumber Primer (${sumberData.sumber.length} Dokumen)</h2>
            <p class="kartu__sub">Berkas <code>data/sources.json</code> v${sumberData.versi}</p>
          </div>
        </div>
        <div class="belanja-daftar">
          ${sumberData.sumber
            .map(
              (s) => `
            <div class="belanja-baris">
              <div class="belanja-baris__info">
                <span class="belanja-baris__nama"><code>${s.id}</code> — ${s.judul}</span>
                <span class="belanja-baris__meta">${s.penerbit} · Edisi: ${s.edisi} · Lisensi: ${s.lisensi}</span>
              </div>
              <div class="belanja-baris__kanan">
                ${lencanaStatus("info", `Tingkat ${s.tingkat}`)}
              </div>
            </div>
          `,
            )
            .join("")}
        </div>
      </article>

      <article class="kartu">
        <div class="kartu__kepala">
          <div>
            <h2 class="kartu__judul">Buku Besar Klaim (${klaimData.klaim.length} Klaim)</h2>
            <p class="kartu__sub">Berkas <code>data/claims.json</code> v${klaimData.versi}</p>
          </div>
        </div>
        <div class="belanja-daftar">
          ${klaimData.klaim
            .map((kl) => {
              const tkt =
                kl.status === "terverifikasi"
                  ? "ok"
                  : kl.status === "dikarantina"
                    ? "awas"
                    : "perlu";
              return `
                <div class="belanja-baris">
                  <div class="belanja-baris__info">
                    <span class="belanja-baris__nama"><code>${kl.id}</code> (${kl.tipe})</span>
                    <span class="belanja-baris__meta">${kl.pernyataan}</span>
                  </div>
                  <div class="belanja-baris__kanan">
                    ${lencanaStatus(tkt, kl.status)}
                  </div>
                </div>
              `;
            })
            .join("")}
        </div>
      </article>
    `;
  }

  /* ========================================================================
     09 · LAYAR TENTANG & LISENSI FONT
     ======================================================================== */
  private layarTentang(): string {
    const elLisensi =
      typeof document !== "undefined"
        ? document.getElementById("lisensi-font")
        : null;
    const teksLisensi = elLisensi?.textContent?.trim() ?? "SIL Open Font License 1.1";

    return `
      <section class="kepala-layar">
        <span class="kepala-layar__eyebrow">Dokumentasi Akademik &amp; Kepatuhan Lisensi</span>
        <h1 class="kepala-layar__judul">Tentang NUTRIVA (V-PJBL 2026)</h1>
        <p class="kepala-layar__sub">
          Prototipe akademik alat bantu edukasi dan perencanaan MPASI deterministik untuk anak usia 6 sampai 23 bulan.
        </p>
      </section>

      <article class="kartu kartu--aksen">
        <div class="kartu__kepala">
          <div>
            <h2 class="kartu__judul">Batas Tanggung Jawab &amp; Ruang Lingkup</h2>
            <p class="kartu__sub">Wajib tampil pada setiap rilis</p>
          </div>
        </div>
        <p style="font-size:var(--fs-xs);color:var(--ink-2);line-height:1.55;">
          <strong>${LABEL_PROTOTIPE}.</strong> Aplikasi ini tidak melakukan diagnosis medis, tidak menghitung rumus Z-score kontinu di luar tabel pita baku, tidak meresepkan dosis suplemen/obat, dan selalu mengutamakan rujukan ke fasilitas kesehatan bila ditemukan tanda bahaya.
        </p>
      </article>

      <article class="kartu">
        <div class="kartu__kepala">
          <div>
            <h2 class="kartu__judul">Pernyataan Privasi Penjelas AI Opsional</h2>
            <p class="kartu__sub">Sesuai K-08 &amp; ADR-0003</p>
          </div>
        </div>
        <p style="font-size:var(--fs-xs);color:var(--ink-2);line-height:1.55;">
          ${PERNYATAAN_PRIVASI_AI}
        </p>
      </article>

      <article class="kartu">
        <div class="kartu__kepala">
          <div>
            <h2 class="kartu__judul">Tipografi Tertanam &amp; Lisensi SIL OFL 1.1</h2>
            <p class="kartu__sub">Atkinson Hyperlegible Next, Atkinson Hyperlegible Mono, Instrument Serif, Bricolage Grotesque</p>
          </div>
          <button type="button" class="tombol tombol--sekunder tombol--kecil" data-aksi="toggle-lisensi-font">
            <span>${this.state.tampilkanLisensiFont ? "Sembunyikan Teks Lisensi" : "Tampilkan Teks Lisensi"}</span>
          </button>
        </div>
        ${
          this.state.tampilkanLisensiFont
            ? `<pre style="white-space:pre-wrap;font-family:var(--f-mono);font-size:10px;background:var(--bg-2);padding:10px;border-radius:var(--r-sm);max-height:240px;overflow:auto;">${teksLisensi}</pre>`
            : `<p style="font-size:var(--fs-xs);color:var(--ink-3);">Seluruh fon tertanam secara lokal di berkas gaya aplikasi di bawah lisensi SIL Open Font License 1.1 (tersedia di elemen <code>#lisensi-font</code>).</p>`
        }
      </article>
    `;
  }

  /* ========================================================================
     10 · LAYAR KARTU BAGI POSYANDU (TANPA NAMA ANAK PRIBADI)
     ======================================================================== */
  private layarKartuBagi(r: Ringkasan): string {
    const s = this.state.masukan.status;
    return `
      <section class="kepala-layar">
        <span class="kepala-layar__eyebrow">Ringkasan Cetak / Tangkapan Layar · INV-17</span>
        <h1 class="kepala-layar__judul">Kartu Ringkasan Edukasi Posyandu</h1>
        <p class="kepala-layar__sub">
          Ringkasan satu halaman tanpa nama pribadi anak atau alamat rumah agar aman dibagikan saat diskusi edukasi.
        </p>
      </section>

      <article class="kartu kartu--aksen">
        <div class="kartu__kepala">
          <div>
            <h2 class="kartu__judul">${this.labelKasusAktif()}</h2>
            <p class="kartu__sub">${LABEL_PROTOTIPE}</p>
          </div>
          ${lencanaStatus("info", `${s.umur.bulan} bln ${s.umur.hari} hr`)}
        </div>
        ${
          r.hasil === "ok"
            ? `
          <div class="studio-kv">
            <div class="studio-kv__row">
              <span>Kategori BB/U</span>
              <span class="studio-kv__val">${LABEL_BBU[r.status.bbu.kategori]} (${labelPosisiPita(r.status.bbu.posisi)})</span>
            </div>
            <div class="studio-kv__row">
              <span>Kategori PB/U</span>
              <span class="studio-kv__val">${LABEL_PBU[r.status.pbu.kategori]} (${labelPosisiPita(r.status.pbu.posisi)})</span>
            </div>
            <div class="studio-kv__row">
              <span>Kategori BB/PB</span>
              <span class="studio-kv__val">${LABEL_BBPB[r.status.bbpb.kategori]} (${labelPosisiPita(r.status.bbpb.posisi)})</span>
            </div>
            <div class="studio-kv__row">
              <span>Tingkat Tindak Lanjut</span>
              <span class="studio-kv__val">${r.rujukan.tingkat.toUpperCase()}</span>
            </div>
          </div>
        `
            : `<p style="font-size:var(--fs-xs);">Masukan berada di luar cakupan (${r.alasan}).</p>`
        }
      </article>
    `;
  }

  /* ========================================================================
     11–18 · LAYAR KEADAAN SESI & PENANGANAN BATAS
     ======================================================================== */
  private layarKosong(): string {
    return `
      <section class="kepala-layar">
        <span class="kepala-layar__eyebrow">Keadaan Sesi · Belum Ada Masukan</span>
        <h1 class="kepala-layar__judul">Belum Ada Data Pengukuran Aktif</h1>
        <p class="kepala-layar__sub">
          Masukkan usia (6–23 bulan), berat badan, dan panjang badan anak, atau pilih salah satu kasus uji sintetis untuk memulai.
        </p>
      </section>
      <div class="baris-tombol">
        <button type="button" class="tombol tombol--utama tombol--penuh" data-aksi="pilih-preset" data-preset="A">
          <span>Muat Kasus Sintetis A (9 Bulan · Normal)</span>
        </button>
        <button type="button" class="tombol tombol--sekunder tombol--penuh" data-aksi="buka-layar" data-layar="profil">
          <span>Buka Formulir Masukan</span>
        </button>
      </div>
    `;
  }

  private layarMemuat(): string {
    return `
      <section class="kepala-layar">
        <span class="kepala-layar__eyebrow">Keadaan Sesi · Memproses</span>
        <h1 class="kepala-layar__judul">Menyiapkan Ringkasan Deterministik</h1>
        <p class="kepala-layar__sub">
          Mesin inti menghitung pita antropometri dan susunan MPASI secara instan di memori perangkat; jika penjelas AI diminta, aplikasi menghubungi proxy Worker dengan tenggat 8 detik sebelum beralih otomatis ke templat deterministik.
        </p>
      </section>
      <article class="kartu">
        <p style="font-family:var(--f-mono);font-size:var(--fs-xs);color:var(--ink-3);">
          Status: Mesin deterministik siap · Penjelas templat cadangan siap.
        </p>
        <button type="button" class="tombol tombol--utama tombol--penuh" data-aksi="buka-layar" data-layar="status">
          <span>Kembali ke Layar Status</span>
        </button>
      </article>
    `;
  }

  private layarLuring(): string {
    return `
      <section class="kepala-layar">
        <span class="kepala-layar__eyebrow">Konektivitas Jujur · K-09 &amp; K-12</span>
        <h1 class="kepala-layar__judul">Mode Kerja Luring &amp; Penjelas Cadangan</h1>
        <p class="kepala-layar__sub">
          Penjelasan transparan mengenai bagian aplikasi yang berjalan luring di perangkat dan bagian opsional yang memerlukan koneksi jaringan.
        </p>
      </section>
      <article class="kartu kartu--aksen">
        <div class="kartu__kepala">
          <div>
            <h2 class="kartu__judul">${ikon("offline", 16)} Mesin Deterministik Berjalan Tanpa Jaringan</h2>
            <p class="kartu__sub">Ditembolok oleh Service Worker (<code>sw.js</code>)</p>
          </div>
          ${lencanaStatus("ok", "Inti Luring Siap")}
        </div>
        <p style="font-size:var(--fs-xs);color:var(--ink-2);line-height:1.55;">
          Setelah halaman dimuat pertama kali, seluruh tabel standar antropometri WHO/Kemenkes, tabel AKG, data gizi bahan pangan, skrining rujukan, generator menu MPASI, dan penjelasan templat deterministik tersedia di perangkat tanpa memerlukan sinyal internet.
        </p>
      </article>
      <article class="kartu">
        <div class="kartu__kepala">
          <div>
            <h2 class="kartu__judul">${ikon("spark", 16)} Penjelas AI Opsional Memerlukan Jaringan</h2>
            <p class="kartu__sub">Otomatis beralih ke <code>penjelasanTemplat()</code> saat luring</p>
          </div>
          ${lencanaStatus("info", "Fallback Otomatis")}
        </div>
        <p style="font-size:var(--fs-xs);color:var(--ink-2);line-height:1.55;">
          Apabila perangkat sedang tidak terhubung ke internet atau proxy Worker AI tidak dapat dijangkau, NUTRIVA secara otomatis menampilkan penjelasan dari templat deterministik berbahasa Indonesia yang telah tervalidasi.
        </p>
      </article>
    `;
  }

  private layarKedaluwarsa(): string {
    return `
      <section class="kepala-layar">
        <span class="kepala-layar__eyebrow">Pengingat Pemantauan Pertumbuhan</span>
        <h1 class="kepala-layar__judul">Gunakan Ukuran Timbangan Terbaru</h1>
        <p class="kepala-layar__sub">
          Pertumbuhan bayi 6–23 bulan berlangsung cepat. Pastikan angka berat badan dan panjang badan yang dimasukkan berasal dari penimbangan Posyandu atau Puskesmas dalam 30 hari terakhir.
        </p>
      </section>
      <button type="button" class="tombol tombol--utama tombol--penuh" data-aksi="buka-layar" data-layar="profil">
        <span>Perbarui Angka Ukuran di Layar Profil</span>
      </button>
    `;
  }

  private layarGalat(r: Ringkasan): string {
    const alasan = r.hasil === "stop" ? r.alasan : "rentang_ukuran_tidak_valid";
    return `
      <section class="kepala-layar">
        <span class="kepala-layar__eyebrow">Validasi Masukan Antropometri</span>
        <h1 class="kepala-layar__judul">Ukuran di Luar Rentang Tabel Baku</h1>
        <p class="kepala-layar__sub">
          Mesin menghentikan perhitungan dengan kode alasan: <code>${alasan}</code>.
        </p>
      </section>
      <article class="kartu">
        <p style="font-size:var(--fs-xs);color:var(--ink-2);line-height:1.55;">
          Tabel BB/PB WHO untuk usia di bawah 24 bulan mencakup panjang badan terlentang antara <strong>45,0 cm sampai 110,0 cm</strong> dan berat badan positif. Periksa kembali apakah satuan yang dimasukkan sudah dalam kilogram (kg) dan sentimeter (cm).
        </p>
        <div class="baris-tombol">
          <button type="button" class="tombol tombol--utama tombol--penuh" data-aksi="buka-layar" data-layar="profil">
            <span>Perbaiki Masukan di Layar Profil</span>
          </button>
          <button type="button" class="tombol tombol--sekunder tombol--penuh" data-aksi="pilih-preset" data-preset="A">
            <span>Kembalikan ke Kasus Sintetis A</span>
          </button>
        </div>
      </article>
    `;
  }

  private layarTidakLayak(r: Ringkasan): string {
    const s = this.state.masukan.status;
    const alasan =
      r.hasil === "stop"
        ? r.alasan
        : s.umur.bulan < 6
          ? "usia_di_bawah_6_bulan"
          : "usia_24_bulan_atau_lebih_di_luar_cakupan";

    return `
      <section class="kepala-layar">
        <span class="kepala-layar__eyebrow">Batas Cakupan Usia · K-01 &amp; INV-05</span>
        <h1 class="kepala-layar__judul">Usia di Luar Cakupan MPASI 6–23 Bulan</h1>
        <p class="kepala-layar__sub">
          Kode penghentian mesin: <code>${alasan}</code> (Usia masukan: ${s.umur.bulan} bulan ${s.umur.hari} hari).
        </p>
      </section>
      <article class="kartu kartu--aksen">
        <p style="font-size:var(--fs-xs);color:var(--ink-2);line-height:1.6;">
          ${
            s.umur.bulan < 6
              ? "Untuk bayi berusia <strong>di bawah 6 bulan (0–5 bulan)</strong>, anjuran resmi Kementerian Kesehatan RI dan WHO adalah pemberian <strong>ASI Eksklusif</strong> tanpa makanan atau minuman tambahan kecuali atas indikasi medis dokter."
              : "Untuk anak berusia <strong>24 bulan atau lebih</strong>, anak telah beralih ke pola makanan keluarga gizi seimbang penuh dan menggunakan tabel Tinggi Badan menurut Umur (TB/U) berdiri."
          }
        </p>
        <div class="baris-tombol">
          <button type="button" class="tombol tombol--utama tombol--penuh" data-aksi="pilih-preset" data-preset="A">
            <span>Muat Kasus Sintetis A (9 Bulan)</span>
          </button>
          <button type="button" class="tombol tombol--sekunder tombol--penuh" data-aksi="buka-layar" data-layar="profil">
            <span>Ubah Usia di Layar Profil</span>
          </button>
        </div>
      </article>
    `;
  }

  private layarDataTidakAda(): string {
    return `
      <section class="kepala-layar">
        <span class="kepala-layar__eyebrow">Kejujuran Data Gizi · K-07 &amp; INV-09</span>
        <h1 class="kepala-layar__judul">Transparansi Sel Zat Gizi yang Belum Lengkap</h1>
        <p class="kepala-layar__sub">
          Bagaimana NUTRIVA memperlakukan nilai mikronutrien yang belum tercatat pada sebagian bahan pangan.
        </p>
      </section>
      <article class="kartu">
        <p style="font-size:var(--fs-xs);color:var(--ink-2);line-height:1.55;">
          Apabila suatu bahan pangan belum memiliki nilai terukur untuk zat gizi tertentu di basis data rujukan, mesin NUTRIVA <strong>tidak pernah mengarang angka nol palsu sebagai kepastian</strong>. Sebaliknya, mesin menandai <code>lengkap: false</code> pada zat tersebut, melaporkan total yang ada sebagai batas bawah, dan merender kristal kering pada bejana visual agar pengguna dan peneliti mengetahui adanya celah data sumber.
        </p>
        <button type="button" class="tombol tombol--sekunder tombol--penuh" data-aksi="buka-layar" data-layar="kolam">
          <span>Kembali ke Layar Kolam AKG</span>
        </button>
      </article>
    `;
  }

  private layarHapus(): string {
    return `
      <section class="kepala-layar">
        <span class="kepala-layar__eyebrow">Arsitektur Tanpa Jejak · ADR-0003 &amp; INV-16</span>
        <h1 class="kepala-layar__judul">Reset Memori Sesi ke Keadaan Awal</h1>
        <p class="kepala-layar__sub">
          NUTRIVA tidak menyimpan data ukuran maupun identitas anak di penyimpanan permanen peramban maupun di server.
        </p>
      </section>
      <article class="kartu">
        <div class="kartu__kepala">
          <div>
            <h2 class="kartu__judul">${ikon("trash", 16)} Bersihkan Variabel Sesi di Memori</h2>
            <p class="kartu__sub">Mengembalikan seluruh masukan ke Kasus Sintetis A</p>
          </div>
          ${lencanaStatus("ok", "Memori RAM Saja")}
        </div>
        <p style="font-size:var(--fs-xs);color:var(--ink-2);line-height:1.55;">
          Seluruh masukan yang Anda ubah selama sesi ini hanya hidup di variabel memori JavaScript sementara dan hilang secara otomatis ketika tab peramban ditutup. Tekan tombol di bawah jika Anda ingin mereset sesi sekarang juga untuk simulasi kasus berikutnya.
        </p>
        <button type="button" class="tombol tombol--utama tombol--penuh" data-aksi="reset-sesi">
          ${ikon("trash", 15)}
          <span>Reset Sesi ke Awal (Kasus Sintetis A)</span>
        </button>
      </article>
    `;
  }

  /* ========================================================================
     EVENT DELEGATION
     ======================================================================== */
  private ikatDelegasiKlik(): void {
    this.akar.addEventListener("click", (ev) => {
      const target = (ev.target as HTMLElement | null)?.closest<HTMLElement>(
        "[data-aksi]",
      );
      if (!target) return;
      const aksi = target.dataset.aksi;

      switch (aksi) {
        case "buka-layar": {
          const id = target.dataset.layar as IdLayar | undefined;
          if (id) this.bukaLayar(id);
          break;
        }
        case "pilih-preset": {
          const kode = target.dataset.preset as KodePreset | undefined;
          if (kode && PRESET_SINTETIS[kode]) {
            this.pilihPreset(kode);
          }
          break;
        }
        case "pilih-peran": {
          const peran = target.dataset.peran as PeranRona | undefined;
          if (peran) this.aturPeran(peran);
          break;
        }
        case "pilih-tema": {
          const tema = target.dataset.tema as TemaRona | undefined;
          if (tema) this.aturTema(tema);
          break;
        }
        case "set-jk": {
          const jk = target.dataset.jk;
          if (jk === "L" || jk === "P") {
            this.state.presetAktif = "KUSTOM";
            this.state.masukan.status.jk = jk;
            this.perbaruiTampilan();
          }
          break;
        }
        case "set-cara-ukur": {
          const cara = target.dataset.cara;
          if (cara === "terlentang" || cara === "berdiri") {
            this.state.presetAktif = "KUSTOM";
            this.state.masukan.status.cara_ukur = cara;
            this.perbaruiTampilan();
          }
          break;
        }
        case "toggle-asi": {
          this.state.presetAktif = "KUSTOM";
          this.state.masukan.pola.masih_asi =
            !this.state.masukan.pola.masih_asi;
          this.perbaruiTampilan();
          break;
        }
        case "toggle-hati": {
          this.state.presetAktif = "KUSTOM";
          this.state.masukan.pola.izinkan_hati =
            !this.state.masukan.pola.izinkan_hati;
          this.perbaruiTampilan();
          break;
        }
        case "toggle-alergen": {
          const kode = target.dataset.alergen;
          if (!kode) break;
          this.state.presetAktif = "KUSTOM";
          const daftar = this.state.masukan.pola.hindari;
          const idx = daftar.indexOf(kode);
          if (idx >= 0) daftar.splice(idx, 1);
          else daftar.push(kode);
          this.perbaruiTampilan();
          break;
        }
        case "lanjut-dari-profil": {
          const r = this.hitungRingkasan();
          if (r.hasil === "stop") {
            this.bukaLayar(
              r.alasan === "berat_tidak_valid" ||
                r.alasan === "panjang_di_luar_tabel"
                ? "galat"
                : "tidakLayak",
            );
          } else if (r.rujukan.tingkat === "rujuk") {
            this.bukaLayar("bahaya");
          } else {
            this.bukaLayar("status");
          }
          break;
        }
        case "pilih-hari-menu": {
          const h = Number(target.dataset.hari);
          if (Number.isInteger(h) && h >= 0) {
            this.state.hariMenuAktif = h;
            this.perbaruiTampilan();
          }
          break;
        }
        case "ganti-benih": {
          this.state.indeksVariasi += 1;
          const basis =
            this.state.presetAktif === "KUSTOM"
              ? "kustom"
              : this.state.presetAktif.toLowerCase();
          this.state.masukan.pola.benih = `rona-sintetis-${basis}${this.state.indeksVariasi}`;
          this.perbaruiTampilan();
          break;
        }
        case "minta-ai": {
          const r = this.hitungRingkasan();
          if (r.hasil !== "ok" || r.rujukan.tingkat === "rujuk") break;
          const muatan =
            this.state.layar === "piring"
              ? (r.muatan_ai_menu[this.state.hariMenuAktif] ??
                r.muatan_ai_status)
              : r.muatan_ai_status;
          if (muatan) {
            void this.picuPenjelasanAi(muatan);
          }
          break;
        }
        case "toggle-lisensi-font": {
          this.state.tampilkanLisensiFont = !this.state.tampilkanLisensiFont;
          this.perbaruiTampilan();
          break;
        }
        case "reset-sesi": {
          this.resetSesiKeAwal();
          break;
        }
      }
    });

    this.akar.addEventListener("change", (ev) => {
      const target = ev.target as HTMLElement | null;
      if (!target) return;

      if (
        target instanceof HTMLSelectElement &&
        target.dataset.aksi === "loncat-layar-select"
      ) {
        this.bukaLayar(target.value as IdLayar);
        return;
      }

      if (
        target instanceof HTMLInputElement &&
        target.dataset.aksi === "toggle-bahaya"
      ) {
        const kode = target.dataset.kode;
        if (!kode) return;
        this.state.presetAktif = "KUSTOM";
        const tb = this.state.masukan.tanda_bahaya;
        const idx = tb.indexOf(kode);
        if (target.checked && idx < 0) tb.push(kode);
        else if (!target.checked && idx >= 0) tb.splice(idx, 1);
        this.perbaruiTampilan();
        return;
      }

      if (target instanceof HTMLInputElement && target.dataset.input) {
        const jenis = target.dataset.input;
        const nilai = Number(target.value);
        if (!Number.isFinite(nilai)) return;
        this.state.presetAktif = "KUSTOM";
        if (jenis === "umur-bulan") {
          this.state.masukan.status.umur.bulan = Math.max(
            0,
            Math.round(nilai),
          );
        } else if (jenis === "umur-hari") {
          this.state.masukan.status.umur.hari = Math.max(
            0,
            Math.min(30, Math.round(nilai)),
          );
        } else if (jenis === "bb-kg") {
          this.state.masukan.status.bb_kg = Math.max(0.5, nilai);
        } else if (jenis === "pb-cm") {
          this.state.masukan.status.pb_cm = Math.max(30, nilai);
        }
        this.perbaruiTampilan();
      }
    });
  }
}
