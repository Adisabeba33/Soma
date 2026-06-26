"use client";

import { Blend, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

// Results overview for a Taste Blender run. Instead of one long ranked list
// where the origin of each pick is invisible, this shows — on one screen —
// the best picks FROM EACH profile ("world"), plus the Bridge picks that hold
// up across all of them. Two distinct kinds of score are labelled explicitly:
//   • profile score — the strain's strength INSIDE one profile (best-of)
//   • bridge score  — its WEAKEST side across all profiles (how universal it is)
// so the same strain showing 94% in one block and 76% in Bridge never reads
// as a bug. The full ranked list still sits below for reading each in detail.

type WorldScore = { world: string; score: number };
type Breakdown = Record<string, WorldScore[]>;

// Soft tiers for a bridge score, so a 76 and a 56 don't look equally strong.
function bridgeTier(score: number): { label: string; cls: string } {
  if (score >= 75) return { label: "Strong bridge", cls: "text-accent" };
  if (score >= 60) return { label: "Balanced", cls: "text-brass" };
  if (score >= 50) return { label: "Light bridge", cls: "text-muted-foreground" };
  return { label: "Weak bridge", cls: "text-muted-foreground/70" };
}

function Row({
  rank,
  name,
  score,
  unit,
  badge,
  tier,
}: {
  rank: number;
  name: string;
  score: number;
  unit: "profile" | "bridge";
  badge?: string;
  tier?: { label: string; cls: string };
}) {
  return (
    <div className="flex items-center gap-2.5 py-2">
      <span className="font-display text-xs font-semibold tabular-nums text-brass/70">
        {rank}
      </span>
      <div className="min-w-0 flex-1">
        <span className="block truncate text-sm">{name}</span>
        {(badge || tier) && (
          <span
            className={cn(
              "text-[10px] uppercase tracking-[0.1em]",
              tier ? tier.cls : "text-accent/80",
            )}
          >
            {tier ? tier.label : badge}
          </span>
        )}
      </div>
      <div className="shrink-0 text-right leading-none">
        <span className="font-display text-sm font-semibold text-brass">
          {Math.round(score)}%
        </span>
        <span className="ml-1 text-[9px] uppercase tracking-[0.1em] text-muted-foreground">
          {unit}
        </span>
      </div>
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

  // Top 3 strains for each profile, by that profile's own (best-of) score.
  const perWorld = worlds.map((world) => ({
    world,
    picks: names
      .map((name) => ({ name, score: scoreIn(name, world) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3),
  }));

  // How many profiles' top-3 a strain lands in — so a repeat reads as
  // "strong in N profiles", not a duplicate.
  const appearances = new Map<string, number>();
  for (const { picks } of perWorld) {
    for (const p of picks) {
      appearances.set(p.name, (appearances.get(p.name) ?? 0) + 1);
    }
  }

  // Bridge picks: ranked by the WEAKEST world (a strain is only universal if it
  // holds up everywhere, so the min across worlds is the bar).
  const bridge = names
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
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
        Each profile keeps its own winners. Bridge picks reveal the strains that
        carry across every side of your taste.
      </p>

      {/* ── Best from each profile ──────────────────────────────── */}
      <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/70">
        Best from each profile
      </p>
      <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {perWorld.map(({ world, picks }) => (
          <div
            key={world}
            className="rounded-2xl border border-border/60 bg-background/40 p-4"
          >
            <p className="truncate text-[11px] font-semibold uppercase tracking-[0.14em] text-brass">
              {world}
            </p>
            <div className="mt-1.5 divide-y divide-border/50">
              {picks.map((p, i) => (
                <Row
                  key={p.name}
                  rank={i + 1}
                  name={p.name}
                  score={p.score}
                  unit="profile"
                  badge={
                    (appearances.get(p.name) ?? 0) >= 2
                      ? `Strong in ${appearances.get(p.name)} profiles`
                      : undefined
                  }
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ── Bridge picks ────────────────────────────────────────── */}
      <div className="mt-4 rounded-2xl border border-brass/40 bg-brass/[0.06] p-4">
        <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-brass">
          <Sparkles className="h-3.5 w-3.5" />
          Bridge picks · work across all
        </p>
        <div className="mt-1.5 grid grid-cols-1 gap-x-6 sm:grid-cols-3">
          {bridge.map((p, i) => (
            <Row
              key={p.name}
              rank={i + 1}
              name={p.name}
              score={p.score}
              unit="bridge"
              tier={bridgeTier(p.score)}
            />
          ))}
        </div>
        <p className="mt-3 border-t border-brass/20 pt-3 text-xs leading-relaxed text-muted-foreground">
          Bridge score is based on a strain&apos;s weakest side. These hold up
          across all your profiles — the most balanced, not necessarily the
          strongest. A higher bridge score means every side agrees.
        </p>
      </div>
    </div>
  );
}
