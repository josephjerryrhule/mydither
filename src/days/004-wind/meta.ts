// src/days/004-wind/meta.ts
export type Meta = {
  id: string;
  title: string;
  message: string;
  igCaption: string;
  xCaption: string;
  xThread: string[];
  secret: { char: string; xPct: number; yPct: number; sizePx: number };
};

export const META: Meta = {
  id: '004',
  title: '004 / wind',
  message: 'part 4: until the wind sweeps in, letting go of its shape to scatter and sow.',
  secret: { char: 'W', xPct: 0.22, yPct: 0.25, sizePx: 96 },
  igCaption: [
    '004 — wind.',
    '',
    'part 4: until the wind sweeps in, letting go of its shape to scatter and sow.',
    '',
    'each print contains a hidden letter.',
    'six days. one word.',
    'collect them all.',
    '',
    '#mydither #generativeart #minimalism #creativecoding #remotion #dither #printdesign #motiondesign #monochrome #wind',
  ].join('\n'),
  xCaption: [
    '004 / wind.',
    'part 4: until the wind sweeps in, letting go of its shape to scatter and sow.',
    '',
    'each print contains a hidden letter. six days, one word. collect them all.',
    '',
    '#mydither #generativeart #design',
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
export default META;
