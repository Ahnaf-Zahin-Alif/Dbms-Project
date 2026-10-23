import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function HeroCarousel({ movies = [] }) {
  // Curated hero slides matching Wireframe Page 2 perfectly
  const slides = [
    {
      id: "odyssey",
      movieTitle: "The Odyssey",
      director: "A FILM BY CHRISTOPHER NOLAN",
      title: "THE ODYSSEY",
      date: "07.17.26",
      tagline: (
        <>
          SHOT ENTIRELY WITH <span className="font-bold text-white tracking-widest">IMAX</span> FILM CAMERAS
        </>
      ),
      backdrop: "/images/the-odyssey-card.png",
      titleColor: "odyssey-title",
      movieId: movies.find((m) => m.title.toLowerCase().includes("odyssey"))?.id || 2,
      hasBurnedInText: true, // Prevents duplicate text over the original wireframe graphic
    },
    {
      id: "clayface",
      movieTitle: "Clayface",
      director: "DC STUDIOS PRESENTS",
      title: "CLAYFACE",
      date: "10.30.26",
      tagline: (
        <>
          EXPERIENCE THE TERROR IN <span className="font-bold text-white tracking-widest">IMAX</span>
        </>
      ),
      backdrop:
        "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop",
      titleColor: "gold-glitter-text",
      movieId: movies.find((m) => m.title.toLowerCase().includes("clayface"))?.id || 4,
      hasBurnedInText: false,
    },
    {
      id: "supergirl",
      movieTitle: "Supergirl",
      director: "DC STUDIOS & WARNER BROS.",
      title: "SUPERGIRL",
      date: "06.26.26",
      tagline: (
        <>
          WOMAN OF TOMORROW &bull; IN <span className="font-bold text-white tracking-widest">IMAX 3D</span>
        </>
      ),
      backdrop:
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format&fit=crop",
      titleColor: "text-amber-200",
      movieId: movies.find((m) => m.title.toLowerCase().includes("supergirl"))?.id || 5,
      hasBurnedInText: false,
    },
    {
      id: "spiderman",
      movieTitle: "Spider-Man: Brand New Day (2D)",
      director: "MARVEL STUDIOS & SONY PICTURES",
      title: "SPIDER-MAN",
      date: "07.30.26",
      tagline: (
        <>
          EXPERIENCE IT IN <span className="font-bold text-white tracking-widest">IMAX 2D & 3D</span>
        </>
      ),
      backdrop:
        "https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=1600&auto=format&fit=crop",
      titleColor: "text-red-500",
      movieId: movies.find((m) => m.title.toLowerCase().includes("spider"))?.id || 1,
      hasBurnedInText: false,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-advance slides every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const current = slides[currentIndex];

  // We show 11 indicator slots to match Wireframe Page 2 exactly
  const totalIndicators = 11;

  return (
    <div className="relative w-full h-[62vh] sm:h-[70vh] md:h-[76vh] lg:h-[80vh] min-h-[460px] max-h-[820px] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border border-blue-900/40 group bg-black select-none">
      {/* Background Backdrop with Cover and Center alignment */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-out transform group-hover:scale-105"
        style={{ backgroundImage: `url(${current.backdrop})` }}
      >
        {/* Cinematic Vignette Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-black/50" />
      </div>

      {/* Cinematic Typography Overlay (shown if not already burned into the card) */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 md:px-8 max-w-4xl mx-auto">
        {!current.hasBurnedInText ? (
          <>
            {/* Director / Studio Line */}
            <p className="text-[11px] sm:text-xs md:text-sm tracking-[0.3em] font-medium text-[#C89B48] uppercase drop-shadow-md mb-2">
              {current.director}
            </p>

            {/* Hero Title */}
            <h1
              className={`text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-cinzel font-black tracking-[0.22em] my-1 drop-shadow-[0_4px_25px_rgba(0,0,0,0.9)] ${current.titleColor}`}
            >
              {current.title}
            </h1>

            {/* Date */}
            <p className="text-xl sm:text-2xl md:text-3xl font-cinzel font-bold tracking-[0.25em] text-[#C86D49] my-2 drop-shadow-md">
              {current.date}
            </p>

            {/* Tagline / Format */}
            <p className="text-[10px] sm:text-xs md:text-sm tracking-[0.2em] text-[#E0D0B5] uppercase font-medium drop-shadow">
              {current.tagline}
            </p>
          </>
        ) : null}

        {/* Quick Ticket Action */}
        {current.movieId && (
          <Link
            to={`/movie/${current.movieId}`}
            className={`inline-flex items-center gap-2 bg-[#D4AF37] hover:bg-[#F3E5AB] text-gray-950 font-bold px-7 py-2.5 rounded-full text-xs tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:scale-105 ${
              current.hasBurnedInText ? "mt-40 sm:mt-48 md:mt-56" : "mt-6"
            }`}
          >
            GET TICKETS
          </Link>
        )}
      </div>

      {/* Wireframe Page 2 Bottom Slider Dashes Indicator (~11 dashes) */}
      <div className="absolute bottom-5 left-0 right-0 z-20 flex justify-center items-center gap-1.5 sm:gap-2">
        {Array.from({ length: totalIndicators }).map((_, idx) => {
          // Map index to slide index
          const isActive = idx === currentIndex;
          return (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx % slides.length)}
              className={`transition-all duration-300 cursor-pointer ${
                isActive
                  ? "w-8 sm:w-11 h-2 sm:h-2.5 rounded-xs border-2 border-[#D4AF37] bg-[#755025]/70 shadow-[0_0_8px_rgba(212,175,55,0.5)]"
                  : "w-4 sm:w-6 h-1 rounded-full bg-[#B38D40]/50 hover:bg-[#D4AF37]"
              }`}
              title={`Slide ${(idx % slides.length) + 1}`}
              aria-label={`Go to slide ${(idx % slides.length) + 1}`}
            />
          );
        })}
      </div>
    </div>
  );
}
