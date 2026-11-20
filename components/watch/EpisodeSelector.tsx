"use client";

import Image from "next/image";
import { Calendar, Loader2, Star } from "lucide-react";
import type { SeasonInfo } from "@/lib/seasons";
import type { Episode } from "@/hooks/episodesService";

interface EpisodeSelectorProps {
  seasons: SeasonInfo[];
  season: number;
  episode: number;
  episodes: Episode[];
  loading: boolean;
  error: string | null;
  maxEpisodes: number;
  onSeasonChange: (season: number) => void;
  onEpisodeChange: (episode: number) => void;
}

const episodeBtnClass = (active: boolean) =>
  `min-w-11 h-11 px-3 rounded-lg text-sm font-bold transition-all duration-200 border ${
    active
      ? "bg-red-600 border-red-500 text-white shadow-red-600/20 shadow-lg scale-105"
      : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:border-zinc-600 hover:text-white"
  }`;

export function EpisodeSelector({
  seasons,
  season,
  episode,
  episodes,
  loading,
  error,
  maxEpisodes,
  onSeasonChange,
  onEpisodeChange,
}: EpisodeSelectorProps) {
  const selectedEpisode = episodes.find((ep) => ep.episode === episode);
  const hasApiEpisodes = episodes.length > 0;

  return (
    <div className="mt-4 p-5 rounded-xl bg-zinc-900/40 border border-zinc-800/60">
      <div className="flex items-center gap-3 flex-wrap mb-6">
        <label className="text-sm font-semibold text-zinc-300">
          Select Season
        </label>
        <select
          value={season}
          onChange={(e) => onSeasonChange(Number(e.target.value))}
          className="bg-zinc-900 border border-zinc-700 text-white text-sm rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-red-500/50"
        >
          {seasons.map((s) => (
            <option key={s.number} value={s.number}>
              Season {s.number}
            </option>
          ))}
        </select>
        {!loading && (
          <span className="text-xs text-zinc-500 font-medium bg-zinc-800/50 px-2 py-1 rounded">
            {maxEpisodes} episode{maxEpisodes === 1 ? "" : "s"}
          </span>
        )}
      </div>

      <div>
        <p className="text-sm font-semibold text-zinc-300 mb-3">Episodes</p>

        {loading ? (
          <div className="flex items-center gap-2 text-zinc-400 text-sm py-4">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading episodes…
          </div>
        ) : (
          <>
            {error && (
              <p className="text-xs text-red-400 mb-3" role="alert">
                {error}
              </p>
            )}

            {hasApiEpisodes ? (
              <>
                <div className="flex flex-wrap gap-2.5">
                  {episodes.map((ep) => (
                    <button
                      key={ep.id ?? ep.episode}
                      onClick={() => onEpisodeChange(ep.episode)}
                      title={ep.title}
                      className={episodeBtnClass(ep.episode === episode)}
                    >
                      {ep.episode}
                    </button>
                  ))}
                </div>
                {selectedEpisode && (
                  <SelectedEpisodeInfo episode={selectedEpisode} />
                )}
              </>
            ) : (
              /* Fallback grid when the API has no data for this season */
              <div className="flex flex-wrap gap-2.5">
                {Array.from({ length: maxEpisodes }, (_, i) => i + 1).map(
                  (n) => (
                    <button
                      key={n}
                      onClick={() => onEpisodeChange(n)}
                      className={episodeBtnClass(n === episode)}
                    >
                      {n}
                    </button>
                  ),
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function SelectedEpisodeInfo({ episode }: { episode: Episode }) {
  return (
    <div className="mt-5 flex gap-4 p-3 rounded-lg bg-zinc-900/60 border border-zinc-800/60">
      {episode.image?.link && (
        <div className="relative w-36 shrink-0 aspect-video rounded-md overflow-hidden bg-zinc-800 border border-zinc-800">
          <Image
            src={episode.image.link}
            alt={episode.title}
            fill
            sizes="144px"
            className="object-cover"
          />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-sm font-semibold text-zinc-100 truncate">
            {episode.episode}. {episode.title}
          </h3>
          {episode.rating?.value != null && (
            <span className="flex items-center gap-1 text-xs font-medium text-yellow-500">
              <Star className="w-3.5 h-3.5 fill-yellow-500" />
              {episode.rating.value}
            </span>
          )}
        </div>
        {episode.release_date && (
          <div className="mt-1 flex items-center gap-1 text-xs text-zinc-500">
            <Calendar className="w-3 h-3" />
            <span>{episode.release_date}</span>
          </div>
        )}
        {episode.plot && (
          <p className="mt-2 text-xs text-zinc-400 leading-relaxed line-clamp-3">
            {episode.plot}
          </p>
        )}
      </div>
    </div>
  );
}