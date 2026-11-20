import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Metadata } from "next";
import { normalizeTitle } from "@/lib/normalize-title";
import { MovieGrid } from "@/components/movie-grid";
import { BackButton } from "@/components/back-button";

const API_BASE = process.env.IMDB_API_URL ?? process.env.NEXT_PUBLIC_IMDB_API ?? "http://localhost:8000";
const PAGE_SIZE = 30;
const CHART_FETCH_LIMIT = 250;

const CHART_TITLES: Record<string, string> = {
  "top-movies": "Top 250 Movies",
  "top-tv": "Top 250 TV Shows",
  "popular-movies": "Popular Movies",
  "popular-tv": "Popular TV Shows",
  "box-office": "Weekend Box Office",
};

interface PageProps {
  params: Promise<{ list: string }>;
  searchParams: Promise<{ country?: string; q?: string; page?: string }>;
}

interface ChartMovie {
  imdbId?: string;
  id?: string;
  title: string;
  image?: string;
  year?: number | string;
  rating?: number | string;
}

// SEO: Dynamic Metadata
export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { list } = await params;
  const { page } = await searchParams;
  const pageNum = page ? parseInt(page) : 1;
  const title = CHART_TITLES[list] || "Browse";
  
  const pageText = pageNum > 1 ? ` - Page ${pageNum}` : "";
  
  return {
    title: `${title}${pageText} | CineGhar`,
    description: `Browse the ${title} on CineGhar. Stream movies and TV shows online for free.`,
    alternates: {
      canonical: `/browse/${list}${pageNum > 1 ? `?page=${pageNum}` : ""}`,
    },
    robots: list === "search" ? { index: false, follow: true } : { index: true, follow: true },
  };
}

function parsePage(raw: string | undefined): number {
  const n = Number.parseInt(raw ?? "1", 10);
  return Number.isFinite(n) && n >= 1 ? n : 1;
}

function pageHref(list: string, params: { q?: string; country?: string }, page: number): string {
  const sp = new URLSearchParams();
  if (params.q) sp.set("q", params.q);
  if (params.country) sp.set("country", params.country);
  if (page > 1) sp.set("page", String(page));
  const qs = sp.toString();
  return `/browse/${list}${qs ? `?${qs}` : ""}`;
}

export default async function BrowsePage({ params, searchParams }: PageProps) {
  const { list } = await params;
  const { country = "US", q, page: rawPage } = await searchParams;
  const requestedPage = parsePage(rawPage);

  let title: string;
  let all: ChartMovie[];

  if (list === "search") {
    if (!q) notFound();
    title = `Search: "${q}"`;
    all = await fetchSearch(q, country);
  } else if (CHART_TITLES[list]) {
    title = CHART_TITLES[list];
    all = await fetchChart(list, country);
  } else {
    notFound();
  }

  const totalItems = all.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const page = Math.min(requestedPage, totalPages);
  const start = (page - 1) * PAGE_SIZE;
  const pageItems = all.slice(start, start + PAGE_SIZE).map(normalizeTitle);

  const prevHref = page > 1 ? pageHref(list, { q, country }, page - 1) : null;
  const nextHref = page < totalPages ? pageHref(list, { q, country }, page + 1) : null;

  const gridMovies = pageItems.map((m: any) => ({
    id: m.imdbId ?? m.id,
    title: m.title,
    imageUrl: m.image ?? "/placeholder.svg",
    year: m.year ? String(m.year) : "",
    rating: m.rating != null ? String(m.rating) : "—",
  }));

  // SEO: JSON-LD Structured Data (ItemList)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: gridMovies.map((movie, index) => ({
      "@type": "ListItem",
      position: start + index + 1,
      url: `https://cine-ghar.vercel.app/movies/${movie.id}`,
      name: movie.title,
    })),
  };

  return (
    <main className="min-h-screen bg-[#141414] text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-6">
        <BackButton />

        <div className="mb-6 flex items-baseline justify-between gap-4 flex-wrap">
          <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>
          <span className="text-sm text-zinc-500 whitespace-nowrap">
            {totalItems} {totalItems === 1 ? "title" : "titles"}
            {totalPages > 1 && ` · page ${page} of ${totalPages}`}
          </span>
        </div>

        <MovieGrid movies={gridMovies} />

        {(prevHref || nextHref) && (
          <nav className="mt-8 flex items-center justify-between" aria-label="Pagination">
            {prevHref ? (
              <Link href={prevHref} rel="prev" className="inline-flex items-center gap-1 rounded border border-white/20 px-3 py-2 text-sm text-zinc-300 hover:bg-white/10 hover:text-white transition-colors">
                <ChevronLeft className="h-4 w-4" /> Previous
              </Link>
            ) : <span />}
            
            {nextHref ? (
              <Link href={nextHref} rel="next" className="inline-flex items-center gap-1 rounded border border-white/20 px-3 py-2 text-sm text-zinc-300 hover:bg-white/10 hover:text-white transition-colors">
                Next <ChevronRight className="h-4 w-4" />
              </Link>
            ) : <span />}
          </nav>
        )}
      </div>
    </main>
  );
}

async function fetchChart(chart: string, country: string): Promise<ChartMovie[]> {
  const url = `${API_BASE}/charts/${chart}?country=${encodeURIComponent(country)}&limit=${CHART_FETCH_LIMIT}`;
  const res = await fetch(url, { next: { revalidate: 300 } });
  if (!res.ok) throw new Error(`Failed to load ${chart} (HTTP ${res.status})`);
  const json = await res.json();
  return json.results ?? json.titles ?? [];
}

async function fetchSearch(q: string, country: string): Promise<ChartMovie[]> {
  const url = `${API_BASE}/search?query=${encodeURIComponent(q)}&country=${encodeURIComponent(country)}`;
  const res = await fetch(url, { next: { revalidate: 300 } });
  if (!res.ok) throw new Error(`Search failed (HTTP ${res.status})`);
  const json = await res.json();
  return json.results ?? json.titles ?? [];
}