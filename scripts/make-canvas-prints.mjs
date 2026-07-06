// scripts/make-canvas-prints.mjs
// Generates high-resolution landscape 30" x 24" canvas prints at 300 DPI (9000 x 7200 px).
// Takes the settled 16:9 landscape stills (1920 x 1080 px) from Day 001 and Day 002.
// Upscales them 4x using nearest-neighbor integer scaling to keep the dither texture and text
// perfectly crisp, centering them on the print canvas with the matching cream paper background (#F2EFE6).
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

const CANVAS_W = 9000;
const CANVAS_H = 7200;
const ART_W = 7680; // 1920 * 4
const ART_H = 4320; // 1080 * 4
const LEFT_MARGIN = (CANVAS_W - ART_W) / 2; // 660 px
const TOP_MARGIN = (CANVAS_H - ART_H) / 2;   // 1440 px

const PAPER_COLOR = { r: 242, g: 239, b: 230, alpha: 1 }; // #F2EFE6

async function createPrint(dayNum, cardPath, outputPath) {
  console.log(`Generating 16:9 landscape print for Day ${dayNum}...`);

  // 1. Load the 16:9 still and upscale it 4x using nearest-neighbor to keep the dither dots and text crisp
  const upscaledArt = await sharp(cardPath)
    .resize(ART_W, ART_H, { kernel: 'nearest' })
    .png()
    .toBuffer();

  // 2. Create the final 9000x7200 print canvas filled with paper color, and place the upscaled scene in the center
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

  await createPrint('001', 'out/001-16x9-still.png', 'out/001-canvas-print-30x24.png');
  await createPrint('002', 'out/002-16x9-still.png', 'out/002-canvas-print-30x24.png');

  console.log('Canvas prints generated successfully.');
}

run().catch(console.error);
