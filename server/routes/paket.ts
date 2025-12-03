import { RequestHandler } from "express";
import * as paketModel from "../models/paket";

export interface PaketResponse {
  message: string;
  data?: any;
  error?: string;
}

const getAllPaketHandler: RequestHandler = async (req, res) => {
  try {
    const items = await paketModel.getAllPaket();

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

const getPaketByIdHandler: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await paketModel.getPaketById(id);

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

// Export both handler and old names for compatibility
export const getAllPaket = getAllPaketHandler;
export const getPaketById = getPaketByIdHandler;
