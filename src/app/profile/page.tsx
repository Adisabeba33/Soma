"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, Heart, ChevronRight } from "lucide-react";
import { TasteProfileForm } from "@/components/taste-profile-form";
import { ProfileContradictionBanner } from "@/components/profile-contradiction-banner";
import {
  ProfileProgressRing,
  ProfileMissingList,
} from "@/components/profile-progress";
import {
  EMPTY_PROFILE,
  profileFromApi,
  type TasteProfileState,
} from "@/lib/profile-state";
import {
  profileCompleteness,
  type ProfileCompleteness,
} from "@/lib/profile-completeness";
import type { TasteProfileInput } from "@/lib/types";
import type { ProfileContradiction } from "@/lib/profile-contradictions";

export default function ProfilePage() {
  const [initial, setInitial] = useState<TasteProfileState | null>(null);
  const [exists, setExists] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contradictions, setContradictions] = useState<ProfileContradiction[]>(
    [],
  );
  // Completeness is derived from the RAW api profile (it carries families,
  // potency and disliked-aroma fields the lighter form state drops).
  const [completeness, setCompleteness] = useState<ProfileCompleteness | null>(
    null,
  );

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((d) => {
        const result = profileFromApi(d.profile);
        setInitial(result.state);
        setExists(result.exists);
        setContradictions(d.contradictions ?? []);
        setCompleteness(
          d.profile
            ? profileCompleteness(d.profile as TasteProfileInput)
            : null,
        );
      })
      .catch(() => setInitial({ ...EMPTY_PROFILE }));
  }, []);

  async function save(state: TasteProfileState) {
    setSubmitting(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state),
      });
      if (!res.ok) throw new Error();
      const data = await res.json().catch(() => ({}));
      setContradictions(data.contradictions ?? []);
      if (data.profile) {
        setCompleteness(profileCompleteness(data.profile as TasteProfileInput));
      }
      setSaved(true);
      setExists(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setError("Couldn't save your profile. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-16 sm:px-8">
      <p className="text-xs uppercase tracking-[0.24em] text-brass">
        Sensory Profile
      </p>
      <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight">
        Your sensory profile
      </h1>
      <p className="mt-3 leading-relaxed text-muted-foreground">
        This is what every Taste Match is measured against. Edit it whenever
        your palate shifts — the more honest it is, the sharper SŌMA gets.
      </p>

      {completeness && (
        <div className="mt-8 flex items-start gap-4 rounded-2xl border border-border bg-card p-5">
          <ProfileProgressRing percent={completeness.percent} size={72} />
          <div className="min-w-0">
            {completeness.isComplete ? (
              <p className="font-display text-lg font-semibold tracking-tight text-accent">
                Profile complete — SŌMA has the full picture.
              </p>
            ) : (
              <>
                <p className="font-display text-lg font-semibold tracking-tight">
                  {completeness.percent}% complete
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Add the rest for a sharper match — fewer ties, more confident
                  picks. Still missing:
                </p>
                <ProfileMissingList
                  missing={completeness.missing.slice(0, 4)}
                  className="mt-2"
                />
              </>
            )}
          </div>
        </div>
      )}

      <Link
        href="/profile/feedback"
        className="mt-6 flex items-center justify-between gap-3 rounded-2xl border border-border bg-card px-4 py-3 transition-colors hover:border-accent/40"
      >
        <span className="flex items-center gap-2.5">
          <Heart className="h-4 w-4 text-accent" />
          <span className="text-sm">
            Strains you&apos;ve rated
            <span className="block text-xs text-muted-foreground">
              See everything you loved, liked, stayed neutral on or avoided.
            </span>
          </span>
        </span>
        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
      </Link>

      {saved && (
        <p className="mt-6 flex items-center gap-2 rounded-xl bg-accent/10 px-4 py-3 text-sm text-accent">
          <Check className="h-4 w-4" />
          Profile saved.
        </p>
      )}

      <ProfileContradictionBanner contradictions={contradictions} />

      <div className="mt-10">
        {initial === null ? (
          <p className="text-sm text-muted-foreground">Loading your profile…</p>
        ) : (
          <TasteProfileForm
            initial={initial}
            submitLabel={exists ? "Save changes" : "Save profile"}
            submitting={submitting}
            onSubmit={save}
            error={error}
          />
        )}
      </div>
    </div>
  );
}
