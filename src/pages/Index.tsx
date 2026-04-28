import { useQuery } from "@tanstack/react-query";
import { getTrending, getPopular, getTopRated, getUpcoming, getMoviesByGenre, getIndianWebSeries, getPopularTV } from "@/lib/tmdb";
import HeroBanner from "@/components/HeroBanner";
import MovieRow from "@/components/MovieRow";
import { Skeleton } from "@/components/ui/skeleton";
import { filterAdult } from "@/lib/adultFilter";
import { useShowAdult } from "@/hooks/use-show-adult";

const Index = () => {
  const showAdult = useShowAdult();
  const f = <T extends any>(arr: T[] | undefined) => filterAdult((arr || []) as any, showAdult);
  const { data: trending } = useQuery({ queryKey: ["trending"], queryFn: () => getTrending() });
  const { data: popular } = useQuery({ queryKey: ["popular"], queryFn: () => getPopular() });
  const { data: topRated } = useQuery({ queryKey: ["topRated"], queryFn: () => getTopRated() });
  const { data: upcoming } = useQuery({ queryKey: ["upcoming"], queryFn: () => getUpcoming() });
  const { data: indianWeb } = useQuery({ queryKey: ["indianWeb"], queryFn: () => getIndianWebSeries() });
  const { data: globalWeb } = useQuery({ queryKey: ["globalWeb"], queryFn: () => getPopularTV() });
  const { data: action } = useQuery({ queryKey: ["genre", 28], queryFn: () => getMoviesByGenre(28) });
  const { data: comedy } = useQuery({ queryKey: ["genre", 35], queryFn: () => getMoviesByGenre(35) });
  const { data: drama } = useQuery({ queryKey: ["genre", 18], queryFn: () => getMoviesByGenre(18) });
  const { data: romance } = useQuery({ queryKey: ["genre", 10749], queryFn: () => getMoviesByGenre(10749) });

  const heroCandidates = filterAdult((trending?.results || []) as any, showAdult);
  const heroMovie = heroCandidates[0];

  if (!heroMovie) {
    return (
      <div className="min-h-screen pt-16">
        <Skeleton className="h-[85vh] w-full" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="py-4 px-4">
            <Skeleton className="h-6 w-40 mb-3" />
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5, 6].map((j) => (
                <Skeleton key={j} className="w-[180px] aspect-[2/3] rounded-md flex-shrink-0" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      <HeroBanner movie={heroMovie} />
      <div className="-mt-20 relative z-10">
        <MovieRow title="🔥 Trending in India" movies={trending?.results || []} />
        <MovieRow title="🇮🇳 Popular Indian Movies" movies={popular?.results || []} />
        <MovieRow title="📺 Indian Web Series" movies={indianWeb?.results || []} />
        <MovieRow title="⭐ Top Rated (India)" movies={topRated?.results || []} />
        <MovieRow title="🆕 Upcoming Indian Releases" movies={upcoming?.results || []} />
        <MovieRow title="🌏 Popular Web Series" movies={globalWeb?.results || []} />
        <MovieRow title="💥 Action" movies={action?.results || []} />
        <MovieRow title="😂 Comedy" movies={comedy?.results || []} />
        <MovieRow title="🎭 Drama" movies={drama?.results || []} />
        <MovieRow title="❤️ Romance" movies={romance?.results || []} />
      </div>
    </main>
  );
};

export default Index;
