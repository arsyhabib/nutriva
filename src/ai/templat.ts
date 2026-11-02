import type { MuatanAi } from "./kontrak";
import { LABEL_BBPB, LABEL_BBU, LABEL_CELAH, LABEL_PBU, LABEL_PITA, NAMA_ZAT } from "./glosarium";

/** Penjelasan cadangan deterministik. Dipakai bila AI mati, gagal, atau keluarannya ditolak validator. */
export function jelaskanTemplat(m: MuatanAi): string {
  const baris: string[] = [];
  baris.push(`Anak usia ${LABEL_PITA[m.pita_usia]}.`);
  if (m.status) {
    baris.push(`Hasil hitung tabel Permenkes 2/2020: ${LABEL_BBU[m.status.bbu]}; ${LABEL_PBU[m.status.pbu]}; ${LABEL_BBPB[m.status.bbpb]}.`);
    const perlu = m.status.bbu !== "bb_normal" || m.status.pbu !== "normal" || m.status.bbpb !== "gizi_baik";
    baris.push(
      perlu
        ? "Ada hasil yang tidak normal. Bawa anak ke posyandu atau puskesmas untuk pemeriksaan ulang oleh petugas kesehatan."
        : "Semua hasil berada pada rentang normal. Tetap timbang dan ukur anak secara rutin di posyandu.",
    );
  }
  if (m.akg && m.akg.length > 0) {
    const rendah = m.akg.filter((z) => z.persen < 40 && z.zat !== "energi_kkal").slice(0, 3);
    if (rendah.length > 0)
      baris.push(`Zat yang masih rendah pada contoh menu ini: ${rendah.map((z) => `${NAMA_ZAT[z.zat] ?? z.zat} (${z.persen} persen kebutuhan)`).join(", ")}.`);
    else baris.push("Tidak ada zat yang berada di bawah 40 persen kebutuhan pada contoh menu ini.");
  }
  if (m.menu) {
    baris.push(
      `Keragaman makanan hari ini: ${m.menu.jumlah_kelompok_mdd} dari 8 kelompok${m.menu.mdd_tercapai ? ", sudah mencapai batas minimal 5 kelompok" : ", belum mencapai batas minimal 5 kelompok"}. Energi contoh menu ${m.menu.energi_persen_target} persen dari target makanan pendamping ASI.`,
    );
  }
  if (m.celah && m.celah.length > 0) baris.push(`Catatan: ${m.celah.slice(0, 2).map((c) => LABEL_CELAH[c]).join("; ")}.`);
  baris.push("Ini contoh dari aturan program, bukan anjuran medis pribadi.");
  return baris.join("\n");
}
