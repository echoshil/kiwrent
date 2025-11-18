import { MongoClient, Db, Collection } from "mongodb";

export interface Barang {
  _id?: string;
  nama: string;
  kategori: string;
  harga: number;
  stok: number;
  foto: string;
  deskripsi: string;
  createdAt?: Date;
  updatedAt?: Date;
}

let db: Db;
let barangCollection: Collection<Barang>;

export async function connectDatabase() {
  const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017";
  const client = new MongoClient(mongoUri);

  try {
    await client.connect();
    db = client.db("rentcamps");
    barangCollection = db.collection<Barang>("barang");

    // Create indexes for better search performance
    await barangCollection.createIndex({ nama: "text", deskripsi: "text" });
    await barangCollection.createIndex({ kategori: 1 });

    console.log("✓ Connected to MongoDB");
    return db;
  } catch (error) {
    console.error("✗ MongoDB connection failed:", error);
    throw error;
  }
}

export function getBarangCollection() {
  return barangCollection;
}

export function getDatabase() {
  return db;
}
