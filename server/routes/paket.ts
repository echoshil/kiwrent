import { RequestHandler } from "express";
import { getPaketCollection } from "../models/paket";
import { ObjectId } from "mongodb";

export interface PaketResponse {
  message: string;
  data?: any;
  error?: string;
}

export const getAllPaket: RequestHandler = async (req, res) => {
  try {
    const collection = getPaketCollection();
    const items = await collection.find({}).toArray();

    res.json({
      message: "Paket retrieved successfully",
      data: items,
    });
  } catch (error) {
    console.error("Error fetching paket:", error);
    res.status(500).json({
      message: "Error fetching paket",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getPaketById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const collection = getPaketCollection();

    if (!ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid paket ID" });
      return;
    }

    const item = await collection.findOne({ _id: new ObjectId(id) });

    if (!item) {
      res.status(404).json({ message: "Paket not found" });
      return;
    }

    res.json({
      message: "Paket retrieved successfully",
      data: item,
    });
  } catch (error) {
    console.error("Error fetching paket:", error);
    res.status(500).json({
      message: "Error fetching paket",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
