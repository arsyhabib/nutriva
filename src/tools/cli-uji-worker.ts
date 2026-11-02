/**
 * Uji asap Worker AI yang sudah terpasang. Usage: tsx src/tools/cli-uji-worker.ts <urlWorker> <originDiizinkan>
 * Tidak memakai kunci. Mencetak OK/GAGAL per butir; keluar dengan kode 1 bila ada yang gagal.
 */
import { MuatanAiSchema } from "../ai/kontrak";
import { validasiKeluaranAi } from "../ai/validator";

const [url, origin] = process.argv.slice(2);
if (!url || !origin) {
  process.stderr.write("Pemakaian: tsx src/tools/cli-uji-worker.ts <urlWorker> <originDiizinkan>\n");
  process.exit(2);
}
const muatan = MuatanAiSchema.parse({
  skema: 1,
  layar: "status",
  pita_usia: "9-11",
  status: { bbu: "bb_normal", pbu: "normal", bbpb: "gizi_baik" },
  versi: { engine: "0.2.0", data: "2026-11-02", rules: "0.1.0" },
});
const tujuan = url.replace(/\/+$/, "") + "/v1/jelaskan";
const kirim = (o: string, badan: unknown) =>
  fetch(tujuan, { method: "POST", headers: { "Content-Type": "application/json", Origin: o }, body: JSON.stringify(badan) });

let gagal = 0;
const lapor = (nama: string, ok: boolean, rinci = "") => {
  if (!ok) gagal++;
  process.stdout.write(`${ok ? "OK   " : "GAGAL"} ${nama}${rinci ? " - " + rinci : ""}\n`);
};

const a = await kirim(origin, muatan);
const ja = (await a.json()) as { teks?: unknown; galat?: string };
const v = validasiKeluaranAi(ja.teks, muatan);
lapor("sukses: status 200 dan teks lolos validator", a.status === 200 && v.ok, `status ${a.status}${ja.galat ? " " + ja.galat : ""}`);
const b = await kirim("https://jahat.example", muatan);
lapor("origin asing ditolak 403", b.status === 403, `status ${b.status}`);
const c = await kirim(origin, { ...muatan, layar: "rujukan" });
lapor("muatan layar rujukan ditolak 400", c.status === 400, `status ${c.status}`);
process.exit(gagal === 0 ? 0 : 1);
