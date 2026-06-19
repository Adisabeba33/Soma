"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { buttonClass } from "@/components/ui/button";

const inputClass =
  "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring";

function ResetInner() {
  const token = useSearchParams().get("token");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (res.ok) setDone(true);
      else setError(data.error ?? "Reset failed.");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="mx-auto max-w-md px-5 py-20 text-center">
        <h1 className="font-display text-3xl font-semibold">Password updated</h1>
        <p className="mt-4 leading-relaxed text-muted-foreground">You can sign in with your new password.</p>
        <Link href="/login" className={buttonClass("primary", "md", "mt-8")}>Sign in</Link>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="mx-auto max-w-md px-5 py-20 text-center">
        <h1 className="font-display text-3xl font-semibold">Link problem</h1>
        <p className="mt-4 leading-relaxed text-muted-foreground">This reset link is missing its token.</p>
        <Link href="/forgot-password" className={buttonClass("outline", "md", "mt-8")}>Request a new link</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-5 py-16">
      <p className="text-xs uppercase tracking-[0.24em] text-brass">Reset password</p>
      <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight">Choose a new password</h1>

      <form onSubmit={submit} className="mt-8 space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium">New password</label>
          <input
            className={inputClass}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="at least 8 characters"
            autoComplete="new-password"
          />
        </div>
        {error && (
          <p className="rounded-xl bg-[#a23b2c]/10 px-4 py-3 text-sm text-[#a23b2c]">{error}</p>
        )}
        <button type="submit" disabled={busy} className={buttonClass("primary", "lg", "w-full")}>
          {busy ? "Updating…" : "Update password"}
        </button>
      </form>
    </div>
  );
}

export default function ResetPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-md px-5 py-20 text-muted-foreground">Loading…</div>}>
      <ResetInner />
    </Suspense>
  );
}
