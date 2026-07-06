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
  
  // Calculate relative layout scale based on the actual render viewport height
  // (e.g. if rendering a 16:9 composition at 9000x6000 print size, scaleFactor is 6000 / 1080 = 5.555)
  const scaleFactor = renderH / comp.height;
  const zoom = breathScale(frame) * pushInScale(frame);

  // Center coordinates for the unscaled container
  const left = (renderW - 1080 * scaleFactor) / 2;
  const top = (renderH - 1920 * scaleFactor) / 2;

  return (
    <AbsoluteFill style={{ backgroundColor: PALETTE.paper, overflow: 'hidden' }}>
      <DitherLayer scale={scaleFactor} />
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
          <Secret />
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
