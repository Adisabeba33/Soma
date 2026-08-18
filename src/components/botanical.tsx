import { cn } from "@/lib/utils";

// One botanical mark, used sparingly: hero watermark, member card, the
// privacy statement. Line-art engraving rather than dispensary clip-art —
// it should read as paper texture, never as an illustration competing with
// the text. Always decorative: aria-hidden, currentColor, low opacity set
// by the caller.
export function BotanicalSprig({ className }: { className?: string }) {
  // A fan of pointed leaflets around a single stem. Each leaflet is the
  // same path rotated, so the silhouette stays symmetric at any size.
  const leaflet = "M0 0C7 -16 7 -37 0 -54C-7 -37 -7 -16 0 0Z";
  const angles = [-58, -33, 0, 33, 58];
  const scales = [0.62, 0.85, 1, 0.85, 0.62];

  return (
    <svg
      viewBox="-70 -80 140 100"
      className={cn("h-auto w-full", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.1}
      strokeLinejoin="round"
      aria-hidden
    >
      {angles.map((a, i) => (
        <g key={a} transform={`rotate(${a}) scale(${scales[i]})`}>
          <path d={leaflet} />
          <path d="M0 -4V-46" strokeWidth={0.7} opacity={0.7} />
        </g>
      ))}
      <path d="M0 0V16" strokeLinecap="round" />
    </svg>
  );
}
