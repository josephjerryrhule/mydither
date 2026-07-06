// src/days/001-branch/Scene.tsx
import { AbsoluteFill, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import label from '../../../public/001/label.json';
import { DitherLayer } from '../../system/DitherLayer';
import { GalleryLabel } from '../../system/GalleryLabel';
import { type CompSize } from '../../system/frames';
import { PALETTE } from '../../system/palette';
import { Branch, useInkPreload } from './Branch';
import { breathScale, labelIn, pushInScale } from './beats';
import { Dot } from './Dot';
import { Secret } from './Secret';

export const Scene = ({ comp }: { comp: CompSize }) => {
  useInkPreload();
  const frame = useCurrentFrame();
  const { width: renderW, height: renderH } = useVideoConfig();

  // Calculate relative layout scale based on the actual render viewport height
  // (e.g. if rendering a 16:9 composition at 9000x6000 print size, scaleFactor is 6000 / 1080 = 5.555)
  const scaleFactor = renderH / comp.height;
  const zoom = breathScale(frame) * pushInScale(frame);

  // Position and dimension calculations for the centered vertical drawing frame
  const drawW = 1080 * scaleFactor;
  const drawH = 1920 * scaleFactor;
  const drawLeft = (renderW - drawW) / 2;
  const drawTop = (renderH - drawH) / 2;

  return (
    <AbsoluteFill style={{ backgroundColor: PALETTE.paper, overflow: 'hidden' }}>
      <DitherLayer scale={scaleFactor} />
      <div
        style={{
          position: 'absolute',
          left: drawLeft,
          top: drawTop,
          width: 1080,
          height: 1920,
          transform: `scale(${scaleFactor * zoom})`,
          transformOrigin: '50% 46%',
        }}
      >
        <Secret />
        <Branch />
        <Dot />
      </div>
      <GalleryLabel
        src={staticFile('001/label.png')}
        width={label.width}
        height={label.height}
        progress={labelIn(frame)}
        bottom={comp.height / comp.width > 1.5 ? 250 : 64}
        scale={scaleFactor}
      />
    </AbsoluteFill>
  );
};
