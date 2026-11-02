import type { MuatanAi } from "./kontrak";
import { LABEL_BBPB, LABEL_BBU, LABEL_CELAH, LABEL_PBU, LABEL_PITA, NAMA_ZAT } from "./glosarium";
import { kataDikenal } from "./kosakata";
import { adaMarkupTerlarang, teksPolos } from "./markdown";

/**
 * Validator keluaran AI (K-08). Dipakai di Worker dan di klien. Fungsi murni.
 * Ini pagar berbasis aturan, bukan pemahaman makna: ia mengurangi risiko, tidak menjaminnya.
 * Karena itu teks AI selalu berdampingan dengan hasil mesin dan peringatan, dan gagal-aman ke templat.
 * Pemeriksaan: normalisasi Unicode, panjang, markup/tautan, angka (berpasangan dengan zatnya), kata dan tindakan
 * terlarang, bahasa, frasa status yang tidak ada di muatan, klaim "normal" palsu, dan keharusan merujuk.
 */
export type AlasanTolak =
  | "bukan_teks"
  | "terlalu_pendek"
  | "terlalu_panjang"
  | "terlalu_banyak_baris"
  | "ada_tautan_atau_markup"
  | "karakter_aneh"
  | "kata_di_luar_daftar"
  | "melarang_rujukan"
  | "angka_asing"
  | "kata_terlarang"
  | "bukan_bahasa_indonesia"
  | "status_asing"
  | "klaim_normal_padahal_tidak"
  | "tanpa_rujukan";

export type HasilValidasi = { ok: true; teks: string } | { ok: false; alasan: AlasanTolak[] };

// klaim: n/a — batas rekayasa panjang keluaran AI, bukan konstanta ilmiah
const PANJANG_MIN = 40;
// klaim: n/a — batas rekayasa panjang keluaran AI
const PANJANG_MAKS = 2400;
// klaim: n/a — batas rekayasa jumlah baris
const BARIS_MAKS = 40;

const KONFUSABEL: Record<string, string> = {
  а: "a", е: "e", о: "o", р: "p", с: "c", у: "y", х: "x", к: "k", і: "i", ј: "j", ѕ: "s", һ: "h", ӏ: "l", в: "b", м: "m", н: "h", т: "t",
  α: "a", ο: "o", ρ: "p", ν: "v", ι: "i", κ: "k", τ: "t", υ: "u", χ: "x", ε: "e",
};

/** Normalisasi: NFKC, buang karakter format/tak terlihat dan tanda gabung, petakan huruf serupa, huruf kecil. */
export function normalisasi(t: string): string {
  let s = t.normalize("NFKC").replace(/\p{Cf}/gu, "").normalize("NFD").replace(/\p{M}/gu, "").normalize("NFC");
  s = s.replace(/[а-яёα-ωѕіј]/giu, (c) => KONFUSABEL[c.toLowerCase()] ?? c);
  return s.toLowerCase().replace(/[  -   　]/g, " ");
}

/** Hanya huruf a-z, untuk mendeteksi kata yang dipisah spasi, tanda hubung, atau titik. */
const KATA_GLOSARIUM: ReadonlySet<string> = new Set(
  [...Object.values(LABEL_BBU), ...Object.values(LABEL_PBU), ...Object.values(LABEL_BBPB), ...Object.values(LABEL_CELAH), ...Object.values(LABEL_PITA), ...Object.values(NAMA_ZAT), "permenkes", "hpk", "mdd", "akg", "asi", "kkal"]
    .join(" ")
    .toLowerCase()
    .match(/[a-z]+/g) ?? [],
);

const rapat = (s: string) => s.replace(/[^a-z]/g, "");

const NEGASI = /(?:^|[^a-z])(?:tidak|bukan|tanpa|belum|jangan|hindari|hindarkan|bebas dari|tak)(?:[^a-z.,;:!?]+[a-z]+){0,3}[^a-z.,;:!?]+$/;
const BATAS_KLAUSA = /(?:[.,;:!?]|\b(?:tetapi|tapi|melainkan|namun|sedangkan|lalu|kemudian|dan|atau)\b)/g;
/** Negasi hanya berlaku dalam klausa yang sama: berhenti di tanda baca dan konjungsi kontras. */
function negasiSebelum(s: string, i: number): boolean {
  const jendela = s.slice(Math.max(0, i - 40), i);
  let mulai = 0;
  for (const mm of jendela.matchAll(BATAS_KLAUSA)) mulai = (mm.index ?? 0) + mm[0].length;
  return NEGASI.test(jendela.slice(mulai));
}

/** Kata terlarang dengan akhiran terbuka. `negasiOk`: boleh muncul bila dinegasikan ("tanpa suplemen"). */
const POLA_KATA: { re: RegExp; negasiOk: boolean }[] = [
  { re: /(?:^|[^a-z])(?:ber|peng|meng|me|di|ter)?obat\w*/g, negasiOk: true },
  { re: /(?:^|[^a-z])suplemen\w*/g, negasiOk: true },
  { re: /(?:^|[^a-z])madu\w*/g, negasiOk: true },
  { re: /(?:^|[^a-z])(?:vitamin tambahan|tambahan vitamin|multivitamin|vitamin penambah)/g, negasiOk: true },
  { re: /(?:^|[^a-z])(?:dosis|sirup|tablet|kapsul|tetes\w*|sendok\w*|injeksi|infus|antibiotik\w*|resep dokter|terapi\w*)(?![a-z])/g, negasiOk: false },
  { re: /(?:^|[^a-z])(?:vaksin\w*|imunisasi\w*|jamu\w*|herbal\w*)/g, negasiOk: true },
  { re: /(?:^|[^a-z])(?:stunt\w*|wasting|diagnos\w*|didiagnosis|penyakit\w*|gejala\w*|menderita|mengalami penyakit)/g, negasiOk: false },
  { re: /(?:^|[^a-z])(?:anemia|diare|tbc|tuberkulosis|kanker|diabetes|infeksi\w*|cacing\w*|marasmus|kwashiorkor|rakitis|kerdil|campak|demam berdarah|pneumonia|malaria)(?![a-z])/g, negasiOk: false },
  { re: /(?:^|[^a-z])(?:sembuh\w*|menyembuhkan|dijamin|menjamin|jaminan|garansi|pastinya|pasti)(?![a-z])/g, negasiOk: false },
  { re: /(?:^|[^a-z])(?:rokok|alkohol)(?![a-z])/g, negasiOk: false },
  { re: /(?:^|[^a-z])(?:dipastikan|terjamin|kesembuhan|ampuh|efektif mengatasi)(?![a-z])/g, negasiOk: false },
  { re: /(?:^|[^a-z])(?:minyak ikan|pil|serbuk|bubuk|sachet|sirop|ramuan|penambah gizi|bubuk gizi|susu sapi|susu kental|susu segar|menyapih|sapih\w*|puasa|berpuasa|diet|kurang darah|kekurangan (?:vitamin|zat|darah)|busung|gangguan (?:tumbuh|pertumbuhan))(?![a-z])/g, negasiOk: false },
];
/** Kata panjang yang dicek juga pada teks tanpa spasi/tanda baca (menangkap "s u p l e m e n", "su-plemen"). */
const KATA_RAPAT = ["suplemen", "stunting", "diagnosis", "antibiotik", "multivitamin", "kwashiorkor", "marasmus", "rakitis", "penyakit", "supplement", "medicine", "treatment", "antibiotic", "dosage", "imunisasi", "menyembuhkan"];
const POLA_TINDAKAN: RegExp[] = [
  /(?:hentikan|hentikanlah|stop|kurangi|berhenti|setop)(?:[^a-z]+[a-z]+){0,2}[^a-z]+asi(?![a-z])/,
  /(?:beri|berikan|tambah|tambahkan|campur|campurkan|taburkan|minum|minumkan|ganti|gantikan)(?:[^a-z]+[a-z]+){0,3}[^a-z]+(?:garam|gula|air gula|susu formula|kental manis|kopi|teh|minyak ikan)(?![a-z])/,
  /(?:^|[^a-z])susu formula(?![a-z])/,
  /(?:beri|berikan|diberi|diberikan|minum|minumkan|konsumsi|mengonsumsi)(?:\s+(?:anak|bayi|si kecil|dia))?\s+(?:[a-z]+\s+)?vitamin(?![a-z])/,
  /butir\s+(?:vitamin|zat)|cairan\s+vitamin|vitamin\s+(?:cair|tetes)|vitamin\s+[a-z]\d{0,2}\s+tambahan|tambahan\s+vitamin/,
  /minum\w*(?:[^a-z]+[a-z]+){0,2}[^a-z]+(?:zat besi|vitamin|kalsium|seng|obat|tablet)(?![a-z])/,
];
const KATA_INGGRIS = ["the", "and", "should", "child", "with", "every", "daily", "your", "need", "needs", "for", "that", "this", "are", "visit", "eat", "more", "give", "also", "can", "will"];
const POLA_TAUTAN = /(https?:|www\.|:\/\/|\]\(|\[\.\]|\(\.\)|hxxp|@[a-z0-9]|\b[a-z0-9][a-z0-9-]*\.[a-z]{2,}\b|\bdot\s*(?:com|id|org|net|co|me|ly|io|xyz|app|link)\b|<[^>]*>|```|`|\*\*|#{1,6}\s|&#?\w+;)/i;

const SATUAN_BOLEH = ["tahun", "ekor", "siung", "lembar", "genggam", "mangkuk", "piring", "kali", "hari", "minggu", "bulan", "butir", "ikat", "buah", "potong", "gelas", "porsi", "jenis", "macam", "kelompok", "kelompok makanan", "bahan", "kali sehari"];
const KATA_BILANGAN_BESAR = /(?:^|[^a-z])(?:puluh|ratus|ribu|juta|belas|setengah|separuh|seperempat|sepertiga|per(?:dua|tiga|empat|lima|enam|tujuh|delapan|sembilan|sepuluh)|per)(?![a-z])|(?:nol|satu|dua|tiga|empat|lima|enam|tujuh|delapan|sembilan|sepuluh|sebelas)(?:\s+(?:nol|satu|dua|tiga|empat|lima|enam|tujuh|delapan|sembilan))*\s+persen/;
const BILANGAN_DOSIS = /(?:^|[^a-z])(?:nol|satu|dua|tiga|empat|lima|enam|tujuh|delapan|sembilan|sepuluh|sebelas|setengah|separuh|seperempat|[0-9]+)\s+(?:sendok|tetes|mg|ml|miligram|mililiter|cc|kapsul|tablet|butir obat|sachet|botol)/;

/** Frasa status yang hanya boleh muncul bila kategorinya ada di muatan. Urut dari yang terpanjang. */
const FRASA_STATUS: { frasa: string; tanda: (m: MuatanAi) => boolean }[] = [
  { frasa: "sangat pendek", tanda: (m) => m.status?.pbu === "sangat_pendek" },
  { frasa: "berat badan sangat kurang", tanda: (m) => m.status?.bbu === "bb_sangat_kurang" },
  { frasa: "sangat tinggi", tanda: (m) => m.status?.pbu === "tinggi" },
  { frasa: "risiko gizi lebih", tanda: (m) => m.status?.bbpb === "risiko_gizi_lebih" },
  { frasa: "berisiko gizi lebih", tanda: (m) => m.status?.bbpb === "risiko_gizi_lebih" },
  { frasa: "berisiko lebih", tanda: (m) => m.status?.bbu === "risiko_bb_lebih" || m.status?.bbpb === "risiko_gizi_lebih" },
  { frasa: "risiko lebih", tanda: (m) => m.status?.bbu === "risiko_bb_lebih" || m.status?.bbpb === "risiko_gizi_lebih" },
  { frasa: "gizi buruk", tanda: (m) => m.status?.bbpb === "gizi_buruk" },
  { frasa: "gizi kurang", tanda: (m) => m.status?.bbpb === "gizi_kurang" },
  { frasa: "gizi lebih", tanda: (m) => m.status?.bbpb === "gizi_lebih" || m.status?.bbpb === "risiko_gizi_lebih" },
  { frasa: "kekurangan gizi", tanda: (m) => m.status?.bbpb === "gizi_kurang" || m.status?.bbpb === "gizi_buruk" },
  { frasa: "kurang gizi", tanda: (m) => m.status?.bbpb === "gizi_kurang" || m.status?.bbpb === "gizi_buruk" || (m.status !== undefined && m.status.bbu !== "bb_normal" && m.status.bbu !== "risiko_bb_lebih") },
  { frasa: "berat badan kurang", tanda: (m) => m.status?.bbu === "bb_kurang" || m.status?.bbu === "bb_sangat_kurang" },
  { frasa: "berat badan anak kurang", tanda: (m) => m.status?.bbu === "bb_kurang" || m.status?.bbu === "bb_sangat_kurang" },
  { frasa: "kurang berat", tanda: (m) => m.status?.bbu === "bb_kurang" || m.status?.bbu === "bb_sangat_kurang" },
  { frasa: "kelebihan berat", tanda: (m) => m.status?.bbpb === "obesitas" || m.status?.bbpb === "gizi_lebih" || m.status?.bbu === "risiko_bb_lebih" },
  { frasa: "berat badan berlebih", tanda: (m) => m.status?.bbpb === "obesitas" || m.status?.bbpb === "gizi_lebih" || m.status?.bbu === "risiko_bb_lebih" },
  { frasa: "tinggi untuk usia", tanda: (m) => m.status?.pbu === "tinggi" },
  { frasa: "tinggi menurut umur", tanda: (m) => m.status?.pbu === "tinggi" },
  { frasa: "obesitas", tanda: (m) => m.status?.bbpb === "obesitas" },
  { frasa: "pendek", tanda: (m) => m.status?.pbu === "pendek" || m.status?.pbu === "sangat_pendek" },
  { frasa: "kegemukan", tanda: (m) => m.status?.bbpb === "obesitas" || m.status?.bbpb === "gizi_lebih" },
  { frasa: "gemuk", tanda: (m) => m.status?.bbpb === "obesitas" || m.status?.bbpb === "gizi_lebih" },
  { frasa: "kurus", tanda: (m) => m.status?.bbpb === "gizi_kurang" || m.status?.bbpb === "gizi_buruk" },
];

function periksaAngka(n: string, m: MuatanAi): boolean {
  // ASCII saja setelah NFKC; digit skrip lain ditolak di pemanggil.
  const persenOk = new Set<string>([...(m.akg ?? []).map((z) => String(z.persen)), ...(m.menu ? [String(m.menu.energi_persen_target)] : [])]);
  const ALIAS: (readonly [string, string])[] = [
    ["vit_c_mg", "vit c"], ["vit_a_rae_mcg", "vit a"], ["vit_d_mcg", "vit d"], ["vit_b12_mcg", "vit b12"], ["besi_mg", "besi"], ["besi_mg", "fe"],
    ["kalsium_mg", "kalsium"], ["seng_mg", "seng"], ["protein_g", "protein"], ["lemak_g", "lemak"], ["serat_g", "serat"],
  ];
  const nama = [...Object.entries(NAMA_ZAT).map(([k, v]) => [k, v.toLowerCase()] as const), ...ALIAS];
  const kecil = (v: string, satuanSesudah: string): boolean => {
    const kata = /^([a-z]+)(?:\s+([a-z]+))?/.exec(satuanSesudah);
    if (!kata || Number(v) > 12) return false;
    const satu = kata[1] as string;
    const dua = kata[2] ? `${satu} ${kata[2]}` : satu;
    return SATUAN_BOLEH.includes(satu) || SATUAN_BOLEH.includes(dua);
  };

  const tokenRe = /\d+(?:[.,]\d+)?/g;
  for (const mm of n.matchAll(tokenRe)) {
    const v = mm[0];
    const i = mm.index ?? 0;
    const sesudah = n.slice(i + v.length).replace(/^\s+/, "");
    const sebelum = n.slice(Math.max(0, i - 60), i);
    if (/^(?:persen|%)/.test(sesudah)) {
      if (!persenOk.has(v)) return false;
      const jendela = sebelum.slice(-45);
      let terakhir = -1;
      let kunciZat = "";
      for (const [k, label] of nama) {
        const re = new RegExp(`(?:^|[^a-z0-9])${label.replace(/\s+/g, "\\s+")}(?![a-z0-9])`, "g");
        for (const hit of jendela.matchAll(re)) {
          const idx = (hit.index ?? 0) + hit[0].length;
          if (idx >= terakhir) { terakhir = idx; kunciZat = k; }
        }
      }
      if (kunciZat) {
        const harap = kunciZat === "energi_kkal" ? (m.menu ? String(m.menu.energi_persen_target) : undefined) : (m.akg ?? []).find((z) => z.zat === kunciZat)?.persen.toString();
        if (harap !== undefined && harap !== v) return false;
      }
      continue;
    }
    if (/^\/2020|^\/\s*2020/.test(sesudah) || (v === "2020" && /permenkes\s*(?:no\.?\s*)?2\s*\/\s*$/.test(sebelum.replace(/\s+/g, " ")))) continue;
    if (v === "2" && /permenkes\s*$/.test(sebelum)) continue;
    if (v === "1000" && /^(?:hari|hpk)/.test(sesudah)) continue;
    if (v === "5" && /^(?:dari|kelompok)/.test(sesudah)) continue;
    if (v === "8" && /^kelompok/.test(sesudah)) continue;
    if (/^(?:sampai|bulan|dan|-)/.test(sesudah) && m.pita_usia.split("-").includes(v)) continue;
    if (/(?:sampai|dan|-)\s*$/.test(sebelum) && /^bulan/.test(sesudah) && m.pita_usia.split("-").includes(v)) continue;
    if (m.menu && v === String(m.menu.jumlah_kelompok_mdd) && /^(?:dari|kelompok)/.test(sesudah)) continue;
    if (kecil(v, sesudah)) continue;
    return false;
  }
  return true;
}

export function validasiKeluaranAi(teks: unknown, m: MuatanAi): HasilValidasi {
  if (typeof teks !== "string") return { ok: false, alasan: ["bukan_teks"] };
  const asli = teks.replace(/\r\n/g, "\n").trim();
  const alasan: AlasanTolak[] = [];
  if (asli.length < PANJANG_MIN) alasan.push("terlalu_pendek");
  if (asli.length > PANJANG_MAKS) return { ok: false, alasan: ["terlalu_panjang"] }; // keluar dini: tidak mengurai masukan raksasa
  if (asli.split("\n").filter((x) => x.trim() !== "").length > BARIS_MAKS) alasan.push("terlalu_banyak_baris");

  // karakter aneh: digit non-ASCII, karakter kontrol, huruf campur skrip
  if (/[\p{Nd}]/u.test(asli.normalize("NFKC").replace(/[0-9]/g, "")) || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(asli)) alasan.push("karakter_aneh");
  if (/[a-z][а-яёα-ω]|[а-яёα-ω][a-z]/i.test(asli)) alasan.push("karakter_aneh");

  const n = normalisasi(teksPolos(asli)).replace(/tidak ada (?:salahnya|ruginya|salah|ruginya)/g, "boleh");
  if (/\p{L}/u.test(n.replace(/[a-z]/g, ""))) alasan.push("karakter_aneh");
  if (adaMarkupTerlarang(asli) || POLA_TAUTAN.test(n)) alasan.push("ada_tautan_atau_markup");

  if (!periksaAngka(n.replace(/\bvitamin ([a-z])(?:(?<=b)(?:1|2|3|6|12)\b)?/g, "vitamin $1 "), m) || KATA_BILANGAN_BESAR.test(n) || BILANGAN_DOSIS.test(n)) alasan.push("angka_asing");

  // daftar putih kata: setiap kata harus dikenal; huruf tunggal hanya sebagai nama vitamin
  const token = n.match(/[a-z]+/g) ?? [];
  for (let i = 0; i < token.length; i++) {
    const k = token[i] as string;
    if (kataDikenal(k) || KATA_GLOSARIUM.has(k)) continue;
    if (k.length === 1 && /^(?:vitamin|vit)$/.test(token[i - 1] ?? "")) continue;
    alasan.push("kata_di_luar_daftar");
    break;
  }

  let terlarang = false;
  for (const { re, negasiOk } of POLA_KATA) {
    for (const mm of n.matchAll(re)) {
      if (negasiOk && negasiSebelum(n, (mm.index ?? 0) + (mm[0].startsWith(" ") ? 1 : 0))) continue;
      terlarang = true;
    }
  }
  const r = rapat(n);
  if (KATA_RAPAT.some((k) => r.includes(k) && !n.includes(k))) terlarang = true;
  for (const p of POLA_TINDAKAN) {
    const g = new RegExp(p.source, "g");
    for (const mm of n.matchAll(g)) if (!negasiSebelum(n, mm.index ?? 0)) terlarang = true;
  }
  if (terlarang) alasan.push("kata_terlarang");

  const kataInggris = new Set((n.match(/[a-z]+/g) ?? []).filter((k) => KATA_INGGRIS.includes(k)));
  if (kataInggris.size >= 4) alasan.push("bukan_bahasa_indonesia");

  let sisa = n.replace(/[-‐‑–]/g, " ").replace(/\s+/g, " ");
  for (const f of FRASA_STATUS) {
    let dari = 0;
    for (;;) {
      const i = sisa.indexOf(f.frasa, dari);
      if (i < 0) break;
      dari = i + f.frasa.length;
      if (negasiSebelum(sisa, i)) continue;
      if (!f.tanda(m)) { alasan.push("status_asing"); break; }
    }
    if (alasan.includes("status_asing")) break;
    sisa = sisa.split(f.frasa).join(" ");
  }
  if (!alasan.includes("status_asing")) {
    const rr = rapat(n);
    for (const f of new Set(FRASA_STATUS.map((x) => rapat(x.frasa)).filter((x) => x.length >= 6))) {
      if (rr.includes(f) && !sisa.includes(f)) {
        const ada = FRASA_STATUS.find((x) => rapat(x.frasa) === f);
        const spasiBiasa = n.replace(/[-‐‑–]/g, " ").replace(/\s+/g, " ");
        if (ada && !spasiBiasa.includes(ada.frasa) && !ada.tanda(m)) { alasan.push("status_asing"); break; }
      }
    }
  }

  if (/tidak perlu (?:ke|datang|dikunjungi|ditimbang|diperiksa|periksa|kunjung)|posyandu tidak perlu/.test(n)) alasan.push("melarang_rujukan");
  const tidakNormal = m.status !== undefined && (m.status.bbu !== "bb_normal" || m.status.pbu !== "normal" || m.status.bbpb !== "gizi_baik");
  if (tidakNormal) {
    if (/semua hasil[^.]*normal|rentang normal|(?:^|[^a-z])sehat(?![a-z])|tidak perlu (?:ke|datang|dibawa|membawa|diperiksa|periksa|konsultasi|berobat|khawatir|cemas|waspada)|tidak ada masalah|baik baik saja|baik-baik saja/.test(n.replace(/tidak normal|kurang sehat|tidak sehat|belum sehat/g, ""))) alasan.push("klaim_normal_padahal_tidak");
    if (!/posyandu|puskesmas|petugas kesehatan|fasilitas kesehatan|tenaga kesehatan|tenaga medis|klinik|rumah sakit|bidan|dokter/.test(n)) alasan.push("tanpa_rujukan");
  }
  return alasan.length === 0 ? { ok: true, teks: asli.replace(/[\p{Cf}]/gu, "") } : { ok: false, alasan: [...new Set(alasan)] };
}

/* ------------------------------------------------------------------ */
/* Validator resep (fitur resep AI). Bahan dan takaran gram berasal dari mesin; AI hanya merangkai cara masak. */

export interface BahanResepValid {
  nama: string;
  gram: number;
}

// klaim: n/a — batas rekayasa panjang resep
const RESEP_MIN = 200;
// klaim: n/a — batas rekayasa panjang resep
const RESEP_MAKS = 3200;
// klaim: n/a — batas rekayasa jumlah baris resep
const RESEP_BARIS_MAKS = 70;
// klaim: n/a — rentang waktu masak yang masuk akal untuk MPASI rumahan (menit); bukan konstanta ilmiah
const MENIT_MIN = 5;
const MENIT_MAKS = 45;

/** Kosakata pangan dan bumbu umum. Kata ini hanya boleh muncul bila termasuk bahan resep ini. */
const PANGAN_UMUM = [
  "garam", "gula", "penyedap", "msg", "kecap", "saus", "cabai", "cabe", "lada", "merica", "terasi", "santan", "mentega", "margarin", "keju",
  "susu", "kopi", "teh", "mayones", "kaldu", "bawang", "jahe", "kunyit", "ketumbar", "kemiri", "salam", "serai", "lengkuas", "pewarna", "pengawet",
  "minyak", "vetsin", "royco", "masako", "cuka", "sirup", "coklat", "cokelat", "vanili", "madu", "telur", "kacang", "udang", "kepiting", "cumi", "kerang",
  "yogurt", "yoghurt", "anggur", "stroberi", "kiwi", "nanas", "durian", "wijen", "almond", "kenari", "gandum", "terigu", "tepung", "roti", "mie", "mi", "bihun",
  "ayam", "bebek", "sapi", "kambing", "babi", "ikan", "daging", "hati", "tahu", "tempe", "nasi", "beras", "jagung", "kentang", "ubi", "singkong", "wortel", "bayam",
  "brokoli", "tomat", "labu", "buncis", "kangkung", "pisang", "pepaya", "apel", "jeruk", "mangga", "alpukat", "oat", "keju", "krim", "kelapa", "parutan",
];
const AWALAN_PANGAN = ["bawang", "garam", "gula", "minyak", "cabai", "kecap", "saus"];

const KLAIM_MANFAAT = /(?:bagus|baik|bermanfaat|berguna)\s+untuk\s+(?:\w+\s+){0,2}(?:otak|tubuh|tulang|mata|kulit|daya|kecerdasan|imun|pertumbuhan|tumbuh|kesehatan)|menyehatkan|meningkatkan|daya tahan|kecerdasan|cerdas|menguatkan|memperkuat|menambah nafsu|kaya (?:akan )?(?:zat|vitamin|protein|nutrisi|gizi)|mencegah|mengatasi|bergizi tinggi|superfood|nutrisi lengkap|tumbuh (?:kembang|optimal)|mendukung (?:tumbuh|pertumbuhan|kesehatan|otak)/;

const KATA_ANGKA = /(?:^|[^a-z])(?:nol|satu|dua|tiga|empat|lima|enam|tujuh|delapan|sembilan|sepuluh|sebelas|seratus|ratus|puluh|belas|setengah|separuh|seperempat|sepertiga)\s+(?:gram|gr|g|menit|jam)(?![a-z])/;

function tokenBahan(nama: string): string[] {
  return normalisasi(nama).replace(/\([^)]*\)/g, " ").match(/[a-z]{3,}/g) ?? [];
}

/** Negasi ketat: hanya "tanpa X" atau "tidak perlu/usah (menambah) X", boleh berantai dengan dan/atau. */
function negasiKetat(n: string, i: number): boolean {
  const jendela = n.slice(Math.max(0, i - 70), i);
  return /(?:^|[^a-z])(?:tanpa|(?:tidak|tak) (?:perlu|usah)(?: (?:menambah(?:kan)?|memakai|menggunakan|diberi|ditambah(?:kan)?))?)\s+(?:[a-z]+\s*(?:,|\bdan\b|\batau\b)\s*(?:tanpa\s+)?)*$/.test(jendela);
}

/**
 * Validator resep versi longgar: resep selalu tampil bersama tanda "ditulis AI, bisa keliru", jadi pagar dibatasi pada
 * hal yang berbahaya atau merusak tampilan: markup/tautan, karakter tipuan, obat/suplemen/dosis/penyakit, madu
 * (berisiko bagi bayi), serta panjang. Bahan dan gram resmi selalu ditampilkan mesin terpisah dari teks AI.
 */
export function validasiResep(teks: unknown, _bahan: readonly BahanResepValid[] = [], _leksikon: ReadonlySet<string> = new Set()): HasilValidasi {
  if (typeof teks !== "string") return { ok: false, alasan: ["bukan_teks"] };
  const asli = teks.replace(/\r\n/g, "\n").trim();
  const alasan: AlasanTolak[] = [];
  if (asli.length < 80) alasan.push("terlalu_pendek");
  if (asli.length > RESEP_MAKS) return { ok: false, alasan: ["terlalu_panjang"] };
  if (asli.split("\n").filter((x) => x.trim() !== "").length > RESEP_BARIS_MAKS) alasan.push("terlalu_banyak_baris");
  if (/[\p{Nd}]/u.test(asli.normalize("NFKC").replace(/[0-9]/g, "")) || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(asli)) alasan.push("karakter_aneh");
  if (/[a-z][а-яёα-ω]|[а-яёα-ω][a-z]/i.test(asli)) alasan.push("karakter_aneh");

  const n = normalisasi(teksPolos(asli)).replace(/hati[- ]hati/g, "waspada");
  if (adaMarkupTerlarang(asli) || POLA_TAUTAN.test(n)) alasan.push("ada_tautan_atau_markup");

  let terlarang = false;
  for (const { re, negasiOk } of POLA_KATA) {
    for (const mm of n.matchAll(re)) {
      if (negasiOk && negasiSebelum(n, (mm.index ?? 0) + (mm[0].startsWith(" ") ? 1 : 0))) continue;
      terlarang = true;
    }
  }
  const r = rapat(n);
  if (KATA_RAPAT.some((k) => r.includes(k) && !n.includes(k))) terlarang = true;
  if (terlarang) alasan.push("kata_terlarang");

  const kataInggris = new Set((n.match(/[a-z]+/g) ?? []).filter((k) => KATA_INGGRIS.includes(k)));
  if (kataInggris.size >= 4) alasan.push("bukan_bahasa_indonesia");

  return alasan.length === 0 ? { ok: true, teks: asli.replace(/[\p{Cf}]/gu, "") } : { ok: false, alasan: [...new Set(alasan)] };
}
