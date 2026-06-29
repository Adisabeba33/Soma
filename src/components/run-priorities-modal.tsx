"use client";

import { X } from "lucide-react";
import { PrioritySliders } from "@/components/priority-sliders";
import { DensitySlider } from "@/components/density-slider";
import { MergeLeanSlider } from "@/components/merge-lean-slider";
import { buttonClass } from "@/components/ui/button";

// A one-step popup shown after the user hits "Run Taste Match": before the
// analysis runs, ask what they want to prioritise for THIS match. Everything is
// optional — leaving the sliders centred is a valid "no preference" choice and
// Continue runs the match either way.
export function RunPrioritiesModal({
  open,
  onClose,
  onContinue,
  senses,
  effect,
  density,
  onSenses,
  onEffect,
  onDensity,
  // Merge lean — present only when exactly two profiles are merged.
  merge,
}: {
  open: boolean;
  onClose: () => void;
  onContinue: () => void;
  senses: number;
  effect: number;
  density: number;
  onSenses: (v: number) => void;
  onEffect: (v: number) => void;
  onDensity: (v: number) => void;
  merge?: {
    bias: number;
    onBias: (v: number) => void;
    mainLabel: string;
    otherLabel: string;
  };
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label="Set your priorities for this match"
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative z-10 max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-border bg-background p-5 shadow-xl sm:rounded-3xl sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-brass">
              One quick step
            </p>
            <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight">
              Before we match
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mr-1 -mt-1 shrink-0 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-card"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          These are <span className="font-medium text-foreground">your
          priorities</span> for this match — what matters most to{" "}
          <span className="font-medium text-foreground">you</span> right now, not
          a way to search. Set whatever you like, or just leave everything in the
          centre. Centre means{" "}
          <span className="font-medium text-foreground">
            neutral — no preference either way
          </span>
          , and that's a perfectly good choice. Then hit Continue.
        </p>

        <div className="mt-5 space-y-4">
          <PrioritySliders
            senses={senses}
            effect={effect}
            onSenses={onSenses}
            onEffect={onEffect}
          />
          <DensitySlider value={density} onChange={onDensity} />
          {merge && (
            <MergeLeanSlider
              value={merge.bias}
              onChange={merge.onBias}
              mainLabel={merge.mainLabel}
              otherLabel={merge.otherLabel}
            />
          )}
        </div>

        <button
          type="button"
          onClick={onContinue}
          className={buttonClass("primary", "md", "mt-6 w-full")}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
