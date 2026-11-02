"""Hitung tangan independen: total gizi, persen AKG, daftar belanja. Tidak memakai kode TypeScript.
Keluaran: tests/golden/kasus_gizi.json. Jalankan: python3 tests/golden/hitung_gizi_golden.py"""
import json, math, pathlib
R = pathlib.Path(__file__).resolve().parents[2]
bahan = {b["id"]: b["per_100g"] for b in json.load(open(R/"data/bahan/bahan.json"))["bahan"]}
atr = {b["id"]: b for b in json.load(open(R/"data/bahan/atribut.json"))["bahan"]}
akg = json.load(open(R/"data/akg_anak.json"))["kelompok"]
tamp = json.load(open(R/"data/aturan/pola_makan.json"))["tampilan"]
PETA = [("protein_g","protein",1),("lemak_g","lemak_total",1),("karbohidrat_g","karbohidrat",1),("serat_g","serat",1),
 ("kalsium_mg","kalsium",1),("fosfor_mg","fosfor",1),("magnesium_mg","magnesium",1),("besi_mg","besi",1),("seng_mg","seng",1),
 ("natrium_mg","natrium",1),("kalium_mg","kalium",1),("tembaga_mg","tembaga",1000),("selenium_mcg","selenium",1),
 ("vit_a_rae_mcg","vit_a_re",1),("vit_d_mcg","vit_d",1),("vit_c_mg","vit_c",1),("vit_b1_mg","vit_b1",1),("vit_b2_mg","vit_b2",1),
 ("vit_b3_mg","vit_b3",1),("vit_b6_mg","vit_b6",1),("folat_total_mcg","folat",1),("vit_b12_mcg","vit_b12",1),("kolin_mg","kolin",1)]
MENU = [
 {"usia":7,"item":[["nasi",60],["telur",35],["bayam",40],["minyak_sawit",5],["pepaya",50],["yogurt",60]]},
 {"usia":10,"item":[["kentang",80],["hati",10],["ayam",30],["wortel",50],["santan",6],["pisang",60],["tempe",20]]},
 {"usia":18,"item":[["nasi",130],["lele",60],["brokoli",80],["minyak_sawit",8],["alpukat",90],["yogurt",100],["ubi",100],["kacang_hijau",50]]},
 {"usia":23,"item":[["oat",100],["sapi",60],["labu",80],["tahu",50],["mangga",90],["jeruk",40]]},
]
def hb(x): return math.floor(x+0.5)
out=[]
for m in MENU:
    kel = "6-11_bulan" if m["usia"]<=11 else "1-3_tahun"
    tot = {}
    for k,_,_ in PETA+[("energi_kkal","",1)]:
        s=0.0
        for i,g in m["item"]:
            v=bahan[i].get(k)
            if v is not None: s+=v*g/100
        tot[k]=s
    per={}
    for k,a,f in PETA:
        ref=akg[kel]["nilai"][a]["nilai"]
        p=hb(tot[k]*f/ref*100)
        per[k]={"nilai":tot[k]*f,"persen":p,"pita":"rendah" if p<tamp["ambang_persen_rendah"] else ("sedang" if p<tamp["ambang_persen_cukup"] else "cukup")}
    beli={}
    for i,g in m["item"]:
        beli[i]=math.ceil(g*atr[i]["rasio_beli"]/5-1e-9)*5
    out.append({"usia":m["usia"],"item":m["item"],"energi_kkal":tot["energi_kkal"],"zat":per,"belanja_gram":beli})
json.dump(out,open(R/"tests/golden/kasus_gizi.json","w"),indent=1)
print("OK",len(out))
