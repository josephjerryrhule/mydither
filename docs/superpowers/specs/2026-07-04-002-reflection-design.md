# mydither — 002 / reflection — Design

Date: 2026-07-04
Status: approved (verbal), pending spec review

## What this is

Second piece of **mydither**, day 2 of the 6-day hunt. Source drawing: a dot
resting on a horizon line, with a broken ink trail descending beneath it — a
sun/moon on the water's edge and its reflection. Theme: **reflection**. The
source holds still; the reflection is the part that moves.

Follows every pattern locked by 001: same palette, same paper-dither texture,
same three export shapes + hunt stills, gallery label, secret glyph woven in
grain, pixel-perfect rule, deterministic-to-the-frame.

## Decisions (locked)

| Decision | Choice |
|---|---|
| Source | `assets/002-reflection-source.jpg` (736×736 square). Resized to 1080 wide → 1080×1080, centered vertically in the shared 1080×1920 source frame. Horizon lands at the frame's true vertical center (y≈960). |
| Extraction | **Pixel-perfect**, same recipe as 001: luminance-key → ordered 8×8 Bayer → binary RGBA sprites via `sharp`, split by empty-row bands. Never re-drawn. |
| Sprites | `line` (horizon), `dot` (on the line), `reflection` (the trail). **Cuts derived from structure** (probe 2026-07-04): the line = the contiguous wide rows (span >300px); the dot = the centered blob riding the line, its columns **punched** from the line sprite so it can drop into the gap and seat seamlessly; the reflection = the narrow centered ink below the line. Two stray specks (y154/y264) denoised. NOTE: the reflection's top **fuses** with the line — it does *not* band-split into free fragments; the single reflection sprite is revealed top→bottom and its own ink gaps read as the dabs. |
| Reflection motion | **Echo drip** (chosen): the dot lands → its reflection reveals downward from the surface, the sprite's natural ink gaps reading as dabs ticking in, dwindling. Percussive top→bottom = this piece's drum line. A damped shimmer reaches 0 by the beat end so the still is crisp. |
| Horizon reveal | Left→right mask **wipe** (honors the pen-down fork at the left, clean lift at the right). A wipe reads identically to a traced stroke for a thin horizontal line and avoids fiddly limb-tracing. |
| Secret | Letter **R** (GROWTH → G,**R**,O,W,T,H; 002 = R). Woven in grain, coarser-dot texture anomaly inside a CSS-masked glyph, exactly as 001. Placed faint in the open paper field above the line. |
| Audio | Not baked in. Added at post time; credited in the IG caption. |
| Duration | 360 frames / 12s @ 30fps. Still frame = 352 (everything settled). |

## Visual system (unchanged from 001)

- **Palette:** paper `#F2EFE6`, ink `#1A1817`, grain front `#E7E3D6`. Nothing else.
- **Texture:** full-frame `<Dithering />` living paper — cream-on-cream, size 2,
  frame-driven, always present, never loud.
- **Mood:** cinematic paper minimalism. Nothing slides; things settle, ripple,
  breathe. Here: a steady source, a restless reflection — that contrast is the piece.

## Motion script — 002 / reflection

Master timeline: 360 frames @ 30fps. The 4:5 and 9:16 versions share the
timeline; the label auto-raises on the tall (Reel) frame.

| t | beat | description |
|---|---|---|
| 0.0–1.5s | paper breathes | Empty cream field. Dither grain drifts almost imperceptibly. No subject. |
| 1.5–4.0s | horizon | The line writes on left→right via a mask wipe. Slow start, confident middle, tiny settle. Hand-drawn wobble and the left fork preserved. |
| 3.5–5.0s | the dot | The dot drops ~14px from just above the line and settles onto it — a small sun touching the horizon. It is the trigger for the reflection. |
| 4.5–7.8s | the reflection (focus, percussive) | Echo drip. Fragments tick in top→bottom in stagger (~140ms apart), each fading up with a small vertical settle from a few px higher — the dot's light dripping/rippling into the water, dwindling into smaller, sparser dots as it falls. The drum line. A whisper of vertical shimmer during the drip damps to zero by the hold, so the still reads crisp. |
| 7.8–10.0s | hold + breath | One breath: scale 1.000 → 1.012 → 1.000. Imperceptible camera push-in runs the whole shot. Grain keeps drifting. |
| 10.0–11.5s | the label | A small dithered gallery label fades in bottom-left (title + message), like an exhibition placard — very small, quiet, ink on paper. End frame doubles as the still. |

Secret (every post): one glyph hidden in the dither field — integrated into the
dots themselves, not overlaid. Within the glyph's shape the living grain runs at
a coarser dot size (same two cream tones; texture anomaly only, zero color
difference). Very faint; users must hunt it. Present the whole timeline. Across
posts the glyphs accumulate into the coupon code **GROWTH** (002 = "R").

Label: two lines only — title + message. All credits (drawing source, sound)
live in the IG caption.

Sound direction (chosen at post time): dry and organic, with a watery accent —
a single soft drip/plink per reflection fragment, low room tone under it.

## Architecture

New day folder mirrors 001; only its folder + one block in `Root.tsx` change.

```
src/days/002-reflection/
├─ meta.ts        # title, message, igCaption, xCaption, xThread, secret {char:'R',…}
├─ motion.md      # the motion script (above)
├─ beats.ts       # single source of truth timeline — pure functions of frame
├─ beats.test.ts  # asserts beat boundaries / monotonic reveals / settled-by-352
├─ Scene.tsx      # composes DitherLayer + Secret + Horizon + Dot + Reflection + label
├─ Horizon.tsx    # line sprite revealed by left→right wipe mask
├─ Dot.tsx        # dot sprite: drop + settle onto the line
├─ Reflection.tsx # fragment sprites, echo-drip stagger top→bottom
├─ Secret.tsx     # R woven in grain (coarse-dot CSS mask), same as 001
└─ HuntCard.tsx   # hunt-rules + partner-shop slides (reuse 001's, 002 copy)
```

**Compositions per day** (Root.tsx): `Day002-16x9` (1920×1080), `Day002-4x5`
(1080×1350, carousel slide 1), `Day002-9x16` (1080×1920, Reel). Card = still of
`Day002-4x5` at frame 352. Plus hunt stills (`Day002-Hunt`, `Day002-HuntShop`,
`Day002-HuntShop-Story`).

**Preprocess pipeline:** two scripts, parameterized for 002 (either new
`scripts/dither-ink-002.mjs` + `scripts/dither-label-002.mts` or a `DAY` arg on
the existing ones — decided in the plan). Ink script splits `line`+`dot` and the
reflection fragments; carves the dot from the line band by center-column
density. Label script emits gallery label + secret-R alpha mask. `package.json`
gains `prepare-002` and `render-002` scripts mirroring 001.

## Technical notes

- **Extraction cuts (structure-derived, per probe 2026-07-04):** the naive
  row-band splitter does NOT work here — the reflection's top fuses with the line
  and there are two stray specks up high. Instead: denoise (ignore y<480); LINE =
  the maximal contiguous run of rows whose ink span >300px; DOT = the centered
  blob from just above the line band, its columns punched out of the line sprite;
  REFLECTION = the narrow centered ink below the line band, one sprite revealed
  top→bottom (its own ink gaps read as the dabs). Small deliberate dot/line
  overlap, in the spirit of 001's overlapping twig bases.
- **Placement:** square 1080×1080 drawing centered in the 1080×1920 source frame
  (offsetY = 420). `placeSource` then centers the source frame in each comp. On
  16:9 the 1080-tall drawing fits the 1080 height exactly; on 4:5 it centers with
  margin; on 9:16 it is the full frame. Verify the horizon and reflection clear
  the Reel UI and the label.
- **Horizon wipe:** an SVG `<mask>` rect grows left→right over the line sprite
  (`x` fixed at the line's left, `width` interpolated 0→full by `horizonWipe(f)`).
  Confident-middle easing; small settle at the end.
- **Dot drop:** sprite `y = base + dotDrop(f)` where `dotDrop` starts ~ -14px
  (above the line) and eases to 0; opacity eases 0→1. Mirror of 001's dot but
  descending onto the horizon rather than rising above the branch.
- **Reflection echo drip:** per-fragment `fragProgress(f, i)` = eased
  `norm(f, start + i*stagger, …)`; each fragment fades up and settles a few px
  from above. A damped `shimmer(f)` (small sinusoid × decay) adds watery life
  during the drip and reaches ~0 before frame 234, keeping frame 352 crisp.
- **Secret:** identical mechanic to 001 (`Dithering` size 5 patch, CSS-masked to
  the R alpha sprite, driven by the same `DEFAULT_DRIFT` shader clock). Position
  in `meta.secret` as `{ char:'R', xPct, yPct, sizePx }` in source-frame coords,
  in the open field above the line, clear of ink.
- **Determinism / shader:** unchanged from 001 — `speed={0}` + `frame` from
  `useCurrentFrame()`; all motion derives from frame, no wall-clock.

## Caption (mydither voice — no poem, no rhyme; percussiveness, ingenuity, natural wonder)

Drafted in `meta.ts`; final drawing/sound credits filled at post time.

- **title:** `002 / reflection`
- **message (label line 2):** `a mark on the horizon, and the water's reply.`
- **igCaption (shape as 001):** `002 — reflection.` / idea lines (the water
  doesn't copy the dot, it answers — breaking the light into pieces the deeper it
  falls; the source holds still, the reflection is the part that can't) /
  `drawing: [source]` · `sound: [artist — track]` / hunt block (six days, one
  letter per piece, collect in order, day six DM the word on IG, partner shops
  holding coupons + gifts, rules on slide one) / `day 2 of 6.` / hashtags.
- **xCaption / xThread:** mirror 001 — build credit (@paper + @remotion,
  deterministic to the frame), hunt one-liner, `day 2 of 6.`; reply tweet carries
  the playful enhance-joke + the IG link (X buries external links in tweet 1).

## Global constraints

- **Pixel-perfect** to `assets/002-reflection-source.jpg` — geometry is the
  drawing's own pixels, resized but never re-drawn or approximated.
- Palette limited to paper `#F2EFE6`, ink `#1A1817`, grain front `#E7E3D6`.
- All animation values derive from `useCurrentFrame()` — no wall-clock time.

## Testing / verification

- `beats.test.ts`: beat boundaries correct; horizon wipe and each reflection
  fragment are monotonic non-decreasing over their window; everything fully
  settled (progress = 1, shimmer ≈ 0) at frame 352.
- Preprocess: assert ≥1 line/dot band + expected reflection-fragment count; each
  sprite has non-zero lit pixels (fail loud, as 001's scripts do).
- `remotion render` all three comps; confirm exact dimensions/durations. Render a
  comp twice; diff a sampled frame to confirm deterministic shader output.
- Visual pass in Studio against the beats; confirm the secret R is findable on a
  paused frame but invisible at a glance.

## Out of scope (YAGNI)

- Automated Instagram posting; audio muxing in Remotion.
- Generalizing the reflection/echo effect beyond what 002 needs.
- Re-drawing or smoothing the source's hand wobble.
