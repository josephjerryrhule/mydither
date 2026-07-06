// src/days/004-wind/beats.ts
import { interpolate, spring } from 'remotion';

// Simple easing functions
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

// Helper to normalize frame numbers into a 0-1 progress range
const norm = (f: number, start: number, end: number) => {
  return Math.min(1, Math.max(0, (f - start) / (end - start)));
};

export const BEATS = {
  duration: 360,
  stillFrame: 352,
  stem: { start: 20, end: 120 },
  wind: { start: 100, end: 240 },
  seeds: [
    { start: 160, end: 250 }, // Seed 1 (leftmost, furthest)
    { start: 140, end: 230 }, // Seed 2 (middle)
    { start: 120, end: 210 }, // Seed 3 (rightmost, closest)
  ],
  label: { start: 300, end: 345 },
};

// Wipe reveal progress of the stem (bottom-to-top)
export function stemGrowProgress(frame: number): number {
  return easeOutCubic(norm(frame, BEATS.stem.start, BEATS.stem.end));
}

// Wind gust intensity curve (from 0 to 1, with a slight ease out/settle)
export function windProgress(frame: number): number {
  return easeInOutCubic(norm(frame, BEATS.wind.start, BEATS.wind.end));
}

// Bending skew angle (in degrees). The stem bends to the left under right-to-left wind.
export function stemSkewX(frame: number): number {
  const w = windProgress(frame);
  return interpolate(w, [0, 1], [0, -7]); // bends up to -7 degrees
}

// Individual seed drift progress (0 = at flower head, 1 = at final drawn position)
export function seedProgress(frame: number, seedIdx: number): number {
  const s = BEATS.seeds[seedIdx];
  return easeOutCubic(norm(frame, s.start, s.end));
}

// Seed opacity (starts at 0 when hidden, fades in to 1 as it detaches)
export function seedOpacity(frame: number, seedIdx: number): number {
  const s = BEATS.seeds[seedIdx];
  return norm(frame, s.start, s.start + 20);
}

// Gallery placard text fade-in
export function labelIn(frame: number): number {
  return norm(frame, BEATS.label.start, BEATS.label.end);
}

// Subtle zen breathing scale
export function breathScale(frame: number): number {
  // Peak breath at frame 180, returning to 1.0 at 360
  const phase = Math.sin((frame / BEATS.duration) * Math.PI);
  return 1 + phase * 0.015;
}

// Monotonic camera zoom-in
export function pushInScale(frame: number): number {
  return interpolate(norm(frame, 0, BEATS.stillFrame), [0, 1], [1, 1.03]);
}
