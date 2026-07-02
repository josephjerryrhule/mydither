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
  dot: { start: 186, convergeEnd: 228, spriteIn: [222, 240] as const },
  breath: { start: 240, end: 300 },
  card: { rise: [300, 330] as const, message: [315, 345] as const, credit: [330, 352] as const },
} as const;

export const stemProgress = (f: number) =>
  easeInOutSine(norm(f, BEATS.stem.start, BEATS.stem.end));

export const twigProgress = (f: number, i: number) => {
  const start = BEATS.twigs.start + i * BEATS.twigs.stagger;
  return easeOutQuint(norm(f, start, start + BEATS.twigs.dur));
};

export const dotConvergence = (f: number) =>
  easeOutCubic(norm(f, BEATS.dot.start, BEATS.dot.convergeEnd));

export const dotSpriteOpacity = (f: number) =>
  norm(f, BEATS.dot.spriteIn[0], BEATS.dot.spriteIn[1]);

export const breathScale = (f: number) => {
  const t = norm(f, BEATS.breath.start, BEATS.breath.end);
  return 1 + 0.012 * Math.sin(Math.PI * t);
};

export const pushInScale = (f: number) => 1 + 0.03 * easeInOutSine(norm(f, 0, 360));

export const cardRise = (f: number) =>
  1 - easeOutCubic(norm(f, BEATS.card.rise[0], BEATS.card.rise[1]));

export const messageIn = (f: number) =>
  norm(f, BEATS.card.message[0], BEATS.card.message[1]);

export const creditIn = (f: number) =>
  norm(f, BEATS.card.credit[0], BEATS.card.credit[1]);
