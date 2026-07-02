// src/days/001-branch/Dot.tsx
// The dot is never drawn — grain condenses into it.
import { random, staticFile, useCurrentFrame } from 'remotion';
import layout from '../../../public/001/layout.json';
import { PALETTE } from '../../system/palette';
import { dotConvergence, dotSpriteOpacity } from './beats';

const SPECKS = 90;
const SCATTER_R = 90;
const SPECK = 3;

export const Dot = () => {
  const frame = useCurrentFrame();
  const d = layout.dot;
  const cx = d.x + d.width / 2;
  const cy = d.y + d.height / 2;
  const conv = dotConvergence(frame);
  const sprite = dotSpriteOpacity(frame);
  if (conv === 0) return null;

  return (
    <svg
      viewBox={`0 0 ${layout.frame.width} ${layout.frame.height}`}
      width={layout.frame.width}
      height={layout.frame.height}
      style={{ position: 'absolute', top: 0, left: 0 }}
    >
      {conv < 1 &&
        Array.from({ length: SPECKS }, (_, i) => {
          const ang = random(`dot-ang-${i}`) * Math.PI * 2;
          const rad = Math.sqrt(random(`dot-rad-${i}`)) * SCATTER_R;
          const delay = random(`dot-del-${i}`) * 0.35;
          const p = Math.min(1, Math.max(0, (conv - delay) / (1 - delay)));
          const x = cx + Math.cos(ang) * rad * (1 - p);
          const y = cy + Math.sin(ang) * rad * (1 - p);
          const opacity = p < 0.1 ? p * 10 : 1 - sprite; // in fast, out as sprite lands
          return (
            <rect
              key={i}
              x={x - SPECK / 2}
              y={y - SPECK / 2}
              width={SPECK}
              height={SPECK}
              fill={PALETTE.ink}
              opacity={opacity}
            />
          );
        })}
      <image
        href={staticFile('001/dot.png')}
        x={d.x}
        y={d.y}
        width={d.width}
        height={d.height}
        opacity={sprite}
      />
    </svg>
  );
};
