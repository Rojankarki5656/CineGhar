import { MetadataRoute } from "next";

const baseUrl = "https://cine-ghar.vercel.app";
const API_BASE = process.env.NEXT_PUBLIC_LOCAL_URL ?? process.env.NEXT_PUBLIC_IMDB_API ?? "http://localhost:8000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Define your static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/browse/top-movies`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/browse/top-tv`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/browse/popular-movies`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/browse/popular-tv`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/browse/box-office`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  // 2. Fetch dynamic movie routes (from your Top Movies chart)
  let movieRoutes: MetadataRoute.Sitemap = [];
  
  try {
    // Fetching the Top 250 gives us a great list of high-value pages to index
    const res = await fetch(`${API_BASE}/charts/top-movies?limit=250`, {
      next: { revalidate: 86400 }, // Cache for 24 hours
    });

    if (res.ok) {
      const data = await res.json();
      const movies = data.results ?? data.titles ?? [];

      movieRoutes = movies.map((movie: any) => ({
        url: `${baseUrl}/movies/${movie.imdbId ?? movie.id}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      }));
    }
  } catch (error) {
    console.warn("Failed to fetch dynamic movies for sitemap:", error);
    // If the API fails, we still return the static routes so the build doesn't crash
  }

  // 3. Return combined static and dynamic routes
  return [...staticRoutes, ...movieRoutes];
}