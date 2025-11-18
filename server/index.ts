import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { connectDatabase, getDatabase } from "./models/barang";
import { initPaketCollection } from "./models/paket";
import {
  getAllBarang,
  getBarangById,
  getKategori,
} from "./routes/barang";
import {
  getAllPaket,
  getPaketById,
} from "./routes/paket";

export async function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Connect to MongoDB
  try {
    await connectDatabase();
    initPaketCollection();
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
  }

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Barang routes
  app.get("/api/barang", getAllBarang);
  app.get("/api/barang/:id", getBarangById);
  app.get("/api/kategori", getKategori);

  // Paket routes
  app.get("/api/paket", getAllPaket);
  app.get("/api/paket/:id", getPaketById);

  return app;
}
