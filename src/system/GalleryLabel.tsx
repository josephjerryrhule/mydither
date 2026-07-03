// src/system/GalleryLabel.tsx
// Quiet exhibition placard, bottom-left. Dithered ink-on-paper sprite at 1:1 px.
import { Img, staticFile } from 'remotion';
import label from '../../public/001/label.json';

export const GalleryLabel = ({ progress }: { progress: number }) => (
  <Img
    src={staticFile('001/label.png')}
    style={{
      position: 'absolute',
      left: 64,
      bottom: 64,
      width: label.width,
      height: label.height,
      opacity: progress,
      transform: `translateY(${(1 - progress) * 8}px)`,
    }}
  />
);
