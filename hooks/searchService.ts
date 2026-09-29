"use client";

import { useEffect, useRef, useState } from "react";
import { API_BASE_URL } from "./chartService";

/* ---------- Types ---------- */

export interface SearchParams {
  query?: string;
  type?: string;
  genre?: string;
  startYear?: number;
  endYear?: number;
  limit?: number;
}

export interface SearchResult {
  id: string;
  imdbId: string | null;
  title: string;
  originalTitle: string | null;
  year: number | null;
  type: string;
  isSeries: boolean;
  runtime: number | null;
  plot: string | null;
  genres: string[];
  rating: number | null;
  voteCount: number;
  image: string | null;
  imageWidth: number | null;
  imageHeight: number | null;
  link: string;
}

function extractImdbId(link?: string | null): string | null {
  if (!link) return null;
  const match = link.match(/tt\d+/);
  return match ? match[0] : null;
}

function mapResult(item: any): SearchResult {
  return {
    id: item.id,
    imdbId: extractImdbId(item.link),
    title: item.title,
    originalTitle: item.original_title ?? null,
    year: item.year ?? null,
    type: item.type,
    isSeries: !!item.is_series,
    runtime: item.runtime_minutes ?? null,
    plot: item.plot ?? null,
    genres: item.genres ?? [],
    rating: item.rating?.value ?? null,
    voteCount: item.rating?.vote_count ?? 0,
    image: item.image?.link ?? null,
    imageWidth: item.image?.width ?? null,
    imageHeight: item.image?.height ?? null,
    link: item.link,
  };
}

/* ---------- Hook ---------- */

interface UseSearchOptions {
  /** Debounce in ms. Default 350. */
  debounceMs?: number;
  /** Minimum query length before firing. Default 2. */
  minLength?: number;
  /** Hard cap on results returned to the caller. Default 8. */
  limit?: number;
}

export function useSearch(
  params: SearchParams,
  options: UseSearchOptions = {},
) {
  const { debounceMs = 350, minLength = 2, limit = 8 } = options;

  const [data, setData] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Serialize relevant params so useEffect deps are stable
  const key = JSON.stringify({
    q: params.query?.trim() ?? "",
    t: params.type ?? "",
    g: params.genre ?? "",
    sy: params.startYear ?? null,
    ey: params.endYear ?? null,
    l: limit,
  });

  useEffect(() => {
    // At least one filter must be present, otherwise API errors out
    const hasAnyFilter =
      (params.query && params.query.trim().length >= minLength) ||
      params.type ||
      params.genre ||
      params.startYear != null ||
      params.endYear != null;

    if (!hasAnyFilter) {
      setData([]);
      setLoading(false);
      setError(null);
      return;
    }

    // Debounce before firing
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      // Cancel any in-flight request
      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      const run = async () => {
        try {
          setLoading(true);
          setError(null);

          const url = new URL(`${API_BASE_URL}/search`);
          if (params.query?.trim())
            url.searchParams.set("query", params.query.trim());
          if (params.type) url.searchParams.set("type", params.type);
          if (params.genre) url.searchParams.set("genre", params.genre);
          if (params.startYear != null)
            url.searchParams.set("start_year", String(params.startYear));
          if (params.endYear != null)
            url.searchParams.set("end_year", String(params.endYear));
          url.searchParams.set("limit", String(limit));

          const res = await fetch(url.toString(), {
            signal: controller.signal,
            cache: "no-store",
          });

          if (!res.ok) {
            const text = await res.text().catch(() => "");
            throw new Error(text || `HTTP ${res.status}`);
          }

          const json = await res.json();
          const results = Array.isArray(json.results)
            ? json.results
            : Array.isArray(json.data)
              ? json.data
              : [];

          setData(results.slice(0, limit).map(mapResult));
        } catch (err: any) {
          if (err.name === "AbortError") return;
          setError(err.message || "Search failed");
          setData([]);
        } finally {
          if (!controller.signal.aborted) setLoading(false);
        }
      };

      run();
    }, debounceMs);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, debounceMs, minLength, limit]);

  // Cancel on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  return { data, loading, error };
}