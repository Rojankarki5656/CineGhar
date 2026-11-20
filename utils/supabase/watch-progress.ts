// lib/supabase/watch-progress.ts
"use client";

import { supabase } from "@/utils/supabase/client";

export interface WatchProgressRow {
  id: string;
  user_id: string;
  title_id: string;
  title: string;
  image_url: string | null;
  year: string | null;
  is_series: boolean;
  season: number | null;
  episode: number | null;
  episode_title: string | null;
  progress_seconds: number;
  duration_seconds: number | null;
  updated_at: string;
}

export interface UpsertWatchProgressInput {
  title_id: string;
  title: string;
  image_url?: string | null;
  year?: string | null;
  is_series: boolean;
  season?: number | null;
  episode?: number | null;
  episode_title?: string | null;
  progress_seconds?: number;
  duration_seconds?: number | null;
}

/* ---------------------------------------------------------------- */
/* userId — cached, fast (getSession reads localStorage, no network) */
/* ---------------------------------------------------------------- */

let cachedUserId: string | null | undefined;

function primeUserIdFromStorage() {
  if (cachedUserId !== undefined) return;
  if (typeof window === "undefined") return;
  cachedUserId = window.localStorage.getItem("userId");
}

export async function getCurrentUserId(): Promise<string | null> {
  if (cachedUserId) return cachedUserId;
  primeUserIdFromStorage();
  if (cachedUserId) return cachedUserId;

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const id = session?.user?.id ?? null;
  cachedUserId = id;
  if (id && typeof window !== "undefined") {
    window.localStorage.setItem("userId", id);
  }
  return id;
}

// Keep cache in sync when the user signs in / out on this tab.
if (typeof window !== "undefined") {
  supabase.auth.onAuthStateChange((_event, session) => {
    cachedUserId = session?.user?.id ?? null;
    if (cachedUserId) window.localStorage.setItem("userId", cachedUserId);
    else window.localStorage.removeItem("userId");
  });
}

/* ---------------------------------------------------------------- */
/* Writes                                                            */
/* ---------------------------------------------------------------- */

export async function saveWatchProgress(
  input: UpsertWatchProgressInput,
): Promise<void> {
  const userId = await getCurrentUserId();
  if (!userId) return; // silently skip when logged out

  const { error } = await supabase.from("watch_progress").upsert(
    {
      user_id: userId,
      title_id: input.title_id,
      title: input.title,
      image_url: input.image_url ?? null,
      year: input.year ?? null,
      is_series: input.is_series,
      season: input.is_series ? (input.season ?? null) : null,
      episode: input.is_series ? (input.episode ?? null) : null,
      episode_title: input.is_series ? (input.episode_title ?? null) : null,
      progress_seconds: input.progress_seconds ?? 0,
      duration_seconds: input.duration_seconds ?? null,
      // updated_at handled by DB trigger
    },
    { onConflict: "user_id,title_id" },
  );

  if (error) {
    // Non-fatal — never break the player because of a write failure.
    console.warn("[saveWatchProgress]", error.message);
  }
}

export async function removeWatchProgress(titleId: string): Promise<void> {
  const userId = await getCurrentUserId();
  if (!userId) return;
  const { error } = await supabase
    .from("watch_progress")
    .delete()
    .eq("user_id", userId)
    .eq("title_id", titleId);
  if (error) console.warn("[removeWatchProgress]", error.message);
}

/* ---------------------------------------------------------------- */
/* Reads                                                             */
/* ---------------------------------------------------------------- */

export async function getContinueWatching(
  limit = 20,
): Promise<WatchProgressRow[]> {
  const userId = await getCurrentUserId();
  if (!userId) return [];

  const { data, error } = await supabase
    .from("watch_progress")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.warn("[getContinueWatching]", error.message);
    return [];
  }
  return (data ?? []) as WatchProgressRow[];
}

/* ---------------------------------------------------------------- */
/* Helpers                                                           */
/* ---------------------------------------------------------------- */

export function buildResumeHref(row: WatchProgressRow): string {
  if (row.is_series && row.season && row.episode) {
    return `/watch/${row.title_id}?s=${row.season}&e=${row.episode}`;
  }
  return `/watch/${row.title_id}`;
}

export function formatContinueSubtitle(row: WatchProgressRow): string {
  if (row.is_series && row.season && row.episode) {
    const ep = row.episode_title ? ` · ${row.episode_title}` : "";
    return `S${row.season} E${row.episode}${ep}`;
  }
  return row.year ?? "";
}

export function progressPercent(row: WatchProgressRow): number | null {
  if (!row.duration_seconds || row.duration_seconds <= 0) return null;
  const pct = (row.progress_seconds / row.duration_seconds) * 100;
  return Math.max(0, Math.min(100, Math.round(pct)));
}