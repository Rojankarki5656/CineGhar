// hooks/movieseDetailService.ts
"use client";

import { useState, useEffect } from "react";
import config from "@/config/config";

export const API_BASE_URL = config.localUrl;

/* ---------- Types ---------- */

export interface PersonRef {
  id: string;
  name: string;
  link?: string;
}

export interface CastMember extends PersonRef {
  characters?: string[];
  image?: string | null;
}

export interface Trailer {
  id: string;
  title?: string;
  link: string;
  duration?: number;
  thumbnail?: string;
}

export interface BoxOffice {
  budget: number | null;
  openingWeekend: number | null;
  grossWorldwide: number | null;
}

export interface SimilarTitle {
  id: string;
  imdbId: string;
  title: string;
  originalTitle?: string;
  link?: string;
  type?: string;
  isSeries: boolean;
  year?: number | string;
  endYear?: number | string;
  runtime?: number;
  plot?: string;
  genres: string[];
  rating: number | null;
  voteCount: number;
  image: string | null;
  imageWidth: number | null;
  imageHeight: number | null;
}

export interface MovieDetail {
  id: string;
  imdbId: string;
  title: string;
  originalTitle?: string;
  link?: string;
  type?: string;
  isSeries: boolean;
  isEpisode: boolean;
  year?: number | string;
  endYear?: number | string;
  releaseDate?: string;
  runtime?: number;
  certificate?: string;
  plot?: string;
  genres: string[];

  rating: number | null;
  voteCount: number;
  topRank: number | null;

  metascore: number | null;
  metascoreReviewCount: number;

  directors: PersonRef[];
  creators: PersonRef[];
  writers: PersonRef[];
  stars: PersonRef[];
  topCast: CastMember[];
  totalCast: number;

  trailer: Trailer | null;

  image: string | null;
  imageWidth: number | null;
  imageHeight: number | null;

  boxOffice: BoxOffice | null;

  seasons: unknown; // parsed by extractSeasons in the page

  similarTitles: SimilarTitle[];

  countriesOfOrigin: string[];
  spokenLanguages: string[];
  country?: string;
}

/* ---------- Helpers ---------- */

/** Extract "tt35538033" from "https://www.imdb.com/title/tt35538033/" */
function extractImdbId(link?: string): string | null {
  if (!link) return null;
  const match = link.match(/tt\d+/);
  return match ? match[0] : null;
}

/* ---------- Hook ---------- */

interface UseDetailMoviesResult {
  data: MovieDetail | null;
  loading: boolean;
  error: string | null;
}

export function useDetailMovies(id?: string): UseDetailMoviesResult {
  const [data, setData] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setData(null);
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchDetailMovies = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `${API_BASE_URL}/title/details?title_id=${id}`,
          {
            signal: controller.signal,
            cache: "no-store",
          }
        );

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const json = await res.json();

        // API returns a single object, not an array
        const item = json?.data ?? json?.results ?? json;

        if (!item || typeof item !== "object") {
          setData(null);
          return;
        }

        const transformed: MovieDetail = {
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
            id: d.id,
            name: d.name,
            link: d.link,
          })),
          creators: (item.creators ?? []).map((c: any) => ({
            id: c.id,
            name: c.name,
            link: c.link,
          })),
          writers: (item.writers ?? []).map((w: any) => ({
            id: w.id,
            name: w.name,
            link: w.link,
          })),
          stars: (item.stars ?? []).map((s: any) => ({
            id: s.id,
            name: s.name,
            link: s.link,
          })),
          topCast: (item.top_cast ?? []).map((c: any) => ({
            id: c.id,
            name: c.name,
            link: c.link,
            characters: c.characters ?? [],
            image: c.image?.link ?? null,
          })),
          totalCast: item.total_cast ?? 0,

          trailer: item.trailer
            ? {
                id: item.trailer.id,
                title: item.trailer.title,
                link: item.trailer.link,
                duration: item.trailer.duration_seconds,
                thumbnail: item.trailer.thumbnail_link,
              }
            : null,

          image: item.image?.link ?? null,
          imageWidth: item.image?.width ?? null,
          imageHeight: item.image?.height ?? null,

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
            image: s.image?.link ?? null,
            imageWidth: s.image?.width ?? null,
            imageHeight: s.image?.height ?? null,
          })),

          countriesOfOrigin: item.countries_of_origin ?? [],
          spokenLanguages: item.spoken_languages ?? [],
          country: item.country,
        };

        setData(transformed);
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        const message =
          err instanceof Error ? err.message : "Failed to fetch movie details";
        setError(message);
        setData(null);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchDetailMovies();

    return () => {
      controller.abort();
    };
  }, [id]);

  return {
    data,
    loading,
    error,
  };
}