// Fixed-window rate limiter for the auth endpoints, now backed by the
// RateLimit table so the window is shared across serverless instances — the
// old in-memory map reset on every cold start, which on a multi-instance
// deploy meant "no real limit". The map remains as the FALLBACK when the DB
// is unreachable (fail-open to local counting, never to an error), so a
// database blip cannot lock everyone out of login.
//
// The check is updateMany-then-read rather than one atomic statement; a
// couple of racing requests can slip past the boundary. That's fine — this
// is a guardrail against abuse, not an accounting system.
import { prisma } from "./prisma";

type Entry = { count: number; resetAt: number };
const store = new Map<string, Entry>();

function memoryLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const e = store.get(key);
  if (!e || e.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (e.count >= max) return false;
  e.count += 1;
  return true;
}

export async function rateLimit(
  key: string,
  max: number,
  windowMs: number,
): Promise<boolean> {
  const now = new Date();
  try {
    // Count this hit inside the live window, if one exists…
    const hit = await prisma.rateLimit.updateMany({
      where: { key, resetAt: { gt: now } },
      data: { count: { increment: 1 } },
    });
    if (hit.count === 0) {
      // …otherwise open a fresh window (also resets an expired row).
      await prisma.rateLimit.upsert({
        where: { key },
        update: { count: 1, resetAt: new Date(now.getTime() + windowMs) },
        create: { key, count: 1, resetAt: new Date(now.getTime() + windowMs) },
      });
      return true;
    }
    const row = await prisma.rateLimit.findUnique({ where: { key } });
    return (row?.count ?? 1) <= max;
  } catch {
    // DB unreachable — fall back to per-instance counting (the pre-table
    // behaviour) rather than blocking or crashing the auth flow.
    return memoryLimit(key, max, windowMs);
  }
}

export function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  return xff?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}
