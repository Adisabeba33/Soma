"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Target, Archive, BookOpen, User } from "lucide-react";
import { cn } from "@/lib/utils";

// The app-shell navigation on phones. One component, two themes: it renders
// on the ivory pages and inside the private lounge, changing only its
// palette (via the data-theme token block) so the two never drift apart.
//
// Every destination is an existing route — this is navigation, not new
// surface area.
const ITEMS = [
  { href: "/", label: "Lounge", Icon: Home },
  { href: "/taste-match", label: "Match", Icon: Target },
  { href: "/collection", label: "Shelf", Icon: Archive },
  { href: "/saved", label: "Reads", Icon: BookOpen },
  { href: "/account", label: "Account", Icon: User },
];

export function MobileBottomNav({
  theme,
}: {
  /** Defaults to the private lounge palette on /account, ivory elsewhere. */
  theme?: "light" | "private";
}) {
  const pathname = usePathname();
  const resolved =
    theme ?? (pathname?.startsWith("/account") ? "private" : "light");

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  return (
    <nav
      data-theme={resolved === "private" ? "soma-private" : "soma-light"}
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur-md md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <ul className="mx-auto flex max-w-editorial items-stretch">
        {ITEMS.map(({ href, label, Icon }) => {
          const active = isActive(href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  // 44px+ touch target, whole cell tappable.
                  "flex h-[4.25rem] flex-col items-center justify-center gap-1 px-1 transition-colors duration-200 ease-out",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
                  active
                    ? "text-brass"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon
                  className="h-[22px] w-[22px]"
                  strokeWidth={active ? 2 : 1.6}
                  aria-hidden
                />
                <span
                  className={cn(
                    "text-[11px] leading-none",
                    active && "font-medium",
                  )}
                >
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
