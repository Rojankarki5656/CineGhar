// hooks/useServerSelection.ts
"use client";

import { useCallback, useEffect, useState } from "react";
import { DEFAULT_PROVIDER_ID, providers } from "@/config/providers";

const STORAGE_KEY = "cineghar:preferred-server";

export function useServerSelection() {
  const [serverId, setServerId] = useState<string>(DEFAULT_PROVIDER_ID);

  // Hydrate: URL param wins, then localStorage, then default
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const fromUrl = sp.get("server");
    if (fromUrl && providers.some((p) => p.id === fromUrl)) {
      setServerId(fromUrl);
      return;
    }
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && providers.some((p) => p.id === stored)) {
        setServerId(stored);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const select = useCallback((id: string) => {
    if (!providers.some((p) => p.id === id)) return;
    setServerId(id);

    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {
      /* ignore */
    }

    // Keep it in the URL so shared links preserve the choice
    const url = new URL(window.location.href);
    url.searchParams.set("server", id);
    window.history.replaceState({}, "", url.toString());
  }, []);

  return { serverId, select };
}