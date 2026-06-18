// Icon generator — builds the app icon / favicon set to the brand spec, with
// glyph-level refinements applied to the wordmark lifted from the master.
//
// Spec: wordmark "SŌMA" (Canela SemiBold), bg #F4F0E6 / text #283128, no
// shadow, equal padding. We don't have the font, so the wordmark is lifted
// from scripts/assets/soma-icon-source.png as a duotone alpha mask (which also
// drops the master's shadow). On top of that we:
//   - tighten the inter-letter gaps (GAP_SCALE),
//   - thicken the macron over Ō (downward dilation in the top band, where only
//     the macron has ink),
//   - render the wordmark larger (WIDTH_FRAC).
// Re-run: npx tsx scripts/gen-icons.ts
import sharp from "sharp";

const SRC = "scripts/assets/soma-icon-source.png";
const GREEN = { r: 0x28, g: 0x31, b: 0x28 }; // #283128
const CREAM = { r: 0xf4, g: 0xf0, b: 0xe6 }; // #F4F0E6

const GAP_SCALE = 0.45;   // inter-letter gap multiplier (tighter spacing)
const MACRON_GROW = 3;    // px the macron bar is thickened downward
const MACRON_BAND = 16;   // top rows that contain only the macron
const WIDTH_FRAC = 0.93;  // wordmark width as a fraction of the rounded canvas
const MASK_FRAC = 0.80;   // wordmark width fraction on the maskable canvas

// Lift the wordmark as a green-on-transparent alpha sprite, with the macron
// thickened and the letters re-spaced tighter. Returns the raw RGBA sprite.
async function buildWordmark() {
  const { data, info } = await sharp(SRC).raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height, C = info.channels;

  // Duotone alpha over the whole master.
  const A = new Float32Array(W * H);
  let minX = W, minY = H, maxX = 0, maxY = 0;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * C;
      const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      let a = (180 - lum) / (180 - 110);
      a = a < 0 ? 0 : a > 1 ? 1 : a;
      A[y * W + x] = a;
      if (a > 0.4) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  const bw = maxX - minX + 1;
  const bh = maxY - minY + 1;
  const at = (lx: number, ly: number) => A[(minY + ly) * W + (minX + lx)];

  // Thicken the macron: in the top band (only the Ō macron has ink there),
  // pull each pixel down from up to MACRON_GROW rows above — grows the bar's
  // lower edge without moving its top or touching the caps below.
  const A2 = new Float32Array(bw * bh);
  for (let ly = 0; ly < bh; ly++) {
    for (let lx = 0; lx < bw; lx++) {
      let v = at(lx, ly);
      if (ly < MACRON_BAND) {
        for (let k = 1; k <= MACRON_GROW; k++) {
          if (ly - k >= 0) v = Math.max(v, at(lx, ly - k));
        }
      }
      A2[ly * bw + lx] = v;
    }
  }

  // Column profile → glyph runs (S, Ō, M, A) separated by blank gaps.
  const col = new Float32Array(bw);
  for (let x = 0; x < bw; x++) {
    let s = 0;
    for (let y = 0; y < bh; y++) s += A2[y * bw + x];
    col[x] = s;
  }
  const maxCol = Math.max(...col);
  const runs: [number, number][] = [];
  let on = false, start = 0;
  for (let x = 0; x < bw; x++) {
    const ink = col[x] > maxCol * 0.02;
    if (ink && !on) { on = true; start = x; }
    if (!ink && on) { on = false; runs.push([start, x - 1]); }
  }
  if (on) runs.push([start, bw - 1]);

  // Re-spaced sprite width: glyph widths + scaled gaps.
  let newW = 0;
  for (const [l, r] of runs) newW += r - l + 1;
  for (let i = 1; i < runs.length; i++) {
    const gap = runs[i][0] - runs[i - 1][1] - 1;
    newW += Math.round(gap * GAP_SCALE);
  }

  const rgba = Buffer.alloc(newW * bh * 4);
  let cx = 0;
  for (let i = 0; i < runs.length; i++) {
    const [l, r] = runs[i];
    for (let ly = 0; ly < bh; ly++) {
      for (let lx = l; lx <= r; lx++) {
        const o = (ly * newW + cx + (lx - l)) * 4;
        rgba[o] = GREEN.r; rgba[o + 1] = GREEN.g; rgba[o + 2] = GREEN.b;
        rgba[o + 3] = Math.round(A2[ly * bw + lx] * 255);
      }
    }
    cx += r - l + 1;
    if (i < runs.length - 1) {
      const gap = runs[i + 1][0] - runs[i][1] - 1;
      cx += Math.round(gap * GAP_SCALE);
    }
  }
  console.log("wordmark:", `${newW}x${bh}`, "glyphs", runs.length);
  return { buf: rgba, w: newW, h: bh };
}

async function main() {
  const wm = await buildWordmark();
  const R = 1024;
  const rx = Math.round(R * 0.225);

  async function compose(rounded: boolean, widthFrac: number, out: string, size: number) {
    const tW = Math.round(R * widthFrac);
    const tH = Math.round((tW * wm.h) / wm.w);
    const sprite = await sharp(wm.buf, { raw: { width: wm.w, height: wm.h, channels: 4 } })
      .resize(tW, tH)
      .png()
      .toBuffer();
    let img = sharp({
      create: { width: R, height: R, channels: 4, background: CREAM },
    }).composite([{ input: sprite, gravity: "centre" }]);
    if (rounded) {
      const mask = Buffer.from(
        `<svg xmlns="http://www.w3.org/2000/svg" width="${R}" height="${R}"><rect width="${R}" height="${R}" rx="${rx}" ry="${rx}" fill="#fff"/></svg>`,
      );
      img = sharp(await img.png().toBuffer()).composite([{ input: mask, blend: "dest-in" }]);
    }
    await sharp(await img.png().toBuffer()).resize(size, size).png().toFile(out);
    console.log("wrote", out, `${size}x${size}`);
  }

  await compose(true, WIDTH_FRAC, "src/app/icon.png", 512);
  await compose(true, WIDTH_FRAC, "src/app/apple-icon.png", 180);
  await compose(true, WIDTH_FRAC, "public/icon-192.png", 192);
  await compose(true, WIDTH_FRAC, "public/icon-512.png", 512);
  await compose(false, MASK_FRAC, "public/icon-maskable-512.png", 512);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
