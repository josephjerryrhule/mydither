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
| Branch asset | Rebuilt as SVG strokes traced from the drawing (enables true growth motion) |
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
| 6.2–8.0s | the dot | Not drawn. Dither noise above the tip condenses — scattered grain pulls inward and becomes the dot. Potential arriving out of static. |
| 8.0–10.0s | hold + breath | One breath: scale 1.000 → 1.012 → 1.000. Imperceptible camera push-in runs the whole shot. Grain keeps drifting. |
| 10.0–12.0s | the card | White box rises from the bottom edge. Message fades in with a tracking settle (no typewriter). Credit line small beneath. Hold. End frame doubles as the still. |

Loop note: the 16:9 export may drop the card beat for a seamless loop (dot
dissolves back into grain). The carousel video keeps the card ending.

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

**Compositions per day (naming pattern):**

- `NNN-16x9` — 1920×1080 mp4
- `NNN-4x5` — 1080×1350 mp4 (carousel slide 1)
- `NNN-card` — 1080×1350 PNG still (carousel slide 2)

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
- **Dot condensation effect:** masked dither region above the branch tip whose
  contrast/pixel-size animates from noise-like to solid, cross-fading into a
  plain SVG circle for the final state.
- **Branch tracing:** SVG paths hand-traced from the source image, drawn with
  `strokeDasharray`/`strokeDashoffset` interpolation; twigs use Remotion
  `spring()` for the percussive snap.
- **Caption content:** `meta.ts` holds the short message (written in the
  mydither caption voice: no poem, no rhyme; growth / percussiveness /
  ingenuity / natural wonder) and credits (original drawing source, sound
  used — sound credited even though audio is added at post time).

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
