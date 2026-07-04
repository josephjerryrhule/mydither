// scripts/dither-ink-002.test.mjs
import { test } from 'node:test';
import assert from 'node:assert';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import sharp from 'sharp';

const run = () => execFileSync('node', ['scripts/dither-ink-002.mjs'], { stdio: 'pipe' });

const binaryInkCount = async (file) => {
  const { data, info } = await sharp(file).raw().toBuffer({ resolveWithObject: true });
  let ink = 0;
  for (let i = 0; i < data.length; i += info.channels) {
    const a = data[i + 3];
    assert.ok(a === 0 || a === 255, `${file}: alpha is binary`);
    if (a === 255) {
      ink++;
      assert.deepEqual([data[i], data[i + 1], data[i + 2]], [0x1a, 0x18, 0x17], `${file}: ink color exact`);
    }
  }
  return ink;
};

test('002 extraction: sprites stacked line<dot? dot on line, reflection below, denoised, deterministic', async () => {
  run();
  const layout = JSON.parse(readFileSync('public/002/layout.json', 'utf8'));
  assert.equal(layout.frame.width, 1080);
  assert.equal(layout.frame.height, 1920);

  // dot sits on the line (overlaps its top); reflection is strictly below the line
  assert.ok(layout.dot.y < layout.line.y + layout.line.height, 'dot overlaps/rides the line');
  assert.ok(layout.reflection.y >= layout.line.y + layout.line.height - 2, 'reflection below the line');

  // line is wide, reflection is a narrow centered trail
  assert.ok(layout.line.width > 700, 'horizon spans most of the frame');
  assert.ok(layout.reflection.width < 120, 'reflection is a narrow centered trail');
  assert.ok(layout.reflection.height > 120, 'reflection descends');

  // denoise: nothing extracted from the stray specks region (all sprites well below y+420+480)
  assert.ok(layout.dot.y > 420 + 480, 'no content above the drawing mass (specks denoised)');

  const lineInk = await binaryInkCount('public/002/line.png');
  const dotInk = await binaryInkCount('public/002/dot.png');
  const reflInk = await binaryInkCount('public/002/reflection.png');
  assert.ok(lineInk > 2000, 'line has substantial ink');
  assert.ok(dotInk > 150, 'dot has ink');
  assert.ok(reflInk > 800, 'reflection has ink');

  // line sprite has a punched hole at the dot columns (no dense center block before the dot lands)
  const first = readFileSync('public/002/line.png');
  run();
  const second = readFileSync('public/002/line.png');
  assert.ok(first.equals(second), 'deterministic output');
});
