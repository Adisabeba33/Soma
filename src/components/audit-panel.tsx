"use client";

import { useState } from "react";
import { formatScore } from "@/lib/utils";
import { labelFor } from "@/lib/vocab";
import type { StrainMatch } from "@/lib/types";

type AuditItem = StrainMatch & { id?: string };

// Audit Mode — the engine's reasoning per strain, shared by Taste Match and
// Compare. Shows how the score was reached (raw → potential × decay → applied)
// and WHY it ranks where it does (top matches + penalties).
export function AuditPanel({ items }: { items: AuditItem[] }) {
  const [open, setOpen] = useState(false);
  if (items.length === 0) return null;

  const sorted = [...items].sort(
    (a, b) => b.matchScore - a.matchScore || b.unclampedScore - a.unclampedScore,
  );

  return (
    <div className="rounded-xl border border-border bg-muted/40">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm font-medium"
      >
        <span>Audit — why each strain ranked here</span>
        <span className="text-xs text-muted-foreground">
          {open ? "Hide ▲" : "Show ▼"}
        </span>
      </button>
      {open && (
        <div className="space-y-3 border-t border-border px-4 py-3">
          <p className="text-[11px] leading-relaxed text-muted-foreground/80">
            <span className="font-mono">raw</span> = score before feedback ·{" "}
            <span className="font-mono">potential</span> = feedback at full
            strength · <span className="font-mono">decay</span> =
            diminishing-returns taper (higher raw → less applied) ·{" "}
            <span className="font-mono">applied</span> = what was actually added.
            ✓ = top matches, ⚠ = penalties.
          </p>
          {sorted.map((item) => {
            const matched = [
              ...item.matchedEffects,
              ...item.matchedAromas,
              ...item.matchedFlavors,
            ]
              .filter((v, i, a) => a.indexOf(v) === i)
              .map((v) => labelFor(v));
            const penalties = item.conflicts.map((c) => c.split(",")[0]);
            return (
              <div
                key={item.id ?? item.strainName}
                className="border-t border-border/60 pt-2 first:border-0 first:pt-0"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-sm font-medium">{item.strainName}</span>
                  <span className="font-mono text-xs">
                    Final {formatScore(item.matchScore)}
                  </span>
                </div>
                <div className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                  raw {formatScore(item.baseScore)}
                  {item.feedbackPotential !== 0 ? (
                    <>
                      {" · potential "}
                      {item.feedbackPotential > 0 ? "+" : ""}
                      {item.feedbackPotential}
                      {" × decay "}
                      {item.feedbackDecay.toFixed(2)}
                      {" → applied "}
                      {item.feedbackAdjustment > 0 ? "+" : ""}
                      {item.feedbackAdjustment}
                    </>
                  ) : (
                    " · no feedback"
                  )}
                </div>
                <div className="mt-1 flex flex-wrap gap-x-3 text-[11px]">
                  {matched.length > 0 && (
                    <span className="text-accent">✓ {matched.join(", ")}</span>
                  )}
                  {penalties.length > 0 ? (
                    <span className="text-[#a23b2c]">
                      ⚠ {penalties.join(", ")}
                    </span>
                  ) : (
                    <span className="text-muted-foreground/60">⚠ none</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
