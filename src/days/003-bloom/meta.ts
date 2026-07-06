// src/days/003-bloom/meta.ts
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
  id: '003',
  title: '003 / bloom',
  message: 'opening is a patient work: to bloom is to show your center.',
  // O sits in the upper right quadrant of the screen
  secret: { char: 'O', xPct: 0.65, yPct: 0.27, sizePx: 96 },
  igCaption: [
    '003 — bloom.',
    '',
    'opening is a patient work: to bloom is to show your center.',
    'the petals pull back slowly, one by one, revealing the core.',
    'the sun rises behind it, casting it in clean light.',
    '',
    'drawing: [source]',
    'sound: [artist — track]',
    '',
    'the hunt continues: six days, six pieces, one letter hiding in the grain of each.',
    'collect all six, in order. day six: DM me the word — partner shops are',
    'holding coupons + gifts for the ones who get it right. rules on slide one.',
    '',
    'day 3 of 6.',
    '',
    '#mydither #motion #dither #minimal #thehunt',
  ].join('\n'),
  xCaption: [
    '003 / bloom — day three of a daily motion practice.',
    'built with @paper dithering shaders + @remotion, deterministic to the frame.',
    '',
    'the hunt: one letter hides in each piece’s grain. six days, in order.',
    'day six, DM the word on IG — shops are holding coupons + gifts.',
    '',
    'day 3 of 6.',
  ].join('\n'),
  xThread: [
    [
      'yes, the letter is in the grain. look around the top right quadrant. squint.',
      'zoom in and whisper “enhance” — it still works.',
      '',
      'full rules + the DM box live on IG →',
      '[ig post link]',
    ].join('\n'),
  ],
};
