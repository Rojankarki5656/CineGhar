// app/movies/[id]/page.tsx
"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import MovieDetailsPage from "@/components/movie-details";
import { MovieDetailsSkeleton } from "@/components/move-details-skeleton";
import { useDetailMovies } from "@/hooks/movieseDetailService";

export default function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const {
    data: detailMovie,
    loading,
    error,
  } = useDetailMovies(id);

  // Show a full-page skeleton that mirrors the real layout
  if (loading) return <MovieDetailsSkeleton />;

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center gap-4">
        <p className="text-red-400">{error}</p>
        <a
          href="/"
          className="text-sm underline text-gray-400 hover:text-white"
        >
          Go home
        </a>
      </div>
    );
  }

  if (!detailMovie) return notFound();

  return <MovieDetailsPage movie={detailMovie} />;
}