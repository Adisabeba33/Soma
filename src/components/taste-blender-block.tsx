"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Blend, Compass, Scale, Sparkles } from "lucide-react";
import { profileEmblem, type EmblemIcon } from "@/components/aroma-icon";
import { cn } from "@/lib/utils";

// Taste Blender — the virtual "4th profile" that mixes all three real profiles.
// A private-lounge "blending instrument": dark-olive profile circles ringed in
// gold around a cream "Your Blend" medallion, with the two recipe controls
// drawn as gold ARCS embedded in the diagram itself — the top arc leans the
// pair, the lower arc doses the third — so dragging a knob and watching the
// percentages change happen in the same glance, no scrolling. One compact
// panel: diagram + controls + Explorer/Harmony + Run Taste Match.

// ── Theme tokens — one place to retune the whole console ────────────────
const T = {
  oliveNode: "linear-gradient(157deg, #2f4a39 0%, #1c3a2a 58%, #12301f 100%)",
  oliveBtn: "linear-gradient(135deg, #1c4130 0%, #103927 100%)",
  cream: "#fbf5e8",
  creamMedallion: "radial-gradient(120% 120% at 35% 28%, #fdf8ec 0%, #f5ebd6 58%, #ecdcbd 100%)",
  goldRing: "linear-gradient(135deg, #f0dca8 0%, #c8a76a 55%, #b58f4c 100%)",
  goldSolid: "#c7a25a",
  goldDeep: "#b98b3e",
  goldText: "#b3873f",
  shine: "#f6d88a",
  ink: "#1f1b16",
  muted: "#7e7467",
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
  threeWay: boolean;
  balance: boolean;
  mode: "explorer" | "signature" | "harmony";
  lean1: number;
  lean2: number;
  profileCount: number;
  mergedCount: number;
  pair: Node[];
  third: Node | null;
};

export function TasteBlenderBlock() {
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
    // Optimistic so dragging the arcs feels instant.
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
    // No router.refresh() — the blend persists via PATCH and other surfaces
    // re-read it on navigation; refreshing per drag hammered the server.
  }

  if (!s) return null;

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

  // Defensive: never throw from this sibling of the profile list.
  if (!Array.isArray(s.pair) || s.pair.length < 2) return null;

  const main = s.pair.find((p) => p.primary) ?? s.pair[0];
  const other = s.pair.find((p) => p.id !== main?.id) ?? s.pair[1];
  const third = s.threeWay ? s.third : null;

  const MainIcon = profileEmblem(main?.topAromas ?? [], main?.topEffects ?? []);
  const OtherIcon = profileEmblem(other?.topAromas ?? [], other?.topEffects ?? []);
  const ThirdIcon = third
    ? profileEmblem(third.topAromas ?? [], third.topEffects ?? [])
    : MainIcon;

  // ── Live percentages ────────────────────────────────────────────────
  // Third's share on a 0–33% ("full equal third") scale; the pair splits the
  // remainder by lean1 (−1 → all "other"/relaxed, +1 → all "main"/energized).
  const thirdPct = third ? Math.round((s.lean2 ?? 0) * 33) : 0;
  const pairTotal = 100 - thirdPct;
  const mainPct = Math.round((pairTotal * (1 + s.lean1)) / 2);
  const otherPct = pairTotal - mainPct;

  const mode: "explorer" | "signature" | "harmony" =
    s.mode ?? (s.balance ? "harmony" : "explorer");
  const explorer = mode === "explorer";
  const signature = mode === "signature";
  // Explorer and Signature both use the leans (best-of tilt / target dose);
  // Harmony ignores them (weakest-side bridge), so the arcs go quiet there.
  const leansActive = mode !== "harmony";

  return (
    <section>
      {Heading}

      {/* One compact ivory panel: status → diagram+arc controls → toggle → CTA */}
      <div
        className="soma-lift mx-auto mt-4 max-w-[26rem] rounded-[28px] p-5 sm:p-6"
        style={{
          background: "rgba(251, 245, 232, 0.9)",
          border: "1px solid rgba(190, 155, 90, 0.28)",
          boxShadow:
            "0 16px 40px rgba(34, 25, 10, 0.1), inset 0 1px 0 rgba(255,255,255,0.7)",
          backdropFilter: "blur(2px)",
        }}
      >
        <ActiveIndicator active={s.active} onToggle={() => patch({ active: !s.active })} />

        <BlendArcDiagram
          main={{ name: main?.name ?? "", pct: mainPct, Icon: MainIcon }}
          other={{ name: other?.name ?? "", pct: otherPct, Icon: OtherIcon }}
          third={third ? { name: third.name, pct: thirdPct, Icon: ThirdIcon } : null}
          live={s.active}
          lean1={s.lean1}
          lean2={s.lean2}
          explorer={leansActive}
          onLean1={(v) => patch({ lean1: v })}
          onLean2={(v) => patch({ lean2: v })}
        />

        {signature && (
          <p className="mt-1 rounded-2xl bg-brass/10 px-4 py-2.5 text-xs leading-relaxed text-foreground">
            <span className="font-medium">Signature composes one taste from your recipe.</span>{" "}
            The leans set each note&apos;s dose — a light touch stays light, overpowering picks sink.
          </p>
        )}
        {mode === "harmony" && (
          <p className="mt-1 rounded-2xl bg-brass/10 px-4 py-2.5 text-xs leading-relaxed text-foreground">
            <span className="font-medium">Harmony weighs every profile equally.</span>{" "}
            Leans don&apos;t apply — a strain is only as good as its weakest side.
          </p>
        )}

        {/* Explorer / Signature / Harmony — compact segmented control */}
        <SelectionToggle mode={mode} onMode={(m) => patch({ mode: m })} />

        {/* CTA */}
        <Link
          href="/taste-match"
          className="soma-ease group mt-4 flex w-full items-center justify-between gap-3 rounded-[18px] px-6 text-[1.05rem] font-medium text-[#fff8ec] transition-transform hover:-translate-y-0.5"
          style={{
            height: 60,
            background: T.oliveBtn,
            boxShadow:
              "0 12px 28px rgba(16, 40, 30, 0.28), inset 0 1px 0 rgba(255,255,255,0.14)",
          }}
        >
          Run Taste Match
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
        </Link>
        <p className="mt-2.5 hidden text-center text-sm text-muted-foreground [@media(min-height:760px)]:block">
          Find strains that fit your unique blend.
        </p>
      </div>
    </section>
  );
}

// ── Active indicator — compact status; tapping flips the blend on/off. ────
function ActiveIndicator({ active, onToggle }: { active: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={active}
      className="soma-ease group inline-flex items-center gap-2.5 rounded-full py-0.5"
    >
      <Sparkles
        className="h-4 w-4"
        strokeWidth={2}
        style={{ color: active ? T.goldText : "hsl(var(--muted-foreground))" }}
      />
      <span
        className={cn(
          "text-[13px] font-semibold uppercase tracking-[0.18em]",
          active ? "text-accent" : "text-muted-foreground",
        )}
      >
        {active ? "Blender active" : "Blender off — tap on"}
      </span>
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

// ── Geometry ─────────────────────────────────────────────────────────────
const VBW = 340;
const VBH = 506;
const C = {
  other: { cx: 70, cy: 185, r: 56 }, // left  — relaxed
  main: { cx: 270, cy: 185, r: 56 }, // right — energized
  center: { cx: 170, cy: 242, r: 52 },
  third: { cx: 170, cy: 364, r: 56 },
  topArc: { cx: 170, cy: 250, r: 175, a0: 224, a1: 316 }, // knob a = 224 + t*92
  botArc: { cx: 170, cy: 326, r: 104, a0: 44, a1: 136 }, //  knob a = 136 − t*92
};

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
const polar = (cx: number, cy: number, r: number, deg: number) => {
  const a = (deg * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
};
// Minor arc from a0 to a1 (clockwise, increasing angle in screen coords).
const describeArc = (cx: number, cy: number, r: number, a0: number, a1: number) => {
  const s = polar(cx, cy, r, a0);
  const e = polar(cx, cy, r, a1);
  const diff = ((a1 - a0) % 360 + 360) % 360;
  const large = diff > 180 ? 1 : 0;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
};

// ── The blend diagram with two embedded arc sliders ──────────────────────
function BlendArcDiagram({
  main,
  other,
  third,
  live,
  lean1,
  lean2,
  explorer,
  onLean1,
  onLean2,
}: {
  main: { name: string; pct: number; Icon: EmblemIcon };
  other: { name: string; pct: number; Icon: EmblemIcon };
  third: { name: string; pct: number; Icon: EmblemIcon } | null;
  live: boolean;
  lean1: number;
  lean2: number;
  explorer: boolean;
  onLean1: (v: number) => void;
  onLean2: (v: number) => void;
}) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  // drag holds a mapper from an on-screen angle to the control's new value.
  const [drag, setDrag] = useState<null | {
    center: { x: number; y: number };
    apply: (angle: number) => void;
  }>(null);

  useEffect(() => {
    if (!drag) return;
    const toVb = (clientX: number, clientY: number) => {
      const el = svgRef.current;
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      return {
        x: ((clientX - rect.left) / rect.width) * VBW,
        y: ((clientY - rect.top) / rect.height) * VBH,
      };
    };
    const move = (e: PointerEvent) => {
      const p = toVb(e.clientX, e.clientY);
      if (!p) return;
      const deg = (Math.atan2(p.y - drag.center.y, p.x - drag.center.x) * 180) / Math.PI;
      drag.apply((deg + 360) % 360);
    };
    const up = () => setDrag(null);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, [drag]);

  // Knob positions from current values.
  const t1 = clamp01((lean1 + 1) / 2);
  const topAng = C.topArc.a0 + t1 * (C.topArc.a1 - C.topArc.a0);
  const topKnob = polar(C.topArc.cx, C.topArc.cy, C.topArc.r, topAng);

  const t2 = clamp01(lean2);
  const botAng = C.botArc.a1 - t2 * (C.botArc.a1 - C.botArc.a0); // 140 → 40
  const botKnob = polar(C.botArc.cx, C.botArc.cy, C.botArc.r, botAng);

  const startTopDrag = () =>
    setDrag({
      center: { x: C.topArc.cx, y: C.topArc.cy },
      apply: (a) => {
        const v = clamp01((a - C.topArc.a0) / (C.topArc.a1 - C.topArc.a0));
        onLean1(v * 2 - 1);
      },
    });
  const startBotDrag = () =>
    setDrag({
      center: { x: C.botArc.cx, y: C.botArc.cy },
      apply: (a) => {
        const v = clamp01((C.botArc.a1 - a) / (C.botArc.a1 - C.botArc.a0));
        onLean2(v);
      },
    });

  const pct = (n: number) => `${n}%`;

  return (
    <div className="relative mx-auto mt-2 w-full select-none" style={{ maxWidth: 360 }}>
      {/* padding-bottom box → reliable height = width × (478/340); the layers
          below are absolutely positioned within it. */}
      <div className="relative w-full" style={{ paddingBottom: `${(VBH / VBW) * 100}%` }}>
      {/* Back layer — faint connector rings */}
      <svg
        viewBox={`0 0 ${VBW} ${VBH}`}
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden
      >
        <circle
          cx={C.center.cx}
          cy={C.center.cy}
          r={118}
          fill="none"
          stroke="rgba(184,143,76,0.22)"
          strokeWidth={1}
          strokeDasharray="2 6"
        />
        <circle
          cx={C.center.cx}
          cy={C.center.cy}
          r={C.center.r + 10}
          fill="none"
          stroke="rgba(184,143,76,0.3)"
          strokeWidth={1}
        />
      </svg>

      {/* Circles (HTML for easy icon + text) */}
      <Circle spec={C.other} live={live} node={other} />
      <Circle spec={C.main} live={live} node={main} />
      {third && <Circle spec={C.third} live={live} node={third} />}
      <Circle spec={C.center} center live={live} />

      {/* Front layer — arcs, knobs, bubbles, labels (interactive) */}
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VBW} ${VBH}`}
        className="absolute inset-0 h-full w-full"
        style={{ pointerEvents: "none", overflow: "visible" }}
      >
        <defs>
          <radialGradient id="soma-knob" cx="34%" cy="28%" r="75%">
            <stop offset="0%" stopColor="#fce4bb" />
            <stop offset="42%" stopColor="#e6c585" />
            <stop offset="72%" stopColor="#c8a268" />
            <stop offset="100%" stopColor="#a8813f" />
          </radialGradient>
        </defs>

        {/* ── Top arc: Lean within the pair ── */}
        <text
          x={C.topArc.cx}
          y={16}
          textAnchor="middle"
          fontSize={11}
          letterSpacing={1.6}
          style={{ fontFamily: "var(--font-sans)" }}
          fill={T.goldText}
          fontWeight={600}
        >
          LEAN WITHIN THE PAIR
        </text>
        <path
          d={describeArc(C.topArc.cx, C.topArc.cy, C.topArc.r, C.topArc.a0, C.topArc.a1)}
          fill="none"
          stroke={T.goldSolid}
          strokeOpacity={0.32}
          strokeWidth={3}
          strokeLinecap="round"
        />
        {explorer && (
          <path
            d={describeArc(C.topArc.cx, C.topArc.cy, C.topArc.r, C.topArc.a0, topAng)}
            fill="none"
            stroke={T.goldDeep}
            strokeWidth={3}
            strokeLinecap="round"
          />
        )}
        <text x={66} y={124} textAnchor="middle" fontSize={10} fill={T.muted} style={{ fontFamily: "var(--font-sans)" }}>
          More relaxed
        </text>
        <text x={274} y={124} textAnchor="middle" fontSize={10} fill={T.muted} style={{ fontFamily: "var(--font-sans)" }}>
          More energized
        </text>
        {explorer && (
          <Knob
            x={topKnob.x}
            y={topKnob.y}
            bubble={pct(other.pct)}
            bubbleAbove
            onDown={startTopDrag}
          />
        )}

        {/* ── Bottom arc: Blend in the third ── */}
        {third && (
          <>
            <path
              d={describeArc(C.botArc.cx, C.botArc.cy, C.botArc.r, C.botArc.a0, C.botArc.a1)}
              fill="none"
              stroke={T.goldSolid}
              strokeOpacity={0.32}
              strokeWidth={3}
              strokeLinecap="round"
            />
            {explorer && (
              <path
                d={describeArc(C.botArc.cx, C.botArc.cy, C.botArc.r, botAng, C.botArc.a1)}
                fill="none"
                stroke={T.goldDeep}
                strokeWidth={3}
                strokeLinecap="round"
              />
            )}
            <text x={52} y={406} textAnchor="middle" fontSize={11} fill={T.muted} style={{ fontFamily: "var(--font-sans)" }}>
              A touch
            </text>
            <text x={288} y={406} textAnchor="middle" fontSize={11} fill={T.muted} style={{ fontFamily: "var(--font-sans)" }}>
              Full third
            </text>
            <text
              x={C.botArc.cx}
              y={496}
              textAnchor="middle"
              fontSize={11}
              letterSpacing={1.6}
              fill={T.goldText}
              fontWeight={600}
              style={{ fontFamily: "var(--font-sans)" }}
            >
              BLEND IN {third.name.toUpperCase()}
            </text>
            {explorer && (
              <Knob
                x={botKnob.x}
                y={botKnob.y}
                bubble={pct(third.pct)}
                onDown={startBotDrag}
              />
            )}
          </>
        )}
      </svg>
      </div>
    </div>
  );
}

// A draggable gold knob with a value bubble and a generous invisible hit area.
function Knob({
  x,
  y,
  bubble,
  bubbleAbove,
  onDown,
}: {
  x: number;
  y: number;
  bubble: string;
  bubbleAbove?: boolean;
  onDown: () => void;
}) {
  const by = bubbleAbove ? y - 27 : y + 27;
  return (
    <g>
      {/* value bubble */}
      <g style={{ pointerEvents: "none" }}>
        <rect
          x={x - 22}
          y={by - 12}
          width={44}
          height={24}
          rx={12}
          fill={T.cream}
          stroke="rgba(190,143,76,0.45)"
        />
        <text
          x={x}
          y={by + 1}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={12.5}
          fontWeight={600}
          fill={T.ink}
          style={{ fontFamily: "var(--font-sans)" }}
        >
          {bubble}
        </text>
      </g>
      {/* invisible 44px hit area */}
      <circle
        cx={x}
        cy={y}
        r={22}
        fill="transparent"
        style={{ pointerEvents: "auto", cursor: "grab", touchAction: "none" }}
        onPointerDown={(e) => {
          e.preventDefault();
          onDown();
        }}
      />
      {/* visible knob */}
      <circle cx={x} cy={y} r={11} fill="url(#soma-knob)" stroke="rgba(150,110,52,0.7)" style={{ pointerEvents: "none" }} />
      <circle cx={x - 3} cy={y - 3.5} r={2.4} fill="rgba(255,255,255,0.7)" style={{ pointerEvents: "none" }} />
    </g>
  );
}

// A profile circle (green node) or the cream centre medallion, placed by the
// geometry spec (coords in the 340×478 viewBox, mapped to % of the container).
function Circle({
  spec,
  node,
  center,
  live,
}: {
  spec: { cx: number; cy: number; r: number };
  node?: { name: string; pct: number; Icon: EmblemIcon };
  center?: boolean;
  live?: boolean;
}) {
  // Position by the top-left corner (cx−r, cy−r) rather than centre + translate,
  // so the `soma-node-live` breathe animation (which sets `transform: scale`)
  // can't override the centring transform and knock the circle off its mark.
  const style: React.CSSProperties = {
    left: `${((spec.cx - spec.r) / VBW) * 100}%`,
    top: `${((spec.cy - spec.r) / VBH) * 100}%`,
    width: `${((spec.r * 2) / VBW) * 100}%`,
  };
  if (center) {
    return (
      <div
        className={cn("absolute z-20 aspect-square rounded-full p-[2px]", live && "soma-blend-pulse")}
        style={{ ...style, background: T.goldRing }}
      >
        <div
          className="grid h-full w-full place-items-center rounded-full text-center"
          style={{
            background: T.creamMedallion,
            boxShadow: "inset 0 2px 6px rgba(120,92,40,0.16), inset 0 -1px 2px rgba(255,255,255,0.85)",
          }}
        >
          <span className="font-display text-[0.72rem] font-semibold uppercase leading-[1.15] tracking-[0.16em]" style={{ color: T.goldText }}>
            Your
            <br />
            Blend
          </span>
        </div>
      </div>
    );
  }
  const { Icon } = node!;
  return (
    <div
      className={cn("absolute z-[11] aspect-square rounded-full p-[2px]", live && "soma-node-live")}
      style={{
        ...style,
        background: T.goldRing,
        boxShadow: "0 12px 24px -10px rgba(30,42,26,0.6), 0 2px 4px -2px rgba(30,42,26,0.4)",
      }}
    >
      <div
        className="flex h-full w-full flex-col items-center justify-center rounded-full px-2 text-center"
        style={{
          background: T.oliveNode,
          boxShadow: "inset 0 2px 6px rgba(255,255,255,0.1), inset 0 -4px 10px rgba(0,0,0,0.32)",
        }}
      >
        <Icon className="h-[20%] min-h-[16px] w-auto" strokeWidth={1.9} style={{ color: "#ecd9a8" }} />
        <span className="mt-1 line-clamp-2 text-[11px] font-medium leading-[1.15] text-[#f3e9d5]">
          {node!.name}
        </span>
        <span className="mt-0.5 font-display text-lg font-semibold leading-none" style={{ color: "#ecd9a8" }}>
          {node!.pct}%
        </span>
      </div>
    </div>
  );
}

// ── Explorer / Signature / Harmony — compact segmented pill ──────────────
function SelectionToggle({
  mode,
  onMode,
}: {
  mode: "explorer" | "signature" | "harmony";
  onMode: (m: "explorer" | "signature" | "harmony") => void;
}) {
  return (
    <div
      className="mt-4 grid grid-cols-3 gap-1 rounded-[22px] p-1"
      style={{ border: "1px solid rgba(190,155,90,0.25)", background: "rgba(244,235,220,0.5)" }}
    >
      <Segment Icon={Compass} title="Explorer" sub="Strongest" selected={mode === "explorer"} onClick={() => onMode("explorer")} />
      <Segment Icon={Blend} title="Signature" sub="Your recipe" selected={mode === "signature"} onClick={() => onMode("signature")} />
      <Segment Icon={Scale} title="Harmony" sub="Bridge" selected={mode === "harmony"} onClick={() => onMode("harmony")} />
    </div>
  );
}

function Segment({
  Icon,
  title,
  sub,
  selected,
  onClick,
}: {
  Icon: EmblemIcon;
  title: string;
  sub: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "soma-ease flex flex-col items-center justify-center gap-1 rounded-[18px] px-2 py-2 text-center transition-all",
        selected ? "shadow-[0_4px_12px_-6px_rgba(120,92,40,0.4)]" : "",
      )}
      style={
        selected
          ? { background: "rgba(255,250,238,0.9)", border: "1px solid rgba(190,143,76,0.5)" }
          : { border: "1px solid transparent" }
      }
    >
      <Icon
        className="h-5 w-5 shrink-0"
        strokeWidth={1.8}
        style={{ color: selected ? T.goldText : "rgba(31,27,22,0.4)" }}
      />
      <span className="min-w-0">
        <span
          className={cn("block font-display text-[13.5px] font-semibold leading-tight", selected ? "text-foreground" : "text-[rgba(31,27,22,0.5)]")}
        >
          {title}
        </span>
        <span className="block text-[10.5px] leading-tight [@media(max-height:760px)]:hidden" style={{ color: selected ? T.muted : "rgba(31,27,22,0.4)" }}>
          {sub}
        </span>
      </span>
    </button>
  );
}
