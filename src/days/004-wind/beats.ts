// src/days/004-wind/beats.ts
import { interpolate } from 'remotion';

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

const norm = (f: number, start: number, end: number) => {
  return Math.min(1, Math.max(0, (f - start) / (end - start)));
};

export const BEATS = {
  duration: 360,
  stillFrame: 352,
  stem: { start: 20, end: 120 },
  wind: { start: 100, end: 240 },
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

// Bending skew angle (in degrees). The stem bends to the right under left-to-right wind.
export function stemSkewX(frame: number): number {
  const w = windProgress(frame);
  return interpolate(w, [0, 1], [0, 7]); // bends up to 7 degrees rightwards
}

// Gallery placard text fade-in
export function labelIn(frame: number): number {
  return norm(frame, BEATS.label.start, BEATS.label.end);
}

// Subtle zen breathing scale
export function breathScale(frame: number): number {
  const phase = Math.sin((frame / BEATS.duration) * Math.PI);
  return 1 + phase * 0.015;
}

// Monotonic camera zoom-in
export function pushInScale(frame: number): number {
  return interpolate(norm(frame, 0, BEATS.stillFrame), [0, 1], [1, 1.03]);
}
