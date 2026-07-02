// src/days/001-branch/Scene.tsx
import { AbsoluteFill, Freeze, useCurrentFrame } from 'remotion';
import { CaptionCard } from '../../system/CaptionCard';
import { DitherLayer } from '../../system/DitherLayer';
import { COMPS, placeSource, type CompSize } from '../../system/frames';
import { PALETTE } from '../../system/palette';
import { Branch, useInkPreload } from './Branch';
import { breathScale, cardRise, creditIn, messageIn, pushInScale } from './beats';
import { Dot } from './Dot';
import { META } from './meta';

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
          <Branch />
          <Dot />
        </div>
      </div>
      <CaptionCard
        rise={cardRise(frame)}
        messageIn={messageIn(frame)}
        creditIn={creditIn(frame)}
        message={META.message}
        creditLine={META.creditLine}
      />
    </AbsoluteFill>
  );
};

export const CardStill = () => (
  <Freeze frame={350}>
    <Scene comp={COMPS.fourFive} />
  </Freeze>
);
