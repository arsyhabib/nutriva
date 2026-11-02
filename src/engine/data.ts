import { AkgAnakSchema, type AkgAnak } from "./schema/akg";
import { BahanGiziSchema, BahanAtributSchema, type BahanGizi, type BahanAtribut } from "./schema/bahan";
import { AturanPolaMakanSchema, AturanRujukanSchema, type AturanPolaMakan, type AturanRujukan } from "./schema/aturan";
import {
  TabelSdBulanSchema,
  TabelSdPanjangSchema,
  type TabelSdBulan,
  type TabelSdPanjang,
} from "./schema/tabelSd";

import bbuL from "../../data/tabel_sd/bbu_L.json";
import bbuP from "../../data/tabel_sd/bbu_P.json";
import pbuL from "../../data/tabel_sd/pbu_L.json";
import pbuP from "../../data/tabel_sd/pbu_P.json";
import bbpbL from "../../data/tabel_sd/bbpb_L.json";
import bbpbP from "../../data/tabel_sd/bbpb_P.json";
import akgAnakMentah from "../../data/akg_anak.json";
import bahanMentah from "../../data/bahan/bahan.json";
import atributMentah from "../../data/bahan/atribut.json";
import aturanMentah from "../../data/aturan/pola_makan.json";
import rujukanMentah from "../../data/aturan/rujukan.json";

/** Satu-satunya pintu masuk data ke mesin. Validasi Zod dan gagal keras bila bentuk salah. */
function muat<T>(nama: string, parse: () => T): T {
  try {
    return parse();
  } catch (e) {
    throw new Error(`Data "${nama}" tidak lolos skema: ${e instanceof Error ? e.message : String(e)}`);
  }
}

export interface DataMesin {
  bbu: { L: TabelSdBulan; P: TabelSdBulan };
  pbu: { L: TabelSdBulan; P: TabelSdBulan };
  bbpb: { L: TabelSdPanjang; P: TabelSdPanjang };
  akgAnak: AkgAnak;
  bahanGizi: BahanGizi;
  bahanAtribut: BahanAtribut;
  aturanPolaMakan: AturanPolaMakan;
  aturanRujukan: AturanRujukan;
}

export const DATA: DataMesin = {
  bbu: {
    L: muat("bbu_L", () => TabelSdBulanSchema.parse(bbuL)),
    P: muat("bbu_P", () => TabelSdBulanSchema.parse(bbuP)),
  },
  pbu: {
    L: muat("pbu_L", () => TabelSdBulanSchema.parse(pbuL)),
    P: muat("pbu_P", () => TabelSdBulanSchema.parse(pbuP)),
  },
  bbpb: {
    L: muat("bbpb_L", () => TabelSdPanjangSchema.parse(bbpbL)),
    P: muat("bbpb_P", () => TabelSdPanjangSchema.parse(bbpbP)),
  },
  akgAnak: muat("akg_anak", () => AkgAnakSchema.parse(akgAnakMentah)),
  bahanGizi: muat("bahan", () => BahanGiziSchema.parse(bahanMentah)),
  bahanAtribut: muat("bahan_atribut", () => BahanAtributSchema.parse(atributMentah)),
  aturanPolaMakan: muat("pola_makan", () => AturanPolaMakanSchema.parse(aturanMentah)),
  aturanRujukan: muat("rujukan", () => AturanRujukanSchema.parse(rujukanMentah)),
};
