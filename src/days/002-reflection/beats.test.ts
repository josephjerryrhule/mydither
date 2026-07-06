// src/days/002-reflection/beats.test.ts
import { test } from 'node:test';
import assert from 'node:assert';
import {
  BEATS, horizonWipe, dotOpacity, reflectionReveal, reflectionPinch,
  breathScale, pushInScale, labelIn,
} from './beats';

test('dot materializes before the horizon finishes', () => {
  assert.ok(BEATS.dot.start < BEATS.horizon.start, 'dot begins before horizon');
  assert.ok(BEATS.dot.end < BEATS.horizon.end, 'dot solidifies while horizon still drawing');
});

test('horizon wipes left→right only within its beat', () => {
  assert.equal(horizonWipe(0), 0);
  assert.equal(horizonWipe(BEATS.horizon.start), 0);
  assert.equal(horizonWipe(BEATS.horizon.end), 1);
  assert.equal(horizonWipe(360), 1);
  assert.ok(horizonWipe(90) > 0 && horizonWipe(90) < 1);
});

test('dot fades in: opacity 0→1 over its beat', () => {
  assert.equal(dotOpacity(BEATS.dot.start), 0);
  assert.equal(dotOpacity(BEATS.dot.end), 1);
  assert.ok(dotOpacity((BEATS.dot.start + BEATS.dot.end) / 2) > 0);
});

test('reflection starts leaking before the dot fully solidifies', () => {
  assert.ok(BEATS.reflection.start < BEATS.dot.end,
    'leak begins while dot is still materializing — the water can\'t wait');
});

test('reflection reveals as one smooth continuous leak, overshoot peaks then settles', () => {
  assert.equal(reflectionReveal(BEATS.reflection.start), 0);
  assert.equal(reflectionReveal(BEATS.reflection.end), 1);
  assert.ok(reflectionReveal(150) > 0 && reflectionReveal(150) < 1.05);

  // Assert it peaks slightly above 1 due to fluid overshoot, then settles back to 1
  let peak = 0;
  for (let f = BEATS.reflection.start; f <= BEATS.reflection.end; f++) {
    const val = reflectionReveal(f);
    if (val > peak) peak = val;
  }
  assert.ok(peak > 1.0, 'reflection reveal has an overshoot peak');
  assert.ok(peak < 1.03, 'overshoot is subtle and organic');
});

test('reflection pinch: gets thinner during stretch, returns to 1 at end', () => {
  assert.equal(reflectionPinch(BEATS.reflection.start), 1);
  assert.equal(reflectionPinch(BEATS.reflection.end), 1);
  const mid = reflectionPinch((BEATS.reflection.start + BEATS.reflection.end) / 2);
  assert.ok(mid < 1.0 && mid > 0.95, 'reflection pinches in mid-stretch');
});

test('breath peaks mid-beat and returns to 1', () => {
  assert.equal(breathScale(0), 1);
  assert.equal(breathScale(BEATS.breath.start), 1);
  assert.ok(Math.abs(breathScale((BEATS.breath.start + BEATS.breath.end) / 2) - 1.012) < 1e-9);
  assert.ok(Math.abs(breathScale(BEATS.breath.end) - 1) < 1e-9);
});

test('push-in is monotonic 1 → 1.03', () => {
  assert.equal(pushInScale(0), 1);
  assert.ok(Math.abs(pushInScale(360) - 1.03) < 1e-9);
  assert.ok(pushInScale(180) > 1 && pushInScale(180) < 1.03);
});

test('label fades in over its beat', () => {
  assert.equal(labelIn(BEATS.label.start), 0);
  assert.equal(labelIn(BEATS.label.end), 1);
  assert.ok(labelIn((BEATS.label.start + BEATS.label.end) / 2) > 0);
});

test('everything is settled at the still frame (352)', () => {
  assert.equal(horizonWipe(352), 1);
  assert.equal(dotOpacity(352), 1);
  assert.equal(reflectionReveal(352), 1);
});
