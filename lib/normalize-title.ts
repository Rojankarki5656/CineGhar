type Raw = Record<string, any>;

/** Images from the scraper can be a string, an {url} object, or absent. */
function pickImage(raw: Raw): string {
    const candidate =
        raw?.image ??
        raw?.imageUrl ??
        raw?.image?.link ??
        raw?.image?.url ??
        raw?.image?.src ??
        raw?.image?.href ??
        raw?.primaryImage ??
        raw?.poster ??
        raw?.images?.[0] ??
        "";

    if (typeof candidate === "string" && candidate.trim()) {
        return candidate.trim();
    }
    if (candidate && typeof candidate === "object") {
        const url = candidate.url ?? candidate.src ?? candidate.href ?? "";
        return typeof url === "string" ? url.trim() : "";
    }
    return "";
}

export function normalizeTitle(raw: Raw) {
    const id = raw.id ?? raw.imdbId ?? raw.tconst ?? raw.titleId ?? "";

    const title =
        raw.title ?? raw.primaryTitle ?? raw.titleText?.text ?? "Untitled";

    const image = raw.image.link ?? raw.image?.url ?? raw.poster ?? raw.primaryImage ?? "";

    const year =
        raw.year ??
        raw.startYear ??
        raw.releaseYear?.year ??
        raw.releaseYear ??
        "";

    const rating =
        raw.rating?.value ??
        raw.imdbRating ??
        raw.ratingsSummary?.aggregateRating ??
        "";

    const genres = Array.isArray(raw.genres)
        ? raw.genres
            .map((g: any) => (typeof g === "string" ? g : g?.text ?? ""))
            .filter(Boolean)
        : raw.genres?.genres?.map((g: any) => g?.text ?? "").filter(Boolean) ?? [];

    return {
        id: String(id),
        imdbId: id ? String(id) : null,
        title: String(title),
        image: String(image), // "" if absent → grid falls back to placeholder
        year: String(year ?? ""),
        rating: String(rating ?? ""),
        genres,
    };
}