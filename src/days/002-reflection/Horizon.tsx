// src/days/002-reflection/Horizon.tsx
// The horizon line, revealed by a left→right mask wipe over the line sprite.
// The dot's columns are punched from this sprite (Task 1), so the center stays
// open until the dot lands.
import { useEffect, useState } from 'react';
import { continueRender, delayRender, staticFile, useCurrentFrame } from 'remotion';
import layout from '../../../public/002/layout.json';
import { horizonWipe } from './beats';

const INK_SPRITES = ['002/line.png', '002/dot.png', '002/reflection.png'];

export const useInkPreload = () => {
  const [handle] = useState(() => delayRender('preload ink sprites'));
  useEffect(() => {
    let done = 0;
    const loaded = () => { if (++done === INK_SPRITES.length) continueRender(handle); };
    for (const f of INK_SPRITES) {
      const img = new Image();
      img.onload = loaded;
      img.onerror = loaded;
      img.src = staticFile(f);
    }
  }, [handle]);
};

export const Horizon = () => {
  const frame = useCurrentFrame();
  const l = layout.line;
  const reveal = horizonWipe(frame);
  return (
    <svg
      viewBox={`0 0 ${layout.frame.width} ${layout.frame.height}`}
      width={layout.frame.width}
      height={layout.frame.height}
      style={{ position: 'absolute', top: 0, left: 0 }}
    >
      <defs>
        <mask id="horizon-wipe" maskUnits="userSpaceOnUse">
          <rect width={layout.frame.width} height={layout.frame.height} fill="black" />
          <rect x={l.x} y={l.y} width={l.width * reveal} height={l.height} fill="white" />
        </mask>
      </defs>
      <image
        href={staticFile('002/line.png')}
        x={l.x}
        y={l.y}
        width={l.width}
        height={l.height}
        mask="url(#horizon-wipe)"
      />
    </svg>
  );
};
