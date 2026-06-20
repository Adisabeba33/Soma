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
  PRIMARY_EFFECTS,
  BUD_STRUCTURES,
} from "@/lib/profile-target";
import {
  AROMAS,
  FLAVORS,
  AROMA_FLAVOR,
  EFFECTS,
  RISK_AVOIDANCE,
  DISLIKED_TRAITS,
} from "@/lib/vocab";
import { STRAIN_NAMES } from "@/lib/strain-data";
import { profileCompleteness } from "@/lib/profile-completeness";

// Onboarding — the questionnaire fills the profile over five screens, each
// worth ~15% (→ 75% by the end; the final 25% is optional precision in the full
// profile). Every question is optional and just earns progress — Continue is
// always active, and skipping a whole screen simply adds 0%.
//   1. a strain you love, how/when you smoke
//   2. aromas/flavours, your one primary note, bud structure
//   3. effects you want, one-word session, effects to avoid
//   4. risks in the high to avoid, past-pickup dealbreakers, strains to avoid
//   5. final calibration & cross-check — disliked aromas, body feel, potency

const ONBOARDING_SCREENS = 5;
const LAST_STEP = ONBOARDING_SCREENS - 1; // 0-indexed (screen 5 = step 4)

const TIME_LABELS: Record<string, string> = {
  morning: "Morning",
  daytime: "Day",
  evening: "Evening",
  bed: "Late night",
  anytime: "Any time",
};

const POTENCY_OPTIONS = [
  { value: "mild", label: "Easy-going" },
  { value: "balanced", label: "Balanced" },
  { value: "strong", label: "Strong" },
];

// bodyFeel is a 0–100 axis; three taps map onto it.
const BODY_FEEL_OPTIONS = [
  { value: "0", label: "Clear & light" },
  { value: "50", label: "In between" },
  { value: "100", label: "Heavy & sunk-in" },
];

// Aroma and flavour are one question for the user; the selection feeds both
// engine dimensions, split by vocab so a flavour-only note goes only to flavours.
const AROMA_VALUES = new Set(AROMAS.map((o) => o.value));
const FLAVOR_VALUES = new Set(FLAVORS.map((o) => o.value));

export default function QuickOnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0); // 0–4 = screens 1–5

  // Screen 1
  const [favorites, setFavorites] = useState<string[]>([]);
  const [methods, setMethods] = useState<string[]>([]);
  const [time, setTime] = useState("");
  // Screen 2
  const [sensoryNotes, setSensoryNotes] = useState<string[]>([]);
  const [primaryAroma, setPrimaryAroma] = useState("");
  const [budStructure, setBudStructure] = useState("");
  // Screen 3
  const [preferredEffects, setPreferredEffects] = useState<string[]>([]);
  const [primaryEffect, setPrimaryEffect] = useState("");
  const [dislikedEffects, setDislikedEffects] = useState<string[]>([]);
  // Screen 4 (all optional)
  const [avoidedRisks, setAvoidedRisks] = useState<string[]>([]);
  const [dislikedTraits, setDislikedTraits] = useState<string[]>([]);
  const [dislikedStrains, setDislikedStrains] = useState<string[]>([]);
  // Screen 5 (calibration & cross-check)
  const [dislikedAromas, setDislikedAromas] = useState<string[]>([]);
  const [bodyFeel, setBodyFeel] = useState("");
  const [potency, setPotency] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Single source for both the live progress and the save payload.
  const draft = {
    favoriteStrains: favorites,
    smokingMethods: methods,
    useTime: time,
    preferredAromas: sensoryNotes.filter((t) => AROMA_VALUES.has(t)),
    preferredFlavors: sensoryNotes.filter((t) => FLAVOR_VALUES.has(t)),
    primaryAroma,
    budStructure,
    preferredEffects,
    primaryEffect,
    dislikedEffects,
    avoidedRisks,
    dislikedTraits,
    dislikedStrains,
    dislikedAromas,
    bodyFeel: bodyFeel ? Number(bodyFeel) : null,
    potencyPreference: potency,
  };
  // One unified scale: progress = the shared per-question completeness. Each
  // answer is worth its own weight (so skipping a screen adds 0), and the
  // onboarding tops out near 75% — the extra questions live in the full profile.
  const percent = profileCompleteness(draft).percent;

  async function save() {
    setSubmitting(true);
    setError(null);
    try {
      // The API reads each field loosely and clips to vocab.
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      if (!res.ok) throw new Error();
      router.push("/taste-match");
    } catch {
      setError("Couldn't save that. Try again.");
      setSubmitting(false);
    }
  }

  function onContinue() {
    if (step < LAST_STEP) {
      setStep((s) => s + 1);
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
            onClick={() => setStep((s) => s - 1)}
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
            sub="Pick all that apply."
          >
            <ChipSelect
              options={SMOKING_METHODS}
              value={methods}
              onChange={setMethods}
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
      ) : step === 1 ? (
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
      ) : step === 2 ? (
        <>
          <h1 className="mt-8 font-display text-4xl font-semibold tracking-tight">
            Now the high.
          </h1>
          <p className="mt-2 text-muted-foreground">
            The effects you want — and the ones to steer clear of.
          </p>

          <Question
            n={1}
            title="What effect are you looking for?"
            sub="Pick everything that fits — head and body."
          >
            <ChipSelect
              options={EFFECTS}
              value={preferredEffects}
              onChange={setPreferredEffects}
            />
          </Question>

          <Question
            n={2}
            title="A perfect session — in one word, how do you feel?"
            sub="Pick one. This is the outcome that matters most to you."
          >
            <OptionRow
              options={PRIMARY_EFFECTS}
              selected={primaryEffect}
              onSelect={(v) => setPrimaryEffect(v === primaryEffect ? "" : v)}
            />
          </Question>

          <Question
            n={3}
            title="Any effects you want to avoid?"
            sub="Optional — couch-lock, paranoia, a head-heavy spin. SŌMA steers you away (and won't if your favourites already deliver it)."
          >
            <ChipSelect
              options={EFFECTS}
              value={dislikedEffects}
              onChange={setDislikedEffects}
            />
          </Question>
        </>
      ) : step === 3 ? (
        <>
          <h1 className="mt-8 font-display text-4xl font-semibold tracking-tight">
            A few dealbreakers.
          </h1>
          <p className="mt-2 text-muted-foreground">
            All optional — skip any that don&apos;t apply.
          </p>

          <Question
            n={1}
            title="Anything in the high you'd rather avoid?"
            sub="For daytime energy without the nervous edge. SŌMA gently lowers strains known to run this way — only for you, never if your favourites already do."
          >
            <ChipSelect
              options={RISK_AVOIDANCE}
              value={avoidedRisks}
              onChange={setAvoidedRisks}
            />
          </Question>

          <Question
            n={2}
            title="What disappointed you in past pickups?"
            sub="Honest dealbreakers. Some come down to freshness and storage rather than the strain — SŌMA accounts for that."
          >
            <ChipSelect
              options={DISLIKED_TRAITS}
              value={dislikedTraits}
              onChange={setDislikedTraits}
            />
          </Question>

          <Question
            n={3}
            title="Strains to steer away from"
            sub="Anything you already know is not for you."
          >
            <TagInput
              value={dislikedStrains}
              onChange={setDislikedStrains}
              placeholder="Type a strain and press Enter"
              suggestions={STRAIN_NAMES}
              validateStrains
            />
          </Question>
        </>
      ) : (
        <>
          <h1 className="mt-8 font-display text-4xl font-semibold tracking-tight">
            Final calibration.
          </h1>
          <p className="mt-2 text-muted-foreground">
            Three quick checks to sharpen — and sanity-check — your profile.
          </p>

          <Question
            n={1}
            title="Any aroma that's an instant no?"
            sub="The opposite of what you reach for — helps catch contradictions."
          >
            <ChipSelect
              options={AROMA_FLAVOR}
              value={dislikedAromas}
              onChange={setDislikedAromas}
            />
          </Question>

          <Question
            n={2}
            title="When it hits right, how heavy is the body?"
            sub="Clear-headed and light, or sunk into the couch?"
          >
            <OptionRow
              options={BODY_FEEL_OPTIONS}
              selected={bodyFeel}
              onSelect={(v) => setBodyFeel(v === bodyFeel ? "" : v)}
            />
          </Question>

          <Question
            n={3}
            title="How hard should it hit?"
            sub="Your preferred strength."
          >
            <OptionRow
              options={POTENCY_OPTIONS}
              selected={potency}
              onSelect={(v) => setPotency(v === potency ? "" : v)}
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
        {/* Always active — every question is optional; skipping just adds 0%. */}
        <Button onClick={onContinue} disabled={submitting} size="lg">
          {submitting
            ? "Saving…"
            : step === LAST_STEP
              ? "Finish"
              : "Continue"}
          <ArrowRight className="h-4 w-4" />
        </Button>
        {step < LAST_STEP && (
          <button
            type="button"
            onClick={onContinue}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Skip
          </button>
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
