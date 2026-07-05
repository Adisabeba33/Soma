"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Blend, Check } from "lucide-react";
import { cn } from "@/lib/utils";

// Taste Blender — the virtual "4th profile" that mixes all three real profiles.
// Lives in the account, below the profiles. Inactive until there are 3 profiles
// with 2 merged into a pair and 1 left as the third. Two sliders set the
// recipe; the toggle makes the blend drive every surface (Harvest, Collection,
// Taste Match, dashboard).

type State = {
  active: boolean;
  ready: boolean;
  balance: boolean;
  lean1: number;
  lean2: number;
  profileCount: number;
  pairCount: number;
  pair: Array<{ id: string; name: string; primary: boolean }>;
  third: { id: string; name: string } | null;
};

export function TasteBlenderBlock() {
  const router = useRouter();
  const [s, setS] = useState<State | null>(null);

  async function load() {
    const d = await fetch("/api/blender")
      .then((r) => r.json())
      .catch(() => null);
    if (d) setS(d);
  }
  useEffect(() => {
    load();
  }, []);

  async function patch(body: Record<string, unknown>) {
    // Optimistic for the sliders so dragging feels instant.
    setS((prev) => (prev ? { ...prev, ...body } : prev));
    const d = await fetch("/api/blender", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then((r) => r.json())
      .catch(() => null);
    if (d?.error) {
      await load();
      return;
    }
    if (d) setS(d);
    router.refresh(); // re-score the surfaces under the new blend
  }

  if (!s) return null;

  // The pair is ordered [primary-or-first, other]. Primary is the lean's "Main".
  const main = s.pair.find((p) => p.primary) ?? s.pair[0];
  const other = s.pair.find((p) => p.id !== main?.id) ?? s.pair[1];

  return (
    <div className="mt-10">
      <p className="flex items-center gap-1.5 text-xs uppercase tracking-[0.24em] text-brass">
        <Blend className="h-3.5 w-3.5" /> Taste Blender
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        One mix of all three profiles — a merged pair, plus a third blended in.
        When on, it drives every match: Harvest, Collection, Taste Match.
      </p>

      {!s.ready ? (
        <div className="mt-3 rounded-2xl border border-dashed border-border bg-muted/30 px-5 py-6 text-sm text-muted-foreground">
          {s.profileCount < 3 ? (
            <>
              Add a <strong className="text-foreground">third profile</strong>{" "}
              to unlock the Blender. You have {s.profileCount} of 3.
            </>
          ) : (
            <>
              Almost there — <strong className="text-foreground">merge two</strong>{" "}
              profiles into a base pair (the Merge button above), and leave the
              third unmerged. Then blend it in here.
            </>
          )}
        </div>
      ) : (
        <div
          className={cn(
            "mt-3 rounded-2xl border bg-card p-5 transition-colors",
            s.active ? "border-accent/50 ring-1 ring-accent/30" : "border-border",
          )}
        >
          {/* On/off */}
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="font-display text-base font-semibold tracking-tight">
                {main?.name} + {other?.name}{" "}
                <span className="text-muted-foreground">blended with</span>{" "}
                {s.third?.name}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {s.active
                  ? "On — this mix is driving all your matches."
                  : "Off — your active profile drives matches."}
              </p>
            </div>
            <button
              type="button"
              onClick={() => patch({ active: !s.active })}
              aria-pressed={s.active}
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-medium transition-colors",
                s.active
                  ? "border-accent bg-accent text-accent-foreground"
                  : "border-border text-foreground hover:border-accent/60",
              )}
            >
              {s.active && <Check className="h-4 w-4" />}
              {s.active ? "Using Blender" : "Use Blender"}
            </button>
          </div>

          {/* Run straight from the blend — so it's unmistakable the run came
              from this mix, not the lone active profile. Only when the Blender
              is on (off → the active profile drives Taste Match anyway). */}
          {s.active && (
            <Link
              href="/taste-match"
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
            >
              Run Taste Match with this blend
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}

          {/* Mode — best-of (discovery) vs balance (bridge across all sides) */}
          <div className="mt-5 border-t border-border/60 pt-4">
            <p className="text-sm font-medium">Mode</p>
            <div className="mt-2 inline-flex overflow-hidden rounded-xl border border-border text-sm">
              <button
                type="button"
                onClick={() => patch({ balance: false })}
                className={cn(
                  "px-3 py-1.5 transition-colors",
                  !s.balance
                    ? "bg-accent/10 font-medium text-accent"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                Best of each
              </button>
              <button
                type="button"
                onClick={() => patch({ balance: true })}
                className={cn(
                  "border-l border-border px-3 py-1.5 transition-colors",
                  s.balance
                    ? "bg-accent/10 font-medium text-accent"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                Balance (bridge)
              </button>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              {s.balance
                ? "Shows strains that work across ALL your blended profiles. A strain is only as good as its weakest side. Single-profile winners score lower here — leans don't apply."
                : "Shows strains that are excellent for at least one of your blended profiles. Widest coverage; leans tilt the mix."}
            </p>
            {s.balance && (
              <p className="mt-2 rounded-lg bg-brass/10 px-3 py-2 text-xs leading-relaxed text-foreground">
                <span className="font-medium">Bridge is stricter.</span> Scores
                look lower because each strain must hold up across several
                profiles at once — that&apos;s expected, not a worse menu.
              </p>
            )}
          </div>

          {/* Leans apply in best-of only; balance weighs every side equally. */}
          {s.balance ? null : (
          <>
          {/* Slider 1 — lean inside the pair */}
          <div className="mt-4 border-t border-border/60 pt-4">
            <div className="flex items-baseline justify-between">
              <p className="text-sm font-medium">Lean within the pair</p>
              <button
                type="button"
                onClick={() => patch({ lean1: 0 })}
                className={cn(
                  "text-xs text-muted-foreground hover:text-foreground",
                  s.lean1 === 0 && "invisible",
                )}
              >
                Reset
              </button>
            </div>
            <input
              type="range"
              min={-100}
              max={100}
              step={20}
              value={Math.round(s.lean1 * 100)}
              onChange={(e) => patch({ lean1: Number(e.target.value) / 100 })}
              aria-label={`Lean between ${other?.name} and ${main?.name}`}
              className="mt-3 w-full accent-accent"
            />
            <div className="mt-1 flex justify-between gap-2 text-xs text-muted-foreground">
              <span className="truncate">{other?.name}</span>
              <span className="shrink-0">Balanced</span>
              <span className="truncate text-right">{main?.name}</span>
            </div>
          </div>

          {/* Slider 2 — how much of the third profile to blend in */}
          <div className="mt-4 border-t border-border/60 pt-4">
            <div className="flex items-baseline justify-between">
              <p className="text-sm font-medium">
                Blend in <span className="text-accent">{s.third?.name}</span>
              </p>
              <span className="text-xs text-muted-foreground">
                {Math.round(s.lean2 * 100)}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={10}
              value={Math.round(s.lean2 * 100)}
              onChange={(e) => patch({ lean2: Number(e.target.value) / 100 })}
              aria-label={`How much of ${s.third?.name} to blend in`}
              className="mt-3 w-full accent-accent"
            />
            <div className="mt-1 flex justify-between text-xs text-muted-foreground">
              <span>A touch</span>
              <span>Full third</span>
            </div>
          </div>
          </>
          )}
        </div>
      )}
    </div>
  );
}
