import { cn } from "@/lib/utils";

// A gold outline icon in a quiet tile — the leading mark on cards and
// navigation rows. Icons come from lucide (the project's one icon set) and
// are passed in as the component, so stroke weight stays uniform.
export function IconTile({
  Icon,
  size = "md",
  className,
}: {
  Icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  size?: "sm" | "md";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center rounded-xl border border-brass/25 bg-brass/10 text-brass",
        size === "sm" ? "h-9 w-9" : "h-11 w-11",
        className,
      )}
      aria-hidden
    >
      <Icon
        className={size === "sm" ? "h-[18px] w-[18px]" : "h-5 w-5"}
        strokeWidth={1.6}
      />
    </span>
  );
}
