"use client";

import { useEffect, useRef } from "react";
import { Moon, ArrowRight } from "lucide-react";

// ──────────────────────────────────────────────────────────────────────────
// DESIGN CONCEPT — "Sensory Atelier" (light)
// A bright, airy, luxe editorial direction: warm ivory, generous negative
// space, refined Fraunces display, hairline brass detailing, soft shadows,
// restrained motion. The opposite of the dark apothecary study. Standalone,
// non-wired — hardcoded sample data, no engine/auth. View at /design/atelier.
// ──────────────────────────────────────────────────────────────────────────

const ELIXIR = {
  name: "Evening Knock-Out",
  index: "Profile No. 01",
  complete: 98,
  nose: ["Gas", "Earthy", "Pine"],
  effect: ["Relaxed", "Heavy body", "Sleepy"],
};

const SPECIMENS = [
  { n: "01", name: "Galactic Runtz", origin: "Sweet Tropics", notes: "Tropical · Sweet · Berry", match: 91 },
  { n: "02", name: "Permanent Marker", origin: "Gas / Fuel", notes: "Gassy · Diesel · Earthy", match: 88 },
  { n: "03", name: "Jungle Gemz", origin: "the bridge", notes: "Citrus · Tropical · Pine", match: 87 },
];

export default function AtelierPage() {
  const rootRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const els = rootRef.current?.querySelectorAll<HTMLElement>("[data-reveal]");
    if (!els || els.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries)
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <main ref={rootRef} className="atl">
      <style>{CSS}</style>
      <div className="atl-wrap">
        {/* Masthead */}
        <header className="atl-mast" data-reveal>
          <span className="atl-eyebrow">SŌMA — Sensory Atelier</span>
          <span className="atl-mast-rule" />
          <span className="atl-eyebrow atl-dim">Nº 001</span>
        </header>

        {/* Hero */}
        <section className="atl-hero">
          <div className="atl-hero-copy">
            <p className="atl-kicker" data-reveal>
              Tonight&apos;s tasting
            </p>
            <h1 className="atl-display" data-reveal>
              What&apos;s on the
              <br />
              menu <span className="atl-ital">tonight</span>?
            </h1>
            <p className="atl-lede" data-reveal>
              <Moon className="atl-moon" strokeWidth={1.5} />
              Your palate leans dark and resinous this evening. Bring a menu —
              each one is read against your taste and ranked by what&apos;s
              worth your money.
            </p>
          </div>
          {/* Placeholder "photograph" — warm, soft, time-tinted */}
          <div className="atl-hero-art" data-reveal aria-hidden>
            <span className="atl-art-pill">Artwork coming</span>
          </div>
        </section>

        {/* Active profile */}
        <section className="atl-profile" data-reveal>
          <div className="atl-profile-top">
            <div>
              <p className="atl-label">{ELIXIR.index} · your active profile</p>
              <h2 className="atl-profile-name">{ELIXIR.name}</h2>
              <p className="atl-ital atl-profile-sub">a nightfall indica</p>
            </div>
            <Ring value={ELIXIR.complete} />
          </div>
          <div className="atl-notes">
            <Note label="Nose" items={ELIXIR.nose} />
            <Note label="Effect" items={ELIXIR.effect} />
          </div>
          <div className="atl-profile-foot">
            <a className="atl-link" href="#">
              Switch profile <ArrowRight className="atl-ar" />
            </a>
            <a className="atl-link atl-dim" href="#">
              Refine
            </a>
          </div>
        </section>

        {/* Results */}
        <section className="atl-results">
          <div className="atl-results-head" data-reveal>
            <span className="atl-eyebrow">Tonight&apos;s ranking</span>
            <span className="atl-results-rule" />
          </div>
          <ol className="atl-list">
            {SPECIMENS.map((s, i) => (
              <li
                key={s.n}
                className="atl-row"
                data-reveal
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <span className="atl-row-n">{s.n}</span>
                <div className="atl-row-body">
                  <h3 className="atl-row-name">{s.name}</h3>
                  <p className="atl-row-meta">
                    <span className="atl-ital">via {s.origin}</span>
                    <span className="atl-dot">·</span>
                    {s.notes}
                  </p>
                </div>
                <Score value={s.match} />
              </li>
            ))}
          </ol>
        </section>

        {/* CTA */}
        <section className="atl-cta" data-reveal>
          <button className="atl-btn" type="button">
            Read tonight&apos;s menu <ArrowRight className="atl-ar" />
          </button>
          <p className="atl-fine">
            A sensory reading, not a guarantee — the grower and the freshness
            still write the last line.
          </p>
        </section>

        <footer className="atl-foot" data-reveal>
          <span className="atl-wordmark">SŌMA</span>
          <span className="atl-eyebrow atl-dim">Design study · Sensory Atelier</span>
        </footer>
      </div>
    </main>
  );
}

function Ring({ value }: { value: number }) {
  const deg = Math.max(0, Math.min(100, value)) * 3.6;
  return (
    <div className="atl-ring">
      <div
        className="atl-ring-arc"
        style={{ background: `conic-gradient(var(--brass) ${deg}deg, rgba(43,38,32,0.10) ${deg}deg)` }}
      />
      <div className="atl-ring-core">
        <span className="atl-ring-num">{value}</span>
        <span className="atl-ring-cap">complete</span>
      </div>
    </div>
  );
}

function Note({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="atl-note">
      <p className="atl-note-label">{label}</p>
      <p className="atl-note-items">{items.join(" · ")}</p>
    </div>
  );
}

function Score({ value }: { value: number }) {
  return (
    <span className="atl-score">
      <span className="atl-score-num">{value}</span>
      <span className="atl-score-cap">match</span>
    </span>
  );
}

const CSS = `
.atl{
  --bg:#f7f1e5; --paper:#fffdf7; --ink:#2a2620; --muted:#6f6757; --faint:#9c9482;
  --brass:#a9803f; --brass-soft:#c79b56; --green:#2f3a2c; --hair:rgba(42,38,32,0.12);
  position:relative; min-height:100vh; background:var(--bg); color:var(--ink);
  font-family:var(--font-sans),system-ui,sans-serif;
}
.atl-wrap{ max-width:62rem; margin:0 auto; padding:0 1.5rem 6rem; }

[data-reveal]{ opacity:0; transform:translateY(16px); transition:opacity .9s cubic-bezier(.2,.7,.2,1), transform .9s cubic-bezier(.2,.7,.2,1); }
[data-reveal].in{ opacity:1; transform:none; }
@media (prefers-reduced-motion: reduce){ [data-reveal]{ opacity:1; transform:none; transition:none; } }

.atl-ital{ font-family:var(--font-display),Georgia,serif; font-style:italic; color:var(--brass); }
.atl-eyebrow{ font-size:.66rem; letter-spacing:.32em; text-transform:uppercase; color:var(--muted); white-space:nowrap; }
.atl-dim{ color:var(--faint); }

/* masthead */
.atl-mast{ display:flex; align-items:center; gap:1.25rem; padding:2.5rem 0 0; }
.atl-mast-rule{ height:1px; flex:1; background:var(--hair); }

/* hero */
.atl-hero{ display:grid; grid-template-columns:1.4fr 1fr; gap:2.5rem; align-items:center; padding:3.5rem 0 3rem; }
.atl-kicker{ font-size:.7rem; letter-spacing:.3em; text-transform:uppercase; color:var(--brass); margin-bottom:1.4rem; }
.atl-display{ font-family:var(--font-display),Georgia,serif; font-weight:500; font-size:clamp(2.6rem,7vw,4.6rem); line-height:1.0; letter-spacing:-0.015em; }
.atl-lede{ max-width:30rem; margin-top:1.9rem; color:var(--muted); font-size:1.02rem; line-height:1.7; }
.atl-moon{ display:inline-block; width:1rem; height:1rem; margin-right:.5rem; vertical-align:-1px; color:var(--brass); }
.atl-hero-art{
  position:relative; aspect-ratio:3/4; border-radius:1.5rem; overflow:hidden;
  background:
    radial-gradient(120% 90% at 80% 10%, rgba(199,155,86,0.55), transparent 60%),
    linear-gradient(155deg,#e9ddc4 0%,#d8c4a0 45%,#9fae8f 100%);
  box-shadow:0 30px 60px -34px rgba(80,64,40,0.5);
}
.atl-art-pill{ position:absolute; left:1rem; bottom:1rem; background:rgba(42,38,32,0.78); color:#f7f1e5; font-size:.6rem; letter-spacing:.18em; text-transform:uppercase; padding:.3rem .7rem; border-radius:999px; }

/* profile card */
.atl-profile{ margin-top:1rem; background:var(--paper); border:1px solid var(--hair); border-radius:1.5rem; padding:2rem 1.9rem; box-shadow:0 24px 50px -40px rgba(80,64,40,0.45); }
.atl-profile-top{ display:flex; align-items:flex-start; justify-content:space-between; gap:1.5rem; }
.atl-label{ font-size:.6rem; letter-spacing:.26em; text-transform:uppercase; color:var(--brass); }
.atl-profile-name{ font-family:var(--font-display),Georgia,serif; font-weight:600; font-size:clamp(1.7rem,4.5vw,2.2rem); line-height:1.05; margin-top:.55rem; }
.atl-profile-sub{ color:var(--faint); margin-top:.3rem; font-size:.95rem; }
.atl-notes{ display:grid; grid-template-columns:1fr 1fr; gap:1.5rem; margin-top:1.6rem; padding-top:1.5rem; border-top:1px solid var(--hair); }
.atl-note-label{ font-size:.6rem; letter-spacing:.24em; text-transform:uppercase; color:var(--muted); }
.atl-note-items{ margin-top:.45rem; font-size:1.02rem; }
.atl-profile-foot{ display:flex; align-items:center; gap:1.75rem; margin-top:1.6rem; }
.atl-link{ display:inline-flex; align-items:center; gap:.3rem; font-size:.92rem; color:var(--green); text-decoration:none; border-bottom:1px solid transparent; transition:border-color .3s; }
.atl-link:hover{ border-color:currentColor; }
.atl-ar{ width:.95rem; height:.95rem; }

/* completeness ring */
.atl-ring{ position:relative; width:5rem; height:5rem; flex:none; }
.atl-ring-arc{ position:absolute; inset:0; border-radius:50%; }
.atl-ring-core{ position:absolute; inset:5px; border-radius:50%; background:var(--paper); display:flex; flex-direction:column; align-items:center; justify-content:center; }
.atl-ring-num{ font-family:var(--font-display),Georgia,serif; font-weight:600; font-size:1.3rem; line-height:1; }
.atl-ring-cap{ font-size:.5rem; letter-spacing:.16em; text-transform:uppercase; color:var(--faint); margin-top:.2rem; }

/* results */
.atl-results{ margin-top:4rem; }
.atl-results-head{ display:flex; align-items:center; gap:1.25rem; margin-bottom:.25rem; }
.atl-results-rule{ height:1px; flex:1; background:var(--hair); }
.atl-list{ list-style:none; margin:0; padding:0; }
.atl-row{ display:flex; align-items:center; gap:1.5rem; padding:1.5rem 0; border-bottom:1px solid var(--hair); transition:padding-left .45s cubic-bezier(.2,.7,.2,1); }
.atl-row:hover{ padding-left:.5rem; }
.atl-row-n{ font-family:var(--font-display),Georgia,serif; font-style:italic; font-size:1.2rem; color:var(--brass); width:1.8rem; flex:none; }
.atl-row-body{ flex:1; min-width:0; }
.atl-row-name{ font-family:var(--font-display),Georgia,serif; font-weight:600; font-size:1.5rem; line-height:1.1; }
.atl-row-meta{ color:var(--muted); font-size:.92rem; margin-top:.4rem; }
.atl-dot{ margin:0 .5rem; color:var(--faint); }

/* score */
.atl-score{ width:3.6rem; height:3.6rem; flex:none; border-radius:50%; display:flex; flex-direction:column; align-items:center; justify-content:center; background:var(--paper); border:1px solid var(--brass); box-shadow:0 6px 16px -10px rgba(169,128,63,0.6); transition:transform .4s cubic-bezier(.2,.7,.2,1); }
.atl-row:hover .atl-score{ transform:scale(1.06); }
.atl-score-num{ font-family:var(--font-display),Georgia,serif; font-weight:600; font-size:1.15rem; line-height:1; color:var(--ink); }
.atl-score-cap{ font-size:.46rem; letter-spacing:.14em; text-transform:uppercase; color:var(--faint); margin-top:.1rem; }

/* cta */
.atl-cta{ margin-top:4rem; text-align:center; }
.atl-btn{ display:inline-flex; align-items:center; gap:.5rem; font-family:var(--font-display),Georgia,serif; font-size:1.05rem; color:#f7f1e5; background:var(--green); padding:.95rem 2.2rem; border:none; border-radius:999px; cursor:pointer; box-shadow:0 16px 36px -18px rgba(47,58,44,0.7); transition:transform .3s, box-shadow .3s; }
.atl-btn:hover{ transform:translateY(-1px); box-shadow:0 20px 40px -18px rgba(47,58,44,0.8); }
.atl-fine{ margin:1.3rem auto 0; max-width:26rem; color:var(--faint); font-size:.82rem; line-height:1.6; }

/* footer */
.atl-foot{ display:flex; align-items:baseline; justify-content:space-between; margin-top:5rem; padding-top:1.75rem; border-top:1px solid var(--hair); }
.atl-wordmark{ font-family:var(--font-display),Georgia,serif; font-weight:600; font-size:1.4rem; letter-spacing:.1em; }

@media (max-width:680px){
  .atl-hero{ grid-template-columns:1fr; gap:1.75rem; }
  .atl-hero-art{ aspect-ratio:16/10; order:-1; }
  .atl-notes{ grid-template-columns:1fr; gap:1rem; }
  .atl-profile-top{ flex-direction:column-reverse; align-items:flex-start; gap:1.25rem; }
}
`;
