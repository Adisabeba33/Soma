"use client";

import { useLayoutEffect, useEffect, useRef, useState } from "react";

// Run before paint on the client (so the fitted size shows with no flash),
// but fall back to a no-op on the server to avoid the SSR useLayoutEffect
// warning.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

// Shrinks the text's font size just enough to keep it on a single line within
// its container, down to a floor. Measures the real rendered width, so it
// adapts to the actual card width at every breakpoint (the grid is narrower
// on mobile than on desktop). Re-fits on container resize and after the
// display web-font finishes loading.
export function FitText({
  text,
  maxPx,
  minPx = 11,
  className,
}: {
  text: string;
  maxPx: number;
  minPx?: number;
  className?: string;
}) {
  const boxRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [px, setPx] = useState(maxPx);

  useIsomorphicLayoutEffect(() => {
    const box = boxRef.current;
    const t = textRef.current;
    if (!box || !t) return;

    const fit = () => {
      const avail = box.clientWidth;
      if (!avail) return;
      t.style.fontSize = `${maxPx}px`;
      const full = t.scrollWidth;
      // Width scales ~linearly with font size, so one pass gets us there.
      // floor() under-shoots slightly, guaranteeing a fit.
      const next =
        full > avail ? Math.max(minPx, Math.floor((maxPx * avail) / full)) : maxPx;
      t.style.fontSize = `${next}px`;
      setPx(next);
    };

    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(box);
    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
    fonts?.ready?.then(fit).catch(() => {});
    return () => ro.disconnect();
  }, [text, maxPx, minPx]);

  return (
    <span ref={boxRef} className={className} style={{ display: "block" }}>
      <span
        ref={textRef}
        style={{ display: "inline-block", whiteSpace: "nowrap", fontSize: px }}
      >
        {text}
      </span>
    </span>
  );
}
