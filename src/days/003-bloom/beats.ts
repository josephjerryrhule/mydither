// src/days/003-bloom/beats.ts
// Single source of truth for 003's timeline. Pure functions of frame.
//
// Motion concept: The stem grows upwards from the base. As it finishes,
// the flower head blooms outwards from the receptacle with an organic,
// elastic springiness. The signature sun dot materializes behind the blossom.
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const norm = (f: number, a: number, b: number) => clamp01((f - a) / (b - a));

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;

// Custom easeOutBack for organic bloom springiness
const easeOutBack = (t: number) => {
  if (t === 0) return 0;
  if (t === 1) return 1;
  const c1 = 1.2; // overshoot amount (lower than standard 1.7 for subtle elegance)
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

export const BEATS = {
  stem: { start: 20, end: 120 },       // 0.6–4.0s — stem grows upwards
  flower: { start: 90, end: 220 },     // 3.0–7.3s — flower head blooms with springiness
  dot: { start: 160, end: 260 },       // 5.3–8.6s — sun dot materializes
  breath: { start: 250, end: 320 },    // 8.3–10.6s
  label: { start: 300, end: 345 },     // 10.0–11.5s
} as const;

// Stem growth fraction: 0 = unrevealed, 1 = fully grown.
// Animate this with a clean cubic reveal.
export const stemReveal = (f: number) =>
  easeOutCubic(norm(f, BEATS.stem.start, BEATS.stem.end));

// Flower bloom scale: 0 = bud, 1 = fully open.
// Uses easeOutBack for that organic petal unfolding bounce.
export const flowerBloom = (f: number) =>
  easeOutBack(norm(f, BEATS.flower.start, BEATS.flower.end));

// The signature sun dot fades and rises behind the flower.
export const dotOpacity = (f: number) =>
  easeOutCubic(norm(f, BEATS.dot.start, BEATS.dot.end));

export const dotRise = (f: number) => {
  const t = norm(f, BEATS.dot.start, BEATS.dot.end);
  return 15 * (1 - easeOutCubic(t)); // rise 15px to 0px
};

export const breathScale = (f: number) => {
  const t = norm(f, BEATS.breath.start, BEATS.breath.end);
  return 1 + 0.012 * Math.sin(Math.PI * t);
};

export const pushInScale = (f: number) => 1 + 0.03 * easeInOutSine(norm(f, 0, 360));

export const labelIn = (f: number) =>
  easeOutCubic(norm(f, BEATS.label.start, BEATS.label.end));
