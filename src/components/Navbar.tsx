import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Menu, X, Film } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { FEATURED_GENRES } from "@/lib/tmdb";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { setShowAdult } from "@/lib/adultFilter";
import { useShowAdult } from "@/hooks/use-show-adult";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const showAdult = useShowAdult();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setShowSearch(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-background/95 to-background/0 backdrop-blur-sm">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 text-primary font-bold text-2xl tracking-tight">
            <Film className="h-7 w-7" />
            FreeFlicks
          </Link>

          <div className="hidden md:flex items-center gap-4">
            {FEATURED_GENRES.slice(0, 5).map((genre) => (
              <Link
                key={genre.id}
                to={`/genre/${genre.id}/${genre.name.toLowerCase()}`}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {genre.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {showSearch ? (
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <Input
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search movies..."
                className="w-48 md:w-64 h-9 bg-secondary border-muted"
              />
              <Button type="button" variant="ghost" size="icon" onClick={() => setShowSearch(false)}>
                <X className="h-5 w-5" />
              </Button>
            </form>
          ) : (
            <Button variant="ghost" size="icon" onClick={() => setShowSearch(true)}>
              <Search className="h-5 w-5" />
            </Button>
          )}

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-background border-border w-64">
              <SheetTitle className="text-foreground">Menu</SheetTitle>
              <div className="flex flex-col gap-3 mt-6">
                {FEATURED_GENRES.map((genre) => (
                  <Link
                    key={genre.id}
                    to={`/genre/${genre.id}/${genre.name.toLowerCase()}`}
                    className="text-muted-foreground hover:text-foreground transition-colors py-1"
                  >
                    {genre.name}
                  </Link>
                ))}
                <div className="mt-6 pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">Adult Content</p>
                      <p className="text-xs text-muted-foreground">Show 18+ titles</p>
                    </div>
                    <Switch
                      checked={showAdult}
                      onCheckedChange={(v) => setShowAdult(v)}
                    />
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
