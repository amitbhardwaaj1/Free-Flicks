const API_KEY = "2dca580c2a14b55200e784d157207b4d";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_BASE = "https://image.tmdb.org/t/p";

export const getImageUrl = (path: string | null, size = "w500") =>
  path ? `${IMG_BASE}/${size}${path}` : "/placeholder.svg";

export const getBackdropUrl = (path: string | null) =>
  path ? `${IMG_BASE}/original${path}` : null;

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date: string;
  genre_ids?: number[];
  genres?: { id: number; name: string }[];
  runtime?: number;
  original_language: string;
}

export interface MovieDetails extends Movie {
  genres: { id: number; name: string }[];
  runtime: number;
  tagline: string;
  credits?: {
    cast: {
      id: number;
      name: string;
      character: string;
      profile_path: string | null;
    }[];
  };
  videos?: {
    results: {
      key: string;
      site: string;
      type: string;
      name: string;
    }[];
  };
  similar?: { results: Movie[] };
}

export interface Genre {
  id: number;
  name: string;
}

const fetchTMDB = async (endpoint: string, params: Record<string, string> = {}) => {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set("api_key", API_KEY);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`TMDB error: ${res.status}`);
  return res.json();
};

export const getTrending = (page = 1) =>
  fetchTMDB("/trending/movie/week", { page: String(page) });

export const getPopular = (page = 1) =>
  fetchTMDB("/movie/popular", { page: String(page) });

export const getTopRated = (page = 1) =>
  fetchTMDB("/movie/top_rated", { page: String(page) });

export const getUpcoming = (page = 1) =>
  fetchTMDB("/movie/upcoming", { page: String(page) });

export const getMoviesByGenre = (genreId: number, page = 1) =>
  fetchTMDB("/discover/movie", {
    with_genres: String(genreId),
    sort_by: "popularity.desc",
    page: String(page),
  });

export const getMovieDetails = (id: number): Promise<MovieDetails> =>
  fetchTMDB(`/movie/${id}`, { append_to_response: "credits,videos,similar" });

export const searchMovies = (query: string, page = 1) =>
  fetchTMDB("/search/movie", { query, page: String(page) });

export const getGenres = (): Promise<{ genres: Genre[] }> =>
  fetchTMDB("/genre/movie/list");

export const FEATURED_GENRES = [
  { id: 28, name: "Action" },
  { id: 35, name: "Comedy" },
  { id: 18, name: "Drama" },
  { id: 27, name: "Horror" },
  { id: 878, name: "Sci-Fi" },
  { id: 10749, name: "Romance" },
  { id: 53, name: "Thriller" },
  { id: 16, name: "Animation" },
  { id: 99, name: "Documentary" },
  { id: 10751, name: "Family" },
];
