// src/days/005-tumble/beats.test.ts
import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  BEATS,
  groundProgress,
  trailOpacity,
  seed1Progress,
  seed2Progress,
  seedRotation,
  seedOpacity,
  labelIn,
} from './beats';

describe('Day 005 timeline beats', () => {
  it('ground wipes left-to-right within its beat', () => {
    assert.strictEqual(groundProgress(0), 0);
    assert.strictEqual(groundProgress(BEATS.ground.end), 1);
    assert.strictEqual(groundProgress(200), 1);
  });

  it('trail fades in within its beat', () => {
    assert.strictEqual(trailOpacity(0), 0);
    assert.strictEqual(trailOpacity(BEATS.trail.start), 0);
    assert.strictEqual(trailOpacity(BEATS.trail.end), 1);
  });

  it('seed1 falls with gravity easing', () => {
    assert.strictEqual(seed1Progress(0), 0);
    assert.strictEqual(seed1Progress(BEATS.seed1.start), 0);
    assert.strictEqual(seed1Progress(BEATS.seed1.end), 1);
    assert.strictEqual(seed1Progress(352), 1);
  });

  it('seed2 falls after seed1 starts', () => {
    assert.strictEqual(seed2Progress(0), 0);
    assert.strictEqual(seed2Progress(BEATS.seed2.start), 0);
    assert.strictEqual(seed2Progress(BEATS.seed2.end), 1);
    assert.ok(BEATS.seed2.start > BEATS.seed1.start);
  });

  it('seed rotation is monotonic and reaches 720 degrees', () => {
    const r0 = seedRotation(BEATS.seed1.start, BEATS.seed1.start, BEATS.seed1.end);
    const rEnd = seedRotation(BEATS.seed1.end, BEATS.seed1.start, BEATS.seed1.end);
    assert.strictEqual(r0, 0);
    assert.strictEqual(rEnd, 720);
  });

  it('seed opacity fades in over 20 frames', () => {
    assert.strictEqual(seedOpacity(BEATS.seed1.start - 1, BEATS.seed1.start), 0);
    assert.strictEqual(seedOpacity(BEATS.seed1.start, BEATS.seed1.start), 0);
    assert.strictEqual(seedOpacity(BEATS.seed1.start + 20, BEATS.seed1.start), 1);
  });

  it('still frame (352) is fully settled', () => {
    assert.strictEqual(groundProgress(352), 1);
    assert.strictEqual(trailOpacity(352), 1);
    assert.strictEqual(seed1Progress(352), 1);
    assert.strictEqual(seed2Progress(352), 1);
    assert.strictEqual(labelIn(352), 1);
  });
});
