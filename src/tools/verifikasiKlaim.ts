import type { Klaim, Sumber } from "../engine/schema/klaim";

/**
 * Verifikator klaim (ADR-0002; RPT-0005 §10 syarat 2; diperketat setelah RPT-0006 AUD-0006-02).
 *
 * Aturan (berkas JSON di `data/**` selain registri klaim/sumber/snapshot):
 *  - SETIAP nilai numerik (angka, atau string yang hanya berisi angka, atau string berformat
 *    "angka + satuan") wajib berada di bawah simpul yang memiliki `klaim_id`/`klaim_ids`
 *    (pada simpul itu sendiri atau induknya). Nama kunci tidak berpengaruh.
 *  - Subpohon di bawah kunci `_meta` dikecualikan (metadata non-ilmiah).
 *  - Klaim yang dirujuk harus ada.
 *  - Klaim berstatus `dikarantina` atau `dicabut` TIDAK PERNAH boleh dipakai (walau berlabel).
 *  - Klaim berstatus `belum` hanya boleh dipakai bila simpul (atau induknya) bertanda
 *    `label_belum_diverifikasi: true`.
 *  - Setiap klaim menunjuk sumber yang terdaftar.
 */

export interface Rujukan {
  berkas: string;
  jalur: string;
  klaim_id: string;
  label_belum_diverifikasi: boolean;
}

export interface HasilVerifikasi {
  ok: boolean;
  galat: string[];
}

const POLA_ANGKA_STRING = /^\s*[-+]?\d+(?:[.,]\d+)?\s*$/;
const POLA_ANGKA_SATUAN =
  /(?:^|[^A-Za-z0-9_])\d+(?:[.,]\d+)?\s*(?:kkal|kcal|mg|µg|ug|mcg|g|kg|ml|l|cm|mm|%|rp)\b/i;

function adalahObjek(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null && !Array.isArray(x);
}

function bernilaiNumerik(v: unknown): boolean {
  if (typeof v === "number") return true;
  if (typeof v === "string") return POLA_ANGKA_STRING.test(v) || POLA_ANGKA_SATUAN.test(v);
  return false;
}

/** Menelusuri JSON dan mengumpulkan rujukan klaim serta nilai numerik tanpa klaim. */
export function kumpulkanRujukan(
  berkas: string,
  data: unknown,
): { rujukan: Rujukan[]; galat: string[] } {
  const rujukan: Rujukan[] = [];
  const galat: string[] = [];

  const telusuri = (simpul: unknown, jalur: string, labelInduk: boolean, adaKlaim: boolean): void => {
    if (Array.isArray(simpul)) {
      simpul.forEach((e, i) => {
        if (bernilaiNumerik(e)) {
          if (!adaKlaim) galat.push(`${berkas} ${jalur}[${i}]: nilai numerik tanpa klaim_id di induknya`);
        } else {
          telusuri(e, `${jalur}[${i}]`, labelInduk, adaKlaim);
        }
      });
      return;
    }
    if (!adalahObjek(simpul)) return;

    const label = labelInduk || simpul["label_belum_diverifikasi"] === true;

    const ids: string[] = [];
    const satu = simpul["klaim_id"];
    if (typeof satu === "string") ids.push(satu);
    const banyak = simpul["klaim_ids"];
    if (Array.isArray(banyak)) {
      for (const b of banyak) if (typeof b === "string") ids.push(b);
    }
    for (const id of ids) {
      rujukan.push({ berkas, jalur, klaim_id: id, label_belum_diverifikasi: label });
    }
    const punyaKlaim = adaKlaim || ids.length > 0;

    for (const [k, v] of Object.entries(simpul)) {
      if (k === "_meta") continue;
      if (k === "klaim_id" || k === "klaim_ids") continue;
      if (bernilaiNumerik(v)) {
        if (!punyaKlaim) galat.push(`${berkas} ${jalur}.${k}: nilai numerik tanpa klaim_id di simpul atau induknya`);
      } else if (typeof v === "object" && v !== null) {
        telusuri(v, `${jalur}.${k}`, label, punyaKlaim);
      }
    }
  };

  telusuri(data, "$", false, false);
  return { rujukan, galat };
}

export function verifikasiKlaim(
  klaim: readonly Klaim[],
  sumber: readonly Sumber[],
  rujukan: readonly Rujukan[],
  galatAwal: readonly string[] = [],
): HasilVerifikasi {
  const galat: string[] = [...galatAwal];
  const petaKlaim = new Map(klaim.map((k) => [k.id, k] as const));
  const idSumber = new Set(sumber.map((s) => s.id));

  for (const k of klaim) {
    for (const r of k.sumber) {
      if (!idSumber.has(r.sumber_id)) {
        galat.push(`klaim ${k.id}: sumber ${r.sumber_id} tidak terdaftar`);
      }
    }
  }

  for (const r of rujukan) {
    const k = petaKlaim.get(r.klaim_id);
    const lokasi = `${r.berkas} ${r.jalur}`;
    if (!k) {
      galat.push(`${lokasi}: klaim ${r.klaim_id} tidak ada`);
      continue;
    }
    if (k.status === "dikarantina" || k.status === "dicabut") {
      galat.push(`${lokasi}: klaim ${k.id} berstatus ${k.status} dan tidak boleh dipakai`);
      continue;
    }
    if (k.status === "belum" && !r.label_belum_diverifikasi) {
      galat.push(
        `${lokasi}: klaim ${k.id} berstatus belum dan dipakai tanpa label_belum_diverifikasi`,
      );
    }
  }

  return { ok: galat.length === 0, galat };
}
