"use client";

import { useEffect, useRef } from "react";
import { Moon, Feather } from "lucide-react";

// ──────────────────────────────────────────────────────────────────────────
// DESIGN CONCEPT — "Apothecary of Rare Elixirs"
// A standalone, non-wired showcase of a high-end art direction for SŌMA:
// dark editorial, gold-foil, museum-grade typography (Fraunces), tactile
// grain, generous negative space, restrained motion. Hardcoded sample data —
// nothing here touches the real engine or auth. View at /design/apothecary.
// If this lands, we roll the language across the real screens.
// ──────────────────────────────────────────────────────────────────────────

const ELIXIR = {
  name: "Evening Knock-Out",
  index: "No. 001",
  distilled: 98,
  nose: ["Gas", "Earthy", "Pine"],
  effect: ["Relaxed", "Heavy body", "Sleepy"],
};

const SPECIMENS = [
  {
    n: "01",
    name: "Galactic Runtz",
    origin: "via Sweet Tropics",
    notes: "Tropical · Sweet · Berry",
    match: 91,
  },
  {
    n: "02",
    name: "Permanent Marker",
    origin: "via Gas / Fuel",
    notes: "Gassy · Diesel · Earthy",
    match: 88,
  },
  {
    n: "03",
    name: "Jungle Gemz",
    origin: "the bridge — all sides",
    notes: "Citrus · Tropical · Pine",
    match: 87,
  },
];

export default function ApothecaryPage() {
  const rootRef = useRef<HTMLElement>(null);

  // Reveal-on-scroll: fade + rise as each [data-reveal] enters the viewport.
  useEffect(() => {
    const els = rootRef.current?.querySelectorAll<HTMLElement>("[data-reveal]");
    if (!els || els.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.18, rootMargin: "0px 0px -10% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <main ref={rootRef} className="apo">
      <style>{CSS}</style>
      <div className="apo-grain" aria-hidden />
      <div className="apo-vignette" aria-hidden />

      <div className="apo-wrap">
        {/* ── Masthead ─────────────────────────────────────────────── */}
        <header className="apo-masthead" data-reveal>
          <span className="apo-rule" />
          <span className="apo-eyebrow">SŌMA · Apothecary of Rare Elixirs</span>
          <span className="apo-rule" />
        </header>

        {/* ── Hero ─────────────────────────────────────────────────── */}
        <section className="apo-hero">
          <p className="apo-folio" data-reveal>
            {ELIXIR.index} — Nightfall Cabinet
          </p>
          <h1 className="apo-display" data-reveal>
            What&apos;s on the
            <br />
            menu <span className="apo-foil apo-italic">tonight</span>
            <span className="apo-foil">?</span>
          </h1>
          <p className="apo-lede" data-reveal>
            <Moon className="apo-moon" strokeWidth={1.25} />
            Tonight your cabinet leans dark and resinous. Bring a menu — each
            bottle is weighed against your palate and decanted in order of
            worth.
          </p>
        </section>

        {/* ── The active elixir (profile) ──────────────────────────── */}
        <section className="apo-elixir" data-reveal>
          <div className="apo-elixir-frame">
            <div className="apo-elixir-head">
              <div>
                <p className="apo-label">Your active elixir</p>
                <h2 className="apo-elixir-name">{ELIXIR.name}</h2>
                <p className="apo-italic apo-elixir-sub">
                  a nightfall indica · decanted this evening
                </p>
              </div>
              <Gauge value={ELIXIR.distilled} />
            </div>

            <div className="apo-notes">
              <Note label="Nose" items={ELIXIR.nose} />
              <span className="apo-vrule" />
              <Note label="Effect" items={ELIXIR.effect} />
            </div>

            <div className="apo-elixir-foot">
              <a className="apo-link" href="#">
                Switch elixir →
              </a>
              <a className="apo-link apo-muted-link" href="#">
                Refine the formula
              </a>
            </div>

            <span className="apo-seal" aria-hidden>
              <Feather strokeWidth={1.1} />
            </span>
          </div>
        </section>

        {/* ── Tonight's decanting (results) ────────────────────────── */}
        <section className="apo-results">
          <div className="apo-results-head" data-reveal>
            <span className="apo-rule short" />
            <span className="apo-eyebrow">Tonight&apos;s decanting</span>
          </div>

          <ol className="apo-list">
            {SPECIMENS.map((s, i) => (
              <li
                key={s.n}
                className="apo-row"
                data-reveal
                style={{ transitionDelay: `${i * 90}ms` }}
              >
                <span className="apo-row-index apo-foil">{s.n}</span>
                <div className="apo-row-body">
                  <h3 className="apo-row-name">{s.name}</h3>
                  <p className="apo-italic apo-row-origin">{s.origin}</p>
                  <p className="apo-row-notes">{s.notes}</p>
                </div>
                <Wax value={s.match} />
              </li>
            ))}
          </ol>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────── */}
        <section className="apo-cta" data-reveal>
          <button className="apo-btn" type="button">
            Decant tonight&apos;s menu
          </button>
          <p className="apo-fineprint">
            A sensory reading, not a guarantee — the grower and the freshness
            still write the last line.
          </p>
        </section>

        <footer className="apo-foot" data-reveal>
          <span className="apo-wordmark">SŌMA</span>
          <span className="apo-foot-note">
            Design study · Apothecary of Rare Elixirs
          </span>
        </footer>
      </div>
    </main>
  );
}

// ── A thin engraved completeness gauge ──────────────────────────────────
function Gauge({ value }: { value: number }) {
  const deg = Math.max(0, Math.min(100, value)) * 3.6;
  return (
    <div className="apo-gauge">
      <div
        className="apo-gauge-ring"
        style={{
          background: `conic-gradient(var(--foil-mid) ${deg}deg, rgba(201,162,78,0.16) ${deg}deg)`,
        }}
      />
      <div className="apo-gauge-core">
        <span className="apo-gauge-num apo-foil">{value}</span>
        <span className="apo-gauge-cap">distilled</span>
      </div>
    </div>
  );
}

function Note({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="apo-note">
      <p className="apo-label">{label}</p>
      <p className="apo-note-items">{items.join(" · ")}</p>
    </div>
  );
}

// ── A gold wax-seal stamp carrying the match score ──────────────────────
function Wax({ value }: { value: number }) {
  return (
    <span className="apo-wax">
      <span className="apo-wax-inner">
        <span className="apo-wax-num">{value}</span>
        <span className="apo-wax-cap">match</span>
      </span>
    </span>
  );
}

const CSS = `
.apo{
  --bg:#0c0b08; --ink:#efe7d3; --muted:#a99f86; --dim:#7d735c;
  --foil-lo:#8a6a2c; --foil-mid:#d6b264; --foil-hi:#f7ecc6;
  --hair:rgba(201,162,78,0.22);
  position:relative; min-height:100vh; background:var(--bg); color:var(--ink);
  font-family:var(--font-sans),system-ui,sans-serif;
  overflow:hidden;
}
.apo-grain{
  position:fixed; inset:0; pointer-events:none; z-index:1; opacity:.05;
  mix-blend-mode:soft-light;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
.apo-vignette{
  position:fixed; inset:0; pointer-events:none; z-index:1;
  background:radial-gradient(120% 80% at 50% -10%, rgba(214,178,100,0.10), transparent 60%),
             radial-gradient(140% 100% at 50% 120%, rgba(0,0,0,0.6), transparent 55%);
}
.apo-wrap{ position:relative; z-index:2; max-width:60rem; margin:0 auto; padding:0 1.5rem 6rem; }

/* reveal */
[data-reveal]{ opacity:0; transform:translateY(18px); transition:opacity .9s cubic-bezier(.2,.7,.2,1), transform .9s cubic-bezier(.2,.7,.2,1); }
[data-reveal].in{ opacity:1; transform:none; }
@media (prefers-reduced-motion: reduce){ [data-reveal]{ opacity:1; transform:none; transition:none; } }

/* foil */
.apo-foil{
  background:linear-gradient(100deg,var(--foil-lo) 0%,var(--foil-mid) 22%,var(--foil-hi) 40%,var(--foil-mid) 58%,var(--foil-lo) 78%,var(--foil-hi) 100%);
  background-size:220% 100%;
  -webkit-background-clip:text; background-clip:text; color:transparent;
  animation:apo-shimmer 7s linear infinite;
}
@keyframes apo-shimmer{ to{ background-position:220% 0; } }
.apo-italic{ font-family:var(--font-display),Georgia,serif; font-style:italic; }

/* masthead */
.apo-masthead{ display:flex; align-items:center; gap:1.25rem; padding:2.75rem 0 0; }
.apo-rule{ height:1px; flex:1; background:linear-gradient(90deg,transparent,var(--hair),transparent); }
.apo-rule.short{ max-width:3rem; flex:none; width:3rem; background:linear-gradient(90deg,var(--foil-mid),transparent); }
.apo-eyebrow{ font-size:.66rem; letter-spacing:.34em; text-transform:uppercase; color:var(--muted); white-space:nowrap; }

/* hero */
.apo-hero{ padding:4.5rem 0 3.5rem; text-align:center; }
.apo-folio{ font-size:.7rem; letter-spacing:.3em; text-transform:uppercase; color:var(--dim); margin-bottom:1.75rem; }
.apo-display{
  font-family:var(--font-display),Georgia,serif; font-weight:500;
  font-size:clamp(2.7rem,9vw,5rem); line-height:.98; letter-spacing:-0.01em;
}
.apo-lede{
  max-width:34rem; margin:2rem auto 0; color:var(--muted);
  font-size:1.02rem; line-height:1.7;
}
.apo-moon{ display:inline-block; width:1.05rem; height:1.05rem; margin-right:.5rem; vertical-align:-2px; color:var(--foil-mid); }

/* elixir card */
.apo-elixir{ margin-top:2rem; }
.apo-elixir-frame{
  position:relative; border:1px solid var(--hair); border-radius:1.25rem;
  padding:2rem 1.9rem; overflow:hidden;
  background:
    radial-gradient(120% 140% at 100% 0%, rgba(214,178,100,0.08), transparent 55%),
    linear-gradient(165deg,#16130d 0%,#100d08 100%);
  box-shadow:0 1px 0 rgba(247,236,198,0.04) inset, 0 30px 60px -40px rgba(0,0,0,0.9);
}
.apo-elixir-head{ display:flex; align-items:flex-start; justify-content:space-between; gap:1.5rem; }
.apo-label{ font-size:.6rem; letter-spacing:.28em; text-transform:uppercase; color:var(--foil-mid); }
.apo-elixir-name{ font-family:var(--font-display),Georgia,serif; font-weight:600; font-size:clamp(1.7rem,5vw,2.3rem); line-height:1.05; margin-top:.55rem; }
.apo-elixir-sub{ color:var(--dim); margin-top:.4rem; font-size:.95rem; }

.apo-notes{ display:flex; align-items:stretch; gap:1.5rem; margin-top:1.75rem; padding-top:1.5rem; border-top:1px solid var(--hair); }
.apo-note{ flex:1; }
.apo-note-items{ margin-top:.5rem; font-size:1.02rem; color:var(--ink); }
.apo-vrule{ width:1px; background:linear-gradient(180deg,transparent,var(--hair),transparent); }

.apo-elixir-foot{ display:flex; align-items:center; gap:1.75rem; margin-top:1.75rem; }
.apo-link{ font-size:.92rem; color:var(--foil-mid); text-decoration:none; border-bottom:1px solid transparent; transition:border-color .3s; }
.apo-link:hover{ border-color:var(--foil-mid); }
.apo-muted-link{ color:var(--dim); }
.apo-seal{ position:absolute; right:-1.5rem; bottom:-1.5rem; width:9rem; height:9rem; display:grid; place-items:center; color:var(--foil-mid); opacity:.06; }
.apo-seal svg{ width:100%; height:100%; }

/* gauge */
.apo-gauge{ position:relative; width:5rem; height:5rem; flex:none; }
.apo-gauge-ring{ position:absolute; inset:0; border-radius:50%; }
.apo-gauge-core{ position:absolute; inset:5px; border-radius:50%; background:#100d08; display:flex; flex-direction:column; align-items:center; justify-content:center; border:1px solid var(--hair); }
.apo-gauge-num{ font-family:var(--font-display),Georgia,serif; font-weight:600; font-size:1.25rem; line-height:1; }
.apo-gauge-cap{ font-size:.5rem; letter-spacing:.18em; text-transform:uppercase; color:var(--dim); margin-top:.2rem; }

/* results */
.apo-results{ margin-top:4.5rem; }
.apo-results-head{ display:flex; align-items:center; gap:1rem; margin-bottom:.5rem; }
.apo-list{ list-style:none; margin:0; padding:0; }
.apo-row{
  display:flex; align-items:center; gap:1.4rem; padding:1.6rem 0;
  border-bottom:1px solid var(--hair); transition:padding-left .45s cubic-bezier(.2,.7,.2,1);
}
.apo-row:hover{ padding-left:.6rem; }
.apo-row-index{ font-family:var(--font-display),Georgia,serif; font-weight:600; font-size:1.6rem; width:2.2rem; flex:none; }
.apo-row-body{ flex:1; min-width:0; }
.apo-row-name{ font-family:var(--font-display),Georgia,serif; font-weight:600; font-size:1.45rem; line-height:1.1; }
.apo-row-origin{ color:var(--dim); font-size:.92rem; margin-top:.15rem; }
.apo-row-notes{ color:var(--muted); font-size:.92rem; margin-top:.5rem; letter-spacing:.01em; }

/* wax seal */
.apo-wax{
  position:relative; width:3.9rem; height:3.9rem; flex:none; border-radius:50%;
  display:grid; place-items:center;
  background:radial-gradient(circle at 35% 30%,var(--foil-hi),var(--foil-mid) 45%,var(--foil-lo) 100%);
  box-shadow:0 8px 22px -10px rgba(214,178,100,0.5), inset 0 0 0 1px rgba(247,236,198,0.5), inset 0 -6px 12px rgba(120,85,30,0.55);
  transition:transform .45s cubic-bezier(.2,.7,.2,1);
}
.apo-row:hover .apo-wax{ transform:scale(1.06) rotate(-3deg); }
.apo-wax-inner{ display:flex; flex-direction:column; align-items:center; color:#241803; }
.apo-wax-num{ font-family:var(--font-display),Georgia,serif; font-weight:600; font-size:1.2rem; line-height:1; }
.apo-wax-cap{ font-size:.46rem; letter-spacing:.16em; text-transform:uppercase; margin-top:.12rem; opacity:.75; }

/* cta */
.apo-cta{ margin-top:4.5rem; text-align:center; }
.apo-btn{
  font-family:var(--font-display),Georgia,serif; font-size:1.05rem; letter-spacing:.01em;
  color:#1a1305; padding:.95rem 2.4rem; border:none; border-radius:999px; cursor:pointer;
  background:linear-gradient(100deg,var(--foil-lo),var(--foil-mid) 40%,var(--foil-hi) 50%,var(--foil-mid) 60%,var(--foil-lo));
  background-size:200% 100%;
  box-shadow:0 14px 34px -16px rgba(214,178,100,0.6);
  transition:background-position .6s ease, transform .3s;
}
.apo-btn:hover{ background-position:100% 0; transform:translateY(-1px); }
.apo-fineprint{ margin-top:1.4rem; color:var(--dim); font-size:.82rem; max-width:26rem; margin-left:auto; margin-right:auto; line-height:1.6; }

/* footer */
.apo-foot{ display:flex; align-items:baseline; justify-content:space-between; margin-top:5rem; padding-top:1.75rem; border-top:1px solid var(--hair); }
.apo-wordmark{ font-family:var(--font-display),Georgia,serif; font-weight:600; font-size:1.4rem; letter-spacing:.12em; }
.apo-foot-note{ font-size:.66rem; letter-spacing:.24em; text-transform:uppercase; color:var(--dim); }

@media (max-width:560px){
  .apo-notes{ flex-direction:column; gap:1rem; }
  .apo-vrule{ display:none; }
  .apo-elixir-head{ flex-direction:column-reverse; align-items:flex-start; gap:1.25rem; }
}
`;
