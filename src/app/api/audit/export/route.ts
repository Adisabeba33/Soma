import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/user";

export const dynamic = "force-dynamic";

// One-call dump of the requester's RunAudit rows (both Taste Match and
// Compare). Owner-only: scoped by the anonymous user cookie. Returns a
// downloadable JSON array of full snapshots so the local jq /
// pattern-review workflow keeps working in production.
//
// Query params:
//   ?since=ISO_DATE   — only runs after this timestamp
//   ?limit=N          — cap response size (default 500, max 5000)
//   ?source=NAME      — filter to "taste-match" or "compare" only
export async function GET(req: NextRequest) {
  const userId = await getUserId();
  const params = req.nextUrl.searchParams;
  const limit = Math.min(
    Math.max(parseInt(params.get("limit") ?? "500", 10) || 500, 1),
    5000,
  );
  const sinceStr = params.get("since");
  const since = sinceStr ? new Date(sinceStr) : null;
  const sourceFilter = params.get("source");
  const source =
    sourceFilter === "taste-match" || sourceFilter === "compare"
      ? sourceFilter
      : null;

  const rows = await prisma.runAudit.findMany({
    where: {
      userId,
      ...(source ? { source } : {}),
      ...(since && !isNaN(since.getTime()) ? { runAt: { gte: since } } : {}),
    },
    orderBy: { runAt: "desc" },
    take: limit,
    select: { id: true, source: true, runAt: true, snapshot: true },
  });

  const payload = {
    exportedAt: new Date().toISOString(),
    userId,
    count: rows.length,
    entries: rows.map((r) => ({
      id: r.id,
      source: r.source,
      runAt: r.runAt.toISOString(),
      ...(typeof r.snapshot === "object" && r.snapshot !== null
        ? (r.snapshot as Record<string, unknown>)
        : { snapshot: r.snapshot }),
    })),
  };

  return new NextResponse(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="soma-run-audit-${new Date().toISOString().slice(0, 10)}.json"`,
    },
  });
}
