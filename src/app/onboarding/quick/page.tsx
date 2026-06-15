"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft, Check, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { labelFor } from "@/lib/vocab";
import { cn } from "@/lib/utils";
import type { InferredProfile } from "@/lib/profile-from-experience";

// A short "budtender" conversation — four taps that map straight onto canonical
// profile tokens (no text parsing needed), then a friendly read-back the user
// confirms. This is the new-visitor "Guide Me" path (UX V2 Phase B / #20).

type Opt = { key: string; label: string } & Partial<{
  effects: string[];
  primaryEffect: InferredProfile["primaryEffect"];
  aromas: string[];
  flavors: string[];
  primaryAroma: InferredProfile["primaryAroma"];
  useTime: InferredProfile["useTime"];
  disliked: string[];
}>;

const Q1: { title: string; sub: string; options: Opt[] } = {
  title: "What are you looking for today?",
  sub: "The feeling you're after.",
  options: [
    { key: "social", label: "Happy & Social", effects: ["happy", "giggly", "euphoric"], primaryEffect: "social" },
    { key: "focus", label: "Focused & Productive", effects: ["focused", "energetic"], primaryEffect: "sharp" },
    { key: "creative", label: "Creative", effects: ["creative", "euphoric"], primaryEffect: "sharp" },
    { key: "relax", label: "Deep Relaxation", effects: ["relaxed", "calm"], primaryEffect: "calm" },
    { key: "sleep", label: "Sleep", effects: ["sleepy", "body-heavy", "relaxed"], primaryEffect: "knockout" },
  ],
};

const Q2: { title: string; sub: string; options: Opt[] } = {
  title: "Which jar do you open first?",
  sub: "The smell that makes you reach for it again.",
  options: [
    { key: "candy", label: "Candy", aromas: ["sweet"], flavors: ["sweet"], primaryAroma: "sweet" },
    { key: "fruit", label: "Fruit", aromas: ["fruity"], flavors: ["fruity"], primaryAroma: "fruit" },
    { key: "citrus", label: "Citrus", aromas: ["citrus"], flavors: ["citrus"], primaryAroma: "citrus" },
    { key: "gas", label: "Gas", aromas: ["gassy", "diesel"], primaryAroma: "gas" },
    { key: "pine", label: "Pine", aromas: ["pine"], primaryAroma: "pineherb" },
    { key: "earth", label: "Earth", aromas: ["earthy"], primaryAroma: "earthfunk" },
  ],
};

const Q3: { title: string; sub: string; options: Opt[] } = {
  title: "When do you usually reach for it?",
  sub: "Time of day shapes the match.",
  options: [
    { key: "morning", label: "Morning", useTime: "morning" },
    { key: "daytime", label: "Daytime", useTime: "daytime" },
    { key: "evening", label: "Evening", useTime: "evening" },
    { key: "bed", label: "Before Bed", useTime: "bed" },
  ],
};

const Q4: { title: string; sub: string; options: Opt[] } = {
  title: "What ruins a good session?",
  sub: "So SŌMA can steer you away from it.",
  options: [
    { key: "sleepy", label: "Sleepiness", disliked: ["sleepy"] },
    { key: "anxiety", label: "Anxiety", disliked: ["head-high"] },
    { key: "heavy", label: "Too Heavy", disliked: ["body-heavy"] },
    { key: "head", label: "Head Pressure", disliked: ["head-high"] },
    { key: "none", label: "Nothing", disliked: [] },
  ],
};

const STEPS = [Q1, Q2, Q3, Q4];

const FAMILIES_BY_AROMA: Record<string, string[]> = {
  sweet: ["Runtz", "Zkittlez", "Dessert"],
  fruit: ["Fruit-forward", "Tropical exotics"],
  citrus: ["Lemon", "Haze"],
  gas: ["OG", "Gas & Diesel"],
  pineherb: ["OG", "Kush"],
  earthfunk: ["Kush", "Garlic / Funk"],
};

const BEST_USE: Record<string, string> = {
  morning: "Morning — wake & go",
  daytime: "Daytime & social",
  evening: "Evening wind-down",
  bed: "Nighttime & sleep",
};

function emptyProfile(): InferredProfile {
  return {
    favoriteStrains: [], dislikedStrains: [], referenceStrain: "", likedTraits: [],
    dislikedTraits: [], preferredAromas: [], preferredFlavors: [], preferredEffects: [],
    dislikedEffects: [], dislikedAromas: [], texturePreferences: [], qualityPriorities: [],
    primaryAroma: "", primaryEffect: "", useTime: "", bodyFeel: null, potencyPreference: "",
    preferredFamilies: [], avoidedFamilies: [], lookingFor: "similar", notes: "",
  };
}

function buildProfile(a: (Opt | null)[]): InferredProfile {
  const [q1, q2, q3, q4] = a;
  const p = emptyProfile();
  if (q1) {
    p.preferredEffects = q1.effects ?? [];
    p.primaryEffect = q1.primaryEffect ?? "";
  }
  if (q2) {
    p.preferredAromas = q2.aromas ?? [];
    p.preferredFlavors = q2.flavors ?? [];
    p.primaryAroma = q2.primaryAroma ?? "";
  }
  if (q3) p.useTime = q3.useTime ?? "";
  if (q4) p.dislikedEffects = q4.disliked ?? [];
  return p;
}

export default function QuickOnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0); // 0..3 questions, 4 = interpretation
  const [answers, setAnswers] = useState<(Opt | null)[]>([null, null, null, null]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function pick(opt: Opt) {
    const next = [...answers];
    next[step] = opt;
    setAnswers(next);
    setStep((s) => s + 1);
  }

  async function save(adjust: boolean) {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildProfile(answers)),
      });
      if (!res.ok) throw new Error();
      router.push(adjust ? "/profile" : "/taste-match");
    } catch {
      setError("Couldn't save that. Try again.");
      setSubmitting(false);
    }
  }

  // ── Interpretation screen ──────────────────────────────────────────
  if (step >= STEPS.length) {
    const p = buildProfile(answers);
    const taste = [...p.preferredAromas, ...p.preferredFlavors]
      .filter((v, i, arr) => arr.indexOf(v) === i)
      .map((v) => labelFor(v));
    const effects = p.preferredEffects.map((v) => labelFor(v));
    const families = p.primaryAroma ? FAMILIES_BY_AROMA[p.primaryAroma] ?? [] : [];
    const bestUse = p.useTime ? BEST_USE[p.useTime] : "Anytime";

    return (
      <div className="mx-auto max-w-editorial px-5 py-16 sm:px-8">
        <p className="text-xs uppercase tracking-[0.24em] text-brass">Guide Me</p>
        <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight">
          Here&apos;s what I think you like.
        </h1>
        <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
          From four quick taps. If it&apos;s close, save it and start matching —
          you can fine-tune any of it later.
        </p>

        <dl className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2">
          <Read label="Taste" values={taste.length ? taste : ["—"]} tone="accent" />
          <Read label="Effects" values={effects.length ? effects : ["—"]} tone="accent" />
          <Read label="Best use" values={[bestUse]} />
          <Read label="Likely families" values={families.length ? families : ["—"]} />
        </dl>

        {p.dislikedEffects.length > 0 && (
          <p className="mt-4 text-sm text-muted-foreground">
            Steering you away from:{" "}
            <span className="text-[#a23b2c]">
              {p.dislikedEffects.map((v) => labelFor(v)).join(", ")}
            </span>
          </p>
        )}

        {error && (
          <p className="mt-4 rounded-xl bg-[#a23b2c]/10 px-4 py-3 text-sm text-[#a23b2c]">
            {error}
          </p>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-border pt-6">
          <Button onClick={() => save(false)} disabled={submitting} size="lg">
            <Check className="h-4 w-4" />
            {submitting ? "Saving…" : "Looks right"}
          </Button>
          <button
            type="button"
            onClick={() => save(true)}
            disabled={submitting}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border px-4 py-2.5 text-sm font-medium hover:border-accent/40 disabled:opacity-60"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Adjust profile
          </button>
          <button
            type="button"
            onClick={() => setStep(STEPS.length - 1)}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </button>
        </div>
      </div>
    );
  }

  // ── Question screen ────────────────────────────────────────────────
  const q = STEPS[step];
  return (
    <div className="mx-auto max-w-editorial px-5 py-16 sm:px-8">
      <div className="flex items-center gap-3">
        {step > 0 ? (
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        ) : (
          <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Home
          </Link>
        )}
        <span className="text-xs uppercase tracking-[0.2em] text-brass">
          Question {step + 1} of {STEPS.length}
        </span>
      </div>

      {/* progress */}
      <div className="mt-4 flex gap-1.5">
        {STEPS.map((_, i) => (
          <span
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full",
              i <= step ? "bg-accent" : "bg-muted",
            )}
          />
        ))}
      </div>

      <h1 className="mt-8 font-display text-4xl font-semibold tracking-tight">
        {q.title}
      </h1>
      <p className="mt-2 text-muted-foreground">{q.sub}</p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {q.options.map((opt) => {
          const active = answers[step]?.key === opt.key;
          return (
            <button
              key={opt.key}
              type="button"
              onClick={() => pick(opt)}
              className={cn(
                "group flex items-center justify-between rounded-2xl border px-5 py-4 text-left text-lg font-medium transition-colors",
                active
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border bg-card hover:border-accent/40",
              )}
            >
              {opt.label}
              <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </button>
          );
        })}
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

function Read({
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
