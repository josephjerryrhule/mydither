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
    'a dot rests on the horizon. the water underneath doesn’t copy it —',
    'it answers, breaking the light into pieces the deeper it falls.',
    'the source holds still; the reflection is the part that can’t.',
    '',
    'drawing: [source]',
    'sound: [artist — track]',
    '',
    'the hunt continues: six days, six pieces, one letter hiding in the grain of each.',
    'collect all six, in order. day six: DM me the word — partner shops are',
    'holding coupons + gifts for the ones who get it right. rules on slide one.',
    '',
    'day 2 of 6.',
    '',
    '#mydither #motion #dither #minimal #thehunt',
  ].join('\n'),
  xCaption: [
    '002 / reflection — day two of a daily motion practice.',
    'built with @paper dithering shaders + @remotion, deterministic to the frame.',
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
      '[ig post link]',
    ].join('\n'),
  ],
};
