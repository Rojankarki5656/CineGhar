// app/page.tsx
import { Navbar } from "@/components/navbar";
import { HeroBanner } from "@/components/hero-banner";
import { MovieRow } from "@/components/movie-row";
import { Footer } from "@/components/footer";
import { movies } from "@/lib/movies";

export default function HomePage() {
  // Find Chiso Maanche for HeroBanner
  const chisoMaanche = movies.find((m) => m.id === "2");

  return (
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
  );
}