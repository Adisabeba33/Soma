"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Bookmark, Check, Download, RotateCcw } from "lucide-react";
import { TasteProfileForm } from "@/components/taste-profile-form";
import { StrainInput } from "@/components/strain-input";
import { DensitySlider } from "@/components/density-slider";
import { PrioritySliders } from "@/components/priority-sliders";
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
import type { MenuQuality, StrainMatch, TasteProfileInput } from "@/lib/types";
import { ProfileContradictionBanner } from "@/components/profile-contradiction-banner";
import {
  profileCompleteness,
  MATCH_GATE_PERCENT,
  type CompletenessItem,
} from "@/lib/profile-completeness";
import { ProfileProgressRing, ProfileMissingList } from "@/components/profile-progress";
import type { Verdict } from "@/components/feedback-pill";
import { AuditPanel } from "@/components/audit-panel";

type Phase = "loading" | "profile" | "gated" | "input" | "results";
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
  // Per-run dense↔fluffy preference (−1…+1). 0 = no preference (default).
  const [densityPref, setDensityPref] = useState(0);
  // Per-run channel priorities (−1…+1 each). 0 = normal balance (default).
  const [prioSenses, setPrioSenses] = useState(0);
  const [prioEffect, setPrioEffect] = useState(0);
  // Slider values captured at the moment of the run, so the Audit reflects what
  // was applied even if the user moves the sliders afterwards.
  const [runSettings, setRunSettings] = useState({
    senses: 0,
    effect: 0,
    density: 0,
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<Rec[]>([]);
  // Audit mode is owner-only; the API reports whether this account is the owner.
  const [isOwner, setIsOwner] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [engine, setEngine] = useState<"builtin" | "openai">("builtin");
  const [menuQuality, setMenuQuality] = useState<MenuQuality | null>(null);
  const [savedState, setSavedState] = useState<"idle" | "saving" | "saved">(
    "idle",
  );
  // The visitor's own verdicts (loved/good/neutral/avoid) per strain, so a
  // result they've already rated can show a "You loved it" badge.
  const [verdicts, setVerdicts] = useState<Record<string, Verdict>>({});
  // Profile completeness — matching is gated until MATCH_GATE_PERCENT.
  const [completion, setCompletion] = useState<{
    percent: number;
    missing: CompletenessItem[];
  }>({ percent: 0, missing: [] });

  useEffect(() => {
    fetch("/api/strain-feedback")
      .then((r) => r.json())
      .then((d: { verdicts?: Array<{ strainName: string; verdict: string }> }) => {
        const m: Record<string, Verdict> = {};
        for (const v of d?.verdicts ?? []) {
          if (
            v.verdict === "loved" ||
            v.verdict === "good" ||
            v.verdict === "neutral" ||
            v.verdict === "avoid"
          ) {
            m[v.strainName] = v.verdict;
          }
        }
        setVerdicts(m);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((d) => {
        const result = profileFromApi(d.profile);
        setProfile(result.state);
        setContradictions(d.contradictions ?? []);
        const c = d.profile
          ? profileCompleteness(d.profile as TasteProfileInput)
          : null;
        setCompletion({ percent: c?.percent ?? 0, missing: c?.missing ?? [] });
        if (!result.exists) setPhase("profile");
        else if ((c?.percent ?? 0) < MATCH_GATE_PERCENT) setPhase("gated");
        else setPhase("input");
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
          densityPreference: densityPref,
          priorities: { senses: prioSenses, effect: prioEffect },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Analysis failed. Please try again.");
        return;
      }
      setRecommendations(data.recommendations ?? []);
      setRunSettings({
        senses: prioSenses,
        effect: prioEffect,
        density: densityPref,
      });
      setIsOwner(Boolean(data.isOwner));
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

      {phase === "gated" && (
        <>
          <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight">
            Let&apos;s finish your profile first
          </h1>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            SŌMA needs a bit more to read your taste with confidence. Get your
            sensory profile to {MATCH_GATE_PERCENT}% and matching unlocks.
          </p>
          <div className="mt-8 flex items-start gap-5 rounded-2xl border border-border bg-card p-6">
            <ProfileProgressRing percent={completion.percent} size={76} />
            <div className="min-w-0">
              <p className="font-display text-lg font-semibold tracking-tight">
                {completion.percent}% complete
                <span className="text-muted-foreground">
                  {" "}
                  · need {MATCH_GATE_PERCENT}%
                </span>
              </p>
              <p className="mt-1 text-sm text-muted-foreground">Still missing:</p>
              <ProfileMissingList
                missing={completion.missing.slice(0, 4)}
                className="mt-2"
              />
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/onboarding/quick"
                  className={buttonClass("primary", "md")}
                >
                  Continue the questionnaire
                </Link>
                <Link
                  href="/profile"
                  className={buttonClass("outline", "md")}
                >
                  Edit full profile
                </Link>
              </div>
            </div>
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
          <PrioritySliders
            senses={prioSenses}
            effect={prioEffect}
            onSenses={setPrioSenses}
            onEffect={setPrioEffect}
            className="mt-6"
          />
          <DensitySlider
            value={densityPref}
            onChange={setDensityPref}
            className="mt-4"
          />
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

          {/* Audit mode — the engine's reasoning per strain. Owner-only. */}
          {isOwner && (
            <div className="mt-6">
              <AuditPanel items={recommendations} runSettings={runSettings} />
            </div>
          )}

          <div className="mt-10">
            <ResultsView
              recommendations={recommendations}
              verdicts={verdicts}
            />
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-3 border-t border-border pt-8">
            <Link href="/saved" className={buttonClass("primary", "md")}>
              View history
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
