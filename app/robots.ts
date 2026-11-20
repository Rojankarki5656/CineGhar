import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://cine-ghar.vercel.app";

  return {
    rules: {
      userAgent: "*", // Apply to all search engines (Google, Bing, etc.)
      allow: "/", // Allow crawling of everything by default
      disallow: [
        "/profile", // Don't index private user pages
        "/settings",
        "/login",
        "/signup",
        "/watch/", // Don't index video player pages (avoids thin content penalties)
        "/search", // Don't index search results (avoids duplicate content issues)
        "/api/", // Block API routes
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}