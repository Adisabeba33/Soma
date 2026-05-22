import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "outline" | "accent" | "muted";

const VARIANTS: Record<BadgeVariant, string> = {
  default: "bg-foreground text-background",
  outline: "border border-border text-muted-foreground",
  accent: "bg-accent/10 text-accent",
  muted: "bg-muted text-muted-foreground",
};

export function Badge({
  variant = "default",
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        VARIANTS[variant],
        className,
      )}
      {...props}
    />
  );
}
