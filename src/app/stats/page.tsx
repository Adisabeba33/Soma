import { prisma } from "@/lib/prisma";
import { commitUrl, getDeployInfo } from "@/lib/deploy-info";

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

  const deploy = getDeployInfo();
  const sourceUrl = commitUrl(deploy);

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

      {/* ── Deploy status: lets a non-technical owner confirm "yes, my
            updates are actually live" by looking at version markers and
            the latest commit message — sometimes UI changes aren't
            visually obvious but the engine version or commit SHA prove
            the deploy happened. ─────────────────────────────────────── */}
      <h2 className="mt-12 font-display text-xl font-semibold">
        Deploy status
      </h2>
      <div className="mt-4 rounded-2xl border border-border bg-card p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <VersionField label="Engine version" value={deploy.engineVersion} accent />
          <VersionField label="Vocab version" value={deploy.vocabVersion} />
          <VersionField
            label="Branch"
            value={deploy.branch ?? (deploy.isLocal ? "(local dev)" : "—")}
          />
          <VersionField
            label="Environment"
            value={
              deploy.vercelEnv ?? (deploy.isLocal ? "local development" : "—")
            }
          />
        </div>

        {deploy.commitShaShort && (
          <div className="mt-5 border-t border-border pt-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Latest deployed commit
            </p>
            <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              {sourceUrl ? (
                <a
                  href={sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-sm font-semibold text-accent hover:underline"
                >
                  {deploy.commitShaShort}
                </a>
              ) : (
                <span className="font-mono text-sm font-semibold text-foreground">
                  {deploy.commitShaShort}
                </span>
              )}
              {deploy.commitAuthor && (
                <span className="text-xs text-muted-foreground">
                  by {deploy.commitAuthor}
                </span>
              )}
            </div>
            {deploy.commitMessage && (
              <p className="mt-2 text-sm text-foreground">
                {deploy.commitMessage}
              </p>
            )}
          </div>
        )}

        {deploy.isLocal && (
          <p className="mt-4 rounded-lg bg-brass/10 px-3 py-2 text-xs leading-relaxed text-foreground/80">
            Running locally — version markers reflect this checkout. The
            commit panel only populates on a Vercel deployment, where the
            Vercel-injected git env vars are available.
          </p>
        )}
      </div>

      <h2 className="mt-12 font-display text-xl font-semibold">Run counts</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
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

function VersionField({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
      <p
        className={`mt-1 font-display text-xl font-semibold tabular-nums ${
          accent ? "text-accent" : "text-foreground"
        }`}
      >
        {value}
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
