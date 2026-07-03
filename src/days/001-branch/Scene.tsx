// src/days/001-branch/Scene.tsx
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { DitherLayer } from '../../system/DitherLayer';
import { GalleryLabel } from '../../system/GalleryLabel';
import { placeSource, type CompSize } from '../../system/frames';
import { PALETTE } from '../../system/palette';
import { Branch, useInkPreload } from './Branch';
import { breathScale, labelIn, pushInScale } from './beats';
import { Dot } from './Dot';
import { Secret } from './Secret';

export const Scene = ({ comp }: { comp: CompSize }) => {
  useInkPreload();
  const frame = useCurrentFrame();
  const { offsetX, offsetY } = placeSource(comp);
  const scale = breathScale(frame) * pushInScale(frame);

  return (
    <AbsoluteFill style={{ backgroundColor: PALETTE.paper, overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `scale(${scale})`,
          transformOrigin: '50% 46%', // slightly above center: push-in leans into the mark
        }}
      >
        <DitherLayer />
        <div style={{ position: 'absolute', left: offsetX, top: offsetY }}>
          <Secret />
          <Branch />
          <Dot />
        </div>
      </div>
      <GalleryLabel progress={labelIn(frame)} />
    </AbsoluteFill>
  );
};
