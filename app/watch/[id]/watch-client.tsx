"use client";

import { use, useState, useCallback, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Maximize,
  Minimize,
  Info,
  Loader2,
  Tv,
  Star,
  Clock,
  Server,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDetailMovies } from "@/hooks/movieseDetailService";
import { providers, getProvider } from "@/config/providers";
import { useServerSelection } from "@/hooks/useServerSelection";
import { Navbar } from "@/components/navbar";
import { extractSeasons } from "@/lib/seasons";
import { useEpisodes } from "@/hooks/episodesService";
import { EpisodeSelector } from "@/components/watch/EpisodeSelector";
import { useWatchProgress } from "@/hooks/useWatchProgress";

interface WatchMovie {
  id: string;
  title: string;
  originalTitle?: string;
  image?: string;
  year?: string;
  rating?: number;
  plot?: string;
  runtime?: number;
  genres?: string[];
  isSeries?: boolean;
  seasons?: any;
  directors?: { name: string }[];
  creators?: { name: string }[];
  topCast?: { name: string }[];
  releaseDate?: string;
  spokenLanguages?: string[];
  trailer?: { link: string };
  link?: string;
}

export default function WatchClient({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: movieId } = use(params);
  const { data: rawMovie, loading: detailsLoading } = useDetailMovies(movieId);
  const movie = rawMovie as WatchMovie | null;

  const isSeries = !!movie?.isSeries;
  const seasons = useMemo(() => extractSeasons(movie), [movie]);
  const [season, setSeason] = useState<number>(1);
  const [episode, setEpisode] = useState<number>(1);

  const { serverId, select } = useServerSelection();
  const activeProvider = getProvider(serverId);

  // ---- Episodes from the API (series only) ----
  const {
    episodes: apiEpisodes,
    loading: episodesLoading,
    error: episodesError,
  } = useEpisodes(isSeries ? movieId : undefined, season);

  const currentSeason = seasons.find((s) => s.number === season);

  // Prefer the API episode count, fall back to the detail-derived count
  const maxEpisodes = useMemo(() => {
    if (isSeries) {
      if (episodesLoading) return 0;
      if (apiEpisodes.length > 0) return apiEpisodes.length;
    }
    return currentSeason?.episodeCount ?? 1;
  }, [
    isSeries,
    episodesLoading,
    apiEpisodes.length,
    currentSeason?.episodeCount,
  ]);

  // Seed season/episode from the URL
  useEffect(() => {
    if (!isSeries) return;
    const sp = new URLSearchParams(window.location.search);
    const s = Number(sp.get("s"));
    const e = Number(sp.get("e"));
    if (Number.isFinite(s) && s > 0) setSeason(s);
    if (Number.isFinite(e) && e > 0) setEpisode(e);
  }, [isSeries]);

  const syncUrl = useCallback((s: number, e: number) => {
    const url = new URL(window.location.href);
    url.searchParams.set("s", String(s));
    url.searchParams.set("e", String(e));
    window.history.replaceState({}, "", url.toString());
  }, []);

  // Keep selected season valid
  useEffect(() => {
    if (!isSeries || seasons.length === 0) return;
    if (!seasons.some((s) => s.number === season)) {
      setSeason(seasons[0].number);
      setEpisode(1);
    }
  }, [isSeries, seasons, season]);

  // Reset to episode 1 once the API confirms the episode count
  useEffect(() => {
    if (!isSeries || episodesLoading) return;
    if (maxEpisodes > 0 && episode > maxEpisodes) {
      setEpisode(1);
      syncUrl(season, 1);
    }
  }, [isSeries, episodesLoading, maxEpisodes, episode, season, syncUrl]);

  const embedUrl = activeProvider.buildUrl({
    id: movieId,
    isSeries,
    season,
    episode,
  });

  const [isFullscreen, setIsFullscreen] = useState(false);
  const playerWrapRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = useCallback(async () => {
    const el = playerWrapRef.current;
    if (!el) return;
    try {
      if (!document.fullscreenElement) await el.requestFullscreen();
      else await document.exitFullscreen();
    } catch (err) {}
  }, []);

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const selectedEpisode = apiEpisodes.find((ep) => ep.episode === episode);

  if (!movieId) {
    return (
      <div className="min-h-screen bg-[#141414] text-white flex items-center justify-center">
        Movie not found
      </div>
    );
  }

  useWatchProgress({
    titleId: movieId,
    title: movie?.title,
    imageUrl:
      typeof movie?.image === "string"
        ? movie.image
        : ((movie as any)?.image?.link as string | undefined),
    year: movie?.year,
    isSeries,
    season,
    episode,
    episodeTitle: selectedEpisode?.title,
    enabled: !detailsLoading && !!movie,
  });

  return (
    <div className="min-h-screen bg-[#141414] text-white">
      <Navbar />
      <header className="sticky top-0 z-30 border-b border-zinc-800/60 bg-[#141414]/90 backdrop-blur-md">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-3 flex items-center gap-3">
          <Link href={`/movies/${movieId}`}>
            <Button
              variant="ghost"
              size="icon"
              className="text-zinc-300 hover:text-white hover:bg-zinc-800/50"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="text-sm md:text-base font-semibold truncate text-zinc-100">
              {movie?.title ?? (detailsLoading ? "Loading…" : "Now Playing")}
            </h1>
            {isSeries && (
              <p className="text-xs text-zinc-400 flex items-center gap-1 truncate">
                <Tv className="w-3 h-3 shrink-0" />
                <span className="truncate">
                  S{season}E{episode}
                  {selectedEpisode?.title ? ` · ${selectedEpisode.title}` : ""}
                </span>
              </p>
            )}
          </div>
          <Link href={`/movies/${movieId}`} className="hidden sm:block">
            <Button
              variant="ghost"
              size="sm"
              className="text-zinc-300 hover:text-white hover:bg-zinc-800/50 gap-2"
            >
              <Info className="w-4 h-4" /> Details
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-4 md:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-6">
          <section className="min-w-0">
            <div
              ref={playerWrapRef}
              className="relative w-full aspect-video bg-black rounded-xl overflow-hidden border border-zinc-800/80 shadow-2xl"
            >
              {detailsLoading && !movie ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="w-10 h-10 animate-spin text-red-600" />
                </div>
              ) : (
                <iframe
                  key={`${serverId}-${embedUrl}`}
                  src={embedUrl}
                  title={
                    movie?.title
                      ? `${movie.title} - ${activeProvider.name}`
                      : "Video player"
                  }
                  className="absolute inset-0 w-full h-full border-0"
                  allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                  allowFullScreen
                  referrerPolicy="origin"
                  loading="lazy"
                />
              )}
              <button
                onClick={toggleFullscreen}
                className="absolute top-4 right-4 z-10 p-2.5 rounded-lg bg-black/60 hover:bg-red-600 text-white transition-all duration-300 backdrop-blur-sm border border-white/10"
              >
                {isFullscreen ? (
                  <Minimize className="w-5 h-5" />
                ) : (
                  <Maximize className="w-5 h-5" />
                )}
              </button>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2 bg-zinc-900/40 p-3 rounded-xl border border-zinc-800/60">
              <span className="text-sm font-semibold text-zinc-400 flex items-center gap-1.5 mr-2">
                <Server className="w-4 h-4" /> Servers:
              </span>
              {providers.map((p) => (
                <button
                  key={p.id}
                  onClick={() => select(p.id)}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all duration-200 border ${
                    serverId === p.id
                      ? "bg-red-600 border-red-500 text-white shadow-md shadow-red-600/20 scale-105"
                      : "bg-zinc-900 border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-white hover:border-zinc-500"
                  }`}
                >
                  {p.name}{" "}
                  {p.note && (
                    <span className="ml-1.5 text-[9px] opacity-75 font-normal uppercase tracking-wider">
                      ({p.note})
                    </span>
                  )}
                </button>
              ))}
            </div>

            {isSeries && !detailsLoading && (
              <EpisodeSelector
                seasons={seasons}
                season={season}
                episode={episode}
                episodes={apiEpisodes}
                loading={episodesLoading}
                error={episodesError}
                maxEpisodes={maxEpisodes}
                onSeasonChange={(s) => {
                  setSeason(s);
                  setEpisode(1);
                  syncUrl(s, 1);
                }}
                onEpisodeChange={(e) => {
                  if (e === episode) return;
                  setEpisode(e);
                  syncUrl(season, e);
                }}
              />
            )}
          </section>

          <aside className="lg:sticky lg:top-24 h-fit space-y-6 bg-zinc-900/30 p-5 rounded-xl border border-zinc-800/50">
            {movie?.image && (
              <div className="aspect-[2/3] w-full max-w-[220px] mx-auto lg:mx-0 rounded-lg overflow-hidden border border-zinc-800 shadow-lg bg-zinc-900">
                <Image
                  src={movie.image}
                  alt={`${movie.title} poster`}
                  width={300}
                  height={450}
                  sizes="(max-width: 1024px) 220px, 300px"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div>
              <h2 className="text-xl font-bold text-zinc-100">
                {movie?.title ?? "Loading…"}
              </h2>
              {movie?.originalTitle && movie.originalTitle !== movie.title && (
                <p className="text-sm text-zinc-500 italic mt-1">
                  {movie.originalTitle}
                </p>
              )}
            </div>
            {movie && (
              <div className="flex flex-wrap items-center gap-2.5 text-sm text-zinc-300 bg-zinc-900/50 p-2.5 rounded-lg border border-zinc-800/50">
                {movie.year && (
                  <span className="font-medium">{movie.year}</span>
                )}
                <span className="text-zinc-600">•</span>
                <span className="flex items-center gap-1.5 text-zinc-400">
                  <Clock className="w-4 h-4" />{" "}
                  {movie.runtime ? `${movie.runtime} min` : "—"}
                </span>
                {movie.rating != null && (
                  <>
                    <span className="text-zinc-600">•</span>
                    <span className="flex items-center gap-1 font-medium text-yellow-500">
                      <Star className="w-4 h-4 fill-yellow-500" />{" "}
                      {movie.rating}
                    </span>
                  </>
                )}
              </div>
            )}
            {movie?.genres && movie.genres.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((g) => (
                  <Badge
                    key={g}
                    variant="outline"
                    className="text-xs px-2.5 py-1 border-zinc-700 text-zinc-300 bg-zinc-900/50"
                  >
                    {g}
                  </Badge>
                ))}
              </div>
            )}
            {movie?.plot && (
              <p className="text-sm text-zinc-400 leading-relaxed line-clamp-6">
                {movie.plot}
              </p>
            )}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-zinc-800/50 mt-4">
              <Link href={`/movies/${movieId}`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 border-zinc-700 text-black hover:bg-zinc-800 hover:text-white"
                >
                  <Info className="w-4 h-4" /> Details
                </Button>
              </Link>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
