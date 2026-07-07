"use client";

import { useEffect, useState } from "react";
import { buttonClass } from "@/components/ui/button";

// Age-verification gate. SŌMA is a sensory-education resource for adults of
// legal age — this blocks the site behind a 21+ acknowledgement and states,
// up front, what SŌMA is and isn't (educational only; not a seller; not
// affiliated with any dispensary; never directs anyone where to buy).
//
// The acknowledgement is stored in localStorage under a versioned key, so the
// gate reappears if the disclaimer's substance changes (bump ACK_VERSION).
const ACK_VERSION = "1";
const ACK_KEY = "soma-age-ack";

type Status = "checking" | "gate" | "declined" | "ok";

export function AgeGate() {
  const [status, setStatus] = useState<Status>("checking");

  // Resolve stored acknowledgement on the client only (localStorage is not
  // available during SSR). Until this runs we render an opaque cover so page
  // content is never exposed before the check completes.
  useEffect(() => {
    let acked = false;
    try {
      acked = window.localStorage.getItem(ACK_KEY) === ACK_VERSION;
    } catch {
      // Private mode / storage disabled — fall through to the gate.
    }
    setStatus(acked ? "ok" : "gate");
  }, []);

  // Lock background scroll while the gate is up.
  useEffect(() => {
    if (status === "ok") return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [status]);

  if (status === "ok") return null;

  function confirm() {
    try {
      window.localStorage.setItem(ACK_KEY, ACK_VERSION);
    } catch {
      // If we can't persist, still let them through for this session.
    }
    setStatus("ok");
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[hsl(122_13%_10%)] px-5 py-10"
      role="dialog"
      aria-modal="true"
      aria-label="Age verification"
    >
      {/* While resolving stored state, show only the opaque cover — no flash
          of buttons for returning, already-verified visitors. */}
      {status !== "checking" && (
        <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-background p-7 shadow-2xl sm:p-9">
          <p className="text-center font-display text-2xl font-medium tracking-tight text-foreground">
            SŌMA
          </p>
          <p className="mt-1 text-center text-[10px] uppercase tracking-[0.28em] text-brass">
            Sensory Sommelier
          </p>

          {status === "gate" ? (
            <>
              <h1 className="mt-7 text-center font-display text-xl font-semibold tracking-tight text-foreground">
                Are you 21 or older?
              </h1>
              <p className="mt-3 text-center text-sm leading-relaxed text-muted-foreground">
                SŌMA is a sensory-education resource for adults of legal age.
                You must be 21 or older to enter.
              </p>

              <div className="mt-7 flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={confirm}
                  className={buttonClass("primary", "lg", "w-full")}
                >
                  Yes, I am 21 or older
                </button>
                <button
                  type="button"
                  onClick={() => setStatus("declined")}
                  className={buttonClass("outline", "lg", "w-full")}
                >
                  No, I am under 21
                </button>
              </div>

              <p className="mt-6 border-t border-border/60 pt-5 text-center text-[11px] leading-relaxed text-muted-foreground/80">
                SŌMA is an <strong className="font-medium text-muted-foreground">educational resource</strong>{" "}
                for the sensory qualities of cannabis — aroma, flavor and
                effect. We <strong className="font-medium text-muted-foreground">do not sell</strong> cannabis,
                are <strong className="font-medium text-muted-foreground">not affiliated</strong> with any
                dispensary or retailer, and <strong className="font-medium text-muted-foreground">do not direct
                anyone where to buy</strong>. Nothing here is medical or legal
                advice. For adults 21+ where cannabis is legal.
              </p>
            </>
          ) : (
            <>
              <h1 className="mt-7 text-center font-display text-xl font-semibold tracking-tight text-foreground">
                Come back at 21
              </h1>
              <p className="mt-3 text-center text-sm leading-relaxed text-muted-foreground">
                You must be 21 or older to use SŌMA. Please close this page.
              </p>
              <button
                type="button"
                onClick={() => setStatus("gate")}
                className={buttonClass("ghost", "sm", "mx-auto mt-6 block")}
              >
                Go back
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
