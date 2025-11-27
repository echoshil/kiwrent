/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * Barang (Item) interface for inventory
 */
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

/**
 * API Response for barang
 */
export interface BarangListResponse {
  message: string;
  data: Barang[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface BarangDetailResponse {
  message: string;
  data: Barang;
}

export interface KategoriResponse {
  message: string;
  data: string[];
}

/**
 * Paket Item interface
 */
export interface PaketItem {
  barangId: string;
  nama: string;
  jumlah: number;
}

/**
 * Paket (Package) interface
 */
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

/**
 * API Response for paket
 */
export interface PaketListResponse {
  message: string;
  data: Paket[];
}

export interface PaketDetailResponse {
  message: string;
  data: Paket;
}

/**
 * User interface
 */
export interface User {
  _id?: string;
  email: string;
  nama: string;
  noTelepon?: string;
  alamat?: string;
  kota?: string;
  isAdmin?: boolean;
}

/**
 * Auth API Responses
 */
export interface AuthResponse {
  message: string;
  token?: string;
  data?: {
    userId: string;
    email: string;
    nama: string;
    noTelepon?: string;
    alamat?: string;
    kota?: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  nama: string;
  noTelepon?: string;
}

export interface UpdateProfileRequest {
  nama?: string;
  noTelepon?: string;
  alamat?: string;
  kota?: string;
}
