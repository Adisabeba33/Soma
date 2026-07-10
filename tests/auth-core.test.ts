import { test } from "node:test";
import assert from "node:assert/strict";
import {
  hashPassword,
  verifyPassword,
  validateUsername,
  validateEmail,
  validatePassword,
  normalizeUsername,
} from "../src/lib/password";
import { generateRawToken, hashToken } from "../src/lib/auth-tokens";

test("password hashes verify and reject correctly", () => {
  const stored = hashPassword("correct horse battery");
  assert.ok(stored.startsWith("scrypt$"));
  assert.equal(verifyPassword("correct horse battery", stored), true);
  assert.equal(verifyPassword("wrong password", stored), false);
});

test("two hashes of the same password differ (random salt)", () => {
  assert.notEqual(hashPassword("samepass1"), hashPassword("samepass1"));
});

test("verifyPassword rejects malformed stored values", () => {
  assert.equal(verifyPassword("x", "not-a-hash"), false);
  assert.equal(verifyPassword("x", "scrypt$bad"), false);
});

test("username validation", () => {
  assert.equal(validateUsername("soma_user1"), null);
  assert.ok(validateUsername("ab")); // too short
  assert.ok(validateUsername("way_too_long_username_x")); // > 20
  assert.ok(validateUsername("bad name")); // space
  assert.ok(validateUsername("bad-dash")); // dash
  assert.equal(normalizeUsername("  SoMa_User  "), "soma_user");
});

test("email and password validation", () => {
  assert.equal(validateEmail("a@b.co"), null);
  assert.ok(validateEmail("nope"));
  assert.ok(validateEmail("a@b"));
  assert.equal(validatePassword("correct horse battery"), null);
  assert.ok(validatePassword("short")); // too short
  assert.ok(validatePassword("12345678")); // below the 10-char minimum
  assert.ok(validatePassword("password123")); // common-password denylist
  assert.ok(validatePassword("QWERTY1234")); // denylist is case-insensitive
  assert.ok(validatePassword("aaaaaaaaaaaa")); // one repeated character
});

test("auth tokens: random + stable sha256 hash", () => {
  const a = generateRawToken();
  const b = generateRawToken();
  assert.notEqual(a, b);
  assert.equal(hashToken(a), hashToken(a)); // deterministic
  assert.notEqual(hashToken(a), hashToken(b));
  assert.match(hashToken(a), /^[0-9a-f]{64}$/);
});

test("session token signs and verifies with AUTH_SECRET", async () => {
  process.env.AUTH_SECRET = "test-secret-please-change";
  // Re-import after setting the env (module reads it at call time).
  const { createSessionToken, verifySessionToken } = await import("../src/lib/session");
  const token = createSessionToken("user-123");
  assert.ok(token);
  assert.equal(verifySessionToken(token!), "user-123");
  // Tampered payload fails.
  assert.equal(verifySessionToken(token!.replace(/^./, "X")), null);
  // Expired token fails.
  const expired = createSessionToken("user-123", 0, -1);
  assert.equal(verifySessionToken(expired!), null);
});

test("session token carries the mint-time epoch; legacy tokens read as 0", async () => {
  process.env.AUTH_SECRET = "test-secret-please-change";
  const { createSessionToken, verifySessionClaims } = await import("../src/lib/session");
  const t3 = createSessionToken("user-123", 3);
  assert.deepEqual(verifySessionClaims(t3!), { uid: "user-123", epoch: 3 });
  // Default mint (and tokens from before the epoch existed) → epoch 0.
  const t0 = createSessionToken("user-123");
  assert.equal(verifySessionClaims(t0!)?.epoch, 0);
  // A token whose payload predates the epo field still verifies as epoch 0.
  const { createHmac } = await import("node:crypto");
  const legacyPayload = Buffer.from(
    JSON.stringify({ uid: "user-123", exp: Date.now() + 60_000 }),
  ).toString("base64url");
  const sig = createHmac("sha256", "test-secret-please-change")
    .update(legacyPayload)
    .digest("base64url");
  assert.deepEqual(verifySessionClaims(`${legacyPayload}.${sig}`), {
    uid: "user-123",
    epoch: 0,
  });
});

test("session helpers are inert without AUTH_SECRET", async () => {
  delete process.env.AUTH_SECRET;
  const mod = await import("../src/lib/session");
  // Fresh evaluation per call already reads env lazily.
  assert.equal(mod.createSessionToken("u"), null);
  assert.equal(mod.verifySessionToken("a.b"), null);
});
