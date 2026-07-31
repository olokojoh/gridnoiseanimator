# On-Page SEO Plan

## Product baseline

- Product: Grid Noise Animator
- Audience: artists and creators seeking animated grid noise, glitch effects,
  and local browser processing
- Primary user action: load media, tune the animation, and export it
- Default language: English
- Rendering framework: Next.js-compatible vinext with a server-rendered page
  shell and a client-side canvas tool
- Assumptions: `https://gridnoiseanimator.net` is the canonical production
  origin; the homepage is the primary product page, supported by guide and
  trust pages added in the 2026-08-01 remediation round

## Page map

| Page type | Canonical URL | Search intent | Primary keyword cluster | Indexing | Title | H1 | Above-fold task/answer | Schema | Key internal links |
|---|---|---|---|---|---|---|---|---|---|
| Homepage / tool | `/` | Navigational + tool | grid noise animator, grid noise animation, animated grid noise | index | Grid Noise Animator — Free Online Image Noise Animation Tool | Grid Noise Animator | Load an image or video and preview grid-based color noise locally | WebApplication, FAQPage | `#how-it-works`, `#features`, `#faq`, `/guide`, `/about`, `/privacy` |
| Settings guide | `/guide` | Informational | grid noise animator settings, how to use grid noise animator | index | Settings Guide — Grid Noise Animator | Settings guide | What each control does, with starting points | none | `/`, `/export-formats`, `/how-protection-works` |
| Export help | `/export-formats` | Informational | grid noise animator export, mp4 webm gif export | index | Export Formats and Troubleshooting — Grid Noise Animator | Export formats and troubleshooting | Format table plus fixes for common failures | none | `/`, `/guide` |
| Protection explainer | `/how-protection-works` | Informational | grid noise ai protection, does grid noise prevent ai training | index | How the Protection Overlays Work — Grid Noise Animator | How the protection overlays work | Exact overlay mechanism and its limits | none | `/`, `/guide` |
| About | `/about` | Trust | — | index | About — Grid Noise Animator | About this project | Independent implementation, relationship to the original tool, contact | none | `/`, `/privacy`, `/how-protection-works` |
| Privacy | `/privacy` | Trust | — | index | Privacy Policy — Grid Noise Animator | Privacy policy | Local processing, storage, and advertising cookie disclosures | none | `/`, `/about` |

## Site-wide decisions

- Canonical policy: the homepage self-canonicals to
  `https://gridnoiseanimator.net/`.
- Parameter policy: language and UI-state parameters are not separate
  indexable pages and canonicalize to `/`.
- Search-page indexing policy: not applicable.
- UGC indexing threshold: not applicable; user files never leave the browser.
- Pagination: not applicable.
- Sitemap groups: six canonical pages in `/sitemap.xml` (home, guide, export
  help, protection explainer, about, privacy).
- Language/hreflang: the tool UI offers five partially translated label sets
  (en, ja, ko, zh-hans, zh-hant) stored client-side; the document language
  stays `en`. No hreflang is emitted because there are no translated URLs.

## Page contract

- Title: `Grid Noise Animator — Free Online Image Noise Animation Tool`
- Description: `Create animated grid noise and glitch effects from images or videos. Preview and export MP4, WebM, or GIF locally in your browser—free and no upload.`
- H1: `Grid Noise Animator`
- Core modules: tool, how it works, features and limitations, privacy, FAQ
- Image alt policy: uploaded media is user-controlled canvas content; decorative
  icons use empty alternatives or text equivalents
- Structured data: `WebApplication` and visible `FAQPage` only; no fabricated
  ratings, reviews, or performance claims

## Validation (2026-07-31 build; superseded by the remediation records below)

| Check | Evidence | Result |
|---|---|---|
| Core content in initial HTML | Rendered worker HTML contains the tool H1, introductory answer, feature copy, privacy note, and FAQ | Pass |
| Unique title and description | Rendered worker test asserts the homepage title and metadata | Pass |
| Self-referencing canonical | Rendered worker HTML contains `https://gridnoiseanimator.net/` | Pass |
| Exactly one H1 | Automated HTML test counts one H1 | Pass |
| JSON-LD parses and matches visible content | Rendered HTML includes visible `WebApplication` and `FAQPage` entities | Pass |
| `robots.txt` allows `/` and lists sitemap | Worker route test verifies both directives | Pass |
| Sitemap contains only canonical homepage | Worker route test verifies the canonical URL | Pass |
| Mobile tool is usable without horizontal overflow | Playwright at 390×844 returned `scrollWidth <= clientWidth`; controls, preview, mask buttons, and language picker remained usable | Pass |

## Interaction validation (2026-07-31 build; superseded by the R03 remediation record below)

- Synthetic local image loaded successfully and enabled preview/export.
- Enhanced mode exposed variation interval.
- Detail mode exposed depth, edge strength, and reprocess.
- Deep Protect exposed epsilon/steps and changed to `Prepared`.
- Preview play/stop worked.
- Simplified Chinese selection changed the tool heading and core actions.
- GIF export completed and downloaded a valid `.gif` artifact.
- Fresh page load produced no browser console errors or warnings.
- Desktop visual comparison and mobile viewport screenshots were reviewed.

## Social preview

- Asset: `public/og.png`
- Dimensions: 1200×630
- Prompt: dark grid-noise creative-tool card using the finished blue/violet
  palette with the exact text `GRID NOISE ANIMATOR` and
  `Animate images. Export locally.`
- Generation path: built-in image generation tool; one generated candidate,
  text and composition accepted without a retry

## Audit + fix record (2026-08-01)

- Mode: repository and local production runtime; the live production host was
  not audited.
- Baseline findings: no P0 or P1 issue; one P2 main-landmark issue and two P3
  social/section-label issues were verified.
- Remediation: the tool, H1, and explanatory content now share one `<main>`;
  the Twitter image has descriptive alt text; the three-step region is named
  `How to use Grid Noise Animator` instead of inheriting the first step's name.
- Regression coverage: rendered HTML tests now verify the description, robots
  meta, canonical, social image metadata, one H1 within one main landmark,
  parseable WebApplication/FAQPage JSON-LD, parameter canonicalization, a true
  404 response, robots.txt, and sitemap.xml.
- Verification: `npm test` passed 3/3 tests after a production build;
  `npm run lint` passed. A rendered browser check at 390×844 confirmed
  `scrollWidth === clientWidth` (390 px), the expected landmark and section
  names, Twitter image alt, and zero console warnings/errors.
- Remaining evidence gap: Search Console, production HTTP behavior, rankings,
  impressions, CTR, and field Core Web Vitals were not available in this run.

## Remediation record (2026-08-01, R03)

- Canonical origin switched from `gridnoiseanimator.com` to
  `https://gridnoiseanimator.net` across metadata, robots, sitemap, tests,
  and docs.
- Added `/privacy`, `/about`, `/guide`, `/export-formats`, and
  `/how-protection-works`, each with its own title, description,
  self-canonical, one H1, and a shared footer that links every page.
- Homepage honesty section renamed from `#privacy` to `#protection` and
  rewritten without the "Deep Protect" name; footer now links the real
  privacy and about pages.
- Tool copy aligned with behavior: "Deep Protect" (epsilon, steps, fake
  Prepare step) replaced by a "Strong overlay" intensity slider; "ML
  resistance"/"ML Protection" labels replaced with descriptive names; the
  language picker now lists only the five label sets that exist and no longer
  rewrites `document.documentElement.lang`/`dir`.
- FAQ gained a question stating this is an independent implementation, with
  matching FAQPage JSON-LD.
- Unused template scaffolding removed: `app/chatgpt-auth.ts`, `db/`,
  `drizzle/`, `drizzle.config.ts`, `examples/`, and the `db:generate` script.
- Rendered-HTML tests extended to cover the five new routes. Not executed in
  this round; build, lint, and test verification are owed by the next Codex
  round. `public/og.png` carries no domain text, so it is unaffected by the
  domain switch.

## Remediation record (2026-08-01, R05)

Fixes for the locally repairable findings in the R04 formal verification:

- All internal navigation now uses `next/link`; plain `<a>` remains only for
  external links and the contact placeholder. This addresses the seven
  `@next/next/no-html-link-for-pages` lint errors R04 reported.
- Overlay copy corrected in the tool helper, the settings guide, and the
  protection explainer: both overlays draw the same 4×4 pattern, and the
  strong overlay is described as the same pattern at higher opacity (roughly
  4% to 14%, soft-light), not as a "denser" pattern.
- The protection explainer now says earlier builds kept the reference
  interface's "Deep Protect" label, instead of "copied the reference
  interface".
- Blue noise copy on the homepage and in the guide now describes the
  golden-ratio sequence as blue-noise style rather than claiming a verified
  blue-noise distribution.
- Tests: the sitemap assertion covers all six URLs, a crawl test checks every
  internal page link on rendered pages for 404s, and release gates require a
  real contact URL plus the exact `public/ads.txt` seller record.
- Not executed this round: build, lint, tests, browser, network. R04 remains
  the latest formal verification baseline; these fixes await the next run.

## Open items

- Production deployment hostname may differ from the intended custom domain
  until DNS is connected. Metadata keeps the requested canonical domain.
- Search Console, rankings, impressions, and CTR are outside repository
  verification.
