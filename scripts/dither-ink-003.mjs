// scripts/dither-ink-003.mjs
// Pixel-perfect extraction for Day 003 / Bloom.
// Takes assets/003-bloom-source.jpg, applies ordered-Bayer dithering,
// and splits the drawing into:
// - flower.png (the petals at the top)
// - stem.png (the stem, leaves, and side bud at the bottom)
import sharp from 'sharp';
import { mkdirSync, writeFileSync } from 'node:fs';

const SRC = 'assets/003-bloom-source.jpg';
const OUT_DIR = 'public/003';
const TARGET_W = 1080;
const DRAW_OFFSET_Y = 420; // center in the 1080×1920 viewport
const PAPER_LUM = 240; // clean paper threshold
const INK_LUM = 80;    // clean ink threshold
const GATE_LO = 0.15;
const GATE_HI = 0.85;

// Strict bounding box to denoise margins and capture only the rosebud drawing
const CONTENT_X0 = 400;
const CONTENT_X1 = 680;
const CONTENT_Y0 = 380;
const CONTENT_Y1 = 760;
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

// Step 1: Binarize the drawing only inside the content gate
const ink = new Uint8Array(W * H);
for (let y = CONTENT_Y0; y < CONTENT_Y1; y++) {
  for (let x = CONTENT_X0; x < CONTENT_X1; x++) {
    const i = (y * W + x) * C;
    const lum = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
    let a = (PAPER_LUM - lum) / (PAPER_LUM - INK_LUM);
    a = Math.min(1, Math.max(0, a));
    if (a < GATE_LO) a = 0;
    if (a > GATE_HI) a = 1;
    ink[y * W + x] = a * 64 > BAYER8[y % 8][x % 8] + 0.5 ? 1 : 0;
  }
}

// Find ink bounding box range
let minY = H, maxY = -1;
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    if (ink[y * W + x]) {
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
}
console.log(`Ink bounding box: Y = ${minY} to ${maxY}`);

// Scan row density
const rowSpan = new Int32Array(H);
for (let y = 0; y < H; y++) {
  let minX = W, maxX = -1;
  for (let x = 0; x < W; x++) {
    if (ink[y * W + x]) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
    }
  }
  rowSpan[y] = maxX >= minX ? (maxX - minX) : 0;
}

// Valley search is performed relatively within the upper middle section of the drawing
// (e.g. between 60px and 120px below the top of the drawing) to find the flower-to-stem bottleneck
let splitY = minY + 90; // fallback split point
let minSpan = W;
const searchStart = minY + 60;
const searchEnd = minY + 120;

for (let y = searchStart; y < searchEnd; y++) {
  if (rowSpan[y] > 0 && rowSpan[y] < minSpan) {
    minSpan = rowSpan[y];
    splitY = y;
  }
}
console.log(`Determined split point between flower head and stem: Y = ${splitY} (width span = ${rowSpan[splitY]}px)`);

// Step 3: Write helper to extract bounding box and output PNG
async function saveSprite(name, filterFn) {
  let minX = W, maxX = -1, sMinY = H, sMaxY = -1;
  
  // Find bounding box for pixels matching filterFn
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (ink[y * W + x] && filterFn(x, y)) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < sMinY) sMinY = y;
        if (y > sMaxY) sMaxY = y;
      }
    }
  }

  if (maxX < minX || sMaxY < sMinY) {
    console.log(`Skipping sprite ${name} (empty)`);
    return null;
  }

  const sW = (maxX - minX + 1) + MARGIN * 2;
  const sH = (sMaxY - sMinY + 1) + MARGIN * 2;
  const sprite = new Uint8Array(sW * sH * 4); // RGBA

  for (let sy = 0; sy < sH; sy++) {
    for (let sx = 0; sx < sW; sx++) {
      const x = minX - MARGIN + sx;
      const y = sMinY - MARGIN + sy;
      const destIdx = (sy * sW + sx) * 4;

      if (x >= 0 && x < W && y >= 0 && y < H && ink[y * W + x] && filterFn(x, y)) {
        // Binary ink pixels (transparent background, solid dark ink color #1A1817)
        sprite[destIdx] = 0x1a;
        sprite[destIdx + 1] = 0x18;
        sprite[destIdx + 2] = 0x17;
        sprite[destIdx + 3] = 0xff;
      } else {
        // Transparent
        sprite[destIdx + 3] = 0x00;
      }
    }
  }

  const filename = `${OUT_DIR}/${name}.png`;
  await sharp(sprite, { raw: { width: sW, height: sH, channels: 4 } })
    .png()
    .toFile(filename);

  const relativeY = sMinY - MARGIN + DRAW_OFFSET_Y;
  const relativeX = minX - MARGIN;

  console.log(`Saved ${filename}: ${sW}×${sH} px, placement relative to 1080×1920 source: left=${relativeX}, top=${relativeY}`);
  return { width: sW, height: sH, left: relativeX, top: relativeY };
}

mkdirSync(OUT_DIR, { recursive: true });

// Extract flower (pixels above splitY) and stem (pixels at or below splitY)
const flowerMeta = await saveSprite('flower', (x, y) => y < splitY);
const stemMeta = await saveSprite('stem', (x, y) => y >= splitY);

const metadata = {
  flower: flowerMeta,
  stem: stemMeta,
};

writeFileSync(`${OUT_DIR}/drawing.json`, JSON.stringify(metadata, null, 2));
console.log(`Saved drawing metadata to ${OUT_DIR}/drawing.json`);
