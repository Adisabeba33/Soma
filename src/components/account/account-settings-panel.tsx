"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

type Me = {
  username: string | null;
  email: string | null;
  emailVerified: boolean;
  createdAt: string | null;
};

// Account preferences: who you are signed in as, whether the address is
// verified, and the way out. Data controls (including deletion) live on
// Privacy & data — this page never destroys anything.
export function AccountSettingsPanel() {
  const router = useRouter();
  const [me, setMe] = useState<Me | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then(setMe)
      .catch(() => setMe(null));
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.refresh();
    router.push("/");
  }

  const memberSince = me?.createdAt
    ? new Date(me.createdAt).toLocaleDateString(undefined, {
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <section className="mt-8 rounded-3xl border border-border bg-card p-6 sm:p-7">
      <h2 className="font-display text-xl font-semibold tracking-tight">
        Your account
      </h2>

      <dl className="mt-4 divide-y divide-border text-sm">
        <Row label="Member name" value={me?.username ? `@${me.username}` : "—"} />
        <Row label="Email" value={me?.email ?? "—"} />
        <Row
          label="Verification"
          value={me?.emailVerified ? "Verified member" : "Email not verified"}
          tone={me?.emailVerified ? "brass" : "muted"}
        />
        <Row label="Member since" value={memberSince ?? "—"} />
      </dl>

      <button
        type="button"
        onClick={logout}
        className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface-hover px-5 text-sm font-medium text-foreground transition-colors duration-200 ease-out hover:border-brass/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:w-auto"
      >
        <LogOut className="h-4 w-4" strokeWidth={1.7} aria-hidden />
        Sign out
      </button>
    </section>
  );
}

function Row({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "brass" | "muted";
}) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-2 py-3 first:pt-0">
      <dt className="text-muted-foreground">{label}</dt>
      <dd
        className={
          tone === "brass"
            ? "min-w-0 truncate text-brass"
            : tone === "muted"
              ? "min-w-0 truncate text-muted-foreground"
              : "min-w-0 truncate text-foreground"
        }
      >
        {value}
      </dd>
    </div>
  );
}
