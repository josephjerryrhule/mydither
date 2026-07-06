// src/days/003-bloom/Bloom.tsx
import { useEffect, useState } from 'react';
import { continueRender, delayRender, staticFile, useCurrentFrame } from 'remotion';
import drawing from '../../../public/003/drawing.json';
import {
  stemReveal,
  flowerLeftProgress,
  flowerRightProgress,
  flowerCenterProgress,
} from './beats';

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
  const leftProgress = flowerLeftProgress(frame);
  const rightProgress = flowerRightProgress(frame);
  const centerProgress = flowerCenterProgress(frame);

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

        {/* Staggered calligraphic drawing mask for the flower head */}
        <mask id="flower-draw" maskUnits="userSpaceOnUse">
          <rect width={1080} height={1920} fill="black" />
          {/* Left sepal brush line */}
          <path
            d="M 541 930 C 510 900, 480 870, 495 830"
            pathLength={1}
            stroke="white"
            strokeWidth={45}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={1}
            strokeDashoffset={1 - leftProgress}
          />
          {/* Right sepal brush line */}
          <path
            d="M 541 930 C 570 900, 600 870, 585 830"
            pathLength={1}
            stroke="white"
            strokeWidth={45}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={1}
            strokeDashoffset={1 - rightProgress}
          />
          {/* Central petals brush line */}
          <path
            d="M 541 930 Q 541 870, 541 810"
            pathLength={1}
            stroke="white"
            strokeWidth={60}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={1}
            strokeDashoffset={1 - centerProgress}
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

      {/* Flower head layer (drawn on by the flower-draw mask) */}
      <image
        href={staticFile('003/flower.png')}
        x={f.left}
        y={f.top}
        width={f.width}
        height={f.height}
        mask="url(#flower-draw)"
      />
    </svg>
  );
};
