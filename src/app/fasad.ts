import { hitungStatus, type MasukanStatus, type KeluaranStatus } from "../engine/antropometri";
import { bangunPola, type KeluaranPola } from "../engine/polaMakan";
import { buatDaftarBelanja, type DaftarBelanja } from "../engine/belanja";
import { tentukanTingkat, type HasilRujukan } from "../engine/rujukan";
import { muatanStatus, muatanMenu } from "../ai/muatan";
import type { MuatanAi } from "../ai/kontrak";
import { DATA_VERSION, ENGINE_VERSION, RULES_VERSION } from "../engine/versi";

/**
 * Satu pintu untuk antarmuka. Fungsi murni: masukan sama menghasilkan keluaran sama; tanpa DOM, jaringan, jam, atau acak.
 * UI hanya menampilkan hasil ini; ia tidak boleh menghitung ulang gizi/status sendiri.
 */
export interface MasukanPolaMakan {
  hari: number;
  benih: string;
  hindari: string[];
  izinkan_hati: boolean;
  masih_asi: boolean;
}

export interface MasukanRingkasan {
  status: MasukanStatus;
  tanda_bahaya: string[];
  pola: MasukanPolaMakan;
}

export type Ringkasan =
  | { hasil: "stop"; alasan: string; engine_version: string; data_version: string }
  | {
      hasil: "ok";
      status: Extract<KeluaranStatus, { hasil: "ok" }>;
      rujukan: HasilRujukan;
      /** null bila tingkat "rujuk" (menu dihentikan) atau generator berhenti. */
      pola: Extract<KeluaranPola, { hasil: "ok" }> | null;
      pola_alasan_henti: string | null;
      belanja: DaftarBelanja | null;
      /** Muatan untuk penjelas AI layar status; null pada tingkat "rujuk" (AI tidak pernah di layar Rujukan). */
      muatan_ai_status: MuatanAi | null;
      /** Muatan AI per hari menu; kosong bila tidak ada menu atau tingkat "rujuk". */
      muatan_ai_menu: MuatanAi[];
      versi: { engine: string; data: string; rules: string };
    };

export function ringkasan(m: MasukanRingkasan): Ringkasan {
  const st = hitungStatus(m.status);
  if (st.hasil === "stop") return { hasil: "stop", alasan: st.alasan, engine_version: st.engine_version, data_version: st.data_version };
  const rujukan = tentukanTingkat(st, m.tanda_bahaya);
  const versi = { engine: ENGINE_VERSION, data: DATA_VERSION, rules: RULES_VERSION };
  if (rujukan.tingkat === "rujuk") {
    return { hasil: "ok", status: st, rujukan, pola: null, pola_alasan_henti: "rujuk", belanja: null, muatan_ai_status: null, muatan_ai_menu: [], versi };
  }
  const p = bangunPola({ usia_bulan: st.usia_bulan_penuh, hari: m.pola.hari, benih: m.pola.benih, hindari: m.pola.hindari, izinkan_hati: m.pola.izinkan_hati, masih_asi: m.pola.masih_asi });
  if (p.hasil === "stop") {
    return { hasil: "ok", status: st, rujukan, pola: null, pola_alasan_henti: p.alasan, belanja: null, muatan_ai_status: muatanStatus(st), muatan_ai_menu: [], versi };
  }
  const usia = st.usia_bulan_penuh;
  return {
    hasil: "ok",
    status: st,
    rujukan,
    pola: p,
    pola_alasan_henti: null,
    belanja: buatDaftarBelanja(p.hari),
    muatan_ai_status: muatanStatus(st),
    muatan_ai_menu: p.hari.map((h) => muatanMenu(usia, h)),
    versi,
  };
}
