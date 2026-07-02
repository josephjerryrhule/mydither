export const FPS = 30;
export const DURATION = 360;

export type CompSize = { width: number; height: number };

export const COMPS = {
  sixteenNine: { width: 1920, height: 1080 } as CompSize,
  fourFive: { width: 1080, height: 1350 } as CompSize,
};

export const SOURCE_FRAME = { width: 1080, height: 1920 };

export const placeSource = (comp: CompSize) => ({
  offsetX: (comp.width - SOURCE_FRAME.width) / 2,
  offsetY: (comp.height - SOURCE_FRAME.height) / 2,
});
