import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { searchMovies } from "@/lib/tmdb";
import MovieCard from "@/components/MovieCard";
import { Skeleton } from "@/components/ui/skeleton";
import { filterAdult } from "@/lib/adultFilter";
import { useShowAdult } from "@/hooks/use-show-adult";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const showAdult = useShowAdult();

  const { data, isLoading } = useQuery({
    queryKey: ["search", query],
    queryFn: () => searchMovies(query),
    enabled: !!query,
  });

  const results = filterAdult((data?.results || []) as any, showAdult);

  return (
    <main className="min-h-screen pt-20 container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-6">
        {query ? `Results for "${query}"` : "Search Movies"}
      </h1>

      {isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[2/3] rounded-md" />
          ))}
        </div>
      )}

      {data?.results && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {data.results.map((movie: any) => (
            <div key={movie.id} className="w-full">
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      )}

      {data?.results?.length === 0 && (
        <p className="text-muted-foreground text-center py-20">No movies found for "{query}"</p>
      )}
    </main>
  );
};

export default SearchPage;
