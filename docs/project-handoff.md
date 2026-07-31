# Grid Noise Animator Project Handoff

## Goal

Build an independent, from-scratch implementation of the public tool at
`https://gridnoiseanimator.com/`, preserving its visible workflow and controls
while adding search-engine-ready content for the primary keyword
`grid noise animator`.

Do not copy source code from the original project. The research report notes
that the upstream repository has no open-source license.

## Product baseline

- Product: browser-based grid noise animation tool
- Audience: illustrators, photographers, glitch-art creators, and artists
  looking for lightweight visual deterrents against automated image scraping
- Primary action: load an image or video, preview animated grid noise, export
  MP4, WebM, or GIF
- Privacy promise: processing stays in the browser; files are not uploaded
- Default language: English
- Framework: Next.js-compatible vinext application deployed to Cloudflare
  Pages through native GitHub integration

## Verified reference behavior

Reference inspected on 2026-07-31:

- Dark single-page interface with a narrow left control rail and large preview
  canvas.
- Language picker lists Japanese, English, Korean, Simplified Chinese,
  Traditional Chinese, French, Spanish, German, Russian, Arabic, Indonesian,
  Italian, Portuguese, Greek, Hebrew, Hindi, Thai, and Vietnamese.
- File input accepts images and videos and supports drag and drop.
- Grid sizes: 16, 32, 64, and 128.
- Enhanced mode exposes variation interval.
- Detail mode exposes depth, edge strength, and reprocess.
- Noise types: white noise for ML resistance and blue noise for visual quality.
- Effect controls: hue, lightness, saturation, sync cycle, blur, warp, and a
  fixed high-frequency ML protection overlay.
- Preview controls: FPS, watermark, play, and stop.
- Export controls: FPS, duration, MP4 (H.264), WebM (VP9), GIF, and Deep Protect
  with epsilon and step controls.
- Region controls become relevant after media is loaded: draw, clear, and
  apply inside/outside.

## Implementation decisions

- Canvas rendering is implemented from scratch with per-cell color transforms,
  optional warped placement, deterministic blue-noise sampling, edge/detail
  enhancement, fixed high-frequency overlay, watermark, and rectangular
  inside/outside masks.
- Video export uses `MediaRecorder` with the selected container and browser
  codec support. GIF export uses `gifenc`.
- The reference UI's "Deep Protect" mode is implemented as a fixed
  high-frequency checkerboard tint with a single intensity slider, named
  "Strong overlay". The reference's epsilon/steps/Prepare controls were
  dropped because this implementation performs no iterative computation, and
  the UI must not imply one.
- Static SEO copy and JSON-LD remain in the initial HTML. The interactive tool
  is a client component.
- Canonical production origin is `https://gridnoiseanimator.net`.

## Verification checklist

Requirements to check before calling a build releasable. Actual results
belong in each round's verification report, not in this file.

- `npm test` must pass: production build plus the rendered-worker HTML/SEO
  tests.
- `npm run lint` must pass.
- Initial HTML includes title, description, canonical, one H1, core explanatory
  copy, internal anchors, WebApplication JSON-LD, and FAQPage JSON-LD.
- Local browser test covers file loading, play/stop, enhanced/detail parameters,
  the strong overlay toggle, language switching, and successful GIF export.
- Region draw/clear/inside-outside controls appear after media loading.
- Mobile viewport at 390×844 has no horizontal overflow and keeps upload/tool
  controls usable.
- Fresh browser load has no console errors or warnings.

## Source material

- Live reference: `https://gridnoiseanimator.com/`
- SEO implementation contract: `docs/onpage-seo-plan.md`
