"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { MovieGrid } from "@/components/movie-grid";
import { MovieGridSkeleton } from "@/components/movie-grid-skeleton";
import { Button } from "@/components/ui/button";
import { supabase } from "@/utils/supabase/client";

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
      try {
        let userId: string | null = null;
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          userId = user.id;
        } else {
          userId = localStorage.getItem("userId");
        }

        if (!userId) {
          router.replace("/login");
          return;
        }

        localStorage.setItem("userId", userId);

        // Fetch directly from the watchlist table, no joins needed!
        const { data, error: fetchError } = await supabase
          .from("watchlist")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false }); // Show newest additions first

        if (fetchError) throw fetchError;

        // Map the database columns to the props expected by MovieGrid
        const movies: Movie[] = (data ?? []).map((row: any) => ({
          id: row.movie_id, // Using IMDb ID for the link (e.g. /watch/tt0110912)
          title: row.title,
          imageUrl: row.image_url ?? "",
          year: String(row.year ?? ""),
          rating: String(row.rating ?? ""),
        }));

        setSavedMovies(movies);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to load your list";
        setError(message);
      } finally {
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
            <MovieGridSkeleton count={10} />
          ) : savedMovies.length > 0 ? (
            <MovieGrid movies={savedMovies} />
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-gray-400 mb-4">Your list is empty.</p>
              <Link href="/">
                <Button className="bg-red-600 hover:bg-red-700">
                  Browse Movies
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
