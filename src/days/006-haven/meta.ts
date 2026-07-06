// src/days/006-haven/meta.ts
export type Meta = {
  id: string;
  title: string;
  message: string;
  igCaption: string;
  xCaption: string;
  /** Reply tweet */
  xThread: string[];
  secret: { char: string; xPct: number; yPct: number; sizePx: number };
};

export const META: Meta = {
  id: '006',
  title: '006 / haven',
  message: 'a haven where the cycle begins anew.',
  secret: { char: 'H', xPct: 0.28, yPct: 0.35, sizePx: 96 },
  igCaption: [
    '006 — haven.',
    '',
    'part 6: the cycle completes, rising from the haven to begin again.',
    '',
    'each print contains a hidden letter.',
    'six days. one word.',
    'collect them all.',
    '',
    '#mydither #generativeart #minimalism #creativecoding #remotion #dither #printdesign #motiondesign #monochrome #haven',
  ].join('\n'),
  xCaption: [
    '006 / haven — the final day of a daily motion practice.',
    'built with @paper dithering shaders + @remotion, deterministic to the frame.',
    'a new sprout rises to meet a hovering dewdrop, completing the loop back to Day 1.',
    '',
    'the hunt: one letter hides in each piece\u2019s grain. six days, in order.',
    'DM the word to me now — shops are holding coupons + gifts.',
    '',
    'day 6 of 6.',
  ].join('\n'),
  xThread: [
    [
      'did you find all six letters?',
      'DM the completed word to me on Instagram to claim your rewards.',
      '',
      'thank you for following along this week.',
      'full gallery print series link in bio soon.',
    ].join('\n'),
  ],
};
export default META;
