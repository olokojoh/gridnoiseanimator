# Grid Noise Animator

Independent browser implementation of a grid-based color-noise animation tool.
Load an image or video, preview the effect, select an optional region, and
export MP4, WebM, or GIF without uploading the source media.

## Local development

Requires Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

The development server prints its local URL.

## Verification

```bash
npm test
npm run lint
```

`npm test` builds the vinext/Cloudflare Workers output and checks initial HTML,
metadata, structured data, `robots.txt`, and `sitemap.xml`.

## Project map

- `app/GridNoiseAnimator.tsx`: client-side media loading, Canvas rendering,
  preview, masking, Deep Protect texture, audio, and export logic
- `app/page.tsx`: server-rendered product and SEO content
- `app/layout.tsx`: metadata, canonical, Open Graph, and viewport
- `docs/project-handoff.md`: verified reference behavior and implementation
  decisions
- `docs/onpage-seo-plan.md`: keyword/page contract and SEO validation record

## Important constraints

- The implementation is from scratch. Do not copy code from the original
  unlicensed repository.
- User media is processed locally in the browser.
- The canonical production origin is currently
  `https://gridnoiseanimator.net`.
- The visual-protection controls are presented as deterrents, not a guarantee
  that AI training is impossible.
