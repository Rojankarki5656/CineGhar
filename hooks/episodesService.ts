import config from "@/config/config";
import { useEffect, useState } from "react";

export interface Episode {
  id: string;
  title: string;
  link?: string;
  season: number;
  episode: number;
  release_date?: string;
  plot?: string;
  rating?: { value: number; vote_count: number };
  image?: { link: string; width?: number | null; height?: number | null };
}

export interface EpisodesResponse {
  id: string;
  title: string;
  link?: string;
  is_ongoing?: boolean;
  country?: string;
  season: number;
  count: number;
  pagination?: {
    total: number;
    next_cursor: string | null;
    has_more: boolean;
  };
  results: Episode[];
}

const API_BASE = config.localUrl;

interface EpisodesState {
  season: number | null;
  response: EpisodesResponse | null;
  loading: boolean;
  error: string | null;
}

const EMPTY_STATE: EpisodesState = {
  season: null,
  response: null,
  loading: false,
  error: null,
};

export interface UseEpisodesResult {
  episodes: Episode[];
  response: EpisodesResponse | null;
  loading: boolean;
  error: string | null;
}

export function useEpisodes(
  titleId: string | undefined,
  season: number,
): UseEpisodesResult {
  const [state, setState] = useState<EpisodesState>(EMPTY_STATE);

  useEffect(() => {
    if (!titleId || !Number.isFinite(season) || season <= 0) {
      setState(EMPTY_STATE);
      return;
    }

    const controller = new AbortController();
    const url = `${API_BASE}/title/episodes?title_id=${encodeURIComponent(
      titleId,
    )}&season=${encodeURIComponent(season)}`;

    setState({ season, response: null, loading: true, error: null });

    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch episodes (${res.status})`);
        }
        return res.json() as Promise<EpisodesResponse>;
      })
      .then((json) => {
        if (controller.signal.aborted) return;
        setState({ season, response: json, loading: false, error: null });
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        if ((err as Error)?.name === "AbortError") return;
        setState({
          season,
          response: null,
          loading: false,
          error: (err as Error)?.message ?? "Failed to fetch episodes",
        });
      });

    return () => controller.abort();
  }, [titleId, season]);

  // Don't expose stale data while the requested season is still loading
  const isForCurrentSeason = state.season === season;

  return {
    episodes: isForCurrentSeason ? (state.response?.results ?? []) : [],
    response: isForCurrentSeason ? state.response : null,
    loading: state.loading || (!isForCurrentSeason && !!titleId),
    error: isForCurrentSeason ? state.error : null,
  };
}