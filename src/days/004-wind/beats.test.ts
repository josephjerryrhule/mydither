// src/days/004-wind/beats.test.ts
import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  BEATS,
  stemGrowProgress,
  windProgress,
  stemSkewX,
  windFlowOffset,
  seedProgress,
  seedOpacity,
  labelIn,
} from './beats';

describe('Day 004 timeline beats', () => {
  it('stem grows only within its beat and is monotonic', () => {
    assert.strictEqual(stemGrowProgress(0), 0);
    assert.strictEqual(stemGrowProgress(BEATS.stem.start), 0);
    assert.strictEqual(stemGrowProgress(BEATS.stem.end), 1);
    assert.strictEqual(stemGrowProgress(300), 1);
  });

  it('wind gust is monotonic and ends at max leftwards skew', () => {
    assert.strictEqual(windProgress(0), 0);
    assert.strictEqual(windProgress(BEATS.wind.start), 0);
    assert.strictEqual(windProgress(BEATS.wind.end), 1);

    assert.strictEqual(stemSkewX(0), 0);
    assert.strictEqual(stemSkewX(BEATS.wind.start), 0);
    assert.strictEqual(stemSkewX(BEATS.wind.end), -7);
  });

  it('wind flow offset starts at 150 and sweeps left to 0', () => {
    assert.strictEqual(windFlowOffset(0), 150);
    assert.strictEqual(windFlowOffset(BEATS.wind.start), 150);
    assert.strictEqual(windFlowOffset(BEATS.stillFrame), 0);

    const midOffset = windFlowOffset(200);
    assert.ok(midOffset > 0 && midOffset < 150);
  });

  it('seeds progress and opacity match wind release schedule', () => {
    for (let i = 0; i < 4; i++) {
      const s = BEATS.seeds[i];
      assert.strictEqual(seedProgress(0, i), 0);
      assert.strictEqual(seedProgress(s.start, i), 0);
      assert.strictEqual(seedProgress(s.end, i), 1);
      assert.strictEqual(seedProgress(352, i), 1);

      assert.strictEqual(seedOpacity(0, i), 0);
      assert.strictEqual(seedOpacity(s.start, i), 0);
      assert.strictEqual(seedOpacity(s.start + 15, i), 1);
    }
  });

  it('still frame (352) is fully settled', () => {
    assert.strictEqual(stemGrowProgress(352), 1);
    assert.strictEqual(windProgress(352), 1);
    assert.strictEqual(stemSkewX(352), -7);
    assert.strictEqual(windFlowOffset(352), 0);
    assert.strictEqual(seedProgress(352, 0), 1);
    assert.strictEqual(seedProgress(352, 1), 1);
    assert.strictEqual(seedProgress(352, 2), 1);
    assert.strictEqual(seedProgress(352, 3), 1);
    assert.strictEqual(labelIn(352), 1);
  });
});
