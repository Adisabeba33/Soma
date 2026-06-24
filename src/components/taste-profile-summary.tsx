"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { labelFor } from "@/lib/vocab";
import { ProfileContradictionBanner } from "@/components/profile-contradiction-banner";
import type { ProfileContradiction } from "@/lib/profile-contradictions";
import type { TasteProfileState } from "@/lib/profile-state";
import {
  PRIMARY_AROMAS,
  PRIMARY_EFFECTS,
  SMOKING_METHODS,
  BUD_STRUCTURES,
  PREFERRED_TYPES,
} from "@/lib/profile-target";
import { NAMED_FAMILIES } from "@/lib/strain-families";
import type { Option } from "@/lib/vocab";

function Row({ label, values }: { label: string; values: string[] }) {
  if (values.length === 0) return null;
  return (
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
      <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </span>
      <span className="text-sm">{values.join(", ")}</span>
    </div>
  );
}

// value → label lookups for the forced-choice / option dimensions.
const optLabel = (options: Option[], value: string): string =>
  options.find((o) => o.value === value)?.label ?? value;

const FAMILY_OPTS: Option[] = NAMED_FAMILIES.map((f) => ({
  value: f.key,
  label: f.label,
}));

const TIME_SHORT: Record<string, string> = {
  morning: "Morning",
  daytime: "Daytime",
  evening: "Evening",
  bed: "Before bed",
  anytime: "Anytime",
};
const POTENCY_SHORT: Record<string, string> = {
  mild: "Easy-going",
  balanced: "Balanced",
  strong: "Strong",
};
function bodyFeelLabel(v: number): string {
  if (v <= 33) return "Clear & light";
  if (v <= 66) return "In between";
  return "Heavy & sunk-in";
}

export function TasteProfileSummary({
  state,
  showEdit = true,
  contradictions = [],
}: {
  state: TasteProfileState;
  showEdit?: boolean;
  contradictions?: ProfileContradiction[];
}) {
  // Aroma + flavour are one question for the user — show the deduped union.
  const sensory = Array.from(
    new Set([...state.preferredAromas, ...state.preferredFlavors]),
  ).map(labelFor);

  const single = (value: string, label: string): string[] =>
    value ? [label] : [];

  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-base font-semibold">
          Your taste profile
        </h3>
        {showEdit && (
          <Link
            href="/profile"
            className="text-sm text-accent underline-offset-4 hover:underline"
          >
            Edit
          </Link>
        )}
      </div>

      {/* Collapsed: a one-line teaser. Expanded: the full read-back. */}
      {!open && state.favoriteStrains.length > 0 && (
        <p className="mt-2 truncate text-sm text-muted-foreground">
          {state.favoriteStrains.join(", ")}
        </p>
      )}

      <div className={cn("mt-3 space-y-2", !open && "hidden")}>
        <Row label="Favourites" values={state.favoriteStrains} />
        <Row label="Aromas & flavours" values={sensory} />
        <Row
          label="Primary note"
          values={single(
            state.primaryAroma,
            optLabel(PRIMARY_AROMAS, state.primaryAroma),
          )}
        />
        <Row label="Effects" values={state.preferredEffects.map(labelFor)} />
        <Row
          label="One-word session"
          values={single(
            state.primaryEffect,
            optLabel(PRIMARY_EFFECTS, state.primaryEffect),
          )}
        />
        <Row
          label="Best time"
          values={single(state.useTime, TIME_SHORT[state.useTime] ?? state.useTime)}
        />
        <Row
          label="Type"
          values={single(
            state.preferredType,
            optLabel(PREFERRED_TYPES, state.preferredType),
          )}
        />
        <Row
          label="Body feel"
          values={
            state.bodyFeel === null ? [] : [bodyFeelLabel(state.bodyFeel)]
          }
        />
        <Row
          label="Strength"
          values={single(
            state.potencyPreference,
            POTENCY_SHORT[state.potencyPreference] ?? state.potencyPreference,
          )}
        />
        <Row
          label="Smokes with"
          values={state.smokingMethods.map((v) => optLabel(SMOKING_METHODS, v))}
        />
        <Row
          label="Bud structure"
          values={single(
            state.budStructure,
            optLabel(BUD_STRUCTURES, state.budStructure),
          )}
        />
        <Row label="Likes" values={state.likedTraits.map(labelFor)} />
        <Row
          label="Seeks families"
          values={state.preferredFamilies.map((v) => optLabel(FAMILY_OPTS, v))}
        />
        <Row
          label="Avoids families"
          values={state.avoidedFamilies.map((v) => optLabel(FAMILY_OPTS, v))}
        />
        <Row label="Avoid effects" values={state.dislikedEffects.map(labelFor)} />
        <Row label="Avoid aromas" values={state.dislikedAromas.map(labelFor)} />
        <Row label="Avoid strains" values={state.dislikedStrains} />
        <Row label="Past dealbreakers" values={state.dislikedTraits.map(labelFor)} />
      </div>
      <ProfileContradictionBanner contradictions={contradictions} compact />
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="mt-3 flex w-full items-center justify-center gap-1.5 border-t border-border pt-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        {open ? "Hide" : "View full profile"}
        <ChevronDown
          className={cn("h-4 w-4 transition-transform", open && "rotate-180")}
        />
      </button>
    </div>
  );
}
