import { PrismaClient } from "@prisma/client";
import { getDatabase } from "./barang";

const prisma = getDatabase() as PrismaClient;

export async function getAllPaket() {
  return prisma.paket.findMany({
    include: {
      items: {
        include: {
          barang: true,
        },
      },
    },
  });
}

export async function getPaketById(id: string) {
  return prisma.paket.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          barang: true,
        },
      },
    },
  });
}

export async function createPaket(data: {
  nama: string;
  deskripsi: string;
  harga: number;
  foto: string;
  items?: Array<{
    barangId: string;
    nama: string;
    jumlah: number;
  }>;
}) {
  const { items, ...paketData } = data;

  return prisma.paket.create({
    data: {
      ...paketData,
      items: items
        ? {
            create: items,
          }
        : undefined,
    },
    include: {
      items: true,
    },
  });
}

export async function updatePaket(
  id: string,
  data: Partial<{
    nama: string;
    deskripsi: string;
    harga: number;
    foto: string;
  }>
) {
  return prisma.paket.update({
    where: { id },
    data,
  });
}

export async function deletePaket(id: string) {
  return prisma.paket.delete({
    where: { id },
  });
}

export async function initPaketCollection() {
  // No-op for compatibility
  return null;
}
