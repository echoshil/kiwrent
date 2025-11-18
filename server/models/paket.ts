import { Collection, Db } from "mongodb";
import { getDatabase } from "./barang";

export interface PaketItem {
  barangId: string;
  nama: string;
  jumlah: number;
}

export interface Paket {
  _id?: string;
  nama: string;
  deskripsi: string;
  harga: number;
  foto: string;
  items: PaketItem[];
  createdAt?: Date;
  updatedAt?: Date;
}

let paketCollection: Collection<Paket>;

export function initPaketCollection() {
  const db = getDatabase();
  paketCollection = db.collection<Paket>("paket");
  return paketCollection;
}

export function getPaketCollection() {
  return paketCollection;
}
