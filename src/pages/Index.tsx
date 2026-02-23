import { useQuery } from "@tanstack/react-query";
import { getTrending, getPopular, getTopRated, getUpcoming, getMoviesByGenre, FEATURED_GENRES } from "@/lib/tmdb";
import HeroBanner from "@/components/HeroBanner";
import MovieRow from "@/components/MovieRow";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const { data: trending } = useQuery({
    queryKey: ["trending"],
    queryFn: () => getTrending(),
  });

  const { data: popular } = useQuery({
    queryKey: ["popular"],
    queryFn: () => getPopular(),
  });

  const { data: topRated } = useQuery({
    queryKey: ["topRated"],
    queryFn: () => getTopRated(),
  });

  const { data: upcoming } = useQuery({
    queryKey: ["upcoming"],
    queryFn: () => getUpcoming(),
  });

  const { data: action } = useQuery({
    queryKey: ["genre", 28],
    queryFn: () => getMoviesByGenre(28),
  });

  const { data: comedy } = useQuery({
    queryKey: ["genre", 35],
    queryFn: () => getMoviesByGenre(35),
  });

  const { data: horror } = useQuery({
    queryKey: ["genre", 27],
    queryFn: () => getMoviesByGenre(27),
  });

  const { data: scifi } = useQuery({
    queryKey: ["genre", 878],
    queryFn: () => getMoviesByGenre(878),
  });

  const heroMovie = trending?.results?.[0];

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
        <MovieRow title="🔥 Trending This Week" movies={trending?.results || []} />
        <MovieRow title="⭐ Top Rated" movies={topRated?.results || []} />
        <MovieRow title="🎬 Popular Now" movies={popular?.results || []} />
        <MovieRow title="🆕 Upcoming" movies={upcoming?.results || []} />
        <MovieRow title="💥 Action" movies={action?.results || []} />
        <MovieRow title="😂 Comedy" movies={comedy?.results || []} />
        <MovieRow title="👻 Horror" movies={horror?.results || []} />
        <MovieRow title="🚀 Sci-Fi" movies={scifi?.results || []} />
      </div>
    </main>
  );
};

export default Index;
