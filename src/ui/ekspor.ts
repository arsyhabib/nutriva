import type { Ringkasan, MasukanRingkasan } from "../app/fasad";
import { LABEL_BBPB, LABEL_BBU, LABEL_CELAH, LABEL_PBU, LABEL_PITA, NAMA_ZAT, PERNYATAAN_PRIVASI_AI } from "../ai/glosarium";
import { renderMarkdown } from "../ai/markdown";
import { posisiKePersenPin } from "./ikon";
import { DATA } from "../engine/data";
import klaimData from "../../data/claims.json";
import sumberData from "../../data/sources.json";

/**
 * Ekspor dokumen: bagian-bagian aplikasi disusun menjadi blok murni (string masuk, blok keluar), lalu
 * ekspor-tata.ts membaginya ke halaman dengan mengukur isi sebenarnya, jadi hasilnya sama di semua ukuran layar.
 * Modul ini tidak menyentuh DOM, jaringan, jam, atau acak, sehingga bisa diuji tanpa peramban.
 */
export type BagianId = "sesi" | "profil" | "status" | "rujukan" | "menu" | "belanja" | "gizi" | "kenapa" | "ahli" | "tentang" | "kartu" | "poster" | "resep" | "penjelas";
export type Kertas = "A4" | "F4";

export interface InfoBagian {
  id: BagianId;
  nama: string;
  sub: string;
  /** Halaman aplikasi asal bagian ini. */
  asal: string;
  syarat: "data" | "menu" | "rujuk" | "resep" | null;
}

export const DAFTAR_BAGIAN: readonly InfoBagian[] = [
  { id: "sesi", nama: "Ringkasan sesi", sub: "Satu halaman: data, hasil, menu, resep, dan versi mesin", asal: "Seluruh sesi", syarat: "data" },
  { id: "profil", nama: "Profil dan ukuran", sub: "Data anak, ukuran, dan pilihan menu", asal: "Profil", syarat: "data" },
  { id: "status", nama: "Status pertumbuhan", sub: "Tiga indikator dengan pita standar dan penjelasan", asal: "Peta Pertumbuhan", syarat: "data" },
  { id: "rujukan", nama: "Lembar rujukan", sub: "Alasan rujukan dan yang perlu dibawa", asal: "Rujukan", syarat: "rujuk" },
  { id: "menu", nama: "Menu harian", sub: "Rencana menu semua hari, per waktu makan", asal: "Sajian", syarat: "menu" },
  { id: "resep", nama: "Resep dan ilustrasi AI", sub: "Resep yang dibuat di sesi ini, lengkap dengan gambar", asal: "Sajian", syarat: "resep" },
  { id: "belanja", nama: "Daftar belanja", sub: "Dikelompokkan per jenis, dengan kotak centang", asal: "Sajian", syarat: "menu" },
  { id: "gizi", nama: "Kecukupan gizi", sub: "Persen AKG per zat gizi untuk setiap hari menu", asal: "Bejana", syarat: "menu" },
  { id: "penjelas", nama: "Penjelasan sederhana", sub: "Penjelasan status dan menu per hari (AI atau teks cadangan)", asal: "Peta Pertumbuhan, Sajian", syarat: "data" },
  { id: "kenapa", nama: "Cara hasil disusun", sub: "Alasan di balik hasil, tiga lapis", asal: "Kenapa hasil ini", syarat: null },
  { id: "ahli", nama: "Jejak klaim dan sumber", sub: "Versi mesin, klaim, tingkat kepastian, dan pustaka", asal: "Mode ahli", syarat: null },
  { id: "tentang", nama: "Tentang dan batas alat", sub: "Privasi, batas alat, dan hak data", asal: "Tentang", syarat: null },
  { id: "kartu", nama: "Kartu ringkasan", sub: "Satu lembar untuk dibagikan di posyandu", asal: "Kartu ringkasan", syarat: "data" },
  { id: "poster", nama: "Poster menu", sub: "Satu lembar huruf besar untuk dipajang", asal: "Sajian", syarat: "menu" },
];

export const UKURAN_KERTAS: Record<Kertas, { l: number; t: number; nama: string }> = {
  A4: { l: 210, t: 297, nama: "A4 (210 × 297 mm)" },
  F4: { l: 215, t: 330, nama: "F4 (215 × 330 mm)" },
};

export interface OpsiEkspor {
  bagian: BagianId[];
  kertas: Kertas;
  hemat: boolean;
  padat: boolean;
  sampul: boolean;
  /** Batasi bagian resep ke resep tertentu (unduhan satu resep). Kosong = semua resep sesi ini. */
  resepIds?: string[];
}

export const OPSI_BAWAAN: OpsiEkspor = { bagian: [], kertas: "A4", hemat: false, padat: false, sampul: true };

export const URUTAN_BAGIAN: readonly BagianId[] = DAFTAR_BAGIAN.map((b) => b.id);

/** Pilihan cepat. "halaman" dihitung dari layar aktif lewat bagianUntukLayar. */
export const PILIHAN_CEPAT: readonly { id: string; nama: string; bagian: readonly BagianId[] }[] = [
  { id: "ultimate", nama: "Ultimate: semua data sesi", bagian: ["sesi", "profil", "status", "rujukan", "menu", "resep", "belanja", "gizi", "penjelas", "kenapa", "ahli", "tentang", "kartu", "poster"] },
  { id: "lengkap", nama: "Laporan lengkap", bagian: ["profil", "status", "rujukan", "menu", "belanja", "gizi", "kenapa", "ahli", "tentang"] },
  { id: "resep", nama: "Resep bergambar", bagian: ["resep"] },
  { id: "keluarga", nama: "Untuk dipajang", bagian: ["kartu", "poster", "belanja"] },
  { id: "petugas", nama: "Untuk petugas", bagian: ["profil", "status", "rujukan", "menu", "gizi", "ahli"] },
];

export function bagianUntukLayar(layar: string): BagianId[] {
  const peta: Record<string, BagianId[]> = {
    profil: ["profil"],
    status: ["status", "rujukan"],
    piring: ["menu", "belanja", "resep"],
    kolam: ["gizi"],
    kenapa: ["kenapa"],
    ahli: ["ahli"],
    bahaya: ["rujukan"],
    tentang: ["tentang"],
    kartuBagi: ["kartu"],
  };
  return peta[layar] ?? [...PILIHAN_CEPAT[0]!.bagian];
}

export interface KonteksEkspor {
  r: Extract<Ringkasan, { hasil: "ok" }>;
  masukan: MasukanRingkasan;
  labelContoh: string;
  hariIdx: number;
  /** Teks penjelasan (templat atau AI) untuk bagian status; markdown. */
  penjelasan?: { teks: string; ai: boolean } | undefined;
  /** Resep AI yang sudah jadi di sesi ini dan cocok dengan menu sekarang. */
  resep?: ResepEkspor[];
  /** Penjelasan menu per hari (AI atau teks cadangan). */
  penjelasMenu?: { hari: number; teks: string; ai: boolean }[];
  /** Jumlah resep dari data sebelumnya yang tidak ikut karena menu berubah. */
  resepLama?: number;
  tanggal: Date;
  labelAlasan: (kode: string) => string;
  labelAlergen?: (kode: string) => string;
  labelMdd?: (kode: string) => string;
}

export interface ResepEkspor {
  id: string;
  hari: number;
  slotJudul: string;
  pita: string;
  bahan: { nama: string; gram: number; peran: string }[];
  /** Markdown resep (AI atau cadangan). */
  teks: string;
  ai: boolean;
  /** Data URL gambar, atau kosong bila gambar tidak dibuat. */
  gambar?: string | undefined;
  modelGambar?: string | undefined;
}

/** Bagian yang tersedia pada konteks ini; string = alasan tidak tersedia. */
export function ketersediaan(c: KonteksEkspor | null): Record<BagianId, true | string> {
  const hasil = {} as Record<BagianId, true | string>;
  for (const b of DAFTAR_BAGIAN) {
    if (!c) { hasil[b.id] = b.syarat === null ? true : "Isi ukuran anak yang valid dulu"; continue; }
    if (b.syarat === "menu" && !c.r.pola) hasil[b.id] = c.r.rujukan.tingkat === "rujuk" ? "Menu tidak disusun saat perlu rujukan" : "Menu tidak tersedia pada kondisi ini";
    else if (b.syarat === "rujuk" && c.r.rujukan.tingkat !== "rujuk") hasil[b.id] = "Tidak diperlukan pada contoh ini";
    else if (b.id === "penjelas" && !c.penjelasan && !(c.penjelasMenu && c.penjelasMenu.length)) hasil[b.id] = "Belum ada penjelasan untuk dimuat";
    else if (b.syarat === "resep" && !(c.resep && c.resep.length)) hasil[b.id] = c.r.pola ? "Belum ada resep. Buat dulu di halaman Sajian dengan tombol Buat resep + gambar" : "Menu tidak tersedia pada kondisi ini";
    else hasil[b.id] = true;
  }
  return hasil;
}

/* ---------- Blok ---------- */
export type Blok =
  | { k: "alir"; html: string; jaga?: boolean; ref?: BagianId }
  | { k: "tabel"; kelas: string; kepala: string; baris: string[]; jaga?: boolean; ref?: BagianId }
  | { k: "halaman"; html: string; kelas: string; polos?: boolean; ref?: BagianId }
  /** Mulai halaman baru; bila sisaMin (0-1) diberi, hanya jika sisa ruang halaman kurang dari itu. */
  | { k: "baru"; sisaMin?: number };

export interface DokumenBlok {
  judul: string;
  blok: Blok[];
  isi: { id: BagianId; nama: string }[];
}

export const e = (s: unknown): string => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const fmt = (n: number | null | undefined, d = 1): string => (n === null || n === undefined || Number.isNaN(n) ? "—" : n.toLocaleString("id-ID", { minimumFractionDigits: d, maximumFractionDigits: d }));
const kapital = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);

export const LOGO_DOK =
  '<svg class="dok-logo" viewBox="0 0 120 120" aria-hidden="true"><defs><linearGradient id="dl1" x1="0.15" y1="0" x2="0.85" y2="1"><stop offset="0" stop-color="#BE3A55"/><stop offset="1" stop-color="#651226"/></linearGradient><linearGradient id="dl2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F6DEA8"/><stop offset="1" stop-color="#B98A2E"/></linearGradient><clipPath id="dlc"><path d="M60 8C60 8 95 45 95 74a35 35 0 0 1-70 0C25 45 60 8 60 8Z"/></clipPath></defs>' +
  '<path d="M60 8C60 8 95 45 95 74a35 35 0 0 1-70 0C25 45 60 8 60 8Z" fill="url(#dl1)"/><g clip-path="url(#dlc)"><path d="M20 93C34 85 46 100 60 93S86 85 100 93V120H20Z" fill="url(#dl2)" opacity=".92"/></g>' +
  '<path d="M60 8C60 8 95 45 95 74a35 35 0 0 1-70 0C25 45 60 8 60 8Z" fill="none" stroke="url(#dl2)" stroke-width="2"/><path d="M44 80V50L76 80V50" fill="none" stroke="#FFF6EA" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

const NAMA_SLOT = (kode: string): string => {
  const m = /^(makan|selingan)_(\d+)$/.exec(kode);
  return m ? `${m[1] === "makan" ? "Makan" : "Selingan"} ${m[2]}` : kode;
};
const NAMA_PERAN: Record<string, string> = {
  staple: "Makanan pokok", protein_hewani: "Protein hewani", protein_nabati: "Protein nabati", sayur: "Sayuran", buah: "Buah", lemak: "Lemak tambahan", susu: "Susu dan olahan",
};
const URUT_PERAN = ["staple", "protein_hewani", "protein_nabati", "sayur", "buah", "susu", "lemak"];
const KELAS: Record<string, string> = { murah: "Murah", sedang: "Sedang", mahal: "Mahal" };
const namaBahan = (id: string): string => DATA.bahanAtribut.bahan.find((b) => b.id === id)?.nama ?? id;

/** Tingkat kepastian klaim: tingkat dan jenis dasar yang dipakai (netral, tanpa status verifikasi). */
export const TINGKAT_KEPASTIAN: Record<string, string> = {
  A: "Peraturan nasional",
  B: "Pedoman internasional",
  C: "Basis data pangan",
  D: "Asumsi program",
};

function satuanZat(k: string): string {
  return k === "energi_kkal" ? "kkal" : k.endsWith("_mcg") ? "mcg" : k.endsWith("_mg") ? "mg" : "g";
}

function nada(kat: string): "baik" | "waspada" | "bahaya" {
  if (/sangat|buruk|obesitas|di_luar/.test(kat)) return "bahaya";
  if (/normal|baik/.test(kat)) return "baik";
  return "waspada";
}

function pita(posisi: string | null, kat: string): string {
  const pin = posisiKePersenPin(posisi);
  const warna = nada(kat) === "baik" ? "#2E7D55" : nada(kat) === "bahaya" ? "#B3263E" : "#B07A12";
  return `<svg class="dok-pita" viewBox="0 0 300 34" role="img" aria-label="Posisi pada pita standar">
    <rect x="0" y="12" width="300" height="10" rx="5" fill="#EFE6DA" class="p-dasar"/>
    <rect x="0" y="12" width="66" height="10" rx="5" fill="#E7A9B4" class="p-rendah"/>
    <rect x="66" y="12" width="168" height="10" fill="#B9D8C4" class="p-tengah"/>
    <rect x="234" y="12" width="66" height="10" rx="5" fill="#EBD39A" class="p-tinggi"/>
    <g font-size="8" fill="#6B5A52" text-anchor="middle" font-family="sans-serif"><text x="27" y="32">-3</text><text x="66" y="32">-2</text><text x="123" y="32">-1</text><text x="150" y="32">Median</text><text x="177" y="32">+1</text><text x="234" y="32">+2</text><text x="273" y="32">+3</text></g>
    <path d="M${(pin * 3).toFixed(1)} 9l-5.5-8h11z" fill="${warna}"/>
  </svg>`;
}

function kartuIndikator(judul: string, label: string, posisi: string | null, kat: string): string {
  const n = nada(kat);
  const kata = n === "baik" ? "Dalam rentang" : n === "bahaya" ? "Perlu perhatian segera" : "Perlu dipantau";
  return `<div class="dok-ind dok-ind--${n}"><div class="dok-ind__j">${e(judul)}</div><div class="dok-ind__h">${e(kapital(label))}</div>${pita(posisi, kat)}<div class="dok-ind__k">${kata}</div></div>`;
}

const ringkas = (t: string): string => {
  const kalimat = t.split(/(?<=[.;])\s+/);
  const sisa = kalimat.filter((x) => !/dosen|verifikasi|PjBL|AUD-\d|DIKARANTINA|pemeriksa|dibaca visual|keputusan [A-Z]-\d|hitung ulang|sintetis|belum (?:dibaca|diverifikasi|diperiksa|terverifikasi)|sumber primer/i.test(x));
  if (!sisa.length) return "—";
  return sisa.join(" ").replace(/\s*\(Sumber:[^)]*\)\s*$/i, "").replace(/\s+/g, " ").trim();
};

const NAMA_DOK: Record<BagianId, string> = Object.fromEntries(DAFTAR_BAGIAN.map((b) => [b.id, b.nama])) as Record<BagianId, string>;

function judulBagian(id: BagianId, teks: string, sub?: string): string {
  return `<div class="dok-judul" data-bagian="${id}"><h2 class="dok-h2">${e(teks)}</h2>${sub ? `<p class="dok-sub">${sub}</p>` : ""}</div>`;
}

/* ---------- Bagian ---------- */
function blokProfil(c: KonteksEkspor): Blok[] {
  const m = c.masukan;
  const s = m.status;
  const hindari = m.pola.hindari.length ? m.pola.hindari.map((k) => (c.labelAlergen ? c.labelAlergen(k) : k)).join(", ") : "Tidak ada";
  const tanda = m.tanda_bahaya.length ? m.tanda_bahaya.map((k) => c.labelAlasan(`tanda_bahaya:${k}`).replace(/^Tanda bahaya: /, "")).join("; ") : "Tidak ada";
  const baris = (a: string, b: string): string => `<tr><th>${e(a)}</th><td>${e(b)}</td></tr>`;
  return [
    { k: "alir", ref: "profil", jaga: true, html: judulBagian("profil", "Profil dan ukuran", "Data yang dipakai untuk semua hasil di dokumen ini.") },
    {
      k: "alir",
      html: `<div class="dok-dua">
        <table class="dok-meta"><caption>Ukuran anak</caption>
          ${baris(c.labelContoh.startsWith("Data Anda") ? "Data" : "Contoh", c.labelContoh.split(" · ")[0] ?? c.labelContoh)}
          ${baris("Usia", `${s.umur.bulan} bulan ${s.umur.hari} hari`)}
          ${baris("Jenis kelamin", s.jk === "L" ? "Laki-laki" : "Perempuan")}
          ${baris("Berat badan", `${fmt(s.bb_kg, 1)} kg`)}
          ${baris("Panjang/tinggi", `${fmt(c.r.status.panjang_dipakai_cm, 1)} cm`)}
          ${baris("Cara ukur", s.cara_ukur === "berdiri" ? "Berdiri (dikoreksi ke panjang berbaring)" : "Berbaring")}
        </table>
        <table class="dok-meta"><caption>Pilihan menu</caption>
          ${baris("ASI", m.pola.masih_asi ? "Masih diberikan" : "Tidak diberikan")}
          ${baris("Hati ayam", m.pola.izinkan_hati ? "Boleh masuk menu" : "Tidak dimasukkan")}
          ${baris("Pantangan", hindari)}
          ${baris("Tanda bahaya", tanda)}
          ${baris("Lama menu", `${m.pola.hari} hari`)}
          ${baris("Kode menu", m.pola.benih.replace(/^rona-sintetis-/, "").toUpperCase())}
        </table>
      </div>`,
    },
  ];
}

function blokStatus(c: KonteksEkspor): Blok[] {
  const s = c.r.status;
  const tanda = c.r.rujukan.tingkat === "rujuk";
  const blok: Blok[] = [
    { k: "alir", ref: "status", jaga: true, html: judulBagian("status", "Status pertumbuhan", `Anak usia ${c.masukan.status.umur.bulan} bulan, ${fmt(c.masukan.status.bb_kg, 1)} kg, ${fmt(s.panjang_dipakai_cm, 1)} cm. Hasil dihitung dengan tabel standar antropometri nasional.`) },
    {
      k: "alir",
      html: `<div class="dok-ind-baris">
      ${kartuIndikator("Berat badan menurut umur", LABEL_BBU[s.bbu.kategori].replace(/ menurut umur$/, ""), s.bbu.posisi, s.bbu.kategori)}
      ${kartuIndikator("Panjang badan menurut umur", LABEL_PBU[s.pbu.kategori].replace(/ menurut umur$/, ""), s.pbu.posisi, s.pbu.kategori)}
      ${kartuIndikator("Berat menurut panjang badan", (LABEL_BBPB[s.bbpb.kategori] ?? "").replace(/^berat badan menurut panjang badan masuk kategori /, ""), s.bbpb.posisi, s.bbpb.kategori)}
      </div>`,
    },
  ];
  if (tanda) {
    blok.push({ k: "alir", html: `<div class="dok-rujuk"><strong>Perlu rujukan ke petugas kesehatan.</strong><ul>${c.r.rujukan.alasan.map((a) => `<li>${e(c.labelAlasan(a))}</li>`).join("")}</ul><p>Bawa Buku KIA/KMS dan sampaikan hasil ini.</p></div>` });
  } else if (c.penjelasan) {
    blok.push({ k: "alir", html: `<div class="dok-penjelasan"><h3 class="dok-h3">Penjelasan sederhana</h3><div class="md">${renderMarkdown(c.penjelasan.teks)}</div>${c.penjelasan.ai ? `<p class="dok-catatan">Penjelasan ini disusun oleh AI dari ringkasan berkode, lalu diperiksa aturan keamanan. Hasil mesin di atas tetap rujukan utama.</p>` : ""}</div>` });
  }
  return blok;
}

function blokRujukan(c: KonteksEkspor): Blok[] {
  const rujuk = c.r.rujukan.tingkat === "rujuk";
  if (!rujuk) return [];
  const m = c.masukan.status;
  return [
    { k: "alir", ref: "rujukan", jaga: true, html: judulBagian("rujukan", "Lembar rujukan", "Untuk dibawa ke posyandu, puskesmas, atau fasilitas kesehatan.") },
    {
      k: "alir",
      html: `<div class="dok-rujuk dok-rujuk--besar"><strong>Perlu diperiksa petugas kesehatan.</strong>
        <ul>${c.r.rujukan.alasan.map((a) => `<li>${e(c.labelAlasan(a))}</li>`).join("")}</ul></div>
        <table class="dok-meta"><caption>Ukuran saat ini</caption>
          <tr><th>Usia</th><td>${m.umur.bulan} bulan ${m.umur.hari} hari</td></tr>
          <tr><th>Jenis kelamin</th><td>${m.jk === "L" ? "Laki-laki" : "Perempuan"}</td></tr>
          <tr><th>Berat badan</th><td>${fmt(m.bb_kg, 1)} kg</td></tr>
          <tr><th>Panjang/tinggi</th><td>${fmt(c.r.status.panjang_dipakai_cm, 1)} cm</td></tr>
        </table>
        <div class="dok-cek"><h3 class="dok-h3">Yang dibawa</h3>
          <ul class="dok-kotak-daftar"><li><span class="dok-kotak"></span>Buku KIA atau KMS</li><li><span class="dok-kotak"></span>Dokumen ini</li><li><span class="dok-kotak"></span>Catatan makanan dan minuman yang diberikan beberapa hari terakhir</li></ul></div>`,
    },
  ];
}

function infoHari(h: NonNullable<KonteksEkspor["r"]["pola"]>["hari"][number]): string {
  return `${Math.round(h.energi_kkal)} dari ${h.energi_target_kkal} kkal (${h.energi_persen_target}%) · ${h.jumlah_kelompok_mdd} dari 8 kelompok makanan`;
}

function blokMenu(c: KonteksEkspor): Blok[] {
  const p = c.r.pola;
  if (!p) return [];
  const blok: Blok[] = [
    { k: "alir", ref: "menu", jaga: true, html: judulBagian("menu", `Menu ${p.hari.length} hari`, `Pita usia ${e(LABEL_PITA[p.pita])}. Disusun otomatis dari aturan program dan sama setiap kali dengan masukan yang sama.`) },
  ];
  for (const h of p.hari) {
    blok.push({
      k: "alir",
      html: `<div class="dok-hari"><div class="dok-hari__kepala"><h3 class="dok-h3">Hari ke-${h.hari_ke}</h3><span>${e(infoHari(h))}</span></div>
        <div class="dok-slot-grid">${h.slot
          .map((sl) => `<div class="dok-slot"><div class="dok-slot__nama">${e(NAMA_SLOT(sl.kode))}</div><ul>${sl.item.map((it) => `<li><span>${e(namaBahan(it.bahan_id))}</span><b>${it.gram} g</b></li>`).join("")}</ul></div>`)
          .join("")}</div></div>`,
    });
  }
  return blok;
}

function blokBelanja(c: KonteksEkspor): Blok[] {
  const b = c.r.belanja;
  const p = c.r.pola;
  if (!b || !p) return [];
  const blok: Blok[] = [
    { k: "alir", ref: "belanja", jaga: true, html: judulBagian("belanja", `Daftar belanja ${p.hari.length} hari`, `Jumlah beli sudah memperhitungkan bagian yang tidak dimakan dan dibulatkan ke atas per 5 gram. Kelas harga bersifat relatif, bukan harga pasar. Murah ${b.jumlah_per_kelas.murah} · Sedang ${b.jumlah_per_kelas.sedang} · Mahal ${b.jumlah_per_kelas.mahal}.`) },
  ];
  const urut = [...new Set([...URUT_PERAN, ...b.item.map((i) => i.peran)])];
  for (const peran of urut) {
    const isi = b.item.filter((i) => i.peran === peran);
    if (!isi.length) continue;
    blok.push({
      k: "alir",
      html: `<div class="dok-kel"><h3 class="dok-h3">${e(NAMA_PERAN[peran] ?? peran)}</h3><ul class="dok-belanja">${isi
        .map((i) => `<li><span class="dok-kotak"></span><span class="dok-belanja__nama">${e(i.nama)}</span><span class="dok-belanja__jml"><b>${i.gram_beli} g</b><i>disajikan ${i.gram_disajikan} g</i></span><span class="dok-kelas dok-kelas--${i.kelas_harga}">${e(KELAS[i.kelas_harga] ?? i.kelas_harga)}</span></li>`)
        .join("")}</ul></div>`,
    });
  }
  return blok;
}

function blokGizi(c: KonteksEkspor): Blok[] {
  const p = c.r.pola;
  if (!p) return [];
  const blok: Blok[] = [
    { k: "alir", ref: "gizi", jaga: true, html: judulBagian("gizi", "Kecukupan gizi", "Hanya makanan dalam menu yang dihitung; ASI dan makanan lain tidak dihitung. Batang penuh berarti 100% AKG atau lebih. Tanda bintang berarti datanya belum lengkap dan angkanya mungkin lebih rendah dari kenyataan.") },
  ];
  for (const h of p.hari) {
    const baris = h.akg.zat
      .map((z) => {
        const w = Math.max(0, Math.min(100, z.persen));
        const tn = z.persen >= 80 ? "baik" : z.persen >= 50 ? "waspada" : "bahaya";
        return `<div class="dok-zat dok-zat--${tn}"><span class="dok-zat__n">${e(kapital(NAMA_ZAT[z.zat] ?? z.zat))}${z.lengkap ? "" : " *"}</span><span class="dok-zat__v">${fmt(z.nilai, 1)} / ${fmt(z.akg, 0)} ${satuanZat(z.zat)}</span><span class="dok-zat__bar"><i style="width:${w.toFixed(0)}%"></i></span><b class="dok-zat__p">${Math.round(z.persen)}%</b></div>`;
      })
      .join("");
    const celah = h.peringatan.length ? `<p class="dok-catatan">Catatan hari ini: ${e(h.peringatan.map((x) => (LABEL_CELAH as Record<string, string>)[x] ?? x).join("; "))}.</p>` : "";
    blok.push({ k: "alir", html: `<div class="dok-hari"><div class="dok-hari__kepala"><h3 class="dok-h3">Hari ke-${h.hari_ke}</h3><span>${e(infoHari(h))}</span></div><div class="dok-zat-grid">${baris}</div>${celah}</div>` });
  }
  blok.push({ k: "alir", html: `<p class="dok-catatan">Aplikasi tidak meresepkan dosis suplemen. Bila ada celah zat gizi, diskusikan bersama bidan atau dokter.</p>` });
  return blok;
}

function blokKenapa(c: KonteksEkspor): Blok[] {
  const celah = c.r.pola?.hari[0]?.peringatan ?? [];
  return [
    { k: "alir", ref: "kenapa", jaga: true, html: judulBagian("kenapa", "Cara hasil disusun", "Setiap hasil NUTRIVA dapat ditelusuri, dari bahasa sehari-hari sampai sumber rujukannya.") },
    { k: "alir", html: `<div class="dok-lapis"><span class="dok-lapis__no">1</span><div><h3 class="dok-h3">Bahasa sehari-hari</h3><p>Zat besi sering paling sulit dipenuhi karena porsi anak kecil. Karena itu menu mengutamakan lauk hewani (ikan, telur, daging, dan hati bila diizinkan) bersama sayur dan buah.</p></div></div>` },
    {
      k: "alir",
      html: `<div class="dok-lapis"><span class="dok-lapis__no">2</span><div><h3 class="dok-h3">Aturan yang dipakai mesin</h3><ul>
        <li><strong>Batas porsi:</strong> mesin membatasi gram maksimum per waktu makan sesuai pita usia (6 sampai 8, 9 sampai 11, 12 sampai 23 bulan) agar tidak menyarankan porsi yang mustahil dihabiskan bayi.</li>
        <li><strong>Batas vitamin A hewani:</strong> hati ayam hanya masuk bila diizinkan, paling banyak sekali per pekan dengan porsi dibatasi aturan mesin.</li>
        <li><strong>Keragaman pangan (minimal 5 dari 8 kelompok):</strong> mesin merotasi serealia, telur, daging dan ikan, kacang-kacangan, sayur dan buah vitamin A, serta sayur dan buah lain.</li></ul>
        ${celah.length ? `<p>Celah yang terdeteksi pada contoh ini: <strong>${e(celah.map((x) => (LABEL_CELAH as Record<string, string>)[x] ?? x).join("; "))}</strong>.</p>` : ""}</div></div>`,
    },
    { k: "alir", html: `<div class="dok-lapis"><span class="dok-lapis__no">3</span><div><h3 class="dok-h3">Rujukan dan sumber</h3><p>Standar antropometri merujuk pada Permenkes RI No. 2 Tahun 2020. Target kecukupan gizi merujuk pada Permenkes RI No. 28 Tahun 2019. Nilai gizi bahan pangan dipetakan dari USDA FoodData Central SR Legacy (domain publik).</p></div></div>` },
  ];
}

function blokAhli(c: KonteksEkspor): Blok[] {
  const aktif = new Set<string>([c.r.status.bbu.klaim_id, c.r.status.pbu.klaim_id, c.r.status.bbpb.klaim_id, ...c.r.status.klaim_asumsi, ...(c.r.pola?.klaim_ids ?? []), ...(c.r.belanja?.klaim_ids ?? [])]);
  const klaim = klaimData.klaim.filter((k) => aktif.has(k.id));
  return [
    { k: "alir", ref: "ahli", jaga: true, html: judulBagian("ahli", "Jejak klaim dan sumber", "Versi mesin, klaim yang dipakai pada hasil ini, dan pustaka di baliknya.") },
    {
      k: "alir",
      html: `<table class="dok-meta dok-meta--4"><tr><th>Versi mesin</th><td>${e(c.r.versi.engine)}</td><th>Versi data</th><td>${e(c.r.versi.data)}</td></tr><tr><th>Versi aturan</th><td>${e(c.r.versi.rules)}</td><th>Kode menu</th><td>${e(c.masukan.pola.benih.replace(/^rona-sintetis-/, "").toUpperCase())}</td></tr></table>
      <p class="dok-catatan">Tingkat kepastian menunjukkan dasar klaim: A peraturan nasional, B pedoman internasional, C basis data pangan, D asumsi program.</p>`,
    },
    {
      k: "tabel",
      kelas: "dok-tabel dok-tabel--klaim",
      jaga: true,
      kepala: `<tr><th>ID</th><th>Pernyataan</th><th>Tingkat kepastian</th><th>Sumber</th></tr>`,
      baris: klaim.map((k) => `<tr><td class="mono">${e(k.id)}</td><td>${e(ringkas(k.pernyataan))}</td><td class="tk"><b>${e(k.tingkat)}</b> ${e(TINGKAT_KEPASTIAN[k.tingkat] ?? "")}</td><td class="mono">${e(k.sumber.map((s) => s.sumber_id).join(", ") || "—")}</td></tr>`),
    },
    { k: "alir", html: `<h3 class="dok-h3">Pustaka sumber</h3>` , jaga: true },
    {
      k: "tabel",
      kelas: "dok-tabel dok-tabel--sumber",
      kepala: `<tr><th>ID</th><th>Judul</th><th>Tingkat kepastian</th></tr>`,
      baris: sumberData.sumber.map((s) => `<tr><td class="mono">${e(s.id)}</td><td>${e(s.judul)}</td><td class="tk"><b>${e(s.tingkat)}</b> ${e(TINGKAT_KEPASTIAN[s.tingkat] ?? "")}</td></tr>`),
    },
  ];
}

function blokTentang(): Blok[] {
  return [
    { k: "alir", ref: "tentang", jaga: true, html: judulBagian("tentang", "Tentang dan batas alat", "NUTRIVA, gizi 1000 hari pertama. Alat bantu edukasi MPASI.") },
    {
      k: "alir",
      html: `<div class="dok-tumpuk">
        <div class="dok-lapis"><span class="dok-lapis__no">i</span><div><h3 class="dok-h3">Privasi</h3><p>${e(PERNYATAAN_PRIVASI_AI)}</p></div></div>
        <div class="dok-lapis"><span class="dok-lapis__no">ii</span><div><h3 class="dok-h3">Batas alat ini</h3><ul>
          <li><strong>Bukan diagnosis medis:</strong> status pertumbuhan dan contoh menu adalah bahan diskusi bersama kader posyandu, bidan, atau dokter.</li>
          <li><strong>Tidak meresepkan dosis suplemen:</strong> bila ada celah zat besi, aplikasi menyarankan konsultasi ke petugas kesehatan.</li>
          <li><strong>Bekerja tanpa internet:</strong> status, menu, dan daftar belanja dihitung di perangkat Anda. Hanya penjelasan AI yang membutuhkan koneksi.</li></ul></div></div>
        <div class="dok-lapis"><span class="dok-lapis__no">iii</span><div><h3 class="dok-h3">Data tidak disimpan</h3><p>Masukan anak hanya berada di memori sementara dan hilang saat tab ditutup, atau dapat direset seketika dari aplikasi.</p></div></div>
      </div>`,
    },
  ];
}

function blokKartu(c: KonteksEkspor): Blok[] {
  const s = c.r.status;
  const m = c.masukan.status;
  const h1 = c.r.pola?.hari[0];
  const html = `<section class="dok-kartu">
    <div class="dok-kartu__atas">${LOGO_DOK}<div><div class="dok-kartu__merek">NUTRIVA</div><div class="dok-kartu__sub">Ringkasan MPASI</div></div></div>
    <div class="dok-kartu__nama">${e(c.labelContoh)}</div>
    <div class="dok-kartu__ukur">${m.umur.bulan} bulan · ${fmt(m.bb_kg, 1)} kg · ${fmt(s.panjang_dipakai_cm, 1)} cm</div>
    <div class="dok-ind-baris dok-ind-baris--kartu">
      ${kartuIndikator("BB menurut umur", LABEL_BBU[s.bbu.kategori].replace(/ menurut umur$/, ""), s.bbu.posisi, s.bbu.kategori)}
      ${kartuIndikator("PB menurut umur", LABEL_PBU[s.pbu.kategori].replace(/ menurut umur$/, ""), s.pbu.posisi, s.pbu.kategori)}
      ${kartuIndikator("BB menurut PB", (LABEL_BBPB[s.bbpb.kategori] ?? "").replace(/^berat badan menurut panjang badan masuk kategori /, ""), s.bbpb.posisi, s.bbpb.kategori)}
    </div>
    ${c.r.rujukan.tingkat === "rujuk" ? `<div class="dok-rujuk"><strong>Perlu rujukan ke petugas kesehatan.</strong> Bawa Buku KIA/KMS.</div>` : h1 ? `<div class="dok-kartu__menu"><strong>Contoh menu hari pertama</strong><ul>${h1.slot.map((sl) => `<li><b>${e(NAMA_SLOT(sl.kode))}:</b> ${sl.item.map((it) => `${e(namaBahan(it.bahan_id))} ${it.gram} g`).join(", ")}</li>`).join("")}</ul><span>${h1.jumlah_kelompok_mdd} dari 8 kelompok makanan · ${h1.energi_persen_target}% target energi</span></div>` : ""}
    <div class="dok-kartu__kaki">Alat bantu edukasi, bukan diagnosis. Konsultasikan dengan petugas kesehatan.</div>
  </section>`;
  return [{ k: "halaman", ref: "kartu", kelas: "dok-hal--kartu", html }];
}

function blokPoster(c: KonteksEkspor): Blok[] {
  const p = c.r.pola;
  if (!p) return [];
  const html = `<section class="dok-poster">
    <header class="dok-poster__kepala">${LOGO_DOK}<div><div class="dok-poster__merek">NUTRIVA</div><div class="dok-poster__sub">Menu MPASI ${p.hari.length} hari · pita usia ${e(LABEL_PITA[p.pita])}</div></div></header>
    <div class="dok-poster__hari">${p.hari
      .map(
        (h) => `<div class="dok-poster__kartu"><div class="dok-poster__no"><span>Hari</span><b>${h.hari_ke}</b></div><div class="dok-poster__isi">${h.slot
          .map((sl) => `<div class="dok-poster__baris"><span class="dok-poster__waktu">${e(NAMA_SLOT(sl.kode))}</span><span class="dok-poster__menu">${sl.item.map((it) => `${e(namaBahan(it.bahan_id))} <i>${it.gram} g</i>`).join(" · ")}</span></div>`)
          .join("")}</div></div>`,
      )
      .join("")}</div>
    <footer class="dok-poster__kaki">Alat bantu edukasi, bukan diagnosis. Konsultasikan dengan petugas kesehatan.</footer>
  </section>`;
  return [{ k: "halaman", ref: "poster", kelas: "dok-hal--poster", html }];
}


function blokSesi(c: KonteksEkspor): Blok[] {
  const st = c.r.status;
  const m = c.masukan.status;
  const p = c.r.pola;
  const tgl = c.tanggal.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const baris = (a: string, b: string): string => `<tr><th>${e(a)}</th><td>${e(b)}</td></tr>`;
  const resep = c.resep ?? [];
  const bergambar = resep.filter((x) => x.gambar).length;
  const aiPenjelasan = (c.penjelasMenu ?? []).filter((x) => x.ai).length + (c.penjelasan?.ai ? 1 : 0);
  const bahanUnik = p ? new Set(p.hari.flatMap((h) => h.slot.flatMap((sl) => sl.item.map((it) => it.bahan_id)))).size : 0;
  const rata = (f: (h: NonNullable<typeof p>["hari"][number]) => number): number => (p && p.hari.length ? p.hari.reduce((a, h) => a + f(h), 0) / p.hari.length : 0);
  const rujuk = c.r.rujukan.tingkat === "rujuk";
  return [
    { k: "alir", ref: "sesi", jaga: true, html: judulBagian("sesi", "Ringkasan sesi", `Semua data yang ada pada sesi ini, dirangkum satu halaman. Dibuat ${e(tgl)}.`) },
    {
      k: "alir",
      html: `<div class="dok-ind-baris">
      ${kartuIndikator("Berat badan menurut umur", LABEL_BBU[st.bbu.kategori].replace(/ menurut umur$/, ""), st.bbu.posisi, st.bbu.kategori)}
      ${kartuIndikator("Panjang badan menurut umur", LABEL_PBU[st.pbu.kategori].replace(/ menurut umur$/, ""), st.pbu.posisi, st.pbu.kategori)}
      ${kartuIndikator("Berat menurut panjang badan", (LABEL_BBPB[st.bbpb.kategori] ?? "").replace(/^berat badan menurut panjang badan masuk kategori /, ""), st.bbpb.posisi, st.bbpb.kategori)}
      </div>`,
    },
    {
      k: "alir",
      html: `<div class="dok-dua">
        <table class="dok-meta"><caption>Data anak</caption>
          ${baris(c.labelContoh.startsWith("Data Anda") ? "Data" : "Contoh", c.labelContoh.split(" · ")[0] ?? c.labelContoh)}
          ${baris("Usia", `${m.umur.bulan} bulan ${m.umur.hari} hari`)}
          ${baris("Jenis kelamin", m.jk === "L" ? "Laki-laki" : "Perempuan")}
          ${baris("Berat badan", `${fmt(m.bb_kg, 1)} kg`)}
          ${baris("Panjang/tinggi", `${fmt(st.panjang_dipakai_cm, 1)} cm`)}
          ${baris("Rujukan", rujuk ? "Perlu diperiksa petugas kesehatan" : "Tidak ada tanda yang memerlukan rujukan")}
        </table>
        <table class="dok-meta"><caption>Isi sesi</caption>
          ${baris("Menu", p ? `${p.hari.length} hari, ${bahanUnik} jenis bahan` : "Tidak disusun")}
          ${baris("Energi menu", p ? `rata-rata ${Math.round(rata((h) => h.energi_persen_target))}% dari target` : "—")}
          ${baris("Keragaman", p ? `rata-rata ${fmt(rata((h) => h.jumlah_kelompok_mdd), 1)} dari 8 kelompok` : "—")}
          ${baris("Resep", resep.length ? `${resep.length} resep, ${bergambar} dengan gambar` : "Belum dibuat")}
          ${baris("Penjelasan AI", aiPenjelasan ? `${aiPenjelasan} penjelasan` : "Memakai teks cadangan")}
          ${baris("Versi mesin", `${c.r.versi.engine} · data ${c.r.versi.data}`)}
        </table>
      </div>`,
    },
    {
      k: "alir",
      html: `<p class="dok-catatan">NUTRIVA tidak menyimpan data anak. Dokumen ini adalah salinan sesi pada saat dibuat; simpan PDF ini bila Anda ingin menyimpannya.${c.resepLama ? ` ${c.resepLama} resep dari ukuran sebelumnya tidak disertakan karena menu sudah berubah.` : ""}</p>`,
    },
  ];
}

function blokResep(c: KonteksEkspor, opsi: OpsiEkspor): Blok[] {
  let daftar = c.resep ?? [];
  if (opsi.resepIds && opsi.resepIds.length) daftar = daftar.filter((r) => opsi.resepIds!.includes(r.id));
  if (!daftar.length) return [];
  const blok: Blok[] = [
    { k: "alir", ref: "resep", jaga: true, html: judulBagian("resep", daftar.length === 1 ? "Resep dan ilustrasi" : `Resep dan ilustrasi (${daftar.length})`, "Bahan dan gram ditentukan mesin NUTRIVA. Cara memasak ditulis AI dan gambarnya hanya ilustrasi, bukan foto hasil masak.") },
  ];
  daftar.forEach((r0, i) => {
    const r = { ...r0, gambar: r0.gambar && /^data:image\/(?:png|jpeg|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(r0.gambar) ? r0.gambar : undefined };
    if (i > 0) blok.push({ k: "baru", sisaMin: 0.56 });
    const total = r.bahan.reduce((a, b) => a + b.gram, 0);
    const gambar = r.gambar
      ? `<img class="dok-resep__img" alt="Ilustrasi AI: ${e(r.slotJudul)}" src="${e(r.gambar)}" />`
      : `<div class="dok-resep__img dok-resep__img--kosong">Gambar tidak dibuat untuk resep ini</div>`;
    blok.push({
      k: "alir",
      html: `<article class="dok-resep">
        <header class="dok-resep__kepala"><h3 class="dok-h3">${e(r.slotJudul)}</h3><span>Hari ke-${r.hari} · usia ${e(r.pita)}</span></header>
        <div class="dok-resep__atas">
          <figure class="dok-resep__gambar">${gambar}<figcaption>${r.gambar ? `Ilustrasi dibuat AI dari daftar bahan${r.modelGambar ? ` (${e(r.modelGambar)})` : ""}. Hasil masak nyata bisa berbeda.` : "Tidak ada ilustrasi."}</figcaption></figure>
          <div class="dok-resep__info">
            <table class="dok-meta">
              <tr><th>Waktu makan</th><td>${e(r.slotJudul)}</td></tr>
              <tr><th>Bahan</th><td>${r.bahan.length} jenis</td></tr>
              <tr><th>Total gram</th><td>${fmt(total, 0)} g</td></tr>
              <tr><th>Resep</th><td>${r.ai ? "Ditulis AI" : "Resep cadangan"}</td></tr>
            </table>
            <ul class="dok-resep__peran">${r.bahan.map((b) => `<li><span>${e(b.nama)}</span><i>${e(NAMA_PERAN[b.peran] ?? b.peran)}</i></li>`).join("")}</ul>
          </div>
        </div>
        <div class="dok-resep__isi md">${renderMarkdown(r.teks)}</div>
        <p class="dok-catatan">${r.ai ? "Resep ditulis oleh AI dan bisa keliru. Gram dan bahan dihitung mesin NUTRIVA, bukan AI. Periksa kebersihan dan kematangan makanan sebelum disajikan." : "Resep cadangan disusun otomatis tanpa AI. Periksa kebersihan dan kematangan makanan sebelum disajikan."}</p>
      </article>`,
    });
  });
  return blok;
}

function blokPenjelas(c: KonteksEkspor): Blok[] {
  const kartu = (judul: string, teks: string, ai: boolean): Blok => ({
    k: "alir",
    html: `<div class="dok-penjelasan"><h3 class="dok-h3">${e(judul)} <span class="dok-lencana">${ai ? "AI" : "Teks cadangan"}</span></h3><div class="md">${renderMarkdown(teks)}</div></div>`,
  });
  const blok: Blok[] = [
    { k: "alir", ref: "penjelas", jaga: true, html: judulBagian("penjelas", "Penjelasan sederhana", "Penjelasan status dan menu. Angka dan status dihitung mesin; AI hanya menjelaskan.") },
  ];
  if (c.penjelasan) blok.push(kartu("Status pertumbuhan", c.penjelasan.teks, c.penjelasan.ai));
  for (const x of c.penjelasMenu ?? []) blok.push(kartu(`Menu hari ke-${x.hari}`, x.teks, x.ai));
  if (blok.length === 1) return [];
  blok.push({ k: "alir", html: `<p class="dok-catatan">Penjelasan AI dibuat oleh AI dan bisa keliru. Konsultasikan hasil dengan petugas kesehatan.</p>` });
  return blok;
}

function blokSampul(c: KonteksEkspor, judul: string, isi: { id: BagianId; nama: string }[], opsi: OpsiEkspor): Blok {
  const m = c.masukan.status;
  const tgl = c.tanggal.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  return {
    k: "halaman",
    kelas: "dok-hal--sampul",
    polos: true,
    html: `<section class="dok-sampul">
      <div class="dok-sampul__logo">${LOGO_DOK}</div>
      <div class="dok-sampul__merek">NUTRIVA</div>
      <div class="dok-sampul__motto">Gizi 1000 hari pertama kehidupan</div>
      <div class="dok-sampul__garis"></div>
      <h1 class="dok-sampul__judul">${e(judul)}</h1>
      <div class="dok-sampul__info"><div><span>${c.labelContoh.startsWith("Data Anda") ? "Data" : "Contoh"}</span><strong>${e(c.labelContoh.split(" · ")[0] ?? "")}</strong></div><div><span>Usia</span><strong>${m.umur.bulan} bulan</strong></div><div><span>Dicetak</span><strong>${e(tgl)}</strong></div></div>
      <div class="dok-sampul__isi"><h2>Isi dokumen</h2><ol>${isi.map((x) => `<li data-toc="${x.id}"><span class="dok-toc__n">${e(x.nama)}</span><span class="dok-toc__titik"></span><span class="dok-toc__hal">–</span></li>`).join("")}</ol></div>
      <div class="dok-sampul__kaki"><span>${e(UKURAN_KERTAS[opsi.kertas].nama)}</span><span class="dok-penulis">E.13.1 feat H.A.te</span></div>
    </section>`,
  };
}

const PEMBUAT: Record<BagianId, (c: KonteksEkspor, o: OpsiEkspor) => Blok[]> = {
  sesi: blokSesi,
  resep: blokResep,
  penjelas: blokPenjelas,
  profil: blokProfil,
  status: blokStatus,
  rujukan: blokRujukan,
  menu: blokMenu,
  belanja: blokBelanja,
  gizi: blokGizi,
  kenapa: blokKenapa,
  ahli: blokAhli,
  tentang: () => blokTentang(),
  kartu: blokKartu,
  poster: blokPoster,
};

export function judulDokumen(bagian: readonly BagianId[]): string {
  return bagian.length === 1 ? NAMA_DOK[bagian[0]!] : bagian.length >= 10 ? "Arsip sesi lengkap" : "Laporan pendampingan MPASI";
}

export function judulBerkas(opsi: OpsiEkspor, c: KonteksEkspor): string {
  return `NUTRIVA - ${judulDokumen(opsi.bagian)} - ${c.labelContoh.split(" · ")[0] ?? "Contoh"}`;
}

/** Susun dokumen: urutan bagian mengikuti URUTAN_BAGIAN, bagian yang tidak tersedia dilewati. */
export function susunBlok(opsi: OpsiEkspor, c: KonteksEkspor): DokumenBlok {
  const ada = ketersediaan(c);
  const pilih = URUTAN_BAGIAN.filter((b) => opsi.bagian.includes(b) && ada[b] === true);
  const isi: { id: BagianId; nama: string }[] = [];
  const badan: Blok[] = [];
  for (const id of pilih) {
    const blok = PEMBUAT[id](c, opsi);
    if (!blok.length) continue;
    // Bagian beralir mulai di halaman baru bila ia bukan yang pertama; halaman penuh sudah terpisah sendiri.
    if (badan.length && blok[0]!.k !== "halaman" && badan[badan.length - 1]!.k !== "halaman") badan.push({ k: "baru", sisaMin: 0.34 });
    badan.push(...blok);
    isi.push({ id, nama: NAMA_DOK[id] });
  }
  const judul = judulDokumen(pilih);
  const blok: Blok[] = [];
  if (opsi.sampul && isi.length >= 2) blok.push(blokSampul(c, judul, isi, opsi));
  blok.push(...badan);
  return { judul, blok, isi };
}
