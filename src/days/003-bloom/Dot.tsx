// src/days/003-bloom/Dot.tsx
// Signature sun dot rising and materializing behind the bloom.
import { useCurrentFrame } from 'remotion';
import { dotOpacity, dotRise } from './beats';

export const Dot = () => {
  const frame = useCurrentFrame();
  const opacity = dotOpacity(frame);
  const rise = dotRise(frame);

  if (opacity === 0) return null;

  return (
    <svg
      viewBox="0 0 1080 1920"
      width={1080}
      height={1920}
      style={{ position: 'absolute', top: 0, left: 0 }}
    >
      <circle
        cx={541}
        cy={855 - rise}
        r={11}
        fill="#1a1817"
        opacity={opacity}
      />
    </svg>
  );
};
