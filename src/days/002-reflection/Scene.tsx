// src/days/002-reflection/Scene.tsx
import { AbsoluteFill, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import label from '../../../public/002/label.json';
import { DitherLayer } from '../../system/DitherLayer';
import { GalleryLabel } from '../../system/GalleryLabel';
import { type CompSize } from '../../system/frames';
import { PALETTE } from '../../system/palette';
import { breathScale, labelIn, pushInScale } from './beats';
import { Dot } from './Dot';
import { Horizon, useInkPreload } from './Horizon';
import { Reflection } from './Reflection';
import { Secret } from './Secret';

export const Scene = ({ comp }: { comp: CompSize }) => {
  useInkPreload();
  const frame = useCurrentFrame();
  const { width: renderW, height: renderH } = useVideoConfig();

  // Print detection (width = 9000, height = 6000 for 30x20 print canvas)
  const isPrint = renderH > 2000;
  
  // Calculate relative layout scale based on the actual render viewport height
  // (e.g. if rendering a 16:9 composition at 9000x6000 print size, scaleFactor is 6000 / 1080 = 5.555)
  const scaleFactor = renderH / comp.height;
  const zoom = breathScale(frame) * pushInScale(frame);

  // Center coordinates for the unscaled container
  const left = (renderW - 1080 * scaleFactor) / 2;
  const top = (renderH - 1920 * scaleFactor) / 2;

  return (
    <AbsoluteFill style={{ backgroundColor: PALETTE.paper, overflow: 'hidden' }}>
      {/* 
        WebGL Dither Background:
        To keep the dither texture spacious and identical to the video (not compacted/dense),
        we render the shader natively at 1920x1080 with size={2} and upscale it using CSS
        pixelated interpolation.
      */}
      <div
        style={{
          position: 'absolute',
          left: (renderW - 1920 * scaleFactor) / 2,
          top: 0,
          width: 1920,
          height: 1080,
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
            transformOrigin: '50% 50%',
          }}
        >
          {/* Hide the treasure-hunt secret glyph on print gallery versions */}
          {!isPrint && <Secret />}
          <Horizon />
          <Dot />
          <Reflection />
        </div>
      </div>
      <GalleryLabel
        src={staticFile('002/label.png')}
        width={label.width}
        height={label.height}
        progress={labelIn(frame)}
        bottom={comp.height / comp.width > 1.5 ? 250 : 64}
        scale={scaleFactor}
      />
    </AbsoluteFill>
  );
};
