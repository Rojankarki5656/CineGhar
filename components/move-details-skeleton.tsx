// components/movie-details-skeleton.tsx
"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export function MovieDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />
      <main>
        <div className="relative">
          {/* Banner skeleton */}
          <div className="relative h-[70vh] w-full bg-zinc-900 animate-pulse">
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent z-10" />
          </div>

          {/* Info block */}
          <div className="relative z-20 max-w-6xl mx-auto px-4 md:px-6 -mt-72">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Poster skeleton */}
              <div className="w-full md:w-1/3 lg:w-1/4">
                <div className="aspect-[2/3] rounded-lg overflow-hidden shadow-2xl bg-zinc-800 animate-pulse" />
              </div>

              {/* Details skeleton */}
              <div className="w-full md:w-2/3 lg:w-3/4 space-y-6">
                {/* Title + meta */}
                <div className="space-y-3">
                  <div className="h-10 md:h-12 w-3/4 rounded bg-zinc-800 animate-pulse" />
                  <div className="h-4 w-1/3 rounded bg-zinc-800 animate-pulse" />

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <div className="h-4 w-12 rounded bg-zinc-800 animate-pulse" />
                    <div className="h-4 w-16 rounded bg-zinc-800 animate-pulse" />
                    <div className="h-4 w-20 rounded bg-zinc-800 animate-pulse" />
                    <div className="h-4 w-14 rounded bg-zinc-800 animate-pulse" />
                  </div>
                </div>

                {/* Genres */}
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-7 w-20 rounded-full bg-zinc-800 animate-pulse"
                    />
                  ))}
                </div>

                {/* Plot */}
                <div className="space-y-2">
                  <div className="h-4 w-full rounded bg-zinc-800 animate-pulse" />
                  <div className="h-4 w-full rounded bg-zinc-800 animate-pulse" />
                  <div className="h-4 w-5/6 rounded bg-zinc-800 animate-pulse" />
                </div>

                {/* Meta rows */}
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex gap-2">
                      <div className="h-4 w-24 rounded bg-zinc-800 animate-pulse" />
                      <div className="h-4 w-1/2 rounded bg-zinc-800 animate-pulse" />
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-4 pt-4">
                  <div className="h-10 w-28 rounded bg-zinc-800 animate-pulse" />
                  <div className="h-10 w-28 rounded bg-zinc-800 animate-pulse" />
                  <div className="h-10 w-44 rounded bg-zinc-800 animate-pulse" />
                  <div className="h-10 w-24 rounded bg-zinc-800 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Cast skeleton */}
        <section className="max-w-6xl mx-auto px-4 md:px-6 py-10">
          <div className="h-7 w-32 rounded bg-zinc-800 animate-pulse mb-4" />
          <div className="flex gap-6 overflow-hidden pb-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex-none w-[120px] text-center">
                <div className="w-[120px] h-[120px] rounded-full bg-zinc-800 animate-pulse mb-2" />
                <div className="h-4 w-20 mx-auto rounded bg-zinc-800 animate-pulse mb-1" />
                <div className="h-3 w-16 mx-auto rounded bg-zinc-800 animate-pulse" />
              </div>
            ))}
          </div>
        </section>

        {/* Similar Movies skeleton */}
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
          <div className="h-7 w-40 rounded bg-zinc-800 animate-pulse mb-4" />
          <div className="flex gap-4 overflow-hidden pb-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="flex-none w-[180px] md:w-[200px] animate-pulse"
              >
                <div className="aspect-[2/3] rounded-md bg-zinc-800" />
                <div className="mt-2 h-3 w-4/5 rounded bg-zinc-800" />
                <div className="mt-1 h-3 w-2/5 rounded bg-zinc-800" />
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}