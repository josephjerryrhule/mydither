// src/days/004-wind/Scene.tsx
import { AbsoluteFill, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import label from '../../../public/004/label.json';
import { DitherLayer } from '../../system/DitherLayer';
import { GalleryLabel } from '../../system/GalleryLabel';
import { type CompSize } from '../../system/frames';
import { PALETTE } from '../../system/palette';
import { Wind, useInkPreload } from './Wind';
import { breathScale, labelIn, pushInScale } from './beats';
import { Secret } from './Secret';

export const Scene = ({ comp }: { comp: CompSize }) => {
  useInkPreload();
  const frame = useCurrentFrame();
  const { width: renderW, height: renderH } = useVideoConfig();

  // Print detection (width = 9000, height = 6000 for 30x20 print canvas)
  const isPrint = renderH > 2000;

  // Calculate relative layout scale based on the actual render viewport height
  const scaleFactor = renderH / comp.height;
  const zoom = breathScale(frame) * pushInScale(frame);

  // Center coordinates for the unscaled container
  const left = (renderW - 1080 * scaleFactor) / 2;
  const top = (renderH - 1920 * scaleFactor) / 2;

  return (
    <AbsoluteFill style={{ backgroundColor: PALETTE.paper, overflow: 'hidden' }}>
      {/* 
        WebGL Dither Background:
        Upscaled dynamically based on comp dimensions to maintain spacious grain on print.
      */}
      <div
        style={{
          position: 'absolute',
          left: (renderW - comp.width * scaleFactor) / 2,
          top: (renderH - comp.height * scaleFactor) / 2,
          width: comp.width,
          height: comp.height,
          transform: `scale(${scaleFactor})`,
          transformOrigin: 'top left',
          imageRendering: 'pixelated',
          overflow: 'hidden',
        }}
      >
        <DitherLayer scale={1} />
      </div>

      <div
        style={{
          position: 'absolute',
          left,
          top,
          width: 1080,
          height: 1920,
          transform: `scale(${scaleFactor})`,
          transformOrigin: 'top left',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            transform: `scale(${zoom})`,
            transformOrigin: '50% 48%',
          }}
        >
          {/* Hide the treasure-hunt secret glyph on print gallery versions */}
          {!isPrint && <Secret />}
          {/* Wind animation layers */}
          <Wind />
        </div>
      </div>
      <GalleryLabel
        src={staticFile('004/label.png')}
        width={label.width}
        height={label.height}
        progress={labelIn(frame)}
        bottom={comp.height / comp.width > 1.5 ? 250 : 64}
        scale={scaleFactor}
      />
    </AbsoluteFill>
  );
};
