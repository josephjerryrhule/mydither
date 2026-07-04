// scripts/dither-ink-002.mjs
// Pixel-perfect extraction for 002 / reflection. The drawing's own pixels,
// keyed + ordered-Bayer dithered, split into line / dot / reflection sprites.
// Cuts are DERIVED from structure (line = the wide rows; dot = the centered
// blob riding the line; reflection = the narrow trail below), not hand-placed.
// The dot's columns are punched out of the line sprite so the dot can drop into
// the gap and seat seamlessly (ink over ink) on landing.
import sharp from 'sharp';
import { mkdirSync, writeFileSync } from 'node:fs';

const SRC = 'assets/002-reflection-source.jpg';
const OUT_DIR = 'public/002';
const TARGET_W = 1080;
const DRAW_OFFSET_Y = 420; // center the 1080×1080 drawing in the 1080×1920 source frame
const INK = [0x1a, 0x18, 0x17];
const PAPER_LUM = 225;
const INK_LUM = 60;
const GATE_LO = 0.12;
const GATE_HI = 0.85;
const CONTENT_Y0 = 480;     // denoise: ignore stray specks above the drawing mass
const LINE_MIN_SPAN = 300;  // a "line row" spans at least this many px wide
const DOT_PAD = 6;          // widen the punched dot column band by this many px each side
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

// luminance key → ordered dither → binary ink mask (denoised above CONTENT_Y0)
const ink = new Uint8Array(W * H);
for (let y = CONTENT_Y0; y < H; y++) {
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

// per-row min/max x
const rowLo = new Int32Array(H).fill(W);
const rowHi = new Int32Array(H).fill(-1);
for (let y = 0; y < H; y++)
  for (let x = 0; x < W; x++)
    if (ink[y * W + x]) { if (x < rowLo[y]) rowLo[y] = x; if (x > rowHi[y]) rowHi[y] = x; }
const rowSpan = (y) => (rowHi[y] < 0 ? 0 : rowHi[y] - rowLo[y] + 1);

// LINE band = the maximal contiguous run of wide rows
let lb0 = -1, lb1 = -1;
for (let y = 0; y < H; y++) {
  if (rowSpan(y) > LINE_MIN_SPAN) { if (lb0 === -1) lb0 = y; lb1 = y; }
  else if (lb0 !== -1 && y > lb1 + 2) break; // stop after the wide band ends
}
if (lb0 === -1) throw new Error('no line band found (LINE_MIN_SPAN too high?)');

// DOT = centered ink from just above the line band upward (contiguous), plus the
// part of the circle riding into the line band. Center column = argmax rowHi/lo mid.
let dotTop = lb0;
while (dotTop - 1 >= CONTENT_Y0 && rowSpan(dotTop - 1) > 0 && rowSpan(dotTop - 1) < LINE_MIN_SPAN) dotTop--;
// dot horizontal extent from the rows just above the line band
let dotLo = W, dotHi = -1;
for (let y = dotTop; y < lb0; y++)
  if (rowHi[y] >= 0) { dotLo = Math.min(dotLo, rowLo[y]); dotHi = Math.max(dotHi, rowHi[y]); }
if (dotHi < 0) throw new Error('no dot found above the line band');
const dotColLo = Math.max(0, dotLo - DOT_PAD);
const dotColHi = Math.min(W - 1, dotHi + DOT_PAD);
const dotBottom = lb1 + 4; // include the circle's lower arc that rides the line

// REFLECTION = ink strictly below the line band
const reflTop = lb1 + 1;

const bbox = (pred) => {
  let minX = W, maxX = -1, minY = H, maxY = -1;
  for (let y = CONTENT_Y0; y < H; y++)
    for (let x = 0; x < W; x++)
      if (ink[y * W + x] && pred(x, y)) {
        if (x < minX) minX = x; if (x > maxX) maxX = x;
        if (y < minY) minY = y; if (y > maxY) maxY = y;
      }
  if (maxX < 0) throw new Error('empty region');
  return {
    x: Math.max(0, minX - MARGIN),
    y: Math.max(0, minY - MARGIN),
    width: Math.min(W - 1, maxX + MARGIN) - Math.max(0, minX - MARGIN) + 1,
    height: Math.min(H - 1, maxY + MARGIN) - Math.max(0, minY - MARGIN) + 1,
  };
};

// predicates
const isDot = (x, y) => x >= dotColLo && x <= dotColHi && y >= dotTop && y <= dotBottom;
// reflection descends directly from the dot/line intersection, so its column
// band is the same one punched out of the line for the dot (not the full row
// width) — this is what keeps it a narrow trail instead of grabbing the wide
// antialiased tail of the line itself just below the line band.
const isReflection = (x, y) => y >= reflTop && x >= dotColLo && x <= dotColHi;
// line = the line-band rows, EXCLUDING the punched dot columns and the reflection
const isLine = (x, y) =>
  y >= lb0 - MARGIN && y <= lb1 + 4 && !(x >= dotColLo && x <= dotColHi) && y < reflTop;

const dotBox = bbox(isDot);
const reflBox = bbox(isReflection);
const lineBox = bbox(isLine);

// Emit a sprite for a predicate, cropped to `box`. Only pixels matching the
// predicate are inked, so the line sprite keeps its hole and the dot carries its
// own line-slice.
const writeSprite = async (box, pred, file) => {
  const px = Buffer.alloc(box.width * box.height * 4);
  for (let y = 0; y < box.height; y++)
    for (let x = 0; x < box.width; x++) {
      const sx = box.x + x, sy = box.y + y;
      if (ink[sy * W + sx] && pred(sx, sy)) {
        const o = (y * box.width + x) * 4;
        px[o] = INK[0]; px[o + 1] = INK[1]; px[o + 2] = INK[2]; px[o + 3] = 255;
      }
    }
  await sharp(px, { raw: { width: box.width, height: box.height, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile(file);
};

mkdirSync(OUT_DIR, { recursive: true });
await writeSprite(lineBox, isLine, `${OUT_DIR}/line.png`);
await writeSprite(dotBox, isDot, `${OUT_DIR}/dot.png`);
await writeSprite(reflBox, isReflection, `${OUT_DIR}/reflection.png`);

// offset bboxes into 1080×1920 source-frame space (as 001's layout is)
const off = (b) => ({ x: b.x, y: b.y + DRAW_OFFSET_Y, width: b.width, height: b.height });
writeFileSync(
  `${OUT_DIR}/layout.json`,
  JSON.stringify(
    { frame: { width: W, height: DRAW_OFFSET_Y * 2 + W }, line: off(lineBox), dot: off(dotBox), reflection: off(reflBox) },
    null,
    2,
  ),
);
console.log(
  `line ${JSON.stringify(lineBox)} | dot ${JSON.stringify(dotBox)} | reflection ${JSON.stringify(reflBox)} | lineBand ${lb0}-${lb1} dotCols ${dotColLo}-${dotColHi}`,
);
