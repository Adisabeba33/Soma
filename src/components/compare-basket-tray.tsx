"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { GitCompareArrows, X } from "lucide-react";
import {
  BASKET_EVENT,
  clearBasket,
  getBasket,
  removeFromBasket,
} from "@/lib/compare-basket";
import { cn } from "@/lib/utils";

// Floating tray that appears at the bottom-right of the catalog while
// at least one strain is queued for comparison. Compare itself accepts
// 2–5 strains, so the "Compare →" link disables outside that range and
// the helper text explains why.
export function CompareBasketTray() {
  const [basket, setBasket] = useState<string[]>([]);

  useEffect(() => {
    setBasket(getBasket());
    const handler = () => setBasket(getBasket());
    window.addEventListener(BASKET_EVENT, handler);
    return () => window.removeEventListener(BASKET_EVENT, handler);
  }, []);

  if (basket.length === 0) return null;

  const count = basket.length;
  const canCompare = count >= 2 && count <= 5;
  const helper =
    count < 2
      ? "Pick at least two."
      : count > 5
        ? "Five at most — remove some."
        : `${count} queued`;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 px-3 pb-3 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:px-0 sm:pb-0">
      <div className="mx-auto max-w-xl rounded-2xl border border-border bg-card p-3 shadow-lg sm:mx-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Compare basket
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">{helper}</p>
          </div>
          <button
            type="button"
            onClick={() => clearBasket()}
            className="shrink-0 rounded-lg px-2 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            Clear
          </button>
        </div>

        <ul className="mt-2 flex flex-wrap gap-1.5">
          {basket.map((name) => (
            <li key={name}>
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-accent/10 px-2.5 py-1 text-sm text-accent ring-1 ring-accent/30">
                {name}
                <button
                  type="button"
                  onClick={() => removeFromBasket(name)}
                  aria-label={`Remove ${name} from compare basket`}
                  className="hover:opacity-80"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            </li>
          ))}
        </ul>

        <Link
          href="/compare"
          aria-disabled={!canCompare}
          tabIndex={canCompare ? 0 : -1}
          onClick={(e) => {
            if (!canCompare) e.preventDefault();
          }}
          className={cn(
            "mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors",
            canCompare
              ? "bg-accent text-accent-foreground hover:opacity-90"
              : "cursor-not-allowed bg-accent/40 text-accent-foreground",
          )}
        >
          <GitCompareArrows className="h-4 w-4" />
          Compare
        </Link>
      </div>
    </div>
  );
}
