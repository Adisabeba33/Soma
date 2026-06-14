"use client";

import { useEffect, useState } from "react";
import { Eraser } from "lucide-react";

// A small "you've rated N strains · clear all" control. Self-contained: it
// reads its own count on mount and renders nothing until the user actually
// has verdicts, so it never clutters a clean account. Clearing wipes every
// strain verdict for this visitor and reloads so match scores recompute
// without the feedback nudge.
export function FeedbackReset() {
  const [count, setCount] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/strain-feedback")
      .then((r) => r.json())
      .then((d: { verdicts?: unknown[] } | null) => {
        if (!cancelled) setCount(d?.verdicts?.length ?? 0);
      })
      .catch(() => {
        if (!cancelled) setCount(0);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!count) return null;

  async function clearAll() {
    if (busy) return;
    if (
      !window.confirm(
        `Clear your feedback on all ${count} strain${count === 1 ? "" : "s"}? This can't be undone.`,
      )
    ) {
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/strain-feedback", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ all: true }),
      });
      if (!res.ok) throw new Error();
      setCount(0);
      window.location.reload();
    } catch {
      setBusy(false);
    }
  }

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
      <span>
        You&apos;ve rated {count} strain{count === 1 ? "" : "s"}.
      </span>
      <button
        type="button"
        onClick={clearAll}
        disabled={busy}
        className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1 text-xs hover:border-[#a23b2c]/40 hover:text-[#a23b2c] disabled:opacity-60"
      >
        <Eraser className="h-3.5 w-3.5" />
        {busy ? "Clearing…" : "Clear all feedback"}
      </button>
    </div>
  );
}
