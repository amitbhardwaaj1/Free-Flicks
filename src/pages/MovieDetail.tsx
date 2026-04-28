import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getMovieDetails, getTVDetails, getImageUrl, getBackdropUrl } from "@/lib/tmdb";
import { Star, Clock, Calendar } from "lucide-react";
import MovieRow from "@/components/MovieRow";
import { Skeleton } from "@/components/ui/skeleton";

const MovieDetail = ({ mediaType = "movie" }: { mediaType?: "movie" | "tv" }) => {
  const { id } = useParams<{ id: string }>();

  const { data: movie, isLoading } = useQuery({
    queryKey: [mediaType, id],
    queryFn: () => (mediaType === "tv" ? getTVDetails(Number(id)) : getMovieDetails(Number(id))),
    enabled: !!id,
  });

  if (isLoading || !movie) {
    return (
      <div className="min-h-screen pt-16">
        <Skeleton className="h-[60vh] w-full" />
        <div className="container mx-auto px-4 py-8 space-y-4">
          <Skeleton className="h-10 w-96" />
          <Skeleton className="h-6 w-64" />
          <Skeleton className="h-24 w-full max-w-2xl" />
        </div>
      </div>
    );
  }

  const backdrop = getBackdropUrl(movie.backdrop_path);
  const year = movie.release_date?.split("-")[0];
  const hours = movie.runtime ? Math.floor(movie.runtime / 60) : 0;
  const mins = movie.runtime ? movie.runtime % 60 : 0;

  // Find YouTube trailer or full movie
  const youtubeVideo = movie.videos?.results?.find(
    (v) => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Clip")
  ) || movie.videos?.results?.[0];

  const searchQuery = encodeURIComponent(`${movie.title} ${year} full movie`);

  return (
    <main className="min-h-screen">
      {/* Backdrop */}
      <section className="relative h-[50vh] md:h-[65vh] w-full overflow-hidden">
        {backdrop && (
          <img src={backdrop} alt={movie.title} className="absolute inset-0 w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
      </section>

      <div className="container mx-auto px-4 -mt-40 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="flex-shrink-0 w-48 md:w-64 mx-auto md:mx-0">
            <img
              src={getImageUrl(movie.poster_path, "w500")}
              alt={movie.title}
              className="w-full rounded-lg shadow-2xl"
            />
          </div>

          {/* Info */}
          <div className="flex-1 space-y-4">
            <h1 className="text-3xl md:text-5xl font-bold">{movie.title}</h1>
            {movie.tagline && (
              <p className="text-muted-foreground italic">"{movie.tagline}"</p>
            )}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                {movie.vote_average.toFixed(1)}
              </span>
              {year && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {year}
                </span>
              )}
              {movie.runtime > 0 && (
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {hours}h {mins}m
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {movie.genres?.map((g) => (
                <span key={g.id} className="px-3 py-1 rounded-full bg-secondary text-xs font-medium">
                  {g.name}
                </span>
              ))}
            </div>
            <p className="text-muted-foreground leading-relaxed max-w-2xl">{movie.overview}</p>
          </div>
        </div>

        {/* YouTube Player */}
        <section className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">▶ Watch on YouTube</h2>
          {youtubeVideo ? (
            <div className="aspect-video w-full max-w-4xl rounded-lg overflow-hidden bg-secondary">
              <iframe
                src={`https://www.youtube.com/embed/${youtubeVideo.key}`}
                title={youtubeVideo.name}
                className="w-full h-full"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
          ) : (
            <div className="aspect-video w-full max-w-4xl rounded-lg overflow-hidden bg-secondary">
              <iframe
                src={`https://www.youtube.com/embed?listType=search&list=${searchQuery}`}
                title={`Search: ${movie.title}`}
                className="w-full h-full"
                allowFullScreen
              />
            </div>
          )}
          <a
            href={`https://www.youtube.com/results?search_query=${searchQuery}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-3 text-sm text-primary hover:underline"
          >
            Search on YouTube →
          </a>
        </section>

        {/* Cast */}
        {movie.credits?.cast && movie.credits.cast.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-semibold mb-4">Cast</h2>
            <div className="flex gap-4 overflow-x-auto pb-4" style={{ scrollbarWidth: "none" }}>
              {movie.credits.cast.slice(0, 12).map((person) => (
                <div key={person.id} className="flex-shrink-0 w-24 text-center">
                  <img
                    src={getImageUrl(person.profile_path, "w185")}
                    alt={person.name}
                    className="w-20 h-20 rounded-full object-cover mx-auto bg-secondary"
                    loading="lazy"
                  />
                  <p className="text-xs font-medium mt-2 truncate">{person.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{person.character}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Similar Movies */}
        {movie.similar?.results && movie.similar.results.length > 0 && (
          <div className="mt-8 pb-12">
            <MovieRow title="Similar Movies" movies={movie.similar.results} />
          </div>
        )}
      </div>
    </main>
  );
};

export default MovieDetail;
