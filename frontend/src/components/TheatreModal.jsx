import { useEffect } from "react";
import { useTheatre } from "../context/TheatreContext";
import { MapPin, X, Check } from "lucide-react";

export default function TheatreModal() {
  const {
    theatres,
    selectedTheatre,
    selectTheatre,
    isTheatreModalOpen,
    closeTheatreModal,
  } = useTheatre();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        closeTheatreModal();
      }
    };
    if (isTheatreModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isTheatreModalOpen, closeTheatreModal]);

  if (!isTheatreModalOpen) return null;

  // Fallback data matching Wireframe Page 3 exactly
  const defaultTheatres = [
    { id: 1, name: "Bashundhara Shopping Mall", location: "Panthapath" },
    { id: 2, name: "Sony Square", location: "Mirpur" },
    { id: 3, name: "Ball Arcade", location: "Chattagram" },
    { id: 4, name: "Finlay Square", location: "Chattagram" },
  ];

  const displayList = theatres.length > 0 ? theatres : defaultTheatres;

  // Exact Wireframe Page 3 text formatting: "Bashundhara Shopping Mall , Panthapath"
  const formatTheatreLabel = (t) => {
    if (t.name.includes("Bashundhara")) return "Bashundhara Shopping Mall , Panthapath";
    if (t.name.includes("Sony")) return "Sony Square , Mirpur";
    if (t.name.includes("Ball")) return "Ball Arcade , Chattagram";
    if (t.name.includes("Finlay")) return "Finlay Square , Chattagram";
    return `${t.name}${t.location ? ` , ${t.location.replace(/, Dhaka/g, "")}` : ""}`;
  };

  return (
    <div
      onClick={closeTheatreModal}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 bg-[#070A1E]/85 backdrop-blur-md animate-in fade-in duration-200 select-none overflow-y-auto"
    >
      {/* Dismiss Button in Top Right */}
      <button
        onClick={closeTheatreModal}
        className="fixed top-5 right-5 sm:top-8 sm:right-8 w-11 h-11 rounded-full bg-[#1A2035]/80 border border-[#D4AF37]/40 text-gray-300 hover:text-white hover:border-[#D4AF37] flex items-center justify-center transition shadow-lg cursor-pointer z-50"
        aria-label="Close theatre dropdown"
        title="Close (Esc)"
      >
        <X className="w-6 h-6 stroke-[2]" />
      </button>

      {/* Main Dropdown Container (Wireframe Page 3) */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[760px] flex flex-col items-center py-4"
      >
        {/* Title Box with 3D Offset Shadow (Wireframe Page 3) */}
        <div className="theatre-title-box w-full max-w-[440px] py-4 px-6 sm:px-8 text-center mb-8 sm:mb-10 shadow-2xl">
          <h2 className="font-cinzel font-black text-lg sm:text-xl md:text-2xl tracking-[0.2em] leading-snug">
            <span className="text-[#281417]">SELECT </span>
            <span className="text-[#344474]">YOUR </span>
            <span className="text-[#281417]">THEATRE</span>
          </h2>
        </div>

        {/* 4 Theatre Options (Pill Buttons with 3D Offset Shadow) */}
        <div className="flex flex-col gap-4 sm:gap-5 w-full">
          {displayList.map((t) => {
            const isSelected = selectedTheatre?.id === t.id;
            return (
              <button
                key={t.id}
                onClick={() => selectTheatre(t)}
                className={`theatre-pill-btn flex items-center justify-between gap-4 px-6 sm:px-8 py-3.5 sm:py-4 text-left cursor-pointer ${
                  isSelected ? "theatre-pill-selected ring-2 ring-[#D4AF37]" : ""
                }`}
                title={`Select ${formatTheatreLabel(t)}`}
              >
                <div className="flex items-center gap-4 sm:gap-5 min-w-0">
                  {/* Red Map Pin Icon */}
                  <MapPin className="w-6 sm:w-7 h-6 sm:h-7 text-[#CD3324] fill-[#CD3324] stroke-[1.5] shrink-0" />
                  
                  {/* Theatre Name and Location */}
                  <span className="font-cinzel font-bold text-sm sm:text-base md:text-lg text-[#404953] tracking-wide truncate">
                    {formatTheatreLabel(t)}
                  </span>
                </div>

                {/* Selected Status Indicator */}
                {isSelected && (
                  <span className="flex items-center gap-1.5 shrink-0 bg-[#D4AF37] text-gray-950 text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    Active
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
