"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Check, Plus, X } from "lucide-react";
import type { Option } from "@/lib/vocab";
import { isKnownStrain, resolveCanonical } from "@/lib/known-strains";
import { cn } from "@/lib/utils";

export function ChipSelect({
  options,
  value,
  onChange,
}: {
  options: Option[];
  value: string[];
  onChange: (next: string[]) => void;
}) {
  const toggle = (v: string) => {
    onChange(
      value.includes(v) ? value.filter((x) => x !== v) : [...value, v],
    );
  };

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const active = value.includes(o.value);
        return (
          <button
            type="button"
            key={o.value}
            onClick={() => toggle(o.value)}
            aria-pressed={active}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-sm transition-colors",
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
  );
}

// validateStrains: when true, each tag is checked against the seed
// catalog and rendered green (known) or amber (unknown / inferred).
// An inline note appears under the input when at least one unknown
// strain is present, explaining the lower-confidence behaviour.
export function TagInput({
  value,
  onChange,
  placeholder,
  suggestions = [],
  validateStrains = false,
}: {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  suggestions?: string[];
  validateStrains?: boolean;
}) {
  const [draft, setDraft] = useState("");

  const add = (raw: string) => {
    const v = raw.trim();
    if (!v) return;
    if (value.some((x) => x.toLowerCase() === v.toLowerCase())) {
      setDraft("");
      return;
    }
    onChange([...value, v]);
    setDraft("");
  };

  const remove = (v: string) => onChange(value.filter((x) => x !== v));

  const clearAll = () => {
    onChange([]);
    setDraft("");
  };

  const openSuggestions = suggestions.filter(
    (s) => !value.some((v) => v.toLowerCase() === s.toLowerCase()),
  );

  // Memoise known/unknown classification for the current tags so we
  // don't re-run findStrain() on every re-render of the input.
  const tagState = useMemo(() => {
    if (!validateStrains) return null;
    return value.map((tag) => {
      const known = isKnownStrain(tag);
      const canonical = known ? resolveCanonical(tag) : null;
      return {
        tag,
        known,
        // Show "Matched to X" hint when user typed an alias that
        // resolves to a different canonical name.
        aliasOf:
          canonical && canonical.toLowerCase() !== tag.toLowerCase()
            ? canonical
            : null,
      };
    });
  }, [value, validateStrains]);

  const unknownCount = tagState?.filter((t) => !t.known).length ?? 0;

  return (
    <div className="space-y-2.5">
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card p-2">
        {value.map((tag, i) => {
          const state = tagState?.[i];
          const known = state?.known ?? null;
          return (
            <span
              key={tag}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-sm",
                known === null
                  ? "bg-muted"
                  : known
                    ? "bg-accent/10 text-accent ring-1 ring-accent/30"
                    : "bg-brass/15 text-brass ring-1 ring-brass/40",
              )}
              title={
                known === null
                  ? undefined
                  : known
                    ? state?.aliasOf
                      ? `In catalog — matched to ${state.aliasOf}`
                      : "In our catalog"
                    : "Not in our catalog — recommendations will be inferred from the name"
              }
            >
              {known === true && (
                <Check className="h-3.5 w-3.5 shrink-0" aria-hidden />
              )}
              {known === false && (
                <AlertTriangle
                  className="h-3.5 w-3.5 shrink-0"
                  aria-hidden
                />
              )}
              {tag}
              <button
                type="button"
                onClick={() => remove(tag)}
                className={cn(
                  "hover:opacity-80",
                  known === null ? "text-muted-foreground" : "",
                )}
                aria-label={`Remove ${tag}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          );
        })}
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              add(draft);
            } else if (e.key === "Backspace" && !draft && value.length) {
              remove(value[value.length - 1]);
            }
          }}
          onBlur={() => add(draft)}
          placeholder={value.length ? "" : placeholder}
          className="h-8 min-w-[8rem] flex-1 bg-transparent px-1 text-sm outline-none placeholder:text-muted-foreground"
        />
        {value.length > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Clear all strains"
            title="Clear all"
          >
            <X className="h-3.5 w-3.5" />
            Clear all
          </button>
        )}
      </div>

      {validateStrains && unknownCount > 0 && (
        <p className="flex items-start gap-2 rounded-lg bg-brass/10 px-3 py-2 text-xs leading-relaxed text-foreground/80">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brass" />
          <span>
            {unknownCount === 1
              ? "One strain isn't in SŌMA's reference set yet"
              : `${unknownCount} strains aren't in SŌMA's reference set yet`}
            — we'll do our best, but recommendations for{" "}
            {unknownCount === 1 ? "it" : "them"} will be inferred from the
            name and carry lower confidence.
          </span>
        </p>
      )}

      {openSuggestions.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {openSuggestions.slice(0, 10).map((s) => (
            <button
              type="button"
              key={s}
              onClick={() => add(s)}
              className="inline-flex items-center gap-1 rounded-lg border border-border px-2 py-1 text-xs text-muted-foreground transition-colors hover:border-accent/40 hover:text-foreground"
            >
              <Plus className="h-3 w-3" />
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
