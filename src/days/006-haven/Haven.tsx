// src/days/006-haven/Haven.tsx
import { useEffect } from 'react';
import { delayRender, continueRender, staticFile, useCurrentFrame } from 'remotion';
import drawing from '../../../public/006/drawing.json';
import {
  groundProgress,
  rippleProgress,
  sproutGrowth,
  dotProgress,
  dotOffsetY,
} from './beats';

export function useInkPreload() {
  useEffect(() => {
    const handle = delayRender('preload-haven-ink');
    const urls = [
      staticFile('006/sprout.png'),
      staticFile('006/dot.png'),
      staticFile('006/ground.png'),
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

export const Haven = () => {
  const frame = useCurrentFrame();
  const { sprout, dot, ground } = drawing;

  const gProgress = groundProgress(frame);
  const rProgress = rippleProgress(frame);
  const sGrowth = sproutGrowth(frame);
  const dProgress = dotProgress(frame);
  const dOffsetY = dotOffsetY(frame);

  // Sprout mask calculations: grows upwards from bottom (height decreases)
  const sproutBottom = sprout!.top + sprout!.height;
  const sproutMaskY = sproutBottom - sprout!.height * sGrowth;

  // Concentric background ripple parameters centered near sprout base
  const centerX = sprout!.left + sprout!.width / 2;
  const centerY = sproutBottom;

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
        {/* Left-to-right reveal mask for the ground */}
        <mask id="ground-wipe-006" maskUnits="userSpaceOnUse">
          <rect width={1080} height={1920} fill="black" />
          <rect
            x={ground!.left - 20}
            y={ground!.top - 20}
            width={(ground!.width + 40) * gProgress}
            height={ground!.height + 40}
            fill="white"
          />
        </mask>

        {/* Bottom-to-top grow mask for the sprout */}
        <mask id="sprout-grow-006" maskUnits="userSpaceOnUse">
          <rect width={1080} height={1920} fill="black" />
          <rect
            x={sprout!.left - 20}
            y={sproutMaskY - 10}
            width={sprout!.width + 40}
            height={1920 - sproutMaskY + 20}
            fill="white"
          />
        </mask>
      </defs>

      {/* Background ripples: concentric circles emanating from the sprout base */}
      {rProgress > 0 && (
        <g style={{ opacity: rProgress * 0.15 }} stroke="#1a1817" strokeWidth="2" fill="none">
          <circle cx={centerX} cy={centerY} r={80} strokeDasharray="4 4" />
          <circle cx={centerX} cy={centerY} r={180} strokeDasharray="6 6" />
          <circle cx={centerX} cy={centerY} r={280} strokeDasharray="8 8" />
        </g>
      )}

      {/* Ground/soil line */}
      <image
        href={staticFile('006/ground.png')}
        x={ground!.left}
        y={ground!.top}
        width={ground!.width}
        height={ground!.height}
        mask="url(#ground-wipe-006)"
      />

      {/* Sprout (rising upwards from soil) */}
      <image
        href={staticFile('006/sprout.png')}
        x={sprout!.left}
        y={sprout!.top}
        width={sprout!.width}
        height={sprout!.height}
        mask="url(#sprout-grow-006)"
      />

      {/* Dewdrop/Sun (descending and fading in) */}
      <image
        href={staticFile('006/dot.png')}
        x={dot!.left}
        y={dot!.top + dOffsetY}
        width={dot!.width}
        height={dot!.height}
        style={{
          opacity: dProgress,
        }}
      />
    </svg>
  );
};
