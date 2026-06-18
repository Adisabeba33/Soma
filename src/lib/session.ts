// Stateless session token: a compact HMAC-signed value (payload.signature)
// stored in an httpOnly cookie. No session table — the signature + an embedded
// expiry are enough to trust the user id. Signed with AUTH_SECRET; when that is
// unset the helpers are inert (return null), so login is simply dormant and the
// app keeps working anonymously until the secret is configured.
import { createHmac, timingSafeEqual } from "crypto";

export const SESSION_COOKIE = "soma_session";
const TTL_DAYS = 30;

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * TTL_DAYS,
};

function secret(): string | null {
  return process.env.AUTH_SECRET || null;
}

export function createSessionToken(userId: string, ttlDays = TTL_DAYS): string | null {
  const s = secret();
  if (!s) return null;
  const payload = Buffer.from(
    JSON.stringify({ uid: userId, exp: Date.now() + ttlDays * 86_400_000 }),
  ).toString("base64url");
  const sig = createHmac("sha256", s).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

export function verifySessionToken(token: string): string | null {
  const s = secret();
  if (!s) return null;
  const dot = token.indexOf(".");
  if (dot < 1) return null;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = createHmac("sha256", s).update(payload).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (
      typeof data.uid !== "string" ||
      typeof data.exp !== "number" ||
      Date.now() > data.exp
    )
      return null;
    return data.uid;
  } catch {
    return null;
  }
}
