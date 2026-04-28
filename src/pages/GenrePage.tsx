import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getMoviesByGenre } from "@/lib/tmdb";
import MovieCard from "@/components/MovieCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { filterAdult } from "@/lib/adultFilter";
import { useShowAdult } from "@/hooks/use-show-adult";

const GenrePage = () => {
  const { id, name } = useParams<{ id: string; name: string }>();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["genre", id, page],
    queryFn: () => getMoviesByGenre(Number(id), page),
    enabled: !!id,
  });

  const genreName = name ? name.charAt(0).toUpperCase() + name.slice(1) : "Genre";

  return (
    <main className="min-h-screen pt-20 container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-6">{genreName} Movies</h1>

      {isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 18 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[2/3] rounded-md" />
          ))}
        </div>
      )}

      {data?.results && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {data.results.map((movie: any) => (
              <div key={movie.id} className="w-full">
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-4 py-8">
            <Button
              variant="secondary"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="flex items-center text-muted-foreground">Page {page}</span>
            <Button
              variant="secondary"
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= (data.total_pages || 1)}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </main>
  );
};

export default GenrePage;
