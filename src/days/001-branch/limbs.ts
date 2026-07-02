// src/days/001-branch/limbs.ts
// Mask center-lines ONLY. These never render — they reveal the drawing's pixels.
// Coordinates: branch.png sprite space (origin = branch.png top-left, 176x260).
// Traced visually over the TraceOverlay comp against public/001/branch.png.
//
// NOTE ON COUNT: the plan expected 6 twigs. The actual hand-drawn sprite has a
// central stem plus FOUR branches, three of which bifurcate into two prongs each,
// for SEVEN twig-tips total. We trace one limb per tip so each can "write-on"
// independently. Compound-branch prongs deliberately share (overlap) their base
// segment back to the stem so every ink pixel is covered.
export type Limb = { d: string; width: number };

// Stem: bottom-center rising to the drawn tip. Near-vertical at x~=78-79.
export const STEM: Limb = {
  d: 'M 79 258 L 79 216 L 82 190 L 80 150 L 78 100 L 79 50 L 77 2',
  width: 18,
};

// Twigs ordered by animation index: bottom-most first, alternating sides
// (right / left / right / left at the branch level). Each entry traces from the
// stem fork out to one tip.
export const TWIGS: Limb[] = [
  // D2 — right-low branch, outer (long diagonal) prong -> tip (170,112).
  // Root dips into the branch/stem armpit, rides the junction's right flank.
  { d: 'M 94 180 L 104 172 L 112 164 L 118 156 L 122 150 L 131 147 L 146 136 L 160 122 L 170 112', width: 18 },
  // D1 — right-low branch, inner (short vertical) prong -> tip (113,116).
  { d: 'M 90 180 L 100 172 L 108 164 L 112 156 L 114 150 L 114 140 L 113 116', width: 18 },
  // C2 — left-mid branch, far-left prong -> tip (5,64). Root hugs the armpit's
  // lower-left flank; prong offset left of C1 to widen the shared base's union.
  { d: 'M 71 164 L 63 150 L 60 146 L 55 136 L 47 121 L 39 106 L 35 100 L 29 96 L 20 86 L 11 76 L 4 64', width: 18 },
  // C1 — left-mid branch, upper prong -> tip (30,60). Offset right of C2.
  { d: 'M 71 164 L 66 150 L 64 146 L 60 136 L 52 121 L 44 106 L 41 100 L 40 88 L 34 74 L 30 60', width: 18 },
  // B2 — right-high branch, outer (long diagonal) prong -> tip (143,15).
  // Root rides the armpit's outer flank up to the Y-junction.
  { d: 'M 85 106 L 92 96 L 99 88 L 101 78 L 106 70 L 111 62 L 116 54 L 122 48 L 132 36 L 140 26 L 143 15', width: 18 },
  // B1 — right-high branch, inner (short vertical) prong -> tip (110,27).
  { d: 'M 83 106 L 90 96 L 96 88 L 98 78 L 104 70 L 109 60 L 109 54 L 109 44 L 110 27', width: 18 },
  // A — left-high branch, single prong -> tip (54,20). Root covers its armpit.
  { d: 'M 72 50 L 70 44 L 66 38 L 60 31 L 54 20', width: 17 },
];
