// hooks/useWatchProgress.ts
"use client";

import { useEffect, useRef } from "react";
import { saveWatchProgress } from "@/utils/supabase/watch-progress";

interface UseWatchProgressParams {
  titleId: string | undefined;
  title: string | undefined;
  imageUrl: string | undefined;
  year: string | undefined;
  isSeries: boolean;
  season?: number;
  episode?: number;
  episodeTitle?: string;
  enabled: boolean;
}

/**
 * Persists "currently watching" state to Supabase.
 *
 * - Debounced write whenever title/season/episode changes
 * - Immediate write on page hide / tab switch
 * - Heartbeat every 60s so `updated_at` stays fresh while open
 *
 * Logged-out users are silently ignored inside saveWatchProgress().
 */
export function useWatchProgress({
  titleId,
  title,
  imageUrl,
  year,
  isSeries,
  season,
  episode,
  episodeTitle,
  enabled,
}: UseWatchProgressParams) {
  const lastSavedRef = useRef<string>("");

  const payload = {
    title_id: titleId!,
    title: title!,
    image_url: imageUrl,
    year,
    is_series: isSeries,
    season: isSeries ? season : undefined,
    episode: isSeries ? episode : undefined,
    episode_title: isSeries ? episodeTitle : undefined,
  };

  const ready = enabled && !!titleId && !!title;
  const signature = ready
    ? JSON.stringify({
        id: titleId,
        s: season ?? null,
        e: episode ?? null,
        t: episodeTitle ?? null,
      })
    : "";

  /* ---- 1. Debounced save on state change ---- */
  useEffect(() => {
    if (!ready) return;
    if (lastSavedRef.current === signature) return;

    const timer = setTimeout(() => {
      lastSavedRef.current = signature;
      void saveWatchProgress(payload);
    }, 1200);

    return () => clearTimeout(timer);
    // `payload` is recreated each render; keep deps narrow.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, signature]);

  /* ---- 2. Immediate flush on tab hide ---- */
  useEffect(() => {
    if (!ready) return;

    const flush = () => {
      lastSavedRef.current = signature;
      void saveWatchProgress(payload);
    };
    const onVisibility = () => {
      if (document.visibilityState === "hidden") flush();
    };

    window.addEventListener("pagehide", flush);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("pagehide", flush);
      document.removeEventListener("visibilitychange", onVisibility);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, signature]);

  /* ---- 3. Heartbeat so "recently watched" stays accurate ---- */
  useEffect(() => {
    if (!ready) return;
    const id = setInterval(() => {
      void saveWatchProgress(payload);
    }, 60_000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, signature]);
}