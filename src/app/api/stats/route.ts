import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Internal stats endpoint. No auth — by design, exposes only aggregate
// counts of platform usage (no userId, no profile data, no run content).
// Used by /stats page during the observation period after deploy.
//
// If/when we want to lock this down later, gate by a simple env-var
// password header or move to /admin/stats with role check.
export async function GET() {
  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [
    total,
    tasteMatch,
    compare,
    todayCount,
    last7,
    lastRun,
    profileCount,
    sessionCount,
  ] = await Promise.all([
    prisma.runAudit.count(),
    prisma.runAudit.count({ where: { source: "taste-match" } }),
    prisma.runAudit.count({ where: { source: "compare" } }),
    prisma.runAudit.count({ where: { runAt: { gte: startOfToday } } }),
    prisma.runAudit.count({ where: { runAt: { gte: sevenDaysAgo } } }),
    prisma.runAudit.findFirst({
      orderBy: { runAt: "desc" },
      select: { runAt: true, source: true },
    }),
    prisma.tasteProfile.count(),
    prisma.analysisSession.count(),
  ]);

  return NextResponse.json({
    runs: {
      total,
      tasteMatch,
      compare,
      today: todayCount,
      last7Days: last7,
    },
    lastRunAt: lastRun?.runAt.toISOString() ?? null,
    lastRunSource: lastRun?.source ?? null,
    profiles: profileCount,
    sessions: sessionCount,
    generatedAt: now.toISOString(),
  });
}
