"use client";

import { ArrowRight, PenLine } from "lucide-react";
import { cn } from "@/lib/utils";
import { labelFor } from "@/lib/vocab";
import { PRESETS, type Preset } from "@/lib/profile-presets";

// Quick-start: pick one of eight taste archetypes (instant profile) or build
// your own with the full questionnaire. The pressets clear the match gate, so
// a picker tap takes a new user straight to matching.
export function PresetPicker({
  onPick,
  onCustom,
  busyId,
}: {
  onPick: (preset: Preset) => void;
  onCustom: () => void;
  busyId?: string | null;
}) {
  return (
    <div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {PRESETS.map((p) => {
          const busy = busyId === p.id;
          return (
            <button
              key={p.id}
              type="button"
              disabled={Boolean(busyId)}
              onClick={() => onPick(p)}
              className={cn(
                "soma-lift group flex flex-col rounded-[1.5rem] border border-border/70 bg-card p-5 text-left shadow-[0_24px_50px_-44px_rgba(60,45,20,0.45)] transition-all hover:border-brass/40 hover:shadow-[0_30px_60px_-42px_rgba(60,45,20,0.55)] disabled:opacity-60",
                busy && "border-brass/50 ring-1 ring-brass/30",
              )}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{p.emoji}</span>
                <span className="font-display text-lg font-semibold tracking-tight">
                  {p.name}
                </span>
                <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-brass" />
              </div>
              <p className="mt-1.5 text-sm text-muted-foreground">{p.tagline}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {p.aromaChips.map((a) => (
                  <span
                    key={a}
                    className="rounded-full bg-brass/10 px-2.5 py-0.5 text-xs font-medium text-brass"
                  >
                    {labelFor(a)}
                  </span>
                ))}
                {p.effectChips.map((e) => (
                  <span
                    key={e}
                    className="rounded-full px-2.5 py-0.5 text-xs text-muted-foreground ring-1 ring-border"
                  >
                    {labelFor(e)}
                  </span>
                ))}
              </div>
              {busy && (
                <span className="mt-3 text-xs font-medium text-brass">
                  Setting up…
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Custom — the full questionnaire */}
      <button
        type="button"
        onClick={onCustom}
        disabled={Boolean(busyId)}
        className="soma-ease mt-3 flex w-full items-center gap-3 rounded-[1.5rem] border border-dashed border-border bg-card/40 p-5 text-left transition-colors hover:border-brass/50 disabled:opacity-60"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brass/10 text-brass">
          <PenLine className="h-5 w-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="font-display text-base font-semibold tracking-tight">
            Build my own
          </span>
          <span className="mt-0.5 block text-sm text-muted-foreground">
            Answer the full sensory questionnaire for the most precise read.
          </span>
        </span>
        <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
      </button>
    </div>
  );
}
