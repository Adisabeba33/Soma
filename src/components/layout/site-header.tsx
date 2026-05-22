"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/taste-match", label: "Taste Match" },
  { href: "/compare", label: "Compare" },
  { href: "/profile", label: "My Profile" },
  { href: "/saved", label: "Saved" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-editorial items-center justify-between px-5 sm:px-8">
        <Link href="/" className="group flex items-baseline gap-2">
          <span className="font-display text-2xl font-semibold tracking-tight">
            SŌMA
          </span>
          <span className="hidden text-[0.7rem] uppercase tracking-[0.22em] text-muted-foreground sm:inline">
            Sensory Sommelier
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {NAV.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
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
                <span className="hidden sm:inline">{item.label}</span>
                <span className="sm:hidden">
                  {item.label.split(" ")[0]}
                </span>
                {active && (
                  <span className="mx-3 block h-px bg-accent" aria-hidden />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
