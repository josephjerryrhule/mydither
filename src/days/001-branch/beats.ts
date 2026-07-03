// src/days/001-branch/beats.ts
// Single source of truth for 001's timeline. Pure functions of frame.
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const norm = (f: number, a: number, b: number) => clamp01((f - a) / (b - a));

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeOutQuint = (t: number) => 1 - Math.pow(1 - t, 5);
const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;

export const BEATS = {
  stem: { start: 45, end: 120 },
  twigs: { start: 90, stagger: 5, dur: 30, count: 7 }, // last twig: 120..150
  dot: { start: 186, end: 246 },
  breath: { start: 240, end: 300 },
  label: { start: 300, end: 345 },
} as const;

export const stemProgress = (f: number) =>
  easeInOutSine(norm(f, BEATS.stem.start, BEATS.stem.end));

export const twigProgress = (f: number, i: number) => {
  const start = BEATS.twigs.start + i * BEATS.twigs.stagger;
  return easeOutQuint(norm(f, start, start + BEATS.twigs.dur));
};

// Tomorrow rising: fades in slow and inevitable while drifting the last 14px up.
export const dotOpacity = (f: number) =>
  easeInOutSine(norm(f, BEATS.dot.start, BEATS.dot.end));

export const dotRise = (f: number) =>
  14 * (1 - easeOutCubic(norm(f, BEATS.dot.start, BEATS.dot.end)));

export const breathScale = (f: number) => {
  const t = norm(f, BEATS.breath.start, BEATS.breath.end);
  return 1 + 0.012 * Math.sin(Math.PI * t);
};

export const pushInScale = (f: number) => 1 + 0.03 * easeInOutSine(norm(f, 0, 360));

export const labelIn = (f: number) =>
  easeOutCubic(norm(f, BEATS.label.start, BEATS.label.end));
