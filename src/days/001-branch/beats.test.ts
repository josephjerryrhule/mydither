// src/days/001-branch/beats.test.ts
import { test } from 'node:test';
import assert from 'node:assert';
import {
  BEATS, stemProgress, twigProgress, dotConvergence, dotSpriteOpacity,
  breathScale, pushInScale, cardRise, messageIn, creditIn,
} from './beats';

test('stem draws only within its beat', () => {
  assert.equal(stemProgress(0), 0);
  assert.equal(stemProgress(BEATS.stem.start), 0);
  assert.equal(stemProgress(BEATS.stem.end), 1);
  assert.equal(stemProgress(360), 1);
  assert.ok(stemProgress(90) > 0 && stemProgress(90) < 1);
});

test('twigs stagger: later twig starts later, all finish by 150', () => {
  const f = 100;
  assert.ok(twigProgress(f, 0) > twigProgress(f, 5));
  for (let i = 0; i < 6; i++) {
    assert.equal(twigProgress(89, i), 0);
    assert.equal(twigProgress(150, i), 1);
  }
});

test('dot: convergence completes, sprite fades in at the end', () => {
  assert.equal(dotConvergence(186), 0);
  assert.equal(dotConvergence(228), 1);
  assert.equal(dotSpriteOpacity(220), 0);
  assert.equal(dotSpriteOpacity(240), 1);
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

test('card rises then text settles', () => {
  assert.equal(cardRise(300), 1);
  assert.equal(cardRise(330), 0);
  assert.equal(messageIn(315), 0);
  assert.equal(messageIn(345), 1);
  assert.equal(creditIn(330), 0);
  assert.equal(creditIn(352), 1);
});
