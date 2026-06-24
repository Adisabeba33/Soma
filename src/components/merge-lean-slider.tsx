"use client";

import { Layers } from "lucide-react";
import { cn } from "@/lib/utils";

// Lean lever for a single Taste Match run, shown only when two profiles are
// merged. Value is −1 (fully toward the other world) … 0 (balanced best-of) …
// +1 (fully toward your Main). It's a tilt, not a switch: even at full lean the
// other world keeps weight, so its best picks can still surface. Centre is the
// honest default and changes nothing.
export function MergeLeanSlider({
  value,
  onChange,
  mainLabel,
  otherLabel,
  className,
}: {
  value: number;
  onChange: (v: number) => void;
  mainLabel: string;
  otherLabel: string;
  className?: string;
}) {
  const pct = Math.round(value * 100);
  const lean =
    value === 0
      ? "Balanced — best of both worlds"
      : value > 0
        ? value >= 0.66
          ? `Strongly lean ${mainLabel}`
          : `Lean ${mainLabel}, ${otherLabel} still counts`
        : value <= -0.66
          ? `Strongly lean ${otherLabel}`
          : `Lean ${otherLabel}, ${mainLabel} still counts`;

  return (
    <div className={cn("rounded-2xl border border-border bg-card p-5", className)}>
      <div className="flex items-baseline justify-between">
        <p className="flex items-center gap-1.5 font-display text-base font-semibold tracking-tight">
          <Layers className="h-4 w-4 text-accent" /> Lean between profiles
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
        Your profiles are merged. Pull toward one and its picks rise — the other
        still counts, just less. Centre blends both equally.
      </p>

      <input
        type="range"
        min={-100}
        max={100}
        step={20}
        value={pct}
        onChange={(e) => onChange(Number(e.target.value) / 100)}
        aria-label={`Lean between ${otherLabel} and ${mainLabel}`}
        className="mt-4 w-full accent-accent"
      />
      <div className="mt-1 flex justify-between gap-2 text-xs text-muted-foreground">
        <span className="truncate">{otherLabel}</span>
        <span className="shrink-0">Balanced</span>
        <span className="truncate text-right">{mainLabel}</span>
      </div>
      <p className="mt-3 text-sm font-medium text-accent">{lean}</p>
    </div>
  );
}
