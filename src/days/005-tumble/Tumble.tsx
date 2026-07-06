// src/days/005-tumble/Tumble.tsx
import { useEffect } from 'react';
import { delayRender, continueRender, staticFile, useCurrentFrame } from 'remotion';
import drawing from '../../../public/005/drawing.json';
import {
  groundProgress,
  trailOpacity,
  seed1Progress,
  seed2Progress,
  seedRotation,
  seedOpacity,
  BEATS,
} from './beats';

export function useInkPreload() {
  useEffect(() => {
    const handle = delayRender('preload-tumble-ink');
    const urls = [
      staticFile('005/seed1.png'),
      staticFile('005/seed2.png'),
      staticFile('005/ground.png'),
      staticFile('005/trail.png'),
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

export const Tumble = () => {
  const frame = useCurrentFrame();
  const { seed1, seed2, ground, trail } = drawing;

  const gProgress = groundProgress(frame);
  const tOpacity = trailOpacity(frame);
  const s1Progress = seed1Progress(frame);
  const s2Progress = seed2Progress(frame);

  // Seed 1: falls from off-screen top-left to its drawn position
  const s1StartX = seed1!.left - 200;
  const s1StartY = seed1!.top - 400;
  const s1X = s1StartX + (seed1!.left - s1StartX) * s1Progress;
  const s1Y = s1StartY + (seed1!.top - s1StartY) * s1Progress;
  const s1Rotation = seedRotation(frame, BEATS.seed1.start, BEATS.seed1.end);
  const s1Opacity = seedOpacity(frame, BEATS.seed1.start);

  // Seed 2: falls from upper area to its drawn position
  const s2StartX = seed2!.left - 150;
  const s2StartY = seed2!.top - 350;
  const s2X = s2StartX + (seed2!.left - s2StartX) * s2Progress;
  const s2Y = s2StartY + (seed2!.top - s2StartY) * s2Progress;
  const s2Rotation = seedRotation(frame, BEATS.seed2.start, BEATS.seed2.end);
  const s2Opacity = seedOpacity(frame, BEATS.seed2.start);

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
        <mask id="ground-wipe-005" maskUnits="userSpaceOnUse">
          <rect width={1080} height={1920} fill="black" />
          <rect
            x={ground!.left - 20}
            y={ground!.top - 20}
            width={(ground!.width + 40) * gProgress}
            height={ground!.height + 40}
            fill="white"
          />
        </mask>
      </defs>

      {/* Ground/soil line, wiped left-to-right */}
      <image
        href={staticFile('005/ground.png')}
        x={ground!.left}
        y={ground!.top}
        width={ground!.width}
        height={ground!.height}
        mask="url(#ground-wipe-005)"
      />

      {/* Faint air trail lines, fading in */}
      <image
        href={staticFile('005/trail.png')}
        x={trail!.left}
        y={trail!.top}
        width={trail!.width}
        height={trail!.height}
        style={{ opacity: tOpacity * 0.6 }}
      />

      {/* Seed 1 (upper, tumbling from top-left) */}
      <image
        href={staticFile('005/seed1.png')}
        x={s1X}
        y={s1Y}
        width={seed1!.width}
        height={seed1!.height}
        style={{
          opacity: s1Opacity,
          transform: `rotate(${s1Rotation}deg)`,
          transformOrigin: `${s1X + seed1!.width / 2}px ${s1Y + seed1!.height / 2}px`,
        }}
      />

      {/* Seed 2 (lower, tumbling after seed 1) */}
      <image
        href={staticFile('005/seed2.png')}
        x={s2X}
        y={s2Y}
        width={seed2!.width}
        height={seed2!.height}
        style={{
          opacity: s2Opacity,
          transform: `rotate(${s2Rotation}deg)`,
          transformOrigin: `${s2X + seed2!.width / 2}px ${s2Y + seed2!.height / 2}px`,
        }}
      />
    </svg>
  );
};
