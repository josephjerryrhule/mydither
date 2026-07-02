import { Composition } from 'remotion';
import { AbsoluteFill } from 'remotion';
import { PALETTE } from './system/palette';
import { COMPS, DURATION, FPS } from './system/frames';
import { DitherLayer } from './system/DitherLayer';

const Placeholder = () => (
  <AbsoluteFill style={{ backgroundColor: PALETTE.paper }}>
    <DitherLayer />
  </AbsoluteFill>
);

export const Root = () => (
  <>
    <Composition
      id="Day001-16x9"
      component={Placeholder}
      durationInFrames={DURATION}
      fps={FPS}
      width={COMPS.sixteenNine.width}
      height={COMPS.sixteenNine.height}
    />
  </>
);
