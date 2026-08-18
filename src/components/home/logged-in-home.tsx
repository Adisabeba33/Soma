import { HomeHero } from "@/components/home/home-hero";
import { TasteMatchCard } from "@/components/home/taste-match-card";
import { TalkToSomaCard } from "@/components/home/talk-to-soma-card";
import { BestMatchesSection } from "@/components/home/best-matches-section";
import type { TopMatch } from "@/lib/top-matches";

// A returning member's SŌMA: who they are, the one action that matters, the
// feature that isn't here yet, and their own best matches. Pure
// presentation — every value is resolved on the server and passed in.
export function LoggedInHome({
  username,
  percent,
  ready,
  topMatches,
}: {
  username: string | null;
  percent: number;
  ready: boolean;
  topMatches: TopMatch[];
}) {
  return (
    <div className="mx-auto w-full max-w-editorial px-5 pb-20 pt-10 sm:px-8 sm:pt-14">
      <HomeHero username={username} />

      {/* Two ways in. Taste Match leads at every width; Talk to SŌMA sits
          beside it on desktop and under it on phones, never above. */}
      <div className="mt-9 grid gap-5 lg:grid-cols-[1.45fr_1fr] lg:items-start">
        <TasteMatchCard percent={percent} ready={ready} />
        <TalkToSomaCard />
      </div>

      <BestMatchesSection matches={topMatches} />
    </div>
  );
}
