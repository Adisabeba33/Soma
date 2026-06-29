"use client";

import { Blend, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

// Results overview for a Taste Blender run. On one screen:
//   • Top picks overall — the best of the WHOLE menu (best-of across worlds)
//   • Best from each profile — the strongest picks inside each profile
//   • Bridge picks — the all-rounders that hold up across every profile
// Three score kinds are labelled explicitly (best / profile / bridge) so the
// same strain showing different numbers never reads as a bug. Ranks are
// tie-aware: two strains at the same score share one place, joined with " / ".

type WorldScore = { world: string; score: number };
type Breakdown = Record<string, WorldScore[]>;
type Tier = { rank: number; names: string[]; score: number };

// Rank into tiers, top `maxRanks` distinct scores. Strains tied at a score
// share a tier (one place, both names).
function rankTiers(
  items: { name: string; score: number }[],
  maxRanks = 3,
): Tier[] {
  const sorted = [...items].sort((a, b) => b.score - a.score);
  const tiers: { score: number; names: string[] }[] = [];
  for (const it of sorted) {
    const last = tiers[tiers.length - 1];
    if (last && last.score === it.score) {
      last.names.push(it.name);
    } else {
      if (tiers.length >= maxRanks) break;
      tiers.push({ score: it.score, names: [it.name] });
    }
  }
  return tiers.map((t, i) => ({ rank: i + 1, names: t.names, score: t.score }));
}

function bridgeTier(score: number): { label: string; cls: string } {
  if (score >= 75) return { label: "Strong bridge", cls: "text-accent" };
  if (score >= 60) return { label: "Balanced", cls: "text-brass" };
  if (score >= 50) return { label: "Light bridge", cls: "text-muted-foreground" };
  return { label: "Weak bridge", cls: "text-muted-foreground/70" };
}

function TierRow({
  tier,
  unit,
  badge,
  tierLabel,
}: {
  tier: Tier;
  unit: string;
  badge?: string;
  tierLabel?: { label: string; cls: string };
}) {
  const shown = tier.names.slice(0, 4);
  const extra = tier.names.length - shown.length;
  return (
    <div className="flex items-start gap-2.5 py-2">
      <span className="mt-0.5 font-display text-xs font-semibold tabular-nums text-brass/70">
        {tier.rank}
      </span>
      <div className="min-w-0 flex-1">
        <span className="block text-sm">
          {shown.join("  /  ")}
          {extra > 0 && (
            <span className="text-muted-foreground"> +{extra}</span>
          )}
        </span>
        {(badge || tierLabel) && (
          <span
            className={cn(
              "text-[10px] uppercase tracking-[0.1em]",
              tierLabel ? tierLabel.cls : "text-accent/80",
            )}
          >
            {tierLabel ? tierLabel.label : badge}
          </span>
        )}
      </div>
      <div className="shrink-0 text-right leading-none">
        <span className="font-display text-sm font-semibold text-brass">
          {Math.round(tier.score)}%
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

  // Per profile.
  const perWorld = worlds.map((world) => ({
    world,
    tiers: rankTiers(names.map((name) => ({ name, score: scoreIn(name, world) }))),
  }));

  // How many profiles' top-3 a strain lands in (for the cross-profile badge).
  const appearances = new Map<string, number>();
  for (const { tiers } of perWorld) {
    for (const t of tiers) for (const n of t.names) {
      appearances.set(n, (appearances.get(n) ?? 0) + 1);
    }
  }

  // Bridge — each strain at its weakest world.
  const bridge = rankTiers(
    names.map((name) => ({
      name,
      score: Math.min(...breakdown[name].map((b) => b.score)),
    })),
  );

  return (
    <div className="rounded-[1.75rem] border border-border/70 bg-card p-6 shadow-[0_28px_60px_-42px_rgba(60,45,20,0.45)] sm:p-7">
      <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-brass">
        <Blend className="h-3.5 w-3.5" />
        Blend overview
      </p>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
        Two more lenses on your menu: the winners inside each profile, and the
        bridge picks that carry across every side of your taste.
      </p>

      {/* ── Best from each profile ──────────────────────────────── */}
      <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/70">
        Best from each profile
      </p>
      <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {perWorld.map(({ world, tiers }) => (
          <div
            key={world}
            className="rounded-2xl border border-border/60 bg-background/40 p-4"
          >
            <p className="truncate text-[11px] font-semibold uppercase tracking-[0.14em] text-brass">
              {world}
            </p>
            <div className="mt-1.5 divide-y divide-border/50">
              {tiers.map((t) => (
                <TierRow
                  key={t.rank}
                  tier={t}
                  unit="profile"
                  badge={
                    t.names.length === 1 && (appearances.get(t.names[0]) ?? 0) >= 2
                      ? `Strong in ${appearances.get(t.names[0])} profiles`
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
        <div className="mt-1.5 divide-y divide-brass/15">
          {bridge.map((t) => (
            <TierRow key={t.rank} tier={t} unit="bridge" tierLabel={bridgeTier(t.score)} />
          ))}
        </div>
        <p className="mt-3 border-t border-brass/20 pt-3 text-xs leading-relaxed text-muted-foreground">
          Bridge score is based on a strain&apos;s weakest side. These hold up
          across all your profiles — the most balanced, not necessarily the
          strongest.
        </p>
      </div>
    </div>
  );
}
