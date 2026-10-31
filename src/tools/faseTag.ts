/**
 * Pembekuan tag fase registri (ADR-0004).
 * Mem-parsing REGISTRI_FITUR_NUTRIVA.md dan membandingkannya dengan snapshot.
 */

export const FASE_VALID = ["M1a", "M1b", "M2", "M3", "M3+", "M4", "M5", "Tunda"] as const;
export type Fase = (typeof FASE_VALID)[number];

export interface SnapshotFase {
  versi: number;
  tanggal: string;
  adr: string;
  jumlah: number;
  fase: Record<string, string>;
}

const POLA_BARIS = /^\| ([A-L]\d{2}) \|([^|]*)\|/gm;
const POLA_TAG = /`\[([^\]]+)\]`/g;

export interface HasilParse {
  fase: Record<string, string>;
  galat: string[];
}

export function parseRegistri(teks: string): HasilParse {
  const fase: Record<string, string> = {};
  const galat: string[] = [];
  for (const m of teks.matchAll(POLA_BARIS)) {
    const id = m[1] as string;
    const sel = m[2] as string;
    const tag = [...sel.matchAll(POLA_TAG)].map((t) => t[1] as string);
    if (id in fase) galat.push(`${id}: ID ganda`);
    if (tag.length !== 1) {
      galat.push(`${id}: harus memiliki tepat satu tag fase (ditemukan ${tag.length})`);
      continue;
    }
    const t = tag[0] as string;
    if (!(FASE_VALID as readonly string[]).includes(t)) {
      galat.push(`${id}: tag fase tidak dikenal "${t}"`);
    }
    fase[id] = t;
  }
  return { fase, galat };
}

export function bandingkanDenganSnapshot(
  fase: Record<string, string>,
  snapshot: SnapshotFase,
): string[] {
  const galat: string[] = [];
  const idSekarang = new Set(Object.keys(fase));
  const idSnapshot = new Set(Object.keys(snapshot.fase));
  for (const id of idSnapshot) if (!idSekarang.has(id)) galat.push(`${id}: ada di snapshot, hilang dari registri`);
  for (const id of idSekarang) if (!idSnapshot.has(id)) galat.push(`${id}: ada di registri, tidak ada di snapshot`);
  for (const id of idSekarang) {
    if (idSnapshot.has(id) && fase[id] !== snapshot.fase[id]) {
      galat.push(`${id}: tag berubah ${snapshot.fase[id]} → ${fase[id]} (perlu ADR-0004 dan pembaruan snapshot)`);
    }
  }
  if (snapshot.jumlah !== idSnapshot.size) galat.push("snapshot: jumlah tidak sesuai isi");
  return galat;
}
