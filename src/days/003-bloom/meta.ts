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
  // O sits in the middle-right margin, clear of the drawing and placard
  secret: { char: 'O', xPct: 0.80, yPct: 0.55, sizePx: 96 },
  igCaption: [
    '003 — bloom.',
    '',
    'part 3: with patience, the bud opens, showing its center.',
    '',
    'each print contains a hidden letter.',
    'six days. one word.',
    'collect them all.',
    '',
    '#mydither #generativeart #minimalism #creativecoding #remotion #dither #printdesign #motiondesign #monochrome #bloom',
  ].join('\n'),
  xCaption: [
    '003 / bloom — day three of a daily motion practice.',
    'using staggered vector masks on transparent PNG channels for calligraphic ink sweeps.',
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
