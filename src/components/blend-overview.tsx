"use client";

import { Blend, Sparkles } from "lucide-react";

// Results overview for a Taste Blender run. Instead of one long ranked list
// where the origin of each pick is invisible, this shows — on one screen —
// the top picks FROM EACH profile ("world"), plus the all-rounders that hold
// up across all of them. The full ranked list still sits below for reading
// each pick in detail.

type WorldScore = { world: string; score: number };
type Breakdown = Record<string, WorldScore[]>;

function Row({
  rank,
  name,
  score,
}: {
  rank: number;
  name: string;
  score: number;
}) {
  return (
    <div className="flex items-center gap-2.5 py-1.5">
      <span className="font-display text-xs font-semibold text-brass/70 tabular-nums">
        {rank}
      </span>
      <span className="min-w-0 flex-1 truncate text-sm">{name}</span>
      <span className="shrink-0 font-display text-sm font-semibold text-brass">
        {Math.round(score)}%
      </span>
    </div>
  );
}

export function BlendOverview({
  worlds,
  breakdown,
}: {
  worlds: string[];
  breakdown: Breakdown;
}) {
  const names = Object.keys(breakdown);
  if (names.length === 0 || worlds.length < 2) return null;

  const scoreIn = (name: string, world: string) =>
    breakdown[name].find((b) => b.world === world)?.score ?? 0;

  // Top 3 strains for each profile, by that profile's own score.
  const perWorld = worlds.map((world) => ({
    world,
    picks: names
      .map((name) => ({ name, score: scoreIn(name, world) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3),
  }));

  // All-rounders: ranked by the WEAKEST world (the bridge) — a strain is only
  // universal if it holds up everywhere, so the min across worlds is the bar.
  const universal = names
    .map((name) => ({
      name,
      score: Math.min(...breakdown[name].map((b) => b.score)),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return (
    <div className="rounded-[1.75rem] border border-border/70 bg-card p-6 shadow-[0_28px_60px_-42px_rgba(60,45,20,0.45)] sm:p-7">
      <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-brass">
        <Blend className="h-3.5 w-3.5" />
        Blend overview
      </p>
      <p className="mt-1.5 text-sm text-muted-foreground">
        The strongest picks from each of your profiles, and the all-rounders
        that work across every side.
      </p>

      {/* One small panel per profile */}
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {perWorld.map(({ world, picks }) => (
          <div
            key={world}
            className="rounded-2xl border border-border/60 bg-background/40 p-4"
          >
            <p className="truncate text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/70">
              {world}
            </p>
            <div className="mt-2 divide-y divide-border/50">
              {picks.map((p, i) => (
                <Row key={p.name} rank={i + 1} name={p.name} score={p.score} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* All-rounders — highlighted */}
      <div className="mt-4 rounded-2xl border border-brass/40 bg-brass/[0.06] p-4">
        <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-brass">
          <Sparkles className="h-3.5 w-3.5" />
          Universal picks · work across all
        </p>
        <div className="mt-2 grid grid-cols-1 gap-x-6 sm:grid-cols-3">
          {universal.map((p, i) => (
            <Row key={p.name} rank={i + 1} name={p.name} score={p.score} />
          ))}
        </div>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          Scored by their weakest side — if it&apos;s high here, it pleases all
          three at once. Safe bets to try first.
        </p>
      </div>
    </div>
  );
}
