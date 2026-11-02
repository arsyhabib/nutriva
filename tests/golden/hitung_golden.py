#!/usr/bin/env python3
"""Penghitung tangan INDEPENDEN untuk kasus golden status gizi (NUTRIVA).
Tidak berbagi kode dengan src/engine/. Membaca data/tabel_sd/*.json dan menulis kasus_status.json.
Aturan: Permenkes 2/2020 (usia bulan penuh; PB terlentang; berdiri <24 bulan +0,7 cm; kategori dari batas SD).
Jalankan dari akar proyek:  python tests/golden/hitung_golden.py
"""
import json, os, sys
from decimal import Decimal, ROUND_HALF_UP
R = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
def muat(n): return json.load(open(os.path.join(R,"data","tabel_sd",n+".json"),encoding="utf8"))
T = {(i,j): muat(f"{i}_{j}") for i in ("bbu","pbu","bbpb") for j in ("L","P")}
SD = ["-3","-2","-1","0","+1","+2","+3"]

def posisi(nilai, sd):
    """Kode posisi di antara garis SD. 'tepat:-2' bila tepat di garis."""
    if nilai < sd[0]: return "<-3"
    if nilai > sd[6]: return ">+3"
    for k in range(7):
        if nilai == sd[k]: return "tepat:"+SD[k]
    for k in range(6):
        if sd[k] < nilai < sd[k+1]: return f"{SD[k]}..{SD[k+1]}"

def idx(nilai, sd):
    """Indeks batas: banyaknya garis SD yang nilainya >= garis (0..7)."""
    return sum(1 for x in sd if nilai >= x)

def kat_bbu(n, sd):
    if n < sd[0]: return "bb_sangat_kurang"
    if n < sd[1]: return "bb_kurang"
    if n <= sd[4]: return "bb_normal"
    return "risiko_bb_lebih"
def kat_pbu(n, sd):
    if n < sd[0]: return "sangat_pendek"
    if n < sd[1]: return "pendek"
    if n <= sd[6]: return "normal"
    return "tinggi"
def kat_bbpb(n, sd):
    if n < sd[0]: return "gizi_buruk"
    if n < sd[1]: return "gizi_kurang"
    if n <= sd[4]: return "gizi_baik"
    if n <= sd[5]: return "risiko_gizi_lebih"
    if n <= sd[6]: return "gizi_lebih"
    return "obesitas"

def r1(x): return float(Decimal(str(x)).quantize(Decimal("0.1"), rounding=ROUND_HALF_UP))

def hitung(k):
    jk = k["jk"]; bulan = k["umur"]["bulan"]; hari = k["umur"]["hari"]
    # usia bulan penuh: hari tidak membulatkan ke atas
    if bulan < 6: return {"hasil":"stop","alasan":"usia_di_bawah_6_bulan"}
    if bulan >= 24: return {"hasil":"stop","alasan":"usia_24_bulan_atau_lebih_di_luar_cakupan"}
    if not (k["bb_kg"] > 0): return {"hasil":"stop","alasan":"berat_tidak_valid"}
    pb = k["pb_cm"]
    if k["cara_ukur"] == "berdiri": pb = r1(pb + 0.7)
    if not (45.0 <= pb <= 110.0): return {"hasil":"stop","alasan":"panjang_di_luar_tabel"}
    out = {"hasil":"ok","usia_bulan_penuh":bulan,"panjang_dipakai_cm":pb}
    sd = next(r["sd"] for r in T[("bbu",jk)]["baris"] if r["bulan"]==bulan)
    out["bbu"] = {"kategori":kat_bbu(k["bb_kg"],sd),"posisi":posisi(k["bb_kg"],sd)}
    sd = next(r["sd"] for r in T[("pbu",jk)]["baris"] if r["bulan"]==bulan)
    out["pbu"] = {"kategori":kat_pbu(pb,sd),"posisi":posisi(pb,sd)}
    # Keputusan D-6 (2026-11-02): panjang dibulatkan ke kelipatan 0,5 cm terdekat, setengah naik (x,25 -> x,5; x,75 -> x+1,0)
    pb_tabel = float((Decimal(str(pb))*2).quantize(Decimal("1"), rounding=ROUND_HALF_UP)/2)
    out["panjang_tabel_cm"] = pb_tabel
    baris = [r for r in T[("bbpb",jk)]["baris"] if abs(r["panjang_cm"]-pb_tabel) < 1e-9]
    if not baris:
        out["bbpb"] = {"kategori":"panjang_di_luar_tabel_setelah_pembulatan","posisi":None}
    else:
        sd = baris[0]["sd"]
        out["bbpb"] = {"kategori":kat_bbpb(k["bb_kg"],sd),"posisi":posisi(k["bb_kg"],sd)}
    return out

def baris_sd(ind,jk,key,val):
    return next(r["sd"] for r in T[(ind,jk)]["baris"] if r[key]==val)

kasus = []
def tambah(id_, ket, jk, bulan, hari, bb, pb, cara="terlentang"):
    kasus.append({"id":id_,"keterangan":ket,"jk":jk,"umur":{"bulan":bulan,"hari":hari},"bb_kg":bb,"pb_cm":pb,"cara_ukur":cara})

# A. batas usia
tambah("G01","5 bulan 29 hari: di bawah cakupan","L",5,29,7.0,65.0)
tambah("G02","6 bulan 0 hari: batas bawah","L",6,0,7.9,67.6)
tambah("G03","23 bulan 30 hari: masih 23 bulan penuh","P",23,30,11.3,85.5)
tambah("G04","24 bulan 0 hari: di luar cakupan","P",24,0,11.5,86.4)
# B. tepat di garis median (normal)
for jk,b in (("L",9),("P",9),("L",15),("P",20),("L",23),("P",12)):
    bbu = baris_sd("bbu",jk,"bulan",b); pbu = baris_sd("pbu",jk,"bulan",b)
    pb = pbu[3]
    tambah(f"G{len(kasus)+1:02d}",f"median BB/U dan PB/U, {jk} {b} bulan",jk,b,0,bbu[3],pb)
# C. tepat pada garis SD (uji batas kategori), BB/U
for jk,b,k_i in (("L",8,1),("P",8,1),("L",14,0),("P",14,0),("L",18,4),("P",18,4)):
    bbu = baris_sd("bbu",jk,"bulan",b); pbu = baris_sd("pbu",jk,"bulan",b)
    tambah(f"G{len(kasus)+1:02d}",f"BB tepat di garis {SD[k_i]} SD, {jk} {b} bulan",jk,b,0,bbu[k_i],pbu[3])
# D. PB/U pada garis
for jk,b,k_i in (("L",10,1),("P",10,1),("L",16,0),("P",16,6),("L",22,6)):
    bbu = baris_sd("bbu",jk,"bulan",b); pbu = baris_sd("pbu",jk,"bulan",b)
    tambah(f"G{len(kasus)+1:02d}",f"PB tepat di garis {SD[k_i]} SD, {jk} {b} bulan",jk,b,0,bbu[3],pbu[k_i])
# E. di luar garis ekstrem
for jk,b in (("L",12),("P",12)):
    bbu = baris_sd("bbu",jk,"bulan",b); pbu = baris_sd("pbu",jk,"bulan",b)
    tambah(f"G{len(kasus)+1:02d}",f"BB sangat rendah (di bawah -3 SD), {jk} {b} bulan",jk,b,0,round(bbu[0]-0.5,1),pbu[3])
    tambah(f"G{len(kasus)+1:02d}",f"PB di bawah -3 SD, {jk} {b} bulan",jk,b,0,bbu[3],round(pbu[0]-1.0,1))
    tambah(f"G{len(kasus)+1:02d}",f"BB di atas +1 SD, {jk} {b} bulan",jk,b,0,round(bbu[4]+0.4,1),pbu[3])
# F. BB/PB pada panjang kisi 0,5 cm
for jk,pb,k_i,umur in (("L",70.0,1,10),("P",70.0,1,10),("L",75.5,5,13),("P",75.5,6,13),("L",80.0,0,18),("P",65.0,4,8)):
    sd = baris_sd("bbpb",jk,"panjang_cm",pb)
    tambah(f"G{len(kasus)+1:02d}",f"BB/PB tepat di garis {SD[k_i]} SD pada {pb} cm, {jk}",jk,umur,0,sd[k_i],pb)
# BB kosong untuk kasus BB/PB: gunakan bb_kg nilai dari sd; urutan argumen: (bb, pb)
# G. koreksi berdiri (+0,7 cm), usia < 24 bulan
tambah(f"G{len(kasus)+1:02d}","diukur berdiri 11 bulan: +0,7 cm","L",11,5,8.9,73.8,"berdiri")
tambah(f"G{len(kasus)+1:02d}","diukur berdiri 17 bulan: +0,7 cm","P",17,12,9.8,78.6,"berdiri")
# H. input tidak valid
tambah(f"G{len(kasus)+1:02d}","berat nol","L",12,0,0.0,75.7)
tambah(f"G{len(kasus)+1:02d}","panjang di bawah batas tabel","P",12,0,9.0,44.5)
tambah(f"G{len(kasus)+1:02d}","panjang di atas batas tabel","P",12,0,9.0,111.0)
# I. panjang di antara baris 0,5 (keputusan terbuka D-6)
tambah(f"G{len(kasus)+1:02d}","panjang bukan kelipatan 0,5: dibulatkan ke 0,5 cm (D-6)","L",12,0,9.6,75.7)
tambah(f"G{len(kasus)+1:02d}","panjang 72,3 cm: dibulatkan ke 0,5 cm (D-6)","P",14,0,9.4,72.3)

# J. BB/PB sistematis pada panjang kisi 0,5 cm: garis, tepat di bawah garis, tepat di atas garis
def bulan_cocok(jk,pb):
    for r in T[("pbu",jk)]["baris"]:
        if r["sd"][1] <= pb <= r["sd"][5]: return r["bulan"]
    return 12
for jk,pb in (("L",66.0),("P",66.0),("L",72.5),("P",72.5),("L",79.0),("P",79.0),("L",86.5),("P",86.5)):
    sd = baris_sd("bbpb",jk,"panjang_cm",pb); b = bulan_cocok(jk,pb)
    for ket,val in (("tepat -3 SD",sd[0]),("0,1 kg di bawah -3 SD",round(sd[0]-0.1,1)),("tepat -2 SD",sd[1]),("0,1 kg di bawah -2 SD",round(sd[1]-0.1,1)),
                    ("tepat +1 SD",sd[4]),("0,1 kg di atas +1 SD",round(sd[4]+0.1,1)),("tepat +2 SD",sd[5]),("0,1 kg di atas +2 SD",round(sd[5]+0.1,1)),
                    ("tepat +3 SD",sd[6]),("0,1 kg di atas +3 SD",round(sd[6]+0.1,1))):
        tambah(f"G{len(kasus)+1:02d}",f"BB/PB {ket}, {pb} cm, {jk}",jk,b,0,val,pb)

# K. tambahan: PB/U tinggi, berdiri, pembulatan panjang
for jk,b in (("L",9),("P",21)):
    pbu = baris_sd("pbu",jk,"bulan",b); bbu = baris_sd("bbu",jk,"bulan",b)
    tambah(f"G{len(kasus)+1:02d}",f"PB di atas +3 SD (tinggi), {jk} {b} bulan",jk,b,0,bbu[3],round(pbu[6]+0.1,1))
for ket,pb in (("72,24 dibulatkan ke 72,0",72.24),("72,25 dibulatkan ke 72,5",72.25),("72,74 dibulatkan ke 72,5",72.74),("72,75 dibulatkan ke 73,0",72.75)):
    tambah(f"G{len(kasus)+1:02d}",f"pembulatan panjang: {ket}","L",12,0,9.0,pb)
tambah(f"G{len(kasus)+1:02d}","berdiri 22 bulan 71,5 cm jadi 72,2 lalu 72,0","P",22,0,8.5,71.5,"berdiri")
tambah(f"G{len(kasus)+1:02d}","berdiri 6 bulan 44,4 cm jadi 45,1 (di dalam tabel)","L",6,0,3.0,44.4,"berdiri")
tambah(f"G{len(kasus)+1:02d}","berdiri 23 bulan 109,5 cm jadi 110,2 (di luar tabel)","L",23,0,15.0,109.5,"berdiri")
for k in kasus: k["harapan"] = hitung(k)

# salah-satu cek konsistensi: setiap kasus ber-id unik
assert len({k["id"] for k in kasus}) == len(kasus)
berkas = {"versi":"0.1.0","dibuat_oleh":"hitung_golden.py (hitung tangan independen, tanpa kode mesin)",
  "aturan":"Permenkes 2/2020; usia bulan penuh; berdiri <24 bulan +0,7 cm; kategori dari batas SD tabel; pada garis SD mengikuti 'sd' (-3 s.d. <-2 kurang; -2 s.d. +1 normal BB/U)",
  "catatan_terbuka":["D-6 diputuskan eksekutor 2026-11-02: panjang dibulatkan ke 0,5 cm terdekat, setengah naik (asumsi D, KL-ASUMSI-PEMBULATAN-PANJANG)","usia >=24 bulan di luar cakupan aplikasi (ambiguitas '0-24' vs 'di atas 24' tercatat C-022)"],
  "kasus":kasus}
json.dump(berkas,open(os.path.join(os.path.dirname(os.path.abspath(__file__)),"kasus_status.json"),"w",encoding="utf8"),ensure_ascii=False,indent=2)
print(len(kasus),"kasus ditulis")
