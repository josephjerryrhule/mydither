// src/days/004-wind/HuntCard.tsx
// Hunt-rules slides: living paper + full-frame dithered text sprite.
import { AbsoluteFill, Img, staticFile } from 'remotion';
import hunt from '../../../public/004/hunt.json';
import huntShop from '../../../public/004/hunt-shop.json';
import { DitherLayer } from '../../system/DitherLayer';
import { COMPS, type CompSize } from '../../system/frames';
import { PALETTE } from '../../system/palette';

const Slide = ({ file, dims, comp }: { file: string; dims: { width: number; height: number }; comp: CompSize }) => (
  <AbsoluteFill style={{ backgroundColor: PALETTE.paper }}>
    <DitherLayer />
    <Img
      src={staticFile(file)}
      style={{
        position: 'absolute',
        left: (comp.width - dims.width) / 2,
        top: (comp.height - dims.height) / 2,
        width: dims.width,
        height: dims.height,
      }}
    />
  </AbsoluteFill>
);

export const HuntCard = () => <Slide file="004/hunt.png" dims={hunt} comp={COMPS.fourFive} />;
export const HuntShopCard = () => <Slide file="004/hunt-shop.png" dims={huntShop} comp={COMPS.fourFive} />;
export const HuntShopStory = () => <Slide file="004/hunt-shop.png" dims={huntShop} comp={COMPS.nineSixteen} />;
