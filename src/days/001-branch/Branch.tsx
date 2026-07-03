// src/days/001-branch/Branch.tsx
import { useEffect, useState } from 'react';
import { continueRender, delayRender, staticFile, useCurrentFrame } from 'remotion';
import layout from '../../../public/001/layout.json';
import { stemProgress, twigProgress } from './beats';
import { STEM, TWIGS } from './limbs';

const INK_SPRITES = ['001/branch.png', '001/dot.png', '001/secret.png'];

export const useInkPreload = () => {
  const [handle] = useState(() => delayRender('preload ink sprites'));
  useEffect(() => {
    let done = 0;
    const loaded = () => { if (++done === INK_SPRITES.length) continueRender(handle); };
    for (const f of INK_SPRITES) {
      const img = new Image();
      img.onload = loaded;
      img.onerror = loaded; // fail visible, not hung — sprite 404s show as blank
      img.src = staticFile(f);
    }
  }, [handle]);
};

export const Branch = () => {
  const frame = useCurrentFrame();
  const b = layout.branch;
  return (
    <svg
      viewBox={`0 0 ${layout.frame.width} ${layout.frame.height}`}
      width={layout.frame.width}
      height={layout.frame.height}
      style={{ position: 'absolute', top: 0, left: 0 }}
    >
      <defs>
        <mask id="branch-write-on" maskUnits="userSpaceOnUse">
          <rect width={layout.frame.width} height={layout.frame.height} fill="black" />
          <g transform={`translate(${b.x} ${b.y})`}>
            <path
              d={STEM.d}
              pathLength={1}
              stroke="white"
              strokeWidth={STEM.width}
              strokeLinecap="round"
              fill="none"
              strokeDasharray={1}
              strokeDashoffset={1 - stemProgress(frame)}
            />
            {TWIGS.map((t, i) => (
              <path
                key={i}
                d={t.d}
                pathLength={1}
                stroke="white"
                strokeWidth={t.width}
                strokeLinecap="round"
                fill="none"
                strokeDasharray={1}
                strokeDashoffset={1 - twigProgress(frame, i)}
              />
            ))}
          </g>
        </mask>
      </defs>
      <image
        href={staticFile('001/branch.png')}
        x={b.x}
        y={b.y}
        width={b.width}
        height={b.height}
        mask="url(#branch-write-on)"
      />
    </svg>
  );
};
