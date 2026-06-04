"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChipSelect, TagInput } from "@/components/ui/selectors";
import {
  AROMAS,
  DISLIKED_TRAITS,
  EFFECTS,
  FLAVORS,
  LIKED_TRAITS,
  QUALITY_PRIORITIES,
  TEXTURE_PREFERENCES,
} from "@/lib/vocab";
import { POPULAR_STRAINS, type TasteProfileState } from "@/lib/profile-state";
import { cn } from "@/lib/utils";

function Section({
  index,
  title,
  hint,
  children,
}: {
  index: number;
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-border pt-7 first:border-0 first:pt-0">
      <div className="flex gap-4">
        <span className="font-display text-sm font-medium text-brass">
          {String(index).padStart(2, "0")}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-lg font-semibold tracking-tight">
            {title}
          </h3>
          {hint && (
            <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
              {hint}
            </p>
          )}
          <div className="mt-3.5">{children}</div>
        </div>
      </div>
    </section>
  );
}

export function TasteProfileForm({
  initial,
  submitLabel,
  submitting,
  onSubmit,
  error,
}: {
  initial: TasteProfileState;
  submitLabel: string;
  submitting: boolean;
  onSubmit: (state: TasteProfileState) => void;
  error?: string | null;
}) {
  const [state, setState] = useState<TasteProfileState>(initial);

  const set = <K extends keyof TasteProfileState>(
    key: K,
    value: TasteProfileState[K],
  ) => setState((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="space-y-7">
      <Section
        index={1}
        title="Which strains have you loved?"
        hint="Add the flower that has genuinely worked for you. SŌMA uses these as anchors for your sensory profile."
      >
        <TagInput
          value={state.favoriteStrains}
          onChange={(v) => set("favoriteStrains", v)}
          placeholder="Type a strain and press Enter"
          suggestions={POPULAR_STRAINS}
        />
      </Section>

      <Section
        index={2}
        title="What did you like about them?"
        hint="The traits that made those picks feel good."
      >
        <ChipSelect
          options={LIKED_TRAITS}
          value={state.likedTraits}
          onChange={(v) => set("likedTraits", v)}
        />
      </Section>

      <Section
        index={3}
        title="What disappointed you in past pickups?"
        hint="Honest dealbreakers. Some of these come down to freshness and storage rather than the strain itself — SŌMA accounts for that."
      >
        <ChipSelect
          options={DISLIKED_TRAITS}
          value={state.dislikedTraits}
          onChange={(v) => set("dislikedTraits", v)}
        />
      </Section>

      <Section
        index={4}
        title="Which aromas do you reach for?"
        hint="The nose you want when the jar opens."
      >
        <ChipSelect
          options={AROMAS}
          value={state.preferredAromas}
          onChange={(v) => set("preferredAromas", v)}
        />
      </Section>

      <Section index={5} title="And on the palate?">
        <ChipSelect
          options={FLAVORS}
          value={state.preferredFlavors}
          onChange={(v) => set("preferredFlavors", v)}
        />
      </Section>

      <Section
        index={6}
        title="What effect are you looking for?"
        hint="How you want to feel — head and body."
      >
        <ChipSelect
          options={EFFECTS}
          value={state.preferredEffects}
          onChange={(v) => set("preferredEffects", v)}
        />
      </Section>

      <Section
        index={7}
        title="How should the flower feel?"
        hint="Texture and cure preferences."
      >
        <ChipSelect
          options={TEXTURE_PREFERENCES}
          value={state.texturePreferences}
          onChange={(v) => set("texturePreferences", v)}
        />
      </Section>

      <Section
        index={8}
        title="What matters most to you?"
        hint="Your quality priorities — what you judge a purchase on."
      >
        <ChipSelect
          options={QUALITY_PRIORITIES}
          value={state.qualityPriorities}
          onChange={(v) => set("qualityPriorities", v)}
        />
      </Section>

      <Section
        index={9}
        title="Are you replacing a favourite, or exploring?"
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {(
            [
              {
                value: "similar",
                title: "Replace a favourite",
                desc: "Find the closest thing to a strain I already love.",
              },
              {
                value: "new",
                title: "Explore nearby",
                desc: "Something new that still lands in my comfort zone.",
              },
            ] as const
          ).map((opt) => {
            const active = state.lookingFor === opt.value;
            return (
              <button
                type="button"
                key={opt.value}
                onClick={() => set("lookingFor", opt.value)}
                className={cn(
                  "rounded-xl border p-4 text-left transition-colors",
                  active
                    ? "border-accent bg-accent/5"
                    : "border-border hover:border-accent/40",
                )}
              >
                <span className="flex items-center gap-2 font-medium">
                  <span
                    className={cn(
                      "h-3.5 w-3.5 rounded-full border",
                      active
                        ? "border-accent bg-accent"
                        : "border-muted-foreground",
                    )}
                  />
                  {opt.title}
                </span>
                <span className="mt-1 block text-sm text-muted-foreground">
                  {opt.desc}
                </span>
              </button>
            );
          })}
        </div>
        <div className="mt-3">
          <Input
            value={state.referenceStrain}
            onChange={(e) => set("referenceStrain", e.target.value)}
            placeholder="Reference strain (optional) — e.g. GG4"
          />
        </div>
      </Section>

      <Section
        index={10}
        title="Strains to steer away from"
        hint="Optional. Anything you already know is not for you."
      >
        <TagInput
          value={state.dislikedStrains}
          onChange={(v) => set("dislikedStrains", v)}
          placeholder="Type a strain and press Enter"
        />
      </Section>

      <Section index={11} title="Anything else?" hint="Optional free notes.">
        <Textarea
          rows={3}
          value={state.notes}
          onChange={(e) => set("notes", e.target.value)}
          placeholder="e.g. I smoke mostly in the evening, sensitive to harsh smoke."
        />
      </Section>

      {error && (
        <p className="rounded-xl bg-[#a23b2c]/10 px-4 py-3 text-sm text-[#a23b2c]">
          {error}
        </p>
      )}

      <div className="flex items-center justify-end gap-3 border-t border-border pt-6">
        <Button
          size="lg"
          disabled={submitting}
          onClick={() => onSubmit(state)}
        >
          {submitting ? "Saving…" : submitLabel}
        </Button>
      </div>
    </div>
  );
}
