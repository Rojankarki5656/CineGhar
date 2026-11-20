"use client";

import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";

interface Movie {
  id: string;
  title: string;
  imageUrl: string;
  year: string;
  rating: string;
}

interface MovieGridProps {
  movies: Movie[];
}

export function MovieGrid({ movies }: MovieGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
      {movies.map((movie, index) => (
        <Link key={movie.id} href={`/movies/${movie.id}`} className="transition-transform duration-300 hover:scale-105 group">
          <article>
            <div className="relative aspect-[2/3] rounded-md overflow-hidden bg-zinc-900">
              <Image
                src={movie.imageUrl || "/placeholder.svg"}
                alt={`${movie.title} poster`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
                className="object-cover transition-opacity duration-300 group-hover:opacity-80"
                priority={index < 6}
                loading={index < 6 ? "eager" : "lazy"}
                onError={(e) => { e.currentTarget.src = "/placeholder.svg"; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                <h3 className="font-medium text-sm line-clamp-1 text-white">{movie.title}</h3>
                <div className="flex items-center justify-between text-xs text-zinc-300 mt-1">
                  <span>{movie.year}</span>
                  <span className="flex items-center"><Star className="w-3 h-3 mr-1 text-yellow-500 fill-yellow-500" /> {movie.rating}</span>
                </div>
              </div>
            </div>
            <div className="mt-2 px-1">
              <p className="text-sm font-medium line-clamp-1 group-hover:text-red-500 transition-colors">{movie.title}</p>
              <p className="text-xs text-zinc-400">{movie.year}</p>
            </div>
          </article>
        </Link>
      ))}
    </div>
  );
}