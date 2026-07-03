# mydither — 001 / branch — Design

Date: 2026-07-02
Status: approved (verbal), pending spec review

## What this is

First piece of **mydither**: a daily motion & design practice posted to Joseph's
personal Instagram. Each piece embodies a natural inspiration; this one is his
profile picture — a hand-drawn branch with a dot floating above it. Branch,
growth, potential.

All future pieces follow the patterns established here: same palette, same
paper-dither texture, same caption card, same export shapes.

## Decisions (locked)

| Decision | Choice |
|---|---|
| Export pipeline | Remotion — programmatic, deterministic mp4/PNG renders |
| Carousel format | Slide 1: 4:5 video (1080×1350). Slide 2: still caption card (PNG) |
| Branch asset | **Pixel-perfect:** geometry always comes from the source image's own pixels, never re-drawn. Source raster keyed to ink-alpha, ordered-Bayer dithered offline; growth revealed by SVG stroke masks along hand-traced limb center-lines. Center-lines drive masks only — the visible pixels are the drawing itself. |
| Audio | Not baked in. Added at post time; credited in the IG caption |
| Repo structure | Day-folders + shared system (see Architecture) |

## Visual system

- **Palette:** paper `#F2EFE6`, ink `#1A1817`. Two colors only, across all pieces.
- **Texture:** `@paper-design/shaders-react` `<Dithering />` as a full-frame
  layer — cream-on-cream, small pixel size, low contrast. Reads as living paper
  grain, not an effect. Always present, never loud.
- **Mood:** cinematic paper minimalism. Nothing slides; things grow, snap,
  settle, breathe.

## Motion script — 001 / branch

Master timeline: 16:9, 12s @ 30fps (360 frames). The 4:5 version shares the
timeline with a tighter crop; the caption card sits lower in frame.

| t | beat | description |
|---|---|---|
| 0.0–1.5s | paper breathes | Empty cream field. Dither grain drifts almost imperceptibly. No subject. |
| 1.5–4.0s | stem | Single stroke draws upward from center — stroke-dash reveal. Slow start, confident middle, tiny overshoot at the tip, settle. Hand-drawn wobble preserved. |
| 3.0–6.2s | twigs (percussive) | Six twigs snap out in stagger, alternating sides, ~180ms apart, overlapping the stem's finish. Each twig: spring out fast, settle. The drum line of the piece. |
| 6.2–8.2s | the dot (tomorrow) | Not drawn, not particles. The dot rises into place like a small sun — drifts up ~14px into its final position while fading in, slow and inevitable. Tomorrow arriving, seamless. (Rev 2: replaced the original speck-convergence — read as "exploding in reverse".) |
| 8.0–10.0s | hold + breath | One breath: scale 1.000 → 1.012 → 1.000. Imperceptible camera push-in runs the whole shot. Grain keeps drifting. |
| 10.0–11.5s | the label | No card. A small dithered gallery label fades in bottom-left (title / message / credit), like an exhibition placard — very small, quiet, ink on paper. End frame doubles as the still. (Rev 2: replaced the white caption card.) |

Secret (every post, Rev 3): one glyph hidden in the dither field —
**integrated into the dots themselves**, not overlaid. Within the glyph's
shape the living grain runs at a coarser dot size (same two cream tones as
the field; texture anomaly only, zero color difference). Very faint: users
must hunt it. Present the whole timeline. Across posts the glyphs accumulate
into a coupon code for stores to be listed later. Confirmed code:
GROWTH (001 = "G") — confirmed 2026-07-03.

Label (Rev 3): two lines only — title + message. No credit line in-frame;
all credits (drawing source, sound) live in the IG caption.

Loop note: the 16:9 export may drop the label beat for a seamless loop (dot
dissolves back into grain). The carousel video keeps the label ending.

Sound direction (chosen at post time): dry and organic — pencil scratch, wood
tick, low room tone.

## Architecture

```
mydither/
├─ src/
│  ├─ system/               # shared design system — evolves slowly
│  │  ├─ palette.ts          # paper, ink
│  │  ├─ DitherLayer.tsx     # full-frame Dithering wrapper, frame-driven
│  │  ├─ CaptionCard.tsx     # white box: message + credit line
│  │  └─ frames.ts           # 16:9 / 4:5 composition configs
│  ├─ days/
│  │  └─ 001-branch/
│  │     ├─ Branch.tsx       # SVG strokes + growth motion
│  │     ├─ motion.md        # the motion script (above)
│  │     └─ meta.ts          # title, message, credits
│  └─ Root.tsx               # registers all compositions
├─ docs/superpowers/specs/   # design docs
└─ out/                      # rendered mp4s / PNGs (gitignored)
```

**Compositions per day (naming pattern, Rev 2):**

- `NNN-16x9` — 1920×1080 mp4
- `NNN-4x5` — 1080×1350 mp4 (carousel slide 1)
- carousel slide 2 = PNG still rendered from `NNN-4x5` at a late frame
  (`remotion still DayNNN-4x5 --frame=352`) — no separate Still composition
  (Remotion 4.0.484 clamps `Freeze` inside a 1-frame `Still` to frame 0)

**Label & secret sprites (Rev 2):** a per-day script (`scripts/dither-label.mts`,
run with tsx so it imports META directly) rasterizes (a) the gallery label —
title / message / credit, small monospace, ink — and (b) the secret glyph at
cream-ghost contrast, through the SAME luminance-key + ordered-8x8-Bayer
pipeline as the ink sprites, at display resolution (never resized after
dithering). Outputs `public/001/label.png`, `public/001/secret.png` + dims JSON.

**Unit boundaries:** `system/` components know nothing about specific days.
A day folder consumes system components and exports composition definitions
that `Root.tsx` registers. Adding a day touches only its folder + one line in
`Root.tsx`.

## Technical notes

- **Shader determinism:** `@paper-design/shaders-react` animates via its own
  clock by default. In Remotion, every visual value must derive from
  `useCurrentFrame()`. The DitherLayer wrapper must drive the shader's
  time/frame prop from the Remotion frame (verify exact prop API against the
  installed version during implementation; if the shader cannot be
  frame-driven, fall back to seeded param animation — e.g. animating offset/
  scale uniforms per frame).
- **Shader API (verified against @paper-design/shaders-react 0.0.76):** all
  shaders accept `speed` and `frame` ("Set a frame to get a deterministic
  result, frames are literally just milliseconds from zero"). `speed={0}` +
  `frame` derived from `useCurrentFrame()` gives deterministic Remotion output.
  Procedural `<Dithering />` (shape: simplex/warp/dots/…, type: random/2x2/4x4/
  8x8 Bayer, size) renders the living paper field.
- **Branch dithering happens offline, not in the shader:** the branch layer
  needs SVG mask reveals, which don't compose reliably over a WebGL canvas. A
  preprocessing script (sharp) keys ink from paper (luminance → alpha),
  applies the same ordered 8x8 Bayer quantization the shader family uses, and
  splits the mark into `dot` + `branch` sprites with a layout JSON. The
  package's `<ImageDithering />` math is reproduced deterministically; the
  package's procedural `<Dithering />` still runs live as the paper field.
- **Growth reveal:** sprites placed in an inline SVG, revealed by `<mask>`
  strokes along hand-traced limb center-lines (`pathLength`-normalized
  dash-offset interpolation); percussive stagger from Remotion interpolation
  per twig.
- **Dot condensation effect:** seeded speck scatter (Remotion `random()`)
  converging onto the dot position, cross-fading into the dot sprite.
- **Caption content:** `meta.ts` holds the short message (written in the
  mydither caption voice: no poem, no rhyme; growth / percussiveness /
  ingenuity / natural wonder) and credits (original drawing source, sound
  used — sound credited even though audio is added at post time).

## Global constraints

- **Pixel-perfect match** to the source drawing: the rendered mark's geometry
  is derived from `assets/001-branch-source.jpeg` pixels (665×1182), never
  re-drawn by hand or approximated.
- Palette limited to paper `#F2EFE6`, ink `#1A1817`, grain front `#E7E3D6`
  (card white removed in Rev 3 — no cards in frame).
- All animation values derive from `useCurrentFrame()` — no wall-clock time.

## Testing / verification

- `npx remotion render` all three compositions; confirm exact dimensions and
  durations.
- Render the same composition twice; diff a sampled frame to confirm
  deterministic shader output.
- Visual pass in Remotion Studio against the motion script beats.

## Out of scope (YAGNI)

- Automated Instagram posting
- Audio muxing in Remotion
- Caption-generation tooling (captions written per piece, in-chat)
- Generalizing the dot/growth effects beyond what 001 needs
