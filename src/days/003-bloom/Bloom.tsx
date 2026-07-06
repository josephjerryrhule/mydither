// src/days/003-bloom/Bloom.tsx
import { useEffect, useState } from 'react';
import { continueRender, delayRender, staticFile, useCurrentFrame } from 'remotion';
import drawing from '../../../public/003/drawing.json';
import { flowerBloom, stemReveal } from './beats';

const INK_SPRITES = ['003/flower.png', '003/stem.png', '003/label.png'];

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

export const Bloom = () => {
  const frame = useCurrentFrame();
  const f = drawing.flower;
  const s = drawing.stem;

  const stemProgress = stemReveal(frame);
  const bloomProgress = flowerBloom(frame);

  return (
    <svg
      viewBox="0 0 1080 1920"
      width={1080}
      height={1920}
      style={{ position: 'absolute', top: 0, left: 0 }}
    >
      <defs>
        {/* Bottom-to-top reveal mask for the stem */}
        <mask id="stem-grow" maskUnits="userSpaceOnUse">
          <rect width={1080} height={1920} fill="black" />
          <rect
            x={s.left - 10}
            y={s.top + s.height * (1 - stemProgress)}
            width={s.width + 20}
            height={s.height * stemProgress + 10}
            fill="white"
          />
        </mask>
      </defs>

      {/* Stem layer */}
      <image
        href={staticFile('003/stem.png')}
        x={s.left}
        y={s.top}
        width={s.width}
        height={s.height}
        mask="url(#stem-grow)"
      />

      {/* Flower head layer (blooms from its connection point to the stem: bottom center of flower box) */}
      {bloomProgress > 0 && (
        <g
          style={{
            transform: `scale(${bloomProgress})`,
            transformOrigin: `${f.left + f.width / 2}px ${f.top + f.height}px`,
          }}
        >
          <image
            href={staticFile('003/flower.png')}
            x={f.left}
            y={f.top}
            width={f.width}
            height={f.height}
          />
        </g>
      )}
    </svg>
  );
};
