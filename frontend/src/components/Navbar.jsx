import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheatre } from "../context/TheatreContext";
import { Search, User, LogOut, MapPin } from "lucide-react";

export default function Navbar() {
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
  const { selectedTheatre, openTheatreModal } = useTheatre();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const isHomepage = location.pathname === "/";

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/");
    }
  };

  const formatTheatreLabel = (t) => {
    if (!t) return "Bashundhara Shopping Mall";
    if (t.name.includes("Bashundhara")) return "Bashundhara Mall";
    if (t.name.includes("Sony")) return "Sony Square";
    if (t.name.includes("Ball")) return "Ball Arcade";
    if (t.name.includes("Finlay")) return "Finlay Square";
    return t.name;
  };

  return (
    <header className="sticky top-0 z-40 bg-[#1D121F] border-b border-[#2D1B30] px-4 md:px-8 py-3 transition-colors shadow-lg">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-4">
        {/* Left: CINEFILM Logo (exact wireframe logo with gold borders) */}
        <Link to="/" className="flex items-center group">
          <div className="relative flex flex-col items-center">
            {/* Display exact wireframe logo image with CSS fallback */}
            <img
              src="/images/cinefilm-logo.png"
              alt="CINEFILM"
              className="h-8 sm:h-10 md:h-11 object-contain transition-transform group-hover:scale-[1.02]"
              onError={(e) => {
                // In case image isn't loaded, fallback to CSS rendering
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
            <div className="hidden flex-col items-center">
              <div className="w-full h-[2px] bg-[#D4AF37]" />
              <span className="text-xl sm:text-2xl md:text-3xl font-cinzel font-black tracking-[0.25em] text-[#D4AF37] px-3 py-0.5 gold-glitter-text">
                CINEFILM
              </span>
              <div className="w-full h-[2px] bg-[#D4AF37]" />
            </div>
          </div>
        </Link>

        {/* Right: Search Bar, Location (on subpages), & Auth Badge */}
        <div className="flex items-center gap-3 md:gap-5">
          {/* Location / Theatre Pill on sub-pages */}
          {!isHomepage && (
            <button
              onClick={openTheatreModal}
              className="hidden sm:flex items-center gap-2 bg-white hover:bg-gray-100 rounded-full px-3.5 py-1.5 shadow-md hover:ring-2 hover:ring-[#D4AF37] transition text-xs font-semibold text-gray-800 border border-gray-200 cursor-pointer"
              title="Change Theatre Location"
            >
              <MapPin className="w-3.5 h-3.5 text-red-600 fill-red-500 shrink-0" />
              <span className="truncate max-w-[140px]">
                {formatTheatreLabel(selectedTheatre)}
              </span>
            </button>
          )}

          {/* Wireframe Page 2 Search Bar: Gold square icon button + White input pill */}
          <form
            onSubmit={handleSearch}
            className="flex items-center bg-white rounded-full overflow-hidden shadow-inner border border-[#C6A052] w-48 sm:w-60 md:w-72"
          >
            <button
              type="submit"
              className="bg-[#D4A347] hover:bg-[#B88C35] text-gray-900 p-2 sm:px-3 sm:py-2 flex items-center justify-center transition shrink-0"
              title="Search Movies"
            >
              <Search className="w-4 h-4 text-[#1D121F] stroke-[2.5]" />
            </button>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full bg-white px-3 py-1.5 text-xs sm:text-sm text-gray-900 focus:outline-none placeholder:text-gray-400"
            />
          </form>

          {/* User Auth Pill */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2 bg-[#2E1F33] border border-[#D4AF37]/50 rounded-full px-3 py-1.5 text-xs shadow-sm">
              <User className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-gray-200 font-medium hidden sm:inline">
                {user.username}
              </span>
              <button
                onClick={logout}
                title="Logout"
                className="text-gray-400 hover:text-red-400 transition ml-1"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => openAuthModal("login")}
              className="bg-[#D4A347] hover:bg-[#F3E5AB] text-gray-950 font-bold px-4 py-1.5 rounded-full text-xs transition shadow-[0_0_12px_rgba(212,163,71,0.3)] tracking-wider"
            >
              LOGIN
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
