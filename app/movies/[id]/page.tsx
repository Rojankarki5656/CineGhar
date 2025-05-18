"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { MovieRow } from "@/components/movie-row";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Info, Play, Plus, Minus, Star } from "lucide-react";
import { movies } from "@/lib/movies";

export default function MovieDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const movieId = resolvedParams.id;

  const movie = movies.find((m) => m.id === movieId);
  const [isInMyList, setIsInMyList] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkWatchlist = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setError("Please log in to manage your list.");
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("watchlist")
          .select("movie_id")
          .eq("user_id", userId)
          .eq("movie_id", movieId)
          .single();

        if (error && error.code !== "PGRST116") { // PGRST116 is "no rows found"
          setError("Failed to check watchlist: " + error.message);
          setLoading(false);
          return;
        }

        setIsInMyList(!!data);
        setLoading(false);
      } catch (err) {
        setError("An unexpected error occurred while checking watchlist");
        setLoading(false);
      }
    };

    checkWatchlist();
  }, [movieId, router]);

  const toggleMyList = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setError("Please log in to manage your list.");
      router.push("/login");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (isInMyList) {
        // Remove from watchlist
        const { error } = await supabase
          .from("watchlist")
          .delete()
          .eq("user_id", userId)
          .eq("movie_id", movieId);

        if (error) {
          setError("Failed to remove from watchlist: " + error.message);
          setLoading(false);
          return;
        }

        setIsInMyList(false);
      } else {
        // Add to watchlist
        const { error } = await supabase
          .from("watchlist")
          .insert({ user_id: userId, movie_id: movieId });

        if (error) {
          setError("Failed to add to watchlist: " + error.message);
          setLoading(false);
          return;
        }

        setIsInMyList(true);
      }
      setLoading(false);
    } catch (err) {
      setError("An unexpected error occurred while updating watchlist");
      setLoading(false);
    }
  };

  if (!movie) return <div className="min-h-screen bg-zinc-950 text-white">Movie not found</div>;

  // Filter similar movies by genre (exclude current movie)
  const similarMovies = movies
    .filter((m) => m.id !== movieId && m.genres?.some((g) => movie.genres?.includes(g)))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />
      <main>
        <div className="relative">
          {/* Movie Banner */}
          <div className="relative h-[70vh] w-full">
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent z-10" />
            <Image
              src={movie.imageUrl || "/placeholder.svg"}
              alt={`${movie.title} banner`}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Movie Info */}
          <div className="relative z-20 max-w-6xl mx-auto px-4 md:px-6 -mt-72">
            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-500 p-3 rounded-md mb-6">
                {error}
              </div>
            )}

            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-1/3 lg:w-1/4">
                <div className="aspect-[2/3] rounded-lg overflow-hidden shadow-2xl">
                  <Image
                    src={movie.imageUrl || "/placeholder.svg"}
                    alt={`${movie.title} poster`}
                    width={300}
                    height={450}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="w-full md:w-2/3 lg:w-3/4 space-y-6">
                <div>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">{movie.title}</h1>
                  <div className="flex flex-wrap items-center gap-3 mt-3 text-sm md:text-base text-gray-300">
                    <span>{movie.year}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-500"></span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {movie.duration}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-gray-500"></span>
                    <span className="flex items-center">
                      <Star className="w-4 h-4 mr-1 text-yellow-500 fill-yellow-500" />
                      {movie.rating}/5
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {movie.genres?.map((genre) => (
                    <Badge key={genre} variant="outline" className="text-xs md:text-sm px-3 py-1">
                      {genre}
                    </Badge>
                  ))}
                </div>

                <p className="text-gray-300 text-sm md:text-base lg:text-lg">{movie.description}</p>

                <div className="space-y-3">
                  <div className="flex gap-2">
                    <span className="font-semibold min-w-24">Director:</span>
                    <span className="text-gray-300">{movie.director}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-semibold min-w-24">Cast:</span>
                    <span className="text-gray-300">{movie.cast?.join(", ")}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-semibold min-w-24">Release Date:</span>
                    <span className="text-gray-300">{movie.releaseDate}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-semibold min-w-24">Language:</span>
                    <span className="text-gray-300">{movie.language}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 pt-4">
                  <Link href={`/watch/${movie.id}`}>
                    <Button className="bg-red-600 hover:bg-red-700 text-white gap-2" aria-label={`Play ${movie.title}`}>
                      <Play className="w-5 h-5 fill-white" />
                      Play
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={toggleMyList}
                    disabled={loading}
                    aria-label={isInMyList ? `Remove ${movie.title} from My List` : `Add ${movie.title} to My List`}
                  >
                    {loading ? (
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
                  <Button variant="outline" className="gap-2" aria-label={`More info about ${movie.title}`}>
                    <Info className="w-5 h-5" />
                    More Info
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Movies Section */}
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
          <MovieRow title="Similar Movies" movies={similarMovies} />
        </div>
      </main>
      <Footer />
    </div>
  );
}