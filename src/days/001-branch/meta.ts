// src/days/001-branch/meta.ts
export type Meta = {
  id: string;
  title: string;
  message: string;
  igCaption: string;
  secret: { char: string; xPct: number; yPct: number; sizePx: number };
};

export const META: Meta = {
  id: '001',
  title: '001 / branch',
  message: 'one line up, seven honest detours. the dot is tomorrow.',
  secret: { char: 'G', xPct: 0.70, yPct: 0.24, sizePx: 96 },
  igCaption: [
    '001 — branch.',
    '',
    'growth is mostly commitment: one line up, then seven honest detours.',
    'the dot above isn’t decoration — it’s what hasn’t happened yet.',
    '',
    'drawing: [source]',
    'sound: [artist — track]',
    '',
    'somewhere in the grain, one letter. collect them.',
    '',
    '#mydither #motion #dither #minimal',
  ].join('\n'),
};
