// src/days/002-reflection/beats.ts
// Single source of truth for 002's timeline. Pure functions of frame.
//
// Motion concept: the sun (dot) materializes on the horizon. Its reflection
// starts leaking from it before it's even fully there — the water doesn't wait.
// The reflection stretches and bleeds downward in one smooth, continuous drip —
// ink seeping through paper, the sun leaking on its past.
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const norm = (f: number, a: number, b: number) => clamp01((f - a) / (b - a));

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;

export const BEATS = {
  dot: { start: 30, end: 75 },         // 1.0–2.5s — the sun materializes
  horizon: { start: 45, end: 120 },    // 1.5–4.0s — line writes on L→R
  reflection: { start: 68, end: 234 }, // 2.3–7.8s — continuous leak from the sun
  breath: { start: 234, end: 300 },    // 7.8–10.0s
  label: { start: 300, end: 345 },     // 10.0–11.5s
} as const;

// fraction of the horizon width revealed, left→right
export const horizonWipe = (f: number) =>
  easeInOutSine(norm(f, BEATS.horizon.start, BEATS.horizon.end));

// the sun fades into existence — no drop, it's already there.
export const dotOpacity = (f: number) =>
  easeOutCubic(norm(f, BEATS.dot.start, BEATS.dot.end));

// How far the leak has bled: 0 = nothing, 1 = full trail. One smooth continuous
// drip that stretches downwards, with a tiny fluid settle (overshoot) at the end.
export const reflectionReveal = (f: number) => {
  const t = norm(f, BEATS.reflection.start, BEATS.reflection.end);
  if (t === 0) return 0;
  if (t === 1) return 1;
  const base = easeOutCubic(t);
  // Fluid overshoot: stretches slightly past 1 (up to 1.015) and settles back to 1.0
  const overshoot = 0.015 * Math.sin(t * Math.PI) * (1 - t);
  return base + overshoot;
};

// Fluid pinch: gets slightly thinner (up to 4% narrower) as it stretches,
// returning to normal width as it settles at the bottom.
export const reflectionPinch = (f: number) => {
  const t = norm(f, BEATS.reflection.start, BEATS.reflection.end);
  return 1 - 0.04 * Math.sin(t * Math.PI);
};

export const breathScale = (f: number) => {
  const t = norm(f, BEATS.breath.start, BEATS.breath.end);
  return 1 + 0.012 * Math.sin(Math.PI * t);
};

export const pushInScale = (f: number) => 1 + 0.03 * easeInOutSine(norm(f, 0, 360));

export const labelIn = (f: number) =>
  easeOutCubic(norm(f, BEATS.label.start, BEATS.label.end));
