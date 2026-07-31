# Cloudflare Pages Launch Handoff

Last verified: 2026-08-01 (Asia/Shanghai)

## Source and deployment

- Public repository: `https://github.com/olokojoh/gridnoiseanimator`
- Default and production branch: `main`
- Public support/contact channel: `https://github.com/olokojoh/gridnoiseanimator/issues`
- Cloudflare Pages project: `gridnoiseanimator`
- Pages URL: `https://gridnoiseanimator.pages.dev`
- Deployment mode: Cloudflare Pages native GitHub integration, with automatic production deployments from pushes to `main`
- Framework preset: None
- Root directory: repository root
- Build command: `npm run build`
- Build output directory: `dist/client`
- Package manager: npm, installed from `package-lock.json`
- Pages runtime: Advanced Mode `_worker.js`, bundled by `scripts/prepare-pages.mjs`
- Compatibility date: `2026-05-15`
- Compatibility flag: `nodejs_compat`
- Runtime bindings: none
- Last verified product commit: `cada0ce66abd48df1f1907ef9ac55423100d705b`

The local `sites` Git remote is retained only as historical local context. It is not a GitHub or Cloudflare Pages publication target. The public `main` history was created as a clean product-source history and does not contain the former internal Sites hosting configuration or local promotion Markdown.

## Domain and DNS

- Canonical production origin: `https://gridnoiseanimator.net`
- Alternate host: `www.gridnoiseanimator.net`
- DNS provider: Cloudflare
- Apex and `www` are proxied CNAME records targeting `gridnoiseanimator.pages.dev`.
- Both hosts are attached to the Pages project and reported active by Pages domain validation.
- HTTP requests are upgraded to HTTPS.
- A Cloudflare redirect rule matches `http*://www.*` and redirects permanently to `https://${2}` while preserving the query string. HTTPS `www` therefore redirects directly to the canonical apex; HTTP `www` may first receive the zone HTTPS upgrade and then the canonical-host redirect.

## Crawling, ads.txt, and Search Console

- robots: `https://gridnoiseanimator.net/robots.txt`
- sitemap: `https://gridnoiseanimator.net/sitemap.xml`
- ads.txt: `https://gridnoiseanimator.net/ads.txt`
- `public/ads.txt` is sourced from the release reference `Adsense_doc/ads.txt` outside this repository and contains the required publisher record.
- The release test suite treats the real GitHub Issues contact URL and exact ads.txt publisher record as non-skipped gates.
- Google Search Console property: domain property `gridnoiseanimator.net`
- Ownership method: DNS TXT record at the apex; the verification record must remain present.
- Ownership status on 2026-08-01: verified.
- Sitemap submission on 2026-08-01: `Success`, last read 2026-08-01, with 6 discovered pages and 0 discovered videos. The first immediate fetch overlapped new DNS propagation, then Google's retry succeeded.

## Verification and rollback

Before release, run:

```sh
npm ci
npm test
npm run lint
git diff --check
```

The verified local release result was 7 tests passed, 0 failed, 0 skipped, plus a clean lint and whitespace check. Production checks covered the six sitemap routes, a real 404, robots, sitemap XML parsing, the exact ads.txt record, TLS, canonical metadata, redirects, and a browser console with no warnings or errors. The most recent full upload/play/stop/GIF interaction baseline is recorded in the R04/R06 verification artifacts; Chrome file upload requires the ChatGPT Chrome Extension's file-URL access permission.

To roll back, use Cloudflare Pages to redeploy the last known-good production deployment for product commit `cada0ce66abd48df1f1907ef9ac55423100d705b`, or revert the responsible `main` commit and push the revert so the native Git integration creates a new production deployment. Do not publish through the local `sites` remote.

## Recorded follow-ups and risks

- ads.txt availability does not prove that the site was added to AdSense or approved for ads. AdSense Sites, ad code, review status, and a Google-certified CMP still require separate account-side work before serving personalized ads where applicable.
- The current production dependency audit reports three high-severity advisories through Next.js transitive packages. `npm audit fix --force` proposes an incompatible downgrade and was not applied.
- Promotion, link-spam, review, and reputation risks are release notes only. The active pcManager promotion session must not be stopped, paused, restarted, or modified by this release workflow.
