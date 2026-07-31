import assert from "node:assert/strict";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the complete Grid Noise Animator SEO shell", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(
    html,
    /<title>Grid Noise Animator — Free Online Image Noise Animation Tool<\/title>/i,
  );
  assert.match(
    html,
    /<meta name="description" content="Create animated grid noise and glitch effects from images or videos\./i,
  );
  assert.match(html, /<meta name="robots" content="index, follow"/i);
  assert.match(html, /<h1[^>]*>Grid Noise Animator<\/h1>/i);
  assert.match(html, /Create animated grid noise in your browser/i);
  assert.match(
    html,
    /<link[^>]+rel="canonical"[^>]+href="https:\/\/gridnoiseanimator\.net\/"/i,
  );
  assert.match(
    html,
    /<meta property="og:image" content="https:\/\/gridnoiseanimator\.net\/og\.png"/i,
  );
  assert.match(
    html,
    /<meta name="twitter:image:alt" content="Grid Noise Animator — Animate images\. Export locally\."/i,
  );
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
  assert.equal((html.match(/<h1\b/gi) || []).length, 1);
  assert.equal((html.match(/<main\b/gi) || []).length, 1);
  assert.match(html, /<main[^>]*>[\s\S]*<h1[^>]*>Grid Noise Animator<\/h1>/i);
  assert.match(
    html,
    /<section class="steps" aria-label="How to use Grid Noise Animator">/i,
  );

  const schemas = [
    ...html.matchAll(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
    ),
  ].map((match) => JSON.parse(match[1]));
  assert.deepEqual(
    schemas.map((schema) => schema["@type"]),
    ["WebApplication", "FAQPage"],
  );
});

test("canonicalizes tracking parameters and returns a real 404", async () => {
  const parameterResponse = await render("/?utm_source=audit");
  const parameterHtml = await parameterResponse.text();
  assert.equal(parameterResponse.status, 200);
  assert.match(
    parameterHtml,
    /<link[^>]+rel="canonical"[^>]+href="https:\/\/gridnoiseanimator\.net\/"/i,
  );

  const missing = await render("/missing-page");
  assert.equal(missing.status, 404);
});

test("publishes robots and sitemap routes", async () => {
  const robots = await render("/robots.txt");
  const robotsText = await robots.text();
  assert.equal(robots.status, 200);
  assert.match(robotsText, /Allow: \//);
  assert.match(
    robotsText,
    /Sitemap: https:\/\/gridnoiseanimator\.net\/sitemap\.xml/,
  );

  const sitemap = await render("/sitemap.xml");
  const sitemapText = await sitemap.text();
  assert.equal(sitemap.status, 200);
  for (const path of [
    "/",
    "/guide",
    "/export-formats",
    "/how-protection-works",
    "/about",
    "/privacy",
  ]) {
    assert.match(
      sitemapText,
      new RegExp(`https://gridnoiseanimator\\.net${path === "/" ? "/" : path}`),
      `sitemap should list ${path}`,
    );
  }
});

test("serves the trust and guide pages with self-canonicals", async () => {
  const pages = [
    [
      "/privacy",
      /<h1[^>]*>Privacy policy<\/h1>/i,
      /Third-party vendors, including Google, use cookies/i,
    ],
    [
      "/about",
      /<h1[^>]*>About this project<\/h1>/i,
      /not affiliated with or endorsed by its author/i,
    ],
    ["/guide", /<h1[^>]*>Settings guide<\/h1>/i, /Grid size/i],
    [
      "/export-formats",
      /<h1[^>]*>Export formats and troubleshooting<\/h1>/i,
      /256-color palette/i,
    ],
    [
      "/how-protection-works",
      /<h1[^>]*>How the protection overlays work<\/h1>/i,
      /Deep Protect/i,
    ],
  ];

  for (const [path, ...expectations] of pages) {
    const response = await render(path);
    assert.equal(response.status, 200, `${path} should return 200`);
    const html = await response.text();
    for (const expected of expectations) {
      assert.match(html, expected, `${path} should match ${expected}`);
    }
    assert.match(
      html,
      new RegExp(
        `rel="canonical"[^>]+href="https://gridnoiseanimator\\.net${path}"`,
      ),
      `${path} should self-canonicalize`,
    );
    assert.equal(
      (html.match(/<h1\b/gi) || []).length,
      1,
      `${path} should have one h1`,
    );
  }
});

test("every internal page link on rendered pages resolves", async () => {
  const pages = [
    "/",
    "/guide",
    "/export-formats",
    "/how-protection-works",
    "/about",
    "/privacy",
  ];
  const targets = new Set();

  for (const path of pages) {
    const response = await render(path);
    const html = await response.text();
    for (const [, href] of html.matchAll(/href="(\/[^"]*)"/g)) {
      const withoutHash = href.split("#")[0] || "/";
      // Static assets (favicon, images) are served by the ASSETS binding,
      // which this harness stubs out; only crawl extensionless routes.
      if (/\.[a-z0-9]+$/i.test(withoutHash)) continue;
      targets.add(withoutHash);
    }
  }

  for (const target of targets) {
    const response = await render(target);
    assert.notEqual(
      response.status,
      404,
      `internal link ${target} should not return 404`,
    );
  }
});

test(
  "release gate: contact placeholder must be replaced",
  async () => {
    for (const path of ["/about", "/privacy"]) {
      const response = await render(path);
      const html = await response.text();
      assert.doesNotMatch(
        html,
        /\{\{CONTACT_URL\}\}/,
        `${path} must not render the contact placeholder`,
      );
    }
  },
);

test(
  "release gate: ads.txt contains the exact publisher record",
  async () => {
    const { readFile } = await import("node:fs/promises");
    const body = await readFile(
      new URL("../public/ads.txt", import.meta.url),
      "utf8",
    );
    assert.equal(
      body.trim(),
      "google.com, pub-6112182006844125, DIRECT, f08c47fec0942fa0",
    );
  },
);
