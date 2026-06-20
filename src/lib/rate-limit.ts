// Tiny in-memory fixed-window rate limiter for auth endpoints. Per server
// instance (resets on cold start / not shared across serverless instances), so
// it's a guardrail against casual abuse, not a hard global limit — a shared
// store (e.g. Upstash) can replace it later without changing call sites.
type Entry = { count: number; resetAt: number };
const store = new Map<string, Entry>();

export function rateLimit(key: string, max: number, windowMs: number): boolean {
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

export function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  return xff?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}
