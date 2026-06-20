"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TagInput } from "@/components/ui/selectors";
import { cn } from "@/lib/utils";
import { SMOKING_METHODS, USE_TIMES } from "@/lib/profile-target";
import { STRAIN_NAMES } from "@/lib/strain-data";
import { EMPTY_PROFILE, type TasteProfileState } from "@/lib/profile-state";

// Onboarding — the questionnaire fills the profile over five screens, each
// worth ~15% (→ 75% by the end; the final 25% is optional precision added in
// the full profile). THIS is screen 1 of 5: three quick answers — a strain you
// love, how you smoke, when you smoke. Screens 2–5 slot in before the final
// "start matching" step (see ONBOARDING_SCREENS / Continue below).

const ONBOARDING_SCREENS = 5;
const PERCENT_PER_SCREEN = 15; // 5 × 15 = 75% by the end of the questionnaire
const SCREEN_INDEX = 0; // this is screen 1

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
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Progress: each screen is worth PERCENT_PER_SCREEN. Within this screen the
  // three answers fill that share evenly, so the bar climbs 0 → 15% as they go.
  const answered =
    (favorites.length > 0 ? 1 : 0) + (method ? 1 : 0) + (time ? 1 : 0);
  const percent = Math.round(
    (SCREEN_INDEX + answered / 3) * PERCENT_PER_SCREEN,
  );
  // Time + method are the two taps that meaningfully shape the match; the
  // favourite strain is optional (a brand-new user may not have one).
  const canContinue = method !== "" && time !== "";

  async function save() {
    setSubmitting(true);
    setError(null);
    try {
      const draft: TasteProfileState = {
        ...EMPTY_PROFILE,
        favoriteStrains: favorites,
        smokingMethod: method,
        useTime: time,
      };
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      if (!res.ok) throw new Error();
      // Screens 2–5 will be inserted here later; for now screen 1 saves and
      // sends the visitor into matching.
      router.push("/taste-match");
    } catch {
      setError("Couldn't save that. Try again.");
      setSubmitting(false);
    }
  }

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
          Step {SCREEN_INDEX + 1} of {ONBOARDING_SCREENS}
        </span>
        <span className="ml-auto text-xs font-semibold tabular-nums text-brass">
          {percent}% complete
        </span>
      </div>

      {/* progress bar — grows toward 75% across the five screens */}
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
        A few quick answers — no typing beyond a strain name if you have one.
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
      <Question
        n={2}
        title="How do you usually smoke?"
        sub="Helps SŌMA read the experience."
      >
        <OptionRow
          options={SMOKING_METHODS}
          selected={method}
          onSelect={(v) => setMethod(v === method ? "" : v)}
        />
      </Question>

      {/* Q3 — when you smoke */}
      <Question
        n={3}
        title="When do you prefer to smoke?"
        sub="Time of day shapes the match."
      >
        <OptionRow
          options={USE_TIMES.map((o) => ({
            value: o.value,
            label: TIME_LABELS[o.value],
          }))}
          selected={time}
          onSelect={(v) => setTime(v === time ? "" : v)}
        />
      </Question>

      {error && (
        <p className="mt-6 rounded-xl bg-[#a23b2c]/10 px-4 py-3 text-sm text-[#a23b2c]">
          {error}
        </p>
      )}

      <div className="mt-10 flex items-center gap-3 border-t border-border pt-6">
        <Button onClick={save} disabled={!canContinue || submitting} size="lg">
          {submitting ? "Saving…" : "Continue"}
          <ArrowRight className="h-4 w-4" />
        </Button>
        {!canContinue && (
          <span className="text-sm text-muted-foreground">
            Pick how and when you smoke to continue.
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
