// components/continue-watching-row.tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, X } from "lucide-react";
import {
  buildResumeHref,
  formatContinueSubtitle,
  getContinueWatching,
  progressPercent,
  removeWatchProgress,
  type WatchProgressRow,
} from "@/utils/supabase/watch-progress";

export function ContinueWatchingRow() {
  const [rows, setRows] = useState<WatchProgressRow[]>([]);
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(true);

  const load = useCallback(async () => {
    const data = await getContinueWatching(20);
    if (!mountedRef.current) return;
    setRows(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    void load();

    const onVisible = () => {
      if (document.visibilityState === "visible") void load();
    };
    const onFocus = () => void load();
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", onFocus);

    return () => {
      mountedRef.current = false;
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", onFocus);
    };
  }, [load]);

  const handleRemove = async (titleId: string) => {
    setRows((prev) => prev.filter((r) => r.title_id !== titleId));
    await removeWatchProgress(titleId);
  };

  if (loading || rows.length === 0) return null;

  return (
    <section
      aria-labelledby="continue-watching-heading"
      className="max-w-[1600px] mx-auto px-4 md:px-6 py-6"
    >
      <h2
        id="continue-watching-heading"
        className="text-xl md:text-2xl font-bold text-white mb-4"
      >
        Continue Watching
      </h2>

      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {rows.map((row) => {
          const pct = progressPercent(row);
          const subtitle = formatContinueSubtitle(row);

          return (
            <div
              key={row.id}
              className="relative flex-none w-[220px] md:w-[260px] group"
            >
              <button
                onClick={() => handleRemove(row.title_id)}
                className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-black/70 hover:bg-red-600 text-white opacity-0 group-hover:opacity-100 focus:opacity-100 transition"
                aria-label={`Remove ${row.title} from continue watching`}
              >
                <X className="w-4 h-4" />
              </button>

              <Link href={buildResumeHref(row)} className="block">
                <div className="relative aspect-video rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800">
                  {row.image_url ? (
                    <Image
                      src={row.image_url}
                      alt={row.title}
                      fill
                      sizes="260px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-zinc-600 text-xs">
                      No image
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                    <div className="p-3 rounded-full bg-white/90">
                      <Play className="w-6 h-6 text-black fill-black" />
                    </div>
                  </div>

                  {row.is_series && row.season && row.episode && (
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-bold text-white tracking-wide">
                      S{row.season}E{row.episode}
                    </span>
                  )}

                  {pct != null && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                      <div className="h-full bg-red-600" style={{ width: `${pct}%` }} />
                    </div>
                  )}
                </div>

                <div className="mt-2">
                  <p className="text-sm font-semibold text-white truncate">
                    {row.title}
                  </p>
                  {subtitle && (
                    <p className="text-xs text-zinc-400 truncate">{subtitle}</p>
                  )}
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}