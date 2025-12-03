import { RequestHandler } from "express";
import {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  updatePaymentStatus,
  getDatabase,
} from "../models/order";
import { getBarangById } from "../models/barang";
import { verifyToken } from "../utils/auth";
import { getUserById } from "../models/user";

export interface OrderResponse {
  message: string;
  data?: any;
  error?: string;
}

export const createOrderHandler: RequestHandler = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      res.status(401).json({ message: "Tidak terautentikasi" });
      return;
    }

    const payload = verifyToken(token);
    if (!payload) {
      res.status(401).json({ message: "Token tidak valid" });
      return;
    }

    const { items, nama, alamatPengiriman, noTelepon, catatan, buktiPembayaran } = req.body;

    if (!items || items.length === 0) {
      res.status(400).json({ message: "Keranjang kosong" });
      return;
    }

    if (!nama || !alamatPengiriman || !noTelepon) {
      res
        .status(400)
        .json({ message: "Nama, alamat, dan nomor telepon harus diisi" });
      return;
    }

    if (!buktiPembayaran) {
      res.status(400).json({ message: "Bukti pembayaran harus diunggah" });
      return;
    }

    // Calculate total and validate items
    let totalHarga = 0;
    const processedItems = [];

    for (const item of items) {
      const barang = await getBarangById(item.barangId);

      if (!barang) {
        res.status(404).json({ message: `Barang ${item.barangId} tidak ditemukan` });
        return;
      }

      if (barang.stok < item.jumlah) {
        res.status(400).json({
          message: `Stok ${barang.nama} tidak cukup. Tersedia: ${barang.stok}`,
        });
        return;
      }

      const subTotal = barang.harga * item.jumlah * (item.durasi || 1);
      totalHarga += subTotal;

      processedItems.push({
        barangId: item.barangId,
        nama: barang.nama,
        harga: barang.harga,
        jumlah: item.jumlah,
        durasi: item.durasi || 1,
        subTotal,
      });
    }

    // Create order
    const order = await createOrder({
      userId: payload.userId,
      items: processedItems,
      totalHarga,
      statusPembayaran: "pending",
      statusPengiriman: "pending",
      alamatPengiriman,
      noTelepon,
      catatan: catatan || "",
      buktiPembayaran,
    });

    res.status(201).json({
      message: "Pesanan berhasil dibuat",
      data: {
        orderId: order.id,
        totalHarga,
      },
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({
      message: "Error membuat pesanan",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getUserOrdersHandler: RequestHandler = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      res.status(401).json({ message: "Tidak terautentikasi" });
      return;
    }

    const payload = verifyToken(token);
    if (!payload) {
      res.status(401).json({ message: "Token tidak valid" });
      return;
    }

    const orders = await getUserOrders(payload.userId);

    res.json({
      message: "Pesanan berhasil diambil",
      data: orders,
    });
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({
      message: "Error mengambil pesanan",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getOrderByIdHandler: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      res.status(401).json({ message: "Tidak terautentikasi" });
      return;
    }

    const payload = verifyToken(token);
    if (!payload) {
      res.status(401).json({ message: "Token tidak valid" });
      return;
    }

    const order = await getOrderById(id);

    if (!order) {
      res.status(404).json({ message: "Pesanan tidak ditemukan" });
      return;
    }

    // Check if user owns this order
    if (order.userId !== payload.userId) {
      res.status(403).json({ message: "Anda tidak memiliki akses ke pesanan ini" });
      return;
    }

    res.json({
      message: "Pesanan berhasil diambil",
      data: order,
    });
  } catch (error) {
    console.error("Get order error:", error);
    res.status(500).json({
      message: "Error mengambil pesanan",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const updateOrderStatusHandler: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      res.status(401).json({ message: "Tidak terautentikasi" });
      return;
    }

    const payload = verifyToken(token);
    if (!payload) {
      res.status(401).json({ message: "Token tidak valid" });
      return;
    }

    if (!["pending", "dikirim", "diterima"].includes(status)) {
      res.status(400).json({ message: "Status tidak valid" });
      return;
    }

    const order = await getOrderById(id);
    if (!order) {
      res.status(404).json({ message: "Pesanan tidak ditemukan" });
      return;
    }

    if (order.userId !== payload.userId) {
      res.status(403).json({ message: "Anda tidak memiliki akses ke pesanan ini" });
      return;
    }

    await updateOrderStatus(id, status as "pending" | "dikirim" | "diterima");

    res.json({
      message: "Status pesanan berhasil diupdate",
    });
  } catch (error) {
    console.error("Update order error:", error);
    res.status(500).json({
      message: "Error update pesanan",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const verifyPaymentHandler: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      res.status(401).json({ message: "Tidak terautentikasi" });
      return;
    }

    const payload = verifyToken(token);
    if (!payload) {
      res.status(401).json({ message: "Token tidak valid" });
      return;
    }

    const user = await getUserById(payload.userId);
    if (!user?.isAdmin) {
      res
        .status(403)
        .json({ message: "Hanya admin yang dapat memverifikasi pembayaran" });
      return;
    }

    const order = await getOrderById(id);
    if (!order) {
      res.status(404).json({ message: "Pesanan tidak ditemukan" });
      return;
    }

    await updatePaymentStatus(id, "lunas");

    res.json({
      message: "Pembayaran berhasil diverifikasi",
    });
  } catch (error) {
    console.error("Verify payment error:", error);
    res.status(500).json({
      message: "Error memverifikasi pembayaran",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const rejectPaymentHandler: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      res.status(401).json({ message: "Tidak terautentikasi" });
      return;
    }

    const payload = verifyToken(token);
    if (!payload) {
      res.status(401).json({ message: "Token tidak valid" });
      return;
    }

    const user = await getUserById(payload.userId);
    if (!user?.isAdmin) {
      res.status(403).json({ message: "Hanya admin yang dapat menolak pembayaran" });
      return;
    }

    const order = await getOrderById(id);
    if (!order) {
      res.status(404).json({ message: "Pesanan tidak ditemukan" });
      return;
    }

    await updatePaymentStatus(id, "pending");

    res.json({
      message: "Pembayaran ditolak. Pesanan kembali menunggu pembayaran",
    });
  } catch (error) {
    console.error("Reject payment error:", error);
    res.status(500).json({
      message: "Error menolak pembayaran",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
