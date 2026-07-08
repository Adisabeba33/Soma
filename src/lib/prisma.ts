import { createRequire } from "node:module";
import type { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Lazy singleton behind a Proxy: the client module is REQUIRED and the client
// CONSTRUCTED on first use, not at import time. Both steps throw when the
// generated client is absent ("run prisma generate" / missing
// .prisma/client), and half of src/lib transitively imports this module — so
// an eager import made even pure-logic test suites (taste-blender,
// auth-core) fail on a fresh clone whose postinstall didn't run. Runtime
// behaviour on the server is unchanged: the first query loads and builds the
// client, every later access reuses it (dev keeps the global-slot reuse
// across hot reloads). @prisma/client is server-external in Next, so the
// deferred require resolves normally at runtime.
const requireModule = createRequire(import.meta.url);

function createClient(): PrismaClient {
  const { PrismaClient: Client } = requireModule(
    "@prisma/client",
  ) as typeof import("@prisma/client");
  const client = new Client({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = client;
  }
  return client;
}

let client: PrismaClient | undefined = globalForPrisma.prisma;

export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    client ??= createClient();
    const value = Reflect.get(client, prop);
    return typeof value === "function" ? value.bind(client) : value;
  },
});
