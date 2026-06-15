"use client";

import { useState } from "react";
import { formatScore } from "@/lib/utils";
import { labelFor } from "@/lib/vocab";
import type { StrainMatch } from "@/lib/types";

type AuditItem = StrainMatch & { id?: string };

// Serialize the full audit to plain text so the owner can copy it in one tap
// and paste it back for engine tuning. Mirrors what the panel shows, but holds
// nothing back (no top-N slicing) — the copy is the complete read.
function buildAuditText(items: AuditItem[]): string {
  const lines: string[] = [
    `SOMA Audit — ${items.length} strain${items.length === 1 ? "" : "s"}`,
    "",
  ];
  for (const item of items) {
    lines.push(`${item.strainName} — Final ${formatScore(item.matchScore)}`);
    const fb =
      item.feedbackPotential !== 0
        ? `potential ${item.feedbackPotential > 0 ? "+" : ""}${item.feedbackPotential} × decay ${item.feedbackDecay.toFixed(2)} → applied ${item.feedbackAdjustment > 0 ? "+" : ""}${item.feedbackAdjustment}`
        : "no feedback";
    lines.push(`  raw ${formatScore(item.baseScore)} · ${fb}`);
    lines.push(
      `  Top matches: ${
        item.matchStrengths.length > 0
          ? item.matchStrengths
              .map(
                (m) =>
                  `${labelFor(m.token)} +${m.points}${m.trace ? " (trace)" : ""}`,
              )
              .join(", ")
          : "—"
      }`,
    );
    lines.push(
      `  Penalties: ${
        item.penaltyStrengths.length > 0
          ? item.penaltyStrengths
              .map((p) => `${p.label} ${p.points}`)
              .join(", ")
          : "none"
      }`,
    );
    const missing: [string, string[]][] = [
      ["Critical missing", item.missingTags.critical],
      ["Secondary missing", item.missingTags.secondary],
      ["Effect missing", item.missingTags.effect],
    ];
    const anyMissing = missing.some(([, tags]) => tags.length > 0);
    if (anyMissing) {
      for (const [label, tags] of missing) {
        if (tags.length === 0) continue;
        lines.push(`  ${label}: ${tags.map((t) => labelFor(t)).join(", ")}`);
      }
    } else {
      lines.push("  Missing: none");
    }
    lines.push("");
  }
  return lines.join("\n").trimEnd();
}

// Audit Mode — the engine's reasoning per strain, shared by Taste Match and
// Compare. Shows how the score was reached (raw → potential × decay → applied)
// and WHY it ranks where it does (top matches + penalties).
export function AuditPanel({ items }: { items: AuditItem[] }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  if (items.length === 0) return null;

  const sorted = [...items].sort(
    (a, b) => b.matchScore - a.matchScore || b.unclampedScore - a.unclampedScore,
  );

  const handleCopy = async () => {
    const text = buildAuditText(sorted);
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Clipboard API can be blocked (insecure context, denied permission);
      // fall back to a hidden textarea + execCommand so the button still works.
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
      } catch {
        /* give up silently — nothing else we can do */
      }
      document.body.removeChild(ta);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

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
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleCopy}
              className="rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium hover:bg-muted"
            >
              {copied ? "Copied ✓" : "Copy audit"}
            </button>
          </div>
          <p className="text-[11px] leading-relaxed text-muted-foreground/80">
            <span className="font-mono">raw</span> = score before feedback ·{" "}
            <span className="font-mono">potential</span> = feedback at full
            strength · <span className="font-mono">decay</span> =
            diminishing-returns taper (higher raw → less applied) ·{" "}
            <span className="font-mono">applied</span> = what was actually added.
            ✓ = top matches, ⚠ = penalties, ✗ = tags you asked for that this
            strain lacks (critical = aroma, secondary = flavor, effect).{" "}
            <span className="text-accent/60">trace</span> = a faint /
            phenotype-dependent note, counted at partial strength (~).
          </p>
          {sorted.map((item) => {
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
                <div className="mt-1.5 flex flex-wrap gap-x-8 gap-y-2 text-[11px]">
                  <div>
                    <p className="font-medium uppercase tracking-[0.1em] text-muted-foreground">
                      Top matches
                    </p>
                    <div className="mt-1 space-y-0.5">
                      {item.matchStrengths.length > 0 ? (
                        item.matchStrengths.slice(0, 6).map((m) => (
                          <div
                            key={m.token}
                            className={`flex justify-between gap-4 ${m.trace ? "text-accent/60" : "text-accent"}`}
                          >
                            <span>
                              {labelFor(m.token)}
                              {m.trace && (
                                <span className="ml-1 text-[9px] uppercase tracking-wide text-muted-foreground/70">
                                  trace
                                </span>
                              )}
                            </span>
                            <span className="font-mono">
                              {m.trace ? "~" : ""}+{m.points}
                            </span>
                          </div>
                        ))
                      ) : (
                        <span className="text-muted-foreground/60">—</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="font-medium uppercase tracking-[0.1em] text-muted-foreground">
                      Penalties
                    </p>
                    <div className="mt-1 space-y-0.5">
                      {item.penaltyStrengths.length > 0 ? (
                        item.penaltyStrengths.map((p) => (
                          <div key={p.label} className="flex justify-between gap-4 text-[#a23b2c]">
                            <span>{p.label}</span>
                            <span className="font-mono">{p.points}</span>
                          </div>
                        ))
                      ) : (
                        <span className="text-muted-foreground/60">none</span>
                      )}
                    </div>
                  </div>
                  {(() => {
                    const groups: { label: string; tags: string[] }[] = [
                      { label: "Critical missing", tags: item.missingTags.critical },
                      { label: "Secondary missing", tags: item.missingTags.secondary },
                      { label: "Effect missing", tags: item.missingTags.effect },
                    ].filter((g) => g.tags.length > 0);
                    if (groups.length === 0) {
                      return (
                        <div>
                          <p className="font-medium uppercase tracking-[0.1em] text-muted-foreground">
                            Missing
                          </p>
                          <p className="mt-1 text-muted-foreground/60">none</p>
                        </div>
                      );
                    }
                    return groups.map((g) => (
                      <div key={g.label}>
                        <p className="font-medium uppercase tracking-[0.1em] text-muted-foreground">
                          {g.label}
                        </p>
                        <div className="mt-1 space-y-0.5">
                          {g.tags.slice(0, 6).map((t) => (
                            <div key={t} className="text-muted-foreground/70">
                              <span className="mr-1 text-[#a23b2c]/70">✗</span>
                              {labelFor(t)}
                            </div>
                          ))}
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
