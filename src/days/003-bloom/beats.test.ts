// src/days/003-bloom/beats.test.ts
import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  BEATS,
  stemReveal,
  flowerBloom,
  dotOpacity,
  dotRise,
  labelIn,
} from './beats';

describe('Day 003 timeline beats', () => {
  it('stem grows only within its beat and is monotonic', () => {
    assert.strictEqual(stemReveal(0), 0);
    assert.strictEqual(stemReveal(BEATS.stem.start), 0);
    assert.strictEqual(stemReveal(BEATS.stem.end), 1);
    assert.strictEqual(stemReveal(400), 1);

    let prev = 0;
    for (let f = BEATS.stem.start; f <= BEATS.stem.end; f++) {
      const val = stemReveal(f);
      assert.ok(val >= prev, `Stem should be monotonic at frame ${f}`);
      prev = val;
    }
  });

  it('flower blooms with subtle spring overshoot', () => {
    assert.strictEqual(flowerBloom(0), 0);
    assert.strictEqual(flowerBloom(BEATS.flower.start), 0);
    assert.strictEqual(flowerBloom(BEATS.flower.end), 1);
    assert.strictEqual(flowerBloom(400), 1);

    // Should overshoot slightly above 1 before settling
    let maxVal = 0;
    for (let f = BEATS.flower.start; f <= BEATS.flower.end; f++) {
      const val = flowerBloom(f);
      if (val > maxVal) maxVal = val;
    }
    assert.ok(maxVal > 1.0, `Flower bloom should overshoot 1.0 (got ${maxVal})`);
    assert.ok(maxVal < 1.1, `Flower bloom overshoot should be elegant and subtle (got ${maxVal})`);
  });

  it('dot rise and opacity match the design', () => {
    assert.strictEqual(dotOpacity(0), 0);
    assert.strictEqual(dotOpacity(BEATS.dot.start), 0);
    assert.strictEqual(dotOpacity(BEATS.dot.end), 1);

    assert.strictEqual(dotRise(0), 15);
    assert.strictEqual(dotRise(BEATS.dot.start), 15);
    assert.strictEqual(dotRise(BEATS.dot.end), 0);
  });

  it('still frame (352) is fully settled', () => {
    const STILL_FRAME = 352;
    assert.strictEqual(stemReveal(STILL_FRAME), 1);
    assert.strictEqual(flowerBloom(STILL_FRAME), 1);
    assert.strictEqual(dotOpacity(STILL_FRAME), 1);
    assert.strictEqual(dotRise(STILL_FRAME), 0);
    assert.strictEqual(labelIn(STILL_FRAME), 1);
  });
});
