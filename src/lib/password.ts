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

// The most common passwords that clear the length bar anyway (top of every
// breach list, lowercased). Not a breach-database check — just the shortlist
// that would otherwise sail through. Checked case-insensitively.
const COMMON_PASSWORDS = new Set([
  "1234567890",
  "12345678910",
  "0123456789",
  "qwertyuiop",
  "1q2w3e4r5t",
  "q1w2e3r4t5y6",
  "password12",
  "password123",
  "password1234",
  "passw0rd123",
  "1234qwerty",
  "qwerty1234",
  "qwerty123456",
  "asdfghjkl123",
  "iloveyou12",
  "iloveyou123",
  "welcome123",
  "admin12345",
  "letmein123",
  "sunshine123",
  "football123",
  "baseball123",
  "dragon12345",
  "superman123",
  "montypython",
]);

// Validation applies when a password is SET (signup / reset) — existing
// accounts keep logging in with whatever they registered.
export function validatePassword(password: string): string | null {
  if (password.length < 10) return "Password must be at least 10 characters.";
  if (password.length > 200) return "Password is too long.";
  if (/^(.)\1+$/.test(password)) return "Password can't be one repeated character.";
  if (COMMON_PASSWORDS.has(password.toLowerCase()))
    return "That password is too common — pick something more unique.";
  return null;
}
