"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Heart, Smile, Meh, ThumbsDown, X } from "lucide-react";
import { strainSlug } from "@/lib/catalog";
import { cn } from "@/lib/utils";

type Verdict = "loved" | "good" | "neutral" | "avoid";

type Row = { strainName: string; verdict: Verdict; updatedAt: string };

// Display order + tone for each group, top (most positive) to bottom.
const GROUPS: Array<{
  value: Verdict;
  label: string;
  Icon: typeof Heart;
  tone: string;
  blurb: string;
}> = [
  {
    value: "loved",
    label: "Loved",
    Icon: Heart,
    tone: "text-accent",
    blurb: "Your strongest yes — pulls recommendations toward strains like these.",
  },
  {
    value: "good",
    label: "Good",
    Icon: Smile,
    tone: "text-accent/80",
    blurb: "A softer yes — “I’d try it again”. Nudges, doesn’t redefine your taste.",
  },
  {
    value: "neutral",
    label: "Neutral",
    Icon: Meh,
    tone: "text-muted-foreground",
    blurb: "Tried it, no strong feeling. Kept for your record; it doesn’t move scoring.",
  },
  {
    value: "avoid",
    label: "Avoid",
    Icon: ThumbsDown,
    tone: "text-[#a23b2c]",
    blurb: "A no — pushes similar strains down in your matches.",
  },
];

export default function FeedbackHistoryPage() {
  const [rows, setRows] = useState<Row[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/strain-feedback")
      .then((r) => r.json())
      .then((d: { verdicts?: Row[] } | null) => {
        if (!cancelled) setRows(d?.verdicts ?? []);
      })
      .catch(() => {
        if (!cancelled) setRows([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function remove(strainName: string) {
    // Optimistic: drop it locally, then clear server-side.
    setRows((prev) => prev?.filter((r) => r.strainName !== strainName) ?? prev);
    await fetch("/api/strain-feedback", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ strainName }),
    }).catch(() => {});
  }

  const total = rows?.length ?? 0;

  return (
    <div className="mx-auto max-w-2xl px-5 py-16 sm:px-8">
      <Link
        href="/profile"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to profile
      </Link>

      <p className="mt-5 text-xs uppercase tracking-[0.24em] text-brass">
        Your tastings
      </p>
      <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight">
        Strains you&apos;ve rated
      </h1>
      <p className="mt-3 leading-relaxed text-muted-foreground">
        Everything you marked across the catalog, Compare and Taste Match, grouped
        by your verdict. <em>Loved</em>, <em>good</em> and <em>avoid</em> shape your
        recommendations; <em>neutral</em> is just for your record. Tap a strain to
        revisit it, or remove a verdict here.
      </p>

      {rows === null && (
        <p className="mt-10 text-sm text-muted-foreground">Loading…</p>
      )}

      {rows !== null && total === 0 && (
        <div className="mt-10 rounded-2xl border border-border bg-muted/40 px-5 py-8 text-center">
          <p className="text-sm text-muted-foreground">
            You haven&apos;t rated any strains yet.
          </p>
          <Link
            href="/catalog"
            className="mt-3 inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90"
          >
            Browse the catalog
          </Link>
        </div>
      )}

      {rows !== null && total > 0 && (
        <div className="mt-10 space-y-8">
          {GROUPS.map((g) => {
            const items = rows
              .filter((r) => r.verdict === g.value)
              .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
            if (items.length === 0) return null;
            return (
              <section key={g.value}>
                <div className="flex items-baseline gap-2">
                  <g.Icon className={cn("h-4 w-4", g.tone)} aria-hidden />
                  <h2 className={cn("font-display text-xl font-semibold", g.tone)}>
                    {g.label}
                  </h2>
                  <span className="text-sm text-muted-foreground">
                    {items.length}
                  </span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {g.blurb}
                </p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {items.map((item) => (
                    <li
                      key={item.strainName}
                      className="group inline-flex items-center gap-1.5 rounded-full border border-border bg-card py-1 pl-3 pr-1.5 text-sm"
                    >
                      <Link
                        href={`/catalog/${strainSlug(item.strainName)}`}
                        className="hover:text-accent"
                      >
                        {item.strainName}
                      </Link>
                      <button
                        type="button"
                        aria-label={`Remove verdict on ${item.strainName}`}
                        onClick={() => remove(item.strainName)}
                        className="rounded-full p-0.5 text-muted-foreground/60 hover:bg-muted hover:text-[#a23b2c]"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
