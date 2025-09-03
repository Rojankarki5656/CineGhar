import { notFound } from "next/navigation";
import { Metadata } from "next";
import { movies } from "@/lib/movies";
import MovieDetailsPage from "@/components/movie-details";

// Remove use() from generateMetadata, it's not allowed in async server functions
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const movieId = params.id;
  const movie = movies.find((m) => m.id === movieId);
  if (!movie) return {};

  const baseUrl = "https://cineghar.live";
  const canonicalUrl = `${baseUrl}/movies/${movieId}`;
  const imageUrl = movie.imageUrl || `${baseUrl}/placeholder.svg`;

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
      "HD streaming",
      "Nepali cinema",
      "Nepali movie 2025",
      "Nepali movie download",
      "Nepali movie watch free",
      "Nepali movie streaming",
      "Nepali movie website",
      "Nepali movie app",
      "Nepali movie list",
      "Nepali movie new release"
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${movie.title} | Watch Now on CineGhar`,
      description: movie.description,
      url: canonicalUrl,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${movie.title} Poster`,
        },
      ],
      type: "video.movie",
      siteName: "CineGhar",
    },
    twitter: {
      card: "summary_large_image",
      title: `${movie.title} - Stream Now | CineGhar`,
      description: movie.description,
      images: [imageUrl],
      site: "@cineghar",
      creator: "@cineghar",
    },
    other: {
      "robots": "index, follow",
      "language": "en",
    },
  };
}

// ✅ Server component renders dynamic movie
export default function Page({ params }: { params: { id: string } }) {
  const movie = movies.find((m) => m.id === params.id);
  if (!movie) return notFound();

  return <MovieDetailsPage movie={movie} />;
}