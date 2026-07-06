// src/system/GalleryLabel.tsx
// Quiet exhibition placard, bottom-left. Dithered ink-on-paper sprite.
// Day-agnostic: the day folder owns the sprite + dims and passes them in.
import { Img } from 'remotion';

export const GalleryLabel = ({
  src,
  width,
  height,
  progress,
  bottom = 64,
  scale = 1,
}: {
  src: string;
  width: number;
  height: number;
  progress: number;
  /** Raise above platform UI chrome (e.g. Reels caption overlay) */
  bottom?: number;
  scale?: number;
}) => (
  <Img
    src={src}
    style={{
      position: 'absolute',
      left: 64 * scale,
      bottom: bottom * scale,
      width: width * scale,
      height: height * scale,
      opacity: progress,
      transform: `translateY(${(1 - progress) * 8 * scale}px)`,
    }}
  />
);
