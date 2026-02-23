import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { Movie, getImageUrl } from "@/lib/tmdb";

interface MovieCardProps {
  movie: Movie;
}

const MovieCard = ({ movie }: MovieCardProps) => {
  return (
    <Link
      to={`/movie/${movie.id}`}
      className="group relative flex-shrink-0 w-[140px] md:w-[180px] transition-transform duration-300 hover:scale-105 hover:z-10"
    >
      <div className="relative aspect-[2/3] rounded-md overflow-hidden bg-secondary">
        <img
          src={getImageUrl(movie.poster_path)}
          alt={movie.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <p className="text-xs font-semibold truncate">{movie.title}</p>
          <div className="flex items-center gap-1 mt-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs text-muted-foreground">
              {movie.vote_average.toFixed(1)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
