// Cross-origin write protection rules (src/lib/origin-check.ts) — the pure
// half of the /api middleware.

import { test } from "node:test";
import assert from "node:assert/strict";
import { isAllowedOrigin } from "../src/lib/origin-check";

const base = { requestHost: "soma.example", publicAppUrl: null };

test("safe methods always pass, whatever the origin", () => {
  for (const method of ["GET", "HEAD", "OPTIONS", "get"]) {
    assert.ok(isAllowedOrigin({ ...base, method, origin: "https://evil.example" }));
  }
});

test("missing Origin on a write is allowed (non-browser clients)", () => {
  assert.ok(isAllowedOrigin({ ...base, method: "POST", origin: null }));
});

test("same-origin writes pass; cross-origin writes are rejected", () => {
  assert.ok(
    isAllowedOrigin({ ...base, method: "POST", origin: "https://soma.example" }),
  );
  assert.ok(
    // Host matching is case-insensitive and ignores the scheme.
    isAllowedOrigin({ ...base, method: "DELETE", origin: "http://SOMA.example" }),
  );
  assert.ok(
    !isAllowedOrigin({ ...base, method: "POST", origin: "https://evil.example" }),
  );
  assert.ok(
    // Subdomains are different origins.
    !isAllowedOrigin({ ...base, method: "POST", origin: "https://evil.soma.example" }),
  );
});

test("malformed Origin on a write is rejected", () => {
  assert.ok(!isAllowedOrigin({ ...base, method: "POST", origin: "not a url" }));
});

test("NEXT_PUBLIC_APP_URL host is accepted behind a proxy", () => {
  assert.ok(
    isAllowedOrigin({
      method: "POST",
      origin: "https://soma.example",
      requestHost: "internal-lb:3000",
      publicAppUrl: "https://soma.example",
    }),
  );
  assert.ok(
    !isAllowedOrigin({
      method: "POST",
      origin: "https://evil.example",
      requestHost: "internal-lb:3000",
      publicAppUrl: "https://soma.example",
    }),
  );
});
