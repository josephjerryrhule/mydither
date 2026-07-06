// src/days/005-tumble/beats.ts
import { interpolate } from 'remotion';

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInCubic = (t: number) => t * t * t;
const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

const norm = (f: number, start: number, end: number) =>
  Math.min(1, Math.max(0, (f - start) / (end - start)));

export const BEATS = {
  duration: 360,
  stillFrame: 352,
  ground: { start: 0, end: 60 },
  trail: { start: 30, end: 160 },
  seed1: { start: 80, end: 220 },   // upper seed falls first
  seed2: { start: 140, end: 280 },  // lower seed follows
  settle: { start: 280, end: 320 }, // both seeds settle onto ground
  label: { start: 300, end: 345 },
};

// Ground wipe: left-to-right reveal
export function groundProgress(frame: number): number {
  return easeOutCubic(norm(frame, BEATS.ground.start, BEATS.ground.end));
}

// Trail fade-in
export function trailOpacity(frame: number): number {
  return easeInOutCubic(norm(frame, BEATS.trail.start, BEATS.trail.end));
}

// Seed 1 fall progress (0 = off-screen top-left, 1 = final resting position)
export function seed1Progress(frame: number): number {
  return easeInCubic(norm(frame, BEATS.seed1.start, BEATS.seed1.end));
}

// Seed 2 fall progress
export function seed2Progress(frame: number): number {
  return easeInCubic(norm(frame, BEATS.seed2.start, BEATS.seed2.end));
}

// Seed tumbling rotation (continuous spin that decelerates as it lands)
export function seedRotation(frame: number, seedStart: number, seedEnd: number): number {
  const p = norm(frame, seedStart, seedEnd);
  // Spin up to ~720 degrees, then decelerate
  return interpolate(easeOutCubic(p), [0, 1], [0, 720]);
}

// Seed opacity (fades in as it enters the frame)
export function seedOpacity(frame: number, seedStart: number): number {
  return norm(frame, seedStart, seedStart + 20);
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
