"use client";

import { useState } from "react";
import Link from "next/link";
import { buttonClass } from "@/components/ui/button";

const inputClass =
  "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setDone(true);
    } catch {
      setDone(true); // never reveal anything; treat as sent
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="mx-auto max-w-md px-5 py-20 text-center">
        <h1 className="font-display text-3xl font-semibold">Check your email</h1>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          If an account exists for <strong>{email}</strong>, we sent a link to
          reset the password. It expires in 1 hour.
        </p>
        <Link href="/login" className={buttonClass("outline", "md", "mt-8")}>Back to sign in</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-5 py-16">
      <p className="text-xs uppercase tracking-[0.24em] text-brass">Reset password</p>
      <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight">Forgot password</h1>
      <p className="mt-3 leading-relaxed text-muted-foreground">
        Enter your email and we'll send a link to choose a new password.
      </p>

      <form onSubmit={submit} className="mt-8 space-y-4">
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
        <button type="submit" disabled={busy} className={buttonClass("primary", "lg", "w-full")}>
          {busy ? "Sending…" : "Send reset link"}
        </button>
      </form>

      <p className="mt-6 text-sm text-muted-foreground">
        <Link href="/login" className="text-foreground underline underline-offset-4">Back to sign in</Link>
      </p>
    </div>
  );
}
