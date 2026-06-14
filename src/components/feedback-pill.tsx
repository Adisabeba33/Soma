"use client";

import { useState } from "react";
import { Heart, Smile, Meh, ThumbsDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type Verdict = "loved" | "good" | "neutral" | "avoid";

const OPTIONS: Array<{
  value: Verdict;
  label: string;
  Icon: typeof Heart;
  // Active-state tone — each verdict has its own colour so the chosen
  // option is unambiguous at a glance.
  activeClass: string;
}> = [
  {
    value: "loved",
    label: "Loved",
    Icon: Heart,
    activeClass: "border-accent bg-accent text-accent-foreground",
  },
  {
    value: "good",
    label: "Good",
    Icon: Smile,
    activeClass: "border-accent/60 bg-accent/15 text-accent",
  },
  {
    value: "neutral",
    label: "Neutral",
    Icon: Meh,
    activeClass: "border-border bg-muted text-foreground",
  },
  {
    value: "avoid",
    label: "Avoid",
    Icon: ThumbsDown,
    activeClass: "border-[#a23b2c]/40 bg-[#a23b2c]/10 text-[#a23b2c]",
  },
];

export function FeedbackPill({
  strainName,
  initial,
  source = "compare",
  className,
}: {
  strainName: string;
  initial: Verdict | null;
  source?: "compare" | "taste-match" | "catalog";
  className?: string;
}) {
  const [verdict, setVerdict] = useState<Verdict | null>(initial);
  const [pending, setPending] = useState<Verdict | null>(null);
  const [error, setError] = useState(false);

  async function submit(next: Verdict) {
    // Tapping the active verdict again clears it (toggle-off) — so a
    // verdict left by accident, or a mind changed, can be undone with the
    // same button instead of being stuck until overwritten.
    const clearing = next === verdict;
    setPending(next);
    setError(false);
    try {
      const res = await fetch("/api/strain-feedback", {
        method: clearing ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          clearing ? { strainName } : { strainName, verdict: next, source },
        ),
      });
      if (!res.ok) throw new Error();
      setVerdict(clearing ? null : next);
    } catch {
      setError(true);
    } finally {
      setPending(null);
    }
  }

  return (
    <div className={cn("space-y-1.5", className)}>
      <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
        Did you try it?
        {verdict && (
          <span className="ml-2 normal-case tracking-normal text-muted-foreground/70">
            · tap again to clear
          </span>
        )}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {OPTIONS.map((opt) => {
          const active = verdict === opt.value;
          const isPending = pending === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              disabled={pending !== null}
              onClick={() => submit(opt.value)}
              aria-pressed={active}
              className={cn(
                "inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[11px] transition-colors",
                active
                  ? opt.activeClass
                  : "border-border bg-card text-muted-foreground hover:border-accent/40 hover:text-foreground",
                pending !== null && !isPending && "opacity-50",
                isPending && "opacity-80",
              )}
            >
              <opt.Icon className="h-3 w-3" aria-hidden />
              {opt.label}
            </button>
          );
        })}
      </div>
      {error && (
        <p className="text-[10px] text-[#a23b2c]">
          Couldn&apos;t save — try again in a moment.
        </p>
      )}
    </div>
  );
}
