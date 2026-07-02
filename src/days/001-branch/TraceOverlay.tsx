// src/days/001-branch/TraceOverlay.tsx
// Debug comp: branch sprite + colored center-lines. Not registered in final Root.
import { AbsoluteFill, staticFile } from 'remotion';
import layout from '../../../public/001/layout.json';
import { STEM, TWIGS, type Limb } from './limbs';

const Line = ({ limb, color }: { limb: Limb; color: string }) => (
  <path
    d={limb.d}
    stroke={color}
    strokeWidth={limb.width}
    strokeLinecap="round"
    strokeLinejoin="round"
    fill="none"
    opacity={0.45}
  />
);

export const TraceOverlay = () => (
  <AbsoluteFill style={{ backgroundColor: '#fff' }}>
    <svg
      viewBox={`0 0 ${layout.branch.width} ${layout.branch.height}`}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
    >
      <image
        href={staticFile('001/branch.png')}
        width={layout.branch.width}
        height={layout.branch.height}
      />
      <Line limb={STEM} color="red" />
      {TWIGS.map((t, i) => (
        <Line key={i} limb={t} color={i % 2 ? 'blue' : 'green'} />
      ))}
    </svg>
  </AbsoluteFill>
);
