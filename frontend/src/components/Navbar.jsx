import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheatre } from "../context/TheatreContext";
import { useAuth } from "../context/AuthContext";
import { Menu, X, Search, MapPin, User, LogOut } from "lucide-react";

export default function Navbar() {
  const { selectedTheatre, openTheatreModal } = useTheatre();
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#0B0E1E]/95 backdrop-blur-md border-b border-[#D4AF37]/20 px-4 md:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Left: Hamburger & Logo */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="text-[#D4AF37] hover:text-[#FFF8E7] transition p-1"
              aria-label="Open Menu"
            >
              <Menu className="w-8 h-8" />
            </button>

            <Link to="/" className="flex flex-col items-center">
              <span className="text-2xl md:text-3xl font-extrabold tracking-widest text-[#D4AF37] drop-shadow-[0_2px_10px_rgba(212,175,55,0.4)] border-y-2 border-[#D4AF37] px-2 py-0.5">
                CINEFILM
              </span>
            </Link>
          </div>

          {/* Center & Right: Search, Location Pill & Auth */}
          <div className="flex items-center gap-3 md:gap-5">
            {/* Search Input */}
            <form onSubmit={handleSearch} className="hidden sm:flex items-center bg-white rounded-full overflow-hidden shadow-inner w-44 md:w-64 border border-gray-300">
              <button type="submit" className="bg-[#D4AF37] hover:bg-[#B89628] text-white p-2 flex items-center justify-center transition">
                <Search className="w-4 h-4 text-gray-900" />
              </button>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search movies..."
                className="w-full bg-transparent px-3 py-1.5 text-xs text-gray-900 focus:outline-none"
              />
            </form>

            {/* Location / Theatre Pill (Wireframe Page 2) */}
            <button
              onClick={openTheatreModal}
              className="flex items-center gap-2 bg-white rounded-full px-4 py-1.5 shadow-md hover:ring-2 hover:ring-[#D4AF37] transition text-xs md:text-sm font-semibold text-gray-800 border border-gray-200"
            >
              <MapPin className="w-4 h-4 text-red-600 fill-red-500 shrink-0" />
              <span className="truncate max-w-[120px] md:max-w-[180px]">
                {selectedTheatre ? selectedTheatre.name : "Select Theatre"}
              </span>
            </button>

            {/* Auth Button */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2 bg-[#1A2035] border border-[#D4AF37]/40 rounded-full px-3 py-1 text-xs">
                <User className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-gray-200 font-medium hidden md:inline">
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
                className="bg-[#D4AF37] hover:bg-[#F3E5AB] hover:text-gray-900 text-gray-950 font-bold px-4 py-1.5 rounded-full text-xs transition shadow-[0_0_15px_rgba(212,175,55,0.3)]"
              >
                LOGIN
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Side Navigation Drawer (Wireframe Page 2 Menu) */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            onClick={() => setIsDrawerOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />

          {/* Drawer Content */}
          <div className="relative w-64 max-w-[80vw] bg-[#0A0D18] border-r border-[#D4AF37]/30 p-6 flex flex-col justify-between shadow-2xl z-10">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-[#D4AF37]/20">
                <span className="text-xl font-bold tracking-widest text-[#D4AF37]">
                  CINEFILM
                </span>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Navigation Links from Wireframe Page 2 */}
              <nav className="mt-8 space-y-4 font-serif">
                <Link
                  to="/"
                  onClick={() => setIsDrawerOpen(false)}
                  className="block text-lg font-semibold tracking-wider text-[#D4AF37] hover:text-[#FFF8E7] border-b border-transparent hover:border-[#D4AF37] py-2 transition"
                >
                  HOME
                </Link>
                <Link
                  to="/"
                  onClick={() => {
                    setIsDrawerOpen(false);
                    const el = document.getElementById("catalog-section");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="block text-lg font-semibold tracking-wider text-[#D4AF37] hover:text-[#FFF8E7] border-b border-transparent hover:border-[#D4AF37] py-2 transition"
                >
                  TICKET PRICE
                </Link>
                <a
                  href="#about"
                  onClick={() => setIsDrawerOpen(false)}
                  className="block text-lg font-semibold tracking-wider text-[#D4AF37] hover:text-[#FFF8E7] border-b border-transparent hover:border-[#D4AF37] py-2 transition"
                >
                  ABOUT US
                </a>
                <a
                  href="#contact"
                  onClick={() => setIsDrawerOpen(false)}
                  className="block text-lg font-semibold tracking-wider text-[#D4AF37] hover:text-[#FFF8E7] border-b border-transparent hover:border-[#D4AF37] py-2 transition"
                >
                  CONTACT
                </a>
              </nav>
            </div>

            <div className="text-xs text-gray-500 border-t border-gray-800 pt-4 text-center">
              Cinefilm Cinema &copy; 2026
            </div>
          </div>
        </div>
      )}
    </>
  );
}
