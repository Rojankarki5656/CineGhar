// app/page.tsx
"use client";

import Head from "next/head";
import { Navbar } from "@/components/navbar";
import { HeroBanner } from "@/components/hero-banner";
import { MovieRow } from "@/components/movie-row";
import { Footer } from "@/components/footer";
import {
  usePopularMovies,
  usePopularTv,
  useTopMovies,
  useTopTv,
  useBoxOffice,
} from "@/hooks/chartService";
import type { ChartMovie } from "@/hooks/chartService";
import type { MovieCard } from "@/lib/movies";

function toMovieCard(m: ChartMovie): MovieCard {
  return {
    id: m.imdbId ?? m.id,
    title: m.title,
    image: m.image ?? "/placeholder.svg",
    year: m.year ? String(m.year) : "",
    rating: m.rating != null ? String(m.rating) : "—",
    genres: m.genres,
    description: m.plot ?? undefined,
  };
}

export default function HomePage() {
  const { data: popularMovies, loading: pmLoading, error: pmError } =
    usePopularMovies("US");
  const { data: topMovies, loading: tmLoading } = useTopMovies("US");
  const { data: popularTv, loading: ptLoading } = usePopularTv("US");
  const { data: topTv, loading: ttLoading } = useTopTv("US");
  const { data: boxOffice, loading: boLoading, meta: boMeta } =
    useBoxOffice("US");

  const heroMovies = [
    ...(popularMovies ?? []).slice(0, 3),
    ...(topMovies ?? []).slice(0, 2),
  ].slice(0, 5);

  const heroLoading = pmLoading && popularMovies.length === 0;

  return (
    <>
      <Head>
        <title>
          CineGhar: Watch Nepali & Indian Movies Online Free | Latest HD
          Streaming
        </title>
        <meta
          name="description"
          content="Watch trending Nepali and Indian movies, classics, and new releases online for free in HD. CineGhar is Nepal's #1 movie streaming site. No signup required!"
        />
        <meta
          name="keywords"
          content="Nepali movies, Indian movies, watch online, free streaming, Nepali classics, Hindi movies, action movies, family movies, CineGhar, Nepali cinema, Nepali movie 2025, Nepali movie download, Nepali movie watch free, Nepali movie streaming, Nepali movie website, Nepali movie app, Nepali movie list, Nepali movie new release"
        />
        <meta name="author" content="CineGhar Nepal" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://cineghar.live/home" />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="CineGhar" />
        <meta property="og:url" content="https://cineghar.live/home" />
        <meta
          property="og:title"
          content="CineGhar: Watch Nepali & Indian Movies Online Free | Latest HD Streaming"
        />
        <meta
          property="og:description"
          content="Stream trending, new releases, and classic Nepali and Indian movies online for free."
        />
        <meta property="og:image" content="https://cineghar.live/og-image.jpg" />
        <meta property="og:locale" content="en_NP" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@cineghar" />
        <meta name="twitter:creator" content="@cineghar" />
        <meta
          name="twitter:title"
          content="CineGhar: Watch Nepali & Indian Movies Online Free"
        />
        <meta
          name="twitter:description"
          content="Nepali and Indian movies anytime, anywhere."
        />
        <meta
          name="twitter:image"
          content="https://cineghar.live/og-image.jpg"
        />

        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#000000" />

        <script type="application/ld+json">
          {`
      {
        "@context": "https://schema.org",
        "@type": "VideoStreamingService",
        "name": "CineGhar",
        "url": "https://cineghar.live/home",
        "logo": "https://cineghar.live/og-image.jpg",
        "description": "Watch trending Nepali and Indian movies online for free in HD.",
        "sameAs": [
          "https://www.facebook.com/cineghar",
          "https://twitter.com/cineghar",
          "https://www.instagram.com/cineghar"
        ]
      }
    `}
        </script>
      </Head>

      <div className="min-h-screen bg-zinc-950 text-white">
        <Navbar />

        <main>
          <HeroBanner
            loading={heroLoading}
            slides={heroMovies.map((m) => ({
              id: m.imdbId ?? m.id,
              title: m.title,
              description: m.plot ?? `Watch ${m.title} online on CineGhar.`,
              imageUrl: m.image ?? "/placeholder.svg",
              year: m.year ? String(m.year) : undefined,
              duration: m.runtime ? `${m.runtime} min` : undefined,
              rating: m.rating != null ? String(m.rating) : undefined,
              badge: m.isSeries ? "TV Series" : undefined,
            }))}
          />

          <div className="px-4 md:px-6 py-8 space-y-10">
            {/* Trending */}
            <MovieRow
              title="Trending Now"
              movies={popularMovies.map(toMovieCard)}
              loading={pmLoading}
            />
            {pmError && (
              <p className="text-sm text-red-400 -mt-8">
                Failed to load trending: {pmError}
              </p>
            )}

            <MovieRow
              title="Top Rated Movies"
              movies={topMovies.map(toMovieCard)}
              loading={tmLoading}
            />

            <MovieRow
              title={
                boMeta?.weekend
                  ? `In Theaters — Weekend of ${boMeta.weekend.start_date}`
                  : "Box Office"
              }
              movies={boxOffice.map(toMovieCard)}
              loading={boLoading}
            />

            <MovieRow
              title="Popular TV Shows"
              movies={popularTv.map(toMovieCard)}
              loading={ptLoading}
            />

            <MovieRow
              title="Top Rated TV"
              movies={topTv.map(toMovieCard)}
              loading={ttLoading}
            />
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}