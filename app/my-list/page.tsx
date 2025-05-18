"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { MovieGrid } from "@/components/movie-grid";
import { movies } from "@/lib/movies";

type Movie = {
  id: string;
  title: string;
  imageUrl: string;
  year: string;
  rating: string;
};

export default function MyListPage() {
  const [savedMovies, setSavedMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchWatchlist = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setError("Please log in to view your list.");
        setLoading(false);
        router.push("/login");
        return;
      }

      try {
        const { data, error } = await supabase
          .from("watchlist")
          .select("movie_id")
          .eq("user_id", userId);

        if (error) {
          setError("Failed to fetch your list: " + error.message);
          setLoading(false);
          return;
        }

        const savedIds = data?.map((item) => item.movie_id) || [];
        const saved = movies
          .filter((m) => savedIds.includes(m.id))
          .map(({ id, title, imageUrl, year, rating }) => ({
            id,
            title,
            imageUrl,
            year,
            rating,
          }));
        setSavedMovies(saved);
        setLoading(false);
      } catch (err) {
        setError("An unexpected error occurred while fetching your list");
        setLoading(false);
      }
    };

    fetchWatchlist();
  }, [router]);

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />

      <main className="px-4 md:px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">My List</h1>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-500 p-3 rounded-md mb-6">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-16">
              <p className="text-xl text-gray-400">Loading your list...</p>
            </div>
          ) : savedMovies.length > 0 ? (
            <MovieGrid movies={savedMovies} />
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-gray-400">Your list is empty. Add movies to watch later.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}