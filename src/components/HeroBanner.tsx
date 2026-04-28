import { Link } from "react-router-dom";
import { Play, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Movie, getBackdropUrl } from "@/lib/tmdb";

interface HeroBannerProps {
  movie: Movie;
}

const HeroBanner = ({ movie }: HeroBannerProps) => {
  const backdrop = getBackdropUrl(movie.backdrop_path);
  const detailPath = movie.media_type === "tv" ? `/tv/${movie.id}` : `/movie/${movie.id}`;

  return (
    <section className="relative h-[70vh] md:h-[85vh] w-full overflow-hidden">
      {backdrop && (
        <img
          src={backdrop}
          alt={movie.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />

      <div className="relative z-10 container mx-auto h-full flex flex-col justify-end pb-20 px-4">
        <h1 className="text-4xl md:text-6xl font-bold max-w-2xl mb-3 drop-shadow-lg">
          {movie.title}
        </h1>
        <p className="text-sm md:text-base text-muted-foreground max-w-xl mb-6 line-clamp-3">
          {movie.overview}
        </p>
        <div className="flex gap-3">
          <Button asChild size="lg" className="gap-2 font-semibold">
            <Link to={`${detailPath}`}>
              <Play className="h-5 w-5 fill-current" />
              Watch Now
            </Link>
          </Button>
          <Button asChild variant="secondary" size="lg" className="gap-2">
            <Link to={`${detailPath}`}>
              <Info className="h-5 w-5" />
              More Info
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
