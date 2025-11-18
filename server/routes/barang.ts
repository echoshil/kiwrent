import { RequestHandler } from "express";
import { getBarangCollection } from "../models/barang";
import { ObjectId } from "mongodb";

export interface BarangResponse {
  message: string;
  data?: any;
  error?: string;
}

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
