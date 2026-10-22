import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function HeroCarousel({ movies = [] }) {
  // Default slides if backend has no backdrop yet
  const defaultSlides = [
    {
      id: "odyssey",
      title: "THE ODYSSEY",
      director: "A FILM BY CHRISTOPHER NOLAN",
      tagline: "SHOT ENTIRELY WITH IMAX FILM CAMERAS",
      date: "07.17.26",
      backdrop:
        "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1600&auto=format&fit=crop",
    },
    {
      id: "spiderman",
      title: "SPIDER-MAN: BRAND NEW DAY",
      director: "MARVEL STUDIOS",
      tagline: "EXPERIENCE IT IN IMAX 2D & 3D",
      date: "07.30.26",
      backdrop:
        "https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=1600&auto=format&fit=crop",
    },
  ];

  // Combine with real movies if they have backdrops
  const realSlides = movies
    .filter((m) => m.backdrop_url)
    .map((m) => ({
      id: m.id,
      title: m.title.toUpperCase(),
      director: m.actors ? `STARRING ${m.actors.slice(0, 40)}...` : "NOW SHOWING",
      tagline: `${m.category} FORMAT • ${m.duration_minutes} MINS`,
      date: m.release_date,
      backdrop: m.backdrop_url,
      movieId: m.id,
    }));

  const slides = realSlides.length > 0 ? realSlides : defaultSlides;
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const current = slides[currentIndex] || defaultSlides[0];

  return (
    <div className="relative w-full h-[60vh] md:h-[75vh] max-h-[700px] overflow-hidden bg-black select-none">
      {/* Background Image with Cinematic Vignette Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 transform scale-105"
        style={{ backgroundImage: `url(${current.backdrop})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E1E] via-[#0B0E1E]/40 to-transparent" />
        <div className="absolute inset-0 bg-radial from-transparent via-[#0B0E1E]/30 to-[#0B0E1E]" />
      </div>

      {/* Hero Typography Matching Wireframe Page 2 */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto">
        <p className="text-xs md:text-sm tracking-[0.3em] font-semibold text-[#D4AF37] uppercase drop-shadow">
          {current.director}
        </p>

        <h1 className="text-3xl md:text-6xl font-extrabold tracking-[0.2em] text-[#D4AF37] my-3 drop-shadow-[0_4px_20px_rgba(212,175,55,0.4)] font-serif">
          {current.title}
        </h1>

        <p className="text-xl md:text-2xl font-bold tracking-[0.25em] text-[#E5C158] mb-2 font-mono">
          {current.date}
        </p>

        <p className="text-xs md:text-sm tracking-[0.2em] text-gray-300 uppercase font-light">
          {current.tagline}
        </p>

        {current.movieId && (
          <Link
            to={`/movie/${current.movieId}`}
            className="mt-6 inline-block bg-[#D4AF37] hover:bg-[#F3E5AB] text-gray-950 font-bold px-8 py-2.5 rounded-full text-xs tracking-widest uppercase transition shadow-[0_0_20px_rgba(212,175,55,0.4)]"
          >
            GET TICKETS
          </Link>
        )}
      </div>

      {/* Dashed Progress Indicators (Page 2 Bottom Slider) */}
      <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center items-center gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-1 rounded-full transition-all duration-300 ${
              idx === currentIndex
                ? "w-10 bg-[#D4AF37]"
                : "w-5 bg-gray-600/70 hover:bg-gray-400"
            }`}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
