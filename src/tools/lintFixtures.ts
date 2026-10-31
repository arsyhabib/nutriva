/**
 * Lint fixture (ADR-0002; AUD-0005-07/S-9; diperketat setelah RPT-0006 AUD-0006-03).
 * Semua fixture uji wajib sintetis dan tidak boleh memuat pengenal pribadi.
 *
 * Batas yang diketahui: nama orang di dalam teks bebas tidak dapat dikenali dengan pasti;
 * pagar ini menangkap pola umum, selebihnya menjadi aturan tinjauan kode (DoD M1a).
 */

/** Token dalam kunci (setelah normalisasi) yang menandakan pengenal pribadi. */
const TOKEN_TERLARANG = new Set([
  "nama",
  "name",
  "lahir",
  "birth",
  "birthdate",
  "dob",
  "alamat",
  "address",
  "nik",
  "ktp",
  "telepon",
  "telp",
  "hp",
  "phone",
  "email",
  "foto",
  "photo",
  "rm",
]);

/** Kunci yang sah walau memuat token terlarang. */
const KUNCI_DIKECUALIKAN = new Set(["nama_bahan"]);

const POLA_KUNCI_ASCII = /^[A-Za-z0-9_\- ]+$/;
const POLA_NIK = /\d(?:[\s.\-]?\d){15}(?!\d)/;
const POLA_EMAIL = /[^\s@]+@[^\s@]+\.[^\s@]+/;
const POLA_TELEPON = /(?:\+?62|\b0)[\s.\-]?8(?:[\s.\-]?\d){8,12}/;
const POLA_SKRIP_ASING = /[Ͱ-ϿЀ-ӿ԰-֏֐-׿؀-ۿ]/;
const POLA_NAMA_EKSPLISIT = /\b(?:bernama|namanya|nama\s*[:=]|nama\s+(?:anak|ibu|ayah)\b)/i;
const POLA_PANGGILAN_NAMA = /\b(?:anak|ibu|bapak|ayah|pak|bu|mbak|mas|nenek|kakek|bayi)\s+[A-Z][a-z]{2,}/;

/** camelCase → snake_case, hapus diakritik, huruf kecil, pemisah menjadi garis bawah. */
export function normalisasiKunci(kunci: string): string {
  return kunci
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .toLowerCase()
    .replace(/[\s-]+/g, "_")
    .replace(/_+/g, "_");
}

function adalahObjek(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null && !Array.isArray(x);
}

export function lintFixture(berkas: string, data: unknown): string[] {
  const galat: string[] = [];

  if (!adalahObjek(data)) {
    return [`${berkas}: akar fixture harus objek`];
  }
  if (data["sintetis"] !== true) {
    galat.push(`${berkas}: wajib memuat "sintetis": true`);
  }
  if (data["asal"] !== "dibuat-pengembang") {
    galat.push(`${berkas}: wajib memuat "asal": "dibuat-pengembang"`);
  }

  const periksaString = (s: string, jalur: string): void => {
    if (POLA_SKRIP_ASING.test(s)) galat.push(`${berkas} ${jalur}: nilai memuat huruf non-Latin (kemungkinan homoglif)`);
    if (POLA_NIK.test(s)) galat.push(`${berkas} ${jalur}: nilai menyerupai NIK`);
    if (POLA_EMAIL.test(s)) galat.push(`${berkas} ${jalur}: nilai menyerupai email`);
    if (POLA_TELEPON.test(s)) galat.push(`${berkas} ${jalur}: nilai menyerupai nomor telepon`);
    if (POLA_NAMA_EKSPLISIT.test(s)) galat.push(`${berkas} ${jalur}: nilai menyebut nama orang`);
    if (POLA_PANGGILAN_NAMA.test(s)) galat.push(`${berkas} ${jalur}: nilai menyerupai sebutan orang + nama`);
  };

  const telusuri = (simpul: unknown, jalur: string): void => {
    if (Array.isArray(simpul)) {
      simpul.forEach((e, i) => telusuri(e, `${jalur}[${i}]`));
      return;
    }
    if (adalahObjek(simpul)) {
      for (const [k, v] of Object.entries(simpul)) {
        if (!POLA_KUNCI_ASCII.test(k)) {
          galat.push(`${berkas} ${jalur}.${k}: kunci memuat karakter di luar ASCII sederhana (ditolak)`);
        } else {
          const norm = normalisasiKunci(k);
          if (!KUNCI_DIKECUALIKAN.has(norm) && norm.split("_").some((t) => TOKEN_TERLARANG.has(t))) {
            galat.push(`${berkas} ${jalur}.${k}: kunci pengenal pribadi tidak boleh ada di fixture`);
          }
        }
        telusuri(v, `${jalur}.${k}`);
      }
      return;
    }
    if (typeof simpul === "string") periksaString(simpul, jalur);
  };

  telusuri(data, "$");
  return galat;
}
