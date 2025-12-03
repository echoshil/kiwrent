import { PrismaClient } from "@prisma/client";
import { getDatabase } from "./barang";

const prisma = getDatabase() as PrismaClient;

export async function createOrder(data: {
  userId: string;
  items: Array<{
    barangId: string;
    nama: string;
    harga: number;
    jumlah: number;
    durasi: number;
    subTotal: number;
  }>;
  totalHarga: number;
  alamatPengiriman: string;
  noTelepon: string;
  catatan?: string;
  statusPembayaran?: string;
  statusPengiriman?: string;
}) {
  const nomorPesanan = `RC-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  const { items, ...orderData } = data;

  return prisma.order.create({
    data: {
      ...orderData,
      nomorPesanan,
      items: {
        create: items,
      },
    },
    include: {
      items: true,
    },
  });
}

export async function getUserOrders(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    include: {
      items: {
        include: {
          barang: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getOrderById(id: string) {
  return prisma.order.findUnique({
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

export async function updateOrderStatus(
  id: string,
  status: "pending" | "dikirim" | "diterima"
) {
  return prisma.order.update({
    where: { id },
    data: {
      statusPengiriman: status,
    },
  });
}

export async function updatePaymentStatus(
  id: string,
  status: "pending" | "lunas" | "diverifikasi",
  buktiPembayaran?: string
) {
  return prisma.order.update({
    where: { id },
    data: {
      statusPembayaran: status,
      buktiPembayaran,
    },
  });
}

export async function initOrderCollection() {
  // No-op for compatibility
  return null;
}
