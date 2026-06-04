"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { FeedbackData } from "@/lib/types";

function YesNo({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean | null;
  onChange: (v: boolean | null) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      {[
        { v: true, t: "Yes" },
        { v: false, t: "No" },
      ].map((opt) => (
        <button
          key={opt.t}
          type="button"
          onClick={() => onChange(value === opt.v ? null : opt.v)}
          className={cn(
            "rounded-lg border px-2.5 py-1 text-xs transition-colors",
            value === opt.v
              ? "border-accent bg-accent text-accent-foreground"
              : "border-border text-muted-foreground hover:text-foreground",
          )}
        >
          {opt.t}
        </button>
      ))}
    </div>
  );
}

export function FeedbackControl({
  recommendationId,
  initial,
}: {
  recommendationId: string;
  initial: FeedbackData | null;
}) {
  const [purchased, setPurchased] = useState<boolean | null>(
    initial?.purchased ?? null,
  );
  const [liked, setLiked] = useState<boolean | null>(initial?.liked ?? null);
  const [rating, setRating] = useState<number | null>(initial?.rating ?? null);
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle",
  );

  async function save() {
    setStatus("saving");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recommendationId,
          purchased,
          liked,
          rating,
          notes,
        }),
      });
      setStatus(res.ok ? "saved" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="space-y-3">
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
        After you tried it
      </p>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        <YesNo label="Bought it?" value={purchased} onChange={setPurchased} />
        <YesNo label="Liked it?" value={liked} onChange={setLiked} />
        <div className="flex items-center gap-1.5">
          <span className="text-sm text-muted-foreground">Rating</span>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              aria-label={`${n} star${n === 1 ? "" : "s"}`}
              onClick={() => setRating(rating === n ? null : n)}
            >
              <Star
                className={cn(
                  "h-4 w-4 transition-colors",
                  rating && n <= rating
                    ? "fill-brass text-brass"
                    : "text-border",
                )}
              />
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Tasting notes — how did it actually land?"
          className="h-10"
        />
        <Button size="sm" onClick={save} disabled={status === "saving"}>
          {status === "saving"
            ? "Saving…"
            : status === "saved"
              ? "Saved"
              : "Save feedback"}
        </Button>
      </div>
      {status === "error" && (
        <p className="text-xs text-[#a23b2c]">
          Couldn&apos;t save that — try again.
        </p>
      )}
    </div>
  );
}
