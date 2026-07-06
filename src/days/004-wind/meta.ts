// src/days/004-wind/meta.ts
export const META = {
  id: '004',
  title: '004 / wind',
  message: 'let go of the shape you held: to scatter is to sow.',
  // W sits in the top-left area, hidden in the paper grain
  secret: { char: 'W', xPct: 0.22, yPct: 0.25, sizePx: 96 },
  igCaption: [
    '004 — wind.',
    '',
    'let go of the shape you held:',
    'to scatter is to sow.',
    '',
    'each print contains a hidden letter.',
    'six days. one word.',
    'collect them all.',
  ],
};
export type MetaType = typeof META;
export default META;
