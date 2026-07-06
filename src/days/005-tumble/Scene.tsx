// src/days/005-tumble/Scene.tsx
import { AbsoluteFill, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import label from '../../../public/005/label.json';
import { DitherLayer } from '../../system/DitherLayer';
import { GalleryLabel } from '../../system/GalleryLabel';
import { type CompSize } from '../../system/frames';
import { PALETTE } from '../../system/palette';
import { Tumble, useInkPreload } from './Tumble';
import { breathScale, labelIn, pushInScale } from './beats';
import { Secret } from './Secret';

export const Scene = ({ comp }: { comp: CompSize }) => {
  useInkPreload();
  const frame = useCurrentFrame();
  const { width: renderW, height: renderH } = useVideoConfig();

  const isPrint = renderH > 2000;
  const scaleFactor = renderH / comp.height;
  const zoom = breathScale(frame) * pushInScale(frame);

  const left = (renderW - 1080 * scaleFactor) / 2;
  const top = (renderH - 1920 * scaleFactor) / 2;

  return (
    <AbsoluteFill style={{ backgroundColor: PALETTE.paper, overflow: 'hidden' }}>
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
          {!isPrint && <Secret />}
          <Tumble />
        </div>
      </div>
      <GalleryLabel
        src={staticFile('005/label.png')}
        width={label.width}
        height={label.height}
        progress={labelIn(frame)}
        bottom={comp.height / comp.width > 1.5 ? 250 : 180}
        scale={scaleFactor}
      />
    </AbsoluteFill>
  );
};
