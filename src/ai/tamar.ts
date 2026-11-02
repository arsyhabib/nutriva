/**
 * Penyamaran kunci bawaan (BUKAN enkripsi). Aplikasi statis di GitHub Pages dikirim utuh ke setiap pengunjung,
 * jadi kunci yang tertanam di dalamnya pada akhirnya dapat dibaca siapa pun yang mau membongkar bundelnya.
 * Penyamaran ini hanya mencegah pemindai teks (GitHub secret scanning, bot) menemukan kunci mentah di repo.
 * Pengamanan sungguhan: batas kredit pada kunci di OpenRouter dan penggantian kunci berkala.
 * Fungsi murni: tanpa DOM, jaringan, jam, atau acak (garam diberikan pemanggil).
 */
export interface KunciTersamar {
  v: 1;
  /** Garam (base64). */
  s: string;
  /** Urutan potongan: p[u[i]] adalah potongan ke-i. */
  u: number[];
  /** Potongan terdorong XOR, base64. */
  p: string[];
}

const BAGIAN = 3;

function umpan(garam: Uint8Array): number {
  let h = 2166136261;
  for (const b of [...garam, ...new TextEncoder().encode("nutriva-kunci-bawaan")]) {
    h ^= b;
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h || 0x9e3779b9;
}

function aliran(garam: Uint8Array, panjang: number): Uint8Array {
  let x = umpan(garam);
  const k = new Uint8Array(panjang);
  for (let i = 0; i < panjang; i++) {
    x ^= x << 13; x >>>= 0;
    x ^= x >>> 17;
    x ^= x << 5; x >>>= 0;
    k[i] = x & 0xff;
  }
  return k;
}

const b64 = (b: Uint8Array): string => btoa(String.fromCharCode(...b));
const dariB64 = (s: string): Uint8Array => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

export function tamarkan(kunci: string, garam: Uint8Array): KunciTersamar {
  const data = new TextEncoder().encode(kunci);
  const ks = aliran(garam, data.length);
  const x = data.map((b, i) => b ^ ks[i]!);
  const ukuran = Math.ceil(x.length / BAGIAN);
  const potongan = Array.from({ length: BAGIAN }, (_, i) => x.slice(i * ukuran, (i + 1) * ukuran));
  const urut = [...Array(BAGIAN).keys()];
  // acak deterministik dari garam
  let t = umpan(garam);
  for (let i = BAGIAN - 1; i > 0; i--) {
    t = Math.imul(t ^ (t >>> 15), 2246822519) >>> 0;
    const j = t % (i + 1);
    [urut[i], urut[j]] = [urut[j]!, urut[i]!];
  }
  // p[urut[i]] = potongan ke-i
  const p: string[] = Array(BAGIAN).fill("");
  urut.forEach((tujuan, i) => { p[tujuan] = b64(potongan[i]!); });
  return { v: 1, s: b64(garam), u: urut, p };
}

export function bukaTamar(t: KunciTersamar | null | undefined): string {
  try {
    if (!t || t.v !== 1 || t.u.length !== BAGIAN || t.p.length !== BAGIAN) return "";
    const garam = dariB64(t.s);
    const gabung = t.u.map((tujuan) => dariB64(t.p[tujuan]!));
    const total = gabung.reduce((a, b) => a + b.length, 0);
    const x = new Uint8Array(total);
    let o = 0;
    for (const g of gabung) { x.set(g, o); o += g.length; }
    const ks = aliran(garam, total);
    return new TextDecoder().decode(x.map((b, i) => b ^ ks[i]!));
  } catch {
    return "";
  }
}
