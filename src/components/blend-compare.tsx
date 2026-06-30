"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { StrainMatch } from "@/lib/types";

type Rec = StrainMatch & { id?: string };
type WorldScore = { world: string; score: number };
type Breakdown = Record<string, WorldScore[]>;

// Strain-vs-strain head to head, broken down BY each blended profile (world)
// and by sense — so a user weighing, say, 5th vs 7th place can see exactly how
// each one lands across their three profiles, not just one overall number.
// All from data already on the results screen (per-world breakdown + the
// recommendation's aroma / flavor / effect sub-scores) — no server round-trip.
export function BlendCompare({
  recs,
  worlds,
  breakdown,
  onClose,
}: {
  recs: Rec[];
  worlds: string[];
  breakdown: Breakdown;
  onClose: () => void;
}) {
  const n = recs.length;
  const cols = `minmax(5.5rem,1.1fr) repeat(${n}, minmax(0,1fr))`;

  const worldScore = (name: string, world: string) =>
    Math.round(breakdown[name]?.find((b) => b.world === world)?.score ?? 0);

  // Highlight the leader in a row (ties → none highlighted).
  const leaders = (vals: number[]) => {
    const max = Math.max(...vals);
    const count = vals.filter((v) => v === max).length;
    return vals.map((v) => v === max && count === 1);
  };

  const Cell = ({ value, lead }: { value: number; lead: boolean }) => (
    <div
      className={cn(
        "rounded-lg py-1.5 text-center font-display text-base font-semibold tabular-nums",
        lead ? "bg-brass/15 text-brass" : "text-foreground/70",
      )}
    >
      {value}%
    </div>
  );

  const Section = ({
    title,
    rows,
  }: {
    title: string;
    rows: { label: string; vals: number[] }[];
  }) => (
    <div className="mt-5">
      <p className="text-[11px] uppercase tracking-[0.18em] text-brass">{title}</p>
      <div className="mt-2 space-y-1.5">
        {rows.map((row) => {
          const lead = leaders(row.vals);
          return (
            <div key={row.label} className="grid items-center gap-2" style={{ gridTemplateColumns: cols }}>
              <span className="truncate text-sm text-muted-foreground">{row.label}</span>
              {row.vals.map((v, i) => (
                <Cell key={i} value={v} lead={lead[i]} />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <div
        className="max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-t-[1.75rem] border border-border/70 bg-card p-6 shadow-2xl sm:rounded-[1.75rem] sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-brass">
              Head to head
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              How each lands across your blended profiles.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="soma-ease grid h-9 w-9 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Column headers — strain names + overall blend score */}
        <div className="mt-5 grid items-end gap-2" style={{ gridTemplateColumns: cols }}>
          <span />
          {recs.map((r) => (
            <div key={r.id ?? r.strainName} className="text-center">
              <p className="truncate font-display text-sm font-semibold leading-tight tracking-tight">
                {r.strainName}
              </p>
              <p className="mt-0.5 font-display text-lg font-semibold text-brass">
                {Math.round(r.matchScore)}%
              </p>
              <p className="text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
                blend
              </p>
            </div>
          ))}
        </div>

        {/* "By profile" only makes sense for a blended run with 2+ worlds —
            single-profile runs skip it cleanly. */}
        {worlds.length > 0 && (
          <Section
            title="By profile"
            rows={worlds.map((w) => ({
              label: w,
              vals: recs.map((r) => worldScore(r.strainName, w)),
            }))}
          />
        )}

        <Section
          title="By sense"
          rows={[
            { label: "Aroma", vals: recs.map((r) => Math.round(r.aromaMatch)) },
            { label: "Flavor", vals: recs.map((r) => Math.round(r.flavorMatch)) },
            { label: "Effect", vals: recs.map((r) => Math.round(r.effectMatch)) },
          ]}
        />

        <p className="mt-6 rounded-xl bg-muted/40 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
          Brass marks the stronger of the two in each row.{" "}
          {worlds.length > 0 && (
            <>
              &ldquo;By profile&rdquo; is the total match for each side of your
              taste;{" "}
            </>
          )}
          &ldquo;by sense&rdquo; is how close the aroma, flavour and effect sit
          to what you entered.
        </p>
      </div>
    </div>
  );
}
