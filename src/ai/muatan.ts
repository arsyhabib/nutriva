import type { KeluaranStatus } from "../engine/antropometri";
import type { MenuHari } from "../engine/polaMakan";
import type { LaporanAkg } from "../engine/gizi";
import { DATA_VERSION, ENGINE_VERSION, RULES_VERSION } from "../engine/versi";
import { MuatanAiSchema, SKEMA_MUATAN_VERSI, type MuatanAi } from "./kontrak";

export type PitaUsia = MuatanAi["pita_usia"];

export function pitaDariUsia(usiaBulan: number): PitaUsia {
  return usiaBulan <= 8 ? "6-8" : usiaBulan <= 11 ? "9-11" : "12-23";
}

const versi = () => ({ engine: ENGINE_VERSION, data: DATA_VERSION, rules: RULES_VERSION });

/** Muatan layar status gizi. Mengembalikan null bila hasil mesin berupa "stop" (tidak ada yang dijelaskan AI). */
export function muatanStatus(k: KeluaranStatus, akg?: LaporanAkg): MuatanAi | null {
  if (k.hasil !== "ok") return null;
  const m: MuatanAi = {
    skema: SKEMA_MUATAN_VERSI,
    layar: "status",
    pita_usia: pitaDariUsia(k.usia_bulan_penuh),
    status: { bbu: k.bbu.kategori, pbu: k.pbu.kategori, bbpb: k.bbpb.kategori },
    versi: versi(),
  };
  if (akg) m.akg = ringkasAkg(akg);
  return MuatanAiSchema.parse(m);
}

export function muatanMenu(usiaBulan: number, h: MenuHari, layar: "pola_makan" | "belanja" = "pola_makan"): MuatanAi {
  const celah = h.peringatan.filter((p): p is NonNullable<MuatanAi["celah"]>[number] => MuatanAiSchema.shape.celah.unwrap().element.safeParse(p).success);
  return MuatanAiSchema.parse({
    skema: SKEMA_MUATAN_VERSI,
    layar,
    pita_usia: pitaDariUsia(usiaBulan),
    akg: ringkasAkg(h.akg),
    celah,
    menu: {
      mdd_tercapai: h.mdd_tercapai,
      jumlah_kelompok_mdd: h.jumlah_kelompok_mdd,
      energi_persen_target: Math.min(300, h.energi_persen_target),
    },
    versi: versi(),
  });
}

function ringkasAkg(l: LaporanAkg): NonNullable<MuatanAi["akg"]> {
  return l.zat.map((z) => ({ zat: z.zat, persen: Math.min(999, Math.max(0, z.persen)) }));
}
