"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Edit3, Sparkles } from "lucide-react";
import { Button, buttonClass } from "@/components/ui/button";
import {
  Field,
  PreviewBlock,
  ForcedChoicePreview,
} from "@/components/profile-inference-ui";
import { labelFor } from "@/lib/vocab";
import { PRIMARY_AROMAS, PRIMARY_EFFECTS, USE_TIMES } from "@/lib/profile-target";
import type { InferredProfile } from "@/lib/profile-from-experience";

type Phase = "input" | "preview" | "saving";
type DescribeResult = { profile: InferredProfile; sufficient: boolean };

const EXAMPLES = [
  "Sweet fruity candy strains for the daytime — uplifting and social, nothing that knocks me out.",
  "Heavy gassy diesel for the evening, deep body relaxation before bed.",
  "Citrus and pine, clear-headed and focused for work. Looking for something new.",
];

export default function DescribeOnboardingPage() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [phase, setPhase] = useState<Phase>("input");
  const [edited, setEdited] = useState<InferredProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function infer() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/profile/from-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data: DescribeResult = await res.json();
      if (!res.ok) {
        setError("Couldn't read that. Try describing it a different way.");
        return;
      }
      if (!data.sufficient) {
        setError(
          "We couldn't pull a clear taste from that. Try naming smells (gassy, citrus, sweet), feelings (relaxed, focused, sleepy) and when you'd use it — or use the questionnaire instead.",
        );
        return;
      }
      setEdited(data.profile);
      setPhase("preview");
    } catch {
      setError("Couldn't reach the engine. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function save() {
    if (!edited) return;
    setSubmitting(true);
    setPhase("saving");
    setError(null);
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(edited),
      });
      if (!res.ok) throw new Error();
      router.push("/taste-match?fromDescribe=1");
    } catch {
      setError("Couldn't save the profile. Try again.");
      setPhase("preview");
    } finally {
      setSubmitting(false);
    }
  }

  function removeFromAxis(axis: keyof InferredProfile, value: string) {
    if (!edited) return;
    const current = edited[axis];
    if (!Array.isArray(current)) return;
    setEdited({
      ...edited,
      [axis]: current.filter((v) => v !== value),
    } as InferredProfile);
  }

  if (phase === "preview" && edited) {
    return (
      <div className="mx-auto max-w-editorial px-5 py-16 sm:px-8">
        <p className="text-xs uppercase tracking-[0.24em] text-brass">
          Describe your taste
        </p>
        <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight">
          Here's what we read from your description.
        </h1>
        <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
          SŌMA turned your words into a starting profile. Review what stuck —
          remove anything that doesn't feel right, adjust the forced choices,
          then save. You can always edit it later on the profile page.
        </p>

        <div className="mt-8 space-y-5">
          <PreviewBlock
            label="Aromas you reach for"
            chips={edited.preferredAromas.map((v) => ({ value: v, label: labelFor(v) }))}
            onRemove={(v) => removeFromAxis("preferredAromas", v)}
            kind="vocab"
          />
          <PreviewBlock
            label="On the palate"
            chips={edited.preferredFlavors.map((v) => ({ value: v, label: labelFor(v) }))}
            onRemove={(v) => removeFromAxis("preferredFlavors", v)}
            kind="vocab"
          />
          <PreviewBlock
            label="Effects you're after"
            chips={edited.preferredEffects.map((v) => ({ value: v, label: labelFor(v) }))}
            onRemove={(v) => removeFromAxis("preferredEffects", v)}
            kind="vocab"
          />
          {edited.dislikedEffects.length > 0 && (
            <PreviewBlock
              label="Effects to avoid"
              chips={edited.dislikedEffects.map((v) => ({ value: v, label: labelFor(v) }))}
              onRemove={(v) => removeFromAxis("dislikedEffects", v)}
              kind="vocab"
              tone="warning"
            />
          )}

          <ForcedChoicePreview
            label="Primary aroma"
            value={edited.primaryAroma}
            options={PRIMARY_AROMAS}
            onChange={(v) =>
              setEdited({ ...edited, primaryAroma: v as typeof edited.primaryAroma })
            }
          />
          <ForcedChoicePreview
            label="Primary effect"
            value={edited.primaryEffect}
            options={PRIMARY_EFFECTS}
            onChange={(v) =>
              setEdited({ ...edited, primaryEffect: v as typeof edited.primaryEffect })
            }
          />
          <ForcedChoicePreview
            label="When you reach for it"
            value={edited.useTime}
            options={USE_TIMES}
            onChange={(v) =>
              setEdited({ ...edited, useTime: v as typeof edited.useTime })
            }
          />
        </div>

        {error && (
          <p className="mt-4 rounded-xl bg-[#a23b2c]/10 px-4 py-3 text-sm text-[#a23b2c]">
            {error}
          </p>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-border pt-6">
          <Button onClick={save} disabled={submitting} size="lg">
            <ArrowRight className="h-4 w-4" />
            {submitting ? "Saving…" : "Save profile & continue"}
          </Button>
          <button
            type="button"
            onClick={() => setPhase("input")}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <Edit3 className="h-3.5 w-3.5" />
            Back to edit description
          </button>
          <Link
            href="/profile"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Or use the full questionnaire →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-editorial px-5 py-16 sm:px-8">
      <p className="text-xs uppercase tracking-[0.24em] text-brass">
        Describe your taste
      </p>
      <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight">
        Just tell us what you like, in your own words.
      </h1>
      <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
        No strain names needed. Describe the smells, the feeling you want and
        when you'd use it — SŌMA reads it into a starting profile, shows you
        what it understood, and lets you fix it before saving.
      </p>

      <div className="mt-10 rounded-2xl border border-border bg-card p-6">
        <Field
          label="Your description"
          hint="Smells (gassy, citrus, sweet, fruity), feelings (relaxed, focused, sleepy, social), and when you'd reach for it (daytime, evening, before bed). Mention anything you want to avoid too."
          required
        >
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={5}
            placeholder="e.g. Sweet fruity candy strains for the daytime that keep me social and creative, nothing too heavy that knocks me out…"
            className="w-full resize-y rounded-xl border border-border bg-background px-3.5 py-3 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </Field>

        <div className="mt-4">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Need a nudge? Try one of these
          </p>
          <div className="mt-2 flex flex-col gap-1.5">
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => setText(ex)}
                className="text-left text-sm text-accent hover:underline"
              >
                “{ex}”
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <p className="mt-4 rounded-xl bg-[#a23b2c]/10 px-4 py-3 text-sm text-[#a23b2c]">
          {error}
        </p>
      )}

      <div className="mt-7 flex flex-wrap items-center gap-3">
        <Button
          onClick={infer}
          disabled={submitting || text.trim().length === 0}
          size="lg"
        >
          <Sparkles className="h-4 w-4" />
          {submitting ? "Reading…" : "Read my taste"}
        </Button>
        <Link href="/profile" className={buttonClass("ghost", "lg")}>
          Use full questionnaire instead
        </Link>
      </div>

      <p className="mt-6 text-xs text-muted-foreground">
        This is a quick first pass — you'll get to review and edit everything
        before it's saved.
      </p>
    </div>
  );
}
