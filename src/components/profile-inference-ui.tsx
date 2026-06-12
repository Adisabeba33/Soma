"use client";

// Shared building blocks for the profile-inference onboarding flows
// (Experience Match — from named strains; Describe — from free text). Both
// render an editable preview of an inferred profile, so the chip blocks,
// forced-choice selectors and field wrapper live here instead of being
// duplicated per page.

import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Field({
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

export interface Chip {
  value: string;
  label: string;
}

export function PreviewBlock({
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
      {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
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

export function FamilyMultiSelect({
  label,
  hint,
  options,
  selected,
  onToggle,
  tone = "neutral",
}: {
  label: string;
  hint?: string;
  options: { value: string; label: string }[];
  selected: string[];
  onToggle: (value: string) => void;
  tone?: "neutral" | "warning";
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
      {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
      <div className="mt-2 flex flex-wrap gap-1.5">
        {options.map((o) => {
          const active = selected.includes(o.value);
          return (
            <button
              type="button"
              key={o.value}
              onClick={() => onToggle(o.value)}
              aria-pressed={active}
              className={cn(
                "rounded-full border px-3 py-1 text-xs transition-colors",
                active
                  ? tone === "warning"
                    ? "border-brass bg-brass/15 text-brass"
                    : "border-accent bg-accent text-accent-foreground"
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

export function ForcedChoicePreview({
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
