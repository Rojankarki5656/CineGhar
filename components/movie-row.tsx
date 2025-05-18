"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

interface Movie {
  id: string;
  title: string;
  imageUrl: string;
  year: string;
  rating: string;
  genres?: string[];
  description?: string;
  director?: string;
  cast?: string[];
  releaseDate?: string;
  language?: string;
  videoUrl?: string;
}

interface MovieRowProps {
  title: string;
  movies: Movie[];
}

export function MovieRow({ title, movies }: MovieRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      // Scroll by approximately 3 card widths (200px * 3 = 600px)
      const scrollTo = direction === "left" ? scrollLeft - 600 : scrollLeft + 600;

      rowRef.current.scrollTo({
        left: scrollTo,
        behavior: "smooth",
      });
    }
  };

  if (!movies || movies.length === 0) {
    return (
      <div className="space-y-2">
        <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
        <p className="text-gray-400">No movies available</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h2 className="text-xl md:text-2xl font-bold">{title}</h2>

      <div className="relative group">
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => scroll("left")}
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-8 w-8" />
        </Button>

        <div
          ref={rowRef}
          className="flex space-x-4 overflow-x-scroll py-4 px-1 scrollbar-hide"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {movies.map((movie) => (
            <Link
              key={`${movie.id}-${movie.title}`}
              href={`/movies/${movie.id}`}
              className="flex-none w-[180px] md:w-[200px] transition-transform duration-300 hover:scale-105"
              aria-label={`View details for ${movie.title}`}
            >
              <div className="relative aspect-[2/3] rounded-md overflow-hidden">
                <Image
                  src={movie.imageUrl || "/placeholder.svg"}
                  alt={`${movie.title} poster`}
                  width={200}
                  height={300}
                  className="w-full h-full object-cover"
                  placeholder="blur"
                  blurDataURL="/placeholder.svg"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                  <h3 className="font-medium text-sm line-clamp-2">{movie.title}</h3>
                  <div className="flex items-center justify-between text-xs text-gray-300 mt-1">
                    <span>{movie.year}</span>
                    <span className="flex items-center">
                      <Star className="w-3 h-3 mr-1 text-yellow-500 fill-yellow-500" />
                      {movie.rating}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => scroll("right")}
          aria-label="Scroll right"
        >
          <ChevronRight className="h-8 w-8" />
        </Button>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}