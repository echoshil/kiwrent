import { RequestHandler } from "express";
import { createUser, getUserByEmail, getUserById, updateUser } from "../models/user";
import { hashPassword, verifyPassword, generateToken, verifyToken } from "../utils/auth";

export interface AuthResponse {
  message: string;
  data?: any;
  error?: string;
  token?: string;
}

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      user?: any;
    }
  }
}

export const register: RequestHandler = async (req, res) => {
  try {
    const { email, password, nama, noTelepon } = req.body;

    // Validation
    if (!email || !password || !nama) {
      res.status(400).json({
        message: "Email, password, dan nama harus diisi",
      });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({
        message: "Password minimal 6 karakter",
      });
      return;
    }

    // Check if user exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      res.status(400).json({
        message: "Email sudah terdaftar",
      });
      return;
    }

    // Create user
    const hashedPassword = hashPassword(password);
    const user = await createUser({
      email,
      password: hashedPassword,
      nama,
      noTelepon: noTelepon || "",
    });

    // Generate token
    const token = generateToken({
      userId: user.id,
      email,
    });

    res.status(201).json({
      message: "Pendaftaran berhasil",
      token,
      data: {
        userId: user.id,
        email,
        nama,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      message: "Error saat mendaftar",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const login: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      res.status(400).json({
        message: "Email dan password harus diisi",
      });
      return;
    }

    // Find user
    const user = await getUserByEmail(email);
    if (!user) {
      res.status(401).json({
        message: "Email atau password salah",
      });
      return;
    }

    // Verify password
    if (!verifyPassword(password, user.password)) {
      res.status(401).json({
        message: "Email atau password salah",
      });
      return;
    }

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    res.json({
      message: "Login berhasil",
      token,
      data: {
        userId: user.id,
        email: user.email,
        nama: user.nama,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Error saat login",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const me: RequestHandler = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      res.status(401).json({
        message: "Token tidak ditemukan",
      });
      return;
    }

    const payload = verifyToken(token);
    if (!payload) {
      res.status(401).json({
        message: "Token tidak valid",
      });
      return;
    }

    const user = await getUserById(payload.userId);
    if (!user) {
      res.status(404).json({
        message: "User tidak ditemukan",
      });
      return;
    }

    res.json({
      message: "User profile retrieved",
      data: {
        userId: user.id,
        email: user.email,
        nama: user.nama,
        noTelepon: user.noTelepon,
        alamat: user.alamat,
        kota: user.kota,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      message: "Error mendapatkan profile",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const updateProfile: RequestHandler = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      res.status(401).json({
        message: "Token tidak ditemukan",
      });
      return;
    }

    const payload = verifyToken(token);
    if (!payload) {
      res.status(401).json({
        message: "Token tidak valid",
      });
      return;
    }

    const { nama, noTelepon, alamat, kota } = req.body;

    const updateData: any = {};
    if (nama) updateData.nama = nama;
    if (noTelepon) updateData.noTelepon = noTelepon;
    if (alamat) updateData.alamat = alamat;
    if (kota) updateData.kota = kota;

    await updateUser(payload.userId, updateData);

    const user = await getUserById(payload.userId);

    res.json({
      message: "Profile berhasil diupdate",
      data: {
        userId: user?.id,
        email: user?.email,
        nama: user?.nama,
        noTelepon: user?.noTelepon,
        alamat: user?.alamat,
        kota: user?.kota,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      message: "Error update profile",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Middleware to check authentication
export const requireAuth: RequestHandler = (req, res, next) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    res.status(401).json({
      message: "Token tidak ditemukan",
    });
    return;
  }

  const payload = verifyToken(token);
  if (!payload) {
    res.status(401).json({
      message: "Token tidak valid",
    });
    return;
  }

  req.userId = payload.userId;
  next();
};
