"use client";

import { useState, useEffect } from "react";

export const API_BASE_URL = "http://localhost:8000";

/** Extract "tt35538033" from "https://www.imdb.com/title/tt35538033/" */
function extractImdbId(link) {
  if (!link) return null;
  const match = link.match(/tt\d+/);
  return match ? match[0] : null;
}

export function useDetailMovies(id) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        console.log("Response JSON:", json);

        // API returns a single object, not an array
        const item = json?.data ?? json?.results ?? json;

        if (!item || typeof item !== "object") {
          setData(null);
          return;
        }

        const transformed = {
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

          directors: (item.directors ?? []).map((d) => ({
            id: d.id,
            name: d.name,
            link: d.link,
          })),
          creators: (item.creators ?? []).map((c) => ({
            id: c.id,
            name: c.name,
            link: c.link,
          })),
          writers: (item.writers ?? []).map((w) => ({
            id: w.id,
            name: w.name,
            link: w.link,
          })),
          stars: (item.stars ?? []).map((s) => ({
            id: s.id,
            name: s.name,
            link: s.link,
          })),
          topCast: (item.top_cast ?? []).map((c) => ({
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

          similarTitles: (item.similar_titles ?? []).map((s) => ({
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
      } catch (err) {
        if (err.name === "AbortError") return;
        setError(err.message || "Failed to fetch movie details");
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