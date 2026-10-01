// app/lib/movies.ts
// lib/movies.ts

export interface Person {
  id: string;
  name: string;
  link: string;
}

export interface CastMember extends Person {
  characters: string[];
  image: string | null;
}

export interface MovieImage {
  link: string | null;
  width?: number | null;
  height?: number | null;
}

export interface Trailer {
  id: string;
  title: string;
  link: string;
  duration: number;       // seconds
  thumbnail: string | null;
}

export interface BoxOffice {
  budget: { amount: number; currency: string } | null;
  openingWeekend:
    | {
        amount: number;
        currency: string;
        weekend_end_date: string;
        theater_count: number;
      }
    | null;
  grossWorldwide: { amount: number; currency: string } | null;
}

/** Trimmed shape used by MovieRow / card grids */
export interface MovieCard {
  id: string;
  title: string;
  image: string;
  year: string;
  rating: string;
  genres?: string[];
  description?: string;
}

/** Full detail shape returned by useDetailMovies */
export interface Movie {
  id: string;
  imdbId: string | null;
  title: string;
  originalTitle: string | null;
  link: string;
  type: string;
  isSeries: boolean;
  isEpisode: boolean;
  year: number | null;
  endYear: number | null;
  releaseDate: string | null;
  runtime: number | null;          // minutes
  certificate: string | null;
  plot: string | null;
  genres: string[];

  rating: number | null;           // 0–10
  voteCount: number;
  topRank: number | null;

  metascore: number | null;
  metascoreReviewCount: number;

  directors: Person[];
  creators: Person[];
  writers: Person[];
  stars: Person[];
  topCast: CastMember[];
  totalCast: number;

  trailer: Trailer | null;

  image: string | null;
  imageWidth: number | null;
  imageHeight: number | null;

  boxOffice: BoxOffice | null;

  seasons: number | null;

  similarTitles: Movie[];

  countriesOfOrigin: string[];
  spokenLanguages: string[];
  country: string | null;
}

/** 
 * Legacy shape — kept only if other parts of the app still import it.
 * Prefer `MovieCard` or `Movie` going forward.
 */
export interface LegacyMovie {
  id: string;
  title: string;
  year: string;
  duration: string;
  rating: string;
  genres?: string[];
  description?: string;
  director?: string;
  cast?: string[];
  imageUrl: string;
  releaseDate?: string;
  language?: string;
  videoUrl: string;
}