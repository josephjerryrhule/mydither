# mydither

Daily motion & design practice. Nature in, dither out. Posted to Instagram.

## Pattern (every day)

1. Drop source image in `assets/NNN-<name>-source.*`
2. Preprocess → sprites: `npm run prepare-001` (see `scripts/dither-ink.mjs` and
   `scripts/dither-label.mts` for 001's pipeline — ink extraction + gallery
   label sprite, both pixel-perfect from the source drawing)
3. New folder `src/days/NNN-<name>/`:
   - `beats.ts` (+ `beats.test.ts`) — single source of truth timeline, pure
     functions of frame
   - `motion.md` — the shot's script/intent in prose
   - `meta.ts` — `title`, `message`, `igCaption`, and `secret` (the treasure-hunt
     glyph: `{ char, xPct, yPct, sizePx }`)
   - `limbs.ts` — traced limb center-line masks for write-on reveal
   - components (e.g. `Branch.tsx`, `Dot.tsx`, `Secret.tsx`, `TraceOverlay.tsx`)
   - `Scene.tsx` — composes the above into the frame
4. Register **two** compositions per day in `src/Root.tsx`: `DayNNN-16x9` and
   `DayNNN-4x5`. There is no separate card composition — the card is a still
   frame (352) of `DayNNN-4x5`.
5. `npm run studio` to iterate · render via package script

## System

- Palette: paper `#F2EFE6`, ink `#1A1817`, grain `#E7E3D6` — nothing else (no
  card white; the white CaptionCard was removed in the Rev 3 redesign)
- `src/system/` = shared: `DitherLayer` (living paper), `GalleryLabel` (small
  dithered two-line gallery label, bottom-left), `frames` (composition sizes,
  source placement, FPS/duration)
- Shaders: `speed={0}` + `frame` driven by `useCurrentFrame()` (in ms) —
  deterministic, frame-seekable, no wall-clock time
- Geometry is always the source image's own pixels, resized but never
  re-drawn or approximated by hand (pixel-perfect rule)
- Every post hides a secret: one coupon-code character woven into the living
  dither grain as a pure texture anomaly (coarser dot size within the glyph's
  mask, no color difference) — invisible at a glance, findable on a paused
  frame. Position/size per post live in that day's `meta.ts` under `secret`.

## Render 001

npm run prepare-001 && npm run render-001
→ out/001-16x9.mp4 · out/001-4x5.mp4 · out/001-card.png
