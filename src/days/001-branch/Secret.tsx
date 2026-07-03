// src/days/001-branch/Secret.tsx
// The treasure-hunt glyph: a cream-ghost letter dithered into the grain.
// Present the whole timeline, behind the mark. Findable when looked for, not before.
import { Img, staticFile } from 'remotion';
import secret from '../../../public/001/secret.json';
import { SOURCE_FRAME } from '../../system/frames';
import { META } from './meta';

export const Secret = () => {
  const w = secret.width;
  const h = secret.height;
  return (
    <Img
      src={staticFile('001/secret.png')}
      style={{
        position: 'absolute',
        left: META.secret.xPct * SOURCE_FRAME.width - w / 2,
        top: META.secret.yPct * SOURCE_FRAME.height - h / 2,
        width: w,
        height: h,
        opacity: 1,
      }}
    />
  );
};
