"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Bookmark, Check, Download, RotateCcw } from "lucide-react";
import { TasteProfileForm } from "@/components/taste-profile-form";
import { StrainInput } from "@/components/strain-input";
import { RunPrioritiesModal } from "@/components/run-priorities-modal";
import { TasteProfileSummary } from "@/components/taste-profile-summary";
import { RunBasisCard } from "@/components/run-basis-card";
import { ActiveProfileCard, TIME_ICON } from "@/components/active-profile-card";
import { timeProfileForHour, TIME_HEADLINE } from "@/lib/time-of-day";
import type { TimeProfile } from "@/lib/types";
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

// Soft, light placeholder "photograph" per time of day — warm and airy to sit
// inside the Atelier cream palette (never the saturated catalogue gradients).
// Real artwork drops in here later.
const ART_TINT: Record<TimeProfile, string> = {
  morning:
    "radial-gradient(120% 90% at 80% 10%, rgba(214,178,100,0.5), transparent 60%), linear-gradient(155deg,#f0e7d0 0%,#dcc9a0 50%,#c2d0b4 100%)",
  daytime:
    "radial-gradient(120% 90% at 80% 10%, rgba(199,155,86,0.55), transparent 60%), linear-gradient(155deg,#efe2c4 0%,#d8c4a0 45%,#a8b894 100%)",
  sunset:
    "radial-gradient(120% 90% at 80% 10%, rgba(230,170,90,0.55), transparent 60%), linear-gradient(155deg,#f1d6a8 0%,#d99a63 50%,#b06a52 100%)",
  night:
    "radial-gradient(120% 90% at 80% 10%, rgba(214,178,100,0.4), transparent 60%), linear-gradient(155deg,#d9c7a0 0%,#a98f6a 50%,#6f6a5a 100%)",
};

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
  // Per-run merge lean (−1…+1, + toward Main). Only meaningful, and only shown,
  // when exactly two profiles are merged.
  const [mergeBias, setMergeBias] = useState(0);
  const [mergeInfo, setMergeInfo] = useState<{
    mainLabel: string;
    otherLabel: string;
  } | null>(null);
  // The active profile's name (single-profile runs), so the summary can name
  // which account is in play — it matters once there are several.
  const [activeName, setActiveName] = useState<string>("");
  // Current time-of-day, for the themed hero + active-profile card. Null until
  // mounted so the server and first client render agree (the clock is read
  // client-side, after hydration, to avoid a timezone mismatch).
  const [timeOfDay, setTimeOfDay] = useState<TimeProfile | null>(null);
  // When Taste Blender is on, the run scores against the blend (not the single
  // active profile) — surfaced so the page says so instead of staying silent.
  const [blenderInfo, setBlenderInfo] = useState<{
    pair: string[];
    third: string;
    admix: number;
    balance: boolean;
  } | null>(null);
  // The priorities popup shown after the user hits "Run Taste Match".
  const [showPriorities, setShowPriorities] = useState(false);
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
  // Blend recipe for the owner audit (mode/worlds/lean/admix), so the panel
  // shows what actually drove the run.
  const [blendAudit, setBlendAudit] = useState<{
    mode: "merge" | "blender";
    balance: boolean;
    worlds: string[];
    pairLean: number;
    lean2: number;
    thirdName: string | null;
  } | null>(null);
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
    setTimeOfDay(timeProfileForHour(new Date().getHours()));
  }, []);

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

  // Detect the merge set, so the run popup can offer the lean lever. The lever
  // is a single axis (Main ↔ other), so it's offered only for exactly two
  // merged profiles. When Taste Blender is active it owns the recipe (stored,
  // 3-way), so the per-run lever is hidden.
  useEffect(() => {
    Promise.all([
      fetch("/api/profiles").then((r) => r.json()).catch(() => null),
      fetch("/api/blender").then((r) => r.json()).catch(() => null),
    ])
      .then(([profilesRes, blender]) => {
        const all = (profilesRes?.profiles ?? []) as Array<{
          name: string;
          isActive: boolean;
          merged: boolean;
        }>;
        setActiveName(all.find((p) => p.isActive)?.name ?? "");
        if (blender?.active) {
          setMergeInfo(null); // Blender drives it; no per-run lever
          setBlenderInfo({
            pair: ((blender.pair ?? []) as Array<{ name: string }>).map((p) => p.name),
            third: blender.third?.name ?? "",
            admix: Math.round((blender.lean2 ?? 0) * 100),
            balance: Boolean(blender.balance),
          });
          return;
        }
        setBlenderInfo(null);
        const merged = all.filter((p) => p.merged);
        if (merged.length !== 2) {
          setMergeInfo(null);
          return;
        }
        const main = merged.find((p) => p.isActive) ?? merged[0];
        const other = merged.find((p) => p !== main) ?? merged[1];
        setMergeInfo({ mainLabel: main.name, otherLabel: other.name });
      })
      .catch(() => setMergeInfo(null));
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
          mergeBias: mergeInfo ? mergeBias : 0,
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
      setBlendAudit(data.blend ?? null);
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
          {(() => {
            const menuWord = timeOfDay ? TIME_HEADLINE[timeOfDay] : "today";
            const against = blenderInfo
              ? "your blended profiles"
              : mergeInfo
                ? "your merged profiles"
                : "your profile";
            // Themed hero once we know the local time; a plain header until
            // then (so SSR and first client render match).
            if (!timeOfDay) {
              return (
                <>
                  <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight">
                    What&apos;s on the menu {menuWord}?
                  </h1>
                  <p className="mt-3 leading-relaxed text-muted-foreground">
                    Add the strains available to you. SŌMA will score each one
                    against {against} and tell you what is worth your money.
                  </p>
                </>
              );
            }
            const Icon = TIME_ICON[timeOfDay];
            // Atelier hero: copy on the left, a soft placeholder "photograph"
            // on the right (stacked on mobile, art first).
            return (
              <div className="mt-6 grid grid-cols-1 items-center gap-6 sm:grid-cols-[1.4fr_1fr] sm:gap-8">
                <div className="order-2 sm:order-1">
                  <p className="text-[11px] uppercase tracking-[0.3em] text-brass">
                    Tonight&apos;s tasting
                  </p>
                  <h1 className="mt-4 font-display text-[2.6rem] font-medium leading-[1.02] tracking-tight sm:text-5xl">
                    What&apos;s on the menu{" "}
                    <span className="italic text-brass">{menuWord}</span>?
                  </h1>
                  <p className="mt-5 max-w-md leading-relaxed text-muted-foreground">
                    <Icon className="mr-1.5 inline-block h-4 w-4 align-[-2px] text-brass" />
                    Add the strains available to you. SŌMA scores each one
                    against {against} and ranks them by what is worth your money.
                  </p>
                </div>
                <div
                  className="relative order-1 aspect-[16/10] overflow-hidden rounded-3xl shadow-[0_30px_60px_-34px_rgba(80,64,40,0.5)] sm:order-2 sm:aspect-[3/4]"
                  style={{ background: ART_TINT[timeOfDay] }}
                  aria-hidden
                >
                  <span className="absolute bottom-3 left-3 rounded-full bg-foreground/75 px-2.5 py-0.5 text-[10px] uppercase tracking-[0.18em] text-background">
                    Artwork coming
                  </span>
                </div>
              </div>
            );
          })()}
          <ProfileContradictionBanner contradictions={contradictions} />
          <div className="mt-6">
            {blenderInfo ? (
              <RunBasisCard blender={blenderInfo} />
            ) : mergeInfo ? (
              <RunBasisCard
                merge={{ names: [mergeInfo.mainLabel, mergeInfo.otherLabel] }}
              />
            ) : timeOfDay ? (
              <ActiveProfileCard
                name={activeName}
                percent={completion.percent}
                aromas={Array.from(
                  new Set([
                    ...profile.preferredAromas,
                    ...(profile.primaryAroma ? [profile.primaryAroma] : []),
                  ]),
                ).slice(0, 3)}
                effects={Array.from(
                  new Set([
                    ...profile.preferredEffects,
                    ...(profile.primaryEffect ? [profile.primaryEffect] : []),
                  ]),
                ).slice(0, 3)}
                time={timeOfDay}
              />
            ) : (
              <TasteProfileSummary
                state={profile}
                contradictions={contradictions}
                profileName={activeName}
              />
            )}
          </div>
          <div className="mt-8">
            <StrainInput
              strains={strains}
              onChange={setStrains}
              onAnalyze={() => setShowPriorities(true)}
              analyzing={analyzing}
              error={error}
              parsedItems={parsedItems}
              onParsedItemsChange={setParsedItems}
            />
          </div>
          <RunPrioritiesModal
            open={showPriorities}
            onClose={() => setShowPriorities(false)}
            onContinue={() => {
              setShowPriorities(false);
              runAnalysis();
            }}
            senses={prioSenses}
            effect={prioEffect}
            density={densityPref}
            onSenses={setPrioSenses}
            onEffect={setPrioEffect}
            onDensity={setDensityPref}
            merge={
              mergeInfo
                ? {
                    bias: mergeBias,
                    onBias: setMergeBias,
                    mainLabel: mergeInfo.mainLabel,
                    otherLabel: mergeInfo.otherLabel,
                  }
                : undefined
            }
          />
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
            {blenderInfo ? (
              <RunBasisCard blender={blenderInfo} />
            ) : mergeInfo ? (
              <RunBasisCard
                merge={{ names: [mergeInfo.mainLabel, mergeInfo.otherLabel] }}
              />
            ) : (
              <TasteProfileSummary
                state={profile}
                contradictions={contradictions}
                profileName={activeName}
              />
            )}
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
              <AuditPanel
                items={recommendations}
                runSettings={runSettings}
                blend={blendAudit}
              />
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
