import { Composition, Still } from 'remotion';
import { COMPS, DURATION, FPS } from './system/frames';
import { HuntCard, HuntShopCard, HuntShopStory } from './days/001-branch/HuntCard';
import { Scene } from './days/001-branch/Scene';
import { HuntCard as HuntCard002, HuntShopCard as HuntShopCard002, HuntShopStory as HuntShopStory002 } from './days/002-reflection/HuntCard';
import { Scene as Scene002 } from './days/002-reflection/Scene';

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
  </>
);
