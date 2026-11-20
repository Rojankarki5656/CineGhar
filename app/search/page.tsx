"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { MovieGrid } from "@/components/movie-grid";
import { MovieGridSkeleton } from "@/components/movie-grid-skeleton";
import { useSearch } from "@/hooks/searchService";
import { SearchX } from "lucide-react";

// Separate component to handle the search logic (required for useSearchParams in Next.js App Router)
function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";

  // Use your existing hook to fetch results
  const { data: results, loading, error } = useSearch(
    { query },
    { debounceMs: 0, minLength: 1, limit: 50 }
  );

  // Handle Loading State with your existing Skeleton
  if (loading) {
    return (
      <div className="w-full">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Searching for <span className="text-red-500">"{query}"</span>...
          </h1>
        </div>
        <MovieGridSkeleton count={12} />
      </div>
    );
  }

  // Handle Error State
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-red-500">
        <p className="text-xl font-semibold mb-2">Something went wrong</p>
        <p className="text-zinc-400">{error}</p>
      </div>
    );
  }

  // Handle Empty State
  if (!results || results.length === 0) {
    return (
      <div className="w-full">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Search Results for <span className="text-red-500">"{query}"</span>
          </h1>
        </div>
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center bg-zinc-900/50 rounded-xl border border-zinc-800/50 p-8">
          <SearchX className="w-16 h-16 text-zinc-600 mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">No results found</h2>
          <p className="text-zinc-400 max-w-md">
            We couldn't find anything matching "{query}". Try adjusting your keywords or searching for a different movie.
          </p>
        </div>
      </div>
    );
  }

  // Format the API results to match the props expected by your MovieGrid component
  const formattedMovies = results.map((m: any) => ({
    id: m.imdbId ?? m.id, 
    title: m.title,
    imageUrl: m.image || "/placeholder.svg",
    year: String(m.year ?? ""),
    rating: m.rating != null ? String(m.rating) : "",
  }));

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
          Search Results for <span className="text-red-500">"{query}"</span>
        </h1>
        <p className="text-zinc-400 text-sm md:text-base">
          Found {results.length} titles
        </p>
      </div>

      {/* Use your existing MovieGrid! */}
      <MovieGrid movies={formattedMovies} />
    </div>
  );
}

export default function SearchPage() {
  return (
    // Netflix uses a very dark, slightly warm black (#141414)
    <div className="min-h-screen bg-[#141414] text-white flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 md:px-8 py-12">
        {/* Suspense is required by Next.js when using useSearchParams in a client component */}
        <Suspense 
          fallback={
            <div className="w-full">
              <div className="h-10 w-64 bg-zinc-800 animate-pulse rounded mb-8" />
              <MovieGridSkeleton count={12} />
            </div>
          }
        >
          <SearchResults />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}