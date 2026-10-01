// config/providers.ts

/**
 * A context object passed to each provider's buildUrl.
 * Each provider turns this into an embed URL however it likes.
 */
export interface ProviderContext {
  /** Best-available id: prefers IMDb id (tt123...), falls back to internal id */
  id: string;
  isSeries: boolean;
  season: number;
  episode: number;
}

export interface Provider {
  /** Stable id — used in URLs, localStorage, keys. Never change it. */
  id: string;
  /** Display name shown in the UI */
  name: string;
  /** Optional short note shown on hover (e.g. "Ad-free", "HD") */
  note?: string;
  /** Build the embed URL from context */
  buildUrl: (ctx: ProviderContext) => string;
}

/**
 * Add servers here. Order = display order.
 * To disable a server without deleting it, comment it out.
 */
export const providers: Provider[] = [
  {
    id: "vidsrc-buzz",
    name: "Server 1",
    note: "Recommended",
    buildUrl: ({ id, isSeries, season, episode }) =>
      isSeries
        ? `https://vidsrc.buzz/embed/tv/${id}/${season}/${episode}`
        : `https://vidsrc.buzz/embed/movie/${id}`,
  },
  {
    id: "vidsrc-to",
    name: "Server 2",
    buildUrl: ({ id, isSeries, season, episode }) =>
      isSeries
        ? `https://vidsrc.to/embed/tv/${id}/${season}/${episode}`
        : `https://vidsrc.to/embed/movie/${id}`,
  },
  {
    id: "vidlink",
    name: "Server 3",
    note: "HD",
    buildUrl: ({ id, isSeries, season, episode }) =>
      isSeries
        ? `https://vidlink.pro/tv/${id}/${season}/${episode}`
        : `https://vidlink.pro/movie/${id}`,
  },
  {
    id: "vidsrc-fyi",
    name: "Server 4",
    buildUrl: ({ id, isSeries, season, episode }) =>
      isSeries
        ? `https://vidsrc.fyi/embed/tv/${id}/${season}/${episode}`
        : `https://vidsrc.fyi/embed/movie/${id}`,
  },
  {
    id: "vidsec-mov",
    name: "Server 5",
    buildUrl: ({ id, isSeries, season, episode }) =>
      isSeries
        ? `https://vidsrc.mov/embed/tv/${id}/${season}/${episode}`
        : `https://vidsrc.mov/embed/movie/${id}`,
  },
  {
    id: "vidrock-net",
    name: "Server 6",
    buildUrl: ({ id, isSeries, season, episode }) =>
      isSeries
        ? `https://vidrock.net/tv/${id}/${season}/${episode}`
        : `https://vidrock.net/movie/${id}`,
  },
];

export const DEFAULT_PROVIDER_ID = providers[0].id;

/** Lookup helper */
export function getProvider(id: string | null | undefined): Provider {
  return (
    providers.find((p) => p.id === id) ??
    providers.find((p) => p.id === DEFAULT_PROVIDER_ID)!
  );
}