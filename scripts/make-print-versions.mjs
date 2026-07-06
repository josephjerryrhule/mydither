// scripts/make-print-versions.mjs
// Generates high-resolution landscape 30" x 24" canvas prints at 300 DPI (9000 x 7200 px).
// Uses the exact dithered source sprites from Day 001 and Day 002.
// Upscales using 3x nearest-neighbor (integer scaling) to keep the dither texture
// perfectly uniform and crisp on the print, centering the vertical frame on the
// gallery-border cream paper background (#F2EFE6).
import sharp from 'sharp';
import { readFileSync, mkdirSync } from 'node:fs';

const CANVAS_W = 9000;
const CANVAS_H = 7200;
const ART_W = 3240; // 1080 * 3
const ART_H = 5760; // 1920 * 3
const LEFT_MARGIN = (CANVAS_W - ART_W) / 2; // 2880 px
const TOP_MARGIN = (CANVAS_H - ART_H) / 2;   // 720 px

const PAPER_COLOR = { r: 242, g: 239, b: 230, alpha: 1 }; // #F2EFE6

async function createPrint(dayNum, layoutFile, sprites, outputPath) {
  console.log(`Generating print for Day ${dayNum}...`);
  const layout = JSON.parse(readFileSync(layoutFile, 'utf8'));

  // 1. Create a transparent 1080x1920 canvas to rebuild the clean dithered artwork
  const compositeQueue = sprites.map(sprite => ({
    input: sprite.path,
    left: sprite.x,
    top: sprite.y,
  }));

  const rawArt = await sharp({
    create: {
      width: layout.frame.width,
      height: layout.frame.height,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  })
  .composite(compositeQueue)
  .png()
  .toBuffer();

  // 2. Upscale the artwork 3x using nearest-neighbor to keep the dither pixels crisp
  const upscaledArt = await sharp(rawArt)
    .resize(ART_W, ART_H, { kernel: 'nearest' })
    .png()
    .toBuffer();

  // 3. Create the final 9000x7200 print canvas filled with paper color, and place the art in the center
  await sharp({
    create: {
      width: CANVAS_W,
      height: CANVAS_H,
      channels: 4,
      background: PAPER_COLOR
    }
  })
  .composite([{
    input: upscaledArt,
    left: LEFT_MARGIN,
    top: TOP_MARGIN,
  }])
  .png({ compressionLevel: 9 })
  .toFile(outputPath);

  console.log(`Saved: ${outputPath}`);
}

async function run() {
  mkdirSync('out', { recursive: true });

  // Day 001
  const layout001 = JSON.parse(readFileSync('public/001/layout.json', 'utf8'));
  const sprites001 = [
    { path: 'public/001/dot.png', x: layout001.dot.x, y: layout001.dot.y },
    { path: 'public/001/branch.png', x: layout001.branch.x, y: layout001.branch.y }
  ];
  await createPrint('001', 'public/001/layout.json', sprites001, 'out/001-print-30x24.png');

  // Day 002
  const layout002 = JSON.parse(readFileSync('public/002/layout.json', 'utf8'));
  const sprites002 = [
    { path: 'public/002/line.png', x: layout002.line.x, y: layout002.line.y },
    { path: 'public/002/dot.png', x: layout002.dot.x, y: layout002.dot.y },
    { path: 'public/002/reflection.png', x: layout002.reflection.x, y: layout002.reflection.y }
  ];
  await createPrint('002', 'public/002/layout.json', sprites002, 'out/002-print-30x24.png');

  console.log('Prints generated successfully.');
}

run().catch(console.error);
