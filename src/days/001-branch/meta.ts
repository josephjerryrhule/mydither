// src/days/001-branch/meta.ts
export type Meta = {
  id: string;
  title: string;
  message: string;
  creditLine: string;
  igCaption: string;
};

export const META: Meta = {
  id: '001',
  title: '001 / branch',
  message: 'one line up, seven honest detours. the dot is tomorrow.',
  creditLine: 'drawing — source in caption · sound — credited in caption',
  igCaption: [
    '001 — branch.',
    '',
    'growth is mostly commitment: one line up, then seven honest detours.',
    'the dot above isn’t decoration — it’s what hasn’t happened yet.',
    '',
    'drawing: [source]',
    'sound: [artist — track]',
    '',
    '#mydither #motion #dither #minimal',
  ].join('\n'),
};
