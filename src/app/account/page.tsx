"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, ChevronRight } from "lucide-react";
import { buttonClass } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ProfileProgressRing,
  ProfileMissingList,
} from "@/components/profile-progress";
import {
  profileCompleteness,
  type ProfileCompleteness,
} from "@/lib/profile-completeness";
import type { TasteProfileInput } from "@/lib/types";

type Me = {
  registered: boolean;
  username: string | null;
  email: string | null;
  emailVerified: boolean;
};

export default function AccountPage() {
  const router = useRouter();
  const [me, setMe] = useState<Me | null>(null);
  const [completeness, setCompleteness] = useState<ProfileCompleteness | null>(
    null,
  );

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then(setMe)
      .catch(() => setMe(null));
    fetch("/api/profile")
      .then((r) => r.json())
      .then((d) =>
        setCompleteness(
          d?.profile
            ? profileCompleteness(d.profile as TasteProfileInput)
            : null,
        ),
      )
      .catch(() => {});
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.refresh();
    router.push("/");
  }

  if (!me) {
    return <div className="mx-auto max-w-md px-5 py-20 text-muted-foreground">Loading…</div>;
  }

  if (!me.registered) {
    return (
      <div className="mx-auto max-w-md px-5 py-16">
        <h1 className="font-display text-4xl font-semibold tracking-tight">Your account</h1>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          You're browsing anonymously — your taste profile and history are saved
          on this device. Create an account to keep them across devices and pick
          a public username.
        </p>
        <div className="mt-8 flex gap-3">
          <Link href="/signup" className={buttonClass("primary", "md")}>Create account</Link>
          <Link href="/login" className={buttonClass("outline", "md")}>Sign in</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-5 py-16">
      <p className="text-xs uppercase tracking-[0.24em] text-brass">Account</p>
      <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight">
        @{me.username}
      </h1>

      <Card className="mt-8 divide-y divide-border">
        <div className="flex items-center justify-between p-5">
          <span className="text-sm text-muted-foreground">Username</span>
          <span className="font-medium">@{me.username}</span>
        </div>
        <div className="flex items-center justify-between p-5">
          <span className="text-sm text-muted-foreground">Email</span>
          <span className="font-medium">{me.email}</span>
        </div>
        <div className="flex items-center justify-between p-5">
          <span className="text-sm text-muted-foreground">Email status</span>
          {me.emailVerified ? (
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-accent">
              <Check size={15} /> Verified
            </span>
          ) : (
            <span className="text-sm font-medium text-brass">Not verified</span>
          )}
        </div>
      </Card>

      {/* Sensory Profile lives inside the account. One profile for now;
          saving more (e.g. a morning vs evening profile) comes later. */}
      <p className="mt-10 text-xs uppercase tracking-[0.24em] text-brass">
        Sensory Profile
      </p>
      <Link
        href="/profile"
        className="mt-3 flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-accent/40"
      >
        <ProfileProgressRing percent={completeness?.percent ?? 0} size={64} />
        <div className="min-w-0 flex-1">
          {completeness?.isComplete ? (
            <span className="font-display text-lg font-semibold tracking-tight text-accent">
              Profile complete
            </span>
          ) : (
            <span className="font-display text-lg font-semibold tracking-tight">
              {completeness?.percent ?? 0}% complete
            </span>
          )}
          <p className="mt-0.5 text-sm text-muted-foreground">
            {completeness?.isComplete
              ? "SŌMA has the full picture of your taste."
              : "Tap to edit — a fuller profile sharpens every match."}
          </p>
        </div>
        <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
      </Link>
      {completeness && !completeness.isComplete && (
        <ProfileMissingList
          missing={completeness.missing.slice(0, 3)}
          className="mt-3 px-1"
        />
      )}

      <button onClick={logout} className={buttonClass("outline", "md", "mt-8")}>
        Sign out
      </button>
    </div>
  );
}
