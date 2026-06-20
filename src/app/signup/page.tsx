"use client";

import { useState } from "react";
import Link from "next/link";
import { buttonClass } from "@/components/ui/button";

const inputClass =
  "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error ?? "Something went wrong.");
      else setDone(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="mx-auto max-w-md px-5 py-20 text-center">
        <h1 className="font-display text-3xl font-semibold">Check your email</h1>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          We sent a verification link to <strong>{email}</strong>. Confirm it to
          finish creating your account, then sign in.
        </p>
        <Link href="/login" className={buttonClass("primary", "md", "mt-8")}>
          Go to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-5 py-16">
      <p className="text-xs uppercase tracking-[0.24em] text-brass">Create account</p>
      <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight">Join SŌMA</h1>
      <p className="mt-3 leading-relaxed text-muted-foreground">
        Your taste profile and history on this device stay with you across
        devices once you have an account.
      </p>

      <form onSubmit={submit} className="mt-8 space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium">Username</label>
          <input
            className={inputClass}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="shown publicly, e.g. in feedback"
            autoComplete="username"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Email</label>
          <input
            className={inputClass}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Password</label>
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
          {busy ? "Creating…" : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="text-foreground underline underline-offset-4">
          Sign in
        </Link>
      </p>
    </div>
  );
}
