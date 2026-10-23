import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../api";
import HeroCarousel from "../components/HeroCarousel";
import NavModals from "../components/NavModals";
import { useTheatre } from "../context/TheatreContext";
import { Clock, MapPin } from "lucide-react";

export default function Homepage() {
  const [movies, setMovies] = useState([]);
  const [activeTab, setActiveTab] = useState("NOW SHOWING");
  const [loading, setLoading] = useState(true);
  const [modalType, setModalType] = useState(null); // 'TICKET_PRICE', 'ABOUT_US', 'CONTACT'
  const [sidebarOpen, setSidebarOpen] = useState(true); // desktop default open

  const [searchParams] = useSearchParams();
  const searchFilter = searchParams.get("search") || "";
  const { selectedTheatre, openTheatreModal } = useTheatre();

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
        } else if (activeTab === "COMING SOON") {
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

  // Fallback movies including Clayface and Supergirl if API is loading or offline
  const fallbackMovies = [
    {
      id: 2,
      title: "The Odyssey",
      category: "IMAX",
      poster_url:
        "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop",
      backdrop_url: "/images/the-odyssey-card.png",
      status: "NOW_SHOWING",
      duration_minutes: 165,
      genre: "Epic / Adventure / Drama",
    },
    {
      id: 4,
      title: "Clayface",
      category: "IMAX",
      poster_url:
        "https://images.unsplash.com/photo-1509281373149-e957c6296406?q=80&w=800&auto=format&fit=crop",
      backdrop_url:
        "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop",
      status: "NOW_SHOWING",
      duration_minutes: 135,
      genre: "Horror / Action / Mystery",
    },
    {
      id: 5,
      title: "Supergirl",
      category: "IMAX 3D",
      poster_url:
        "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop",
      backdrop_url:
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format&fit=crop",
      status: "NOW_SHOWING",
      duration_minutes: 148,
      genre: "Sci-Fi / Adventure / Action",
    },
    {
      id: 1,
      title: "Spider-Man: Brand New Day (2D)",
      category: "2D",
      poster_url:
        "https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=800&auto=format&fit=crop",
      backdrop_url:
        "https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=1600&auto=format&fit=crop",
      status: "NOW_SHOWING",
      duration_minutes: 180,
      genre: "Action / Adventure / Sci-Fi",
    },
    {
      id: 3,
      title: "Minions & Monsters",
      category: "3D",
      poster_url:
        "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=800&auto=format&fit=crop",
      backdrop_url:
        "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1600&auto=format&fit=crop",
      status: "NOW_SHOWING",
      duration_minutes: 105,
      genre: "Animation / Comedy / Family",
    },
  ];

  const formatTheatreLabel = (t) => {
    if (!t) return "Bashundhara Shopping Mall , Panthapath";
    if (t.name.includes("Bashundhara")) return "Bashundhara Shopping Mall , Panthapath";
    if (t.name.includes("Sony")) return "Sony Square , Mirpur";
    if (t.name.includes("Ball")) return "Ball Arcade , Chattagram";
    if (t.name.includes("Finlay")) return "Finlay Square , Chattagram";
    return `${t.name}${t.location ? ` , ${t.location.replace(/, Dhaka/g, "")}` : ""}`;
  };

  const rawList = movies.length > 0 ? movies : fallbackMovies;
  const displayMovies = rawList.filter((m) =>
    searchFilter ? m.title.toLowerCase().includes(searchFilter.toLowerCase()) : true
  );

  return (
    <div className="bg-gradient-to-b from-[#070A1E] via-[#090D24] to-[#050714] text-white min-h-screen">
      {/* Modals for Sidebar items (Ticket Price, About Us, Contact) */}
      <NavModals modalType={modalType} onClose={() => setModalType(null)} />

      {/* TOP HERO CONTAINER (Wireframe Page 2) */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 pt-4 pb-12">
        {/* Sub-header Bar: Location Pill on the Right */}
        <div className="flex justify-end items-center mb-3">
          <button
            onClick={openTheatreModal}
            className="group flex items-center gap-2 bg-white hover:bg-gray-100 rounded-full px-4 py-1.5 shadow-md hover:ring-2 hover:ring-[#D4AF37] transition text-xs sm:text-sm font-semibold text-gray-800 border border-gray-200 cursor-pointer"
            title="Choose Theatre Location"
          >
            <MapPin className="w-4 h-4 text-red-600 fill-red-500 shrink-0 transition-transform group-hover:scale-110" />
            <span className="truncate max-w-[180px] sm:max-w-[260px]">
              {selectedTheatre ? formatTheatreLabel(selectedTheatre) : "Bashundhara Shopping Mall , Panthapath"}
            </span>
          </button>
        </div>

        {/* Main Page 2 Layout: Sidebar on Left + Carousel on Right */}
        <div className="flex flex-col md:flex-row items-start gap-4 lg:gap-6">
          {/* LEFT SIDEBAR (Wireframe Page 2 exact menu) */}
          <div className="w-full md:w-[180px] lg:w-[200px] shrink-0">
            {/* Hamburger Button */}
            <div className="mb-4 flex items-center">
              <button
                onClick={() => setSidebarOpen((prev) => !prev)}
                className="w-10 h-8 rounded-sm border-2 border-[#C8A05C] bg-[#12162A] flex flex-col justify-center items-center gap-[4px] px-1 hover:border-[#F3E5AB] transition shadow-md cursor-pointer"
                aria-label="Toggle Sidebar Menu"
                title="Toggle Menu"
              >
                <span className="w-6 h-[2.5px] bg-[#D4A347] rounded-full" />
                <span className="w-6 h-[2.5px] bg-[#D4A347] rounded-full" />
                <span className="w-6 h-[2.5px] bg-[#D4A347] rounded-full" />
              </button>
            </div>

            {/* Menu Buttons Stack with Vertical Gold Line */}
            {sidebarOpen && (
              <div className="relative">
                {/* The vertical bright gold line running down the right edge */}
                <div className="hidden md:block absolute right-0 -top-3 -bottom-3 w-[2.5px] gold-accent-line rounded-full z-10" />

                {/* 4 Stacked Bronze Buttons */}
                <div className="flex flex-col divide-y divide-[#221B13] border-y border-[#3A2F20] shadow-xl rounded-l-xs overflow-hidden">
                  {/* 1. HOME */}
                  <button
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="bronze-nav-btn w-full py-2.5 px-3 text-center cursor-pointer group"
                  >
                    <span className="font-cinzel text-xs font-bold text-[#E5C158] group-hover:text-white tracking-[0.18em] uppercase transition">
                      HOME
                    </span>
                  </button>

                  {/* 2. TICKET PRICE */}
                  <button
                    onClick={() => setModalType("TICKET_PRICE")}
                    className="bronze-nav-btn w-full py-2.5 px-3 text-center cursor-pointer group"
                  >
                    <span className="font-cinzel text-xs font-bold text-[#E5C158] group-hover:text-white tracking-[0.18em] uppercase transition">
                      TICKET PRICE
                    </span>
                  </button>

                  {/* 3. ABOUT US */}
                  <button
                    onClick={() => setModalType("ABOUT_US")}
                    className="bronze-nav-btn w-full py-2.5 px-3 text-center cursor-pointer group"
                  >
                    <span className="font-cinzel text-xs font-bold text-[#E5C158] group-hover:text-white tracking-[0.18em] uppercase transition">
                      ABOUT US
                    </span>
                  </button>

                  {/* 4. CONTACT */}
                  <button
                    onClick={() => setModalType("CONTACT")}
                    className="bronze-nav-btn w-full py-2.5 px-3 text-center cursor-pointer group"
                  >
                    <span className="font-cinzel text-xs font-bold text-[#E5C158] group-hover:text-white tracking-[0.18em] uppercase transition">
                      CONTACT
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: HERO CAROUSEL CARD */}
          <div className="w-full md:flex-1 min-w-0">
            <HeroCarousel movies={displayMovies} />
          </div>
        </div>
      </div>

      {/* CATALOG SECTION (Wireframe Page 4) */}
      <section id="catalog-section" className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 py-10 border-t border-[#D4AF37]/20">
        {/* Navigation Tabs Bar */}
        <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-4 overflow-x-auto gap-4 scrollbar-none">
          <div className="flex items-center gap-6 sm:gap-10">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-xs sm:text-sm tracking-[0.2em] font-cinzel uppercase transition-all pb-2 whitespace-nowrap cursor-pointer ${
                  activeTab === tab
                    ? "text-[#D4AF37] font-bold border-b-2 border-[#D4AF37] drop-shadow-[0_2px_10px_rgba(212,175,55,0.5)]"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {searchFilter && (
            <span className="text-xs text-[#D4AF37] shrink-0 font-medium bg-[#1D121F] px-3 py-1 rounded-full border border-[#D4AF37]/40">
              Filter: "{searchFilter}"
            </span>
          )}
        </div>

        {/* Movie Poster Grid (Wireframe Page 4) */}
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="w-10 h-10 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 sm:gap-6 md:gap-7 mt-10">
            {displayMovies.map((movie) => (
              <div
                key={movie.id}
                className="group relative flex flex-col rounded-xl overflow-hidden bg-[#0F1428] border border-[#D4AF37]/25 hover:border-[#D4AF37] transition-all duration-300 shadow-xl hover:shadow-[0_0_20px_rgba(212,175,55,0.2)]"
              >
                {/* Poster Image */}
                <div className="relative aspect-[2/3] overflow-hidden bg-black/70">
                  <img
                    src={
                      movie.poster_url ||
                      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=600&auto=format&fit=crop"
                    }
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {movie.category && (
                    <span className="absolute top-2 right-2 bg-black/85 backdrop-blur-xs text-[#D4AF37] border border-[#D4AF37]/50 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shadow">
                      {movie.category}
                    </span>
                  )}
                </div>

                {/* Title & Get Tickets Button */}
                <div className="p-4 flex flex-col justify-between flex-grow">
                  <div>
                    <h3 className="font-cinzel font-bold text-sm sm:text-base text-gray-100 group-hover:text-[#D4AF37] transition line-clamp-1">
                      {movie.title}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                      {movie.duration_minutes ? `${movie.duration_minutes} mins` : "Now Showing"}
                    </p>
                  </div>

                  <Link
                    to={`/movie/${movie.id}`}
                    className="mt-4 block w-full text-center bg-[#D4AF37] hover:bg-[#F3E5AB] text-gray-950 font-bold text-xs tracking-wider uppercase py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all"
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
