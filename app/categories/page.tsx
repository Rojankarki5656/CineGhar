// app/categories/page.tsx
"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { MovieGrid } from "@/components/movie-grid";
import { MovieGridSkeleton } from "@/components/movie-grid-skeleton";
import { useSearch } from "@/hooks/searchService";

const CATEGORIES = [
  "All",
  "Action",
  "Comedy",
  "Drama",
  "Romance",
  "Thriller",
  "Adventure",
  "Family",
  "Sci-Fi",
  "Horror",
  "Crime",
  "Animation",
] as const;

type Category = (typeof CATEGORIES)[number];

export default function CategoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("All");

  // "All" → no genre filter, but we still need one filter to satisfy the API.
  // Use type=movie as the default browse filter.
  const searchParams =
    selectedCategory === "All"
      ? { type: "movie", limit: 40 }
      : { genre: selectedCategory, limit: 40 };

  const { data: results, loading, error } = useSearch(searchParams, {
    debounceMs: 0,       // no debounce for chip clicks — fetch immediately
    minLength: 0,        // allow genre/type-only queries
    limit: 40,
  });

  const gridMovies = results.map((m) => ({
    id: m.imdbId ?? m.id,
    title: m.title,
    imageUrl: m.image ?? "/placeholder.svg",
    year: m.year ? String(m.year) : "",
    rating: m.rating != null ? String(m.rating) : "—",
  }));

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />

      <main className="px-4 md:px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Categories</h1>

          {/* ---------- Category chips ---------- */}
          <div className="flex flex-wrap gap-2 mb-8">
            {CATEGORIES.map((category) => (
              <Button
                key={category}
                variant={category === selectedCategory ? "default" : "outline"}
                className={
                  category === selectedCategory
                    ? "bg-red-600 hover:bg-red-700"
                    : "text-black"
                }
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* ---------- Content ---------- */}
          {loading ? (
            <MovieGridSkeleton count={18} />
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-lg text-red-400 mb-2">
                Failed to load titles
              </p>
              <p className="text-sm text-gray-500">{error}</p>
            </div>
          ) : gridMovies.length > 0 ? (
            <MovieGrid movies={gridMovies} />
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-gray-400">
                No titles found for “{selectedCategory}”.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}