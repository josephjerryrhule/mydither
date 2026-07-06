// scripts/make-canvas-prints.mjs
// Generates high-resolution landscape 30" x 20" canvas prints at 300 DPI (9000 x 6000 px).
// Re-creates the entire scene programmatically at 1/5th resolution (1800 x 1200 px):
// - Full-frame deterministic Simplex noise dither for the paper background (no double-backgrounds, fills margins).
// - High-res dithered secret glyph (coarser grain size 5) woven into the background.
// - High-res dithered drawing centered (dithered directly at target height, no pixelated scaling).
// - High-res dithered gallery placard in the bottom-left.
// Then upscales 5x using nearest-neighbor to ensure every dither dot is a perfectly sharp 5x5 block.
import sharp from 'sharp';
import { writeFileSync, mkdirSync } from 'node:fs';

const PRINT_W = 9000;
const PRINT_H = 6000;
const BASE_W = 1800; // 9000 / 5
const BASE_H = 1200; // 6000 / 5

const INK = [0x1a, 0x18, 0x17];
const PAPER = [0xf2, 0xef, 0xe6];
const GRAIN = [0xe7, 0xe3, 0xd6];

// Bayer 8x8 ordered dither matrix
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

// Seeded random (mulberry32) for deterministic simplex noise permutation
function mulberry32(a) {
  return function() {
    let t = a += 0x6d2b79f5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
}

// 2D Simplex Noise implementation
const F2 = 0.5 * (Math.sqrt(3.0) - 1.0);
const G2 = (3.0 - Math.sqrt(3.0)) / 6.0;
function createNoise2D(seed) {
  const rand = mulberry32(seed);
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    const tmp = p[i]; p[i] = p[j]; p[j] = tmp;
  }
  const perm = new Uint8Array(512);
  const permMod12 = new Uint8Array(512);
  for (let i = 0; i < 512; i++) {
    perm[i] = p[i & 255];
    permMod12[i] = perm[i] % 12;
  }
  const grad3 = [
    [1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],
    [1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],
    [0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]
  ];

  return function(xin, yin) {
    let n0, n1, n2;
    const s = (xin + yin) * F2;
    const i = Math.floor(xin + s);
    const j = Math.floor(yin + s);
    const t = (i + j) * G2;
    const x0 = xin - (i - t);
    const y0 = yin - (j - t);
    let i1, j1;
    if (x0 > y0) { i1 = 1; j1 = 0; } else { i1 = 0; j1 = 1; }
    const x1 = x0 - i1 + G2;
    const y1 = y0 - j1 + G2;
    const x2 = x0 - 1.0 + 2.0 * G2;
    const y2 = y0 - 1.0 + 2.0 * G2;
    const ii = i & 255;
    const jj = j & 255;
    const gi0 = permMod12[ii + perm[jj]];
    const gi1 = permMod12[ii + i1 + perm[jj + j1]];
    const gi2 = permMod12[ii + 1 + perm[jj + 1]];
    let t0 = 0.5 - x0*x0 - y0*y0;
    if (t0 < 0) n0 = 0.0; else { t0 *= t0; n0 = t0 * t0 * (grad3[gi0][0]*x0 + grad3[gi0][1]*y0); }
    let t1 = 0.5 - x1*x1 - y1*y1;
    if (t1 < 0) n1 = 0.0; else { t1 *= t1; n1 = t1 * t1 * (grad3[gi1][0]*x1 + grad3[gi1][1]*y1); }
    let t2 = 0.5 - x2*x2 - y2*y2;
    if (t2 < 0) n2 = 0.0; else { t2 *= t2; n2 = t2 * t2 * (grad3[gi2][0]*x2 + grad3[gi2][1]*y2); }
    return 70.0 * (n0 + n1 + n2);
  };
}

const noise = createNoise2D(42);

// Renders the background dither with the secret glyph integrated
async function renderBackground(secretOpt) {
  // Create secret letter mask
  const glyphSize = Math.round(secretOpt.size * 0.85);
  const secretSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${secretOpt.size}" height="${secretOpt.size}" viewBox="0 0 ${secretOpt.size} ${secretOpt.size}">
    <rect width="${secretOpt.size}" height="${secretOpt.size}" fill="#ffffff"/>
    <text x="${secretOpt.size/2}" y="${secretOpt.size/2}" font-family="'Courier New', Courier, monospace" font-size="${glyphSize}" font-weight="bold" text-anchor="middle" dominant-baseline="central" fill="#000000">${secretOpt.char}</text>
  </svg>`;
  const secretMask = await sharp(Buffer.from(secretSvg)).raw().toBuffer();

  const isInsideSecret = (x, y) => {
    const rx = x - (secretOpt.x - secretOpt.size / 2);
    const ry = y - (secretOpt.y - secretOpt.size / 2);
    if (rx >= 0 && rx < secretOpt.size && ry >= 0 && ry < secretOpt.size) {
      const maskVal = secretMask[Math.round(ry) * secretOpt.size + Math.round(rx)];
      return maskVal < 128; // black text is inside the mask
    }
    return false;
  };

  const px = Buffer.alloc(BASE_W * BASE_H * 4);
  for (let y = 0; y < BASE_H; y++) {
    for (let x = 0; x < BASE_W; x++) {
      const inside = isInsideSecret(x, y);
      // size 2 outside, size 5 inside (coarser grain)
      const size = inside ? 5 : 2;
      const freq = size * 6; // frequency scale matching shader

      const n = noise(x / freq, y / freq);
      const val = n * 0.5 + 0.5;

      const on = val * 64 > BAYER8[y % 8][x % 8] + 0.5;
      const col = on ? GRAIN : PAPER;

      const o = (y * BASE_W + x) * 4;
      px[o] = col[0]; px[o+1] = col[1]; px[o+2] = col[2]; px[o+3] = 255;
    }
  }
  return px;
}

// Dithers a source drawing at target dimensions directly
async function ditherDrawing(srcPath, targetW, targetH, thresholds, denoiseY = 0) {
  const { data, info } = await sharp(srcPath)
    .resize(targetW, targetH, { kernel: 'lanczos3' })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = info;

  const px = Buffer.alloc(W * H * 4);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (y < denoiseY) continue; // denoise specks above this row

      const i = (y * W + x) * C;
      const lum = 0.2126 * data[i] + 0.7152 * data[i+1] + 0.0722 * data[i+2];
      let a = (thresholds.paper - lum) / (thresholds.paper - thresholds.ink);
      a = Math.min(1, Math.max(0, a));
      if (a < thresholds.gateLo) a = 0;
      if (a > thresholds.gateHi) a = 1;

      const on = a * 64 > BAYER8[y % 8][x % 8] + 0.5;
      if (on) {
        const o = (y * W + x) * 4;
        px[o] = INK[0]; px[o+1] = INK[1]; px[o+2] = INK[2]; px[o+3] = 255;
      }
    }
  }
  return { data: px, width: W, height: H };
}

// Renders the placard text SVG and dithers it
async function renderPlacard(title, message) {
  const W = 640;
  const H = 76;
  const FONT = `'Courier New', Courier, monospace`;
  const escapeXml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <rect width="${W}" height="${H}" fill="#ffffff"/>
    <g font-family="${FONT}" fill="#000000">
      <text x="0" y="22" font-size="21" font-weight="bold" letter-spacing="2">${escapeXml(title.toUpperCase())}</text>
      <text x="0" y="56" font-size="17">${escapeXml(message)}</text>
    </g>
  </svg>`;

  const { data } = await sharp(Buffer.from(svg)).flatten({ background: '#ffffff' }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const px = Buffer.alloc(W * H * 4);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 3;
      const lum = 0.2126 * data[i] + 0.7152 * data[i+1] + 0.0722 * data[i+2];
      let a = (225 - lum) / (225 - 60);
      a = Math.min(1, Math.max(0, a));
      if (a < 0.12) a = 0;
      if (a > 0.85) a = 1;

      const on = a * 64 > BAYER8[y % 8][x % 8] + 0.5;
      if (on) {
        const o = (y * W + x) * 4;
        px[o] = INK[0]; px[o+1] = INK[1]; px[o+2] = INK[2]; px[o+3] = 255;
      }
    }
  }
  return { data: px, width: W, height: H };
}

async function generateCanvasPrint(dayNum, drawingOpt, secretOpt, placardOpt, outputPath) {
  console.log(`Generating high-res 30x20 canvas print for Day ${dayNum}...`);

  // 1. Generate full dither background at 1800x1200
  const bgData = await renderBackground(secretOpt);
  const bgImage = sharp(bgData, { raw: { width: BASE_W, height: BASE_H, channels: 4 } });

  // 2. Dither the drawing at target height (1200px) directly (not pixelated!)
  const ditheredDraw = await ditherDrawing(
    drawingOpt.src,
    drawingOpt.w,
    drawingOpt.h,
    drawingOpt.thresholds,
    drawingOpt.denoiseY
  );
  const drawBuffer = await sharp(ditheredDraw.data, { raw: { width: ditheredDraw.width, height: ditheredDraw.height, channels: 4 } }).png().toBuffer();

  // 3. Dither the placard text directly
  const ditheredPlacard = await renderPlacard(placardOpt.title, placardOpt.message);
  const placardBuffer = await sharp(ditheredPlacard.data, { raw: { width: ditheredPlacard.width, height: ditheredPlacard.height, channels: 4 } }).png().toBuffer();

  // 4. Composite drawing and placard onto the dither background
  const compositeBase = await bgImage
    .composite([
      { input: drawBuffer, left: drawingOpt.x, top: drawingOpt.y },
      { input: placardBuffer, left: placardOpt.x, top: placardOpt.y }
    ])
    .png()
    .toBuffer();

  // 5. Upscale 5x using nearest-neighbor to PRINT_W x PRINT_H (9000 x 6000 px)
  // This scales the fine 1px dither dots to sharp 5x5 blocks on the print canvas
  await sharp(compositeBase)
    .resize(PRINT_W, PRINT_H, { kernel: 'nearest' })
    .png({ compressionLevel: 9 })
    .toFile(outputPath);

  console.log(`Saved: ${outputPath}`);
}

async function run() {
  mkdirSync('out', { recursive: true });

  // --- Day 001 ---
  const thresholds001 = { paper: 225, ink: 60, gateLo: 0.12, gateHi: 0.85 };
  const drawW001 = Math.round(1200 * 665 / 1182); // 675 px
  await generateCanvasPrint(
    '001',
    {
      src: 'assets/001-branch-source.jpeg',
      x: Math.round((BASE_W - drawW001) / 2),
      y: 0,
      w: drawW001,
      h: 1200,
      thresholds: thresholds001,
      denoiseY: 0
    },
    {
      char: 'G',
      x: Math.round(BASE_W / 2 + 0.70 * 675 / 2), // centered relative offsets
      y: Math.round(1200 * 0.40),
      size: Math.round(96 * 0.625)
    },
    {
      title: '001 / BRANCH',
      message: 'a sprout reaches up, breaking the soil.',
      x: 80,
      y: 1200 - 80 - 76
    },
    'out/001-canvas-print-30x20.png'
  );

  // --- Day 002 ---
  const thresholds002 = { paper: 225, ink: 60, gateLo: 0.12, gateHi: 0.85 };
  const drawSize002 = 675; // 1080 * 0.625
  const offsetDrawY002 = Math.round(420 * 0.625); // 262 px
  await generateCanvasPrint(
    '002',
    {
      src: 'assets/002-reflection-source.jpg',
      x: Math.round((BASE_W - drawSize002) / 2),
      y: offsetDrawY002,
      w: drawSize002,
      h: drawSize002,
      thresholds: thresholds002,
      denoiseY: Math.round(480 * 0.625) // denoise above 300px
    },
    {
      char: 'R',
      x: Math.round(BASE_W / 2 - 675 * 0.20), // R positioned above line on the left
      y: Math.round(1200 * 0.27),
      size: Math.round(96 * 0.625)
    },
    {
      title: '002 / reflection',
      message: 'a mark on the horizon, and the water’s reply.',
      x: 80,
      y: 1200 - 80 - 76
    },
    'out/002-canvas-print-30x20.png'
  );

  console.log('Canvas prints generated successfully.');
}

run().catch(console.error);
