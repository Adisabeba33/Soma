"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, ChevronRight, History } from "lucide-react";
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
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

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

  async function deleteAccount() {
    setDeleting(true);
    try {
      await fetch("/api/auth/delete-account", { method: "POST" });
      router.refresh();
      router.push("/");
    } catch {
      setDeleting(false);
    }
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

      {/* History — past Taste Match runs and bookmarked picks. */}
      <p className="mt-10 text-xs uppercase tracking-[0.24em] text-brass">
        History
      </p>
      <Link
        href="/saved"
        className="mt-3 flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-accent/40"
      >
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brass/10 text-brass">
          <History className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <span className="font-display text-lg font-semibold tracking-tight">
            Your reads
          </span>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Past Taste Match runs and the picks you bookmarked.
          </p>
        </div>
        <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
      </Link>

      <button onClick={logout} className={buttonClass("outline", "md", "mt-8")}>
        Sign out
      </button>

      {/* Danger zone — permanent account deletion with a confirm step. */}
      <div className="mt-12 border-t border-border pt-8">
        {!confirmDelete ? (
          <button
            onClick={() => setConfirmDelete(true)}
            className="text-sm font-medium text-[#a23b2c] hover:underline"
          >
            Delete account
          </button>
        ) : (
          <div className="rounded-2xl border border-[#a23b2c]/30 bg-[#a23b2c]/5 p-5">
            <p className="text-sm font-medium text-[#a23b2c]">
              Permanently delete your account?
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              This erases your account, taste profiles and history for good. It
              can&apos;t be undone.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={deleteAccount}
                disabled={deleting}
                className="inline-flex items-center rounded-xl bg-[#a23b2c] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#8f3326] disabled:opacity-60"
              >
                {deleting ? "Deleting…" : "Yes, delete my account"}
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                disabled={deleting}
                className="inline-flex items-center rounded-xl border border-border px-4 py-2.5 text-sm font-medium hover:bg-card disabled:opacity-60"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
