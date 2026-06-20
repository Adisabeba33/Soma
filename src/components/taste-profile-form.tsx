"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChipSelect, SingleSelect, TagInput } from "@/components/ui/selectors";
import {
  AROMAS,
  AROMA_FLAVOR,
  DISLIKED_TRAITS,
  EFFECTS,
  FLAVORS,
  LIKED_TRAITS,
  RISK_AVOIDANCE,
} from "@/lib/vocab";
import { PRIMARY_AROMAS, PRIMARY_EFFECTS, USE_TIMES } from "@/lib/profile-target";
import { POPULAR_STRAINS, type TasteProfileState } from "@/lib/profile-state";

const AROMA_VALUES = new Set(AROMAS.map((o) => o.value));
const FLAVOR_VALUES = new Set(FLAVORS.map((o) => o.value));

function Section({
  index,
  title,
  hint,
  optional = false,
  children,
}: {
  index: number;
  title: string;
  hint?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-border pt-7 first:border-0 first:pt-0">
      <div className="flex gap-4">
        <span className="font-display text-sm font-medium text-brass">
          {String(index).padStart(2, "0")}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <h3 className="font-display text-lg font-semibold tracking-tight">
              {title}
            </h3>
            {optional && (
              <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                Optional
              </span>
            )}
          </div>
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

  // Aroma and flavour are one question for the user (smell ≈ taste). The
  // selection feeds both engine dimensions — but split by vocab, so a
  // flavour-only note (nutty, mint, grape) goes only to preferredFlavors and
  // an aroma-only note only to preferredAromas. Writing the raw union to both
  // parked flavour-only tokens in preferredAromas where they could never match
  // and showed forever as Critical Missing in the audit.
  const sensoryNotes = Array.from(
    new Set([...state.preferredAromas, ...state.preferredFlavors]),
  );
  const setSensoryNotes = (v: string[]) =>
    setState((prev) => ({
      ...prev,
      preferredAromas: v.filter((t) => AROMA_VALUES.has(t)),
      preferredFlavors: v.filter((t) => FLAVOR_VALUES.has(t)),
    }));

  return (
    <div className="space-y-7">
      <Section
        index={1}
        title="Which strains have you loved?"
        hint="Add the flower that has genuinely worked for you, in order of preference — your most-loved first. SŌMA uses these as anchors, and the order matters: a strain that resembles your #1 favourite scores a little above one that resembles a lower-ranked pick."
      >
        <TagInput
          value={state.favoriteStrains}
          onChange={(v) => set("favoriteStrains", v)}
          placeholder="Type a strain and press Enter"
          suggestions={POPULAR_STRAINS}
          validateStrains
          ordered
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
        title="Which aromas & flavours do you reach for?"
        hint="Smell and taste together — pick everything that appeals."
      >
        <ChipSelect
          options={AROMA_FLAVOR}
          value={sensoryNotes}
          onChange={setSensoryNotes}
        />
      </Section>

      <Section
        index={4}
        title="One jar stops you dead. What does it smell like?"
        hint="Pick one. This is your primary note — it carries extra weight."
      >
        <SingleSelect
          options={PRIMARY_AROMAS}
          value={state.primaryAroma}
          onChange={(v) => set("primaryAroma", v)}
        />
      </Section>

      <Section
        index={5}
        title="What effect are you looking for?"
        hint="Pick everything that fits — head and body."
      >
        <ChipSelect
          options={EFFECTS}
          value={state.preferredEffects}
          onChange={(v) => set("preferredEffects", v)}
        />
      </Section>

      <Section
        index={6}
        title="A perfect session — in one word, how do you feel?"
        hint="Pick one. This is the outcome that matters most to you."
      >
        <SingleSelect
          options={PRIMARY_EFFECTS}
          value={state.primaryEffect}
          onChange={(v) => set("primaryEffect", v)}
        />
      </Section>

      <Section
        index={7}
        title="Any effects you want to avoid?"
        optional
        hint="Pick anything that ruins a session for you — couch-lock, paranoia, head-heavy spin. SŌMA penalises picks that carry these and silences the dislike if your favourites already deliver it (you're allowed to contradict yourself)."
      >
        <ChipSelect
          options={EFFECTS}
          value={state.dislikedEffects}
          onChange={(v) => set("dislikedEffects", v)}
        />
      </Section>

      <Section
        index={8}
        title="Anything in the high you'd rather avoid?"
        optional
        hint="For users who want daytime energy but not a nervous, overstimulating edge. SŌMA gently lowers strains known to run racy — only for you, and never if your own favourites already run that way."
      >
        <ChipSelect
          options={RISK_AVOIDANCE}
          value={state.avoidedRisks}
          onChange={(v) => set("avoidedRisks", v)}
        />
      </Section>

      <Section
        index={9}
        title="When do you usually reach for it?"
        hint="Pick one. This steers day vs night picks."
      >
        <SingleSelect
          options={USE_TIMES}
          value={state.useTime}
          onChange={(v) => set("useTime", v)}
        />
      </Section>

      <Section
        index={10}
        title="What disappointed you in past pickups?"
        optional
        hint="Honest dealbreakers. Some of these come down to freshness and storage rather than the strain itself — SŌMA accounts for that."
      >
        <ChipSelect
          options={DISLIKED_TRAITS}
          value={state.dislikedTraits}
          onChange={(v) => set("dislikedTraits", v)}
        />
      </Section>

      <Section
        index={11}
        title="Strains to steer away from"
        optional
        hint="Anything you already know is not for you."
      >
        <TagInput
          value={state.dislikedStrains}
          onChange={(v) => set("dislikedStrains", v)}
          placeholder="Type a strain and press Enter"
          validateStrains
        />
      </Section>

      <Section index={12} title="Anything else?" optional hint="Free notes.">
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
        <Button size="lg" disabled={submitting} onClick={() => onSubmit(state)}>
          {submitting ? "Saving…" : submitLabel}
        </Button>
      </div>
    </div>
  );
}
