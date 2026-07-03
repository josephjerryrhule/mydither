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
  secret: { char: 'G', xPct: 0.70, yPct: 0.27, sizePx: 96 },
  igCaption: [
    '001 — branch.',
    '',
    'growth is mostly commitment: one line up, then seven honest detours.',
    'the dot above isn’t decoration — it’s what hasn’t happened yet.',
    '',
    'drawing: [source]',
    'sound: [artist — track]',
    '',
    'the hunt is on: six days, six pieces, one letter hiding in the grain of each.',
    'collect all six, in order. day six: DM me the word — partner shops are',
    'holding coupons + gifts for the ones who get it right. rules on slide one.',
    '',
    'day 1 of 6.',
    '',
    '#mydither #motion #dither #minimal #thehunt',
  ].join('\n'),
};
