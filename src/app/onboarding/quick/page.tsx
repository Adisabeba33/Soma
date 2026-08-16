"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChipSelect, TagInput } from "@/components/ui/selectors";
import { PresetPicker } from "@/components/preset-picker";
import type { Preset } from "@/lib/profile-presets";
import { cn } from "@/lib/utils";
import {
  USE_TIMES,
  PRIMARY_AROMAS,
  PRIMARY_EFFECTS,
} from "@/lib/profile-target";
import { EFFECTS } from "@/lib/vocab";
import { STRAIN_NAMES } from "@/lib/strain-data";
import {
  matchingReadiness,
  profileCompleteness,
} from "@/lib/profile-completeness";
import { ProfileProgressRing } from "@/components/profile-progress";
import { labelFor } from "@/lib/vocab";

// Quick onboarding — five questions, one per screen, every one skippable.
// Only high-signal questions the engine actually scores live here (see
// docs/PRODUCT_DECISIONS.md #3); everything else — smoking method, body
// feel, textures, risk avoidance, dealbreakers — belongs to the full
// profile at /profile. Matching unlocks via matchingReadiness(), not a
// completeness percent: a favourite strain alone is enough, or primary
// effect + time plus one sensory pick.
//   1. a strain you already love
//   2. your one-word session (primary effect)
//   3. when you usually smoke (use time)
//   4. the one aroma that pulls you in (primary aroma)
//   5. effects you want to avoid

const ONBOARDING_SCREENS = 5;
const LAST_STEP = ONBOARDING_SCREENS - 1;

const TIME_LABELS: Record<string, string> = {
  morning: "Morning",
  daytime: "Day",
  evening: "Evening",
  bed: "Late night",
  anytime: "Any time",
};

export default function QuickOnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0); // 0–4 = screens 1–5

  const [favorites, setFavorites] = useState<string[]>([]);
  const [primaryEffect, setPrimaryEffect] = useState("");
  const [time, setTime] = useState("");
  const [primaryAroma, setPrimaryAroma] = useState("");
  const [dislikedEffects, setDislikedEffects] = useState<string[]>([]);

  const [started, setStarted] = useState(false);
  const [review, setReview] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [presetBusy, setPresetBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Single source for the readiness check and the save payload. Only the
  // five asked fields are sent — the depth questions stay untouched for
  // the full profile.
  const draft = {
    favoriteStrains: favorites,
    primaryEffect,
    useTime: time,
    primaryAroma,
    dislikedEffects,
  };
  const readiness = matchingReadiness(draft);
  const percent = profileCompleteness(draft).percent;

  async function save(target: "match" | "profile") {
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
      router.push(target === "profile" ? "/profile" : "/taste-match");
    } catch {
      setError("Couldn't save that. Try again.");
      setSubmitting(false);
    }
  }

  // Quick start: one tap saves a ready preset profile and goes to matching.
  async function pickPreset(preset: Preset) {
    setPresetBusy(preset.id);
    setError(null);
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(preset.profile),
      });
      if (!res.ok) throw new Error();
      router.push("/taste-match");
    } catch {
      setError("Couldn't save that. Try again.");
      setPresetBusy(null);
    }
  }

  function onContinue() {
    if (step < LAST_STEP) {
      setStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setReview(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  // ── Quick start — pick a preset, or build your own ─────────────────
  if (!started) {
    return (
      <div className="mx-auto max-w-editorial px-5 py-16 sm:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Home
        </Link>

        <p className="mt-8 text-xs uppercase tracking-[0.24em] text-brass">
          Your sensory profile
        </p>
        <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
          Find your taste in one tap.
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
          Pick the profile that fits you and start matching right away — or
          answer five quick questions for your own. You can refine it anytime.
        </p>

        {error && (
          <p className="mt-5 rounded-xl bg-[#a23b2c]/10 px-4 py-3 text-sm text-[#a23b2c]">
            {error}
          </p>
        )}

        <div className="mt-8">
          <PresetPicker
            onPick={pickPreset}
            onCustom={() => setStarted(true)}
            busyId={presetBusy}
          />
        </div>
      </div>
    );
  }

  // ── Final summary / read-back ──────────────────────────────────────
  if (review) {
    const canMatch = readiness.ready;
    const effectLabel =
      PRIMARY_EFFECTS.find((o) => o.value === primaryEffect)?.label ?? "—";
    const aromaLabel =
      PRIMARY_AROMAS.find((o) => o.value === primaryAroma)?.label ?? "—";
    const timeLabel = time ? TIME_LABELS[time] : "Anytime";

    return (
      <div className="mx-auto max-w-editorial px-5 py-16 sm:px-8">
        <p className="text-xs uppercase tracking-[0.24em] text-brass">
          Almost there
        </p>
        <div className="mt-4 flex items-start gap-5">
          <ProfileProgressRing percent={percent} size={80} className="mt-1" />
          <div>
            <h1 className="font-display text-4xl font-semibold tracking-tight">
              Here&apos;s your taste, in short.
            </h1>
            <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
              {canMatch
                ? "That's enough real signal to start matching. Fine-tune the rest of your profile anytime for an even sharper read."
                : "Matching needs a bit of real signal first — a strain you love, or your primary effect and time plus one aroma or effect you enjoy."}
            </p>
          </div>
        </div>

        <dl className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2">
          <ReadItem
            label="Loves"
            values={favorites.length ? favorites : ["—"]}
            tone="accent"
          />
          <ReadItem label="Wants to feel" values={[effectLabel]} tone="accent" />
          <ReadItem label="Drawn to" values={[aromaLabel]} />
          <ReadItem label="Best time" values={[timeLabel]} />
          <ReadItem
            label="Steers clear of"
            values={
              dislikedEffects.length ? dislikedEffects.map(labelFor) : ["—"]
            }
          />
        </dl>

        {error && (
          <p className="mt-4 rounded-xl bg-[#a23b2c]/10 px-4 py-3 text-sm text-[#a23b2c]">
            {error}
          </p>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-border pt-6">
          {canMatch ? (
            <>
              <Button onClick={() => save("match")} disabled={submitting} size="lg">
                {submitting ? "Saving…" : "Start matching"}
                <ArrowRight className="h-4 w-4" />
              </Button>
              <button
                type="button"
                onClick={() => save("profile")}
                disabled={submitting}
                className="inline-flex items-center gap-1.5 rounded-xl border border-border px-4 py-2.5 text-sm font-medium hover:border-accent/40 disabled:opacity-60"
              >
                Fine-tune my profile
              </button>
            </>
          ) : (
            <Button onClick={() => save("profile")} disabled={submitting} size="lg">
              {submitting ? "Saving…" : "Save & finish my profile"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
          <button
            type="button"
            onClick={() => setReview(false)}
            disabled={submitting}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </button>
        </div>
      </div>
    );
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
          Question {step + 1} of {ONBOARDING_SCREENS}
        </span>
      </div>

      {/* progress bar — one segment per question */}
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted">
        <span
          className="block h-full rounded-full bg-accent transition-[width] duration-500 ease-out"
          style={{ width: `${((step + 1) / ONBOARDING_SCREENS) * 100}%` }}
        />
      </div>

      {step === 0 ? (
        <>
          <h1 className="mt-8 font-display text-4xl font-semibold tracking-tight">
            A strain you already love?
          </h1>
          <p className="mt-2 text-muted-foreground">
            Pick from the catalog or type your own — it&apos;s the strongest
            signal you can give. New to this? Skip it.
          </p>
          <div className="mt-6">
            <TagInput
              value={favorites}
              onChange={setFavorites}
              placeholder="e.g. GG4, Blue Dream…"
              suggestions={STRAIN_NAMES}
              validateStrains
              ordered
            />
          </div>
        </>
      ) : step === 1 ? (
        <>
          <h1 className="mt-8 font-display text-4xl font-semibold tracking-tight">
            A perfect session — in one word, how do you feel?
          </h1>
          <p className="mt-2 text-muted-foreground">
            Pick one. This is the outcome that matters most to you.
          </p>
          <div className="mt-6">
            <OptionRow
              options={PRIMARY_EFFECTS}
              selected={primaryEffect}
              onSelect={(v) => setPrimaryEffect(v === primaryEffect ? "" : v)}
            />
          </div>
        </>
      ) : step === 2 ? (
        <>
          <h1 className="mt-8 font-display text-4xl font-semibold tracking-tight">
            When do you prefer to smoke?
          </h1>
          <p className="mt-2 text-muted-foreground">
            Time of day shapes the match.
          </p>
          <div className="mt-6">
            <OptionRow
              options={USE_TIMES.map((o) => ({
                value: o.value,
                label: TIME_LABELS[o.value],
              }))}
              selected={time}
              onSelect={(v) => setTime(v === time ? "" : v)}
            />
          </div>
        </>
      ) : step === 3 ? (
        <>
          <h1 className="mt-8 font-display text-4xl font-semibold tracking-tight">
            One jar stops you dead. What does it smell like?
          </h1>
          <p className="mt-2 text-muted-foreground">
            Pick one. This is your primary note — it carries extra weight.
          </p>
          <div className="mt-6">
            <OptionRow
              options={PRIMARY_AROMAS}
              selected={primaryAroma}
              onSelect={(v) => setPrimaryAroma(v === primaryAroma ? "" : v)}
            />
          </div>
        </>
      ) : (
        <>
          <h1 className="mt-8 font-display text-4xl font-semibold tracking-tight">
            Any effects you want to avoid?
          </h1>
          <p className="mt-2 text-muted-foreground">
            Couch-lock, paranoia, a head-heavy spin. SŌMA steers you away (and
            won&apos;t if your favourites already deliver it).
          </p>
          <div className="mt-6">
            <ChipSelect
              options={EFFECTS}
              value={dislikedEffects}
              onChange={setDislikedEffects}
            />
          </div>
        </>
      )}

      {error && (
        <p className="mt-6 rounded-xl bg-[#a23b2c]/10 px-4 py-3 text-sm text-[#a23b2c]">
          {error}
        </p>
      )}

      <div className="mt-10 flex items-center gap-3 border-t border-border pt-6">
        {/* Always active — every question is optional; skipping just moves on. */}
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
