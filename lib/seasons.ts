export interface SeasonInfo {
  number: number;
  episodeCount: number;
}

export function extractSeasons(data: any): SeasonInfo[] {
  const raw = data?.seasons;
  if (raw == null) return [{ number: 1, episodeCount: 30 }];
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
  if (typeof raw === "number")
    return Array.from({ length: Math.max(1, raw) }, (_, i) => ({
      number: i + 1,
      episodeCount: 30,
    }));
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
      if (Number.isFinite(number) && number > 0)
        seasons.push({
          number,
          episodeCount:
            Number.isFinite(episodeCount) && episodeCount > 0
              ? episodeCount
              : 30,
        });
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