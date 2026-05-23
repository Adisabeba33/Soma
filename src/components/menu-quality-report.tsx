import { AlertTriangle, CheckCircle2, FileQuestion, Layers } from "lucide-react";
import type { MenuQuality } from "@/lib/types";

export function MenuQualityReport({ quality }: { quality: MenuQuality }) {
  if (quality.totalParsed === 0) return null;
  const confidencePct = Math.round(quality.avgConfidence * 100);
  const tone =
    confidencePct >= 80 ? "high" : confidencePct >= 60 ? "medium" : "low";
  const toneClass =
    tone === "high"
      ? "text-accent"
      : tone === "medium"
        ? "text-brass"
        : "text-[#a23b2c]";

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium">Menu quality</p>
        <span className={`text-sm font-semibold tabular-nums ${toneClass}`}>
          {confidencePct}% confidence
        </span>
      </div>
      <dl className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat
          icon={<Layers className="h-3.5 w-3.5" />}
          label="Parsed"
          value={quality.totalParsed}
        />
        <Stat
          icon={<AlertTriangle className="h-3.5 w-3.5" />}
          label="Unclear"
          value={quality.unclearRows}
          tone={quality.unclearRows > 0 ? "warn" : "neutral"}
        />
        <Stat
          icon={<FileQuestion className="h-3.5 w-3.5" />}
          label="Unknown"
          value={quality.unknownStrains}
          tone={quality.unknownStrains > 0 ? "warn" : "neutral"}
        />
        <Stat
          icon={<CheckCircle2 className="h-3.5 w-3.5" />}
          label="Known"
          value={quality.totalParsed - quality.unknownStrains}
        />
      </dl>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
  tone = "neutral",
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  tone?: "neutral" | "warn";
}) {
  return (
    <div>
      <dt className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
        {icon}
        {label}
      </dt>
      <dd
        className={`mt-0.5 font-display text-2xl font-semibold tabular-nums ${
          tone === "warn" && value > 0 ? "text-brass" : "text-foreground"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}
