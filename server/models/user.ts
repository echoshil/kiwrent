import { PrismaClient } from "@prisma/client";
import { getDatabase } from "./barang";

const prisma = getDatabase() as PrismaClient;

export async function createUser(data: {
  email: string;
  password: string;
  nama: string;
  noTelepon?: string;
  alamat?: string;
  kota?: string;
  isAdmin?: boolean;
}) {
  return prisma.user.create({
    data,
  });
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
  });
}

export async function updateUser(
  id: string,
  data: Partial<{
    email: string;
    password: string;
    nama: string;
    noTelepon: string;
    alamat: string;
    kota: string;
    isAdmin: boolean;
  }>
) {
  return prisma.user.update({
    where: { id },
    data,
  });
}

export async function initUserCollection() {
  // No-op for compatibility
  return null;
}
