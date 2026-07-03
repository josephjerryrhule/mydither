// scripts/dither-label.mts
// Dithered text sprites for 001: the gallery placard + the hidden secret glyph.
// Same recipe as dither-ink: rasterize an SVG, key luminance→alpha, ordered 8x8
// Bayer to binary, emit a binary RGBA sprite. Dither at final display resolution;
// NEVER resize after dithering.
import sharp from 'sharp';
import { mkdirSync, writeFileSync } from 'node:fs';
import { META } from '../src/days/001-branch/meta';

const OUT_DIR = 'public/001';
const PAPER_LUM = 225; // above this = pure paper (transparent)
const INK_LUM = 60;    // below this = pure mark
const GATE_LO = 0.12;  // kill antialias fringe
const GATE_HI = 0.85;  // solidify glyph cores
const INK = [0x1a, 0x18, 0x17];   // gallery-label ink
// The secret is no longer a colored ghost sprite. It is emitted as a pure alpha
// mask (opaque glyph, transparent field) and CSS-masks a coarse dither patch at
// runtime — the letter is made of the living dots themselves, no color anomaly.

const BAYER8 = [
  [0, 32, 8, 40, 2, 34, 10, 42],
  [48, 16, 56, 24, 50, 18, 58, 26],
  [12, 44, 4, 36, 14, 46, 6, 38],
  [60, 28, 52, 20, 62, 30, 54, 22],
  [3, 35, 11, 43, 1, 33, 9, 41],
  [51, 19, 59, 27, 49, 17, 57, 25],
  [15, 47, 7, 39, 13, 45, 5, 37],
  [63, 31, 55, 23, 61, 29, 53, 21],
];

const escapeXml = (s: string) =>
  s.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

// Rasterize SVG at its native px size, dither to a binary sprite tinted `color`.
const ditherSvg = async (
  svg: string,
  color: number[],
  pngPath: string,
  jsonPath: string,
) => {
  const { data, info } = await sharp(Buffer.from(svg))
    .flatten({ background: '#ffffff' })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = info;

  const px = Buffer.alloc(W * H * 4);
  let on = 0;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * C;
      const lum = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
      let a = (PAPER_LUM - lum) / (PAPER_LUM - INK_LUM);
      a = Math.min(1, Math.max(0, a));
      if (a < GATE_LO) a = 0;
      if (a > GATE_HI) a = 1;
      if (a * 64 > BAYER8[y % 8][x % 8] + 0.5) {
        const o = (y * W + x) * 4;
        px[o] = color[0];
        px[o + 1] = color[1];
        px[o + 2] = color[2];
        px[o + 3] = 255;
        on++;
      }
    }
  }

  if (on === 0) {
    throw new Error(
      `${pngPath}: 0 lit pixels — SVG text likely failed to rasterize (font resolution). BLOCKED.`,
    );
  }

  await sharp(px, { raw: { width: W, height: H, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile(pngPath);
  writeFileSync(jsonPath, JSON.stringify({ width: W, height: H }, null, 2));
  return { W, H, on };
};

// Rasterize SVG to a pure alpha mask: opaque where the glyph is, transparent
// elsewhere. No Bayer, no color — the coverage becomes the CSS mask alpha and
// the dots come from the shader patch underneath. Anti-aliased edges are fine.
const rasterizeMask = async (svg: string, pngPath: string, jsonPath: string) => {
  const { data, info } = await sharp(Buffer.from(svg))
    .flatten({ background: '#ffffff' })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = info;

  const px = Buffer.alloc(W * H * 4);
  let on = 0;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * C;
      const lum = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
      let a = (255 - lum) / 255; // dark glyph → opaque; white field → transparent
      a = Math.min(1, Math.max(0, a));
      const o = (y * W + x) * 4;
      px[o] = 255;
      px[o + 1] = 255;
      px[o + 2] = 255;
      px[o + 3] = Math.round(a * 255);
      if (a > 0.5) on++;
    }
  }

  if (on === 0) {
    throw new Error(
      `${pngPath}: 0 opaque pixels — SVG text likely failed to rasterize (font resolution). BLOCKED.`,
    );
  }

  await sharp(px, { raw: { width: W, height: H, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile(pngPath);
  writeFileSync(jsonPath, JSON.stringify({ width: W, height: H }, null, 2));
  return { W, H, on };
};

mkdirSync(OUT_DIR, { recursive: true });

// 1. Gallery placard — two lines of chunky monospace, ink on paper.
const FONT = `'Courier New', Courier, monospace`;
const LABEL_W = 640;
const LABEL_H = 76;
const labelSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${LABEL_W}" height="${LABEL_H}" viewBox="0 0 ${LABEL_W} ${LABEL_H}">
  <rect width="${LABEL_W}" height="${LABEL_H}" fill="#ffffff"/>
  <g font-family="${FONT}" fill="#000000">
    <text x="0" y="22" font-size="21" font-weight="bold" letter-spacing="2">${escapeXml(META.title.toUpperCase())}</text>
    <text x="0" y="56" font-size="17">${escapeXml(META.message)}</text>
  </g>
</svg>`;

// 2. Secret glyph — one big bold character centered, emitted as an alpha mask.
const S = META.secret.sizePx;
const glyphSize = Math.round(S * 0.85);
const secretSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}">
  <rect width="${S}" height="${S}" fill="#ffffff"/>
  <text x="${S / 2}" y="${S / 2}" font-family="${FONT}" font-size="${glyphSize}" font-weight="bold" text-anchor="middle" dominant-baseline="central" fill="#000000">${escapeXml(META.secret.char)}</text>
</svg>`;

const label = await ditherSvg(labelSvg, INK, `${OUT_DIR}/label.png`, `${OUT_DIR}/label.json`);
const secret = await rasterizeMask(secretSvg, `${OUT_DIR}/secret.png`, `${OUT_DIR}/secret.json`);

console.log(
  `label ${label.W}x${label.H} (${label.on} ink px) | secret mask '${META.secret.char}' ${secret.W}x${secret.H} (${secret.on} opaque px)`,
);
