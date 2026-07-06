// src/days/001-branch/meta.ts
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
  id: '001',
  title: '001 / branch',
  message: 'one line up, seven honest detours. the dot is tomorrow.',
  secret: { char: 'G', xPct: 0.70, yPct: 0.27, sizePx: 96 },
  igCaption: [
    '001 — branch.',
    '',
    'part 1: a single shoot rises, branching upward to find the light.',
    '',
    'each print contains a hidden letter.',
    'six days. one word.',
    'collect them all.',
    '',
    '#mydither #generativeart #minimalism #creativecoding #remotion #dither #printdesign #motiondesign #monochrome #zenart',
  ].join('\n'),
  xCaption: [
    '001 / branch — day one of a daily motion practice.',
    'built with @paper dithering shaders + @remotion, deterministic to the frame.',
    '',
    'the hunt: one letter hides in each piece’s grain. six days, in order.',
    'day six, DM the word on IG — shops are holding coupons + gifts.',
    '',
    'day 1 of 6.',
  ].join('\n'),
  xThread: [
    [
      'yes, the letter is literally in this video. pause it. squint.',
      'zoom in and whisper “enhance” — it works, I checked.',
      '',
      'full rules + the DM box live on IG →',
      '[ig post link]',
    ].join('\n'),
  ],
};
