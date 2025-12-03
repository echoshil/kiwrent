import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "./utils/auth";

const prisma = new PrismaClient();

const barangData = [
  // 1. Peralatan Tidur
  {
    nama: "Tenda Dome 2-4 Orang",
    kategori: "Peralatan Tidur",
    harga: 450000,
    stok: 8,
    foto: "https://images.unsplash.com/photo-1478827143991-c4b8b8f35b1c?w=500&h=500&fit=crop",
    deskripsi:
      "Tenda dome berkualitas tinggi untuk 2-4 orang dengan material tahan air dan angin.",
  },
  {
    nama: "Tenda Kapas / Tenda Besar",
    kategori: "Peralatan Tidur",
    harga: 750000,
    stok: 5,
    foto: "https://images.unsplash.com/photo-1534080564697-c171f798428f?w=500&h=500&fit=crop",
    deskripsi:
      "Tenda kapas besar dengan ventilasi baik, cocok untuk keluarga atau grup besar.",
  },
  {
    nama: "Flysheet / Tarp",
    kategori: "Peralatan Tidur",
    harga: 150000,
    stok: 15,
    foto: "https://images.unsplash.com/photo-1492277388267-68d1a21c9d6a?w=500&h=500&fit=crop",
    deskripsi:
      "Flysheet waterproof untuk melindungi tenda dari hujan dan angin kuat.",
  },
  {
    nama: "Matras Gulung",
    kategori: "Peralatan Tidur",
    harga: 80000,
    stok: 20,
    foto: "https://images.unsplash.com/photo-1583643521511-2bacce30f853?w=500&h=500&fit=crop",
    deskripsi:
      "Matras gulung ringan dan portabel untuk tidur nyaman di alam terbuka.",
  },
  {
    nama: "Sleeping Bag",
    kategori: "Peralatan Tidur",
    harga: 250000,
    stok: 12,
    foto: "https://images.unsplash.com/photo-1500633489496-01bd3d0f77be?w=500&h=500&fit=crop",
    deskripsi:
      "Sleeping bag berkualitas dengan bahan thermal untuk kehangatan maksimal.",
  },
  {
    nama: "Hammock + Webbing",
    kategori: "Peralatan Tidur",
    harga: 200000,
    stok: 10,
    foto: "https://images.unsplash.com/photo-1534080564697-c171f798428f?w=500&h=500&fit=crop",
    deskripsi:
      "Hammock nyaman dengan webbing berkuat tinggi untuk relaksasi outdoor.",
  },
  {
    nama: "Bantal Angin / Inflatable Pillow",
    kategori: "Peralatan Tidur",
    harga: 50000,
    stok: 25,
    foto: "https://images.unsplash.com/photo-1613398344099-0b95e97f6a0f?w=500&h=500&fit=crop",
    deskripsi:
      "Bantal angin ringan dan portabel untuk kenyamanan saat tidur outdoor.",
  },
  {
    nama: "Kasur Angin + Pompa",
    kategori: "Peralatan Tidur",
    harga: 300000,
    stok: 8,
    foto: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=500&h=500&fit=crop",
    deskripsi:
      "Kasur angin berkualitas dengan pompa listrik untuk kemudahan setup.",
  },

  // 2. Peralatan Masak & Makan
  {
    nama: "Kompor Portable (Butane/Spiritus/Gas Kaleng)",
    kategori: "Peralatan Masak & Makan",
    harga: 120000,
    stok: 12,
    foto: "https://images.unsplash.com/photo-1584568694244-14fbbc50e598?w=500&h=500&fit=crop",
    deskripsi:
      "Kompor portable yang praktis untuk memasak di camping dengan berbagai bahan bakar.",
  },
  {
    nama: "Windshield Kompor",
    kategori: "Peralatan Masak & Makan",
    harga: 60000,
    stok: 18,
    foto: "https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=500&h=500&fit=crop",
    deskripsi:
      "Windshield untuk kompor memastikan api stabil dalam kondisi berangin.",
  },
  {
    nama: "Panci Nesting / Cooking Set",
    kategori: "Peralatan Masak & Makan",
    harga: 180000,
    stok: 14,
    foto: "https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=500&h=500&fit=crop",
    deskripsi:
      "Set panci nesting lengkap yang dapat disusun untuk efisiensi ruang.",
  },
  {
    nama: "Wajan Kecil",
    kategori: "Peralatan Masak & Makan",
    harga: 70000,
    stok: 16,
    foto: "https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=500&h=500&fit=crop",
    deskripsi:
      "Wajan kecil portable untuk memasak berbagai jenis makanan outdoor.",
  },
  {
    nama: "Ceret / Kettle",
    kategori: "Peralatan Masak & Makan",
    harga: 90000,
    stok: 10,
    foto: "https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=500&h=500&fit=crop",
    deskripsi:
      "Ceret berkualitas untuk memasak air dan membuat teh/kopi saat camping.",
  },
  {
    nama: "Kompor Lipat Titanium",
    kategori: "Peralatan Masak & Makan",
    harga: 200000,
    stok: 7,
    foto: "https://images.unsplash.com/photo-1584568694244-14fbbc50e598?w=500&h=500&fit=crop",
    deskripsi:
      "Kompor lipat titanium ultra-ringan dengan stabilitas sangat baik.",
  },
  {
    nama: "Grill Portabel / Panggangan",
    kategori: "Peralatan Masak & Makan",
    harga: 250000,
    stok: 5,
    foto: "https://images.unsplash.com/photo-1555939594-58d7cb561e1f?w=500&h=500&fit=crop",
    deskripsi:
      "Grill portabel yang dapat dibawa untuk memanggang daging dan sayuran.",
  },
  {
    nama: "Meja Lipat",
    kategori: "Peralatan Masak & Makan",
    harga: 150000,
    stok: 10,
    foto: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&h=500&fit=crop",
    deskripsi:
      "Meja lipat ringan dan kokoh untuk makan atau memasak di camping.",
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
    deskripsi:
      "Pisau outdoor multi-fungsi untuk berbagai kebutuhan camping dan survival.",
  },
  {
    nama: "Sendok Garpu Stainless",
    kategori: "Peralatan Masak & Makan",
    harga: 40000,
    stok: 30,
    foto: "https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=500&h=500&fit=crop",
    deskripsi:
      "Set sendok dan garpu stainless steel yang tahan lama dan mudah dibersihkan.",
  },
  {
    nama: "Tumbler / Botol Air",
    kategori: "Peralatan Masak & Makan",
    harga: 70000,
    stok: 20,
    foto: "https://images.unsplash.com/photo-1602143407151-7d406855ffa1?w=500&h=500&fit=crop",
    deskripsi:
      "Tumbler tahan suhu untuk minum air, teh, atau kopi saat outdoor.",
  },
  {
    nama: "Termos Air Panas",
    kategori: "Peralatan Masak & Makan",
    harga: 120000,
    stok: 9,
    foto: "https://images.unsplash.com/photo-1602143407151-7d406855ffa1?w=500&h=500&fit=crop",
    deskripsi:
      "Termos kapasitas besar untuk menjaga air tetap panas sepanjang camping.",
  },

  // 3. Peralatan Penerangan
  {
    nama: "Headlamp",
    kategori: "Peralatan Penerangan",
    harga: 150000,
    stok: 13,
    foto: "https://images.unsplash.com/photo-1606933248051-5ce98adc4c3f?w=500&h=500&fit=crop",
    deskripsi:
      "Headlamp LED dengan baterai tahan lama untuk aktivitas malam di camping.",
  },
  {
    nama: "Senter Outdoor",
    kategori: "Peralatan Penerangan",
    harga: 100000,
    stok: 18,
    foto: "https://images.unsplash.com/photo-1589519160732-57fc498494f8?w=500&h=500&fit=crop",
    deskripsi:
      "Senter outdoor berkualitas tinggi dengan cahaya terang dan tahan air.",
  },
  {
    nama: "Lampu Tenda LED",
    kategori: "Peralatan Penerangan",
    harga: 80000,
    stok: 20,
    foto: "https://images.unsplash.com/photo-1565457207245-08b85ca8db67?w=500&h=500&fit=crop",
    deskripsi:
      "Lampu LED untuk tenda dengan konsumsi daya minimal dan cahaya merata.",
  },
];

async function seedDatabase() {
  try {
    console.log("🔄 Seeding database...");

    // Clear existing data
    await prisma.orderItem.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.paketItem.deleteMany({});
    await prisma.paket.deleteMany({});
    await prisma.barang.deleteMany({});
    await prisma.user.deleteMany({});

    // Seed barang
    const insertedBarang = await prisma.barang.createMany({
      data: barangData,
    });
    console.log(`✓ Inserted ${insertedBarang.count} barang items`);

    // Seed admin user
    const adminPassword = hashPassword("123456789Ok");
    const adminUser = await prisma.user.create({
      data: {
        email: "kiikiwww@gmail.com",
        password: adminPassword,
        nama: "Admin RentCamps",
        isAdmin: true,
      },
    });
    console.log(`✓ Created admin user: ${adminUser.email}`);

    console.log("✓ Database seeding completed successfully!");
  } catch (error) {
    console.error("✗ Error seeding database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase();
