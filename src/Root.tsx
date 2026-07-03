import { Composition } from 'remotion';
import { COMPS, DURATION, FPS } from './system/frames';
import { Scene } from './days/001-branch/Scene';

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
    <Composition
      id="Day001-9x16"
      component={Scene}
      defaultProps={{ comp: COMPS.nineSixteen }}
      durationInFrames={DURATION}
      fps={FPS}
      width={COMPS.nineSixteen.width}
      height={COMPS.nineSixteen.height}
    />
  </>
);
