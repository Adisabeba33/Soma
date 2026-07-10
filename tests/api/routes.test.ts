// API route contract tests — the thin end-to-end pass over the top routes
// (auth, profile, analyze, compare, feedback) against a REAL server + REAL
// Postgres. Opt-in (`npm run test:api`), separate from the fast unit suite:
//
//   DATABASE_URL=postgresql://…  npm run test:api
//
// The suite spawns its own `next dev` on a private port, so nothing else
// needs to be running. Requires a reachable Postgres with the schema pushed
// (`npm run db:push`). Each run uses fresh random emails/usernames, so it's
// rerunnable against the same database.

import { after, before, describe, it } from "node:test";
import { strict as assert } from "node:assert";
import { spawn, type ChildProcess } from "node:child_process";
import { randomUUID } from "node:crypto";

const PORT = 3998;
const BASE = `http://127.0.0.1:${PORT}`;
const AUTH_SECRET = "api-test-secret-not-for-prod";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "tests/api: DATABASE_URL is required (a disposable Postgres with the schema pushed). " +
      "Example: DATABASE_URL=postgresql://postgres@127.0.0.1:5433/soma npm run test:api",
  );
}

let server: ChildProcess;

async function serverReady(timeoutMs = 120_000): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const r = await fetch(`${BASE}/api/auth/me`);
      if (r.status < 500) return;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error("next dev did not become ready in time");
}

before(async () => {
  server = spawn("npx", ["next", "dev", "-p", String(PORT)], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      AUTH_SECRET,
      NODE_ENV: "development",
      STRAIN_AI: "off",
    },
    stdio: "ignore",
    detached: true,
  });
  await serverReady();
});

after(() => {
  if (server?.pid) {
    try {
      process.kill(-server.pid, "SIGTERM"); // kill the whole dev-server tree
    } catch {
      server.kill("SIGTERM");
    }
  }
});

// Minimal cookie jar: collects Set-Cookie across calls so a flow (anonymous
// visit → profile → analyze, or signup → login → me) keeps its identity.
class Jar {
  private cookies = new Map<string, string>();
  header(): string {
    return [...this.cookies.entries()].map(([k, v]) => `${k}=${v}`).join("; ");
  }
  absorb(res: Response) {
    for (const line of res.headers.getSetCookie?.() ?? []) {
      const [pair] = line.split(";");
      const eq = pair.indexOf("=");
      if (eq > 0) this.cookies.set(pair.slice(0, eq).trim(), pair.slice(eq + 1));
    }
  }
  has(name: string): boolean {
    return this.cookies.has(name) && this.cookies.get(name) !== "";
  }
}

async function call(
  path: string,
  opts: {
    method?: string;
    body?: unknown;
    jar?: Jar;
    ip?: string; // distinct per test so rate-limit windows don't collide
    origin?: string;
  } = {},
): Promise<{ status: number; json: any; res: Response }> {
  const headers: Record<string, string> = { "content-type": "application/json" };
  if (opts.jar) headers.cookie = opts.jar.header();
  if (opts.ip) headers["x-forwarded-for"] = opts.ip;
  if (opts.origin) headers.origin = opts.origin;
  const res = await fetch(`${BASE}${path}`, {
    method: opts.method ?? (opts.body !== undefined ? "POST" : "GET"),
    headers,
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
    redirect: "manual",
  });
  opts.jar?.absorb(res);
  const json = await res.json().catch(() => null);
  return { status: res.status, json, res };
}

const uniq = () => randomUUID().slice(0, 8);

// A profile rich enough to clear the 60% match gate.
const RICH_PROFILE = {
  favoriteStrains: ["GG4", "OG Kush"],
  preferredAromas: ["gassy", "earthy"],
  preferredFlavors: ["gassy", "earthy"],
  preferredEffects: ["relaxed", "body-heavy"],
  likedTraits: ["gassy", "sticky"],
  primaryAroma: "gas",
  primaryEffect: "calm",
  useTime: "evening",
};

describe("cross-origin write protection (middleware)", () => {
  it("rejects a mutating /api call from a foreign origin with 403", async () => {
    const r = await call("/api/profile", {
      body: {},
      origin: "https://evil.example",
      ip: "10.9.0.1",
    });
    assert.equal(r.status, 403);
  });

  it("same-origin and origin-less writes pass the guard", async () => {
    const sameOrigin = await call("/api/analyze", {
      body: { strains: [] },
      origin: BASE,
      ip: "10.9.0.2",
    });
    assert.equal(sameOrigin.status, 400); // reached the route (contract error, not 403)
    const noOrigin = await call("/api/analyze", { body: { strains: [] }, ip: "10.9.0.2" });
    assert.equal(noOrigin.status, 400);
  });
});

describe("signup contract", () => {
  it("rejects invalid email, short and common passwords with 400", async () => {
    const cases = [
      { email: "not-an-email", password: "correct horse battery" },
      { email: `a${uniq()}@ex.com`, password: "12345678" }, // below 10
      { email: `a${uniq()}@ex.com`, password: "password123" }, // denylist
    ];
    for (const [i, c] of cases.entries()) {
      const jar = new Jar();
      const r = await call("/api/auth/signup", {
        body: { username: `u${uniq()}`, ...c },
        jar,
        ip: `10.9.1.${i + 1}`,
      });
      assert.equal(r.status, 400, JSON.stringify(r.json));
      assert.ok(r.json?.error);
    }
  });

  it("creates an account on the visitor's anonymous row and asks for verification", async () => {
    const jar = new Jar();
    const email = `t${uniq()}@example.com`;
    const r = await call("/api/auth/signup", {
      body: { username: `user${uniq()}`, email, password: "correct horse battery" },
      jar,
      ip: "10.9.2.1",
    });
    assert.equal(r.status, 200, JSON.stringify(r.json));
    assert.equal(r.json.ok, true);
    assert.equal(r.json.needsVerification, true);
  });
});

describe("login contract", () => {
  const email = `login${uniq()}@example.com`;
  const username = `login${uniq()}`;
  const password = "correct horse battery";

  it("blocks unverified accounts with 403 + needsVerification", async () => {
    const jar = new Jar();
    await call("/api/auth/signup", { body: { username, email, password }, jar, ip: "10.9.3.1" });
    const r = await call("/api/auth/login", { body: { email, password }, ip: "10.9.3.2" });
    assert.equal(r.status, 403);
    assert.equal(r.json.needsVerification, true);
  });

  it("verified login sets the session cookie; /api/auth/me reads it back; wrong password stays generic", async () => {
    // Flip emailVerified directly — the emailed-link flow is exercised by
    // auth-tokens unit tests; here we test the login/session contract.
    const { prisma } = await import("../../src/lib/prisma");
    await prisma.user.update({ where: { email }, data: { emailVerified: new Date() } });

    const bad = await call("/api/auth/login", {
      body: { email, password: "wrong password 123" },
      ip: "10.9.3.3",
    });
    assert.equal(bad.status, 401);
    assert.match(bad.json.error, /invalid email or password/i); // generic, no account leak

    const jar = new Jar();
    const ok = await call("/api/auth/login", { body: { email, password }, jar, ip: "10.9.3.4" });
    assert.equal(ok.status, 200, JSON.stringify(ok.json));
    assert.ok(jar.has("soma_session"), "login must set the session cookie");

    const me = await call("/api/auth/me", { jar });
    assert.equal(me.status, 200);
    assert.equal(me.json.username, username);
  });
});

describe("rate limiting (shared, keyed by forwarded IP)", () => {
  it("throttles repeated login attempts from one IP with 429", async () => {
    const ip = "10.9.4.99";
    let last = 0;
    for (let i = 0; i < 12; i++) {
      const r = await call("/api/auth/login", {
        body: { email: `rl${uniq()}@example.com`, password: "whatever12345" },
        ip,
      });
      last = r.status;
      if (last === 429) break;
    }
    assert.equal(last, 429, "12 attempts from one IP must trip the 10/min window");
  });
});

describe("profile → analyze → compare flow (anonymous identity)", () => {
  const jar = new Jar();

  it("analyze without a profile fails with the honest contract error", async () => {
    const r = await call("/api/analyze", { body: { strains: ["GG4"] }, jar, ip: "10.9.5.1" });
    assert.equal(r.status, 400);
    assert.match(r.json.error, /taste profile/i);
    assert.ok(jar.has("soma_uid"), "anonymous identity cookie should be set");
  });

  it("saving a rich profile returns it with contradictions report", async () => {
    const r = await call("/api/profile", { body: RICH_PROFILE, jar, ip: "10.9.5.2" });
    assert.equal(r.status, 200, JSON.stringify(r.json));
    assert.equal(r.json.profile.name, "Main");
    assert.deepEqual(r.json.profile.preferredAromas, ["gassy", "earthy"]);
    assert.ok(Array.isArray(r.json.contradictions));
  });

  it("analyze returns scored, sorted recommendations from the deterministic engine", async () => {
    const r = await call("/api/analyze", {
      body: { strains: ["GG4", "Zkittlez", "Sour Diesel", "Totally Unknown Cut #9"] },
      jar,
      ip: "10.9.5.3",
    });
    assert.equal(r.status, 200, JSON.stringify(r.json).slice(0, 300));
    const recs = r.json.recommendations;
    assert.ok(Array.isArray(recs) && recs.length === 4);
    for (let i = 1; i < recs.length; i++) {
      assert.ok(recs[i - 1].matchScore >= recs[i].matchScore, "sorted desc");
    }
    const gg4 = recs.find((x: any) => x.resolvedName === "GG4");
    assert.ok(gg4.matchScore >= 94 && gg4.matchScore <= 96, "favourite anchors to 94–96");
    const unknown = recs.find((x: any) => x.strainName.startsWith("Totally Unknown"));
    assert.equal(unknown.knownStrain, false);
    // Inferred strains cap at medium (rich profile) / low (thin) — never high.
    assert.ok(["low", "medium"].includes(unknown.confidence));
  });

  it("compare needs two strains, then ranks them against the profile", async () => {
    const short = await call("/api/compare", { body: { strains: ["GG4"] }, jar, ip: "10.9.5.4" });
    assert.equal(short.status, 400);
    const r = await call("/api/compare", {
      body: { strains: ["GG4", "Zkittlez"] },
      jar,
      ip: "10.9.5.5",
    });
    assert.equal(r.status, 200, JSON.stringify(r.json).slice(0, 300));
    assert.equal(r.json.items.length, 2);
    assert.ok(r.json.items.every((x: any) => typeof x.matchScore === "number"));
  });

  it("strain feedback round-trips: POST a verdict, GET it back", async () => {
    const post = await call("/api/strain-feedback", {
      body: { strainName: "Zkittlez", verdict: "loved" },
      jar,
      ip: "10.9.5.6",
    });
    assert.equal(post.status, 200, JSON.stringify(post.json));
    const get = await call("/api/strain-feedback", { jar });
    assert.equal(get.status, 200);
    const v = (get.json.verdicts ?? []).find((x: any) => x.strainName === "Zkittlez");
    assert.equal(v?.verdict, "loved");
  });
});
