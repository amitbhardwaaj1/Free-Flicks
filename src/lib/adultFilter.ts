import { Movie } from "./tmdb";

const STORAGE_KEY = "freeflicks:showAdult";

export const getShowAdult = (): boolean => {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(STORAGE_KEY) === "1";
};

export const setShowAdult = (v: boolean) => {
  localStorage.setItem(STORAGE_KEY, v ? "1" : "0");
  window.dispatchEvent(new Event("adult-filter-changed"));
};

// Keywords that suggest "pure adult" / Ullu-Alt-Balaji style erotic content
const ADULT_KEYWORDS = [
  "ullu", "alt balaji", "altbalaji", "kooku", "primeplay", "prime play",
  "hotshots", "hot shots", "rabbit movies", "11up movies", "11upmovies",
  "fliz", "feneo", "nuefliks", "cliff movies", "cliffmovies",
  "uncut", "uncensored", "erotic", "erotica", "softcore", "seductive",
  "seduction", "sensual", "sex", "sexy", "lust", "desire", "horny",
  "bhabhi", "savita", "charmsukh", "mastram", "gandii baat", "gandi baat",
  "riti riwaj", "palang tod", "julie", "kavita bhabhi", "siskiyaan",
  "jane anjane mein", "matki", "panchali", "wanna have a good time",
  "khulla saand", "tadap", "imli", "nasha", "boss", "wife", "affair",
];

const isAdultText = (text: string): boolean => {
  if (!text) return false;
  const lower = text.toLowerCase();
  return ADULT_KEYWORDS.some((kw) => lower.includes(kw));
};

// Returns true if movie/series looks like pure adult/erotic content
export const isPureAdult = (m: Movie & { adult?: boolean; name?: string; original_title?: string; original_name?: string }): boolean => {
  if ((m as any).adult === true) return true;
  const fields = [m.title, (m as any).name, (m as any).original_title, (m as any).original_name, m.overview]
    .filter(Boolean)
    .join(" ");
  return isAdultText(fields);
};

export const filterAdult = <T extends Movie>(items: T[], showAdult: boolean): T[] => {
  if (showAdult) return items;
  return items.filter((m) => !isPureAdult(m as any));
};
