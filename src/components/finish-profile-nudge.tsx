"use client";

// The gentle, persistent "finish your profile for a sharper match" bar. Shows
// app-wide while a person has STARTED but not nearly-finished their profile
// (0 < percent <= NUDGE_HIDE_AT). Past 90% the profile is essentially done, so
// we stop nudging to avoid nagging. Honest framing — a fuller profile narrows
// the target and breaks ties; we never promise a fabricated accuracy multiplier.
//
// Deliberately quiet: a slim strip, dismissible for the session (remembered in
// localStorage), and hidden on the entry/auth/onboarding screens where it would
// just be noise. It re-derives completeness from the live /api/profile read, so
// it disappears the moment the profile hits 100%.
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, X } from "lucide-react";
import { profileCompleteness } from "@/lib/profile-completeness";
import type { TasteProfileInput } from "@/lib/types";

const DISMISS_KEY = "soma_nudge_dismissed";
// Above this the profile is "done enough" — the nudge stops showing.
const NUDGE_HIDE_AT = 90;

// Routes that are themselves about onboarding / auth / the greeting — a nudge
// there is redundant or distracting.
const HIDDEN_PREFIXES = [
  "/onboarding",
  "/login",
  "/signup",
  "/verify",
  "/reset",
  "/forgot-password",
];

export function FinishProfileNudge() {
  const pathname = usePathname();
  const [percent, setPercent] = useState<number | null>(null);
  const [nextHint, setNextHint] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(true); // assume hidden until checked

  useEffect(() => {
    setDismissed(sessionStorage.getItem(DISMISS_KEY) === "1");
    let active = true;
    fetch("/api/profile")
      .then((r) => r.json())
      .then((d) => {
        if (!active || !d?.profile) return;
        const c = profileCompleteness(d.profile as TasteProfileInput);
        setPercent(c.percent);
        setNextHint(c.nextHint?.label ?? null);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [pathname]); // re-check after navigation (e.g. just saved more of the form)

  const onHidden =
    pathname === "/" || HIDDEN_PREFIXES.some((p) => pathname.startsWith(p));

  // At 91%+ the profile is essentially complete — stop following the user.
  if (
    onHidden ||
    dismissed ||
    percent === null ||
    percent <= 0 ||
    percent > NUDGE_HIDE_AT
  ) {
    return null;
  }

  return (
    <div className="border-b border-brass/20 bg-brass/5">
      <div className="mx-auto flex max-w-editorial items-center gap-3 px-5 py-2 sm:px-8">
        <span className="text-xs font-semibold tabular-nums text-brass">
          {percent}%
        </span>
        <p className="flex-1 truncate text-sm text-foreground">
          Your taste profile is {percent}% complete
          {nextHint ? (
            <span className="text-muted-foreground"> — add {nextHint.toLowerCase()} for a sharper match.</span>
          ) : (
            <span className="text-muted-foreground"> — finish it for a sharper match.</span>
          )}
        </p>
        <Link
          href="/profile"
          className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-brass hover:underline"
        >
          Finish
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
        <button
          type="button"
          aria-label="Dismiss"
          onClick={() => {
            sessionStorage.setItem(DISMISS_KEY, "1");
            setDismissed(true);
          }}
          className="shrink-0 rounded p-1 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
