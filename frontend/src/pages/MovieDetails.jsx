import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../api";
import { ArrowLeft } from "lucide-react";

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchMovieDetails = async () => {
      try {
        const res = await api.get(`/api/movies/${id}/`);
        if (isMounted) {
          setMovie(res.data);
        }
      } catch (err) {
        console.error("Error loading movie:", err);
        // Fallback for Spider-Man from Wireframe Page 5
        if (isMounted) {
          setMovie({
            id,
            title: "Spider-Man: Brand New Day (2D)",
            category: "2D",
            actors: "TOM HOLLAND, ZENDAYA, SADIE SINK, LIZA COLÓN, JACOB BA",
            genre: "Action, Adventure, Sci-Fi",
            release_date: "2026-07-30",
            language: "English",
            duration_minutes: 180,
            poster_url:
              "https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=800&auto=format&fit=crop",
          });
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchMovieDetails();
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] bg-[#0B0E1E]">
        <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0E1E] text-white py-8 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Link */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-[#D4AF37] hover:underline mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Movies
        </button>

        {/* Wireframe Page 5 Layout: Poster on left, details on right */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start bg-[#12162A]/60 border border-[#D4AF37]/20 rounded-2xl p-6 md:p-10 backdrop-blur-md shadow-2xl">
          {/* Left Poster */}
          <div className="md:col-span-5 flex justify-center">
            <div className="relative aspect-2/3 w-full max-w-sm rounded-xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.8)] border border-[#D4AF37]/40">
              <img
                src={movie?.poster_url || "https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=800&auto=format&fit=crop"}
                alt={movie?.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right Details (Exact format from Wireframe Page 5) */}
          <div className="md:col-span-7 flex flex-col justify-between h-full space-y-6">
            <div>
              <h1 className="text-2xl md:text-4xl font-bold font-serif text-[#F2C94C] drop-shadow-[0_2px_10px_rgba(242,201,76,0.3)]">
                {movie?.title}
              </h1>

              <div className="mt-8 space-y-4 text-sm md:text-base text-gray-200">
                <p className="flex items-start gap-2">
                  <span className="font-semibold text-gray-400 w-28 shrink-0">Category:</span>
                  <span className="text-white font-medium">{movie?.category || "2D"}</span>
                </p>

                <p className="flex items-start gap-2">
                  <span className="font-semibold text-gray-400 w-28 shrink-0">Actor:</span>
                  <span className="text-[#E0E0E0]">{movie?.actors || "N/A"}</span>
                </p>

                <p className="flex items-start gap-2">
                  <span className="font-semibold text-gray-400 w-28 shrink-0">Genre:</span>
                  <span className="text-white">{movie?.genre || "Action"}</span>
                </p>

                <p className="flex items-start gap-2">
                  <span className="font-semibold text-gray-400 w-28 shrink-0">Release:</span>
                  <span className="text-white">{movie?.release_date || "Coming Soon"}</span>
                </p>

                <p className="flex items-start gap-2">
                  <span className="font-semibold text-gray-400 w-28 shrink-0">Language:</span>
                  <span className="text-white">{movie?.language || "English"}</span>
                </p>

                {movie?.duration_minutes && (
                  <p className="flex items-start gap-2">
                    <span className="font-semibold text-gray-400 w-28 shrink-0">Duration:</span>
                    <span className="text-white">
                      {Math.floor(movie.duration_minutes / 60)} hour {movie.duration_minutes % 60 > 0 ? `${movie.duration_minutes % 60}m` : ""}
                    </span>
                  </p>
                )}
              </div>
            </div>

            {/* Showtime CTA Button (Wireframe Page 5 Bottom) */}
            <div className="pt-6">
              <Link
                to={`/booking/movie/${movie?.id}`}
                className="inline-block bg-[#3B2836] hover:bg-[#52374B] border border-[#D4AF37]/50 text-[#F2C94C] font-serif text-lg font-bold px-12 py-3 rounded-xl shadow-lg transition duration-200 tracking-wider text-center"
              >
                Showtime
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
