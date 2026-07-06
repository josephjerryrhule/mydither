// src/days/005-tumble/meta.ts
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
  id: '005',
  title: '005 / tumble',
  message: 'a seed in the dark is still a seed.',
  secret: { char: 'T', xPct: 0.78, yPct: 0.82, sizePx: 96 },
  igCaption: [
    '005 — tumble.',
    '',
    'part 5: returning to the soil, a seed learns to wait in the dark.',
    '',
    'each print contains a hidden letter.',
    'six days. one word.',
    'collect them all.',
    '',
    '#mydither #generativeart #minimalism #creativecoding #remotion #dither #printdesign #motiondesign #monochrome #tumble',
  ].join('\n'),
  xCaption: [
    '005 / tumble — day five of a daily motion practice.',
    'built with @paper dithering shaders + @remotion, deterministic to the frame.',
    'using gravity-based easing curves and rotational tumbling transforms for paper-grain seeds.',
    '',
    'the hunt: one letter hides in each piece\u2019s grain. six days, in order.',
    'day six, DM the word on IG — shops are holding coupons + gifts.',
    '',
    'day 5 of 6.',
  ].join('\n'),
  xThread: [
    [
      'yes, the letter is literally in this video. pause it. squint.',
      'zoom in and whisper "enhance" — it works, I checked.',
      '',
      'full rules + the DM box live on IG →',
      '[ig post link]',
    ].join('\n'),
  ],
};
export default META;
