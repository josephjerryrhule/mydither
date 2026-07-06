// src/system/DitherLayer.tsx
// Living paper: cream-on-cream procedural dither, frame-driven (deterministic).
import { Dithering } from '@paper-design/shaders-react';
import { useCurrentFrame } from 'remotion';
import { FPS } from './frames';
import { PALETTE } from './palette';

export const DEFAULT_DRIFT = 0.15;

export const DitherLayer = ({
  drift = DEFAULT_DRIFT,
  scale = 1,
}: {
  drift?: number;
  scale?: number;
}) => {
  const frame = useCurrentFrame();
  const shaderMs = (frame / FPS) * 1000 * drift;
  const size = Math.max(1, Math.round(2 * scale));

  return (
    <Dithering
      colorBack={PALETTE.paper}
      colorFront="#E7E3D6"
      shape="simplex"
      type="8x8"
      size={size}
      speed={0}
      frame={shaderMs}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
    />
  );
};
