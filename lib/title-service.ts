// lib/title-service.ts
// Server-side title fetcher used by generateMetadata / RSC.
//
// The API returns nested objects for some fields (e.g. image: { link }),
// so we normalize everything to plain strings here — otherwise metadata
// processing (and next/image) will throw path errors.

import config from "@/config/config";

const API_BASE = config.localUrl;

export interface TitleDetails {
  id: string;
  title: string;
  originalTitle?: string;
  plot?: string;
  image?: string;
  year?: string;
  rating?: number;
  isSeries?: boolean;
  runtime?: number;
  genres?: string[];
  releaseDate?: string;
  link?: string;
}

/* ---------- helpers ---------- */

/** Accepts a string, { link }, { url }, { src }, or anything else → string | undefined */
function coerceImage(value: unknown): string | undefined {
  if (typeof value === "string") {
    const s = value.trim();
    return s.length > 0 ? s : undefined;
  }
  if (value && typeof value === "object") {
    const o = value as { link?: unknown; url?: unknown; src?: unknown };
    for (const k of ["link", "url", "src"] as const) {
      const v = o[k];
      if (typeof v === "string" && v.trim()) return v.trim();
    }
  }
  return undefined;
}

function coerceString(value: unknown): string | undefined {
  if (typeof value === "string" && value.trim()) return value.trim();
  return undefined;
}

function coerceNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const n = Number(value);
    if (Number.isFinite(n)) return n;
  }
  return undefined;
}

function coerceStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const out = value.filter(
    (x): x is string => typeof x === "string" && x.trim().length > 0,
  );
  return out.length > 0 ? out : undefined;
}

/* ---------- public API ---------- */

export async function fetchTitleDetails(
  id: string,
): Promise<TitleDetails | null> {
  if (!id) return null;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(
      `${API_BASE}/title/details?title_id=${encodeURIComponent(id)}`,
      {
        next: { revalidate: 3600 },
        headers: { Accept: "application/json" },
        signal: controller.signal,
      },
    );

    if (!res.ok) {
      console.error(`[fetchTitleDetails] ${id} -> ${res.status} ${res.statusText}`);
      return null;
    }

    const data = (await res.json()) as Record<string, unknown>;
    const title = coerceString(data.title);
    if (!title) return null;

    return {
      id: coerceString(data.id) ?? id,
      title,
      originalTitle: coerceString(data.originalTitle ?? data.original_title),
      plot: coerceString(data.plot),
      image: coerceImage(data.image),
      year:
        coerceString(data.year) ??
        coerceNumber(data.year)?.toString(),
      rating: coerceNumber(data.rating),
      isSeries: Boolean(data.isSeries ?? data.is_series),
      runtime: coerceNumber(data.runtime),
      genres: coerceStringArray(data.genres),
      releaseDate: coerceString(data.releaseDate ?? data.release_date),
      link: coerceString(data.link),
    };
  } catch (err) {
    console.error("[fetchTitleDetails] failed:", err);
    return null;
  } finally {
    clearTimeout(timer);
  }
}