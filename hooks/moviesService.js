"use client";

import { useState, useEffect } from "react";
import config from "../config/config";

export const API_BASE_URL = config.localUrl;

/**
 * Extracts the IMDb ID from a URL like:
 * https://www.imdb.com/title/tt35538033/
 * Returns "tt35538033" or null.
 */
function extractImdbId(link) {
  if (!link) return null;

  // Match /title/tt1234567/ or just tt1234567
  const match = link.match(/tt\d+/);
  return match ? match[0] : null;
}

export function usePopularMovies(page = 1, per_page = 20) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchPopularMovies = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `${API_BASE_URL}/charts/popular-movies`,
          {
            signal: controller.signal,
            cache: "no-store",
          }
        );

        console.log("Response status:", res.body);

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const json = await res.json();

        console.log("Response JSON:", json);

        const movies = Array.isArray(json.results)
          ? json.results
          : Array.isArray(json.data)
            ? json.data
            : [];

        console.log("Movies data:", movies);

        const transformed = movies
          .slice((page - 1) * per_page, page * per_page)
          .map((item) => ({
            id: item.id,
            rank: item.rank,
            title: item.title,
            originalTitle: item.original_title,
            year: item.year,
            type: item.type,
            isSeries: item.is_series,
            runtime: item.runtime_minutes,
            plot: item.plot,
            genres: item.genres || [],
            rating: item.rating?.value ?? null,
            voteCount: item.rating?.vote_count ?? 0,
            image: item.image?.link ?? null,
            imageWidth: item.image?.width ?? null,
            imageHeight: item.image?.height ?? null,
            imdbId: extractImdbId(item.link), // <-- only "tt35538033"
            imdbLink: item.link,              // optional: keep original URL
          }));

        setData(transformed);
      } catch (err) {
        // Ignore abort errors when the component unmounts
        if (err.name === "AbortError") {
          return;
        }

        setError(err.message || "Failed to fetch popular movies");
        setData([]);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchPopularMovies();

    return () => {
      controller.abort();
    };
  }, [page, per_page]);

  return {
    data,
    loading,
    error,
  };
}