"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Blend, Check, Compass, Info, Leaf, Scale, Sparkles } from "lucide-react";
import { profileEmblem, type EmblemIcon } from "@/components/aroma-icon";
import { cn } from "@/lib/utils";

// Taste Blender — the virtual "4th profile" that mixes all three real profiles.
// Lives in the account, below the profiles. Inactive until there are 3 profiles
// with 2 merged into a pair and 1 left as the third. Two analog blending
// controls set the recipe; the active indicator makes the blend drive every
// surface (Harvest, Collection, Taste Match, dashboard).
//
// The look is a private-lounge "blending console", not a settings panel:
// a translucent ivory card on the plaster backdrop, dark-olive profile nodes
// ringed in gold around a "Your Blend" medallion, and gold metallic sliders.

// ── Theme tokens — one place to retune the whole console ────────────────
const T = {
  oliveNode: "linear-gradient(155deg, #34503e 0%, #243b2c 58%, #1c3023 100%)",
  oliveBtn: "linear-gradient(135deg, #243b2c 0%, #1d2f24 100%)",
  cream: "#f8f0e2",
  creamMedallion: "radial-gradient(120% 120% at 35% 28%, #fcf6ea 0%, #f3e8d2 60%, #ead9bb 100%)",
  goldRing: "linear-gradient(135deg, #f0dca8 0%, #c8a76a 55%, #b58f4c 100%)",
  goldThumb:
    "radial-gradient(circle at 33% 28%, #fce4bb 0%, #e6c585 38%, #c8a268 64%, #a8813f 100%)",
  goldText: "#b3873f",
  shine: "#f6d88a",
  trackOff: "#e6dcc6",
  trackFill: "linear-gradient(90deg, #3a5544 0%, #243b2c 100%)",
};

type Node = {
  id: string;
  name: string;
  primary?: boolean;
  topAromas: string[];
  topEffects: string[];
};

type State = {
  active: boolean;
  ready: boolean;
  threeWay: boolean; // 3 merged → third blends in; 2 merged → pair-only
  balance: boolean;
  lean1: number;
  lean2: number;
  profileCount: number;
  mergedCount: number;
  pair: Node[];
  third: Node | null;
};

export function TasteBlenderBlock() {
  const router = useRouter();
  const [s, setS] = useState<State | null>(null);

  async function load() {
    const d = await fetch("/api/blender")
      .then((r) => r.json())
      .catch(() => null);
    if (d) setS(d);
  }
  useEffect(() => {
    load();
  }, []);

  async function patch(body: Record<string, unknown>) {
    // Optimistic for the sliders so dragging feels instant.
    setS((prev) => (prev ? { ...prev, ...body } : prev));
    const d = await fetch("/api/blender", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then((r) => r.json())
      .catch(() => null);
    if (d?.error) {
      await load();
      return;
    }
    if (d) setS(d);
    router.refresh(); // re-score the surfaces under the new blend
  }

  if (!s) return null;

  // ── Section heading (shared across states) ────────────────────────────
  const Heading = (
    <div className="mt-16">
      <p className="flex items-center gap-1.5 text-xs uppercase tracking-[0.24em] text-brass">
        <Blend className="h-3.5 w-3.5" /> Taste Blender
      </p>
      <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-muted-foreground">
        Merge two profiles for a blend of the pair; merge a third and it splits
        evenly across all three. When on, it drives every match: Harvest,
        Collection, Taste Match.
      </p>
    </div>
  );

  if (!s.ready) {
    return (
      <section>
        {Heading}
        <div className="mt-4 rounded-[1.75rem] border border-dashed border-brass/40 bg-[hsl(42_46%_95%)]/50 px-6 py-8 text-sm leading-relaxed text-muted-foreground backdrop-blur-[2px]">
          {s.profileCount < 2 ? (
            <>
              Add a <strong className="text-foreground">second profile</strong> to
              unlock the Blender. You have {s.profileCount} of 3.
            </>
          ) : (
            <>
              <strong className="text-foreground">Merge two</strong> profiles (the
              Merge button above) to start a blend of the pair. Merge a third and
              it blends in evenly across all three.
            </>
          )}
        </div>
      </section>
    );
  }

  // The pair is ordered [primary-or-first, other]. Primary (Main) is the lean's
  // right/energized side; the other is the left/relaxed side.
  const main = s.pair.find((p) => p.primary) ?? s.pair[0];
  const other = s.pair.find((p) => p.id !== main?.id) ?? s.pair[1];
  const third = s.threeWay ? s.third : null; // null in a 2-way (pair) blend

  const MainIcon = profileEmblem(main?.topAromas ?? [], main?.topEffects ?? []);
  const OtherIcon = profileEmblem(other?.topAromas ?? [], other?.topEffects ?? []);
  const ThirdIcon = third
    ? profileEmblem(third.topAromas ?? [], third.topEffects ?? [])
    : MainIcon;

  // ── Presentation math — node + slider percentages ────────────────────
  // 2-way: the pair splits 100% by lean1 (50/50 balanced). 3-way: the third is
  // "blended in" up to a full, equal third (33%) — its share is lean2 scaled
  // onto 0–33% — and the pair splits the remainder, tilted by lean1 (−1 → all
  // "other"/relaxed, +1 → all "main"/energized).
  const thirdPct = third ? Math.round((s.lean2 ?? 0) * 33) : 0;
  const pairTotal = 100 - thirdPct;
  const mainPct = Math.round((pairTotal * (1 + s.lean1)) / 2);
  const otherPct = pairTotal - mainPct;

  const explorer = !s.balance; // Explorer = best-of; Harmony = balance/bridge

  return (
    <section>
      {Heading}

      {/* ── The blending console ─────────────────────────────────────── */}
      <div
        className="soma-lift mt-4 rounded-[2rem] p-5 sm:p-7 lg:p-8"
        style={{
          background: "rgba(248, 240, 226, 0.86)",
          border: "1px solid rgba(190, 143, 76, 0.5)",
          boxShadow:
            "0 18px 45px rgba(60, 42, 20, 0.16), inset 0 1px 0 rgba(255,255,255,0.75)",
          backdropFilter: "blur(2px)",
        }}
      >
        {/* Header + diagram. Mobile order: label → headline → diagram →
            active → CTA → subtext. Desktop: text left, diagram right. */}
        <div className="flex flex-col gap-7 lg:grid lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-10">
          {/* Headline */}
          <div className="order-1 lg:col-start-1 lg:row-start-1 lg:self-end">
            <p className="text-[11px] uppercase tracking-[0.26em] text-brass">
              Your current blend
            </p>
            <h3 className="mt-2 font-display text-[1.7rem] font-semibold leading-[1.18] tracking-tight text-foreground sm:text-[2rem]">
              {main?.name} +<br />
              {other?.name}
              {third && (
                <>
                  {" "}
                  <span className="font-normal italic text-muted-foreground">
                    blended with {third.name}
                  </span>
                </>
              )}
            </h3>
          </div>

          {/* Diagram */}
          <div className="order-2 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center">
            <BlendDiagram
              main={{ name: main?.name ?? "", pct: mainPct, Icon: MainIcon, live: s.active }}
              other={{ name: other?.name ?? "", pct: otherPct, Icon: OtherIcon, live: s.active }}
              third={
                third
                  ? { name: third.name, pct: thirdPct, Icon: ThirdIcon, live: s.active }
                  : null
              }
            />
          </div>

          {/* Active indicator + CTA + subtext */}
          <div className="order-3 lg:col-start-1 lg:row-start-2 lg:self-start">
            <ActiveIndicator active={s.active} onToggle={() => patch({ active: !s.active })} />

            <Link
              href="/taste-match"
              className="soma-ease group mt-5 inline-flex w-full items-center justify-between gap-3 rounded-2xl px-6 py-4 text-base font-medium text-[#fff8ec] transition-transform hover:-translate-y-0.5 sm:w-[88%]"
              style={{
                background: T.oliveBtn,
                boxShadow:
                  "0 10px 24px rgba(30, 50, 36, 0.24), inset 0 1px 0 rgba(255,255,255,0.14)",
              }}
            >
              Run Taste Match
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <p className="mt-3 max-w-[20rem] text-sm leading-relaxed text-muted-foreground">
              Find strains that fit your unique blend.
            </p>
          </div>
        </div>

        {/* ── Controls well — selection style + sliders ──────────────── */}
        <div
          className="mt-7 rounded-[1.5rem] p-5 sm:p-6"
          style={{
            background: "rgba(244, 235, 220, 0.6)",
            border: "1px solid rgba(190, 143, 76, 0.28)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
          }}
        >
          <p className="text-[11px] uppercase tracking-[0.24em] text-brass">
            Selection style
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <SelectionStyleCard
              Icon={Compass}
              title="Explorer"
              desc="Find the strongest picks across your blend."
              selected={explorer}
              onSelect={() => patch({ balance: false })}
            />
            <SelectionStyleCard
              Icon={Scale}
              title="Harmony"
              desc="Find strains that balance all profiles beautifully."
              selected={!explorer}
              onSelect={() => patch({ balance: true })}
            />
          </div>

          {explorer ? (
            <>
              {/* Slider 1 — lean inside the pair */}
              <div className="mt-7 border-t border-brass/15 pt-6">
                <div className="flex items-center gap-1.5">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-brass">
                    Lean within the pair
                  </p>
                  <Info className="h-3.5 w-3.5 text-brass/60" />
                </div>
                <div className="mt-3 flex items-center gap-3 sm:gap-4">
                  <NodeLabel Icon={OtherIcon} name={other?.name ?? ""} align="left" />
                  <div className="min-w-0 flex-1">
                    <PremiumSlider
                      min={-100}
                      max={100}
                      step={20}
                      value={Math.round(s.lean1 * 100)}
                      position={((s.lean1 + 1) / 2) * 100}
                      pill={s.lean1 === 0 ? "Balanced" : s.lean1 > 0 ? main?.name : other?.name}
                      onChange={(v) => patch({ lean1: v / 100 })}
                      ariaLabel={`Lean between ${other?.name} and ${main?.name}`}
                    />
                    <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
                      <span>More Relaxed</span>
                      <span>More Energized</span>
                    </div>
                  </div>
                  <NodeLabel Icon={MainIcon} name={main?.name ?? ""} align="right" />
                </div>
              </div>

              {/* Slider 2 — how much of the third profile to blend in. Only in
                  a 3-way blend (three profiles merged). */}
              {third && (
                <div className="mt-6 border-t border-brass/15 pt-6">
                  <div className="flex items-center gap-1.5">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-brass">
                      Blend in {third.name}
                    </p>
                    <Info className="h-3.5 w-3.5 text-brass/60" />
                  </div>
                  <div className="mt-3 flex items-center gap-3 sm:gap-4">
                    <NodeLabel Icon={ThirdIcon} name="A touch" align="left" muted />
                    <div className="min-w-0 flex-1">
                      <PremiumSlider
                        min={0}
                        max={100}
                        step={10}
                        value={Math.round(s.lean2 * 100)}
                        position={Math.round(s.lean2 * 100)}
                        pill={`${thirdPct}%`}
                        onChange={(v) => patch({ lean2: v / 100 })}
                        ariaLabel={`How much of ${third.name} to blend in`}
                      />
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-sm font-medium text-foreground">Full third</p>
                      <p className="text-[11px] text-muted-foreground">(33%)</p>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="mt-6 rounded-2xl bg-brass/10 px-4 py-3 text-xs leading-relaxed text-foreground">
              <span className="font-medium">Harmony weighs every profile equally.</span>{" "}
              Leans don&apos;t apply — a strain is only as good as its weakest side,
              so single-profile winners score lower. That&apos;s a stricter,
              better-balanced menu, not a worse one.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

// ── Active indicator — replaces the toggle. Tapping flips the blend on/off.
function ActiveIndicator({ active, onToggle }: { active: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={active}
      className="soma-ease group inline-flex items-center gap-2.5 rounded-full py-1 pr-1 transition-opacity"
    >
      <Sparkles
        className="h-4 w-4"
        strokeWidth={2}
        style={{ color: active ? T.goldText : "hsl(var(--muted-foreground))" }}
      />
      <span
        className={cn(
          "text-xs font-semibold uppercase tracking-[0.22em]",
          active ? "text-accent" : "text-muted-foreground",
        )}
      >
        {active ? "Blender active" : "Blender off — tap to activate"}
      </span>
      {/* Gold glowing dot */}
      <span className="relative grid h-3 w-3 place-items-center">
        {active && (
          <span
            className="soma-gold-dot absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle, ${T.shine} 0%, rgba(246,216,138,0.45) 45%, transparent 72%)`,
            }}
          />
        )}
        <span
          className="relative h-2 w-2 rounded-full"
          style={{
            background: active ? T.goldRing : "hsl(var(--border))",
            boxShadow: active ? "0 0 6px rgba(214,175,55,0.7)" : "none",
          }}
        />
      </span>
    </button>
  );
}

// ── Blend diagram — two or three nodes ringed in gold around a medallion ──
function BlendDiagram({
  main,
  other,
  third,
}: {
  main: { name: string; pct: number; Icon: EmblemIcon; live: boolean };
  other: { name: string; pct: number; Icon: EmblemIcon; live: boolean };
  third: { name: string; pct: number; Icon: EmblemIcon; live: boolean } | null;
}) {
  // 3-way → two top nodes + a bottom third; 2-way → two nodes flanking the
  // medallion. Medallion sits a touch higher in 3-way to leave room below.
  const medallion = third
    ? { left: "32%", top: "29%", width: "36%" }
    : { left: "35%", top: "31%", width: "30%" };
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[19rem] sm:max-w-[21rem]">
      {/* Connector rings — thin gold, perfume-blending feel */}
      <span
        aria-hidden
        className="absolute rounded-full"
        style={{
          left: "8%",
          top: "6%",
          width: "84%",
          height: "84%",
          border: "1px solid rgba(184,143,76,0.32)",
        }}
      />
      <span
        aria-hidden
        className="absolute rounded-full"
        style={{
          left: medallion.left,
          top: third ? "27%" : "29%",
          width: third ? "38%" : "30%",
          height: third ? "38%" : "30%",
          border: "1px solid rgba(184,143,76,0.4)",
        }}
      />

      {/* Profile nodes */}
      {third ? (
        <>
          <BlendNode {...other} style={{ left: "1%", top: "8%", width: "39%" }} />
          <BlendNode {...main} style={{ left: "60%", top: "8%", width: "39%" }} />
          <BlendNode {...third} style={{ left: "32%", top: "61%", width: "36%" }} />
        </>
      ) : (
        <>
          <BlendNode {...other} style={{ left: "-3%", top: "22%", width: "42%" }} />
          <BlendNode {...main} style={{ left: "61%", top: "22%", width: "42%" }} />
        </>
      )}

      {/* Central medallion */}
      <div
        className="absolute z-20 grid aspect-square place-items-center rounded-full p-[3px]"
        style={{ ...medallion, background: T.goldRing }}
      >
        <div
          className="relative grid h-full w-full place-items-center overflow-hidden rounded-full text-center"
          style={{
            background: T.creamMedallion,
            boxShadow:
              "inset 0 2px 5px rgba(120,92,40,0.18), inset 0 -1px 2px rgba(255,255,255,0.85)",
          }}
        >
          <Leaf
            aria-hidden
            className="absolute h-8 w-8 text-brass/15"
            strokeWidth={1.4}
          />
          <span className="relative font-display text-[0.62rem] font-semibold uppercase leading-tight tracking-[0.16em] text-brass sm:text-xs">
            Your
            <br />
            Blend
          </span>
        </div>
      </div>
    </div>
  );
}

// A single dark-olive, gold-ringed profile node.
function BlendNode({
  name,
  pct,
  Icon,
  live,
  style,
}: {
  name: string;
  pct: number;
  Icon: EmblemIcon;
  live: boolean;
  style: React.CSSProperties;
}) {
  return (
    <div className="absolute z-10" style={style}>
      <div
        className={cn("aspect-square rounded-full p-[2px]", live && "soma-node-live")}
        style={{
          background: T.goldRing,
          boxShadow:
            "0 12px 24px -10px rgba(60,42,20,0.55), 0 2px 4px -2px rgba(60,42,20,0.4)",
        }}
      >
        <div
          className="flex h-full w-full flex-col items-center justify-center rounded-full px-1.5 text-center"
          style={{
            background: T.oliveNode,
            boxShadow:
              "inset 0 2px 6px rgba(255,255,255,0.12), inset 0 -3px 8px rgba(0,0,0,0.3)",
          }}
        >
          <Icon
            className="h-[18%] min-h-[14px] w-auto"
            strokeWidth={1.9}
            style={{ color: "#ecd9a8" }}
          />
          <span className="mt-1 line-clamp-2 text-[9px] font-medium leading-[1.15] text-[#f3e9d5] sm:text-[10px]">
            {name}
          </span>
          <span
            className="mt-0.5 font-display text-xs font-semibold sm:text-sm"
            style={{ color: "#ecd9a8" }}
          >
            {pct}%
          </span>
        </div>
      </div>
    </div>
  );
}

// Small icon + name label flanking a slider.
function NodeLabel({
  Icon,
  name,
  align,
  muted,
}: {
  Icon: EmblemIcon;
  name: string;
  align: "left" | "right";
  muted?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex w-[5.5rem] shrink-0 items-center gap-1.5 sm:w-[6.5rem]",
        align === "right" && "flex-row-reverse text-right",
      )}
    >
      <Icon
        className="h-5 w-5 shrink-0"
        strokeWidth={1.85}
        style={{ color: T.goldText }}
      />
      <span
        className={cn(
          "text-xs font-medium leading-tight",
          muted ? "text-muted-foreground" : "text-foreground",
        )}
      >
        {name}
      </span>
    </div>
  );
}

// ── Selection-style option card ─────────────────────────────────────────
function SelectionStyleCard({
  Icon,
  title,
  desc,
  selected,
  onSelect,
}: {
  Icon: EmblemIcon;
  title: string;
  desc: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "soma-ease relative flex items-start gap-3 rounded-2xl border p-4 text-left transition-all",
        selected
          ? "border-brass/70 bg-[hsl(42_46%_95%)]/80 shadow-[0_8px_20px_-12px_rgba(120,92,40,0.4)]"
          : "border-brass/20 bg-transparent hover:border-brass/40",
      )}
    >
      <Icon
        className="mt-0.5 h-6 w-6 shrink-0"
        strokeWidth={1.8}
        style={{ color: selected ? T.goldText : "hsl(var(--muted-foreground))" }}
      />
      <div className="min-w-0 flex-1">
        <p className="font-display text-base font-semibold tracking-tight text-foreground">
          {title}
        </p>
        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{desc}</p>
      </div>
      {/* Selected check — small dark-green circle */}
      <span
        className={cn(
          "grid h-5 w-5 shrink-0 place-items-center rounded-full transition-all",
          selected ? "bg-accent text-accent-foreground" : "border border-brass/30",
        )}
      >
        {selected && <Check className="h-3 w-3" strokeWidth={3} />}
      </span>
    </button>
  );
}

// ── Premium slider — analog blending control with a gold bevelled thumb ──
function PremiumSlider({
  min,
  max,
  step,
  value,
  position,
  pill,
  onChange,
  ariaLabel,
}: {
  min: number;
  max: number;
  step: number;
  value: number;
  position: number; // 0–100, thumb left offset
  pill?: string;
  onChange: (v: number) => void;
  ariaLabel: string;
}) {
  const pos = Math.max(0, Math.min(100, position));
  return (
    <div className="relative h-10 select-none">
      {/* Track — unfilled */}
      <div
        className="absolute inset-x-0 top-1/2 h-[5px] -translate-y-1/2 rounded-full"
        style={{ background: T.trackOff, boxShadow: "inset 0 1px 2px rgba(120,92,40,0.18)" }}
      />
      {/* Track — filled */}
      <div
        className="absolute top-1/2 left-0 h-[5px] -translate-y-1/2 rounded-full"
        style={{ width: `${pos}%`, background: T.trackFill }}
      />
      {/* Thumb + value pill */}
      <div
        className="pointer-events-none absolute top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
        style={{ left: `${pos}%` }}
      >
        {pill && (
          <span
            className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-medium leading-none text-foreground"
            style={{
              background: T.cream,
              border: "1px solid rgba(190,143,76,0.4)",
              boxShadow: "0 4px 10px -4px rgba(120,92,40,0.4)",
            }}
          >
            {pill}
          </span>
        )}
        <span
          className="relative block h-[22px] w-[22px] rounded-full"
          style={{
            background: T.goldThumb,
            border: "1px solid rgba(150,110,52,0.65)",
            boxShadow:
              "0 4px 9px -2px rgba(90,62,20,0.55), inset 0 1px 1px rgba(255,255,255,0.7)",
          }}
        >
          <span
            aria-hidden
            className="absolute left-[28%] top-[24%] h-1.5 w-1.5 rounded-full bg-white/70 blur-[0.5px]"
          />
        </span>
      </div>
      {/* Native range overlay — drives interaction + keyboard a11y */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={ariaLabel}
        className="absolute inset-0 z-20 h-full w-full cursor-pointer opacity-0"
      />
    </div>
  );
}
