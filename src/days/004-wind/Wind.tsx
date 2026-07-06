// src/days/004-wind/Wind.tsx
import { useEffect } from 'react';
import { delayRender, continueRender, staticFile, useCurrentFrame } from 'remotion';
import drawing from '../../../public/004/drawing.json';
import {
  stemGrowProgress,
  stemSkewX,
  windProgress,
  windFlowOffset,
  seedProgress,
  seedOpacity,
} from './beats';

export function useInkPreload() {
  useEffect(() => {
    // Call delayRender inside useEffect when component is mounted, avoiding module-level timeout
    const handle = delayRender('preload-wind-ink');
    const urls = [
      staticFile('004/stem.png'),
      staticFile('004/wind.png'),
      staticFile('004/seed1.png'),
      staticFile('004/seed2.png'),
      staticFile('004/seed3.png'),
      staticFile('004/seed4.png'),
    ];
    let loaded = 0;
    const handleLoad = () => {
      loaded++;
      if (loaded === urls.length) {
        continueRender(handle);
      }
    };
    urls.forEach((url) => {
      const img = new Image();
      img.src = url;
      img.onload = handleLoad;
      img.onerror = handleLoad;
    });
  }, []);
}

export const Wind = () => {
  const frame = useCurrentFrame();
  const { stem, wind, seeds } = drawing;

  const stemProgress = stemGrowProgress(frame);
  const wProgress = windProgress(frame);
  const wOffset = windFlowOffset(frame);
  const skewX = stemSkewX(frame);

  // The base of the stem is around x=620, y=1055 in the unscaled canvas
  const stemBaseX = 620;
  const stemBaseY = 1055;

  // The origin point from which seeds detach (the bending flower head)
  const staticOriginX = 460;
  const staticOriginY = 380;

  const angleRad = (skewX * Math.PI) / 180;
  const cos = Math.cos(angleRad);
  const sin = Math.sin(angleRad);

  // Rotate static origin around stem base dynamically as it bends
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

      {/* Wind swooshes in the background, sliding leftwards and fading in */}
      <image
        href={staticFile('004/wind.png')}
        x={wind.left + wOffset}
        y={wind.top}
        width={wind.width}
        height={wind.height}
        style={{ opacity: wProgress * 0.85 }}
      />

      {/* Main plant stem and flower head, bending to the left */}
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

      {/* Floating Seeds flying from the bending flower head to their drawn positions */}
      {seeds.map((seed, i) => {
        const p = seedProgress(frame, i);
        const opacity = seedOpacity(frame, i);

        // Interpolate position from the flower head origin to final drawn coordinate
        const x = originX + (seed.left - originX) * p;
        const y = originY + (seed.top - originY) * p;

        // Add a slight spin/rotation to the seeds as they fly
        const seedRotation = (1 - p) * -45;

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
