// app/watch/[id]/page.tsx
"use client";

import {
  use,
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from "react";
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
  Calendar,
  Globe,
  Film,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDetailMovies } from "@/hooks/movieseDetailService";
import { providers, getProvider } from "@/config/providers";
import { useServerSelection } from "@/hooks/useServerSelection";

/* ---------- Types & helpers ---------- */

interface SeasonInfo {
  number: number;
  episodeCount: number;
}

function extractSeasons(data: any): SeasonInfo[] {
  const raw = data?.seasons;

  if (raw == null) return [{ number: 1, episodeCount: 30 }];

  // Object form: { count, seasons: ["1"], total_episodes, is_ongoing }
  if (!Array.isArray(raw) && typeof raw === "object") {
    const seasonList: string[] = Array.isArray(raw.seasons) ? raw.seasons : [];
    const totalEpisodes =
      typeof raw.total_episodes === "number" && raw.total_episodes > 0
        ? raw.total_episodes
        : 30;
    const seasonCount =
      typeof raw.count === "number" && raw.count > 0
        ? raw.count
        : seasonList.length || 1;

    if (seasonList.length > 0) {
      const perSeason = seasonList.length === 1 ? totalEpisodes : 30;
      return seasonList
        .map((s) => Number(s))
        .filter((n) => Number.isFinite(n) && n > 0)
        .map((n) => ({ number: n, episodeCount: perSeason }))
        .sort((a, b) => a.number - b.number);
    }

    return Array.from({ length: seasonCount }, (_, i) => ({
      number: i + 1,
      episodeCount: seasonCount === 1 ? totalEpisodes : 30,
    }));
  }

  if (typeof raw === "number") {
    return Array.from({ length: Math.max(1, raw) }, (_, i) => ({
      number: i + 1,
      episodeCount: 30,
    }));
  }

  if (Array.isArray(raw)) {
    const seasons: SeasonInfo[] = [];
    for (let i = 0; i < raw.length; i++) {
      const s: any = raw[i];
      if (typeof s === "number") {
        seasons.push({ number: s, episodeCount: 30 });
        continue;
      }
      const number = Number(
        s?.season ?? s?.season_number ?? s?.seasonNumber ?? s?.number ?? i + 1,
      );
      const episodeCount = Number(
        s?.episodes ??
          s?.episode_count ??
          s?.episodeCount ??
          s?.episodes_count ??
          s?.episodesCount ??
          30,
      );
      if (Number.isFinite(number) && number > 0) {
        seasons.push({
          number,
          episodeCount:
            Number.isFinite(episodeCount) && episodeCount > 0
              ? episodeCount
              : 30,
        });
      }
    }
    if (seasons.length > 0) {
      const seen = new Set<number>();
      return seasons
        .filter((s) => {
          if (seen.has(s.number)) return false;
          seen.add(s.number);
          return true;
        })
        .sort((a, b) => a.number - b.number);
    }
  }

  return [{ number: 1, episodeCount: 30 }];
}

/* ---------- Page ---------- */

export default function WatchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: movieId } = use(params);
  const { data: movie, loading: detailsLoading } = useDetailMovies(movieId);

  const isSeries = !!movie?.isSeries;
  const seasons = useMemo(() => extractSeasons(movie), [movie]);

  const [season, setSeason] = useState<number>(1);
  const [episode, setEpisode] = useState<number>(1);

  /* ----- Server selection ----- */
  const { serverId, select: selectServer } = useServerSelection();
  const provider = getProvider(serverId);

  /* ----- Read s/e from URL once series is known ----- */
  useEffect(() => {
    if (!isSeries) return;
    const sp = new URLSearchParams(window.location.search);
    const s = Number(sp.get("s"));
    const e = Number(sp.get("e"));
    if (Number.isFinite(s) && s > 0) setSeason(s);
    if (Number.isFinite(e) && e > 0) setEpisode(e);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSeries]);

  /* ----- URL sync ----- */
  const syncUrl = useCallback((s: number, e: number) => {
    const url = new URL(window.location.href);
    url.searchParams.set("s", String(s));
    url.searchParams.set("e", String(e));
    window.history.replaceState({}, "", url.toString());
  }, []);

  /* ----- Clamp season to valid list ----- */
  useEffect(() => {
    if (!isSeries || seasons.length === 0) return;
    if (!seasons.some((s) => s.number === season)) {
      setSeason(seasons[0].number);
      setEpisode(1);
    }
  }, [isSeries, seasons, season]);

  /* ----- Clamp episode to season length ----- */
  const currentSeason = seasons.find((s) => s.number === season);
  const maxEpisodes = currentSeason?.episodeCount ?? 1;

  useEffect(() => {
    if (!isSeries) return;
    if (episode > maxEpisodes) setEpisode(1);
  }, [isSeries, maxEpisodes, episode]);

  /* ----- Embed URL ----- */
  // Prefer IMDb id for external providers; fall back to the URL param
  const embedId = movie?.imdbId ?? movieId;

  const embedUrl = provider.buildUrl({
    id: embedId,
    isSeries,
    season,
    episode,
  });

  /* ----- Fullscreen (only the player box) ----- */
  const [isFullscreen, setIsFullscreen] = useState(false);
  const playerWrapRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = useCallback(async () => {
    const el = playerWrapRef.current;
    if (!el) return;
    try {
      if (!document.fullscreenElement) await el.requestFullscreen();
      else await document.exitFullscreen();
    } catch (err) {
      console.error("Fullscreen error:", err);
    }
  }, []);

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  /* ----- Handlers ----- */
  const handleSeasonChange = (next: number) => {
    setSeason(next);
    setEpisode(1);
    syncUrl(next, 1);
  };

  const handleEpisodeClick = (next: number) => {
    if (next === episode) return;
    setEpisode(next);
    syncUrl(season, next);
  };

  /* ----- Guards ----- */
  if (!movieId) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Movie not found
      </div>
    );
  }

  const durationLabel = movie?.runtime ? `${movie.runtime} min` : "—";
  const directorLabel =
    movie?.directors?.map((d) => d.name).join(", ") ||
    movie?.creators?.map((c) => c.name).join(", ") ||
    "—";
  const castLabel =
    movie?.topCast?.slice(0, 6).map((c) => c.name).join(", ") || "—";

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* ---------- Top bar ---------- */}
      <header className="sticky top-0 z-30 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-3 flex items-center gap-3">
          <Link href={`/movies/${movieId}`}>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>

          <div className="min-w-0 flex-1">
            <h1 className="text-sm md:text-base font-semibold truncate">
              {movie?.title ?? (detailsLoading ? "Loading…" : "Now Playing")}
            </h1>
            {isSeries && (
              <p className="text-xs text-gray-400 flex items-center gap-1">
                <Tv className="w-3 h-3" />
                Season {season} · Episode {episode}
              </p>
            )}
          </div>

          <Link href={`/movies/${movieId}`} className="hidden sm:block">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10 gap-2"
            >
              <Info className="w-4 h-4" />
              Details
            </Button>
          </Link>
        </div>
      </header>

      {/* ---------- Main ---------- */}
      <main className="max-w-[1600px] mx-auto px-4 md:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-6">
          {/* ==== LEFT: player + selectors ==== */}
          <section className="min-w-0">
            {/* Player box (fullscreen target) */}
            <div
              ref={playerWrapRef}
              className="relative w-full aspect-video bg-black rounded-lg overflow-hidden border border-zinc-800"
            >
              {detailsLoading && !movie ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-white/70" />
                </div>
              ) : (
                <iframe
                  key={embedUrl}
                  src={embedUrl}
                  title={
                    movie?.title
                      ? isSeries
                        ? `${movie.title} S${season}E${episode}`
                        : `Watch ${movie.title}`
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
                aria-label={
                  isFullscreen ? "Exit fullscreen" : "Enter fullscreen"
                }
                className="absolute top-3 right-3 z-10 p-2 rounded-md bg-black/60 hover:bg-black/80 text-white transition"
              >
                {isFullscreen ? (
                  <Minimize className="w-5 h-5" />
                ) : (
                  <Maximize className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* ==== Server selector ==== */}
            <div className="mt-4">
              <p className="text-sm text-gray-400 mb-2">
                Server
                {provider.note && (
                  <span className="ml-2 text-xs text-red-400">
                    · {provider.note}
                  </span>
                )}
              </p>
              <div className="flex flex-wrap gap-2">
                {providers.map((p) => {
                  const isActive = p.id === serverId;
                  return (
                    <button
                      key={p.id}
                      onClick={() => selectServer(p.id)}
                      aria-pressed={isActive}
                      title={p.note}
                      className={`min-w-[90px] px-3 py-1.5 rounded-md text-sm font-medium transition border ${
                        isActive
                          ? "bg-red-600 border-red-600 text-white"
                          : "bg-zinc-900 border-zinc-700 text-gray-200 hover:bg-zinc-800 hover:border-zinc-600"
                      }`}
                    >
                      {p.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ==== Season dropdown + Episode grid ==== */}
            {isSeries && !detailsLoading && (
              <div className="mt-4 space-y-4">
                {/* Season dropdown */}
                <div className="flex items-center gap-3 flex-wrap">
                  <label
                    htmlFor="season-select"
                    className="text-sm text-gray-400"
                  >
                    Season
                  </label>
                  <select
                    id="season-select"
                    value={season}
                    onChange={(e) =>
                      handleSeasonChange(Number(e.target.value))
                    }
                    className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white text-sm rounded-md px-3 py-1.5 outline-none focus:ring-2 focus:ring-red-500/50"
                  >
                    {seasons.map((s) => (
                      <option key={s.number} value={s.number}>
                        Season {s.number}
                      </option>
                    ))}
                  </select>

                  <span className="text-xs text-gray-500">
                    {maxEpisodes} episode{maxEpisodes === 1 ? "" : "s"}
                  </span>
                </div>

                {/* Episode buttons */}
                <div>
                  <p className="text-sm text-gray-400 mb-2">Episodes</p>
                  <div className="flex flex-wrap gap-2">
                    {Array.from({ length: maxEpisodes }, (_, i) => i + 1).map(
                      (n) => {
                        const isActive = n === episode;
                        return (
                          <button
                            key={n}
                            onClick={() => handleEpisodeClick(n)}
                            aria-current={isActive}
                            aria-label={`Play episode ${n}`}
                            className={`min-w-10 h-10 px-3 rounded-md text-sm font-medium transition border ${
                              isActive
                                ? "bg-red-600 border-red-600 text-white"
                                : "bg-zinc-900 border-zinc-700 text-gray-200 hover:bg-zinc-800 hover:border-zinc-600"
                            }`}
                          >
                            {n}
                          </button>
                        );
                      },
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Mobile-only title + short plot */}
            {movie && (
              <div className="mt-6 lg:hidden">
                <h2 className="text-xl font-bold">{movie.title}</h2>
                {movie.plot && (
                  <p className="mt-2 text-sm text-gray-400 line-clamp-4">
                    {movie.plot}
                  </p>
                )}
              </div>
            )}
          </section>

          {/* ==== RIGHT: details panel ==== */}
          <aside className="lg:sticky lg:top-20 h-fit space-y-5">
            {movie?.image && (
              <div className="aspect-[2/3] w-full max-w-[220px] mx-auto lg:mx-0 rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900">
                <Image
                  src={movie.image}
                  alt={`${movie.title} poster`}
                  width={300}
                  height={450}
                  unoptimized
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div>
              <h2 className="text-xl font-bold">
                {movie?.title ?? "Loading…"}
              </h2>
              {movie?.originalTitle &&
                movie.originalTitle !== movie.title && (
                  <p className="text-sm text-gray-400 italic mt-1">
                    {movie.originalTitle}
                  </p>
                )}
            </div>

            {movie && (
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-300">
                {movie.year && <span>{movie.year}</span>}
                {movie.year && <span className="text-gray-600">•</span>}
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" /> {durationLabel}
                </span>
                {movie.rating != null && (
                  <>
                    <span className="text-gray-600">•</span>
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      {movie.rating}/10
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
                    className="text-xs px-2 py-0.5 border-zinc-700 text-white"
                  >
                    {g}
                  </Badge>
                ))}
              </div>
            )}

            {movie?.plot && (
              <p className="text-sm text-gray-300 leading-relaxed line-clamp-6">
                {movie.plot}
              </p>
            )}

            {movie && (
              <div className="space-y-2 text-sm">
                <div className="flex gap-2">
                  <span className="font-semibold text-gray-200 min-w-24">
                    {movie.creators?.length ? "Creator:" : "Director:"}
                  </span>
                  <span className="text-gray-400">{directorLabel}</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-semibold text-gray-200 min-w-24">
                    Cast:
                  </span>
                  <span className="text-gray-400 line-clamp-2">
                    {castLabel}
                  </span>
                </div>
                {movie.releaseDate && (
                  <div className="flex gap-2">
                    <span className="font-semibold text-gray-200 min-w-24 flex items-center gap-1">
                      <Calendar className="w-4 h-4" /> Released:
                    </span>
                    <span className="text-gray-400">
                      {movie.releaseDate}
                    </span>
                  </div>
                )}
                {movie.spokenLanguages?.length > 0 && (
                  <div className="flex gap-2">
                    <span className="font-semibold text-gray-200 min-w-24 flex items-center gap-1">
                      <Globe className="w-4 h-4" /> Language:
                    </span>
                    <span className="text-gray-400">
                      {movie.spokenLanguages.join(", ")}
                    </span>
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-wrap gap-2 pt-2">
              {movie?.trailer?.link && (
                <a
                  href={movie.trailer.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 text-black"
                  >
                    <Film className="w-4 h-4" />
                    Trailer
                  </Button>
                </a>
              )}

              <Link href={`/movies/${movieId}`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 text-black"
                >
                  <Info className="w-4 h-4" />
                  Full Details
                </Button>
              </Link>

              {movie?.link && (
                <a
                  href={movie.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 text-black"
                  >
                    <ExternalLink className="w-4 h-4" />
                    IMDb
                  </Button>
                </a>
              )}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}