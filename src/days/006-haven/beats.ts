// src/days/006-haven/beats.ts
import { interpolate } from 'remotion';

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

const norm = (f: number, start: number, end: number) =>
  Math.min(1, Math.max(0, (f - start) / (end - start)));

export const BEATS = {
  duration: 360,
  stillFrame: 352,
  ground: { start: 0, end: 60 },
  ripple: { start: 40, end: 140 },
  sprout: { start: 80, end: 240 },
  dot: { start: 160, end: 280 },
  label: { start: 300, end: 345 },
};

// Ground reveal: left-to-right wipe
export function groundProgress(frame: number): number {
  return easeOutCubic(norm(frame, BEATS.ground.start, BEATS.ground.end));
}

// Background circular ripples fade-in
export function rippleProgress(frame: number): number {
  return easeInOutCubic(norm(frame, BEATS.ripple.start, BEATS.ripple.end));
}

// Sprout growth: mask grows vertically upwards
export function sproutGrowth(frame: number): number {
  return easeInOutCubic(norm(frame, BEATS.sprout.start, BEATS.sprout.end));
}

// Dewdrop/Sun reveal progress
export function dotProgress(frame: number): number {
  return easeInOutCubic(norm(frame, BEATS.dot.start, BEATS.dot.end));
}

// Dewdrop downward hover/settle offset
export function dotOffsetY(frame: number): number {
  const p = dotProgress(frame);
  // Descends by 50px during entry
  return interpolate(p, [0, 1], [-50, 0]);
}

// Gallery placard text fade-in
export function labelIn(frame: number): number {
  return norm(frame, BEATS.label.start, BEATS.label.end);
}

// Subtle zen breathing scale
export function breathScale(frame: number): number {
  const phase = Math.sin((frame / BEATS.duration) * Math.PI);
  return 1 + phase * 0.012;
}

// Monotonic camera zoom-in
export function pushInScale(frame: number): number {
  return interpolate(norm(frame, 0, BEATS.stillFrame), [0, 1], [1, 1.03]);
}
