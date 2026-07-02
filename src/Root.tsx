import { Composition } from 'remotion';
import { AbsoluteFill } from 'remotion';
import { PALETTE } from './system/palette';
import { COMPS, DURATION, FPS } from './system/frames';
import { DitherLayer } from './system/DitherLayer';
import { TraceOverlay } from './days/001-branch/TraceOverlay';
import layout from '../public/001/layout.json';

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
    <Composition
      id="TraceOverlay"
      component={TraceOverlay}
      durationInFrames={1}
      fps={FPS}
      width={layout.branch.width * 4}
      height={layout.branch.height * 4}
    />
  </>
);
