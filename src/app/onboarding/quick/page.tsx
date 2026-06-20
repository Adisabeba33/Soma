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
import { EMPTY_PROFILE, type TasteProfileState } from "@/lib/profile-state";

// Onboarding — the questionnaire fills the profile over five screens, each
// worth ~15% (→ 75% by the end; the final 25% is optional precision in the full
// profile). Screen 1: a strain you love, how you smoke, when you smoke.
// Screen 2: the aromas/flavours you reach for, your one primary note, and the
// bud structure you like. Screen 3: the effects you want, your one-word
// session, and effects to avoid. Screen 4 (all optional): risks in the high to
// avoid, past-pickup dealbreakers, and strains to steer away from. Screen 5
// slots in before the final save.

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
  const [step, setStep] = useState(0); // 0–3 = screens 1–4
  const LAST_STEP = 3;

  // Screen 1
  const [favorites, setFavorites] = useState<string[]>([]);
  const [method, setMethod] = useState("");
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

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Progress: each screen is worth PERCENT_PER_SCREEN; within a screen the
  // answers fill that share evenly. Screen 1 → 15%, 2 → 30%, 3 → 45%.
  const answered1 =
    (favorites.length > 0 ? 1 : 0) + (method ? 1 : 0) + (time ? 1 : 0);
  const answered2 =
    (sensoryNotes.length > 0 ? 1 : 0) +
    (primaryAroma ? 1 : 0) +
    (budStructure ? 1 : 0);
  const answered3 =
    (preferredEffects.length > 0 ? 1 : 0) +
    (primaryEffect ? 1 : 0) +
    (dislikedEffects.length > 0 ? 1 : 0);
  const answered4 =
    (avoidedRisks.length > 0 ? 1 : 0) +
    (dislikedTraits.length > 0 ? 1 : 0) +
    (dislikedStrains.length > 0 ? 1 : 0);
  const answeredThisStep =
    step === 0
      ? answered1
      : step === 1
        ? answered2
        : step === 2
          ? answered3
          : answered4;
  const percent = Math.round(
    (step + answeredThisStep / 3) * PERCENT_PER_SCREEN,
  );

  // Screen 4 is entirely optional, so it never blocks Continue.
  const canAdvance =
    step === 0
      ? method !== "" && time !== ""
      : step === 1
        ? primaryAroma !== "" && budStructure !== ""
        : step === 2
          ? primaryEffect !== "" && preferredEffects.length > 0
          : true;

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
        preferredEffects,
        primaryEffect,
        dislikedEffects,
        avoidedRisks,
        dislikedTraits,
        dislikedStrains,
      };
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      if (!res.ok) throw new Error();
      // Screen 5 will be inserted before this step later; for now screen 4
      // is the last, so it saves and sends the visitor into matching.
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
      ) : (
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
              : step === 1
                ? "Pick your primary note and a bud structure to continue."
                : "Pick the effects you want and your one-word session to continue."}
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
