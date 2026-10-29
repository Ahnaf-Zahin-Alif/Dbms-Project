import { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../api";
import HeroCarousel from "../components/HeroCarousel";
import NavModals from "../components/NavModals";
import { useTheatre } from "../context/TheatreContext";
import { MapPin, ChevronDown } from "lucide-react";

export default function Homepage() {
  const [movies, setMovies] = useState([]);
  const [activeTab, setActiveTab] = useState("NOW SHOWING");
  const [loading, setLoading] = useState(true);
  const [modalType, setModalType] = useState(null); // 'TICKET_PRICE', 'ABOUT_US', 'CONTACT'
  const [sidebarOpen, setSidebarOpen] = useState(true); // desktop default open
  const [isCatalogVisible, setIsCatalogVisible] = useState(false);

  const catalogRef = useRef(null);
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

  // Scroll Reveal Observer: Triggers animation when user scrolls to Page 4 section
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsCatalogVisible(true);
        }
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    const currentElem = catalogRef.current;
    if (currentElem) {
      observer.observe(currentElem);
    }

    return () => {
      if (currentElem) observer.unobserve(currentElem);
    };
  }, []);

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

  // Fallback movies matching Wireframe Page 4 sequence
  const fallbackMovies = [
    {
      id: 3,
      title: "Minions & Monsters",
      category: "3D",
      poster_url: "/images/poster1-minions.png",
      status: "NOW_SHOWING",
      duration_minutes: 105,
    },
    {
      id: 6,
      title: "Moana 2",
      category: "3D",
      poster_url: "/images/poster2-moana.png",
      status: "NOW_SHOWING",
      duration_minutes: 100,
    },
    {
      id: 1,
      title: "Spider-Man: No Way Home",
      category: "2D",
      poster_url: "/images/poster3-spiderman.png",
      status: "NOW_SHOWING",
      duration_minutes: 148,
    },
    {
      id: 2,
      title: "The Odyssey",
      category: "IMAX",
      poster_url: "/images/poster4-odyssey.png",
      status: "NOW_SHOWING",
      duration_minutes: 165,
    },
    {
      id: 4,
      title: "Clayface",
      category: "IMAX",
      poster_url:
        "https://images.unsplash.com/photo-1509281373149-e957c6296406?q=80&w=800&auto=format&fit=crop",
      status: "NOW_SHOWING",
      duration_minutes: 135,
    },
    {
      id: 5,
      title: "Supergirl",
      category: "IMAX 3D",
      poster_url:
        "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop",
      status: "NOW_SHOWING",
      duration_minutes: 148,
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

  // Sort list to match Page 4 wireframe sequence: Minions -> Moana -> Spider-Man -> The Odyssey -> others
  const rawList = movies.length > 0 ? movies : fallbackMovies;
  const sortedList = [...rawList].sort((a, b) => {
    const order = ["minion", "moana", "spider", "odyssey", "clayface", "supergirl"];
    const aIdx = order.findIndex((k) => a.title.toLowerCase().includes(k));
    const bIdx = order.findIndex((k) => b.title.toLowerCase().includes(k));
    if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
    if (aIdx !== -1) return -1;
    if (bIdx !== -1) return 1;
    return 0;
  });

  const displayMovies = sortedList.filter((m) =>
    searchFilter ? m.title.toLowerCase().includes(searchFilter.toLowerCase()) : true
  );

  const scrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-gradient-to-b from-[#070A1E] via-[#090D24] to-[#050714] text-white min-h-screen w-full overflow-x-hidden">
      {/* Modals for Sidebar items (Ticket Price, About Us, Contact) */}
      <NavModals modalType={modalType} onClose={() => setModalType(null)} />

      {/* =========================================================================
          SECTION 1: HERO CONTAINER (Wireframe Page 2 - Stretched Widescreen)
          ========================================================================= */}
      <section className="w-full px-3 sm:px-6 lg:px-10 pt-2 pb-6 min-h-[85vh] lg:min-h-[88vh] flex flex-col justify-between">
        <div>
          {/* Sub-header Bar: Location Pill on the Right */}
          <div className="w-full flex justify-end items-center mb-2.5">
            <button
              onClick={openTheatreModal}
              className="group flex items-center gap-2 bg-white hover:bg-gray-100 rounded-full px-4 py-1.5 shadow-md hover:ring-2 hover:ring-[#D4AF37] transition text-xs sm:text-sm font-semibold text-gray-800 border border-gray-200 cursor-pointer"
              title="Choose Theatre Location"
            >
              <MapPin className="w-4 h-4 text-red-600 fill-red-500 shrink-0 transition-transform group-hover:scale-110" />
              <span className="truncate max-w-[200px] sm:max-w-[320px]">
                {selectedTheatre ? formatTheatreLabel(selectedTheatre) : "Bashundhara Shopping Mall , Panthapath"}
              </span>
            </button>
          </div>

          {/* Main Page 2 Layout: Sidebar on Left + Carousel on Right (Widescreen Stretch) */}
          <div className="flex flex-col md:flex-row items-stretch gap-4 lg:gap-6 w-full">
            {/* LEFT SIDEBAR (Wireframe Page 2 exact menu) */}
            <div className="w-full md:w-[170px] lg:w-[190px] shrink-0 flex flex-col">
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
                      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
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

            {/* RIGHT COLUMN: HERO CAROUSEL CARD (Widescreen Stretch) */}
            <div className="w-full md:flex-1 min-w-0 flex-grow">
              <HeroCarousel movies={displayMovies} />
            </div>
          </div>
        </div>

        {/* Scroll Indicator Prompt to Guide User Down */}
        <div className="flex justify-center mt-6 mb-1">
          <button
            onClick={scrollToCatalog}
            className="group flex items-center gap-2.5 bg-[#141A33]/90 hover:bg-[#1E254A] border border-[#D4AF37]/40 hover:border-[#D4AF37] text-[#D4AF37] px-6 py-2 rounded-full text-xs font-cinzel font-bold tracking-[0.22em] uppercase transition-all shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] cursor-pointer animate-subtle-float"
          >
            <span>SCROLL TO EXPLORE MOVIES</span>
            <ChevronDown className="w-4 h-4 transition-transform group-hover:translate-y-1 stroke-[2.5]" />
          </button>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: CATALOG SECTION (Wireframe Page 4 - Stretched Widescreen)
          ========================================================================= */}
      <section
        ref={catalogRef}
        id="catalog-section"
        className="w-full transition-opacity duration-700 min-h-screen border-t border-[#D4AF37]/20"
      >
        {/* Full-width Page 4 Dark Wine Header Bar with Tabs */}
        <div
          className={`w-full bg-[#1D121F] border-b border-[#2C1D2E] px-4 sm:px-8 py-3.5 transition-all duration-700 ${
            isCatalogVisible ? "animate-slide-down-header" : "opacity-0"
          }`}
        >
          <div className="w-full flex items-center justify-between gap-4 overflow-x-auto scrollbar-none">
            <div className="flex items-center gap-6 sm:gap-10 md:gap-16 mx-auto">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-xs sm:text-sm md:text-base tracking-[0.2em] font-cinzel uppercase transition-all py-1.5 whitespace-nowrap cursor-pointer ${
                    activeTab === tab
                      ? "text-[#D4AF37] font-bold border-b-2 border-[#D4AF37] drop-shadow-[0_2px_10px_rgba(212,175,55,0.6)]"
                      : "text-gray-400 hover:text-gray-200"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {searchFilter && (
              <span className="text-xs text-[#D4AF37] shrink-0 font-medium bg-[#140C15] px-3 py-1 rounded-full border border-[#D4AF37]/40">
                Filter: "{searchFilter}"
              </span>
            )}
          </div>
        </div>

        {/* Sub-bar below tabs: Left Hamburger Icon matching Page 4 */}
        <div className="w-full px-3 sm:px-6 lg:px-10 pt-5 pb-2">
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                setSidebarOpen(true);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="w-10 h-8 rounded-sm border-2 border-[#C8A05C] bg-[#12162A] flex flex-col justify-center items-center gap-[4px] px-1 hover:border-[#F3E5AB] transition shadow-md cursor-pointer"
              title="Return to Menu"
              aria-label="Return to Menu"
            >
              <span className="w-6 h-[2.5px] bg-[#D4A347] rounded-full" />
              <span className="w-6 h-[2.5px] bg-[#D4A347] rounded-full" />
              <span className="w-6 h-[2.5px] bg-[#D4A347] rounded-full" />
            </button>
          </div>
        </div>

        {/* Page 4 Movie Posters Grid (Stretched Widescreen Grid) */}
        <div className="w-full px-3 sm:px-6 lg:px-10 pb-16">
          {loading ? (
            <div className="flex justify-center items-center py-28">
              <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mt-5">
              {displayMovies.map((movie, idx) => (
                <div
                  key={movie.id}
                  className={`group relative rounded-lg overflow-hidden bg-black/60 shadow-2xl transition-all duration-500 hover:shadow-[0_0_25px_rgba(212,175,55,0.35)] border border-blue-950/40 hover:border-[#D4AF37]/60 ${
                    isCatalogVisible ? "animate-fade-in-up" : "opacity-0"
                  }`}
                  style={{
                    animationDelay: `${idx * 130}ms`,
                  }}
                >
                  {/* Poster Image (Takes full card body) */}
                  <div className="relative aspect-[2/3] overflow-hidden bg-black select-none">
                    <img
                      src={
                        movie.poster_url ||
                        "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=600&auto=format&fit=crop"
                      }
                      alt={movie.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />

                    {/* Subtle vignette shadow overlay at bottom of poster */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                    {/* Dark Bronze Floating "GET TICKETS" Button (Wireframe Page 4) */}
                    <Link
                      to={`/movie/${movie.id}`}
                      className="page4-ticket-btn absolute bottom-3.5 left-3.5 z-20 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xs flex items-center justify-center cursor-pointer group/btn"
                      title={`Get tickets for ${movie.title}`}
                    >
                      <span className="font-cinzel text-[11px] sm:text-xs font-bold text-[#E5C158] group-hover/btn:text-white tracking-[0.18em] uppercase transition-colors">
                        GET TICKETS
                      </span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
