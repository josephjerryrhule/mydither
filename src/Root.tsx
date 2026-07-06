import { Composition, Still } from 'remotion';
import { COMPS, DURATION, FPS } from './system/frames';
import { HuntCard, HuntShopCard, HuntShopStory } from './days/001-branch/HuntCard';
import { Scene } from './days/001-branch/Scene';
import { HuntCard as HuntCard002, HuntShopCard as HuntShopCard002, HuntShopStory as HuntShopStory002 } from './days/002-reflection/HuntCard';
import { Scene as Scene002 } from './days/002-reflection/Scene';
import { HuntCard as HuntCard003, HuntShopCard as HuntShopCard003, HuntShopStory as HuntShopStory003 } from './days/003-bloom/HuntCard';
import { Scene as Scene003 } from './days/003-bloom/Scene';
import { HuntCard as HuntCard004, HuntShopCard as HuntShopCard004, HuntShopStory as HuntShopStory004 } from './days/004-wind/HuntCard';
import { Scene as Scene004 } from './days/004-wind/Scene';

export const Root = () => (
  <>
    {/* Day 001 — Branch */}
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
    <Still
      id="Day001-Hunt"
      component={HuntCard}
      width={COMPS.fourFive.width}
      height={COMPS.fourFive.height}
    />
    <Still
      id="Day001-HuntShop"
      component={HuntShopCard}
      width={COMPS.fourFive.width}
      height={COMPS.fourFive.height}
    />
    <Still
      id="Day001-HuntShop-Story"
      component={HuntShopStory}
      width={COMPS.nineSixteen.width}
      height={COMPS.nineSixteen.height}
    />

    {/* Day 002 — Reflection */}
    <Composition
      id="Day002-16x9"
      component={Scene002}
      defaultProps={{ comp: COMPS.sixteenNine }}
      durationInFrames={DURATION}
      fps={FPS}
      width={COMPS.sixteenNine.width}
      height={COMPS.sixteenNine.height}
    />
    <Composition
      id="Day002-4x5"
      component={Scene002}
      defaultProps={{ comp: COMPS.fourFive }}
      durationInFrames={DURATION}
      fps={FPS}
      width={COMPS.fourFive.width}
      height={COMPS.fourFive.height}
    />
    <Composition
      id="Day002-9x16"
      component={Scene002}
      defaultProps={{ comp: COMPS.nineSixteen }}
      durationInFrames={DURATION}
      fps={FPS}
      width={COMPS.nineSixteen.width}
      height={COMPS.nineSixteen.height}
    />
    <Still id="Day002-Hunt" component={HuntCard002} width={COMPS.fourFive.width} height={COMPS.fourFive.height} />
    <Still id="Day002-HuntShop" component={HuntShopCard002} width={COMPS.fourFive.width} height={COMPS.fourFive.height} />
    <Still id="Day002-HuntShop-Story" component={HuntShopStory002} width={COMPS.nineSixteen.width} height={COMPS.nineSixteen.height} />

    {/* Day 003 — Bloom */}
    <Composition
      id="Day003-16x9"
      component={Scene003}
      defaultProps={{ comp: COMPS.sixteenNine }}
      durationInFrames={DURATION}
      fps={FPS}
      width={COMPS.sixteenNine.width}
      height={COMPS.sixteenNine.height}
    />
    <Composition
      id="Day003-4x5"
      component={Scene003}
      defaultProps={{ comp: COMPS.fourFive }}
      durationInFrames={DURATION}
      fps={FPS}
      width={COMPS.fourFive.width}
      height={COMPS.fourFive.height}
    />
    <Composition
      id="Day003-9x16"
      component={Scene003}
      defaultProps={{ comp: COMPS.nineSixteen }}
      durationInFrames={DURATION}
      fps={FPS}
      width={COMPS.nineSixteen.width}
      height={COMPS.nineSixteen.height}
    />
    <Still id="Day003-Hunt" component={HuntCard003} width={COMPS.fourFive.width} height={COMPS.fourFive.height} />
    <Still id="Day003-HuntShop" component={HuntShopCard003} width={COMPS.fourFive.width} height={COMPS.fourFive.height} />
    <Still id="Day003-HuntShop-Story" component={HuntShopStory003} width={COMPS.nineSixteen.width} height={COMPS.nineSixteen.height} />

    {/* Day 004 — Wind */}
    <Composition
      id="Day004-16x9"
      component={Scene004}
      defaultProps={{ comp: COMPS.sixteenNine }}
      durationInFrames={DURATION}
      fps={FPS}
      width={COMPS.sixteenNine.width}
      height={COMPS.sixteenNine.height}
    />
    <Composition
      id="Day004-4x5"
      component={Scene004}
      defaultProps={{ comp: COMPS.fourFive }}
      durationInFrames={DURATION}
      fps={FPS}
      width={COMPS.fourFive.width}
      height={COMPS.fourFive.height}
    />
    <Composition
      id="Day004-9x16"
      component={Scene004}
      defaultProps={{ comp: COMPS.nineSixteen }}
      durationInFrames={DURATION}
      fps={FPS}
      width={COMPS.nineSixteen.width}
      height={COMPS.nineSixteen.height}
    />
    <Still id="Day004-Hunt" component={HuntCard004} width={COMPS.fourFive.width} height={COMPS.fourFive.height} />
    <Still id="Day004-HuntShop" component={HuntShopCard004} width={COMPS.fourFive.width} height={COMPS.fourFive.height} />
    <Still id="Day004-HuntShop-Story" component={HuntShopStory004} width={COMPS.nineSixteen.width} height={COMPS.nineSixteen.height} />
  </>
);
