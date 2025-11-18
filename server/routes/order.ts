import { RequestHandler } from "express";
import { createOrder, getUserOrders, getOrderById, updateOrderStatus } from "../models/order";
import { getBarangCollection } from "../models/barang";
import { ObjectId } from "mongodb";
import { verifyToken } from "../utils/auth";

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

    const { items, alamatPengiriman, noTelepon, catatan } = req.body;

    if (!items || items.length === 0) {
      res.status(400).json({ message: "Keranjang kosong" });
      return;
    }

    if (!alamatPengiriman || !noTelepon) {
      res.status(400).json({ message: "Alamat dan nomor telepon harus diisi" });
      return;
    }

    // Calculate total and validate items
    const barangCollection = getBarangCollection();
    let totalHarga = 0;
    const processedItems = [];

    for (const item of items) {
      const barang = await barangCollection.findOne({
        _id: new ObjectId(item.barangId),
      });

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
        barangId: new ObjectId(item.barangId),
        nama: barang.nama,
        harga: barang.harga,
        jumlah: item.jumlah,
        durasi: item.durasi || 1,
        subTotal,
      });
    }

    // Create order
    const orderId = await createOrder({
      userId: new ObjectId(payload.userId),
      items: processedItems,
      totalHarga,
      statusPembayaran: "pending",
      statusPengiriman: "pending",
      alamatPengiriman,
      noTelepon,
      catatan: catatan || "",
    });

    res.status(201).json({
      message: "Pesanan berhasil dibuat",
      data: {
        orderId: orderId.toString(),
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

    const orders = await getUserOrders(new ObjectId(payload.userId));

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

    if (!ObjectId.isValid(id)) {
      res.status(400).json({ message: "ID pesanan tidak valid" });
      return;
    }

    const order = await getOrderById(new ObjectId(id));

    if (!order) {
      res.status(404).json({ message: "Pesanan tidak ditemukan" });
      return;
    }

    // Check if user owns this order
    if (order.userId.toString() !== payload.userId) {
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

    const order = await getOrderById(new ObjectId(id));
    if (!order) {
      res.status(404).json({ message: "Pesanan tidak ditemukan" });
      return;
    }

    if (order.userId.toString() !== payload.userId) {
      res.status(403).json({ message: "Anda tidak memiliki akses ke pesanan ini" });
      return;
    }

    await updateOrderStatus(new ObjectId(id), status);

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
