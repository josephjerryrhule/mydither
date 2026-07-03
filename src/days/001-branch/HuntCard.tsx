// src/days/001-branch/HuntCard.tsx
// The hunt-rules slide (carousel slide 1): living paper + full-frame dithered
// text sprite. Static except the breathing grain; rendered as a Still (frame 0).
import { AbsoluteFill, Img, staticFile } from 'remotion';
import hunt from '../../../public/001/hunt.json';
import { DitherLayer } from '../../system/DitherLayer';
import { PALETTE } from '../../system/palette';

export const HuntCard = () => (
  <AbsoluteFill style={{ backgroundColor: PALETTE.paper }}>
    <DitherLayer />
    <Img
      src={staticFile('001/hunt.png')}
      style={{ position: 'absolute', inset: 0, width: hunt.width, height: hunt.height }}
    />
  </AbsoluteFill>
);
