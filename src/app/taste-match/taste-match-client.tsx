"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Bookmark, Check, Download, RotateCcw } from "lucide-react";
import { TasteProfileForm } from "@/components/taste-profile-form";
import { StrainInput } from "@/components/strain-input";
import { TasteProfileSummary } from "@/components/taste-profile-summary";
import { ResultsView } from "@/components/results-view";
import { MenuQualityReport } from "@/components/menu-quality-report";
import { Button, buttonClass } from "@/components/ui/button";
import {
  EMPTY_PROFILE,
  profileFromApi,
  type TasteProfileState,
} from "@/lib/profile-state";
import type { ParsedMenuItem } from "@/lib/parse-menu";
import type { ProfileContradiction } from "@/lib/profile-contradictions";
import type { MenuQuality, StrainMatch } from "@/lib/types";
import { ProfileContradictionBanner } from "@/components/profile-contradiction-banner";
import { formatScore } from "@/lib/utils";

type Phase = "loading" | "profile" | "input" | "results";
type Rec = StrainMatch & { id?: string };

export function TasteMatchClient() {
  const searchParams = useSearchParams();
  const [phase, setPhase] = useState<Phase>("loading");
  const [profile, setProfile] = useState<TasteProfileState>(EMPTY_PROFILE);
  const [contradictions, setContradictions] = useState<ProfileContradiction[]>(
    [],
  );
  const [strains, setStrains] = useState<string[]>([]);
  const [parsedItems, setParsedItems] = useState<ParsedMenuItem[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<Rec[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [engine, setEngine] = useState<"builtin" | "openai">("builtin");
  const [menuQuality, setMenuQuality] = useState<MenuQuality | null>(null);
  const [savedState, setSavedState] = useState<"idle" | "saving" | "saved">(
    "idle",
  );

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((d) => {
        const result = profileFromApi(d.profile);
        setProfile(result.state);
        setContradictions(d.contradictions ?? []);
        setPhase(result.exists ? "input" : "profile");
      })
      .catch(() => setPhase("profile"));
  }, []);

  // "Use in Taste Match" deep link from the catalog: /taste-match?strain=GG4
  useEffect(() => {
    const prefill = searchParams.get("strain");
    if (!prefill) return;
    setStrains((prev) =>
      prev.some((s) => s.toLowerCase() === prefill.toLowerCase())
        ? prev
        : [...prev, prefill],
    );
  }, [searchParams]);

  async function saveProfile(state: TasteProfileState) {
    setSavingProfile(true);
    setError(null);
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state),
      });
      if (!res.ok) throw new Error();
      const data = await res.json().catch(() => ({}));
      setProfile(state);
      setContradictions(data.contradictions ?? []);
      setPhase("input");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setError("Couldn't save your profile. Please try again.");
    } finally {
      setSavingProfile(false);
    }
  }

  async function runAnalysis() {
    setAnalyzing(true);
    setError(null);
    try {
      const usedPaste = parsedItems.length > 0;
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          strains,
          inputType: usedPaste ? "paste" : "manual",
          rawInput: usedPaste
            ? parsedItems.map((i) => i.rawLine).join("\n")
            : strains.join("\n"),
          parsedItems,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Analysis failed. Please try again.");
        return;
      }
      setRecommendations(data.recommendations ?? []);
      setSessionId(data.session?.id ?? null);
      setEngine(data.engine === "openai" ? "openai" : "builtin");
      setMenuQuality(data.menuQuality ?? null);
      setSavedState("idle");
      setPhase("results");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setError("Analysis failed. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  }

  function exportSession() {
    if (!sessionId) return;
    window.open(
      `/api/sessions/${encodeURIComponent(sessionId)}/export`,
      "_blank",
      "noopener",
    );
  }

  async function saveResults() {
    if (!sessionId) return;
    setSavedState("saving");
    try {
      const res = await fetch("/api/recommendations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          saved: true,
          title: `Menu — ${new Date().toLocaleDateString()}`,
        }),
      });
      setSavedState(res.ok ? "saved" : "idle");
    } catch {
      setSavedState("idle");
    }
  }

  function startOver() {
    setRecommendations([]);
    setSessionId(null);
    setStrains([]);
    setParsedItems([]);
    setMenuQuality(null);
    setError(null);
    setPhase("input");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
      <p className="text-xs uppercase tracking-[0.24em] text-brass">
        Taste Match
      </p>

      {phase === "loading" && (
        <p className="mt-6 text-sm text-muted-foreground">Loading…</p>
      )}

      {phase === "profile" && (
        <>
          <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight">
            Let&apos;s build your taste profile
          </h1>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            A short sensory questionnaire. It takes a minute, and every Taste
            Match afterwards is measured against it.
          </p>
          <div className="mt-10">
            <TasteProfileForm
              initial={profile}
              submitLabel="Save & continue"
              submitting={savingProfile}
              onSubmit={saveProfile}
              error={error}
            />
          </div>
        </>
      )}

      {phase === "input" && (
        <>
          <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight">
            What&apos;s on the menu?
          </h1>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Add the strains available to you. SŌMA will score each one against
            your profile and tell you what is worth your money.
          </p>
          <ProfileContradictionBanner contradictions={contradictions} />
          <div className="mt-8">
            <TasteProfileSummary
              state={profile}
              contradictions={contradictions}
            />
          </div>
          <div className="mt-8">
            <StrainInput
              strains={strains}
              onChange={setStrains}
              onAnalyze={runAnalysis}
              analyzing={analyzing}
              error={error}
              parsedItems={parsedItems}
              onParsedItemsChange={setParsedItems}
            />
          </div>
        </>
      )}

      {phase === "results" && (
        <>
          <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-4xl font-semibold tracking-tight">
                Your matches
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {recommendations.length} strain
                {recommendations.length === 1 ? "" : "s"} read against your
                profile ·{" "}
                {engine === "openai"
                  ? "Taste Match Engine, refined by the AI sommelier"
                  : "Built-in Taste Match Engine"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={saveResults}
                disabled={savedState !== "idle" || !sessionId}
              >
                {savedState === "saved" ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Bookmark className="h-4 w-4" />
                )}
                {savedState === "saved"
                  ? "Saved"
                  : savedState === "saving"
                    ? "Saving…"
                    : "Save results"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={exportSession}
                disabled={!sessionId}
              >
                <Download className="h-4 w-4" />
                Export JSON
              </Button>
              <Button variant="ghost" size="sm" onClick={startOver}>
                <RotateCcw className="h-4 w-4" />
                New analysis
              </Button>
            </div>
          </div>

          <div className="mt-8">
            <TasteProfileSummary
              state={profile}
              contradictions={contradictions}
            />
          </div>

          {menuQuality && menuQuality.totalParsed > 0 && (
            <div className="mt-6">
              <MenuQualityReport quality={menuQuality} />
            </div>
          )}

          <p className="mt-6 rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
            These are sensory matches, not guarantees. Real quality still
            depends on the grower, freshness and storage.
          </p>

          {/* Temporary testing aid — ranked order on one line, mirroring
              Compare. Shows the rounded match next to the engine's raw score.
              Remove later. */}
          <p className="mt-6 rounded-lg bg-muted px-3 py-2 font-mono text-xs text-muted-foreground">
            [debug] Ranked order:{" "}
            {[...recommendations]
              .sort(
                (a, b) =>
                  b.matchScore - a.matchScore ||
                  b.unclampedScore - a.unclampedScore,
              )
              .map(
                (item) =>
                  `${item.strainName} ${formatScore(item.matchScore)}% (raw ${item.unclampedScore.toFixed(2)}${
                    item.feedbackAdjustment
                      ? ` ${item.feedbackAdjustment > 0 ? "+" : "-"}${Math.abs(item.feedbackAdjustment)} fb`
                      : ""
                  })`,
              )
              .join(", ")}
          </p>

          <div className="mt-10">
            <ResultsView recommendations={recommendations} />
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-3 border-t border-border pt-8">
            <Link href="/saved" className={buttonClass("primary", "md")}>
              View saved recommendations
            </Link>
            <Link href="/compare" className={buttonClass("outline", "md")}>
              Compare strains side by side
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
