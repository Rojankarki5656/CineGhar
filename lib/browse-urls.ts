export const browseChart = (chart: string, country = "US") =>
  `/browse/${chart}?country=${encodeURIComponent(country)}`;

export const browseSearch = (q: string, country = "US") =>
  `/browse/search?q=${encodeURIComponent(q)}&country=${encodeURIComponent(country)}`;