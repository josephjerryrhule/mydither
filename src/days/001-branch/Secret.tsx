// src/days/001-branch/Secret.tsx
// The treasure-hunt glyph, woven into the grain. There is NO color difference:
// within the letter's shape the living dither simply runs coarser (size 5) than
// the field around it (size 2). A pure texture anomaly, CSS-masked to the glyph.
// Invisible at a glance; a coarse-dot 'G' when the still is paused and hunted.
import { Dithering } from '@paper-design/shaders-react';
import { staticFile, useCurrentFrame } from 'remotion';
import { DEFAULT_DRIFT } from '../../system/DitherLayer';
import { FPS, SOURCE_FRAME } from '../../system/frames';
import { PALETTE } from '../../system/palette';
import { META } from './meta';

export const Secret = () => {
  const frame = useCurrentFrame();
  const shaderMs = (frame / FPS) * 1000 * DEFAULT_DRIFT;
  const size = META.secret.sizePx;
  return (
    <div
      style={{
        position: 'absolute',
        left: META.secret.xPct * SOURCE_FRAME.width - size / 2,
        top: META.secret.yPct * SOURCE_FRAME.height - size / 2,
        width: size,
        height: size,
        maskImage: `url(${staticFile('001/secret.png')})`,
        WebkitMaskImage: `url(${staticFile('001/secret.png')})`,
        maskSize: '100% 100%',
        WebkitMaskSize: '100% 100%',
      }}
    >
      <Dithering
        colorBack={PALETTE.paper}
        colorFront="#E7E3D6"
        shape="simplex"
        type="8x8"
        size={5}
        speed={0}
        frame={shaderMs}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      />
    </div>
  );
};
