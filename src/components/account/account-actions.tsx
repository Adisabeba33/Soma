"use client";

import { LogOut, Trash2 } from "lucide-react";

// The end of the lounge: leave, or close the account for good. Deleting is
// never one tap — the button only opens the confirmation, and the confirm
// step states exactly what is destroyed.
export function AccountActions({
  onSignOut,
  onDeleteAccount,
  confirming,
  onConfirmChange,
  deleting,
  email,
  emailVerified,
}: {
  onSignOut: () => void;
  onDeleteAccount: () => void;
  confirming: boolean;
  onConfirmChange: (open: boolean) => void;
  deleting: boolean;
  email: string | null;
  emailVerified: boolean;
}) {
  return (
    <section id="settings" className="mt-8 scroll-mt-24">
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-7">
        <h2 className="font-display text-xl font-semibold tracking-tight">
          Settings &amp; account
        </h2>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border pb-2">
            <dt className="text-muted-foreground">Email</dt>
            <dd className="min-w-0 truncate text-foreground">{email ?? "—"}</dd>
          </div>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <dt className="text-muted-foreground">Verification</dt>
            <dd className={emailVerified ? "text-brass" : "text-muted-foreground"}>
              {emailVerified ? "Verified member" : "Email not verified"}
            </dd>
          </div>
        </dl>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onSignOut}
            className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-surface-hover px-5 text-sm font-medium text-foreground transition-colors duration-200 ease-out hover:border-brass/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <LogOut className="h-4 w-4" strokeWidth={1.7} aria-hidden />
            Sign out
          </button>
          <button
            type="button"
            onClick={() => onConfirmChange(true)}
            aria-expanded={confirming}
            className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-danger/40 bg-danger/10 px-5 text-sm font-medium text-danger transition-colors duration-200 ease-out hover:bg-danger/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <Trash2 className="h-4 w-4" strokeWidth={1.7} aria-hidden />
            Delete account
          </button>
        </div>

        {confirming && (
          <div className="mt-4 rounded-2xl border border-danger/40 bg-danger/10 p-5">
            <p className="font-medium text-danger">
              Permanently delete your account?
            </p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              This erases your account, taste profiles and history for good. It
              can&apos;t be undone.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={onDeleteAccount}
                disabled={deleting}
                className="inline-flex h-11 items-center rounded-xl bg-danger px-5 text-sm font-semibold text-white transition-opacity duration-200 hover:opacity-90 disabled:opacity-60"
              >
                {deleting ? "Deleting…" : "Yes, delete my account"}
              </button>
              <button
                type="button"
                onClick={() => onConfirmChange(false)}
                disabled={deleting}
                className="inline-flex h-11 items-center rounded-xl border border-border px-5 text-sm font-medium text-foreground transition-colors duration-200 hover:bg-surface-hover disabled:opacity-60"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
