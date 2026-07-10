// Tiny per-instance TTL cache for full-catalog match maps (P1). Scoring 895
// strains × up to 3 profiles on every /catalog, /collection and home render
// is pure CPU burn when nothing changed between requests. Keys embed
// everything that can change a score (engine version, profile updatedAt,
// blender state, feedback fingerprint), so entries self-invalidate the
// moment the underlying data moves — the TTL only bounds memory, it is not
// the correctness mechanism. Per-instance by design: a warm serverless
// instance skips the recompute, a cold one just computes once.
import { createHash } from "crypto";

const TTL_MS = 5 * 60_000;
const MAX_ENTRIES = 100;

const store = new Map<string, { value: unknown; expires: number }>();

export function getOrCompute<T>(key: string, compute: () => T): T {
  const now = Date.now();
  const hit = store.get(key);
  if (hit && hit.expires > now) {
    // Refresh recency (Map iteration order doubles as the LRU order).
    store.delete(key);
    store.set(key, hit);
    return hit.value as T;
  }
  const value = compute();
  store.delete(key);
  store.set(key, { value, expires: now + TTL_MS });
  if (store.size > MAX_ENTRIES) {
    const oldest = store.keys().next().value;
    if (oldest !== undefined) store.delete(oldest);
  }
  return value;
}

// Stable short fingerprint for key parts that would otherwise bloat the key
// (e.g. up to 400 feedback rows). sha1 is plenty — this is a cache key, not
// a security boundary.
export function fingerprint(value: unknown): string {
  return createHash("sha1").update(JSON.stringify(value)).digest("base64url");
}
