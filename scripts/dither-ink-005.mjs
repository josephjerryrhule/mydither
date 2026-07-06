// scripts/dither-ink-005.mjs
// Pixel-perfect extraction for Day 005 / Tumble.
// Splits the drawing into:
// - seed1.png (upper seed, top-left)
// - seed2.png (lower seed, center)
// - ground.png (thick horizontal soil line at bottom)
// - trail.png (faint curved air current lines)
import sharp from 'sharp';
import { mkdirSync, writeFileSync } from 'node:fs';

const SRC = 'assets/005-tumble-source.jpg';
const OUT_DIR = 'public/005';
const TARGET_W = 1080;
const DRAW_OFFSET_Y = 420;
const PAPER_LUM = 240;
const INK_LUM = 80;
const GATE_LO = 0.15;
const GATE_HI = 0.85;
const MARGIN = 4;

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

const { data, info } = await sharp(SRC)
  .resize({ width: TARGET_W, kernel: 'lanczos3' })
  .removeAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
const { width: W, height: H, channels: C } = info;

// Step 1: Binarize
const ink = new Uint8Array(W * H);
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const i = (y * W + x) * C;
    const lum = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
    let a = (PAPER_LUM - lum) / (PAPER_LUM - INK_LUM);
    a = Math.min(1, Math.max(0, a));
    if (a < GATE_LO) a = 0;
    if (a > GATE_HI) a = 1;
    ink[y * W + x] = a * 64 > BAYER8[y % 8][x % 8] + 0.5 ? 1 : 0;
  }
}

// Classifiers
function isGround(x, y) { return y > 925; }
function isSeed1(x, y) { return x >= 390 && x <= 450 && y >= 325 && y <= 380; }
function isSeed2(x, y) { return x >= 595 && x <= 655 && y >= 555 && y <= 620; }
function isTrail(x, y) { return !isGround(x, y) && !isSeed1(x, y) && !isSeed2(x, y); }

async function saveSprite(name, filterFn) {
  let minX = W, maxX = -1, minY = H, maxY = -1;

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (ink[y * W + x] && filterFn(x, y)) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (maxX < minX || maxY < minY) {
    console.log(`Skipping empty sprite: ${name}`);
    return null;
  }

  const sW = (maxX - minX + 1) + MARGIN * 2;
  const sH = (maxY - minY + 1) + MARGIN * 2;
  const sprite = new Uint8Array(sW * sH * 4);

  for (let sy = 0; sy < sH; sy++) {
    for (let sx = 0; sx < sW; sx++) {
      const x = minX - MARGIN + sx;
      const y = minY - MARGIN + sy;
      const destIdx = (sy * sW + sx) * 4;

      if (x >= 0 && x < W && y >= 0 && y < H && ink[y * W + x] && filterFn(x, y)) {
        sprite[destIdx] = 0x1a;
        sprite[destIdx + 1] = 0x18;
        sprite[destIdx + 2] = 0x17;
        sprite[destIdx + 3] = 0xff;
      } else {
        sprite[destIdx + 3] = 0x00;
      }
    }
  }

  const filename = `${OUT_DIR}/${name}.png`;
  await sharp(sprite, { raw: { width: sW, height: sH, channels: 4 } })
    .png()
    .toFile(filename);

  const relativeY = minY - MARGIN + DRAW_OFFSET_Y;
  const relativeX = minX - MARGIN;

  console.log(`Saved ${filename}: ${sW}x${sH} px, left=${relativeX}, top=${relativeY}`);
  return { width: sW, height: sH, left: relativeX, top: relativeY };
}

mkdirSync(OUT_DIR, { recursive: true });

const seed1Meta = await saveSprite('seed1', isSeed1);
const seed2Meta = await saveSprite('seed2', isSeed2);
const groundMeta = await saveSprite('ground', isGround);
const trailMeta = await saveSprite('trail', isTrail);

const metadata = {
  seed1: seed1Meta,
  seed2: seed2Meta,
  ground: groundMeta,
  trail: trailMeta,
};

writeFileSync(`${OUT_DIR}/drawing.json`, JSON.stringify(metadata, null, 2));
console.log(`Saved drawing metadata to ${OUT_DIR}/drawing.json`);
