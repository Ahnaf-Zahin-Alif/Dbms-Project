import { useTheatre } from "../context/TheatreContext";
import { MapPin, X } from "lucide-react";

export default function TheatreModal() {
  const { theatres, selectedTheatre, selectTheatre, isTheatreModalOpen, closeTheatreModal } =
    useTheatre();

  if (!isTheatreModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
      {/* Page 3 Modal Container */}
      <div className="relative w-full max-w-lg rounded-2xl bg-[#F8F9FA] p-8 text-gray-900 shadow-2xl border border-gray-200">
        <button
          onClick={closeTheatreModal}
          className="absolute right-4 top-4 rounded-full p-2 text-gray-500 hover:bg-gray-200 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Header Tab */}
        <div className="mx-auto mb-8 w-fit rounded-xl border border-gray-300 bg-white px-8 py-3 text-center shadow-md">
          <h2 className="text-xl font-bold tracking-wider text-gray-800 uppercase">
            Select Your Theatre
          </h2>
        </div>

        {/* Theatre Options (Pill Buttons) */}
        <div className="space-y-4">
          {theatres.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <p>No theatres found.</p>
              <p className="text-xs text-gray-400 mt-1">
                Add them via the Django Admin dashboard!
              </p>
            </div>
          ) : (
            theatres.map((t) => {
              const isSelected = selectedTheatre?.id === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => selectTheatre(t)}
                  className={`w-full flex items-center gap-4 rounded-full border px-6 py-4 text-left font-serif text-base transition ${
                    isSelected
                      ? "border-[#D4AF37] bg-[#FFF8E7] text-gray-900 shadow-md ring-2 ring-[#D4AF37]"
                      : "border-gray-200 bg-white text-gray-800 hover:border-[#D4AF37] hover:shadow-md"
                  }`}
                >
                  <MapPin className="h-6 w-6 shrink-0 fill-red-500 text-red-600" />
                  <span className="font-semibold">{t.name}</span>
                  {t.location && (
                    <span className="text-gray-500 font-normal">, {t.location}</span>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
