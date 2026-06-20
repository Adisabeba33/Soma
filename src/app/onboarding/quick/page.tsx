"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TagInput } from "@/components/ui/selectors";
import { cn } from "@/lib/utils";
import { SMOKING_METHODS, USE_TIMES } from "@/lib/profile-target";
import { STRAIN_NAMES } from "@/lib/strain-data";
import {
  EMPTY_PROFILE,
  type TasteProfileState,
} from "@/lib/profile-state";
import { profileCompleteness } from "@/lib/profile-completeness";
import { ProfileProgressRing } from "@/components/profile-progress";
import type { TasteProfileInput } from "@/lib/types";

// Onboarding — screen 1. Three quick taps/inputs that map straight onto the
// profile (no parsing): a strain you love, how you smoke, when you smoke. This
// is intentionally short; the rest of the profile is filled later for a sharper
// match (the completeness ring shows how far along you are).

// Friendlier, shorter labels than the full questionnaire copy.
const TIME_LABELS: Record<string, string> = {
  morning: "Morning",
  daytime: "Day",
  evening: "Evening",
  bed: "Late night",
};

export default function QuickOnboardingPage() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [method, setMethod] = useState("");
  const [time, setTime] = useState("");
  const [review, setReview] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const draft: TasteProfileState = {
    ...EMPTY_PROFILE,
    favoriteStrains: favorites,
    smokingMethod: method,
    useTime: time,
  };
  const percent = profileCompleteness(draft as TasteProfileInput).percent;
  // Time is the one answer that meaningfully shapes the match; nudge for it.
  const canContinue = time !== "";

  async function save(goToProfile: boolean) {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      if (!res.ok) throw new Error();
      router.push(goToProfile ? "/profile" : "/taste-match");
    } catch {
      setError("Couldn't save that. Try again.");
      setSubmitting(false);
    }
  }

  // ── Review / read-back ─────────────────────────────────────────────
  if (review) {
    return (
      <div className="mx-auto max-w-editorial px-5 py-16 sm:px-8">
        <p className="text-xs uppercase tracking-[0.24em] text-brass">Guide Me</p>
        <div className="mt-4 flex items-start gap-5">
          <ProfileProgressRing percent={percent} size={76} className="mt-1" />
          <div>
            <h1 className="font-display text-4xl font-semibold tracking-tight">
              Good start — that&apos;s {percent}%.
            </h1>
            <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
              Enough to start matching. Fill in the rest of your taste profile
              and the match gets sharper — fewer ties, more confident picks.
            </p>
          </div>
        </div>

        <dl className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3">
          <ReadItem
            label="Loves"
            values={favorites.length ? favorites : ["—"]}
            tone="accent"
          />
          <ReadItem
            label="Smokes with"
            values={[
              method
                ? SMOKING_METHODS.find((m) => m.value === method)?.label ?? "—"
                : "—",
            ]}
          />
          <ReadItem
            label="Best time"
            values={[time ? TIME_LABELS[time] : "Anytime"]}
          />
        </dl>

        {error && (
          <p className="mt-4 rounded-xl bg-[#a23b2c]/10 px-4 py-3 text-sm text-[#a23b2c]">
            {error}
          </p>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-border pt-6">
          <Button onClick={() => save(true)} disabled={submitting} size="lg">
            <SlidersHorizontal className="h-4 w-4" />
            {submitting ? "Saving…" : "Finish my profile"}
          </Button>
          <button
            type="button"
            onClick={() => save(false)}
            disabled={submitting}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border px-4 py-2.5 text-sm font-medium hover:border-accent/40 disabled:opacity-60"
          >
            <Check className="h-4 w-4" />
            Start matching as is
          </button>
          <button
            type="button"
            onClick={() => setReview(false)}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </button>
        </div>
      </div>
    );
  }

  // ── Questions (single screen, three questions) ─────────────────────
  return (
    <div className="mx-auto max-w-editorial px-5 py-16 sm:px-8">
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Home
        </Link>
        <span className="text-xs uppercase tracking-[0.2em] text-brass">
          Step 1
        </span>
        <span className="ml-auto inline-flex items-center gap-2 text-xs font-semibold tabular-nums text-brass">
          {percent}% complete
        </span>
      </div>

      {/* progress bar grows with the profile */}
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted">
        <span
          className="block h-full rounded-full bg-accent transition-[width] duration-500 ease-out"
          style={{ width: `${Math.max(4, percent)}%` }}
        />
      </div>

      <h1 className="mt-8 font-display text-4xl font-semibold tracking-tight">
        Let&apos;s get your taste.
      </h1>
      <p className="mt-2 text-muted-foreground">
        Three quick answers — no typing required beyond a strain name if you have
        one.
      </p>

      {/* Q1 — a strain you love */}
      <Question
        n={1}
        title="A strain you already love"
        sub="Pick from the catalog or type your own. New to this? Skip it."
      >
        <TagInput
          value={favorites}
          onChange={setFavorites}
          placeholder="e.g. GG4, Blue Dream…"
          suggestions={STRAIN_NAMES}
          validateStrains
          ordered
        />
      </Question>

      {/* Q2 — how you smoke */}
      <Question n={2} title="How do you usually smoke?" sub="Helps SŌMA read the experience.">
        <OptionRow
          options={SMOKING_METHODS}
          selected={method}
          onSelect={(v) => setMethod(v === method ? "" : v)}
        />
      </Question>

      {/* Q3 — when you smoke */}
      <Question n={3} title="When do you prefer to smoke?" sub="Time of day shapes the match.">
        <OptionRow
          options={USE_TIMES.map((o) => ({ value: o.value, label: TIME_LABELS[o.value] }))}
          selected={time}
          onSelect={(v) => setTime(v === time ? "" : v)}
        />
      </Question>

      <div className="mt-10 flex items-center gap-3 border-t border-border pt-6">
        <Button onClick={() => setReview(true)} disabled={!canContinue} size="lg">
          Continue
          <ArrowRight className="h-4 w-4" />
        </Button>
        {!canContinue && (
          <span className="text-sm text-muted-foreground">
            Pick a time of day to continue.
          </span>
        )}
      </div>

      <p className="mt-8 text-sm text-muted-foreground">
        Prefer to type it freely?{" "}
        <Link href="/onboarding/describe" className="text-accent hover:underline">
          Describe your taste in words
        </Link>
        {" · "}
        <Link href="/profile" className="text-accent hover:underline">
          full questionnaire
        </Link>
      </p>
    </div>
  );
}

function Question({
  n,
  title,
  sub,
  children,
}: {
  n: number;
  title: string;
  sub: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-8">
      <div className="flex items-baseline gap-2.5">
        <span className="font-display text-sm text-brass">0{n}</span>
        <h2 className="font-display text-xl font-semibold tracking-tight">
          {title}
        </h2>
      </div>
      <p className="ml-7 mt-0.5 text-sm text-muted-foreground">{sub}</p>
      <div className="ml-7 mt-3">{children}</div>
    </div>
  );
}

function OptionRow({
  options,
  selected,
  onSelect,
}: {
  options: { value: string; label: string }[];
  selected: string;
  onSelect: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {options.map((opt) => {
        const active = selected === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onSelect(opt.value)}
            className={cn(
              "rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors",
              active
                ? "border-accent bg-accent/10 text-accent"
                : "border-border bg-card hover:border-accent/40",
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function ReadItem({
  label,
  values,
  tone,
}: {
  label: string;
  values: string[];
  tone?: "accent";
}) {
  return (
    <div className="bg-card p-5">
      <dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </dt>
      <dd
        className={cn(
          "mt-1.5 font-display text-lg",
          tone === "accent" ? "text-accent" : "text-foreground",
        )}
      >
        {values.join(" · ")}
      </dd>
    </div>
  );
}
