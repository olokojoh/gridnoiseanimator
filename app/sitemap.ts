import type { MetadataRoute } from "next";

const BASE = "https://gridnoiseanimator.net";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${BASE}/`,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${BASE}/guide`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE}/export-formats`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE}/how-protection-works`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE}/about`,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${BASE}/privacy`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
