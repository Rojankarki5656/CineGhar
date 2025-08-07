import { notFound } from "next/navigation";
import { Metadata } from "next";
import { movies } from "@/lib/movies";
import MovieDetailsPage from "@/components/movie-details";

// Remove use() from generateMetadata, it's not allowed in async server functions
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const movieId = params.id;
  const movie = movies.find((m) => m.id === movieId);
  if (!movie) return {};

  return {
    title: `${movie.title} - Watch Online Free | CineGhar`,
    description: movie.description || `Watch ${movie.title} full movie online for free in HD.`,
    keywords: [
      movie.title,
      "Watch online",
      "Nepali movies",
      "Indian movies",
      "Free streaming",
      "CineGhar",
    ],
    openGraph: {
      title: `${movie.title} | Watch Now on CineGhar`,
      description: movie.description,
      images: [
        {
          url: movie.imageUrl || "/placeholder.svg",
          width: 800,
          height: 600,
          alt: `${movie.title} Poster`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${movie.title} - Stream Now | CineGhar`,
      description: movie.description,
      images: [movie.imageUrl || "/placeholder.svg"],
    },
  };
}

// ✅ Server component renders dynamic movie
export default function Page({ params }: { params: { id: string } }) {
  const movie = movies.find((m) => m.id === params.id);
  if (!movie) return notFound();

  return <MovieDetailsPage movie={movie} />;
}