import type { Ringkasan, MasukanRingkasan } from "../app/fasad";
import { LABEL_BBPB, LABEL_BBU, LABEL_PBU, LABEL_PITA, NAMA_ZAT, PERINGATAN_AI } from "../ai/glosarium";
import { renderMarkdown } from "../ai/markdown";
import { posisiKePersenPin } from "./ikon";
import { DATA } from "../engine/data";
import klaimData from "../../data/claims.json";
import sumberData from "../../data/sources.json";

/**
 * Ekspor PDF: dokumen A4 berdesain khusus yang dicetak lewat mesin cetak peramban ("Simpan sebagai PDF").
 * Vektor penuh (teks bisa dipilih dan dicari), tanpa layanan luar, tanpa dependensi, jalan luring.
 * Fungsi bangunDokumen murni (string masuk, string keluar); cetakDokumen menyentuh DOM.
 */
export type JenisEkspor = "lengkap" | "status" | "menu" | "gizi" | "kartu" | "jejak";

export const DAFTAR_EKSPOR: readonly { jenis: JenisEkspor; nama: string; sub: string }[] = [
  { jenis: "lengkap", nama: "Laporan lengkap", sub: "Sampul, status, menu, belanja, dan kecukupan gizi" },
  { jenis: "status", nama: "Status pertumbuhan", sub: "Tiga indikator dengan pita standar dan penjelasan" },
  { jenis: "menu", nama: "Menu dan belanja", sub: "Rencana menu per hari dan daftar belanja" },
  { jenis: "gizi", nama: "Kecukupan gizi", sub: "Persen AKG per zat gizi untuk satu hari menu" },
  { jenis: "kartu", nama: "Kartu ringkasan", sub: "Satu halaman untuk dibagikan di posyandu" },
  { jenis: "jejak", nama: "Jejak klaim dan sumber", sub: "Versi mesin, klaim, dan pustaka sumber" },
];

export interface KonteksEkspor {
  r: Extract<Ringkasan, { hasil: "ok" }>;
  masukan: MasukanRingkasan;
  labelContoh: string;
  hariIdx: number;
  /** Teks penjelasan (templat atau AI) untuk bagian status; markdown. */
  penjelasan?: { teks: string; ai: boolean } | undefined;
  tanggal: Date;
  labelAlasan: (kode: string) => string;
}

const e = (s: unknown): string => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const fmt = (n: number | null | undefined, d = 1): string => (n === null || n === undefined || Number.isNaN(n) ? "—" : n.toLocaleString("id-ID", { minimumFractionDigits: d, maximumFractionDigits: d }));
const kapital = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);

const LOGO =
  '<svg class="dok-logo" viewBox="0 0 120 120" aria-hidden="true"><defs><linearGradient id="dl1" x1="0.15" y1="0" x2="0.85" y2="1"><stop offset="0" stop-color="#BE3A55"/><stop offset="1" stop-color="#651226"/></linearGradient><linearGradient id="dl2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F6DEA8"/><stop offset="1" stop-color="#B98A2E"/></linearGradient><clipPath id="dlc"><path d="M60 8C60 8 95 45 95 74a35 35 0 0 1-70 0C25 45 60 8 60 8Z"/></clipPath></defs>' +
  '<path d="M60 8C60 8 95 45 95 74a35 35 0 0 1-70 0C25 45 60 8 60 8Z" fill="url(#dl1)"/><g clip-path="url(#dlc)"><path d="M20 93C34 85 46 100 60 93S86 85 100 93V120H20Z" fill="url(#dl2)" opacity=".92"/></g>' +
  '<path d="M60 8C60 8 95 45 95 74a35 35 0 0 1-70 0C25 45 60 8 60 8Z" fill="none" stroke="url(#dl2)" stroke-width="2"/><path d="M44 80V50L76 80V50" fill="none" stroke="#FFF6EA" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

const NAMA_SLOT = (kode: string): string => {
  const m = /^(makan|selingan)_(\d+)$/.exec(kode);
  return m ? `${m[1] === "makan" ? "Makan" : "Selingan"} ${m[2]}` : kode;
};
const NAMA_PERAN: Record<string, string> = {
  staple: "Makanan pokok", protein_hewani: "Protein hewani", protein_nabati: "Protein nabati", sayur: "Sayuran", buah: "Buah", lemak: "Lemak tambahan", susu: "Susu dan olahan",
};
const KELAS: Record<string, string> = { murah: "Murah", sedang: "Sedang", mahal: "Mahal" };

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
  return `<svg class="dok-pita" viewBox="0 0 300 34" role="img" aria-label="Posisi pada pita standar">
    <rect x="0" y="12" width="300" height="10" rx="5" fill="#EFE6DA"/>
    <rect x="0" y="12" width="66" height="10" rx="5" fill="#E7A9B4"/>
    <rect x="66" y="12" width="168" height="10" fill="#B9D8C4"/>
    <rect x="234" y="12" width="66" height="10" rx="5" fill="#EBD39A"/>
    <g font-size="7.5" fill="#6B5A52" text-anchor="middle" font-family="sans-serif"><text x="27" y="32">-3</text><text x="66" y="32">-2</text><text x="123" y="32">-1</text><text x="150" y="32">Median</text><text x="183" y="32">+1</text><text x="234" y="32">+2</text><text x="276" y="32">+3</text></g>
    <path d="M${(pin * 3).toFixed(1)} 9l-5.5-8h11z" fill="${nada(kat) === "baik" ? "#2E7D55" : nada(kat) === "bahaya" ? "#B3263E" : "#B07A12"}"/>
  </svg>`;
}

function kartuIndikator(judul: string, label: string, posisi: string | null, kat: string): string {
  const n = nada(kat);
  return `<div class="dok-ind dok-ind--${n}"><div class="dok-ind__j">${e(judul)}</div><div class="dok-ind__h">${e(kapital(label))}</div>${pita(posisi, kat)}</div>`;
}

function blokStatus(c: KonteksEkspor): string {
  const s = c.r.status;
  const m = c.masukan.status;
  const tanda = c.r.rujukan.tingkat === "rujuk";
  return `<section class="dok-bagian">
    <h2 class="dok-h2">Status pertumbuhan</h2>
    <table class="dok-meta"><tr><th>Usia</th><td>${m.umur.bulan} bulan ${m.umur.hari} hari</td><th>Jenis kelamin</th><td>${m.jk === "L" ? "Laki-laki" : "Perempuan"}</td></tr>
    <tr><th>Berat badan</th><td>${fmt(m.bb_kg, 1)} kg</td><th>Panjang/tinggi</th><td>${fmt(s.panjang_dipakai_cm, 1)} cm${m.cara_ukur === "berdiri" ? " (ukur berdiri, sudah dikoreksi)" : ""}</td></tr></table>
    <div class="dok-ind-baris">
      ${kartuIndikator("Berat badan menurut umur", LABEL_BBU[s.bbu.kategori].replace(/ menurut umur$/, ""), s.bbu.posisi, s.bbu.kategori)}
      ${kartuIndikator("Panjang badan menurut umur", LABEL_PBU[s.pbu.kategori].replace(/ menurut umur$/, ""), s.pbu.posisi, s.pbu.kategori)}
      ${kartuIndikator("Berat menurut panjang badan", (LABEL_BBPB[s.bbpb.kategori] ?? "").replace(/^berat badan menurut panjang badan masuk kategori /, ""), s.bbpb.posisi, s.bbpb.kategori)}
    </div>
    ${tanda ? `<div class="dok-rujuk"><strong>Perlu rujukan ke petugas kesehatan.</strong><ul>${c.r.rujukan.alasan.map((a) => `<li>${e(c.labelAlasan(a))}</li>`).join("")}</ul><p>Bawa Buku KIA/KMS dan sampaikan tanda bahaya serta ukuran terakhir kepada petugas kesehatan. Menu tidak disusun pada kondisi ini.</p></div>` : ""}
    ${c.penjelasan && !tanda ? `<div class="dok-penjelasan"><h3 class="dok-h3">Penjelasan sederhana</h3><div class="md">${renderMarkdown(c.penjelasan.teks)}</div>${c.penjelasan.ai ? `<p class="dok-catatan">${e(PERINGATAN_AI)}</p>` : ""}</div>` : ""}
  </section>`;
}

function blokMenu(c: KonteksEkspor): string {
  const p = c.r.pola;
  if (!p) return `<section class="dok-bagian"><h2 class="dok-h2">Menu dan belanja</h2><p class="dok-kosong">Menu tidak disusun pada kondisi ini.</p></section>`;
  const hari = p.hari
    .map(
      (h) => `<div class="dok-hari"><div class="dok-hari__kepala"><h3 class="dok-h3">Hari ke-${h.hari_ke}</h3><span>${Math.round(h.energi_kkal)} dari ${h.energi_target_kkal} kkal (${h.energi_persen_target}%) · ${h.jumlah_kelompok_mdd} dari 8 kelompok makanan</span></div>
      <table class="dok-tabel"><thead><tr><th>Waktu</th><th>Bahan</th><th>Jenis</th><th class="r">Berat (g)</th></tr></thead><tbody>
      ${h.slot
        .map((sl) => sl.item.map((it, i) => `<tr>${i === 0 ? `<td rowspan="${sl.item.length}" class="dok-slot">${e(NAMA_SLOT(sl.kode))}</td>` : ""}<td>${e(DATA.bahanAtribut.bahan.find((b) => b.id === it.bahan_id)?.nama ?? it.bahan_id)}</td><td>${e(NAMA_PERAN[it.peran] ?? it.peran)}</td><td class="r">${it.gram}</td></tr>`).join(""))
        .join("")}
      </tbody></table></div>`,
    )
    .join("");
  const b = c.r.belanja;
  return `<section class="dok-bagian">
    <h2 class="dok-h2">Contoh menu ${p.hari.length} hari</h2>
    <p class="dok-catatan">Pita usia ${e(LABEL_PITA[p.pita])}. Contoh disusun otomatis dari aturan program dan sama setiap kali dengan masukan yang sama.</p>
    ${hari}
  </section>
  ${
    b
      ? `<section class="dok-bagian dok-baru"><h2 class="dok-h2">Daftar belanja ${p.hari.length} hari</h2>
    <p class="dok-catatan">Jumlah beli sudah memperhitungkan bagian yang tidak dimakan dan dibulatkan ke atas per 5 gram. Kelas harga bersifat relatif, bukan harga pasar. Murah ${b.jumlah_per_kelas.murah} · Sedang ${b.jumlah_per_kelas.sedang} · Mahal ${b.jumlah_per_kelas.mahal}.</p>
    <table class="dok-tabel dok-tabel--rapat"><thead><tr><th class="cek"></th><th>Bahan</th><th>Jenis</th><th class="r">Disajikan (g)</th><th class="r">Beli (g)</th><th>Kelas harga</th></tr></thead><tbody>
    ${b.item.map((i) => `<tr><td class="cek"><span class="dok-kotak"></span></td><td>${e(i.nama)}</td><td>${e(NAMA_PERAN[i.peran] ?? i.peran)}</td><td class="r">${i.gram_disajikan}</td><td class="r">${i.gram_beli}</td><td>${e(KELAS[i.kelas_harga] ?? i.kelas_harga)}</td></tr>`).join("")}
    </tbody></table></section>`
      : ""
  }`;
}

function blokGizi(c: KonteksEkspor): string {
  const p = c.r.pola;
  if (!p) return `<section class="dok-bagian"><h2 class="dok-h2">Kecukupan gizi</h2><p class="dok-kosong">Perhitungan gizi tidak tersedia pada kondisi ini.</p></section>`;
  const h = p.hari[Math.min(c.hariIdx, p.hari.length - 1)]!;
  return `<section class="dok-bagian">
    <h2 class="dok-h2">Kecukupan gizi · Hari ke-${h.hari_ke}</h2>
    <p class="dok-catatan">Hanya makanan dalam menu yang dihitung; ASI dan makanan lain tidak dihitung. Batang penuh berarti 100% AKG atau lebih. Hitungan zat yang datanya belum lengkap ditandai bintang dan menunjukkan batas bawah.</p>
    <table class="dok-tabel dok-tabel--rapat"><thead><tr><th>Zat gizi</th><th class="r">Dari menu</th><th class="r">AKG</th><th class="r">%</th><th class="bar">Pemenuhan</th></tr></thead><tbody>
    ${h.akg.zat
      .map((z) => {
        const w = Math.max(0, Math.min(100, z.persen));
        const warna = z.persen >= 80 ? "#2E7D55" : z.persen >= 50 ? "#B07A12" : "#B3263E";
        return `<tr><td>${e(kapital(NAMA_ZAT[z.zat] ?? z.zat))}${z.lengkap ? "" : " *"}</td><td class="r">${fmt(z.nilai, 1)} ${satuanZat(z.zat)}</td><td class="r">${fmt(z.akg, 0)} ${satuanZat(z.zat)}</td><td class="r"><strong>${z.persen}</strong></td><td class="bar"><svg viewBox="0 0 100 8" preserveAspectRatio="none"><rect width="100" height="8" rx="4" fill="#EFE6DA"/><rect width="${w}" height="8" rx="4" fill="${warna}"/></svg></td></tr>`;
      })
      .join("")}
    </tbody></table>
    <p class="dok-catatan">Aplikasi tidak meresepkan dosis suplemen. Bila ada celah zat gizi, diskusikan bersama bidan atau dokter.</p>
  </section>`;
}

function blokKartu(c: KonteksEkspor): string {
  const s = c.r.status;
  const m = c.masukan.status;
  const h1 = c.r.pola?.hari[0];
  return `<section class="dok-kartu">
    <div class="dok-kartu__atas">${LOGO}<div><div class="dok-kartu__merek">NUTRIVA</div><div class="dok-kartu__sub">Ringkasan MPASI</div></div></div>
    <div class="dok-kartu__nama">${e(c.labelContoh)}</div>
    <div class="dok-kartu__ukur">${m.umur.bulan} bulan · ${fmt(m.bb_kg, 1)} kg · ${fmt(s.panjang_dipakai_cm, 1)} cm</div>
    <div class="dok-ind-baris dok-ind-baris--kartu">
      ${kartuIndikator("BB menurut umur", LABEL_BBU[s.bbu.kategori].replace(/ menurut umur$/, ""), s.bbu.posisi, s.bbu.kategori)}
      ${kartuIndikator("PB menurut umur", LABEL_PBU[s.pbu.kategori].replace(/ menurut umur$/, ""), s.pbu.posisi, s.pbu.kategori)}
      ${kartuIndikator("BB menurut PB", (LABEL_BBPB[s.bbpb.kategori] ?? "").replace(/^berat badan menurut panjang badan masuk kategori /, ""), s.bbpb.posisi, s.bbpb.kategori)}
    </div>
    ${c.r.rujukan.tingkat === "rujuk" ? `<div class="dok-rujuk"><strong>Perlu rujukan ke petugas kesehatan.</strong> Bawa Buku KIA/KMS.</div>` : h1 ? `<div class="dok-kartu__menu"><strong>Contoh menu hari pertama</strong><ul>${h1.slot.map((sl) => `<li><b>${e(NAMA_SLOT(sl.kode))}:</b> ${sl.item.map((it) => `${e(DATA.bahanAtribut.bahan.find((b) => b.id === it.bahan_id)?.nama ?? it.bahan_id)} ${it.gram} g`).join(", ")}</li>`).join("")}</ul><span>${h1.jumlah_kelompok_mdd} dari 8 kelompok makanan · ${h1.energi_persen_target}% target energi</span></div>` : ""}
    <div class="dok-kartu__kaki">Alat bantu edukasi, bukan diagnosis. Konsultasikan dengan petugas kesehatan.</div>
  </section>`;
}

function blokJejak(c: KonteksEkspor): string {
  const aktif = new Set<string>([c.r.status.bbu.klaim_id, c.r.status.bbpb.klaim_id, c.r.status.pbu.klaim_id, ...c.r.status.klaim_asumsi, ...(c.r.pola?.klaim_ids ?? []), ...(c.r.belanja?.klaim_ids ?? [])]);
  const ringkas = (t: string): string => {
    const k = t.split(/(?<=[.;])\s+/).filter((x) => !/dosen|verifikasi|PjBL|AUD-\d|DIKARANTINA|pemeriksa|dibaca visual|keputusan [A-Z]-\d|hitung ulang/i.test(x));
    return (k.length ? k : [t.split(/(?<=[.;])\s+/)[0] ?? ""]).join(" ").replace(/\s*\(Sumber:[^)]*\)\s*$/i, "");
  };
  return `<section class="dok-bagian">
    <h2 class="dok-h2">Jejak klaim dan sumber</h2>
    <table class="dok-meta"><tr><th>Versi mesin</th><td>${e(c.r.versi.engine)}</td><th>Versi data</th><td>${e(c.r.versi.data)}</td></tr><tr><th>Versi aturan</th><td>${e(c.r.versi.rules)}</td><th>Kode menu</th><td>${e(c.masukan.pola.benih.replace(/^rona-sintetis-/, "").toUpperCase())}</td></tr></table>
    <h3 class="dok-h3">Klaim yang dipakai pada hasil ini</h3>
    <table class="dok-tabel dok-tabel--rapat"><thead><tr><th>ID</th><th>Pernyataan</th><th>Sumber</th></tr></thead><tbody>
    ${klaimData.klaim.filter((k) => aktif.has(k.id)).map((k) => `<tr><td class="mono">${e(k.id)}</td><td>${e(ringkas(k.pernyataan))}</td><td class="mono">${e(k.sumber.map((s) => s.sumber_id).join(", ") || "—")}</td></tr>`).join("")}
    </tbody></table>
    <h3 class="dok-h3">Pustaka sumber</h3>
    <ol class="dok-sumber">${sumberData.sumber.map((s) => `<li><strong class="mono">${e(s.id)}</strong> ${e(s.judul)}</li>`).join("")}</ol>
  </section>`;
}

const JUDUL: Record<JenisEkspor, string> = { lengkap: "Laporan pendampingan MPASI", status: "Status pertumbuhan", menu: "Menu dan belanja", gizi: "Kecukupan gizi", kartu: "Kartu ringkasan", jejak: "Jejak klaim dan sumber" };

export function judulBerkas(jenis: JenisEkspor, c: KonteksEkspor): string {
  return `NUTRIVA - ${JUDUL[jenis]} - ${c.labelContoh.split(" · ")[0] ?? "Contoh"}`;
}

export function bangunDokumen(jenis: JenisEkspor, c: KonteksEkspor): string {
  const tgl = c.tanggal.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  const m = c.masukan.status;
  const sampul = `<header class="dok-sampul">
    <div class="dok-sampul__logo">${LOGO}</div>
    <div class="dok-sampul__merek">NUTRIVA</div>
    <div class="dok-sampul__motto">Gizi 1000 hari pertama kehidupan</div>
    <div class="dok-sampul__garis"></div>
    <h1 class="dok-sampul__judul">${e(JUDUL[jenis])}</h1>
    <div class="dok-sampul__info"><div><span>Contoh</span><strong>${e(c.labelContoh.split(" · ")[0] ?? "")}</strong></div><div><span>Usia</span><strong>${m.umur.bulan} bulan</strong></div><div><span>Dicetak</span><strong>${e(tgl)}</strong></div></div>
  </header>`;
  let isi = "";
  if (jenis === "kartu") isi = blokKartu(c);
  else if (jenis === "status") isi = blokStatus(c);
  else if (jenis === "menu") isi = blokMenu(c);
  else if (jenis === "gizi") isi = blokGizi(c);
  else if (jenis === "jejak") isi = blokJejak(c);
  else isi = blokStatus(c) + `<div class="dok-baru"></div>` + blokMenu(c) + `<div class="dok-baru"></div>` + blokGizi(c);
  const penuh = jenis === "lengkap";
  const ringkasHeader = jenis === "kartu" ? "" : penuh ? sampul : `<header class="dok-kepala"><span class="dok-kepala__logo">${LOGO}</span><div><div class="dok-kepala__merek">NUTRIVA</div><div class="dok-kepala__judul">${e(JUDUL[jenis])} · ${e(c.labelContoh.split(" · ")[0] ?? "")}</div></div><div class="dok-kepala__tgl">${e(tgl)}</div></header>`;
  return `<div class="dok dok--${jenis}">
    ${ringkasHeader}
    <main class="dok-isi">${isi}</main>
    <footer class="dok-kaki"><span>NUTRIVA · Gizi 1000 HPK</span><span class="dok-kaki__penulis">E.13.1</span><span>Alat bantu edukasi, bukan diagnosis</span></footer>
  </div>`;
}

let judulTersimpan: string | null = null;

/** Pasang dokumen ke halaman lalu buka dialog cetak. Dokumen disembunyikan di layar dan hanya terlihat saat mencetak. */
export function cetakDokumen(html: string, judul: string): void {
  if (typeof document === "undefined" || typeof window === "undefined") return;
  document.getElementById("dokumen-cetak")?.remove();
  const el = document.createElement("div");
  el.id = "dokumen-cetak";
  el.setAttribute("aria-hidden", "true");
  el.innerHTML = html;
  document.body.appendChild(el);
  const judulAsal = judulTersimpan ?? document.title;
  judulTersimpan = judulAsal;
  document.title = judul;
  document.documentElement.classList.add("nv-cetak");
  const pulih = (): void => {
    document.title = judulAsal;
    judulTersimpan = null;
    document.documentElement.classList.remove("nv-cetak");
    document.getElementById("dokumen-cetak")?.remove();
    window.removeEventListener("afterprint", pulih);
  };
  window.addEventListener("afterprint", pulih);
  // Beri peramban satu bingkai untuk menata dokumen sebelum dialog cetak terbuka.
  requestAnimationFrame(() => setTimeout(() => window.print(), 60));
}
