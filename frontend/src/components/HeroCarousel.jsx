import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function HeroCarousel({ movies = [] }) {
  // Curated hero slides including the 4 user-uploaded movies + featured titles
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
      backdrop: "/images/slide-odyssey.jpg",
      poster: "/images/poster4-odyssey.png",
      titleColor: "odyssey-title",
      movieId: movies.find((m) => m.title.toLowerCase().includes("odyssey"))?.id || 2,
    },
    {
      id: "minions",
      movieTitle: "Minions & Monsters",
      director: "ILLUMINATION ENTERTAINMENT",
      title: "MINIONS & MONSTERS",
      date: "NOW SHOWING",
      tagline: (
        <>
          EXPERIENCE THE HILARIOUS ADVENTURE IN <span className="font-bold text-white tracking-widest">3D</span>
        </>
      ),
      backdrop: "/images/slide-minions.jpg",
      poster: "/images/poster1-minions.png",
      titleColor: "text-yellow-400 drop-shadow-[0_4px_25px_rgba(250,204,21,0.5)]",
      movieId: movies.find((m) => m.title.toLowerCase().includes("minion"))?.id || 3,
    },
    {
      id: "moana",
      movieTitle: "Moana 2",
      director: "WALT DISNEY ANIMATION STUDIOS",
      title: "MOANA 2",
      date: "NOW SHOWING",
      tagline: (
        <>
          THE OCEAN IS CALLING &bull; IN <span className="font-bold text-white tracking-widest">DISNEY DIGITAL 3D</span>
        </>
      ),
      backdrop: "/images/slide-moana.jpg",
      poster: "/images/poster2-moana.png",
      titleColor: "text-cyan-300 drop-shadow-[0_4px_25px_rgba(103,232,249,0.5)]",
      movieId: movies.find((m) => m.title.toLowerCase().includes("moana"))?.id || 6,
    },
    {
      id: "spiderman",
      movieTitle: "Spider-Man: No Way Home",
      director: "MARVEL STUDIOS & SONY PICTURES",
      title: "SPIDER-MAN: NO WAY HOME",
      date: "NOW SHOWING",
      tagline: (
        <>
          EXPERIENCE IT IN <span className="font-bold text-white tracking-widest">IMAX 2D & 3D</span>
        </>
      ),
      backdrop: "/images/slide-spiderman.jpg",
      poster: "/images/poster3-spiderman.png",
      titleColor: "text-red-500 drop-shadow-[0_4px_25px_rgba(239,68,68,0.5)]",
      movieId: movies.find((m) => m.title.toLowerCase().includes("spider"))?.id || 1,
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
      poster:
        "https://images.unsplash.com/photo-1509281373149-e957c6296406?q=80&w=800&auto=format&fit=crop",
      titleColor: "gold-glitter-text",
      movieId: movies.find((m) => m.title.toLowerCase().includes("clayface"))?.id || 4,
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
      backdrop: "/images/slide-supergirl.jpg",
      poster: "/images/poster-supergirl.png",
      titleColor: "text-amber-200 drop-shadow-[0_4px_25px_rgba(253,230,138,0.5)]",
      movieId: movies.find((m) => m.title.toLowerCase().includes("supergirl"))?.id || 5,
    },
    {
      id: "bonolota",
      movieTitle: "Bonolota Express",
      director: "A CHARKHI ORIGINAL FILM",
      title: "BONOLOTA EXPRESS",
      date: "NOW SHOWING",
      tagline: (
        <>
          JOURNEY OF SECRETS &bull; IN <span className="font-bold text-white tracking-widest">THEATRES NOW</span>
        </>
      ),
      backdrop: "/images/slide-bonolota-express.jpg",
      poster: "/images/poster-bonolota-express.png",
      titleColor: "text-amber-400 drop-shadow-[0_4px_25px_rgba(251,191,36,0.6)]",
      movieId: movies.find((m) => m.title.toLowerCase().includes("bonolota"))?.id || 9,
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

  return (
    <div className="relative w-full h-[62vh] sm:h-[70vh] md:h-[76vh] lg:h-[80vh] min-h-[460px] max-h-[820px] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border border-blue-900/40 group bg-black select-none">
      {/* Background Backdrop with Cover and Center alignment */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-out transform group-hover:scale-105"
        style={{ backgroundImage: `url(${current.backdrop})` }}
      >
        {/* Subtle Cinematic Vignette Overlays preserving full-span image visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/25 to-transparent" />
      </div>

      {/* Cinematic Slide Content: Full-span Typography & Action */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-6 sm:px-10 md:px-14 flex items-center">
        {/* Typography & Action Container */}
        <div className="flex flex-col items-start text-left max-w-2xl py-8 drop-shadow-2xl">
          {/* Director / Studio Line */}
          <p className="text-[11px] sm:text-xs md:text-sm tracking-[0.3em] font-medium text-[#C89B48] uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] mb-2">
            {current.director}
          </p>

          {/* Hero Title */}
          <h1
            className={`text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-cinzel font-black tracking-[0.18em] my-1 drop-shadow-[0_4px_25px_rgba(0,0,0,0.95)] ${current.titleColor}`}
          >
            {current.title}
          </h1>

          {/* Date / Status */}
          <p className="text-xl sm:text-2xl md:text-3xl font-cinzel font-bold tracking-[0.25em] text-[#C86D49] my-2 drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
            {current.date}
          </p>

          {/* Tagline / Format */}
          <p className="text-[11px] sm:text-xs md:text-sm tracking-[0.2em] text-[#E0D0B5] uppercase font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] mb-6">
            {current.tagline}
          </p>

          {/* Quick Ticket Action */}
          {current.movieId && (
            <Link
              to={`/movie/${current.movieId}`}
              className="inline-flex items-center gap-2 bg-[#D4AF37] hover:bg-[#F3E5AB] text-gray-950 font-bold px-8 py-3 rounded-full text-xs tracking-widest uppercase transition-all shadow-[0_0_25px_rgba(212,175,55,0.45)] hover:scale-105 cursor-pointer"
            >
              GET TICKETS
            </Link>
          )}
        </div>
      </div>

      {/* Wireframe Page 2 Bottom Slider Dashes Indicator */}
      <div className="absolute bottom-5 left-0 right-0 z-20 flex justify-center items-center gap-2">
        {slides.map((_, idx) => {
          const isActive = idx === currentIndex;
          return (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`transition-all duration-300 cursor-pointer ${
                isActive
                  ? "w-8 sm:w-12 h-2 sm:h-2.5 rounded-xs border-2 border-[#D4AF37] bg-[#755025]/80 shadow-[0_0_10px_rgba(212,175,55,0.6)]"
                  : "w-4 sm:w-6 h-1 rounded-full bg-[#B38D40]/50 hover:bg-[#D4AF37]"
              }`}
              title={`Slide ${idx + 1}: ${slides[idx].movieTitle}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          );
        })}
      </div>
    </div>
  );
}
