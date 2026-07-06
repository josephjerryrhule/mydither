// src/days/004-wind/Wind.tsx
import { useEffect } from 'react';
import { delayRender, continueRender, staticFile, useCurrentFrame } from 'remotion';
import drawing from '../../../public/004/drawing.json';
import {
  stemGrowProgress,
  stemSkewX,
  seedProgress,
  seedOpacity,
} from './beats';

// Preload handle to ensure images are fully loaded before rendering frames
let resolvePreload: () => void;
const preloadPromise = new Promise<void>((resolve) => {
  resolvePreload = resolve;
});

export function useInkPreload() {
  useEffect(() => {
    const urls = [
      staticFile('004/stem.png'),
      staticFile('004/seed1.png'),
      staticFile('004/seed2.png'),
      staticFile('004/seed3.png'),
    ];
    let loaded = 0;
    const handleLoad = () => {
      loaded++;
      if (loaded === urls.length) {
        resolvePreload();
      }
    };
    urls.forEach((url) => {
      const img = new Image();
      img.src = url;
      img.onload = handleLoad;
      img.onerror = handleLoad; // don't block forever on network failure
    });
  }, []);
}

export const Wind = () => {
  const frame = useCurrentFrame();
  const { stem, seeds } = drawing;

  const stemProgress = stemGrowProgress(frame);
  const skewX = stemSkewX(frame);

  // The base of the stem is around x=820, y=1345 in the unscaled canvas
  const stemBaseX = 820;
  const stemBaseY = 1345;

  // The origin point from which seeds detach (the bending flower head)
  // Since the stem bends, the flower head origin also shifts to the left!
  // We can calculate the shifted origin by rotating the static origin point (500, 700)
  // around the stem base (stemBaseX, stemBaseY) by the current skew/rotation angle.
  const staticOriginX = 500;
  const staticOriginY = 700;

  const angleRad = (skewX * Math.PI) / 180;
  const cos = Math.cos(angleRad);
  const sin = Math.sin(angleRad);

  // Rotate static origin around stem base
  const originX = stemBaseX + (staticOriginX - stemBaseX) * cos - (staticOriginY - stemBaseY) * sin;
  const originY = stemBaseY + (staticOriginX - stemBaseX) * sin + (staticOriginY - stemBaseY) * cos;

  return (
    <svg
      width={1080}
      height={1920}
      viewBox="0 0 1080 1920"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      }}
    >
      <defs>
        {/* Bottom-to-top reveal mask for the stem */}
        <mask id="stem-grow-004" maskUnits="userSpaceOnUse">
          <rect width={1080} height={1920} fill="black" />
          <rect
            x={stem.left - 20}
            y={stem.top + stem.height * (1 - stemProgress)}
            width={stem.width + 40}
            height={stem.height * stemProgress + 20}
            fill="white"
          />
        </mask>
      </defs>

      {/* Main plant stem and leaves */}
      <g transform={`rotate(${skewX}, ${stemBaseX}, ${stemBaseY})`}>
        <image
          href={staticFile('004/stem.png')}
          x={stem.left}
          y={stem.top}
          width={stem.width}
          height={stem.height}
          mask="url(#stem-grow-004)"
        />
      </g>

      {/* Floating Seeds */}
      {seeds.map((seed, i) => {
        const p = seedProgress(frame, i);
        const opacity = seedOpacity(frame, i);

        // Interpolate position from the flower head origin to final drawn coordinate
        const x = originX + (seed.left - originX) * p;
        const y = originY + (seed.top - originY) * p;

        // Add a slight spin/rotation to the seeds as they fly
        const seedRotation = (1 - p) * 45;

        return (
          <image
            key={i}
            href={staticFile(`004/seed${i + 1}.png`)}
            x={x}
            y={y}
            width={seed.width}
            height={seed.height}
            style={{
              opacity,
              transform: `rotate(${seedRotation}deg)`,
              transformOrigin: `${x + seed.width / 2}px ${y + seed.height / 2}px`,
            }}
          />
        );
      })}
    </svg>
  );
};

// Wait for preload before Remotion rendering
const delayHandle = delayRender();
preloadPromise.then(() => {
  continueRender(delayHandle);
});
