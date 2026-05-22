"use client";

import { useState } from "react";
import { ClipboardList, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { TagInput } from "@/components/ui/selectors";

export function StrainInput({
  strains,
  onChange,
  onAnalyze,
  analyzing,
  error,
}: {
  strains: string[];
  onChange: (next: string[]) => void;
  onAnalyze: () => void;
  analyzing: boolean;
  error?: string | null;
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
      const merged = [...strains];
      for (const p of parsed) {
        if (!merged.some((x) => x.toLowerCase() === p.toLowerCase())) {
          merged.push(p);
        }
      }
      onChange(merged);
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
            "Blue Dream — Sativa — 24% THC — $45\nGG4 1/8 $50\nWedding Cake, Northern Lights, Sour Diesel"
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
