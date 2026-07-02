// scripts/dither-ink.test.mjs
import { test } from 'node:test';
import assert from 'node:assert';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import sharp from 'sharp';

const run = () => execFileSync('node', ['scripts/dither-ink.mjs'], { stdio: 'pipe' });

test('produces sprites, layout, binary alpha, dot above branch, deterministic', async () => {
  run();
  const layout = JSON.parse(readFileSync('public/001/layout.json', 'utf8'));
  assert.equal(layout.frame.width, 1080);
  assert.ok(layout.dot.y + layout.dot.height <= layout.branch.y, 'dot sits above branch');
  assert.ok(layout.branch.width > 50 && layout.branch.height > 100, 'branch bbox non-trivial');

  const { data, info } = await sharp('public/001/branch.png')
    .raw().toBuffer({ resolveWithObject: true });
  let inkPx = 0;
  for (let i = 0; i < data.length; i += info.channels) {
    const a = data[i + 3];
    assert.ok(a === 0 || a === 255, 'alpha is binary');
    if (a === 255) {
      inkPx++;
      assert.deepEqual([data[i], data[i + 1], data[i + 2]], [0x1a, 0x18, 0x17], 'ink color exact');
    }
  }
  assert.ok(inkPx > 1000, 'branch has substantial ink');

  const first = readFileSync('public/001/branch.png');
  run();
  const second = readFileSync('public/001/branch.png');
  assert.ok(first.equals(second), 'deterministic output');
});
