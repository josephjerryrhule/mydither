// src/days/004-wind/beats.test.ts
import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  BEATS,
  stemGrowProgress,
  windProgress,
  stemSkewX,
  labelIn,
} from './beats';

describe('Day 004 timeline beats', () => {
  it('stem grows only within its beat and is monotonic', () => {
    assert.strictEqual(stemGrowProgress(0), 0);
    assert.strictEqual(stemGrowProgress(BEATS.stem.start), 0);
    assert.strictEqual(stemGrowProgress(BEATS.stem.end), 1);
    assert.strictEqual(stemGrowProgress(300), 1);

    const mid1 = stemGrowProgress(50);
    const mid2 = stemGrowProgress(80);
    assert.ok(mid1 > 0 && mid1 < 1);
    assert.ok(mid2 > mid1);
  });

  it('wind gust is monotonic and ends at max skew', () => {
    assert.strictEqual(windProgress(0), 0);
    assert.strictEqual(windProgress(BEATS.wind.start), 0);
    assert.strictEqual(windProgress(BEATS.wind.end), 1);

    assert.strictEqual(stemSkewX(0), 0);
    assert.strictEqual(stemSkewX(BEATS.wind.start), 0);
    assert.strictEqual(stemSkewX(BEATS.wind.end), 7);

    const midSkew = stemSkewX(150);
    assert.ok(midSkew > 0 && midSkew < 7);
  });

  it('still frame (352) is fully settled', () => {
    assert.strictEqual(stemGrowProgress(352), 1);
    assert.strictEqual(windProgress(352), 1);
    assert.strictEqual(stemSkewX(352), 7);
    assert.strictEqual(labelIn(352), 1);
  });
});
