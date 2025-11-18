import "dotenv/config";
import { MongoClient } from "mongodb";

const barangData = [
  // 1. Peralatan Tidur
  {
    nama: "Tenda Dome 2-4 Orang",
    kategori: "Peralatan Tidur",
    harga: 450000,
    stok: 8,
    foto: "https://images.unsplash.com/photo-1478827143991-c4b8b8f35b1c?w=500&h=500&fit=crop",
    deskripsi: "Tenda dome berkualitas tinggi untuk 2-4 orang dengan material tahan air dan angin.",
  },
  {
    nama: "Tenda Kapas / Tenda Besar",
    kategori: "Peralatan Tidur",
    harga: 750000,
    stok: 5,
    foto: "https://images.unsplash.com/photo-1534080564697-c171f798428f?w=500&h=500&fit=crop",
    deskripsi: "Tenda kapas besar dengan ventilasi baik, cocok untuk keluarga atau grup besar.",
  },
  {
    nama: "Flysheet / Tarp",
    kategori: "Peralatan Tidur",
    harga: 150000,
    stok: 15,
    foto: "https://images.unsplash.com/photo-1492277388267-68d1a21c9d6a?w=500&h=500&fit=crop",
    deskripsi: "Flysheet waterproof untuk melindungi tenda dari hujan dan angin kuat.",
  },
  {
    nama: "Matras Gulung",
    kategori: "Peralatan Tidur",
    harga: 80000,
    stok: 20,
    foto: "https://images.unsplash.com/photo-1583643521511-2bacce30f853?w=500&h=500&fit=crop",
    deskripsi: "Matras gulung ringan dan portabel untuk tidur nyaman di alam terbuka.",
  },
  {
    nama: "Sleeping Bag",
    kategori: "Peralatan Tidur",
    harga: 250000,
    stok: 12,
    foto: "https://images.unsplash.com/photo-1500633489496-01bd3d0f77be?w=500&h=500&fit=crop",
    deskripsi: "Sleeping bag berkualitas dengan bahan thermal untuk kehangatan maksimal.",
  },
  {
    nama: "Hammock + Webbing",
    kategori: "Peralatan Tidur",
    harga: 200000,
    stok: 10,
    foto: "https://images.unsplash.com/photo-1534080564697-c171f798428f?w=500&h=500&fit=crop",
    deskripsi: "Hammock nyaman dengan webbing berkuat tinggi untuk relaksasi outdoor.",
  },
  {
    nama: "Bantal Angin / Inflatable Pillow",
    kategori: "Peralatan Tidur",
    harga: 50000,
    stok: 25,
    foto: "https://images.unsplash.com/photo-1613398344099-0b95e97f6a0f?w=500&h=500&fit=crop",
    deskripsi: "Bantal angin ringan dan portabel untuk kenyamanan saat tidur outdoor.",
  },
  {
    nama: "Kasur Angin + Pompa",
    kategori: "Peralatan Tidur",
    harga: 300000,
    stok: 8,
    foto: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=500&h=500&fit=crop",
    deskripsi: "Kasur angin berkualitas dengan pompa listrik untuk kemudahan setup.",
  },

  // 2. Peralatan Masak & Makan
  {
    nama: "Kompor Portable (Butane/Spiritus/Gas Kaleng)",
    kategori: "Peralatan Masak & Makan",
    harga: 120000,
    stok: 12,
    foto: "https://images.unsplash.com/photo-1584568694244-14fbbc50e598?w=500&h=500&fit=crop",
    deskripsi: "Kompor portable yang praktis untuk memasak di camping dengan berbagai bahan bakar.",
  },
  {
    nama: "Windshield Kompor",
    kategori: "Peralatan Masak & Makan",
    harga: 60000,
    stok: 18,
    foto: "https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=500&h=500&fit=crop",
    deskripsi: "Windshield untuk kompor memastikan api stabil dalam kondisi berangin.",
  },
  {
    nama: "Panci Nesting / Cooking Set",
    kategori: "Peralatan Masak & Makan",
    harga: 180000,
    stok: 14,
    foto: "https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=500&h=500&fit=crop",
    deskripsi: "Set panci nesting lengkap yang dapat disusun untuk efisiensi ruang.",
  },
  {
    nama: "Wajan Kecil",
    kategori: "Peralatan Masak & Makan",
    harga: 70000,
    stok: 16,
    foto: "https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=500&h=500&fit=crop",
    deskripsi: "Wajan kecil portable untuk memasak berbagai jenis makanan outdoor.",
  },
  {
    nama: "Ceret / Kettle",
    kategori: "Peralatan Masak & Makan",
    harga: 90000,
    stok: 10,
    foto: "https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=500&h=500&fit=crop",
    deskripsi: "Ceret berkualitas untuk memasak air dan membuat teh/kopi saat camping.",
  },
  {
    nama: "Kompor Lipat Titanium",
    kategori: "Peralatan Masak & Makan",
    harga: 200000,
    stok: 7,
    foto: "https://images.unsplash.com/photo-1584568694244-14fbbc50e598?w=500&h=500&fit=crop",
    deskripsi: "Kompor lipat titanium ultra-ringan dengan stabilitas sangat baik.",
  },
  {
    nama: "Grill Portabel / Panggangan",
    kategori: "Peralatan Masak & Makan",
    harga: 250000,
    stok: 5,
    foto: "https://images.unsplash.com/photo-1555939594-58d7cb561e1f?w=500&h=500&fit=crop",
    deskripsi: "Grill portabel yang dapat dibawa untuk memanggang daging dan sayuran.",
  },
  {
    nama: "Meja Lipat",
    kategori: "Peralatan Masak & Makan",
    harga: 150000,
    stok: 10,
    foto: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&h=500&fit=crop",
    deskripsi: "Meja lipat ringan dan kokoh untuk makan atau memasak di camping.",
  },
  {
    nama: "Kursi Lipat",
    kategori: "Peralatan Masak & Makan",
    harga: 80000,
    stok: 15,
    foto: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&h=500&fit=crop",
    deskripsi: "Kursi lipat nyaman dan mudah dibawa untuk duduk saat camping.",
  },
  {
    nama: "Pisau Outdoor / Multitool",
    kategori: "Peralatan Masak & Makan",
    harga: 200000,
    stok: 11,
    foto: "https://images.unsplash.com/photo-1528148343865-15618c90dc20?w=500&h=500&fit=crop",
    deskripsi: "Pisau outdoor multi-fungsi untuk berbagai kebutuhan camping dan survival.",
  },
  {
    nama: "Sendok Garpu Stainless",
    kategori: "Peralatan Masak & Makan",
    harga: 40000,
    stok: 30,
    foto: "https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=500&h=500&fit=crop",
    deskripsi: "Set sendok dan garpu stainless steel yang tahan lama dan mudah dibersihkan.",
  },
  {
    nama: "Tumbler / Botol Air",
    kategori: "Peralatan Masak & Makan",
    harga: 70000,
    stok: 20,
    foto: "https://images.unsplash.com/photo-1602143407151-7d406855ffa1?w=500&h=500&fit=crop",
    deskripsi: "Tumbler tahan suhu untuk minum air, teh, atau kopi saat outdoor.",
  },
  {
    nama: "Termos Air Panas",
    kategori: "Peralatan Masak & Makan",
    harga: 120000,
    stok: 9,
    foto: "https://images.unsplash.com/photo-1602143407151-7d406855ffa1?w=500&h=500&fit=crop",
    deskripsi: "Termos kapasitas besar untuk menjaga air tetap panas sepanjang camping.",
  },

  // 3. Peralatan Penerangan
  {
    nama: "Headlamp",
    kategori: "Peralatan Penerangan",
    harga: 150000,
    stok: 13,
    foto: "https://images.unsplash.com/photo-1606933248051-5ce98adc4c3f?w=500&h=500&fit=crop",
    deskripsi: "Headlamp LED dengan baterai tahan lama untuk aktivitas malam di camping.",
  },
  {
    nama: "Senter Outdoor",
    kategori: "Peralatan Penerangan",
    harga: 100000,
    stok: 18,
    foto: "https://images.unsplash.com/photo-1589519160732-57fc498494f8?w=500&h=500&fit=crop",
    deskripsi: "Senter outdoor berkualitas tinggi dengan cahaya terang dan tahan air.",
  },
  {
    nama: "Lampu Tenda LED",
    kategori: "Peralatan Penerangan",
    harga: 80000,
    stok: 20,
    foto: "https://images.unsplash.com/photo-1565457207245-08b85ca8db67?w=500&h=500&fit=crop",
    deskripsi: "Lampu LED untuk tenda dengan konsumsi daya minimal dan cahaya merata.",
  },
  {
    nama: "Lantern Gas / Lampu Petromax",
    kategori: "Peralatan Penerangan",
    harga: 300000,
    stok: 4,
    foto: "https://images.unsplash.com/photo-1565457207245-08b85ca8db67?w=500&h=500&fit=crop",
    deskripsi: "Lampu petromax elegan untuk pencahayaan area camping yang luas.",
  },
  {
    nama: "Powerbank High Capacity (20k-50k mAh)",
    kategori: "Peralatan Penerangan",
    harga: 250000,
    stok: 10,
    foto: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&h=500&fit=crop",
    deskripsi: "Powerbank kapasitas besar untuk charging perangkat elektronik saat camping.",
  },
  {
    nama: "Solar Panel Portable",
    kategori: "Peralatan Penerangan",
    harga: 350000,
    stok: 6,
    foto: "https://images.unsplash.com/photo-1611350228153-102fae74f66f?w=500&h=500&fit=crop",
    deskripsi: "Solar panel portabel untuk generate listrik gratis dari matahari.",
  },

  // 4. Peralatan Safety & Survival
  {
    nama: "First Aid Kit",
    kategori: "Peralatan Safety & Survival",
    harga: 150000,
    stok: 14,
    foto: "https://images.unsplash.com/photo-1587854692152-cbe660dbde0f?w=500&h=500&fit=crop",
    deskripsi: "First aid kit lengkap untuk penanganan darurat saat camping.",
  },
  {
    nama: "Whistle / Peluit",
    kategori: "Peralatan Safety & Survival",
    harga: 30000,
    stok: 25,
    foto: "https://images.unsplash.com/photo-1516330331713-978a7ae33ce8?w=500&h=500&fit=crop",
    deskripsi: "Peluit berkualitas untuk sinyal darurat atau komunikasi di alam terbuka.",
  },
  {
    nama: "Paracord",
    kategori: "Peralatan Safety & Survival",
    harga: 50000,
    stok: 30,
    foto: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop",
    deskripsi: "Tali paracord berkuat tinggi untuk berbagai keperluan emergency.",
  },
  {
    nama: "Survival Kit Mini",
    kategori: "Peralatan Safety & Survival",
    harga: 100000,
    stok: 16,
    foto: "https://images.unsplash.com/photo-1587854692152-cbe660dbde0f?w=500&h=500&fit=crop",
    deskripsi: "Kit survival lengkap dengan berbagai tools penting untuk emergency.",
  },
  {
    nama: "Fire Starter / Korek Outdoor",
    kategori: "Peralatan Safety & Survival",
    harga: 60000,
    stok: 20,
    foto: "https://images.unsplash.com/photo-1516330331713-978a7ae33ce8?w=500&h=500&fit=crop",
    deskripsi: "Alat pemicu api yang reliable untuk membuat api unggun.",
  },
  {
    nama: "Emergency Blanket",
    kategori: "Peralatan Safety & Survival",
    harga: 40000,
    stok: 25,
    foto: "https://images.unsplash.com/photo-1599599810694-b5ac4dd3e1e1?w=500&h=500&fit=crop",
    deskripsi: "Selimut emergency reflektif untuk menjaga kehangatan dalam keadaan darurat.",
  },
  {
    nama: "Kompas",
    kategori: "Peralatan Safety & Survival",
    harga: 80000,
    stok: 12,
    foto: "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=500&h=500&fit=crop",
    deskripsi: "Kompas berkualitas tinggi untuk navigasi di alam liar.",
  },
  {
    nama: "Pisau Taktis",
    kategori: "Peralatan Safety & Survival",
    harga: 180000,
    stok: 8,
    foto: "https://images.unsplash.com/photo-1528148343865-15618c90dc20?w=500&h=500&fit=crop",
    deskripsi: "Pisau taktis multi-fungsi untuk kebutuhan survival dan camping.",
  },
  {
    nama: "Gaiter (Pelindung Kaki)",
    kategori: "Peralatan Safety & Survival",
    harga: 100000,
    stok: 15,
    foto: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop",
    deskripsi: "Gaiter untuk melindungi kaki dari debu, lumpur, dan serangga.",
  },

  // 5. Peralatan Trekking / Gunung
  {
    nama: "Carrier 50-60L",
    kategori: "Peralatan Trekking / Gunung",
    harga: 600000,
    stok: 6,
    foto: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop",
    deskripsi: "Carrier backpack 50-60L untuk trekking jarak jauh dengan kenyamanan maksimal.",
  },
  {
    nama: "Daypack 20-30L",
    kategori: "Peralatan Trekking / Gunung",
    harga: 250000,
    stok: 10,
    foto: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop",
    deskripsi: "Daypack ringan untuk membawa kebutuhan harian saat hiking.",
  },
  {
    nama: "Trekking Pole",
    kategori: "Peralatan Trekking / Gunung",
    harga: 200000,
    stok: 12,
    foto: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500&h=500&fit=crop",
    deskripsi: "Trekking pole berkualitas untuk mengurangi beban kaki saat mendaki.",
  },
  {
    nama: "Sepatu Hiking",
    kategori: "Peralatan Trekking / Gunung",
    harga: 400000,
    stok: 8,
    foto: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop",
    deskripsi: "Sepatu hiking berkualitas tinggi dengan grip dan support optimal.",
  },
  {
    nama: "Jas Hujan / Raincoat",
    kategori: "Peralatan Trekking / Gunung",
    harga: 150000,
    stok: 14,
    foto: "https://images.unsplash.com/photo-1556821552-5ff63b1b82f4?w=500&h=500&fit=crop",
    deskripsi: "Jas hujan waterproof untuk perlindungan dari cuaca buruk.",
  },
  {
    nama: "Sarung Tangan Outdoor",
    kategori: "Peralatan Trekking / Gunung",
    harga: 80000,
    stok: 18,
    foto: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop",
    deskripsi: "Sarung tangan tahan lama untuk keamanan dan kehangatan saat outdoor.",
  },
  {
    nama: "Topi / Buff",
    kategori: "Peralatan Trekking / Gunung",
    harga: 60000,
    stok: 22,
    foto: "https://images.unsplash.com/photo-1574261867152-d1be9f4b922d?w=500&h=500&fit=crop",
    deskripsi: "Topi atau buff multi-fungsi untuk perlindungan dari matahari dan angin.",
  },
  {
    nama: "Kacamata UV",
    kategori: "Peralatan Trekking / Gunung",
    harga: 120000,
    stok: 16,
    foto: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop",
    deskripsi: "Kacamata UV protection untuk melindungi mata dari sinar matahari.",
  },

  // 6. Aksesoris Tenda
  {
    nama: "Groundsheet",
    kategori: "Aksesoris Tenda",
    harga: 80000,
    stok: 16,
    foto: "https://images.unsplash.com/photo-1487730116645-74489c95b41b?w=500&h=500&fit=crop",
    deskripsi: "Groundsheet untuk perlindungan alas tenda dari kelembaban tanah.",
  },
  {
    nama: "Pasak Tambahan (Aluminium / Baja)",
    kategori: "Aksesoris Tenda",
    harga: 30000,
    stok: 40,
    foto: "https://images.unsplash.com/photo-1516330331713-978a7ae33ce8?w=500&h=500&fit=crop",
    deskripsi: "Pasak tambahan berkualitas untuk penguatan tenda di tanah.",
  },
  {
    nama: "Tambang Reflektif",
    kategori: "Aksesoris Tenda",
    harga: 25000,
    stok: 35,
    foto: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop",
    deskripsi: "Tambang reflektif untuk visibility lebih baik di malam hari.",
  },
  {
    nama: "Repair Kit Tenda",
    kategori: "Aksesoris Tenda",
    harga: 60000,
    stok: 14,
    foto: "https://images.unsplash.com/photo-1556821552-5ff63b1b82f4?w=500&h=500&fit=crop",
    deskripsi: "Kit perbaikan tenda dengan berbagai tools untuk emergency repair.",
  },
  {
    nama: "Karpet Tenda",
    kategori: "Aksesoris Tenda",
    harga: 120000,
    stok: 10,
    foto: "https://images.unsplash.com/photo-1487730116645-74489c95b41b?w=500&h=500&fit=crop",
    deskripsi: "Karpet tenda untuk kenyamanan dan kebersihan dalam tenda.",
  },

  // 7. Peralatan Kebersihan
  {
    nama: "Kantong Sampah",
    kategori: "Peralatan Kebersihan",
    harga: 15000,
    stok: 50,
    foto: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=500&h=500&fit=crop",
    deskripsi: "Kantong sampah biodegradable untuk menjaga kebersihan area camping.",
  },
  {
    nama: "Lap Microfiber",
    kategori: "Peralatan Kebersihan",
    harga: 40000,
    stok: 25,
    foto: "https://images.unsplash.com/photo-1599599810694-b5ac4dd3e1e1?w=500&h=500&fit=crop",
    deskripsi: "Lap microfiber super absorbent untuk berbagai keperluan membersihkan.",
  },
  {
    nama: "Sapu Kecil",
    kategori: "Peralatan Kebersihan",
    harga: 50000,
    stok: 12,
    foto: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=500&fit=crop",
    deskripsi: "Sapu kecil portable untuk menjaga kebersihan di dalam dan sekitar tenda.",
  },
  {
    nama: "Wastafel Portable (Opsional)",
    kategori: "Peralatan Kebersihan",
    harga: 150000,
    stok: 6,
    foto: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=500&h=500&fit=crop",
    deskripsi: "Wastafel portable untuk mencuci tangan dan perlengkapan dengan air mengalir.",
  },

  // 8. Peralatan Hiburan Outdoor
  {
    nama: "Speaker Portable Waterproof",
    kategori: "Peralatan Hiburan Outdoor",
    harga: 400000,
    stok: 6,
    foto: "https://images.unsplash.com/photo-1589003077984-894e133814c9?w=500&h=500&fit=crop",
    deskripsi: "Speaker waterproof portabel untuk musik saat bersantai di camping.",
  },
  {
    nama: "Tripod",
    kategori: "Peralatan Hiburan Outdoor",
    harga: 120000,
    stok: 10,
    foto: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=500&h=500&fit=crop",
    deskripsi: "Tripod untuk fotografi dan videografi outdoor yang stabil.",
  },
  {
    nama: "Kamera Action",
    kategori: "Peralatan Hiburan Outdoor",
    harga: 800000,
    stok: 3,
    foto: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&h=500&fit=crop",
    deskripsi: "Action camera untuk merekam petualangan camping dengan kualitas tinggi.",
  },
  {
    nama: "Board Game Kecil",
    kategori: "Peralatan Hiburan Outdoor",
    harga: 80000,
    stok: 8,
    foto: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=500&h=500&fit=crop",
    deskripsi: "Board game portable untuk hiburan malam saat camping bersama keluarga.",
  },
  {
    nama: "Playing Cards",
    kategori: "Peralatan Hiburan Outdoor",
    harga: 25000,
    stok: 30,
    foto: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=500&h=500&fit=crop",
    deskripsi: "Kartu permainan untuk berbagai permainan seru di camping.",
  },

  // 9. Peralatan BBQ & Api Unggun
  {
    nama: "Kayu Bakar / Briquette",
    kategori: "Peralatan BBQ & Api Unggun",
    harga: 50000,
    stok: 20,
    foto: "https://images.unsplash.com/photo-1555939594-58d7cb561e1f?w=500&h=500&fit=crop",
    deskripsi: "Kayu bakar atau briquette berkualitas untuk api unggun dan BBQ.",
  },
  {
    nama: "Korek Api Panjang",
    kategori: "Peralatan BBQ & Api Unggun",
    harga: 20000,
    stok: 40,
    foto: "https://images.unsplash.com/photo-1516330331713-978a7ae33ce8?w=500&h=500&fit=crop",
    deskripsi: "Korek api panjang untuk menyalakan api unggun dengan aman.",
  },
  {
    nama: "Sarung Tangan Panas",
    kategori: "Peralatan BBQ & Api Unggun",
    harga: 60000,
    stok: 15,
    foto: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop",
    deskripsi: "Sarung tangan tahan panas untuk menangani peralatan BBQ dan api.",
  },
  {
    nama: "Grill Net",
    kategori: "Peralatan BBQ & Api Unggun",
    harga: 80000,
    stok: 12,
    foto: "https://images.unsplash.com/photo-1555939594-58d7cb561e1f?w=500&h=500&fit=crop",
    deskripsi: "Grill net untuk memasak daging dan sayuran di atas api unggun.",
  },
  {
    nama: "Skewer / Tusukan Sate",
    kategori: "Peralatan BBQ & Api Unggun",
    harga: 40000,
    stok: 20,
    foto: "https://images.unsplash.com/photo-1555939594-58d7cb561e1f?w=500&h=500&fit=crop",
    deskripsi: "Skewer stainless steel untuk membuat sate dan makanan tusuk.",
  },
  {
    nama: "Firepit Portable",
    kategori: "Peralatan BBQ & Api Unggun",
    harga: 300000,
    stok: 4,
    foto: "https://images.unsplash.com/photo-1555939594-58d7cb561e1f?w=500&h=500&fit=crop",
    deskripsi: "Firepit portabel untuk api unggun yang aman dan terkontrol.",
  },
];

const paketData = [
  {
    nama: "Paket A - Couple Camp",
    deskripsi:
      "Paket sempurna untuk pasangan yang ingin romantic camping getaway. Dilengkapi dengan semua kebutuhan dasar untuk 2 orang.",
    harga: 750000,
    foto: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=500&h=500&fit=crop",
    items: [
      { barangId: "", nama: "Tenda Dome 2-4 Orang", jumlah: 1 },
      { barangId: "", nama: "Matras Gulung", jumlah: 2 },
      { barangId: "", nama: "Sleeping Bag", jumlah: 2 },
      { barangId: "", nama: "Lampu Tenda LED", jumlah: 1 },
      { barangId: "", nama: "Kompor Portable", jumlah: 1 },
      { barangId: "", nama: "Gas Kaleng", jumlah: 2 },
    ],
  },
  {
    nama: "Paket B - Family Camp",
    deskripsi:
      "Paket lengkap untuk keluarga besar. Semua yang dibutuhkan untuk camping nyaman dengan keluarga 4-6 orang.",
    harga: 1500000,
    foto: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=500&h=500&fit=crop",
    items: [
      { barangId: "", nama: "Tenda Kapas", jumlah: 1 },
      { barangId: "", nama: "Meja Lipat", jumlah: 2 },
      { barangId: "", nama: "Kursi Lipat", jumlah: 4 },
      { barangId: "", nama: "Kompor 2 Tungku", jumlah: 1 },
      { barangId: "", nama: "Cooking Set Lengkap", jumlah: 1 },
      { barangId: "", nama: "Lampu LED", jumlah: 2 },
      { barangId: "", nama: "Sleeping Bag", jumlah: 4 },
    ],
  },
  {
    nama: "Paket C - Adventure Gunung",
    deskripsi:
      "Paket eksklusif untuk pendaki gunung yang serius. Dilengkapi dengan perlengkapan professional untuk trekking mendaki.",
    harga: 2500000,
    foto: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=500&fit=crop",
    items: [
      { barangId: "", nama: "Carrier 50-60L", jumlah: 1 },
      { barangId: "", nama: "Tenda Dome 2-4 Orang", jumlah: 1 },
      { barangId: "", nama: "Sleeping Bag", jumlah: 1 },
      { barangId: "", nama: "Headlamp", jumlah: 1 },
      { barangId: "", nama: "Trekking Pole", jumlah: 1 },
      { barangId: "", nama: "First Aid Kit", jumlah: 1 },
      { barangId: "", nama: "Kompas", jumlah: 1 },
      { barangId: "", nama: "Jas Hujan", jumlah: 1 },
    ],
  },
];

async function seedDatabase() {
  const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017";
  const client = new MongoClient(mongoUri);

  try {
    await client.connect();
    const db = client.db("rentcamps");

    console.log("🔄 Seeding database...");

    // Clear existing data
    await db.collection("barang").deleteMany({});
    await db.collection("paket").deleteMany({});

    // Seed barang
    const insertedBarang = await db.collection("barang").insertMany(barangData);
    console.log(`✓ Inserted ${insertedBarang.insertedCount} barang items`);

    // Seed paket
    const insertedPaket = await db.collection("paket").insertMany(paketData);
    console.log(`✓ Inserted ${insertedPaket.insertedCount} paket items`);

    console.log("✓ Database seeding completed successfully!");
  } catch (error) {
    console.error("✗ Error seeding database:", error);
  } finally {
    await client.close();
  }
}

seedDatabase();
