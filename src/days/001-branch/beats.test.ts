// src/days/001-branch/beats.test.ts
import { test } from 'node:test';
import assert from 'node:assert';
import {
  BEATS, stemProgress, twigProgress, dotOpacity, dotRise,
  breathScale, pushInScale, labelIn,
} from './beats';
import { TWIGS } from './limbs';

test('stem draws only within its beat', () => {
  assert.equal(stemProgress(0), 0);
  assert.equal(stemProgress(BEATS.stem.start), 0);
  assert.equal(stemProgress(BEATS.stem.end), 1);
  assert.equal(stemProgress(360), 1);
  assert.ok(stemProgress(90) > 0 && stemProgress(90) < 1);
});

test('twigs stagger: later twig starts later, all finish by 150', () => {
  const f = 100;
  assert.ok(twigProgress(f, 0) > twigProgress(f, 6));
  for (let i = 0; i < BEATS.twigs.count; i++) {
    assert.equal(twigProgress(89, i), 0);
    assert.equal(twigProgress(150, i), 1);
  }
});

test('dot rises in seamlessly: opacity 0→1, rise 14→0 over 186–246', () => {
  assert.equal(dotOpacity(186), 0);
  assert.equal(dotOpacity(246), 1);
  assert.ok(dotOpacity(216) > 0 && dotOpacity(216) < 1);
  assert.ok(Math.abs(dotRise(186) - 14) < 1e-9);
  assert.ok(Math.abs(dotRise(246)) < 1e-9);
  assert.ok(dotRise(216) > 0 && dotRise(216) < 14);
});

test('breath peaks mid-beat and returns to 1', () => {
  assert.equal(breathScale(0), 1);
  assert.equal(breathScale(240), 1);
  assert.ok(Math.abs(breathScale(270) - 1.012) < 1e-9);
  assert.ok(Math.abs(breathScale(300) - 1) < 1e-9);
});

test('push-in is monotonic 1 → 1.03', () => {
  assert.equal(pushInScale(0), 1);
  assert.ok(Math.abs(pushInScale(360) - 1.03) < 1e-9);
  assert.ok(pushInScale(180) > 1 && pushInScale(180) < 1.03);
});

test('label fades in 300–345', () => {
  assert.equal(labelIn(300), 0);
  assert.equal(labelIn(345), 1);
  assert.ok(labelIn(320) > 0 && labelIn(320) < 1);
});

test('BEATS.twigs.count matches traced limbs', () => {
  assert.equal(TWIGS.length, BEATS.twigs.count);
});
