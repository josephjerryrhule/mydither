// src/days/002-reflection/Dot.tsx
// The sun materializes on the horizon — no drop, no arrival. It fades into
// existence in place, as if it was always just out of view. It's the source;
// the reflection is the part that moves.
import { staticFile, useCurrentFrame } from 'remotion';
import layout from '../../../public/002/layout.json';
import { dotOpacity } from './beats';

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
        href={staticFile('002/dot.png')}
        x={d.x}
        y={d.y}
        width={d.width}
        height={d.height}
        opacity={opacity}
      />
    </svg>
  );
};
