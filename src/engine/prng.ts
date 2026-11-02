/**
 * Pembangkit acak berbenih (deterministik lintas peramban). Mesin tidak boleh memakai Math.random.
 * mulberry32 + hash string xmur3; semua aritmetika bilangan bulat 32-bit.
 */
export type Acak = () => number;

function benihDariTeks(teks: string): number {
  let h = Math.imul(teks.length ^ 0x9e3779b9, 0x85ebca6b) >>> 0;
  for (let i = 0; i < teks.length; i++) {
    h = Math.imul(h ^ teks.charCodeAt(i), 0xcc9e2d51);
    h = ((h << 13) | (h >>> 19)) >>> 0;
    h = Math.imul(h, 5) + 0xe6546b64;
    h >>>= 0;
  }
  h ^= h >>> 16;
  h = Math.imul(h, 0x85ebca6b) >>> 0;
  h ^= h >>> 13;
  return h >>> 0;
}

export function buatAcak(benih: string): Acak {
  let a = benihDariTeks(benih);
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Pilih satu elemen; larik kosong mengembalikan undefined. */
export function pilih<T>(acak: Acak, daftar: readonly T[]): T | undefined {
  if (daftar.length === 0) return undefined;
  return daftar[Math.floor(acak() * daftar.length)];
}

/** Urutan acak (Fisher-Yates) tanpa mengubah masukan. */
export function acakUrut<T>(acak: Acak, daftar: readonly T[]): T[] {
  const h = daftar.slice();
  for (let i = h.length - 1; i > 0; i--) {
    const j = Math.floor(acak() * (i + 1));
    const t = h[i] as T;
    h[i] = h[j] as T;
    h[j] = t;
  }
  return h;
}
