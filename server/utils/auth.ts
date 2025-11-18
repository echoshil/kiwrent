import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

interface JWTPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

// Simple JWT implementation (for production use jsonwebtoken library)
export function generateToken(payload: JWTPayload): string {
  const header = {
    alg: "HS256",
    typ: "JWT",
  };

  const now = Math.floor(Date.now() / 1000);
  const tokenPayload = {
    ...payload,
    iat: now,
    exp: now + 7 * 24 * 60 * 60, // 7 days
  };

  const encoded = {
    header: Buffer.from(JSON.stringify(header)).toString("base64url"),
    payload: Buffer.from(JSON.stringify(tokenPayload)).toString("base64url"),
  };

  const signature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(`${encoded.header}.${encoded.payload}`)
    .digest("base64url");

  return `${encoded.header}.${encoded.payload}.${signature}`;
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    const [headerB64, payloadB64, signatureB64] = token.split(".");
    if (!headerB64 || !payloadB64 || !signatureB64) return null;

    // Verify signature
    const expectedSignature = crypto
      .createHmac("sha256", JWT_SECRET)
      .update(`${headerB64}.${payloadB64}`)
      .digest("base64url");

    if (signatureB64 !== expectedSignature) return null;

    // Decode and verify payload
    const payload = JSON.parse(
      Buffer.from(payloadB64, "base64url").toString()
    ) as JWTPayload;

    // Check expiration
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

// Simple password hashing using crypto (for production use bcryptjs)
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 100000, 64, "sha512")
    .toString("hex");
  return `${salt}.${hash}`;
}

export function verifyPassword(password: string, hashedPassword: string): boolean {
  const [salt, hash] = hashedPassword.split(".");
  if (!salt || !hash) return false;

  const computedHash = crypto
    .pbkdf2Sync(password, salt, 100000, 64, "sha512")
    .toString("hex");

  return computedHash === hash;
}
