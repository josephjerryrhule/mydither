// src/days/002-reflection/Scene.tsx
import { AbsoluteFill, staticFile, useCurrentFrame } from 'remotion';
import label from '../../../public/002/label.json';
import { DitherLayer } from '../../system/DitherLayer';
import { GalleryLabel } from '../../system/GalleryLabel';
import { placeSource, type CompSize } from '../../system/frames';
import { PALETTE } from '../../system/palette';
import { breathScale, labelIn, pushInScale } from './beats';
import { Dot } from './Dot';
import { Horizon, useInkPreload } from './Horizon';
import { Reflection } from './Reflection';
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
          transformOrigin: '50% 50%', // push-in centered on the horizon
        }}
      >
        <DitherLayer />
        <div style={{ position: 'absolute', left: offsetX, top: offsetY }}>
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
      />
    </AbsoluteFill>
  );
};
