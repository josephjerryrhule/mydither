// src/days/002-reflection/HuntCard.tsx
// Hunt-rules slides: living paper + full-frame dithered text sprite.
// Rendered as Stills (frame 0), static except the breathing grain.
import { AbsoluteFill, Img, staticFile } from 'remotion';
import hunt from '../../../public/002/hunt.json';
import huntShop from '../../../public/002/hunt-shop.json';
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

export const HuntCard = () => <Slide file="002/hunt.png" dims={hunt} comp={COMPS.fourFive} />;
export const HuntShopCard = () => <Slide file="002/hunt-shop.png" dims={huntShop} comp={COMPS.fourFive} />;
export const HuntShopStory = () => <Slide file="002/hunt-shop.png" dims={huntShop} comp={COMPS.nineSixteen} />;
