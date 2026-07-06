// src/days/003-bloom/beats.test.ts
import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  BEATS,
  stemReveal,
  flowerLeftProgress,
  flowerRightProgress,
  flowerCenterProgress,
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

  it('flower parts draw in staggered sequence and are monotonic', () => {
    assert.strictEqual(flowerLeftProgress(0), 0);
    assert.strictEqual(flowerRightProgress(0), 0);
    assert.strictEqual(flowerCenterProgress(0), 0);

    // Left starts first, right second, center last
    assert.ok(flowerLeftProgress(100) > flowerRightProgress(100));
    assert.ok(flowerRightProgress(120) > flowerCenterProgress(120));

    assert.strictEqual(flowerLeftProgress(220), 1);
    assert.strictEqual(flowerRightProgress(220), 1);
    assert.strictEqual(flowerCenterProgress(220), 1);
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
    assert.strictEqual(flowerLeftProgress(STILL_FRAME), 1);
    assert.strictEqual(flowerRightProgress(STILL_FRAME), 1);
    assert.strictEqual(flowerCenterProgress(STILL_FRAME), 1);
    assert.strictEqual(dotOpacity(STILL_FRAME), 1);
    assert.strictEqual(dotRise(STILL_FRAME), 0);
    assert.strictEqual(labelIn(STILL_FRAME), 1);
  });
});
