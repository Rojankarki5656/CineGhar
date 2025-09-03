// app/page.tsx
import Head from "next/head";
import { Navbar } from "@/components/navbar";
import { HeroBanner } from "@/components/hero-banner";
import { MovieRow } from "@/components/movie-row";
import { Footer } from "@/components/footer";
import { movies } from "@/lib/movies";

export default function HomePage() {
  // Find Chiso Maanche for HeroBanner
  const chisoMaanche = movies.find((m) => m.id === "2");

  return (
    <>
      <Head>
  <title>CineGhar: Watch Nepali & Indian Movies Online Free | Latest HD Streaming</title>
  <meta name="description" content="Watch trending Nepali and Indian movies, classics, and new releases online for free in HD. CineGhar is Nepal's #1 movie streaming site. No signup required!" />
  <meta name="keywords" content="Nepali movies, Indian movies, watch online, free streaming, Nepali classics, Hindi movies, action movies, family movies, CineGhar, Nepali cinema, Nepali movie 2025, Nepali movie download, Nepali movie watch free, Nepali movie streaming, Nepali movie website, Nepali movie app, Nepali movie list, Nepali movie new release" />
  <meta name="author" content="CineGhar Nepal" />
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
  <link rel="canonical" href="https://cineghar.live/home" />

  {/* Open Graph */}
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="CineGhar" />
  <meta property="og:url" content="https://cineghar.live/home" />
  <meta property="og:title" content="CineGhar: Watch Nepali & Indian Movies Online Free | Latest HD Streaming" />
  <meta property="og:description" content="Stream trending, new releases, and classic Nepali and Indian movies online for free. CineGhar is Nepal’s #1 movie streaming site." />
  <meta property="og:image" content="https://cineghar.live/og-image.jpg" />
  <meta property="og:image:alt" content="CineGhar - Nepali Movies Streaming" />
  <meta property="og:locale" content="en_NP" />

  {/* Twitter */}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@cineghar" />
  <meta name="twitter:creator" content="@cineghar" />
  <meta name="twitter:url" content="https://cineghar.live/home" />
  <meta name="twitter:title" content="CineGhar: Watch Nepali & Indian Movies Online Free" />
  <meta name="twitter:description" content="Nepali and Indian movies anytime, anywhere. CineGhar.live brings cinema online — just like Netflix for Nepal." />
  <meta name="twitter:image" content="https://cineghar.live/og-image.jpg" />

  {/* Favicon */}
  <link rel="icon" href="/favicon.ico" />

  {/* Mobile & Web App */}
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="theme-color" content="#000000" />

  {/* Structured Data for SEO */}
  <script type="application/ld+json">
    {`
      {
        "@context": "https://schema.org",
        "@type": "VideoStreamingService",
        "name": "CineGhar",
        "url": "https://cineghar.live/home",
        "logo": "https://cineghar.live/og-image.jpg",
        "description": "Watch trending Nepali and Indian movies, classics, and new releases online for free in HD. CineGhar is Nepal's #1 movie streaming site.",
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
        {chisoMaanche && (
          <HeroBanner
            title={chisoMaanche.title}
            description={`${chisoMaanche.description} || CHISO MANCHHE Nepali Full Movie 2025`}
            imageUrl={chisoMaanche.imageUrl}
            year={chisoMaanche.year}
            duration={chisoMaanche.duration}
            rating={chisoMaanche.rating}
          />
        )}

        <div className="px-4 md:px-6 py-8 space-y-8">
          <MovieRow
            title="Trending Now"
            movies={movies.filter((m) =>
              ["30", "3", "4", "5", "6", "7"].includes(m.id)
            )}
          />

          <MovieRow
            title="New Releases"
            movies={movies.filter((m) =>
              ["8", "2", "9", "10", "11", "12"].includes(m.id)
            )}
          />

          <MovieRow
            title="Nepali Classics"
            movies={movies.filter((m) =>
              ["18", "19", "20", "21", "22", "23"].includes(m.id)
            )}
          />

          <MovieRow
            title="Hindi Movies"
            movies={movies.filter((m) => ["29", "31","32","33","34","35","36"].includes(m.id)
            )}
          />

          <MovieRow
            title="Action Movies"
            movies={movies.filter((m) =>
              ["30", "13", "14", "15", "16", "17"].includes(m.id)
            )}
          />

          <MovieRow
            title="Family Friendly"
            movies={movies.filter((m) =>
              ["24", "25", "26", "27", "28", "4"].includes(m.id)
            )}
          />
        </div>
      </main>

      <Footer />
    </div>
    </>
  );
}