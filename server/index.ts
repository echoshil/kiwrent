import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { connectDatabase } from "./models/barang";
import { initPaketCollection } from "./models/paket";
import { initUserCollection } from "./models/user";
import { initOrderCollection } from "./models/order";
import {
  getAllBarang,
  getBarangById,
  createBarang,
  updateBarang,
  deleteBarang,
} from "./routes/barang";
import { getAllPaket, getPaketById } from "./routes/paket";
import { register, login, me, updateProfile } from "./routes/auth";
import {
  createOrderHandler,
  getUserOrdersHandler,
  getOrderByIdHandler,
  updateOrderStatusHandler,
  verifyPaymentHandler,
  rejectPaymentHandler,
} from "./routes/order";

export async function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Connect to PostgreSQL
  try {
    await connectDatabase();
    initPaketCollection();
    initUserCollection();
    initOrderCollection();
    console.log("✓ PostgreSQL initialized successfully");
  } catch (error) {
    console.error("⚠ Failed to connect to PostgreSQL:", error);
    console.warn("⚠ Running in offline mode - database operations may fail");
  }

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Auth routes
  app.post("/api/auth/register", register);
  app.post("/api/auth/login", login);
  app.get("/api/auth/me", me);
  app.put("/api/auth/profile", updateProfile);

  // Barang routes
  app.get("/api/barang", getAllBarang);
  app.get("/api/barang/:id", getBarangById);
  app.get("/api/kategori", async (_req, res) => {
    res.json({ kategori: ["Tenda", "Sleeping Bag", "Backpack", "Lainnya"] });
  });
  app.post("/api/barang", createBarang);
  app.put("/api/barang/:id", updateBarang);
  app.delete("/api/barang/:id", deleteBarang);

  // Paket routes
  app.get("/api/paket", getAllPaket);
  app.get("/api/paket/:id", getPaketById);

  // Order routes
  app.post("/api/orders", createOrderHandler);
  app.get("/api/orders", getUserOrdersHandler);
  app.get("/api/orders/:id", getOrderByIdHandler);
  app.put("/api/orders/:id/status", updateOrderStatusHandler);
  app.put("/api/orders/:id/payment/verify", verifyPaymentHandler);
  app.put("/api/orders/:id/payment/reject", rejectPaymentHandler);

  return app;
}
