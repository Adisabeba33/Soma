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
  QUALITY_PRIORITIES,
  RISK_AVOIDANCE,
  TEXTURE_PREFERENCES,
} from "@/lib/vocab";
import {
  PRIMARY_AROMAS,
  PRIMARY_EFFECTS,
  USE_TIMES,
  SMOKING_METHODS,
  BUD_STRUCTURES,
} from "@/lib/profile-target";
import { NAMED_FAMILIES } from "@/lib/strain-families";
import { STRAIN_NAMES } from "@/lib/strain-data";
import { type TasteProfileState } from "@/lib/profile-state";

const AROMA_VALUES = new Set(AROMAS.map((o) => o.value));
const FLAVOR_VALUES = new Set(FLAVORS.map((o) => o.value));

const FAMILY_OPTIONS = NAMED_FAMILIES.map((f) => ({
  value: f.key,
  label: f.label,
}));
const POTENCY_OPTIONS = [
  { value: "mild", label: "Easy-going" },
  { value: "balanced", label: "Balanced" },
  { value: "strong", label: "Strong" },
];
const BODY_FEEL_OPTIONS = [
  { value: "0", label: "Clear & light" },
  { value: "50", label: "In between" },
  { value: "100", label: "Heavy & sunk-in" },
];

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

// Group heading that mirrors an onboarding screen — used to break the single
// scrolling page into the same five chapters (plus a refinement group), so the
// settings view reads like the questionnaire but shows everything at once.
function GroupHeader({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="border-t-2 border-border pt-9 first:border-0 first:pt-0">
      <h2 className="font-display text-2xl font-semibold tracking-tight">
        {title}
      </h2>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{sub}</p>
    </div>
  );
}

// Mirrors the onboarding questionnaire one-to-one (screens 1–5, same order),
// then adds the extra refinement questions that take the profile to 100%.
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

  // Aroma + flavour are one question; split the selection by vocab so a
  // flavour-only note (nutty, mint…) feeds only preferredFlavors.
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
      <GroupHeader
        title="Let's get your taste"
        sub="A strain you love, how and when you smoke."
      />
      <Section
        index={1}
        title="Which strains have you loved?"
        hint="Add the flower that has genuinely worked for you, most-loved first. SŌMA uses these as anchors and the order matters."
      >
        <TagInput
          value={state.favoriteStrains}
          onChange={(v) => set("favoriteStrains", v)}
          placeholder="Type a strain and press Enter"
          suggestions={STRAIN_NAMES}
          validateStrains
          ordered
        />
      </Section>

      <Section
        index={2}
        title="How do you usually smoke?"
        hint="Pick all that apply."
      >
        <ChipSelect
          options={SMOKING_METHODS}
          value={state.smokingMethods}
          onChange={(v) => set("smokingMethods", v)}
        />
      </Section>

      <Section
        index={3}
        title="When do you prefer to smoke?"
        hint="This steers day vs night picks."
      >
        <SingleSelect
          options={USE_TIMES}
          value={state.useTime}
          onChange={(v) => set("useTime", v)}
        />
      </Section>

      <GroupHeader
        title="Now your nose"
        sub="What you're drawn to in the jar — smell, taste and structure."
      />
      <Section
        index={4}
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
        index={5}
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
        index={6}
        title="Opening the jar — how should the bud look and feel?"
        hint="Visually and to the touch."
      >
        <SingleSelect
          options={BUD_STRUCTURES}
          value={state.budStructure}
          onChange={(v) => set("budStructure", v)}
        />
      </Section>

      <GroupHeader
        title="Now the high"
        sub="The effects you want — and the ones to steer clear of."
      />
      <Section
        index={7}
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
        index={8}
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
        index={9}
        title="Any effects you want to avoid?"
        hint="Couch-lock, paranoia, head-heavy spin. SŌMA penalises these and silences the dislike if your favourites already deliver it."
      >
        <ChipSelect
          options={EFFECTS}
          value={state.dislikedEffects}
          onChange={(v) => set("dislikedEffects", v)}
        />
      </Section>

      <GroupHeader
        title="A few dealbreakers"
        sub="What to steer you away from — each answer sharpens the match."
      />
      <Section
        index={10}
        title="Anything in the high you'd rather avoid?"
        hint="For daytime energy without the nervous edge. SŌMA gently lowers strains known to run this way — never if your own favourites already do."
      >
        <ChipSelect
          options={RISK_AVOIDANCE}
          value={state.avoidedRisks}
          onChange={(v) => set("avoidedRisks", v)}
        />
      </Section>

      <Section
        index={11}
        title="What disappointed you in past pickups?"
        hint="Honest dealbreakers. Some come down to freshness and storage rather than the strain — SŌMA accounts for that."
      >
        <ChipSelect
          options={DISLIKED_TRAITS}
          value={state.dislikedTraits}
          onChange={(v) => set("dislikedTraits", v)}
        />
      </Section>

      <Section
        index={12}
        title="Strains to steer away from"
        hint="Anything you already know is not for you."
      >
        <TagInput
          value={state.dislikedStrains}
          onChange={(v) => set("dislikedStrains", v)}
          placeholder="Type a strain and press Enter"
          suggestions={STRAIN_NAMES}
          validateStrains
        />
      </Section>

      <GroupHeader
        title="Final calibration"
        sub="A few checks to sharpen — and sanity-check — your profile."
      />
      <Section
        index={13}
        title="Any aroma that's an instant no?"
        hint="The opposite of what you reach for — helps catch contradictions."
      >
        <ChipSelect
          options={AROMA_FLAVOR}
          value={state.dislikedAromas}
          onChange={(v) => set("dislikedAromas", v)}
        />
      </Section>

      <Section
        index={14}
        title="When it hits right, how heavy is the body?"
        hint="Clear-headed and light, or sunk into the couch?"
      >
        <SingleSelect
          options={BODY_FEEL_OPTIONS}
          value={state.bodyFeel === null ? "" : String(state.bodyFeel)}
          onChange={(v) => set("bodyFeel", v === "" ? null : Number(v))}
        />
      </Section>

      <Section
        index={15}
        title="How hard should it hit?"
        hint="Your preferred strength."
      >
        <SingleSelect
          options={POTENCY_OPTIONS}
          value={state.potencyPreference}
          onChange={(v) => set("potencyPreference", v)}
        />
      </Section>

      <GroupHeader
        title="Refine further"
        sub="Extra detail that takes your profile to 100% and sharpens the match."
      />
      <Section
        index={16}
        title="What did you like about your favourites?"
        hint="The traits that made those picks feel good."
      >
        <ChipSelect
          options={LIKED_TRAITS}
          value={state.likedTraits}
          onChange={(v) => set("likedTraits", v)}
        />
      </Section>

      <Section
        index={17}
        title="Strain families you seek out or avoid"
        hint="Buying behaviour, distinct from the sensory match."
      >
        <div className="space-y-3">
          <div>
            <p className="mb-1.5 text-xs uppercase tracking-[0.14em] text-muted-foreground">
              Seek out
            </p>
            <ChipSelect
              options={FAMILY_OPTIONS}
              value={state.preferredFamilies}
              onChange={(v) => set("preferredFamilies", v)}
            />
          </div>
          <div>
            <p className="mb-1.5 text-xs uppercase tracking-[0.14em] text-muted-foreground">
              Usually avoid
            </p>
            <ChipSelect
              options={FAMILY_OPTIONS}
              value={state.avoidedFamilies}
              onChange={(v) => set("avoidedFamilies", v)}
            />
          </div>
        </div>
      </Section>

      <Section
        index={18}
        title="What matters most in quality?"
        hint="Tie-breakers when picks are close."
      >
        <ChipSelect
          options={QUALITY_PRIORITIES}
          value={state.qualityPriorities}
          onChange={(v) => set("qualityPriorities", v)}
        />
      </Section>

      <Section
        index={19}
        title="Texture you like"
        hint="How the flower feels and breaks down."
      >
        <ChipSelect
          options={TEXTURE_PREFERENCES}
          value={state.texturePreferences}
          onChange={(v) => set("texturePreferences", v)}
        />
      </Section>

      <Section index={20} title="Anything else?" hint="Free notes.">
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
