import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://gridnoiseanimator.net/sitemap.xml",
    host: "https://gridnoiseanimator.net",
  };
}

