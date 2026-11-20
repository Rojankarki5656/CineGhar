import type { Metadata } from "next";
import { notFound } from "next/navigation";

import MovieDetailsPage from "@/components/movie-details";
import { getMovieDetails } from "@/lib/get-movie-details";

type Props = {
  params: Promise<{ id: string }>;
};

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://cine-ghar.vercel.app";

/* ---------------- SEO METADATA ---------------- */

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { id } = await params;

  const movie = await getMovieDetails(id);

  if (!movie) {
    return {
      title: "Movie Not Found",
      description: "The requested movie could not be found.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const movieTitle = movie.title;
  const movieYear = movie.year ? ` (${movie.year})` : "";

  const title = `${movieTitle}${movieYear} - Cast, Rating, Plot & Details`;

  const description = movie.plot
    ? movie.plot.length > 160
      ? `${movie.plot.substring(0, 157)}...`
      : movie.plot
    : `Discover ${movieTitle}, including its cast, ratings, genres, release date, plot and movie details on CineGhar.`;

  // Use one consistent URL format
  const canonicalUrl = `${SITE_URL}/movies/${id}`;

  return {
    title,

    description,

    alternates: {
      canonical: canonicalUrl,
    },

    keywords: [
      movieTitle,
      `${movieTitle} movie`,
      `${movieTitle} cast`,
      `${movieTitle} plot`,
      `${movieTitle} rating`,
      `${movieTitle} review`,
      `${movieTitle} release date`,
      ...(movie.genres ?? []),
      ...(movie.directors?.map((director) => director.name) ?? []),
      ...(movie.topCast?.slice(0, 5).map((actor) => actor.name) ?? []),
    ],

    authors: [{ name: "CineGhar" }],

    openGraph: {
      type: "website",
      url: canonicalUrl,
      siteName: "CineGhar",
      title,
      description,
      images: movie.image
        ? [
            {
              url: movie.image,
              alt: `${movieTitle} poster`,
            },
          ]
        : [],
    },

    twitter: {
      card: movie.image ? "summary_large_image" : "summary",
      title,
      description,
      images: movie.image ? [movie.image] : [],
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

/* ---------------- STRUCTURED DATA ---------------- */

function MovieStructuredData({
  movie,
  url,
}: {
  movie: any;
  url: string;
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Movie",

    name: movie.title,

    alternateName: movie.originalTitle || undefined,

    url,

    image: movie.image || undefined,

    description: movie.plot || undefined,

    datePublished: movie.releaseDate || undefined,

    duration: movie.runtime
      ? `PT${movie.runtime}M`
      : undefined,

    genre: movie.genres?.length
      ? movie.genres
      : undefined,

    countryOfOrigin: movie.countriesOfOrigin?.map(
      (country: string) => ({
        "@type": "Country",
        name: country,
      })
    ),

    director: movie.directors?.length
      ? movie.directors.map((director: any) => ({
          "@type": "Person",
          name: director.name,
        }))
      : undefined,

    actor: movie.topCast?.length
      ? movie.topCast.slice(0, 10).map((actor: any) => ({
          "@type": "Person",
          name: actor.name,
        }))
      : undefined,

    aggregateRating:
      movie.rating != null && movie.voteCount > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: movie.rating,
            bestRating: 10,
            worstRating: 1,
            ratingCount: movie.voteCount,
          }
        : undefined,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData).replace(
          /</g,
          "\\u003c"
        ),
      }}
    />
  );
}

/* ---------------- PAGE ---------------- */

export default async function Page({ params }: Props) {
  const { id } = await params;

  const movie = await getMovieDetails(id);

  if (!movie) {
    notFound();
  }

  const canonicalUrl = `${SITE_URL}/movies/${id}`;

  return (
    <>
      <MovieStructuredData
        movie={movie}
        url={canonicalUrl}
      />

      <MovieDetailsPage movie={movie} />
    </>
  );
}