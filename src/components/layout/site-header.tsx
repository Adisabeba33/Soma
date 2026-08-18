"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Lock, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

// The nav adapts to who's here. Registered users get "Account" (their sensory
// profile lives inside it); anonymous, cookie-only visitors get a plain
// "Sensory Profile" — and never see an Account button, since they have none.
const BASE_NAV = [
  { href: "/taste-match", label: "Taste Match" },
  // Compare lives on the dashboard tab bar, not the top nav.
  { href: "/catalog", label: "Harvest" },
];
const TAIL_NAV = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/learn", label: "Learn" },
  // "Saved" became "History" and now lives inside the Account page.
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  // Default to the anonymous view (the common case) until /api/auth/me answers.
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setRegistered(Boolean(d?.registered)))
      .catch(() => {});
  }, [pathname]); // re-check after auth navigations (login / logout)

  // Inside the private lounge the header switches to the graphite/gold
  // palette and swaps the public descriptor for the PRIVATE mark, so the
  // chrome belongs to the page it sits on.
  const isPrivate = Boolean(pathname?.startsWith("/account"));

  const identity = registered
    ? { href: "/account", label: "Account" }
    : { href: "/profile", label: "Sensory Profile" };
  const nav = [...BASE_NAV, identity, ...TAIL_NAV];

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      data-theme={isPrivate ? "soma-private" : undefined}
      className={cn(
        "sticky top-0 z-40 border-b border-border",
        isPrivate ? "bg-background" : "bg-background/70 backdrop-blur-md",
      )}
    >
      <div className="relative mx-auto flex h-[70px] max-w-editorial items-center justify-between px-5 sm:h-[76px] sm:px-8">
        <div className="flex items-center gap-3">
        <Link
          href="/"
          className="group flex items-center gap-3"
          onClick={() => setOpen(false)}
        >
          <span
            className={cn(
              "font-display text-[1.6rem] font-semibold leading-none tracking-[0.09em]",
              isPrivate && "text-brass",
            )}
          >
            SŌMA
          </span>
          {/* Desktop: tagline rides next to the wordmark. */}
          {!isPrivate && (
            <span className="hidden items-center gap-2 md:flex">
              <svg
                width="28"
                height="8"
                viewBox="0 0 28 8"
                className="text-brass/80"
                aria-hidden
              >
                <line x1="0" y1="4" x2="9" y2="4" stroke="currentColor" strokeWidth="1" opacity="0.45" />
                <path d="M14 1 L17 4 L14 7 L11 4 Z" fill="currentColor" />
                <line x1="19" y1="4" x2="28" y2="4" stroke="currentColor" strokeWidth="1" opacity="0.45" />
              </svg>
              <span className="whitespace-nowrap text-[0.7rem] uppercase tracking-[0.22em] text-brass">
                Sensory Sommelier
              </span>
            </span>
          )}
        </Link>
        {/* Desktop: the mark sits beside the wordmark, clear of the nav. */}
        {isPrivate && (
          <span className="hidden md:inline-flex">
            <PrivateBadge />
          </span>
        )}
        </div>

        {/* Centre slot: the public descriptor, or the lounge's PRIVATE mark. */}
        {isPrivate ? (
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:hidden">
            <PrivateBadge />
          </span>
        ) : (
          <span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[0.6rem] uppercase tracking-[0.2em] text-brass md:hidden">
            Sensory Sommelier
          </span>
        )}

        {/* Desktop nav — inline once there's room (md+). */}
        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm transition-colors",
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {item.label}
                {active && (
                  <span
                    className={cn(
                      "mx-3 block h-px",
                      isPrivate ? "bg-brass" : "bg-accent",
                    )}
                    aria-hidden
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Mobile toggle — collapses the nav so it never overflows the row. */}
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className="-mr-2 grid h-11 w-11 place-items-center rounded-lg text-foreground transition-colors hover:bg-muted md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile dropdown — full-width vertical list, closes on selection. */}
      {open && (
        <nav className="border-t border-border bg-background/95 backdrop-blur-md md:hidden">
          <div className="mx-auto max-w-editorial px-3 py-2">
            {nav.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "block rounded-lg px-4 py-3 text-[0.95rem] transition-colors",
                    active
                      ? "bg-muted font-medium text-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}

// Small outlined gold pill: this page is yours and nobody else sees it.
function PrivateBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-brass/45 px-3 py-1 text-[0.6rem] font-medium uppercase tracking-[0.2em] text-brass">
      <Lock className="h-3 w-3" strokeWidth={2} aria-hidden />
      Private
    </span>
  );
}
