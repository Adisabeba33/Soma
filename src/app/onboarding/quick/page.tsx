"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChipSelect, TagInput } from "@/components/ui/selectors";
import { cn } from "@/lib/utils";
import {
  SMOKING_METHODS,
  USE_TIMES,
  PRIMARY_AROMAS,
  BUD_STRUCTURES,
} from "@/lib/profile-target";
import { AROMAS, FLAVORS, AROMA_FLAVOR } from "@/lib/vocab";
import { STRAIN_NAMES } from "@/lib/strain-data";
import { EMPTY_PROFILE, type TasteProfileState } from "@/lib/profile-state";

// Onboarding — the questionnaire fills the profile over five screens, each
// worth ~15% (→ 75% by the end; the final 25% is optional precision in the full
// profile). Screen 1: a strain you love, how you smoke, when you smoke.
// Screen 2: the aromas/flavours you reach for, your one primary note, and the
// bud structure you like. Screens 3–5 slot in before the final save.

const ONBOARDING_SCREENS = 5;
const PERCENT_PER_SCREEN = 15; // 5 × 15 = 75% by the end of the questionnaire

const TIME_LABELS: Record<string, string> = {
  morning: "Morning",
  daytime: "Day",
  evening: "Evening",
  bed: "Late night",
};

// Aroma and flavour are one question for the user; the selection feeds both
// engine dimensions, split by vocab so a flavour-only note goes only to flavours.
const AROMA_VALUES = new Set(AROMAS.map((o) => o.value));
const FLAVOR_VALUES = new Set(FLAVORS.map((o) => o.value));

export default function QuickOnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0); // 0 = screen 1, 1 = screen 2

  // Screen 1
  const [favorites, setFavorites] = useState<string[]>([]);
  const [method, setMethod] = useState("");
  const [time, setTime] = useState("");
  // Screen 2
  const [sensoryNotes, setSensoryNotes] = useState<string[]>([]);
  const [primaryAroma, setPrimaryAroma] = useState("");
  const [budStructure, setBudStructure] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Progress: each screen is worth PERCENT_PER_SCREEN; within a screen the
  // answers fill that share evenly. Screen 1 → 15%, screen 2 → 30%.
  const answered1 =
    (favorites.length > 0 ? 1 : 0) + (method ? 1 : 0) + (time ? 1 : 0);
  const answered2 =
    (sensoryNotes.length > 0 ? 1 : 0) +
    (primaryAroma ? 1 : 0) +
    (budStructure ? 1 : 0);
  const percent =
    step === 0
      ? Math.round((answered1 / 3) * PERCENT_PER_SCREEN)
      : Math.round((1 + answered2 / 3) * PERCENT_PER_SCREEN);

  const canAdvance =
    step === 0
      ? method !== "" && time !== ""
      : primaryAroma !== "" && budStructure !== "";

  async function save() {
    setSubmitting(true);
    setError(null);
    try {
      const draft: TasteProfileState = {
        ...EMPTY_PROFILE,
        favoriteStrains: favorites,
        smokingMethod: method,
        useTime: time,
        preferredAromas: sensoryNotes.filter((t) => AROMA_VALUES.has(t)),
        preferredFlavors: sensoryNotes.filter((t) => FLAVOR_VALUES.has(t)),
        primaryAroma,
        budStructure,
      };
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      if (!res.ok) throw new Error();
      // Screens 3–5 will be inserted before this step later; for now screen 2
      // is the last, so it saves and sends the visitor into matching.
      router.push("/taste-match");
    } catch {
      setError("Couldn't save that. Try again.");
      setSubmitting(false);
    }
  }

  function onContinue() {
    if (step === 0) {
      setStep(1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      save();
    }
  }

  return (
    <div className="mx-auto max-w-editorial px-5 py-16 sm:px-8">
      <div className="flex items-center gap-3">
        {step === 0 ? (
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Home
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => setStep(0)}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        )}
        <span className="text-xs uppercase tracking-[0.2em] text-brass">
          Step {step + 1} of {ONBOARDING_SCREENS}
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

      {step === 0 ? (
        <>
          <h1 className="mt-8 font-display text-4xl font-semibold tracking-tight">
            Let&apos;s get your taste.
          </h1>
          <p className="mt-2 text-muted-foreground">
            A few quick answers — no typing beyond a strain name if you have one.
          </p>

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
        </>
      ) : (
        <>
          <h1 className="mt-8 font-display text-4xl font-semibold tracking-tight">
            Now your nose.
          </h1>
          <p className="mt-2 text-muted-foreground">
            What you&apos;re drawn to in the jar — smell, taste and structure.
          </p>

          <Question
            n={1}
            title="Which aromas & flavours do you reach for?"
            sub="Smell and taste together — pick everything that appeals."
          >
            <ChipSelect
              options={AROMA_FLAVOR}
              value={sensoryNotes}
              onChange={setSensoryNotes}
            />
          </Question>

          <Question
            n={2}
            title="One jar stops you dead. What does it smell like?"
            sub="Pick one. This is your primary note — it carries extra weight."
          >
            <OptionRow
              options={PRIMARY_AROMAS}
              selected={primaryAroma}
              onSelect={(v) => setPrimaryAroma(v === primaryAroma ? "" : v)}
            />
          </Question>

          <Question
            n={3}
            title="Opening the jar — how should the bud look and feel?"
            sub="Visually and to the touch."
          >
            <OptionRow
              options={BUD_STRUCTURES}
              selected={budStructure}
              onSelect={(v) => setBudStructure(v === budStructure ? "" : v)}
            />
          </Question>
        </>
      )}

      {error && (
        <p className="mt-6 rounded-xl bg-[#a23b2c]/10 px-4 py-3 text-sm text-[#a23b2c]">
          {error}
        </p>
      )}

      <div className="mt-10 flex items-center gap-3 border-t border-border pt-6">
        <Button onClick={onContinue} disabled={!canAdvance || submitting} size="lg">
          {submitting ? "Saving…" : "Continue"}
          <ArrowRight className="h-4 w-4" />
        </Button>
        {!canAdvance && (
          <span className="text-sm text-muted-foreground">
            {step === 0
              ? "Pick how and when you smoke to continue."
              : "Pick your primary note and a bud structure to continue."}
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
