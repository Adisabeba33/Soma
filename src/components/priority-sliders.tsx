"use client";

import { cn } from "@/lib/utils";

// Two per-run priority sliders: how much the smell+taste axis and the effect
// axis should matter for THIS Taste Match. Each is −1 (matters less) … 0
// (normal) … +1 (matters most). Centre is the honest default — it changes
// nothing, so the whole control is opt-in. Smell and taste move together
// because, for cannabis, the nose ≈ the palate (same terpenes).
export function PrioritySliders({
  senses,
  effect,
  onSenses,
  onEffect,
  className,
}: {
  senses: number;
  effect: number;
  onSenses: (v: number) => void;
  onEffect: (v: number) => void;
  className?: string;
}) {
  const touched = senses !== 0 || effect !== 0;
  return (
    <div className={cn("rounded-2xl border border-border bg-card p-5", className)}>
      <div className="flex items-baseline justify-between">
        <p className="font-display text-base font-semibold tracking-tight">
          What matters most this time?
        </p>
        <button
          type="button"
          onClick={() => {
            onSenses(0);
            onEffect(0);
          }}
          className={cn(
            "text-xs text-muted-foreground hover:text-foreground",
            !touched && "invisible",
          )}
        >
          Reset
        </button>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        What you care about most this time — your priorities, not a way to
        search. Centre means no preference.
      </p>

      <Row label="Smell &amp; taste" value={senses} onChange={onSenses} />
      <Row label="Effect" value={effect} onChange={onEffect} />
    </div>
  );
}

function Row({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  const tag =
    value === 0
      ? "Normal"
      : value > 0
        ? value >= 0.66
          ? "Top priority"
          : "More"
        : value <= -0.66
          ? "Barely"
          : "Less";
  return (
    <div className="mt-4">
      <div className="flex items-baseline justify-between">
        <span
          className="text-sm font-medium"
          dangerouslySetInnerHTML={{ __html: label }}
        />
        <span className="text-xs font-medium text-accent">{tag}</span>
      </div>
      <input
        type="range"
        min={-100}
        max={100}
        step={5}
        value={Math.round(value * 100)}
        onChange={(e) => onChange(Number(e.target.value) / 100)}
        aria-label={`${label.replace("&amp;", "and")} priority`}
        className="mt-1.5 w-full accent-brass"
      />
      <div className="mt-1 flex justify-between text-xs text-muted-foreground">
        <span>Less</span>
        <span>Normal</span>
        <span>More</span>
      </div>
    </div>
  );
}
