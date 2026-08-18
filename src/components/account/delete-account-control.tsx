"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

// Closing the account for good. Never one tap: the button only opens the
// confirmation, and the confirmation states exactly what is destroyed.
export function DeleteAccountControl() {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

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

  return (
    <section className="mt-6 rounded-3xl border border-danger/35 bg-danger/[0.07] p-6 sm:p-7">
      <h2 className="font-display text-xl font-semibold tracking-tight text-foreground">
        Delete your account
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Erases your account, taste profiles, shelf and reads for good. It
        can&apos;t be undone.
      </p>

      {!confirming ? (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          aria-expanded={false}
          className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-danger/40 bg-danger/10 px-5 text-sm font-medium text-danger transition-colors duration-200 ease-out hover:bg-danger/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:w-auto"
        >
          <Trash2 className="h-4 w-4" strokeWidth={1.7} aria-hidden />
          Delete account
        </button>
      ) : (
        <div className="mt-5 rounded-2xl border border-danger/40 bg-background/40 p-5">
          <p className="font-medium text-danger">
            Permanently delete your account?
          </p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            Everything above goes with it. There is no recovery.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={deleteAccount}
              disabled={deleting}
              className="inline-flex h-11 items-center rounded-xl bg-danger px-5 text-sm font-semibold text-white transition-opacity duration-200 hover:opacity-90 disabled:opacity-60"
            >
              {deleting ? "Deleting…" : "Yes, delete my account"}
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              disabled={deleting}
              className="inline-flex h-11 items-center rounded-xl border border-border px-5 text-sm font-medium text-foreground transition-colors duration-200 hover:bg-surface-hover disabled:opacity-60"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
