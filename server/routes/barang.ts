import { RequestHandler } from "express";
import * as barangModel from "../models/barang";
import { verifyToken } from "../utils/auth";
import { getUserById } from "../models/user";

export interface BarangResponse {
  message: string;
  data?: any;
  error?: string;
}

const checkAdminRole = async (token: string): Promise<boolean> => {
  try {
    const payload = verifyToken(token);
    if (!payload) return false;

    const user = await getUserById(payload.userId);
    return user?.isAdmin === true;
  } catch {
    return false;
  }
};

const getAllBarangHandler: RequestHandler = async (req, res) => {
  try {
    const { kategori, search, page = "1", limit = "12" } = req.query;

    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 12;
    const skip = (pageNum - 1) * limitNum;

    const prisma = barangModel.getDatabase();

    let where: any = {};

    if (kategori && kategori !== "semua") {
      where.kategori = kategori;
    }

    if (search) {
      where.OR = [
        { nama: { contains: search, mode: "insensitive" } },
        { deskripsi: { contains: search, mode: "insensitive" } },
      ];
    }

    const total = await prisma.barang.count({ where });
    const items = await prisma.barang.findMany({
      where,
      skip,
      take: limitNum,
    });

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

const getBarangByIdHandler: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await barangModel.getBarangById(id);

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
    const prisma = barangModel.getDatabase();
    const categories = await prisma.barang.findMany({
      select: { kategori: true },
      distinct: ["kategori"],
    });

    const categoryList = categories
      .map((item) => item.kategori)
      .filter((cat, index, self) => self.indexOf(cat) === index)
      .sort();

    res.json({
      message: "Categories retrieved successfully",
      data: categoryList,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({
      message: "Error fetching categories",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const createBarangHandler: RequestHandler = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      res.status(401).json({ message: "Tidak terautentikasi" });
      return;
    }

    const isAdmin = await checkAdminRole(token);
    if (!isAdmin) {
      res
        .status(403)
        .json({ message: "Akses ditolak. Hanya admin yang dapat membuat barang" });
      return;
    }

    const { nama, kategori, harga, stok, foto, deskripsi } = req.body;

    if (!nama || !kategori || !harga || stok === undefined || !foto || !deskripsi) {
      res.status(400).json({ message: "Semua field harus diisi" });
      return;
    }

    const item = await barangModel.createBarang({
      nama,
      kategori,
      harga: parseFloat(harga),
      stok: parseInt(stok),
      foto,
      deskripsi,
    });

    res.status(201).json({
      message: "Barang berhasil dibuat",
      data: item,
    });
  } catch (error) {
    console.error("Create barang error:", error);
    res.status(500).json({
      message: "Error membuat barang",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const updateBarangHandler: RequestHandler = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      res.status(401).json({ message: "Tidak terautentikasi" });
      return;
    }

    const isAdmin = await checkAdminRole(token);
    if (!isAdmin) {
      res
        .status(403)
        .json({ message: "Akses ditolak. Hanya admin yang dapat mengupdate barang" });
      return;
    }

    const { id } = req.params;

    const { nama, kategori, harga, stok, foto, deskripsi } = req.body;

    const updateData: any = {};
    if (nama) updateData.nama = nama;
    if (kategori) updateData.kategori = kategori;
    if (harga) updateData.harga = parseFloat(harga);
    if (stok !== undefined) updateData.stok = parseInt(stok);
    if (foto) updateData.foto = foto;
    if (deskripsi) updateData.deskripsi = deskripsi;

    const item = await barangModel.updateBarang(id, updateData);

    if (!item) {
      res.status(404).json({ message: "Barang tidak ditemukan" });
      return;
    }

    res.json({
      message: "Barang berhasil diupdate",
      data: item,
    });
  } catch (error) {
    console.error("Update barang error:", error);
    res.status(500).json({
      message: "Error mengupdate barang",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const deleteBarangHandler: RequestHandler = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      res.status(401).json({ message: "Tidak terautentikasi" });
      return;
    }

    const isAdmin = await checkAdminRole(token);
    if (!isAdmin) {
      res
        .status(403)
        .json({ message: "Akses ditolak. Hanya admin yang dapat menghapus barang" });
      return;
    }

    const { id } = req.params;

    const item = await barangModel.deleteBarang(id);

    res.json({
      message: "Barang berhasil dihapus",
      data: item,
    });
  } catch (error) {
    console.error("Delete barang error:", error);
    res.status(500).json({
      message: "Error menghapus barang",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Export both handler and old names for compatibility
export const getAllBarang = getAllBarangHandler;
export const getBarangById = getBarangByIdHandler;
export const createBarang = createBarangHandler;
export const updateBarang = updateBarangHandler;
export const deleteBarang = deleteBarangHandler;
