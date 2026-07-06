// src/days/004-wind/Wind.tsx
import { useEffect } from 'react';
import { delayRender, continueRender, staticFile, useCurrentFrame } from 'remotion';
import drawing from '../../../public/004/drawing.json';
import {
  stemGrowProgress,
  stemSkewX,
  windProgress,
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
      staticFile('004/wind.png'),
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
      img.onerror = handleLoad;
    });
  }, []);
}

export const Wind = () => {
  const frame = useCurrentFrame();
  const { stem, wind } = drawing;

  const stemProgress = stemGrowProgress(frame);
  const wProgress = windProgress(frame);
  const skewX = stemSkewX(frame);

  // The base of the stem is around x=280, y=1350 in the unscaled canvas
  const stemBaseX = 280;
  const stemBaseY = 1350;

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

        {/* Left-to-right wipe mask for the sweeping wind swooshes */}
        <mask id="wind-sweep-004" maskUnits="userSpaceOnUse">
          <rect width={1080} height={1920} fill="black" />
          <rect
            x={wind.left - 20}
            y={wind.top - 20}
            width={(wind.width + 40) * wProgress}
            height={wind.height + 40}
            fill="white"
          />
        </mask>
      </defs>

      {/* Wind swooshes in the background */}
      <image
        href={staticFile('004/wind.png')}
        x={wind.left}
        y={wind.top}
        width={wind.width}
        height={wind.height}
        mask="url(#wind-sweep-004)"
        style={{ opacity: 0.85 }} // slightly softer ink opacity for background wind swooshes
      />

      {/* Main plant stem and flower head, bending to the right */}
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
    </svg>
  );
};

// Wait for preload before Remotion rendering
const delayHandle = delayRender();
preloadPromise.then(() => {
  continueRender(delayHandle);
});
