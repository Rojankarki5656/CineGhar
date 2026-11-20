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
import { browseChart } from "@/lib/browse-urls";
import { ContinueWatchingRow } from "@/components/continue-watching-row";

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
  const {
    data: popularMovies,
    loading: pmLoading,
    error: pmError,
  } = usePopularMovies("US", 10);
  const { data: topMovies, loading: tmLoading } = useTopMovies("US", 10);
  const { data: popularTv, loading: ptLoading } = usePopularTv("US", 10);
  const { data: topTv, loading: ttLoading } = useTopTv("US", 10);
  const {
    data: boxOffice,
    loading: boLoading,
    meta: boMeta,
  } = useBoxOffice("US");

  // Defensive: hooks can return undefined before the first fetch resolves.
  const safePopularMovies = popularMovies ?? [];
  const safeTopMovies = topMovies ?? [];
  const safePopularTv = popularTv ?? [];
  const safeTopTv = topTv ?? [];
  const safeBoxOffice = boxOffice ?? [];

  const heroMovies = [
    ...safePopularMovies.slice(0, 3),
    ...safeTopMovies.slice(0, 2),
  ].slice(0, 5);

  const heroLoading = pmLoading && safePopularMovies.length === 0;

  return (
    <>
      <Head>
        <title>
          CineGhar: Watch & Indian Movies Online Free | Latest HD Streaming
        </title>
        <meta
          name="description"
          content="Watch trending  and Indian movies, classics, and new releases online for free in HD. CineGhar is Nepal's #1 movie streaming site. No signup required!"
        />
        <meta
          name="keywords"
          content=" movies, Indian movies, watch online, free streaming,  classics, Hindi movies, action movies, family movies, CineGhar,  cinema,  movie 2025,  movie download,  movie watch free,  movie streaming,  movie website,  movie app,  movie list,  movie new release"
        />
        <meta name="author" content="CineGhar Nepal" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://cine-ghar.vercel.app/home" />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="CineGhar" />
        <meta property="og:url" content="https://cine-ghar.vercel.app/home" />
        <meta
          property="og:title"
          content="CineGhar: Watch  & Indian Movies Online Free | Latest HD Streaming"
        />
        <meta
          property="og:description"
          content="Stream trending, new releases, and classic  and Indian movies online for free."
        />
        <meta
          property="og:image"
          content="https://cine-ghar.vercel.app/og-image.jpg"
        />
        <meta property="og:locale" content="en_NP" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@cineghar" />
        <meta name="twitter:creator" content="@cineghar" />
        <meta
          name="twitter:title"
          content="CineGhar: Watch  & Indian Movies Online Free"
        />
        <meta
          name="twitter:description"
          content=" and Indian movies anytime, anywhere."
        />
        <meta
          name="twitter:image"
          content="https://cine-ghar.vercel.app/og-image.jpg"
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
        "url": "https://cine-ghar.vercel.app/home",
        "logo": "https://cine-ghar.vercel.app/og-image.jpg",
        "description": "Watch trending  and Indian movies online for free in HD.",
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


            <ContinueWatchingRow />
            {/* Trending = popular-movies (chart cap: 100) */}
            <MovieRow
              title="Trending Now"
              movies={safePopularMovies.map(toMovieCard)}
              loading={pmLoading}
              href={browseChart("popular-movies")}
              viewMoreLabel="See all 100"
            />
            {pmError && (
              <p className="text-sm text-red-400 -mt-8">
                Failed to load trending: {pmError}
              </p>
            )}

            {/* Top Rated = top-movies (chart cap: 250) */}
            <MovieRow
              title="Top Rated Movies"
              movies={safeTopMovies.map(toMovieCard)}
              loading={tmLoading}
              href={browseChart("top-movies")}
              viewMoreLabel="See all 250"
            />

            <MovieRow
              title={
                boMeta?.weekend
                  ? `In Theaters — Weekend of ${boMeta.weekend.start_date}`
                  : "Box Office"
              }
              movies={safeBoxOffice.map(toMovieCard)}
              loading={boLoading}
              href={browseChart("box-office")}
            />

            {/* Popular TV = popular-tv (chart cap: 100) */}
            <MovieRow
              title="Popular TV Shows"
              movies={safePopularTv.map(toMovieCard)}
              loading={ptLoading}
              href={browseChart("popular-tv")}
              viewMoreLabel="See all 100"
            />

            {/* Top Rated TV = top-tv (chart cap: 250) */}
            <MovieRow
              title="Top Rated TV"
              movies={safeTopTv.map(toMovieCard)}
              loading={ttLoading}
              href={browseChart("top-tv")}
              viewMoreLabel="See all 250"
            />
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}