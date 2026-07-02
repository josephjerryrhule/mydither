// scripts/dither-ink.mjs
// Pixel-perfect ink extraction: the drawing's own pixels, keyed + Bayer-dithered.
import sharp from 'sharp';
import { mkdirSync, writeFileSync } from 'node:fs';

const SRC = 'assets/001-branch-source.jpeg';
const OUT_DIR = 'public/001';
const TARGET_W = 1080;
const INK = [0x1a, 0x18, 0x17];
const PAPER_LUM = 225; // above this = pure paper
const INK_LUM = 60;    // below this = pure ink
const GATE_LO = 0.12;  // kill jpeg noise
const GATE_HI = 0.85;  // solidify stroke cores
const GAP_ROWS = 10;   // empty rows separating dot band from branch band
const MARGIN = 2;

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

// coverage alpha from luminance, then ordered dither to binary
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

// split into row bands separated by >= GAP_ROWS empty rows
const rowHasInk = Array.from({ length: H }, (_, y) => {
  for (let x = 0; x < W; x++) if (ink[y * W + x]) return true;
  return false;
});
const bands = [];
let start = -1, emptyRun = 0;
for (let y = 0; y < H; y++) {
  if (rowHasInk[y]) {
    if (start === -1) start = y;
    emptyRun = 0;
  } else if (start !== -1 && ++emptyRun >= GAP_ROWS) {
    bands.push([start, y - emptyRun]);
    start = -1;
  }
}
if (start !== -1) bands.push([start, H - 1]);
if (bands.length < 2) throw new Error(`expected dot + branch bands, got ${bands.length}`);

const bbox = (y0, y1) => {
  let minX = W, maxX = -1;
  for (let y = y0; y <= y1; y++)
    for (let x = 0; x < W; x++)
      if (ink[y * W + x]) { minX = Math.min(minX, x); maxX = Math.max(maxX, x); }
  return {
    x: Math.max(0, minX - MARGIN),
    y: Math.max(0, y0 - MARGIN),
    width: Math.min(W - 1, maxX + MARGIN) - Math.max(0, minX - MARGIN) + 1,
    height: Math.min(H - 1, y1 + MARGIN) - Math.max(0, y0 - MARGIN) + 1,
  };
};
const dotBox = bbox(...bands[0]);
const branchBox = bbox(bands[1][0], bands[bands.length - 1][1]);

const writeSprite = async (box, file) => {
  const px = Buffer.alloc(box.width * box.height * 4);
  for (let y = 0; y < box.height; y++)
    for (let x = 0; x < box.width; x++) {
      const on = ink[(box.y + y) * W + (box.x + x)];
      const o = (y * box.width + x) * 4;
      if (on) { px[o] = INK[0]; px[o + 1] = INK[1]; px[o + 2] = INK[2]; px[o + 3] = 255; }
    }
  await sharp(px, { raw: { width: box.width, height: box.height, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile(file);
};

mkdirSync(OUT_DIR, { recursive: true });
await writeSprite(dotBox, `${OUT_DIR}/dot.png`);
await writeSprite(branchBox, `${OUT_DIR}/branch.png`);
writeFileSync(
  `${OUT_DIR}/layout.json`,
  JSON.stringify({ frame: { width: W, height: H }, dot: dotBox, branch: branchBox }, null, 2),
);
console.log('frame', W, 'x', H, '| dot', JSON.stringify(dotBox), '| branch', JSON.stringify(branchBox));
