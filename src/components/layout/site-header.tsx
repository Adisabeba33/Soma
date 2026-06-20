"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

// The nav adapts to who's here. Registered users get "Account" (their sensory
// profile lives inside it); anonymous, cookie-only visitors get a plain
// "Sensory Profile" — and never see an Account button, since they have none.
const BASE_NAV = [
  { href: "/taste-match", label: "Taste Match" },
  { href: "/compare", label: "Compare" },
  { href: "/catalog", label: "Catalog" },
];
const TAIL_NAV = [
  { href: "/saved", label: "Saved" },
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

  const identity = registered
    ? { href: "/account", label: "Account" }
    : { href: "/profile", label: "Sensory Profile" };
  const nav = [...BASE_NAV, identity, ...TAIL_NAV];

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/60 backdrop-blur-md">
      <div className="relative mx-auto flex h-16 max-w-editorial items-center justify-between px-5 sm:px-8">
        <Link
          href="/"
          className="group flex items-center gap-2.5"
          onClick={() => setOpen(false)}
        >
          <span className="font-display text-2xl font-semibold leading-none tracking-[0.08em]">
            SŌMA
          </span>
          {/* Desktop: tagline rides next to the wordmark. */}
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
        </Link>

        {/* Mobile: tagline centred between the wordmark and the menu button,
            in brand gold. pointer-events-none so it never blocks a tap. */}
        <span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[0.6rem] uppercase tracking-[0.2em] text-brass md:hidden">
          Sensory Sommelier
        </span>

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
                  <span className="mx-3 block h-px bg-accent" aria-hidden />
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
          className="-mr-2 rounded-lg p-2 text-foreground transition-colors hover:bg-card md:hidden"
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
                      ? "bg-card font-medium text-foreground"
                      : "text-muted-foreground hover:bg-card hover:text-foreground",
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
