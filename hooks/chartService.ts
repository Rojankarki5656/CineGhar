"use client";

import { useState, useEffect } from "react";
import config from "@/config/config"

export const API_BASE_URL = config.localUrl;

/* ---------- Helpers ---------- */

function extractImdbId(link?: string | null): string | null {
  if (!link) return null;
  const match = link.match(/tt\d+/);
  return match ? match[0] : null;
}

/* ---------- Types ---------- */

export interface ChartPagination {
  total: number | null;
  next_cursor: string | null;
  has_more: boolean;
}

export interface ChartMeta {
  chart: string;
  country: string;
  count: number;
  pagination?: ChartPagination;
  weekend?: { start_date: string; end_date: string };
}

export interface ChartMovie {
  id: string;
  imdbId: string | null;
  rank: number;
  rankChange: number | null;
  title: string;
  originalTitle: string | null;
  link: string;
  type: string;
  isSeries: boolean;
  year: number | null;
  endYear: number | null;
  runtime: number | null;          // minutes
  plot: string | null;
  genres: string[];
  rating: number | null;           // 0–10
  voteCount: number;
  image: string | null;
  imageWidth: number | null;
  imageHeight: number | null;
  /** Only present on /charts/box-office */
  weekendGross?: { amount: number; currency: string } | null;
  /** Only present on /charts/box-office */
  grossWorldwide?: { amount: number; currency: string } | null;
}

export interface ChartCelebrity {
  id: string;
  name: string;
  link: string;
  rank: number;
  rankChange: { direction: string; amount: number } | null;
  professions: string[];
  knownFor: {
    id: string;
    title: string;
    link: string;
    year: number | null;
  } | null;
  image: string | null;
  imageWidth: number | null;
  imageHeight: number | null;
}

/* ---------- Mappers ---------- */

function mapMovie(item: any): ChartMovie {
  return {
    id: item.id,
    imdbId: extractImdbId(item.link),
    rank: item.rank,
    rankChange: item.rank_change ?? null,
    title: item.title,
    originalTitle: item.original_title ?? null,
    link: item.link,
    type: item.type,
    isSeries: !!item.is_series,
    year: item.year ?? null,
    endYear: item.end_year ?? null,
    runtime: item.runtime_minutes ?? null,
    plot: item.plot ?? null,
    genres: item.genres ?? [],
    rating: item.rating?.value ?? null,
    voteCount: item.rating?.vote_count ?? 0,
    image: item.image?.link ?? null,
    imageWidth: item.image?.width ?? null,
    imageHeight: item.image?.height ?? null,
    // box-office specific (undefined elsewhere)
    weekendGross: item.weekend_gross ?? null,
    grossWorldwide: item.gross_worldwide ?? null,
  };
}

function mapCelebrity(item: any): ChartCelebrity {
  return {
    id: item.id,
    name: item.name,
    link: item.link,
    rank: item.rank,
    rankChange: item.rank_change ?? null,
    professions: item.professions ?? [],
    knownFor: item.known_for
      ? {
          id: item.known_for.id,
          title: item.known_for.title,
          link: item.known_for.link,
          year: item.known_for.year ?? null,
        }
      : null,
    image: item.image?.link ?? null,
    imageWidth: item.image?.width ?? null,
    imageHeight: item.image?.height ?? null,
  };
}

/* ---------- Generic chart hook factory ---------- */

function createChartHook<T>(endpoint: string, mapper: (item: any) => T) {
  return function useChart(country?: string) {
    const [data, setData] = useState<T[]>([]);
    const [meta, setMeta] = useState<ChartMeta | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      const controller = new AbortController();

      const fetchChart = async () => {
        try {
          setLoading(true);
          setError(null);

          const url = new URL(`${API_BASE_URL}${endpoint}`);
          if (country) url.searchParams.set("country", country);

          const res = await fetch(url.toString(), {
            signal: controller.signal,
            cache: "no-store",
          });

          if (!res.ok) throw new Error(`HTTP ${res.status}`);

          const json = await res.json();
          const results = Array.isArray(json.results) ? json.results : [];

          setData(results.map(mapper));
          setMeta({
            chart: json.chart,
            country: json.country,
            count: json.count,
            pagination: json.pagination,
            weekend: json.weekend,
          });
        } catch (err: any) {
          if (err.name === "AbortError") return;
          setError(err.message || "Failed to fetch chart");
          setData([]);
          setMeta(null);
        } finally {
          if (!controller.signal.aborted) setLoading(false);
        }
      };

      fetchChart();

      return () => controller.abort();
    }, [country]);

    return { data, meta, loading, error };
  };
}

/* ---------- Exported hooks ---------- */

export const usePopularMovies = createChartHook<ChartMovie>(
  "/charts/popular-movies",
  mapMovie,
);

export const usePopularTv = createChartHook<ChartMovie>(
  "/charts/popular-tv",
  mapMovie,
);

export const useTopMovies = createChartHook<ChartMovie>(
  "/charts/top-movies",
  mapMovie,
);

export const useTopTv = createChartHook<ChartMovie>(
  "/charts/top-tv",
  mapMovie,
);

export const useBoxOffice = createChartHook<ChartMovie>(
  "/charts/box-office",
  mapMovie,
);

export const usePopularCelebrities = createChartHook<ChartCelebrity>(
  "/charts/popular-celebrities",
  mapCelebrity,
);