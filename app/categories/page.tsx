"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { MovieGrid } from "@/components/movie-grid";
import { movies } from "@/lib/movies";

export default function CategoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All",
    "Action",
    "Comedy",
    "Drama",
    "Romance",
    "Thriller",
    "Adventure",
    "Family",
    "Nepali Drama",
  ];

  const filteredMovies = movies
    .filter((movie) => {
      if (selectedCategory === "All") return true;
      if (selectedCategory === "Nepali Drama") {
        return movie.genres?.includes("Drama") && movie.language === "Nepali";
      }
      return movie.genres?.includes(selectedCategory);
    })
    .map(({ id, title, imageUrl, year, rating }) => ({
      id,
      title,
      imageUrl,
      year,
      rating,
    }));

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />

      <main className="px-4 md:px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Categories</h1>

          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === selectedCategory ? "default" : "outline"}
                className={category === selectedCategory ? "bg-red-600 hover:bg-red-700" : ""}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>

          {filteredMovies.length > 0 ? (
            <MovieGrid movies={filteredMovies} />
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-gray-400">No movies found for this category.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}