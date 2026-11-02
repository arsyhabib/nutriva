/**
 * Daftar kata yang BOLEH dipakai penjelas AI (daftar putih). Kata di luar daftar membuat keluaran ditolak
 * dan aplikasi memakai templat deterministik. Daftar disusun untuk bahasa orang tua/kader posyandu dan sengaja
 * TIDAK memuat kata obat, suplemen, nama penyakit, madu, dosis, dan sejenisnya (diuji di tests/ai-kosakata.test.ts).
 * Menambah kata: pastikan aman, lalu tambahkan uji. Bentuk berimbuhan dicantumkan satu per satu.
 */
const UMUM = `
a ada adalah adanya agar akan aku alam anda anak anaknya antara apa apabila apakah atas atau awal ayo bagaimana bagi bagian bahwa
banyak bantu bantuan barang baru bawa beberapa begini begitu belum benar berapa berbagai berikut berikutnya bersama besar bila bisa
boleh bukan bulan cara cukup dalam dan dapat dari datang dengan di dia dilakukan diri dirinya dll dulu dulunya dua ia ini itu jadi
jangan jangan jauh juga jika jumlah kalau kali kami kamu kan karena kasih ke kecil kedua kemudian kembali kepada kita kok kurang lagi
lain lainnya lalu lama lebih lewat lima maka makin mampu mana masa masih mau melalui memang mencapai mengapa menjadi menurut mereka
mudah mungkin nah namun nanti nya oleh pada padahal paling para pernah perlu pun saat saja sambil sampai sangat sama sebab
sebelum sebelumnya sebagai sebaiknya sebuah secara sedang sedikit segera sehingga sekali sekarang sekitar selalu selama selain
seluruh semakin semua sempat sendiri seperti sering serta sesuai setelah setiap suatu sudah supaya tadi tahu tanpa tapi tentang
tentu tentunya tepat terhadap terlalu tersebut tertentu tetap tetapi tiap tidak tiga untuk upaya usah waktu walau walaupun yaitu
yakni yang ya ibu bapak ayah orang tua keluarga rumah kader petugas bidan dokter kesehatan posyandu puskesmas klinik fasilitas
tenaga kunjungan kunjungi dikunjungi ditimbang timbang penimbangan menimbang pengukuran mengukur ukur diukur ukuran periksa
diperiksa pemeriksaan memeriksa periksakan konsultasi tanyakan bertanya tanya jawab pertanyaan lanjut lanjutan ulang ulangi
dekat terdekat dekatnya kapan nanti hari ini harian bulanan mingguan minggu pagi siang sore malam sekali sehari seminggu sebulan
setahun tahun rutin teratur berkala jadwal setiap bulan tiap pekan pekanan
`;
const TUMBUH = `
tumbuh tumbuhnya pertumbuhan perkembangan berkembang kembang usia umur umurnya usianya bayi balita batita kecilnya besarnya berat
badan badannya berat panjang tinggi pendek kurus gemuk normal rentang kategori status hasil hasilnya hitung dihitung perhitungan
mesin aplikasi tabel permenkes standar rujukan acuan contoh menu pola makan makanan makananmu memberi memberikan diberikan pemberian
beri berikan kasih ASI asi menyusui menyusu susu yogurt pendamping mpasi mp porsi porsinya takaran sajian disajikan sajikan
camilan selingan sarapan siang malam bubur nasi tim lembek halus lumat cincang dicincang dihaluskan dilumatkan tekstur kental encer
lembut kunyah mengunyah dikunyah telan menelan tersedak aman keamanan segar layu matang dimasak masak memasak rebus direbus kukus
dikukus tumis goreng panggang bakar bersih cuci cuci tangan sabun air mengalir air putih minum minuman gelas piring mangkuk
makan dimakan makanlah memakan menghabiskan habis sisa sisanya lapar kenyang nafsu selera suka tidak suka menolak mau mencoba coba
dicoba kenalkan dikenalkan memperkenalkan variasi beragam keragaman ragam macam jenis kelompok kelompoknya warna berwarna
pilih pilihan memilih dipilih sebaiknya anjuran dianjurkan saran menyarankan sarankan disarankan perhatikan perhatian diperhatikan
pantau memantau dipantau pemantauan catat dicatat mencatat ingat ingatlah jaga menjaga dijaga terjaga pertahankan mempertahankan
teruskan lanjutkan melanjutkan tingkatkan meningkatkan ditingkatkan peningkatan tambah tambahkan menambah ditambah penambahan
tambahan kurangi mengurangi dikurangi berlebihan berlebih cukup kecukupan tercukupi mencukupi terpenuhi memenuhi dipenuhi
kebutuhan kebutuhannya penuhi persen kelompok target tercapai mencapai capai batas minimal maksimal kira perkiraan perkiraannya
sekitar kurang lebih rendah tinggi sedang cukup baik baiknya bagus lumayan membaik perbaikan memperbaiki sudah belum masih
sama sesuai cocok sesuaikan penyesuaian sehat sehatnya menyehatkan sehari hari
`;
const GIZI = `
gizi zat besi seng kalsium protein lemak karbohidrat serat energi kalori vitamin vit mineral folat kolin selenium magnesium fosfor
natrium kalium tembaga sumber sumbernya kaya mengandung kandungan nutrisi bergizi tumbuh darah tulang otak daya tahan tubuh kuat
menguat mendukung dukung mendukungnya membantu bantu membangun penting pentingnya berperan peran fungsi manfaat bermanfaat
hewani nabati lauk lauknya sayur sayuran buah buahan hijau kuning oranye merah daun akar umbi biji kacang kacangan serealia
makanan pokok pangan bahan bahannya olahan segar telur ayam daging hati sapi ikan lele kembung nila tempe tahu bayam wortel labu
brokoli tomat pisang pepaya alpukat jeruk mangga kentang ubi jagung oat beras nasi santan minyak sawit kelor kangkung sawi
bawang putih merah bumbu rempah kaldu kuah sup soup bubur tim pure puree jus selai roti biskuit mie bihun
keju mentega margarin lemaknya ringan ringan berat gula garam manis asin gurih asam pedas pahit rasa rasanya hambar alami
buatan kemasan instan olahan pabrik pasar warung toko belanja membeli beli dibeli harga murah mahal terjangkau anggaran hemat
daftar dipakai pakai memakai menggunakan gunakan digunakan manfaatkan dimanfaatkan simpan disimpan menyimpan kulkas dingin panas
hangat suhu basi busuk kadaluwarsa kedaluwarsa tanggal kemasannya cek periksa cermat teliti hati hati berhati
keragaman minimal delapan lima kelompok kelompoknya asupan mengasup konsumsi dikonsumsi
`;
const KEADAAN = `
kondisi kondisinya keadaan tampak terlihat terasa terlihatnya sesuai sebaliknya sebaliknya masalah menurun naik turun stabil
tetap berubah perubahan lambat cepat pelan pelan-pelan bertahap tahap tahapan langkah awal akhir mulai memulai dimulai selesai
sedikitnya setidaknya terutama khususnya misalnya contohnya yaitu yakni artinya berarti bukan tentu mungkin biasanya umumnya
harus sebaiknya wajib bisa boleh dapat mampu sempat berhasil gagal salah keliru benar betul tepat akurat lengkap tidak lengkap
data informasi keterangan catatan petunjuk panduan penjelasan jelaskan menjelaskan dijelaskan jelas bahasa sederhana singkat
ringkas ringkasan versi nomor kode layar halaman tombol pilihan menu aplikasi nutriva program prototipe belum diverifikasi
diverifikasi dosen pembimbing pengganti bukan pengganti pengganti resmi medis pribadi anjuran bukan
prihatin khawatir cemas panik tenang tenangkan lega senang bangga semangat sabar sabarlah pelan ingat ibu ayah pengasuh
pengasuhnya pengasuhan merawat rawat perawatan tidur istirahat bermain main bermainnya aktif aktivitas gerak bergerak
berbicara bicara menangis rewel nangis tertawa tersenyum belajar belajarlah mengenal dikenal terbiasa terbiasakan biasakan
kebiasaan kebiasaannya rutinitas lingkungan sekitar lingkunganmu tetangga teman saudara kakek nenek kakaknya adik adiknya
`;
const KATA_KERJA = `
ajak ajari mengajari memberi memberikan membawa dibawa bawalah membantu membuat dibuat buat membeli mencari dicari cari
menemukan ditemukan menyiapkan siapkan disiapkan menyediakan sediakan disediakan menyajikan menghindari hindari dihindari
menghindar menunggu tunggu ditunggu melihat lihat dilihat mendengar dengar mendengarkan menanyakan bertanyalah menghubungi
hubungi dihubungi menghadiri hadiri datanglah datangi mendatangi didatangi pergi pergilah kembali pulang tinggal tinggalkan
mengikuti ikuti diikuti mengikutsertakan ikut bergabung gabung menggabungkan campur mencampur dicampur campuran mengaduk aduk
diaduk menaburkan taburkan menuang tuang dituang mengambil ambil diambil menaruh taruh ditaruh meletakkan letakkan diletakkan
menyuapi suapi disuapi menyuap suap makanlah mengatur atur diatur pengaturan merencanakan rencana direncanakan perencanaan
menyusun susun disusun penyusunan menghitung memastikan pastikan memeriksa mengecek cek dicek mencatat
pakcoy pakchoy choy pak
berada perbanyak termasuk butir padat lupa masuk menunjukkan rata kekurangan tersedia pertama kehidupan utama mencakup ikat fokus
sulit setempat satu kata konsumsi kabar menggembirakan terus terpantau cerita berjalan bawah sementara ditindaklanjuti serius
dibahas merasa sejak menyukai melengkapi pencegahan akibat kebingungan soal uang terkendali pula teri serupa berbeda nama berusia
berisiko lancar terhindar sesudah kadar melainkan mulai lengkapi hindari pertimbangkan memilih pilihlah ukur saya
mohon tergolong silakan buruk
`;
export const KOSAKATA_MENTAH = [UMUM, TUMBUH, GIZI, KEADAAN, KATA_KERJA].join(" ");
export const KOSAKATA: ReadonlySet<string> = new Set(KOSAKATA_MENTAH.toLowerCase().match(/[a-z]+/g) ?? []);

const AWALAN = ["di", "ke", "me", "mem", "men", "meng", "meny", "ber", "be", "ter", "te", "se", "pe", "pem", "pen", "peng", "peny", "per", "memper"];
const AKHIRAN = ["nya", "kan", "an", "i", "lah", "kah", "kannya", "annya", "inya"];
const PELURUHAN: Record<string, string> = { mem: "p", men: "t", meng: "k", meny: "s", pem: "p", pen: "t", peng: "k", peny: "s" };

/** Kata dikenal bila bentuk dasarnya ada di daftar (imbuhan umum dilepas). */
export function kataDikenal(k: string): boolean {
  if (KOSAKATA.has(k)) return true;
  const tanpaAkhiran = [k, ...AKHIRAN.filter((a) => k.length > a.length + 2 && k.endsWith(a)).map((a) => k.slice(0, -a.length))];
  for (const w of tanpaAkhiran) {
    if (KOSAKATA.has(w)) return true;
    for (const p of AWALAN) {
      if (w.length > p.length + 2 && w.startsWith(p)) {
        const dasar = w.slice(p.length);
        if (KOSAKATA.has(dasar)) return true;
        const gantian = PELURUHAN[p];
        if (gantian && KOSAKATA.has(gantian + dasar)) return true;
      }
    }
  }
  return false;
}
