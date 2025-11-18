import { Collection, Db, ObjectId } from "mongodb";
import { getDatabase } from "./barang";

export interface User {
  _id?: ObjectId;
  email: string;
  password: string;
  nama: string;
  noTelepon?: string;
  alamat?: string;
  kota?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserDocument extends User {
  _id: ObjectId;
}

let userCollection: Collection<User>;

export function initUserCollection() {
  const db = getDatabase();
  userCollection = db.collection<User>("users");
  return userCollection;
}

export function getUserCollection() {
  return userCollection;
}

export async function createUser(user: Omit<User, "_id" | "createdAt" | "updatedAt">) {
  const collection = getUserCollection();
  const result = await collection.insertOne({
    ...user,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return result.insertedId;
}

export async function getUserByEmail(email: string) {
  const collection = getUserCollection();
  return collection.findOne({ email });
}

export async function getUserById(id: ObjectId) {
  const collection = getUserCollection();
  return collection.findOne({ _id: id });
}
