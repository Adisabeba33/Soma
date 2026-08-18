import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { BotanicalSprig } from "@/components/botanical";

// The first thing a returning member sees. Their name is part of the
// headline — this is their SŌMA, not a product page — and the sub-line
// states the only decision on this screen.
export function HomeHero({ username }: { username: string | null }) {
  return (
    <header className="relative overflow-hidden">
      {/* Watermark: paper texture behind the type, never a picture. */}
      <BotanicalSprig
        className="pointer-events-none absolute -right-4 -top-8 w-40 text-accent/[0.06] sm:right-0 sm:w-52"
      />
      <div className="relative">
        <SectionEyebrow>Sensory Sommelier</SectionEyebrow>
        <h1 className="mt-5 font-display text-[2.65rem] font-medium leading-[1.02] tracking-tight sm:text-5xl">
          Welcome back,
          {username ? (
            <>
              <br />
              <span className="text-accent">@{username}</span>.
            </>
          ) : (
            "."
          )}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          Two ways to find your flower.
        </p>
      </div>
    </header>
  );
}
