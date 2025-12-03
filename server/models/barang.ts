import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function connectDatabase() {
  try {
    await prisma.$connect();
    console.log("✓ Connected to PostgreSQL via Neon");
    return prisma;
  } catch (error) {
    console.error("✗ PostgreSQL connection failed:", error);
    throw error;
  }
}

export function getDatabase() {
  return prisma;
}

export async function getAllBarang() {
  return prisma.barang.findMany();
}

export async function getBarangById(id: string) {
  return prisma.barang.findUnique({
    where: { id },
  });
}

export async function getBarangByKategori(kategori: string) {
  return prisma.barang.findMany({
    where: { kategori },
  });
}

export async function createBarang(data: {
  nama: string;
  kategori: string;
  harga: number;
  stok: number;
  foto: string;
  deskripsi: string;
}) {
  return prisma.barang.create({
    data,
  });
}

export async function updateBarang(
  id: string,
  data: Partial<{
    nama: string;
    kategori: string;
    harga: number;
    stok: number;
    foto: string;
    deskripsi: string;
  }>
) {
  return prisma.barang.update({
    where: { id },
    data,
  });
}

export async function deleteBarang(id: string) {
  return prisma.barang.delete({
    where: { id },
  });
}
