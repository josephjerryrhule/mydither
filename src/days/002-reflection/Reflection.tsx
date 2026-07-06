// src/days/002-reflection/Reflection.tsx
// The reflection: a smooth continuous leak stretching down from the sun.
// The top of the reflection is pinned to the horizon (r.y), and as it reveals,
// it scales vertically (scaleY) and pinches horizontally (scaleX) to simulate
// fluid surface tension, eventually settling into the exact drawing pixels.
// Driven deterministically, it leaks out from behind the sun/horizon.
import { staticFile, useCurrentFrame } from 'remotion';
import layout from '../../../public/002/layout.json';
import { reflectionReveal, reflectionPinch } from './beats';

export const Reflection = () => {
  const frame = useCurrentFrame();
  const r = layout.reflection;
  const reveal = reflectionReveal(frame);

  if (reveal === 0) return null;

  const scaleY = reveal;
  const scaleX = reflectionPinch(frame);

  // Pivot point for scaling is the top-center of the reflection bounding box
  const pivotX = r.x + r.width / 2;
  const pivotY = r.y;

  // SVG transform:
  // 1. Move pivot to origin
  // 2. Scale (X for pinch, Y for stretch)
  // 3. Move back
  const transform = `
    translate(${pivotX}, ${pivotY})
    scale(${scaleX}, ${scaleY})
    translate(${-pivotX}, ${-pivotY})
  `.replace(/\s+/g, ' ').trim();

  return (
    <svg
      viewBox={`0 0 ${layout.frame.width} ${layout.frame.height}`}
      width={layout.frame.width}
      height={layout.frame.height}
      style={{ position: 'absolute', top: 0, left: 0 }}
    >
      <g transform={transform}>
        <image
          href={staticFile('002/reflection.png')}
          x={r.x}
          y={r.y}
          width={r.width}
          height={r.height}
        />
      </g>
    </svg>
  );
};
