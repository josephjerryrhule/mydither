// scripts/dither-hunt-003.mts
// Hunt-rules slide sprites for 003 — full-slide (1080×1350) dithered monospace.
import sharp from 'sharp';
import { mkdirSync, writeFileSync } from 'node:fs';

const OUT_DIR = 'public/003';
const PAPER_LUM = 225;
const INK_LUM = 60;
const GATE_LO = 0.12;
const GATE_HI = 0.85;
const INK = [0x1a, 0x18, 0x17];

const BAYER8 = [
  [0, 32, 8, 40, 2, 34, 10, 42],
  [48, 16, 56, 24, 50, 18, 58, 26],
  [12, 44, 4, 36, 14, 46, 6, 38],
  [60, 28, 52, 20, 62, 30, 54, 22],
  [3, 35, 11, 43, 1, 33, 9, 41],
  [51, 19, 59, 27, 49, 17, 57, 25],
  [15, 47, 7, 39, 13, 45, 5, 37],
  [63, 31, 55, 23, 61, 29, 53, 21],
];

const escapeXml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const FONT = `'Courier New', Courier, monospace`;
const W = 1080;
const H = 1350;
const LEFT = 120;
const LEAD = 40;

type Line = string | null | { text: string; bold: true };

const buildSvg = (body: Line[]) => {
  let y = 470;
  const lines = body.map((line) => {
    if (line === null) { y += LEAD / 2; return ''; }
    const text = typeof line === 'string' ? line : line.text;
    const bold = typeof line === 'object' && line.bold ? ' font-weight="bold"' : '';
    const t = `<text x="${LEFT}" y="${y}" font-size="22" letter-spacing="1"${bold}>${escapeXml(text)}</text>`;
    y += LEAD;
    return t;
  }).join('\n    ');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#ffffff"/>
  <g font-family="${FONT}" fill="#000000">
    <text x="${LEFT}" y="390" font-size="34" font-weight="bold" letter-spacing="6">THE HUNT</text>
    ${lines}
  </g>
</svg>`;
};

const ditherSlide = async (svg: string, name: string) => {
  const { data, info } = await sharp(Buffer.from(svg)).flatten({ background: '#ffffff' }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: RW, height: RH, channels: C } = info;
  const px = Buffer.alloc(RW * RH * 4);
  let on = 0;
  for (let yy = 0; yy < RH; yy++)
    for (let xx = 0; xx < RW; xx++) {
      const i = (yy * RW + xx) * C;
      const lum = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
      let a = (PAPER_LUM - lum) / (PAPER_LUM - INK_LUM);
      a = Math.min(1, Math.max(0, a));
      if (a < GATE_LO) a = 0;
      if (a > GATE_HI) a = 1;
      if (a * 64 > BAYER8[yy % 8][xx % 8] + 0.5) {
        const o = (yy * RW + xx) * 4;
        px[o] = INK[0]; px[o + 1] = INK[1]; px[o + 2] = INK[2]; px[o + 3] = 255;
        on++;
      }
    }
  if (on === 0) throw new Error(`${name}.png: 0 lit pixels — SVG text failed to rasterize. BLOCKED.`);
  await sharp(px, { raw: { width: RW, height: RH, channels: 4 } }).png({ compressionLevel: 9 }).toFile(`${OUT_DIR}/${name}.png`);
  writeFileSync(`${OUT_DIR}/${name}.json`, JSON.stringify({ width: RW, height: RH }, null, 2));
  console.log(`${name} ${RW}x${RH} (${on} ink px)`);
};

const HANDLE = '@meet.joes';

const OWN: Line[] = [
  'six days. six pieces.',
  'one letter hides in the grain',
  'of each — pause. look closer.',
  null,
  'collect all six, in order.',
  'day six: DM me the word.',
  null,
  'partner shops are holding',
  'coupons + gifts for the ones',
  'who get it right.',
  'shops revealed on the final day.',
  null,
  { text: 'day three. three letters now.', bold: true },
];

const SHOP: Line[] = [
  'we hid something.',
  null,
  `six days. six pieces. over at`,
  `${HANDLE} — one letter in the`,
  'grain of each. pause. look closer.',
  null,
  'collect all six, in order.',
  `day six: DM ${HANDLE} the word.`,
  null,
  "get it right — we're holding",
  'coupons + gifts for you.',
  null,
  { text: "day three — still time.", bold: true },
];

mkdirSync(OUT_DIR, { recursive: true });
await ditherSlide(buildSvg(OWN), 'hunt');
await ditherSlide(buildSvg(SHOP), 'hunt-shop');
