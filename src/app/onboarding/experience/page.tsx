"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Edit3, Sparkles, X } from "lucide-react";
import { TagInput } from "@/components/ui/selectors";
import { Button, buttonClass } from "@/components/ui/button";
import { POPULAR_STRAINS } from "@/lib/profile-state";
import { labelFor } from "@/lib/vocab";
import { PRIMARY_AROMAS, PRIMARY_EFFECTS, USE_TIMES } from "@/lib/profile-target";
import type { InferenceResult } from "@/lib/profile-from-experience";
import { cn } from "@/lib/utils";

type Phase = "input" | "preview" | "saving";

export default function ExperienceOnboardingPage() {
  const router = useRouter();
  const [loved, setLoved] = useState<string[]>([]);
  const [liked, setLiked] = useState<string[]>([]);
  const [disliked, setDisliked] = useState<string[]>([]);
  const [phase, setPhase] = useState<Phase>("input");
  const [result, setResult] = useState<InferenceResult | null>(null);
  const [edited, setEdited] = useState<InferenceResult["profile"] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function infer() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/profile/from-experience", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ loved, liked, disliked }),
      });
      const data: InferenceResult = await res.json();
      if (!res.ok) {
        setError("Couldn't read those strains. Try a different mix.");
        return;
      }
      if (!data.sufficient) {
        setError(
          "Not enough recognised strains to build a profile. Add at least two strains we hold in the catalog, or use the questionnaire instead.",
        );
        setResult(data);
        return;
      }
      setResult(data);
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
      router.push("/taste-match?fromExperience=1");
    } catch {
      setError("Couldn't save the profile. Try again.");
      setPhase("preview");
    } finally {
      setSubmitting(false);
    }
  }

  function removeFromAxis(
    axis: keyof InferenceResult["profile"],
    value: string,
  ) {
    if (!edited) return;
    const current = edited[axis];
    if (!Array.isArray(current)) return;
    setEdited({
      ...edited,
      [axis]: current.filter((v) => v !== value),
    } as InferenceResult["profile"]);
  }

  const positiveCount =
    (result?.resolved.loved.length ?? 0) +
    (result?.resolved.liked.length ?? 0);

  if (phase === "preview" && edited && result) {
    return (
      <div className="mx-auto max-w-editorial px-5 py-16 sm:px-8">
        <p className="text-xs uppercase tracking-[0.24em] text-brass">
          Experience Match
        </p>
        <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight">
          Here's what we read from your strains.
        </h1>
        <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
          SŌMA inferred this profile from {positiveCount} strain
          {positiveCount === 1 ? "" : "s"} you named. Review what stuck — remove
          anything that doesn't feel right, then save. You can always edit it
          later on the profile page.
        </p>

        <div className="mt-8 space-y-5">
          <PreviewBlock
            label="Anchor strains"
            hint="The reference points the engine treats as ground truth."
            chips={edited.favoriteStrains.map((v) => ({ value: v, label: v }))}
            onRemove={(v) => removeFromAxis("favoriteStrains", v)}
            kind="strain"
          />
          {edited.referenceStrain && (
            <PreviewBlock
              label="If you could keep only one"
              chips={[
                { value: edited.referenceStrain, label: edited.referenceStrain },
              ]}
              onRemove={() =>
                setEdited({ ...edited, referenceStrain: "" })
              }
              kind="strain"
            />
          )}
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
          {edited.likedTraits.length > 0 && (
            <PreviewBlock
              label="What you like in the flower"
              chips={edited.likedTraits.map((v) => ({ value: v, label: labelFor(v) }))}
              onRemove={(v) => removeFromAxis("likedTraits", v)}
              kind="vocab"
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

        {result.unknown.loved.length +
          result.unknown.liked.length +
          result.unknown.disliked.length >
          0 && (
          <p className="mt-6 rounded-xl border border-brass/30 bg-brass/5 px-4 py-3 text-sm text-foreground/80">
            We didn't recognise{" "}
            {[
              ...result.unknown.loved,
              ...result.unknown.liked,
              ...result.unknown.disliked,
            ].join(", ")}{" "}
            — they weren't in the catalog, so we couldn't pull sensory data
            from them. The profile above is based on the recognised strains
            only.
          </p>
        )}

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
            Back to edit strains
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
        Experience Match
      </p>
      <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight">
        Build a profile from strains you've tried.
      </h1>
      <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
        Faster than the questionnaire. Name a few strains you've loved, liked
        or actively disliked — SŌMA reads back the sensory profile they
        imply, shows you what it inferred, and lets you fix it before
        saving.
      </p>

      <div className="mt-10 space-y-7 rounded-2xl border border-border bg-card p-6">
        <Field
          label="Strains you loved"
          hint="Your real anchors. 2–5 names is the sweet spot — fewer and the inference gets noisy, more and your strongest signal gets diluted."
          required
        >
          <TagInput
            value={loved}
            onChange={setLoved}
            placeholder="Type a strain and press Enter"
            suggestions={POPULAR_STRAINS}
            validateStrains
          />
        </Field>

        <Field
          label="Strains you liked (optional)"
          hint="Lighter signal than loved — worth picking but not your reference."
        >
          <TagInput
            value={liked}
            onChange={setLiked}
            placeholder="Optional"
            validateStrains
          />
        </Field>

        <Field
          label="Strains you actively disliked (optional)"
          hint="Used to infer which effects to avoid. Skipped if it would contradict your loved strains."
        >
          <TagInput
            value={disliked}
            onChange={setDisliked}
            placeholder="Optional"
            validateStrains
          />
        </Field>
      </div>

      {error && (
        <p className="mt-4 rounded-xl bg-[#a23b2c]/10 px-4 py-3 text-sm text-[#a23b2c]">
          {error}
        </p>
      )}

      <div className="mt-7 flex flex-wrap items-center gap-3">
        <Button
          onClick={infer}
          disabled={submitting || loved.length === 0}
          size="lg"
        >
          <Sparkles className="h-4 w-4" />
          {submitting ? "Reading…" : "Read my taste"}
        </Button>
        <Link
          href="/profile"
          className={buttonClass("ghost", "lg")}
        >
          Use full questionnaire instead
        </Link>
      </div>

      <p className="mt-6 text-xs text-muted-foreground">
        Inference works best when SŌMA recognises the strains you name —
        check the colour of each tag (green = in catalog, amber = inferred
        from name only).
      </p>
    </div>
  );
}

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-baseline gap-2">
        <h3 className="font-display text-lg font-semibold tracking-tight">
          {label}
        </h3>
        {required && (
          <span className="text-xs uppercase tracking-[0.14em] text-brass">
            required
          </span>
        )}
      </div>
      {hint && (
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          {hint}
        </p>
      )}
      <div className="mt-3">{children}</div>
    </div>
  );
}

interface Chip {
  value: string;
  label: string;
}

function PreviewBlock({
  label,
  hint,
  chips,
  onRemove,
  kind,
  tone = "neutral",
}: {
  label: string;
  hint?: string;
  chips: Chip[];
  onRemove: (value: string) => void;
  kind: "strain" | "vocab";
  tone?: "neutral" | "warning";
}) {
  if (chips.length === 0) return null;
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
      {hint && (
        <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>
      )}
      <ul className="mt-2 flex flex-wrap gap-1.5">
        {chips.map((c) => (
          <li key={c.value}>
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-sm",
                tone === "warning"
                  ? "bg-brass/15 text-brass ring-1 ring-brass/40"
                  : kind === "strain"
                    ? "bg-accent/10 text-accent ring-1 ring-accent/30"
                    : "bg-muted text-foreground",
              )}
            >
              {c.label}
              <button
                type="button"
                onClick={() => onRemove(c.value)}
                aria-label={`Remove ${c.label}`}
                className="hover:opacity-80"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ForcedChoicePreview({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (next: string) => void;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {options.map((o) => {
          const active = value === o.value;
          return (
            <button
              type="button"
              key={o.value}
              onClick={() => onChange(active ? "" : o.value)}
              aria-pressed={active}
              className={cn(
                "rounded-full border px-3 py-1 text-xs transition-colors",
                active
                  ? "border-accent bg-accent text-accent-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-accent/40 hover:text-foreground",
              )}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
