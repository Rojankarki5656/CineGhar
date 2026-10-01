import Link from "next/link"
import { Star } from "lucide-react"

interface Movie {
  id: string
  title: string
  imageUrl: string
  year: string
  rating: string
}

interface MovieGridProps {
  movies: Movie[]
}

export function MovieGrid({ movies }: MovieGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
      {movies.map((movie) => (
        <Link key={movie.id} href={`/movies/${movie.id}`} className="transition-transform duration-300 hover:scale-105">
          <div className="relative aspect-[2/3] rounded-md overflow-hidden">
            <img src={movie.imageUrl || "/placeholder.svg"} alt={movie.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
              <h3 className="font-medium text-sm line-clamp-1">{movie.title}</h3>
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
  )
}
