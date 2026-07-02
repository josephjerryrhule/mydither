import { Composition, Still } from 'remotion';
import { COMPS, DURATION, FPS } from './system/frames';
import { CardStill, Scene } from './days/001-branch/Scene';

export const Root = () => (
  <>
    <Composition
      id="Day001-16x9"
      component={Scene}
      defaultProps={{ comp: COMPS.sixteenNine }}
      durationInFrames={DURATION}
      fps={FPS}
      width={COMPS.sixteenNine.width}
      height={COMPS.sixteenNine.height}
    />
    <Composition
      id="Day001-4x5"
      component={Scene}
      defaultProps={{ comp: COMPS.fourFive }}
      durationInFrames={DURATION}
      fps={FPS}
      width={COMPS.fourFive.width}
      height={COMPS.fourFive.height}
    />
    <Still
      id="Day001-Card"
      component={CardStill}
      width={COMPS.fourFive.width}
      height={COMPS.fourFive.height}
    />
  </>
);
