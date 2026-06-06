import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Internal stats — SŌMA",
  robots: { index: false, follow: false },
};

// Internal counter dashboard. Not linked from nav — accessible only via
// direct /stats URL. Surfaces platform usage during the observation
// period after deploy so we can see at a glance whether real runs are
// accumulating without opening Supabase.
//
// Exposes only aggregate counts (no userId, no profile data, no run
// content). Safe to share via URL with collaborators who need to know
// "is anyone using this yet?"
export default async function StatsPage() {
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

  return (
    <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
      <p className="text-xs uppercase tracking-[0.24em] text-brass">
        Internal · Observation
      </p>
      <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight">
        Engine usage
      </h1>
      <p className="mt-3 leading-relaxed text-muted-foreground">
        Aggregate counts from <code className="text-foreground">RunAudit</code>.
        Updated on every page reload. Refresh to see latest.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <BigStat label="Total runs" value={total} tone="accent" />
        <BigStat label="Last 7 days" value={last7} />
        <BigStat label="Today" value={todayCount} />
        <BigStat
          label="Last run"
          value={lastRun ? formatRelative(lastRun.runAt, now) : "never"}
          subtitle={
            lastRun
              ? `${lastRun.source} · ${lastRun.runAt.toISOString()}`
              : "no runs yet"
          }
          isText
        />
      </div>

      <h2 className="mt-12 font-display text-xl font-semibold">By source</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <SourceStat
          label="Taste Match"
          count={tasteMatch}
          total={total}
          color="bg-accent"
        />
        <SourceStat
          label="Compare"
          count={compare}
          total={total}
          color="bg-brass"
        />
      </div>

      <h2 className="mt-12 font-display text-xl font-semibold">Other tables</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <SmallStat label="Taste profiles" value={profileCount} />
        <SmallStat label="Analysis sessions" value={sessionCount} />
      </div>

      <p className="mt-12 text-xs text-muted-foreground">
        Generated at {now.toISOString()}. For richer queries see Supabase
        Table Editor or <code>/api/audit/export</code>.
      </p>
    </div>
  );
}

function BigStat({
  label,
  value,
  subtitle,
  tone,
  isText,
}: {
  label: string;
  value: number | string;
  subtitle?: string;
  tone?: "accent";
  isText?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
      <p
        className={`mt-2 font-display ${isText ? "text-2xl" : "text-5xl"} font-semibold tabular-nums ${tone === "accent" ? "text-accent" : "text-foreground"}`}
      >
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
      {subtitle && (
        <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
      )}
    </div>
  );
}

function SourceStat({
  label,
  count,
  total,
  color,
}: {
  label: string;
  count: number;
  total: number;
  color: string;
}) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-baseline justify-between">
        <p className="text-sm font-medium">{label}</p>
        <p className="font-display text-3xl font-semibold tabular-nums">
          {count.toLocaleString()}
        </p>
      </div>
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-1.5 text-xs text-muted-foreground">{pct}% of total</p>
    </div>
  );
}

function SmallStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border bg-muted/30 p-4">
      <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 font-display text-2xl font-semibold tabular-nums">
        {value.toLocaleString()}
      </p>
    </div>
  );
}

function formatRelative(then: Date, now: Date): string {
  const diff = Math.max(0, now.getTime() - then.getTime());
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  return `${day}d ago`;
}
