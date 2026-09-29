"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { MovieGrid } from "@/components/movie-grid";
import { MovieGridSkeleton } from "@/components/movie-grid-skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
        router.replace("/login");
        return;
      }

      try {

      } catch (err: any) {
        setError(err.message || "Failed to load your list");
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
              <p className="text-xl text-gray-400 mb-4">
                Your list is empty.
              </p>
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