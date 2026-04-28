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
  media_type?: "movie" | "tv";
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

// Normalize TV results to look like Movie objects
const normalizeTV = (item: any): Movie => ({
  id: item.id,
  title: item.name || item.title,
  overview: item.overview,
  poster_path: item.poster_path,
  backdrop_path: item.backdrop_path,
  vote_average: item.vote_average ?? 0,
  release_date: item.first_air_date || item.release_date || "",
  genre_ids: item.genre_ids,
  original_language: item.original_language,
  media_type: "tv",
});

const normalizeMovie = (item: any): Movie => ({
  ...item,
  media_type: item.media_type || "movie",
});

// India-biased + mixed (movies + TV) trending/popular feeds
export const getTrending = async (page = 1) => {
  const [india, global] = await Promise.all([
    fetchTMDB("/discover/movie", {
      sort_by: "popularity.desc",
      with_origin_country: "IN",
      page: String(page),
    }),
    fetchTMDB("/trending/all/week", { page: String(page) }),
  ]);
  const indiaMovies = (india.results || []).map(normalizeMovie);
  const globalMixed = (global.results || [])
    .filter((r: any) => r.media_type === "movie" || r.media_type === "tv")
    .map((r: any) => (r.media_type === "tv" ? normalizeTV(r) : normalizeMovie(r)));
  // 70% india, 30% global (interleave)
  const merged: Movie[] = [];
  const seen = new Set<number>();
  for (let i = 0; i < Math.max(indiaMovies.length, globalMixed.length); i++) {
    if (i < indiaMovies.length && !seen.has(indiaMovies[i].id)) {
      merged.push(indiaMovies[i]);
      seen.add(indiaMovies[i].id);
    }
    // every 3 india, add 1 global
    if (i % 3 === 2 && Math.floor(i / 3) < globalMixed.length) {
      const g = globalMixed[Math.floor(i / 3)];
      if (!seen.has(g.id)) {
        merged.push(g);
        seen.add(g.id);
      }
    }
  }
  return { results: merged, page, total_pages: india.total_pages };
};

export const getPopular = async (page = 1) => {
  const data = await fetchTMDB("/discover/movie", {
    sort_by: "popularity.desc",
    with_origin_country: "IN",
    page: String(page),
  });
  return { ...data, results: (data.results || []).map(normalizeMovie) };
};

export const getTopRated = async (page = 1) => {
  const data = await fetchTMDB("/discover/movie", {
    sort_by: "vote_average.desc",
    with_origin_country: "IN",
    "vote_count.gte": "100",
    page: String(page),
  });
  return { ...data, results: (data.results || []).map(normalizeMovie) };
};

export const getUpcoming = async (page = 1) => {
  const today = new Date().toISOString().split("T")[0];
  const data = await fetchTMDB("/discover/movie", {
    sort_by: "popularity.desc",
    with_origin_country: "IN",
    "primary_release_date.gte": today,
    page: String(page),
  });
  return { ...data, results: (data.results || []).map(normalizeMovie) };
};

// Indian Web Series
export const getIndianWebSeries = async (page = 1) => {
  const data = await fetchTMDB("/discover/tv", {
    sort_by: "popularity.desc",
    with_origin_country: "IN",
    page: String(page),
  });
  return { ...data, results: (data.results || []).map(normalizeTV) };
};

// Popular TV (global) — for variety
export const getPopularTV = async (page = 1) => {
  const data = await fetchTMDB("/discover/tv", {
    sort_by: "popularity.desc",
    page: String(page),
  });
  return { ...data, results: (data.results || []).map(normalizeTV) };
};

export const getMoviesByGenre = async (genreId: number, page = 1) => {
  // Bias to Indian movies in genre, fallback to global if too few
  const indiaData = await fetchTMDB("/discover/movie", {
    with_genres: String(genreId),
    sort_by: "popularity.desc",
    with_origin_country: "IN",
    page: String(page),
  });
  const indiaResults = (indiaData.results || []).map(normalizeMovie);
  if (indiaResults.length >= 12) {
    return { ...indiaData, results: indiaResults };
  }
  const globalData = await fetchTMDB("/discover/movie", {
    with_genres: String(genreId),
    sort_by: "popularity.desc",
    page: String(page),
  });
  const globalResults = (globalData.results || []).map(normalizeMovie);
  const seen = new Set(indiaResults.map((m) => m.id));
  const merged = [...indiaResults, ...globalResults.filter((m) => !seen.has(m.id))];
  return { ...indiaData, results: merged };
};

export const getMovieDetails = (id: number): Promise<MovieDetails> =>
  fetchTMDB(`/movie/${id}`, { append_to_response: "credits,videos,similar" });

export const getTVDetails = async (id: number): Promise<MovieDetails> => {
  const data = await fetchTMDB(`/tv/${id}`, { append_to_response: "credits,videos,similar" });
  return {
    ...data,
    title: data.name,
    release_date: data.first_air_date,
    runtime: data.episode_run_time?.[0] ?? 0,
    media_type: "tv",
    similar: data.similar
      ? { results: (data.similar.results || []).map(normalizeTV) }
      : undefined,
  };
};

// Fuzzy / typo-tolerant search using TMDB multi-search
// Strategy: try the raw query first, then progressively shorten / strip non-letters
// and merge unique results, sorted by popularity.
export const searchMovies = async (query: string, page = 1) => {
  const variants = new Set<string>();
  const cleaned = query.trim();
  variants.add(cleaned);
  variants.add(cleaned.replace(/[^a-zA-Z0-9\s]/g, " ").replace(/\s+/g, " ").trim());
  // remove last char (typo at end)
  if (cleaned.length > 4) variants.add(cleaned.slice(0, -1));
  if (cleaned.length > 6) variants.add(cleaned.slice(0, -2));
  // first word only
  const firstWord = cleaned.split(/\s+/)[0];
  if (firstWord && firstWord.length >= 3) variants.add(firstWord);

  const all = await Promise.all(
    Array.from(variants)
      .filter(Boolean)
      .map((q) =>
        fetchTMDB("/search/multi", { query: q, page: String(page), include_adult: "false" })
          .catch(() => ({ results: [] }))
      )
  );

  const seen = new Set<number>();
  const merged: Movie[] = [];
  for (const resp of all) {
    for (const item of resp.results || []) {
      if (item.media_type !== "movie" && item.media_type !== "tv") continue;
      if (!item.poster_path) continue;
      const key = item.id * 10 + (item.media_type === "tv" ? 1 : 0);
      if (seen.has(key)) continue;
      seen.add(key);
      merged.push(item.media_type === "tv" ? normalizeTV(item) : normalizeMovie(item));
    }
  }
  // Sort: India first, then by popularity/vote
  merged.sort((a, b) => {
    const aIN = a.original_language === "hi" || a.original_language === "ta" ||
                a.original_language === "te" || a.original_language === "ml" ||
                a.original_language === "kn" || a.original_language === "bn" ||
                a.original_language === "mr" || a.original_language === "pa" ? 1 : 0;
    const bIN = b.original_language === "hi" || b.original_language === "ta" ||
                b.original_language === "te" || b.original_language === "ml" ||
                b.original_language === "kn" || b.original_language === "bn" ||
                b.original_language === "mr" || b.original_language === "pa" ? 1 : 0;
    if (aIN !== bIN) return bIN - aIN;
    return (b.vote_average || 0) - (a.vote_average || 0);
  });

  return { results: merged, page, total_pages: 1 };
};

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
