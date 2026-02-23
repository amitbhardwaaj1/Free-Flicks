
# 🎬 FreeFlicks — Free YouTube Movies Hub

A Netflix-style dark-themed movie browsing site that curates and plays movies freely available on YouTube.

## Data Source
- Use the **TMDB (The Movie Database) API** to fetch movie info (posters, descriptions, ratings, cast, genres)
- TMDB API key is free and publishable — no backend needed
- YouTube video embeds for watching movies directly on the site

## Pages & Features

### 1. Home Page
- **Hero banner** with a featured/trending movie and "Watch Now" button
- **Category rows** (Netflix-style horizontal scrolling): Trending, Top Rated, Action, Comedy, Drama, Horror, Bollywood, etc.
- Movie cards with poster, title, and rating on hover
- Dark background with red accent colors

### 2. Movie Detail Page
- Large backdrop image with movie info overlay
- Title, year, rating, runtime, genres, overview
- Cast list with photos
- **Embedded YouTube player** — searches for the full movie on YouTube and embeds it
- "Similar Movies" recommendations section

### 3. Search & Browse
- Search bar in the top navigation
- Filter by genre, year, language, and rating
- Grid view of results with movie cards

### 4. Genre Pages
- Dedicated pages for each genre (Action, Comedy, Drama, etc.)
- Infinite scroll or pagination

### Navigation
- Top navbar with logo, search bar, and genre links
- Sticky header with dark background
- Mobile-responsive hamburger menu

## Design
- **Dark theme** with near-black background (#141414)
- Red primary accent color (similar to Netflix)
- Smooth hover effects on movie cards (scale up, show details)
- Responsive grid layout that adapts from mobile to desktop
- Movie cards with rounded corners and subtle shadows

## Technical Approach
- Frontend-only React app (no backend needed)
- TMDB API for all movie data (free, public API key)
- YouTube iframe embeds for video playback
- React Router for navigation
- TanStack Query for data fetching and caching
- Fully responsive design with Tailwind CSS
