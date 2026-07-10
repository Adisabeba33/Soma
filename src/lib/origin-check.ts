// Cross-origin write protection (CSRF defence-in-depth). The session cookie
// is SameSite=Lax, which already blocks most cross-site POSTs in modern
// browsers — this adds the standard second layer: a mutating /api request
// whose Origin header names a DIFFERENT site is rejected outright.
//
// Rules (pure function so it's unit-testable; the middleware just wires it):
//   • Safe methods (GET/HEAD/OPTIONS) — always allowed.
//   • No Origin header — allowed: non-browser clients (curl, health checks)
//     don't send one, and they can't carry a victim's cookie anyway.
//   • Origin present — its host must match the request host, or the host of
//     NEXT_PUBLIC_APP_URL when that is configured (proxied deployments where
//     the internal Host header differs from the public one).

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

function hostOf(url: string): string | null {
  try {
    return new URL(url).host.toLowerCase();
  } catch {
    return null;
  }
}

export function isAllowedOrigin(opts: {
  method: string;
  origin: string | null;
  requestHost: string | null;
  publicAppUrl?: string | null;
}): boolean {
  if (SAFE_METHODS.has(opts.method.toUpperCase())) return true;
  if (!opts.origin) return true; // non-browser client
  const originHost = hostOf(opts.origin);
  if (!originHost) return false; // malformed Origin on a write → reject
  if (opts.requestHost && originHost === opts.requestHost.toLowerCase()) return true;
  const publicHost = opts.publicAppUrl ? hostOf(opts.publicAppUrl) : null;
  return publicHost !== null && originHost === publicHost;
}
