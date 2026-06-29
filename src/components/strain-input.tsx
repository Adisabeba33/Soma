"use client";

import { useState } from "react";
import {
  AlertTriangle,
  ClipboardList,
  ConciergeBell,
  Sparkles,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { TagInput } from "@/components/ui/selectors";
import type { ParsedMenuItem } from "@/lib/parse-menu";

export function StrainInput({
  strains,
  onChange,
  onAnalyze,
  analyzing,
  error,
  parsedItems,
  onParsedItemsChange,
}: {
  strains: string[];
  onChange: (next: string[]) => void;
  onAnalyze: () => void;
  analyzing: boolean;
  error?: string | null;
  parsedItems: ParsedMenuItem[];
  onParsedItemsChange: (next: ParsedMenuItem[]) => void;
}) {
  const [pasteText, setPasteText] = useState("");
  const [parsing, setParsing] = useState(false);
  const [parseNote, setParseNote] = useState<string | null>(null);

  async function extract() {
    const text = pasteText.trim();
    if (!text) return;
    setParsing(true);
    setParseNote(null);
    try {
      const res = await fetch("/api/upload-menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      const parsed: string[] = Array.isArray(data.strains) ? data.strains : [];
      const items: ParsedMenuItem[] = Array.isArray(data.items) ? data.items : [];
      const merged = [...strains];
      for (const p of parsed) {
        if (!merged.some((x) => x.toLowerCase() === p.toLowerCase())) {
          merged.push(p);
        }
      }
      onChange(merged);
      // Merge new items into the existing preview, deduped by strain name.
      const seen = new Set(parsedItems.map((i) => i.strainName.toLowerCase()));
      const mergedItems = [...parsedItems];
      for (const item of items) {
        const key = item.strainName.toLowerCase();
        if (!seen.has(key)) {
          seen.add(key);
          mergedItems.push(item);
        }
      }
      onParsedItemsChange(mergedItems);
      setPasteText("");
      setParseNote(
        parsed.length
          ? `Pulled ${parsed.length} strain${parsed.length === 1 ? "" : "s"} from the menu.`
          : "Couldn't read any strain names from that text.",
      );
    } catch {
      setParseNote("Something went wrong reading that menu.");
    } finally {
      setParsing(false);
    }
  }

  function dismissPreview() {
    onParsedItemsChange([]);
    setParseNote(null);
  }

  return (
    <div className="space-y-12">
      {/* On the table */}
      <div>
        <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-brass">
          <UtensilsCrossed className="h-3.5 w-3.5" />
          On the table
        </p>
        <h2 className="mt-2 font-display text-xl font-semibold tracking-tight">
          What&apos;s available to you
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Type each strain and press Enter — or paste a whole menu below.
        </p>
        <div className="mt-4">
          <TagInput
            value={strains}
            onChange={onChange}
            placeholder="Type a strain and press Enter"
            validateStrains
          />
        </div>
      </div>

      {/* Paste a menu — warm panel, not a form box */}
      <div className="relative">
        <div className="mb-5 flex items-center gap-4">
          <span className="h-px flex-1 bg-border" />
          <span className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
            or
          </span>
          <span className="h-px flex-1 bg-border" />
        </div>
        <div className="soma-lift rounded-[1.75rem] border border-border/70 bg-card p-7 shadow-[0_28px_60px_-42px_rgba(60,45,20,0.45)] hover:shadow-[0_34px_70px_-40px_rgba(60,45,20,0.55)] sm:p-8">
          <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-brass">
            <ClipboardList className="h-3.5 w-3.5" />
            Paste a dispensary menu
          </p>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Prices, percentages and weights are stripped automatically.
          </p>

          {/* An intentional, formatted example so the field never reads blank. */}
          <div className="mt-4 rounded-2xl border border-dashed border-border/70 bg-background/40 px-4 py-3.5">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Example — paste it like this
            </p>
            <div className="mt-2 space-y-1 font-mono text-[12.5px] leading-relaxed text-foreground/65">
              <p>Blue Dream — Sativa — 24% THC — $45</p>
              <p>GG4 1/8 $50</p>
              <p>Wedding Cake by Jungle Boys 3.5g 28%</p>
            </div>
          </div>

          <Textarea
            rows={5}
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            placeholder="Paste your menu here — one strain per line."
            className="soma-ease mt-4 rounded-2xl border-border/60 bg-background/40 px-4 py-3.5 transition-shadow focus-visible:ring-accent/15"
          />
          <div className="mt-4 flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="soma-ease rounded-full px-5 transition-all"
              onClick={extract}
              disabled={parsing || !pasteText.trim()}
            >
              {parsing ? "Reading…" : "Extract strains"}
            </Button>
            {parseNote && (
              <span className="text-sm text-muted-foreground">{parseNote}</span>
            )}
          </div>
        </div>
      </div>

      {parsedItems.length > 0 && (
        <ParsedMenuPreview items={parsedItems} onDismiss={dismissPreview} />
      )}

      {error && (
        <p className="rounded-xl bg-[#a23b2c]/10 px-4 py-3 text-sm text-[#a23b2c]">
          {error}
        </p>
      )}

      {strains.length === 0 ? (
        <div className="flex flex-col items-center gap-5 px-6 py-12 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brass/10 ring-1 ring-brass/15">
            <ConciergeBell className="h-7 w-7 text-brass" strokeWidth={1.5} />
          </span>
          <div>
            <p className="font-display text-2xl font-semibold tracking-tight">
              Tonight&apos;s tasting begins here
            </p>
            <p className="mx-auto mt-2 max-w-sm leading-relaxed text-muted-foreground">
              Add the first strain, or paste a menu above — the ranking pours
              from there.
            </p>
          </div>
          <Button size="lg" className="soma-ease rounded-full" disabled>
            <Sparkles className="h-4 w-4" />
            Run Taste Match
          </Button>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border/70 pt-8">
          <p className="text-sm text-muted-foreground">
            <span className="font-display text-xl font-semibold text-foreground">
              {strains.length}
            </span>{" "}
            strain{strains.length === 1 ? "" : "s"} ready to read.
          </p>
          <Button
            size="lg"
            className="soma-ease rounded-full transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-16px_rgba(47,58,44,0.6)]"
            onClick={onAnalyze}
            disabled={analyzing}
          >
            <Sparkles className="h-4 w-4" />
            {analyzing ? "Analyzing…" : "Run Taste Match"}
          </Button>
        </div>
      )}
    </div>
  );
}

function ParsedMenuPreview({
  items,
  onDismiss,
}: {
  items: ParsedMenuItem[];
  onDismiss: () => void;
}) {
  const uncertain = items.filter((i) => i.confidence !== "high").length;
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium">Parsed menu preview</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {items.length} item{items.length === 1 ? "" : "s"} read
            {uncertain > 0
              ? ` · ${uncertain} need${uncertain === 1 ? "s" : ""} a second look`
              : ""}
          </p>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="Dismiss preview"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <ul className="mt-3 divide-y divide-border">
        {items.map((item, i) => (
          <li key={`${item.strainName}-${i}`} className="py-2.5">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="text-sm font-medium text-foreground">
                {item.strainName}
              </span>
              {item.grower && (
                <span className="rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground">
                  {item.grower}
                </span>
              )}
              {item.thcPercent !== null && (
                <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                  {item.thcPercent}% THC
                </span>
              )}
              {item.price !== null && (
                <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                  ${item.price}
                </span>
              )}
              {item.weight && (
                <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                  {item.weight}
                </span>
              )}
              {item.confidence !== "high" && (
                <span
                  className={
                    "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] " +
                    (item.confidence === "low"
                      ? "bg-[#a23b2c]/10 text-[#a23b2c]"
                      : "bg-brass/15 text-brass")
                  }
                >
                  <AlertTriangle className="h-3 w-3" />
                  {item.confidence === "low" ? "Unclear" : "Check"}
                </span>
              )}
            </div>
            {item.warnings.length > 0 && (
              <p className="mt-1 text-[11px] text-muted-foreground">
                {item.warnings.join(" ")}
              </p>
            )}
            {item.confidence !== "high" && (
              <p className="mt-1 truncate text-[11px] italic text-muted-foreground">
                raw: {item.rawLine}
              </p>
            )}
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[11px] text-muted-foreground">
        Grower, freshness and package date aren&apos;t captured. Sensory match
        is the only signal — actual quality still depends on the batch.
      </p>
    </div>
  );
}
