import { RequestHandler } from "express";
import { getBarangCollection } from "../models/barang";
import { ObjectId } from "mongodb";
import { verifyToken } from "../utils/auth";
import { getUserCollection } from "../models/user";

export interface BarangResponse {
  message: string;
  data?: any;
  error?: string;
}

const checkAdminRole = async (token: string): Promise<boolean> => {
  try {
    const payload = verifyToken(token);
    if (!payload) return false;

    const userCollection = getUserCollection();
    const user = await userCollection.findOne({ _id: new ObjectId(payload.userId) });
    return user?.isAdmin === true;
  } catch {
    return false;
  }
};

export const getAllBarang: RequestHandler = async (req, res) => {
  try {
    const { kategori, search, page = "1", limit = "12" } = req.query;
    const collection = getBarangCollection();

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    let query: any = {};

    if (kategori && kategori !== "semua") {
      query.kategori = kategori;
    }

    if (search) {
      query.$text = { $search: search };
    }

    const total = await collection.countDocuments(query);
    const items = await collection
      .find(query)
      .skip(skip)
      .limit(limitNum)
      .toArray();

    res.json({
      message: "Barang retrieved successfully",
      data: items,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("Error fetching barang:", error);
    res.status(500).json({
      message: "Error fetching barang",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getBarangById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const collection = getBarangCollection();

    if (!ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid barang ID" });
      return;
    }

    const item = await collection.findOne({ _id: new ObjectId(id) });

    if (!item) {
      res.status(404).json({ message: "Barang not found" });
      return;
    }

    res.json({
      message: "Barang retrieved successfully",
      data: item,
    });
  } catch (error) {
    console.error("Error fetching barang:", error);
    res.status(500).json({
      message: "Error fetching barang",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getKategori: RequestHandler = async (req, res) => {
  try {
    const collection = getBarangCollection();
    const categories = await collection.distinct("kategori");

    res.json({
      message: "Categories retrieved successfully",
      data: categories.sort(),
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({
      message: "Error fetching categories",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const createBarang: RequestHandler = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      res.status(401).json({ message: "Tidak terautentikasi" });
      return;
    }

    const isAdmin = await checkAdminRole(token);
    if (!isAdmin) {
      res.status(403).json({ message: "Akses ditolak. Hanya admin yang dapat membuat barang" });
      return;
    }

    const { nama, kategori, harga, stok, foto, deskripsi } = req.body;

    if (!nama || !kategori || !harga || stok === undefined || !foto || !deskripsi) {
      res.status(400).json({ message: "Semua field harus diisi" });
      return;
    }

    const collection = getBarangCollection();
    const result = await collection.insertOne({
      nama,
      kategori,
      harga: parseFloat(harga),
      stok: parseInt(stok),
      foto,
      deskripsi,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    res.status(201).json({
      message: "Barang berhasil dibuat",
      data: {
        _id: result.insertedId,
        nama,
        kategori,
        harga: parseFloat(harga),
        stok: parseInt(stok),
        foto,
        deskripsi,
      },
    });
  } catch (error) {
    console.error("Create barang error:", error);
    res.status(500).json({
      message: "Error membuat barang",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const updateBarang: RequestHandler = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      res.status(401).json({ message: "Tidak terautentikasi" });
      return;
    }

    const isAdmin = await checkAdminRole(token);
    if (!isAdmin) {
      res.status(403).json({ message: "Akses ditolak. Hanya admin yang dapat mengupdate barang" });
      return;
    }

    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid barang ID" });
      return;
    }

    const { nama, kategori, harga, stok, foto, deskripsi } = req.body;
    const collection = getBarangCollection();

    const updateData: any = {};
    if (nama) updateData.nama = nama;
    if (kategori) updateData.kategori = kategori;
    if (harga) updateData.harga = parseFloat(harga);
    if (stok !== undefined) updateData.stok = parseInt(stok);
    if (foto) updateData.foto = foto;
    if (deskripsi) updateData.deskripsi = deskripsi;
    updateData.updatedAt = new Date();

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      res.status(404).json({ message: "Barang tidak ditemukan" });
      return;
    }

    res.json({
      message: "Barang berhasil diupdate",
      data: { _id: id, ...updateData },
    });
  } catch (error) {
    console.error("Update barang error:", error);
    res.status(500).json({
      message: "Error mengupdate barang",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const deleteBarang: RequestHandler = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      res.status(401).json({ message: "Tidak terautentikasi" });
      return;
    }

    const isAdmin = await checkAdminRole(token);
    if (!isAdmin) {
      res.status(403).json({ message: "Akses ditolak. Hanya admin yang dapat menghapus barang" });
      return;
    }

    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid barang ID" });
      return;
    }

    const collection = getBarangCollection();
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      res.status(404).json({ message: "Barang tidak ditemukan" });
      return;
    }

    res.json({
      message: "Barang berhasil dihapus",
    });
  } catch (error) {
    console.error("Delete barang error:", error);
    res.status(500).json({
      message: "Error menghapus barang",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
