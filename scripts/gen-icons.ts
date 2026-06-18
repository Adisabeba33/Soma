// Icon generator — builds the app icon / favicon set to the brand spec.
//
// Spec (supplied): wordmark "SŌMA" in Canela SemiBold, colours bg #F4F0E6 /
// text #283128, NO shadows or borders, equal padding around the wordmark.
//
// We don't have the Canela font (commercial), but the supplied master image
// carries the real custom wordmark. So we lift the wordmark out of that master
// as an alpha mask (a duotone threshold that also erases the source shadow,
// since light greys map to nothing), recolour it to the exact spec green, and
// stamp it centred on a clean spec-cream squircle. Re-run:
//   npx tsx scripts/gen-icons.ts
import sharp from "sharp";

const SRC = "scripts/assets/soma-icon-source.png";
const GREEN = { r: 0x28, g: 0x31, b: 0x28 }; // #283128
const CREAM = { r: 0xf4, g: 0xf0, b: 0xe6 }; // #F4F0E6

async function main() {
  const { data, info } = await sharp(SRC).raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height, C = info.channels;

  // Wordmark alpha: dark pixels (the green letters) become opaque; cream, the
  // white margin and the grey shadow are all light, so they map to ~0 alpha.
  // A ramp over luminance 110→180 keeps the letters' anti-aliased edges crisp.
  const rgba = Buffer.alloc(W * H * 4);
  let minX = W, minY = H, maxX = 0, maxY = 0;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * C;
      const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      let a = (180 - lum) / (180 - 110);
      a = a < 0 ? 0 : a > 1 ? 1 : a;
      const o = (y * W + x) * 4;
      rgba[o] = GREEN.r; rgba[o + 1] = GREEN.g; rgba[o + 2] = GREEN.b;
      rgba[o + 3] = Math.round(a * 255);
      if (a > 0.4) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  const mw = maxX - minX + 1;
  const mh = maxY - minY + 1;
  console.log("wordmark bbox:", `${mw}x${mh}`);

  const wordmark = await sharp(rgba, { raw: { width: W, height: H, channels: 4 } })
    .extract({ left: minX, top: minY, width: mw, height: mh })
    .png()
    .toBuffer();

  // Compose: wordmark centred on a cream squircle with equal padding. Each
  // call sizes the wordmark to a fraction of the canvas width (≈equal margins).
  const R = 1024;
  const rx = Math.round(R * 0.225);

  async function compose(rounded: boolean, widthFrac: number, out: string, size: number) {
    const tW = Math.round(R * widthFrac);
    const tH = Math.round((tW * mh) / mw);
    const sprite = await sharp(wordmark).resize(tW, tH).png().toBuffer();
    let img = sharp({
      create: { width: R, height: R, channels: 4, background: CREAM },
    }).composite([{ input: sprite, gravity: "centre" }]);
    if (rounded) {
      const mask = Buffer.from(
        `<svg xmlns="http://www.w3.org/2000/svg" width="${R}" height="${R}"><rect width="${R}" height="${R}" rx="${rx}" ry="${rx}" fill="#fff"/></svg>`,
      );
      img = sharp(await img.png().toBuffer()).composite([
        { input: mask, blend: "dest-in" },
      ]);
    }
    await sharp(await img.png().toBuffer()).resize(size, size).png().toFile(out);
    console.log("wrote", out, `${size}x${size}`);
  }

  // Rounded squircle (transparent corners) for favicon / apple / manifest "any".
  await compose(true, 0.87, "src/app/icon.png", 512);
  await compose(true, 0.87, "src/app/apple-icon.png", 180);
  await compose(true, 0.87, "public/icon-192.png", 192);
  await compose(true, 0.87, "public/icon-512.png", 512);
  // Maskable: full-bleed cream, wordmark a touch smaller for the safe zone.
  await compose(false, 0.74, "public/icon-maskable-512.png", 512);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
