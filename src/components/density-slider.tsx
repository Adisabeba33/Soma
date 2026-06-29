"use client";

import { cn } from "@/lib/utils";

// Bipolar dense↔fluffy preference slider for a single Taste Match run.
// Value is −1 (fully fluffy) … 0 (no preference, dead centre) … +1 (fully
// dense). The centre is the honest default: it adds nothing to scoring, so the
// control is purely opt-in. Distance from centre = how hard the engine leans.
export function DensitySlider({
  value,
  onChange,
  className,
}: {
  value: number;
  onChange: (v: number) => void;
  className?: string;
}) {
  const pct = Math.round(value * 100);
  const lean =
    value === 0
      ? "No preference — either is fine"
      : value > 0
        ? value >= 0.66
          ? "Strongly prefer dense"
          : "Lean dense, open to fluffy"
        : value <= -0.66
          ? "Strongly prefer fluffy"
          : "Lean fluffy, open to dense";

  return (
    <div className={cn("rounded-2xl border border-border bg-card p-5", className)}>
      <div className="flex items-baseline justify-between">
        <p className="font-display text-base font-semibold tracking-tight">
          Bud structure
        </p>
        <button
          type="button"
          onClick={() => onChange(0)}
          className={cn(
            "text-xs text-muted-foreground hover:text-foreground",
            value === 0 && "invisible",
          )}
        >
          Reset
        </button>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        How much do you care about density this time? Centre means it
        doesn&apos;t matter.
      </p>

      <input
        type="range"
        min={-100}
        max={100}
        step={5}
        value={pct}
        onChange={(e) => onChange(Number(e.target.value) / 100)}
        aria-label="Bud structure preference, fluffy to dense"
        className="mt-4 w-full accent-brass"
      />
      <div className="mt-1 flex justify-between text-xs text-muted-foreground">
        <span>Fluffy / airy</span>
        <span>No preference</span>
        <span>Dense</span>
      </div>
      <p className="mt-3 text-sm font-medium text-accent">{lean}</p>
    </div>
  );
}
