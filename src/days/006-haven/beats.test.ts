// src/days/006-haven/beats.test.ts
import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  BEATS,
  groundProgress,
  rippleProgress,
  sproutGrowth,
  dotProgress,
  dotOffsetY,
  labelIn,
} from './beats';

describe('Day 006 timeline beats', () => {
  it('ground wipes left-to-right within its beat', () => {
    assert.strictEqual(groundProgress(0), 0);
    assert.strictEqual(groundProgress(BEATS.ground.end), 1);
  });

  it('ripples fade in within their beat', () => {
    assert.strictEqual(rippleProgress(0), 0);
    assert.strictEqual(rippleProgress(BEATS.ripple.start), 0);
    assert.strictEqual(rippleProgress(BEATS.ripple.end), 1);
  });

  it('sprout growth is monotonic and completes at 240', () => {
    assert.strictEqual(sproutGrowth(0), 0);
    assert.strictEqual(sproutGrowth(BEATS.sprout.start), 0);
    assert.strictEqual(sproutGrowth(BEATS.sprout.end), 1);
    assert.ok(sproutGrowth(160) > sproutGrowth(120));
  });

  it('dot progress and Y offset settle correctly', () => {
    assert.strictEqual(dotProgress(0), 0);
    assert.strictEqual(dotProgress(BEATS.dot.end), 1);
    assert.strictEqual(dotOffsetY(BEATS.dot.start), -50);
    assert.strictEqual(dotOffsetY(BEATS.dot.end), 0);
  });

  it('placard text fades in at the end', () => {
    assert.strictEqual(labelIn(0), 0);
    assert.strictEqual(labelIn(BEATS.label.start), 0);
    assert.strictEqual(labelIn(BEATS.label.end), 1);
  });

  it('still frame (352) is fully settled', () => {
    assert.strictEqual(groundProgress(352), 1);
    assert.strictEqual(rippleProgress(352), 1);
    assert.strictEqual(sproutGrowth(352), 1);
    assert.strictEqual(dotProgress(352), 1);
    assert.strictEqual(labelIn(352), 1);
  });
});
