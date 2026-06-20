"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { buttonClass } from "@/components/ui/button";

function VerifyInner() {
  const params = useSearchParams();
  const token = params.get("token");
  const [state, setState] = useState<"pending" | "ok" | "error">("pending");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setState("error");
      setMessage("Missing verification token.");
      return;
    }
    fetch(`/api/auth/verify?token=${encodeURIComponent(token)}`)
      .then((r) => r.json().then((d) => ({ ok: r.ok, d })))
      .then(({ ok, d }) => {
        if (ok) setState("ok");
        else {
          setState("error");
          setMessage(d.error ?? "Verification failed.");
        }
      })
      .catch(() => {
        setState("error");
        setMessage("Network error. Please try again.");
      });
  }, [token]);

  return (
    <div className="mx-auto max-w-md px-5 py-20 text-center">
      {state === "pending" && <p className="text-muted-foreground">Verifying…</p>}
      {state === "ok" && (
        <>
          <h1 className="font-display text-3xl font-semibold">Email verified</h1>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Your account is ready. You can sign in now.
          </p>
          <Link href="/login" className={buttonClass("primary", "md", "mt-8")}>Sign in</Link>
        </>
      )}
      {state === "error" && (
        <>
          <h1 className="font-display text-3xl font-semibold">Link problem</h1>
          <p className="mt-4 leading-relaxed text-muted-foreground">{message}</p>
          <Link href="/login" className={buttonClass("outline", "md", "mt-8")}>Back to sign in</Link>
        </>
      )}
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-md px-5 py-20 text-muted-foreground">Loading…</div>}>
      <VerifyInner />
    </Suspense>
  );
}
