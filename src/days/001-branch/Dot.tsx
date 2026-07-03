// src/days/001-branch/Dot.tsx
// Tomorrow rising: the sprite drifts up into place and fades in — slow, inevitable.
// At the end of the beat rise=0 and opacity=1, so the landed pixels are exact.
import { staticFile, useCurrentFrame } from 'remotion';
import layout from '../../../public/001/layout.json';
import { dotOpacity, dotRise } from './beats';

export const Dot = () => {
  const frame = useCurrentFrame();
  const d = layout.dot;
  const opacity = dotOpacity(frame);
  if (opacity === 0) return null;

  return (
    <svg
      viewBox={`0 0 ${layout.frame.width} ${layout.frame.height}`}
      width={layout.frame.width}
      height={layout.frame.height}
      style={{ position: 'absolute', top: 0, left: 0 }}
    >
      <image
        href={staticFile('001/dot.png')}
        x={d.x}
        y={d.y + dotRise(frame)}
        width={d.width}
        height={d.height}
        opacity={opacity}
      />
    </svg>
  );
};
