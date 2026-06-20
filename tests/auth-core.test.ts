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
  assert.equal(validatePassword("12345678"), null);
  assert.ok(validatePassword("short"));
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
  const expired = createSessionToken("user-123", -1);
  assert.equal(verifySessionToken(expired!), null);
});

test("session helpers are inert without AUTH_SECRET", async () => {
  delete process.env.AUTH_SECRET;
  const mod = await import("../src/lib/session");
  // Fresh evaluation per call already reads env lazily.
  assert.equal(mod.createSessionToken("u"), null);
  assert.equal(mod.verifySessionToken("a.b"), null);
});
