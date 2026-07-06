// src/days/002-reflection/meta.ts
export type Meta = {
  id: string;
  title: string;
  message: string;
  igCaption: string;
  xCaption: string;
  /** Reply tweet — IG link goes in the thread, not tweet 1 (X buries external links) */
  xThread: string[];
  secret: { char: string; xPct: number; yPct: number; sizePx: number };
};

export const META: Meta = {
  id: '002',
  title: '002 / reflection',
  message: 'a mark on the horizon, and the water’s reply.',
  // R sits in the open field above the line (varied left vs 001’s right).
  // yPct 0.27 (not lower): at 0.24 the 96px glyph clips the top on the 16:9 crop
  // (offsetY -420) — lesson carried from 001.
  secret: { char: 'R', xPct: 0.30, yPct: 0.27, sizePx: 96 },
  igCaption: [
    '002 — reflection.',
    '',
    'part 2: nourished by reflection, it learns to stand still.',
    '',
    'each print contains a hidden letter.',
    'six days. one word.',
    'collect them all.',
    '',
    '#mydither #generativeart #minimalism #creativecoding #remotion #dither #printdesign #motiondesign #monochrome #reflection',
  ].join('\n'),
  xCaption: [
    '002 / reflection — day two of a daily motion practice.',
    'built with @paper dithering shaders + @remotion, deterministic to the frame.',
    'achieved using relative pixel scans for clean reflection pinch and vertical leaks.',
    '',
    'the hunt: one letter hides in each piece’s grain. six days, in order.',
    'day six, DM the word on IG — shops are holding coupons + gifts.',
    '',
    'day 2 of 6.',
  ].join('\n'),
  xThread: [
    [
      'yes, the letter is in the grain again. pause on the reflection. squint.',
      'zoom in and whisper “enhance” — still works.',
      '',
      'full rules + the DM box live on IG →',
      'https://www.instagram.com/p/Dac27_QCIpr/?igsh=MXJoeHphZXMzenRmYw==',
    ].join('\n'),
  ],
};
