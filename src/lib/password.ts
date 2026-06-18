// Password hashing + credential validation. Uses Node's built-in scrypt (a
// memory-hard KDF recommended for passwords) so there is no native/3rd-party
// dependency. The stored string is self-describing: scrypt$N$r$p$salt$hash.
import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

const N = 16384; // CPU/memory cost (128 * N * r = ~16 MB at r=8)
const R = 8;
const P = 1;
const KEYLEN = 64;

export function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, KEYLEN, { N, r: R, p: P });
  return `scrypt$${N}$${R}$${P}$${salt.toString("hex")}$${hash.toString("hex")}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const parts = stored.split("$");
  if (parts.length !== 6 || parts[0] !== "scrypt") return false;
  const [, n, r, p, saltHex, hashHex] = parts;
  let expected: Buffer;
  try {
    expected = Buffer.from(hashHex, "hex");
  } catch {
    return false;
  }
  const salt = Buffer.from(saltHex, "hex");
  const actual = scryptSync(password, salt, expected.length, {
    N: Number(n),
    r: Number(r),
    p: Number(p),
  });
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

// ---- Credential validation ------------------------------------------------

export function normalizeUsername(username: string): string {
  return username.trim().toLowerCase();
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

// Returns an error message, or null if valid. Defaults: 3–20 chars, letters /
// digits / underscore, case-insensitively unique (stored lower-cased).
export function validateUsername(username: string): string | null {
  const v = username.trim();
  if (v.length < 3 || v.length > 20) return "Username must be 3–20 characters.";
  if (!/^[a-zA-Z0-9_]+$/.test(v))
    return "Username can use letters, numbers and underscore only.";
  return null;
}

export function validateEmail(email: string): string | null {
  const v = email.trim();
  if (v.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))
    return "Enter a valid email address.";
  return null;
}

export function validatePassword(password: string): string | null {
  if (password.length < 8) return "Password must be at least 8 characters.";
  if (password.length > 200) return "Password is too long.";
  return null;
}
