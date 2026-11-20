// lib/get-movie-details.ts
import config from "@/config/config";
import { Movie } from "@/lib/movies";

const API_BASE_URL = config.localUrl!;

type RawImage = { link?: string; width?: number; height?: number };

function mapImage(img?: RawImage | null) {
  return {
    image: img?.link ?? null,
    imageWidth: img?.width ?? null,
    imageHeight: img?.height ?? null,
  };
}
function extractImdbId(link: string) {
  if (!link) return null;
  const match = link.match(/tt\d+/);
  return match ? match[0] : null;
}


export async function getMovieDetails(id: string): Promise<Movie | null> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/title/details?title_id=${encodeURIComponent(id)}`,
      {
        next: { revalidate: 3600 }, // swap out `no-store` → ISR
      }
    );

    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`HTTP ${res.status}`);
    }

    const json = await res.json();
    const item = json?.data ?? json?.results ?? json;

    if (!item || typeof item !== "object") return null;

    return {
      id: item.id,
      imdbId: extractImdbId(item.link) ?? item.id,
      title: item.title,
      originalTitle: item.original_title,
      link: item.link,
      type: item.type,
      isSeries: item.is_series ?? false,
      isEpisode: item.is_episode ?? false,
      year: item.year,
      endYear: item.end_year,
      releaseDate: item.release_date,
      runtime: item.runtime_minutes,
      certificate: item.certificate,
      plot: item.plot,
      genres: item.genres ?? [],

      rating: item.rating?.value ?? null,
      voteCount: item.rating?.vote_count ?? 0,
      topRank: item.rating?.top_rank ?? null,

      metascore: item.metascore?.score ?? null,
      metascoreReviewCount: item.metascore?.review_count ?? 0,

      directors: (item.directors ?? []).map((d: any) => ({
        id: d.id, name: d.name, link: d.link,
      })),
      creators: (item.creators ?? []).map((c: any) => ({
        id: c.id, name: c.name, link: c.link,
      })),
      writers: (item.writers ?? []).map((w: any) => ({
        id: w.id, name: w.name, link: w.link,
      })),
      stars: (item.stars ?? []).map((s: any) => ({
        id: s.id, name: s.name, link: s.link,
      })),
      topCast: (item.top_cast ?? []).map((c: any) => ({
        id: c.id,
        name: c.name,
        link: c.link,
        characters: c.characters ?? [],
        image: c.image?.link ?? null,   // ← already flat, matches hook
      })),
      totalCast: item.total_cast ?? 0,

      trailer: item.trailer
        ? {
            id: item.trailer.id,
            title: item.trailer.title,
            link: item.trailer.link,
            duration: item.trailer.duration_seconds,
            thumbnail: item.trailer.thumbnail_link ?? null, // already a string
          }
        : null,

      ...mapImage(item.image),           // image, imageWidth, imageHeight

      boxOffice: item.box_office
        ? {
            budget: item.box_office.budget ?? null,
            openingWeekend: item.box_office.opening_weekend ?? null,
            grossWorldwide: item.box_office.gross_worldwide ?? null,
          }
        : null,

      seasons: item.seasons ?? null,

      similarTitles: (item.similar_titles ?? []).map((s: any) => ({
        id: s.id,
        imdbId: extractImdbId(s.link) ?? s.id,
        title: s.title,
        originalTitle: s.original_title,
        link: s.link,
        type: s.type,
        isSeries: s.is_series ?? false,
        year: s.year,
        endYear: s.end_year,
        runtime: s.runtime_minutes,
        plot: s.plot,
        genres: s.genres ?? [],
        rating: s.rating?.value ?? null,
        voteCount: s.rating?.vote_count ?? 0,
        ...mapImage(s.image),
      })),

      countriesOfOrigin: item.countries_of_origin ?? [],
      spokenLanguages: item.spoken_languages ?? [],
      country: item.country,
    };
  } catch (error) {
    console.error("Movie fetch error:", error);
    return null;
  }
}

export async function getAllMovies(): Promise<
  Array<{ id: string; imdbId?: string; updatedAt?: string }>
> {
  try {
    const res = await fetch(`${API_BASE_URL}/titles/popular`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    const items = json?.data ?? json?.results ?? json ?? [];
    return items.map((m: any) => ({
      id: m.id,
      imdbId: extractImdbId(m.link) ?? m.id,
      updatedAt: m.updated_at,
    }));
  } catch {
    return [];
  }
}