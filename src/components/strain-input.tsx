"use client";

import { useState } from "react";
import { AlertTriangle, ClipboardList, Sparkles, X } from "lucide-react";
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
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium">Strains on the table</p>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Add what is actually available to you — type each name, or paste a
          menu below.
        </p>
        <div className="mt-3">
          <TagInput
            value={strains}
            onChange={onChange}
            placeholder="Type a strain and press Enter"
            validateStrains
          />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-muted/40 p-4">
        <label className="flex items-center gap-2 text-sm font-medium">
          <ClipboardList className="h-4 w-4 text-brass" />
          Paste a dispensary menu
        </label>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Prices, percentages and weights are stripped automatically.
        </p>
        <Textarea
          rows={5}
          value={pasteText}
          onChange={(e) => setPasteText(e.target.value)}
          placeholder={
            "Blue Dream — Sativa — 24% THC — $45\nGG4 1/8 $50\nWedding Cake by Jungle Boys 3.5g 28%"
          }
          className="mt-3 bg-card"
        />
        <div className="mt-3 flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
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

      {parsedItems.length > 0 && (
        <ParsedMenuPreview items={parsedItems} onDismiss={dismissPreview} />
      )}

      {error && (
        <p className="rounded-xl bg-[#a23b2c]/10 px-4 py-3 text-sm text-[#a23b2c]">
          {error}
        </p>
      )}

      <div className="flex items-center justify-between gap-4 border-t border-border pt-5">
        <p className="text-sm text-muted-foreground">
          {strains.length === 0
            ? "No strains added yet."
            : `${strains.length} strain${strains.length === 1 ? "" : "s"} ready to analyze.`}
        </p>
        <Button
          size="lg"
          onClick={onAnalyze}
          disabled={analyzing || strains.length === 0}
        >
          <Sparkles className="h-4 w-4" />
          {analyzing ? "Analyzing…" : "Run Taste Match"}
        </Button>
      </div>
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
