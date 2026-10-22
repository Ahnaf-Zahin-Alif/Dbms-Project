import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import TheatreModal from "../components/TheatreModal";
import AuthModal from "../components/AuthModal";

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0B0E1E] text-white">
      {/* Sticky Global Navigation */}
      <Navbar />

      {/* Main Page Body */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-[#D4AF37]/20 bg-[#070914] py-8 px-4 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-serif tracking-widest text-[#D4AF37]">
            CINEFILM &bull; CINEMA TICKETING SYSTEM
          </p>
          <p>&copy; 2026 Cinefilm. All Rights Reserved.</p>
        </div>
      </footer>

      {/* Global Modals (Pages 3 & 7) */}
      <TheatreModal />
      <AuthModal />
    </div>
  );
}
