import { Collection, Db, ObjectId } from "mongodb";
import { getDatabase } from "./barang";

export interface OrderItem {
  barangId: ObjectId;
  nama: string;
  harga: number;
  jumlah: number;
  durasi: number;
  subTotal: number;
}

export interface Order {
  _id?: ObjectId;
  userId: ObjectId;
  items: OrderItem[];
  totalHarga: number;
  nomorPesanan: string;
  statusPembayaran: "pending" | "lunas";
  statusPengiriman: "pending" | "dikirim" | "diterima";
  alamatPengiriman: string;
  noTelepon: string;
  catatan?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

let orderCollection: Collection<Order>;

export function initOrderCollection() {
  const db = getDatabase();
  orderCollection = db.collection<Order>("orders");
  return orderCollection;
}

export function getOrderCollection() {
  return orderCollection;
}

export async function createOrder(order: Omit<Order, "_id" | "createdAt" | "updatedAt" | "nomorPesanan">) {
  const collection = getOrderCollection();
  const nomorPesanan = `RC-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

  const result = await collection.insertOne({
    ...order,
    nomorPesanan,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return result.insertedId;
}

export async function getUserOrders(userId: ObjectId) {
  const collection = getOrderCollection();
  return collection
    .find({ userId })
    .sort({ createdAt: -1 })
    .toArray();
}

export async function getOrderById(id: ObjectId) {
  const collection = getOrderCollection();
  return collection.findOne({ _id: id });
}

export async function updateOrderStatus(id: ObjectId, status: "pending" | "dikirim" | "diterima") {
  const collection = getOrderCollection();
  return collection.updateOne(
    { _id: id },
    {
      $set: {
        statusPengiriman: status,
        updatedAt: new Date(),
      },
    }
  );
}
