import { cn } from "@/lib/utils";

export function ScoreBar({
  label,
  value,
  barClass,
}: {
  label: string;
  value: number;
  barClass?: string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium tabular-nums">{value}%</span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            "h-full origin-left rounded-full animate-grow",
            barClass ?? "bg-accent",
          )}
          style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        />
      </div>
    </div>
  );
}
