import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../api";
import HeroCarousel from "../components/HeroCarousel";
import { Clock } from "lucide-react";

export default function Homepage() {
  const [movies, setMovies] = useState([]);
  const [activeTab, setActiveTab] = useState("NOW SHOWING");
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const searchFilter = searchParams.get("search") || "";

  // Tabs from Wireframe Page 4
  const tabs = [
    "NOW SHOWING",
    "COMING SOON",
    "BUY TICKETS",
    "SHOW TIME",
    "VIEW ALL",
  ];

  useEffect(() => {
    let isMounted = true;
    const fetchMovies = async () => {
      setLoading(true);
      try {
        let url = "/api/movies/";
        if (activeTab === "NOW SHOWING") {
          url += "?status=NOW_SHOWING";
        } else if (activeTab === "COMING_SOON") {
          url += "?status=COMING_SOON";
        }
        const res = await api.get(url);
        if (isMounted) {
          setMovies(res.data);
        }
      } catch (err) {
        console.error("Error fetching movies:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchMovies();
    return () => {
      isMounted = false;
    };
  }, [activeTab]);

  // Fallback sample movies if database is empty so UI displays beautifully as in Wireframe Page 4
  const displayMovies =
    movies.length > 0
      ? movies.filter((m) =>
          searchFilter ? m.title.toLowerCase().includes(searchFilter.toLowerCase()) : true
        )
      : [
          {
            id: 1,
            title: "Spider-Man: Brand New Day",
            category: "2D",
            poster_url:
              "https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=600&auto=format&fit=crop",
            status: "NOW_SHOWING",
            duration_minutes: 180,
          },
          {
            id: 2,
            title: "The Odyssey",
            category: "IMAX",
            poster_url:
              "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600&auto=format&fit=crop",
            status: "NOW_SHOWING",
            duration_minutes: 165,
          },
          {
            id: 3,
            title: "Minions & Monsters",
            category: "3D",
            poster_url:
              "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=600&auto=format&fit=crop",
            status: "NOW_SHOWING",
            duration_minutes: 110,
          },
          {
            id: 4,
            title: "Voyage Beyond",
            category: "2D",
            poster_url:
              "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop",
            status: "COMING_SOON",
            duration_minutes: 140,
          },
        ];

  return (
    <div className="bg-[#0B0E1E] text-white min-h-screen">
      {/* Hero Carousel (Wireframe Page 2) */}
      <HeroCarousel movies={movies} />

      {/* Catalog Section (Wireframe Page 4) */}
      <section id="catalog-section" className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        {/* Navigation Tabs Bar */}
        <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-4 overflow-x-auto gap-4 scrollbar-none">
          <div className="flex items-center gap-6 md:gap-10">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-xs md:text-sm tracking-[0.2em] font-serif uppercase transition pb-2 whitespace-nowrap ${
                  activeTab === tab
                    ? "text-[#D4AF37] font-bold border-b-2 border-[#D4AF37] drop-shadow-[0_2px_8px_rgba(212,175,55,0.4)]"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {searchFilter && (
            <span className="text-xs text-[#D4AF37]">
              Filtering for: "{searchFilter}"
            </span>
          )}
        </div>

        {/* Movie Poster Grid (Wireframe Page 4) */}
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="w-10 h-10 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 md:gap-8 mt-10">
            {displayMovies.map((movie) => (
              <div
                key={movie.id}
                className="group relative flex flex-col rounded-xl overflow-hidden bg-[#12162A] border border-[#D4AF37]/20 hover:border-[#D4AF37] transition duration-300 shadow-xl"
              >
                {/* Poster Image */}
                <div className="relative aspect-2/3 overflow-hidden bg-black/60">
                  <img
                    src={movie.poster_url || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=600&auto=format&fit=crop"}
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {movie.category && (
                    <span className="absolute top-2 right-2 bg-black/80 backdrop-blur-xs text-[#D4AF37] border border-[#D4AF37]/40 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      {movie.category}
                    </span>
                  )}
                </div>

                {/* Title & Get Tickets Button */}
                <div className="p-4 flex flex-col justify-between flex-grow">
                  <div>
                    <h3 className="font-serif font-bold text-sm md:text-base text-gray-100 group-hover:text-[#D4AF37] transition line-clamp-1">
                      {movie.title}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#D4AF37]" />
                      {movie.duration_minutes ? `${movie.duration_minutes} mins` : "Now Showing"}
                    </p>
                  </div>

                  <Link
                    to={`/movie/${movie.id}`}
                    className="mt-4 block w-full text-center bg-[#D4AF37] hover:bg-[#F3E5AB] text-gray-950 font-bold text-xs tracking-wider uppercase py-2.5 rounded-lg shadow-md transition"
                  >
                    GET TICKETS
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
