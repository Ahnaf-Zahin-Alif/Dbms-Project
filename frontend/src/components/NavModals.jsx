import { X, Info, Phone, MapPin, Users, BangladeshiTaka } from "lucide-react";

export default function NavModals({ modalType, onClose }) {
  if (!modalType) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#0F1426] border-2 border-[#D4AF37] rounded-2xl p-6 sm:p-8 shadow-[0_0_35px_rgba(212,175,55,0.3)] text-white">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-[#D4AF37] transition p-1"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        {modalType === "TICKET_PRICE" && (
          <div>
            <div className="flex items-center gap-3 mb-6 border-b border-[#D4AF37]/30 pb-4">
              <BangladeshiTaka className="w-7 h-7 text-[#D4AF37]" />
              <h2 className="text-xl sm:text-2xl font-cinzel font-bold text-[#D4AF37] tracking-wider">
                TICKET PRICING
              </h2>
            </div>

            <div className="space-y-4 text-sm">
              <div className="bg-[#182038] p-4 rounded-xl border border-[#D4AF37]/20 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-[#D4AF37] uppercase tracking-wider">2D Regular & Premium</h3>
                  <p className="text-xs text-gray-400">Hall 1 & Hall 2 Standard Formats</p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-white">৳400 - ৳450</span>
                </div>
              </div>

              <div className="bg-[#182038] p-4 rounded-xl border border-[#D4AF37]/20 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-[#D4AF37] uppercase tracking-wider">3D Experience</h3>
                  <p className="text-xs text-gray-400">Includes Active RealD 3D Glasses</p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-white">৳500 - ৳550</span>
                </div>
              </div>

              <div className="bg-[#182038] p-4 rounded-xl border border-[#D4AF37]/20 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-[#D4AF37] uppercase tracking-wider">IMAX Laser & 70mm</h3>
                  <p className="text-xs text-gray-400">12-Channel Immersive Sound & Giant Screen</p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-[#D4AF37]">৳550 - ৳600</span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-gray-400 mt-6 text-center">
              * Premium seats are located in Rows A & B with extra legroom & plush reclining.
            </p>
          </div>
        )}

        {modalType === "ABOUT_US" && (
          <div>
            <div className="flex items-center gap-3 mb-6 border-b border-[#D4AF37]/30 pb-4">
              <Info className="w-7 h-7 text-[#D4AF37]" />
              <h2 className="text-xl sm:text-2xl font-cinzel font-bold text-[#D4AF37] tracking-wider">
                ABOUT CINEFILM
              </h2>
            </div>

            <div className="space-y-4 text-sm text-gray-300 leading-relaxed">
              <p>
                <strong className="text-[#D4AF37]">CINEFILM</strong> is a online movie ticket management system that shows movie status , check available tickets , check available seats and purchase tickets online
              </p>
              <div className="pt-2">
                <div className="bg-[#182038] p-3 rounded-lg border border-[#D4AF37]/20 text-center">
                  <Users className="w-5 h-5 text-[#D4AF37] mx-auto mb-1" />
                  <span className="block text-xs font-semibold text-gray-200 mb-1">Project Members</span>
                  <p className="text-xs text-gray-400">
                   Sabiha Tanzum Munira , Md.Ahnaf Zahin Alif , Zarif Fahad 
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-400 pt-2">
                Featuring 4 premier complexes: Bashundhara Shopping Mall, Sony Square Mirpur, Ball Arcade Chattagram, and Finlay Square.
              </p>
            </div>
          </div>
        )}

        {modalType === "CONTACT" && (
          <div>
            <div className="flex items-center gap-3 mb-6 border-b border-[#D4AF37]/30 pb-4">
              <Phone className="w-7 h-7 text-[#D4AF37]" />
              <h2 className="text-xl sm:text-2xl font-cinzel font-bold text-[#D4AF37] tracking-wider">
                CONTACT US
              </h2>
            </div>

            <div className="space-y-4 text-sm">
              <div className="bg-[#182038] p-4 rounded-xl border border-[#D4AF37]/20">
                <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Customer Support Hotline</p>
                <p className="text-base font-bold text-[#D4AF37]">+8801937913773</p>
              </div>

              <div className="bg-[#182038] p-4 rounded-xl border border-[#D4AF37]/20">
                <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Email Queries & Group Bookings</p>
                <p className="text-base font-semibold text-white">support@cinefilm.com</p>
              </div>

              <div className="bg-[#182038] p-4 rounded-xl border border-[#D4AF37]/20 flex items-start gap-3">
                <MapPin className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-xs text-gray-300">
                  Headquarters: Level 8, Bashundhara City Mall, Panthapath, Dhaka 1205, Bangladesh.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

