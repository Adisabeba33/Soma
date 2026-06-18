// Icon generator — renders the SŌMA app icon (cream squircle + Fraunces
// wordmark) to every size the app references. Fraunces is the brand display
// font (installed at /root/.fonts/Fraunces.ttf); sharp renders the SVG text
// through it. Re-run after a brand tweak: npx tsx scripts/gen-icons.ts
import sharp from "sharp";

const CREAM = "#f4efe0";
const GREEN = "#334234";

// Rounded ("any" / favicon / apple) — transparent corners, full squircle.
function rounded(fontSize: number): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect x="0" y="0" width="512" height="512" rx="116" ry="116" fill="${CREAM}"/>
  <text x="256" y="256" text-anchor="middle" dominant-baseline="central"
    font-family="Fraunces" font-weight="600" font-size="${fontSize}" letter-spacing="5"
    fill="${GREEN}">SŌMA</text>
</svg>`;
}

// Maskable — cream fills the whole canvas (no transparent corners) and the
// wordmark sits inside the 80% safe zone so the OS mask never clips it.
function maskable(fontSize: number): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect x="0" y="0" width="512" height="512" fill="${CREAM}"/>
  <text x="256" y="256" text-anchor="middle" dominant-baseline="central"
    font-family="Fraunces" font-weight="600" font-size="${fontSize}" letter-spacing="4"
    fill="${GREEN}">SŌMA</text>
</svg>`;
}

async function png(svg: string, size: number, out: string) {
  await sharp(Buffer.from(svg)).resize(size, size).png().toFile(out);
  console.log("wrote", out, `${size}x${size}`);
}

async function main() {
  const roundedSvg = rounded(150);
  const maskableSvg = maskable(120);
  // Faithful PNGs rendered through the installed Fraunces font. We do NOT ship
  // an icon.svg: browsers without Fraunces would fall back to a generic serif,
  // so the rastered PNG is the single source of truth Next.js serves.
  await png(roundedSvg, 512, "src/app/icon.png");        // browser favicon
  await png(roundedSvg, 180, "src/app/apple-icon.png");  // iOS home screen
  await png(roundedSvg, 192, "public/icon-192.png");
  await png(roundedSvg, 512, "public/icon-512.png");
  await png(maskableSvg, 512, "public/icon-maskable-512.png");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
