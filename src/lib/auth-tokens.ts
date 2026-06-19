// Single-use tokens for email verification and password reset. The raw token
// is emailed to the user; only its sha256 hash is persisted (AuthToken.tokenHash),
// so a database leak cannot be used to verify an email or reset a password.
import { createHash, randomBytes } from "crypto";
import { prisma } from "./prisma";

export type AuthTokenType = "email_verify" | "password_reset";

export const EMAIL_VERIFY_TTL_MS = 24 * 60 * 60 * 1000; // 24h
export const PASSWORD_RESET_TTL_MS = 60 * 60 * 1000; // 1h

export function generateRawToken(): string {
  return randomBytes(32).toString("base64url");
}

export function hashToken(raw: string): string {
  return createHash("sha256").update(raw).digest("hex");
}

// Issue a token: store its hash, return the raw value to email. Any older
// tokens of the same type for this user are cleared first (one live link).
export async function createAuthToken(
  userId: string,
  type: AuthTokenType,
  ttlMs: number,
): Promise<string> {
  const raw = generateRawToken();
  await prisma.authToken.deleteMany({ where: { userId, type } });
  await prisma.authToken.create({
    data: { userId, tokenHash: hashToken(raw), type, expiresAt: new Date(Date.now() + ttlMs) },
  });
  return raw;
}

// Validate + consume a raw token. Returns the userId on success (deleting the
// token), or null if it is unknown, the wrong type, or expired.
export async function consumeAuthToken(
  raw: string,
  type: AuthTokenType,
): Promise<string | null> {
  const row = await prisma.authToken.findUnique({ where: { tokenHash: hashToken(raw) } });
  if (!row || row.type !== type || row.expiresAt < new Date()) {
    if (row) await prisma.authToken.delete({ where: { id: row.id } }).catch(() => {});
    return null;
  }
  await prisma.authToken.delete({ where: { id: row.id } });
  return row.userId;
}
