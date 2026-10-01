// components/movie-details.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { MovieRow } from "@/components/movie-row";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  Info,
  Play,
  Plus,
  Minus,
  Star,
  ExternalLink,
  Film,
  Calendar,
  Globe,
  DollarSign,
} from "lucide-react";
import type { MovieDetail } from "@/hooks/movieseDetailService";

export default function MovieDetailsPage({ movie }: { movie: MovieDetail }) {
  const movieId = movie.id; // ← use the prop, no useParams needed
  const router = useRouter();

  const [isInMyList, setIsInMyList] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [error, setError] = useState("");
  const [showTrailer, setShowTrailer] = useState(false);

  /* ---------- Watchlist: check on mount ---------- */
  useEffect(() => {
    if (!movieId) return;

    const checkWatchlist = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setListLoading(false);
        return;
      }

      try {
      } catch {
        setError("An unexpected error occurred while checking watchlist");
      } finally {
        setListLoading(false);
      }
    };

    checkWatchlist();
  }, [movieId]);

  /* ---------- Watchlist: toggle ---------- */
  const toggleMyList = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setError("Please log in to manage your list.");
      router.push("/login");
      return;
    }

    setListLoading(true);
    setError("");

    try {
    } catch {
      setError("An unexpected error occurred while updating watchlist");
    } finally {
      setListLoading(false);
    }
  };

  const durationLabel = movie.runtime ? `${movie.runtime} min` : "—";
  const directorLabel = movie.directors?.map((d) => d.name).join(", ") || "—";
  const writerLabel = movie.writers?.map((w) => w.name).join(", ") || "—";
  const castLabel =
    movie.topCast
      ?.slice(0, 6)
      .map((c) => c.name)
      .join(", ") || "—";

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />
      <main>
        <div className="relative">
          {/* Banner */}
          <div className="relative h-[70vh] w-full">
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent z-10" />
            {movie.image && (
              <Image
                src={movie.image}
                alt={`${movie.title} banner`}
                fill
                className="object-cover"
                unoptimized
                priority
              />
            )}
          </div>

          {/* Info */}
          <div className="relative z-20 max-w-6xl mx-auto px-4 md:px-6 -mt-72">
            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-500 p-3 rounded-md mb-6">
                {error}
              </div>
            )}

            <div className="flex flex-col md:flex-row gap-8">
              {/* Poster */}
              <div className="w-full md:w-1/3 lg:w-1/4">
                <div className="aspect-[2/3] rounded-lg overflow-hidden shadow-2xl bg-zinc-900">
                  {movie.image && (
                    <Image
                      src={movie.image}
                      alt={`${movie.title} poster`}
                      width={300}
                      height={450}
                      unoptimized
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </div>

              {/* Details */}
              <div className="w-full md:w-2/3 lg:w-3/4 space-y-6">
                <div>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
                    {movie.title}
                  </h1>
                  {movie.originalTitle &&
                    movie.originalTitle !== movie.title && (
                      <p className="text-gray-400 text-sm mt-1 italic">
                        {movie.originalTitle}
                      </p>
                    )}

                  <div className="flex flex-wrap items-center gap-3 mt-3 text-sm md:text-base text-gray-300">
                    <span>{movie.year || "—"}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-500" />
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {durationLabel}
                    </span>
                    {movie.rating != null && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-gray-500" />
                        <span className="flex items-center">
                          <Star className="w-4 h-4 mr-1 text-yellow-500 fill-yellow-500" />
                          {movie.rating}/10
                          {movie.voteCount > 0 && (
                            <span className="ml-1 text-gray-400 text-xs">
                              ({movie.voteCount.toLocaleString()})
                            </span>
                          )}
                        </span>
                      </>
                    )}
                    {movie.metascore != null && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-gray-500" />
                        <span className="flex items-center">
                          <span className="inline-flex items-center justify-center w-5 h-5 mr-1 bg-green-600 text-white text-[10px] font-bold rounded">
                            {movie.metascore}
                          </span>
                          Metascore
                        </span>
                      </>
                    )}
                    {movie.certificate && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-gray-500" />
                        <span className="border border-gray-500 px-2 text-xs rounded">
                          {movie.certificate}
                        </span>
                      </>
                    )}
                    {movie.type && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-gray-500" />
                        <span className="capitalize">{movie.type}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Genres */}
                <div className="flex flex-wrap gap-2">
                  {movie.genres?.map((genre) => (
                    <Badge
                      key={genre}
                      variant="outline"
                      className="text-xs md:text-sm px-3 py-1 text-white"
                    >
                      {genre}
                    </Badge>
                  ))}
                </div>

                {/* Plot */}
                <p className="text-gray-300 text-sm md:text-base lg:text-lg leading-relaxed">
                  {movie.plot}
                </p>

                {/* Meta info */}
                <div className="space-y-3 text-sm md:text-base">
                  <div className="flex gap-2">
                    <span className="font-semibold min-w-28 text-gray-200">
                      Director:
                    </span>
                    <span className="text-gray-300">{directorLabel}</span>
                  </div>
                  {movie.writers?.length > 0 && (
                    <div className="flex gap-2">
                      <span className="font-semibold min-w-28 text-gray-200">
                        Writers:
                      </span>
                      <span className="text-gray-300">{writerLabel}</span>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <span className="font-semibold min-w-28 text-gray-200">
                      Cast:
                    </span>
                    <span className="text-gray-300">{castLabel}</span>
                  </div>
                  {movie.releaseDate && (
                    <div className="flex gap-2">
                      <span className="font-semibold min-w-28 text-gray-200">
                        Release Date:
                      </span>
                      <span className="text-gray-300 flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {movie.releaseDate}
                      </span>
                    </div>
                  )}
                  {movie.spokenLanguages?.length > 0 && (
                    <div className="flex gap-2">
                      <span className="font-semibold min-w-28 text-gray-200">
                        Language:
                      </span>
                      <span className="text-gray-300">
                        {movie.spokenLanguages.join(", ")}
                      </span>
                    </div>
                  )}
                  {movie.countriesOfOrigin?.length > 0 && (
                    <div className="flex gap-2">
                      <span className="font-semibold min-w-28 text-gray-200">
                        Country:
                      </span>
                      <span className="text-gray-300 flex items-center">
                        <Globe className="w-4 h-4 mr-1" />
                        {movie.countriesOfOrigin.join(", ")}
                      </span>
                    </div>
                  )}
                  {movie.boxOffice?.grossWorldwide != null && (
                    <div className="flex gap-2">
                      <span className="font-semibold min-w-28 text-gray-200">
                        Box Office:
                      </span>
                      <span className="text-gray-300 flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />$
                        {movie.boxOffice.grossWorldwide.toLocaleString()}
                      </span>
                    </div>
                  )}
                  {movie.boxOffice?.budget != null && (
                    <div className="flex gap-2">
                      <span className="font-semibold min-w-28 text-gray-200">
                        Budget:
                      </span>
                      <span className="text-gray-300">
                        ${movie.boxOffice.budget.toLocaleString()}
                      </span>
                    </div>
                  )}
                  {movie.boxOffice?.openingWeekend != null && (
                    <div className="flex gap-2">
                      <span className="font-semibold min-w-28 text-gray-200">
                        Opening Weekend:
                      </span>
                      <span className="text-gray-300">
                        ${movie.boxOffice.openingWeekend.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-4 pt-4">
                  <Link href={`/watch/${movie.imdbId ?? movie.id}`}>
                    <Button
                      className="bg-red-600 hover:bg-red-700 text-white gap-2"
                      aria-label={`Play ${movie.title}`}
                    >
                      <Play className="w-5 h-5 fill-white" />
                      Play
                    </Button>
                  </Link>

                  {movie.trailer?.link && (
                    <Button
                      variant="outline"
                      className="gap-2 text-black"
                      onClick={() => setShowTrailer(true)}
                      aria-label={`Watch trailer for ${movie.title}`}
                    >
                      <Film className="w-5 h-5" />
                      Trailer
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    className="gap-2 text-black"
                    onClick={toggleMyList}
                    disabled={listLoading}
                    aria-label={
                      isInMyList
                        ? `Remove ${movie.title} from My List`
                        : `Add ${movie.title} to My List`
                    }
                  >
                    {listLoading ? (
                      "Loading..."
                    ) : isInMyList ? (
                      <>
                        <Minus className="w-5 h-5" />
                        Remove from My List
                      </>
                    ) : (
                      <>
                        <Plus className="w-5 h-5" />
                        Add to My List
                      </>
                    )}
                  </Button>

                  {movie.link && (
                    <a
                      href={movie.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" className="gap-2 text-black">
                        <ExternalLink className="w-5 h-5" />
                        IMDb
                      </Button>
                    </a>
                  )}

                  <Button variant="outline" className="gap-2 text-black">
                    <Info className="w-5 h-5" />
                    More Info
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Cast */}
        {movie.topCast?.length > 0 && (
          <section className="max-w-6xl mx-auto px-4 md:px-6 py-10">
            <h2 className="text-xl md:text-2xl font-bold mb-4">Top Cast</h2>
            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
              {movie.topCast.slice(0, 12).map((person) => (
                <a
                  key={person.id}
                  href={person.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-none w-[120px] text-center group"
                >
                  <div className="w-[120px] h-[120px] rounded-full overflow-hidden bg-zinc-800 mb-2">
                    {person.image ? (
                      <Image
                        src={person.image}
                        alt={person.name}
                        width={120}
                        height={120}
                        unoptimized
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
                        No photo
                      </div>
                    )}
                  </div>
                  <p className="text-sm font-medium line-clamp-2">
                    {person.name}
                  </p>
                  {person.characters?.[0] && (
                    <p className="text-xs text-gray-400 line-clamp-1">
                      {person.characters[0]}
                    </p>
                  )}
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Similar Movies */}
        {movie.similarTitles?.length > 0 && (
          <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
            <MovieRow
              title="Similar Movies"
              movies={movie.similarTitles.map((s) => ({
                imdbId: s.imdbId ?? s.id,
                id: s.id,
                title: s.title,
                image: s.image ?? "/placeholder.svg",
                year: String(s.year ?? ""),
                rating: s.rating != null ? String(s.rating) : "—",
                genres: s.genres,
              }))}
            />
          </div>
        )}

        {/* Trailer Modal */}
        {showTrailer && movie.trailer?.link && (
          <div
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
            onClick={() => setShowTrailer(false)}
          >
            <div
              className="bg-zinc-900 rounded-lg overflow-hidden max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-3 border-b border-zinc-800">
                <h3 className="font-semibold">
                  {movie.trailer.title ?? `${movie.title} — Trailer`}
                </h3>
                <button
                  onClick={() => setShowTrailer(false)}
                  className="text-gray-400 hover:text-white"
                  aria-label="Close trailer"
                >
                  ✕
                </button>
              </div>
              <a
                href={movie.trailer.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block relative aspect-video"
              >
                {movie.trailer.thumbnail && (
                  <Image
                    src={movie.trailer.thumbnail}
                    alt={movie.trailer.title ?? `Trailer for ${movie.title}`}
                    unoptimized
                    fill
                    className="object-cover"
                  />
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/30 transition">
                  <Play className="w-16 h-16 text-white fill-white" />
                </div>
              </a>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
