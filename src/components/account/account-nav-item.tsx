import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// One row of the lounge's navigation grid. Each row opens a page; the page
// it opens carries a back control to the hub.
export function AccountNavItem({
  href,
  title,
  subtitle,
  Icon,
}: {
  href: string;
  title: string;
  subtitle: string;
  Icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
}) {
  const className = cn(
    "group flex h-full min-h-[5.5rem] flex-col justify-between rounded-2xl border border-border bg-card p-4",
    "transition-[background-color,border-color,transform] duration-200 ease-out",
    "hover:border-brass/30 hover:bg-surface-hover md:hover:-translate-y-px",
    "active:bg-surface-hover motion-reduce:transform-none",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  );

  const body = (
    <>
      <Icon className="h-5 w-5 text-brass" strokeWidth={1.6} aria-hidden />
      <div className="mt-3 flex items-end justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate font-medium leading-snug text-foreground">
            {title}
          </p>
          <p className="mt-0.5 text-[0.72rem] leading-snug text-muted-foreground">
            {subtitle}
          </p>
        </div>
        <ChevronRight
          className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-out group-hover:translate-x-0.5 motion-reduce:transform-none"
          aria-hidden
        />
      </div>
    </>
  );

  return (
    <Link href={href} className={className}>
      {body}
    </Link>
  );
}
