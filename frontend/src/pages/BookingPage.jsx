import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import { useTheatre } from "../context/TheatreContext";
import { CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";

export default function BookingPage() {
  const { movieId, showId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const { selectedTheatre } = useTheatre();

  // Data states
  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [selectedShow, setSelectedShow] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeatIds, setSelectedSeatIds] = useState([]);

  // Form states (Wireframe Page 6)
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("BKASH");
  const [submitting, setSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Sample static dates matching Page 6 if show dates aren't set
  const dateTabs = [
    { label: "Thu", day: "6 May", dateStr: "2026-05-06" },
    { label: "Fri", day: "7 May", dateStr: "2026-05-07" },
    { label: "Sat", day: "8 May", dateStr: "2026-05-08" },
    { label: "Sun", day: "9 May", dateStr: "2026-05-09" },
  ];
  const [selectedDate, setSelectedDate] = useState(dateTabs[0].dateStr);

  useEffect(() => {
    let isMounted = true;
    const fetchInitialData = async () => {
      try {
        if (movieId) {
          const mRes = await api.get(`/api/movies/${movieId}/`);
          if (isMounted) setMovie(mRes.data);
        }

        let showUrl = "/api/shows/";
        const params = new URLSearchParams();
        if (movieId) params.append("movie", movieId);
        if (selectedTheatre) params.append("theatre", selectedTheatre.id);
        if (params.toString()) showUrl += `?${params.toString()}`;

        const sRes = await api.get(showUrl);
        if (isMounted) {
          setShows(sRes.data);
          if (showId) {
            const matching = sRes.data.find((s) => s.id === parseInt(showId));
            if (matching) setSelectedShow(matching);
          } else if (sRes.data.length > 0) {
            setSelectedShow(sRes.data[0]);
          }
        }
      } catch (err) {
        console.error("Error fetching shows:", err);
      }
    };

    fetchInitialData();
    return () => {
      isMounted = false;
    };
  }, [movieId, showId, selectedTheatre]);

  useEffect(() => {
    if (!selectedShow) return;

    let isMounted = true;
    const fetchSeatsForShow = async () => {
      try {
        const res = await api.get(`/api/shows/${selectedShow.id}/seats/`);
        if (isMounted) {
          setSeats(res.data);
          setSelectedSeatIds([]);
        }
      } catch {
        // Fallback auditorium generation matching Page 8 (Rows A to G, cols 1 to 12)
        if (isMounted) {
          const rows = ["A", "B", "C", "D", "E", "F", "G"];
          const generated = [];
          let idCounter = 1;
          rows.forEach((r) => {
            for (let i = 1; i <= 12; i++) {
              const numStr = i < 10 ? `0${i}` : `${i}`;
              const isPremium = r === "A" || r === "B";
              const isSold =
                (r === "A" && (i === 4 || i === 5 || i === 7)) ||
                (r === "C" && (i === 5 || i === 7));
              generated.push({
                id: idCounter++,
                seat_number: `${r}${numStr}`,
                row: r,
                seat_type: isPremium ? "PREMIUM" : "REGULAR",
                is_booked: isSold,
              });
            }
          });
          setSeats(generated);
          setSelectedSeatIds([]);
        }
      }
    };

    fetchSeatsForShow();
    return () => {
      isMounted = false;
    };
  }, [selectedShow]);

  const toggleSeatSelection = (seat) => {
    if (seat.is_booked) return;
    if (selectedSeatIds.includes(seat.id)) {
      setSelectedSeatIds(selectedSeatIds.filter((id) => id !== seat.id));
    } else {
      setSelectedSeatIds([...selectedSeatIds, seat.id]);
    }
  };

  const ticketPrice = selectedShow ? parseFloat(selectedShow.price) : 450;
  const totalAmount = selectedSeatIds.length * ticketPrice;

  const handlePurchase = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!isAuthenticated) {
      openAuthModal("login");
      return;
    }

    if (!selectedShow) {
      setErrorMessage("Please select a showtime.");
      return;
    }

    if (selectedSeatIds.length === 0) {
      setErrorMessage("Please select at least one seat from the auditorium grid.");
      return;
    }

    if (!fullName || !phoneNumber) {
      setErrorMessage("Please fill in your full name and contact number.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        show: selectedShow.id,
        seat_ids: selectedSeatIds,
        customer_name: fullName,
        customer_phone: phoneNumber,
        payment_method: paymentMethod,
        total_amount: totalAmount,
      };

      const res = await api.post("/api/bookings/", payload);
      setBookingSuccess(res.data);
    } catch (err) {
      setErrorMessage(
        err.response?.data?.error || "Transaction failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const rows = ["A", "B", "C", "D", "E", "F", "G"];

  if (bookingSuccess) {
    return (
      <div className="min-h-screen bg-[#0B0E1E] text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#12162A] border border-[#D4AF37] rounded-2xl p-8 text-center shadow-2xl space-y-4">
          <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto" />
          <h2 className="text-2xl font-bold font-serif text-[#D4AF37]">
            TICKET CONFIRMED!
          </h2>
          <p className="text-sm text-gray-300">
            Booking ID: <span className="font-mono font-bold text-white">#{bookingSuccess.id}</span>
          </p>
          <div className="bg-[#0B0E1E] rounded-xl p-4 text-left text-xs space-y-2 border border-gray-700">
            <p><span className="text-gray-400">Movie:</span> {bookingSuccess.movie_title || movie?.title}</p>
            <p><span className="text-gray-400">Date/Time:</span> {bookingSuccess.show_date} at {bookingSuccess.start_time}</p>
            <p><span className="text-gray-400">Customer:</span> {bookingSuccess.customer_name} ({bookingSuccess.customer_phone})</p>
            <p><span className="text-gray-400">Seats Reserved:</span> {selectedSeatIds.length} seat(s)</p>
            <p><span className="text-gray-400">Total Paid:</span> <strong className="text-[#D4AF37]">{bookingSuccess.total_amount} BDT</strong> via {bookingSuccess.payment_method}</p>
          </div>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-[#D4AF37] text-gray-950 font-bold py-3 rounded-xl hover:bg-[#F3E5AB] transition mt-4"
          >
            RETURN HOME
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0E1E] text-white py-6 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header Bar (Wireframe Page 6) */}
        <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="text-[#D4AF37] hover:text-white transition"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl md:text-2xl font-serif font-bold text-[#D4AF37] tracking-wider">
              Showtime
            </h1>
          </div>

          <div className="bg-white text-gray-900 px-4 py-1.5 rounded shadow text-xs font-mono font-bold">
            {isAuthenticated ? user.username : "Guest"}
          </div>
        </div>

        {/* 2-Column Booking Interface (Pages 6 & 8) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Date, Showtimes & Seat Grid */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* 1. Date Selector (Page 6) */}
            <div>
              <h2 className="text-sm font-serif font-semibold text-[#D4AF37] uppercase tracking-wider mb-3">
                Select Date
              </h2>
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
                {dateTabs.map((dt) => (
                  <button
                    key={dt.dateStr}
                    onClick={() => setSelectedDate(dt.dateStr)}
                    className={`flex flex-col items-center justify-center px-6 py-2.5 rounded-xl border text-center transition min-w-[90px] ${
                      selectedDate === dt.dateStr
                        ? "border-[#D4AF37] bg-[#D4AF37] text-gray-950 font-bold shadow-md"
                        : "border-gray-700 bg-[#12162A] text-gray-300 hover:border-[#D4AF37]"
                    }`}
                  >
                    <span className="text-xs uppercase">{dt.label}</span>
                    <span className="text-sm font-semibold">{dt.day}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Showtime Selector by Hall (Page 6) */}
            <div>
              <h2 className="text-sm font-serif font-semibold text-[#D4AF37] uppercase tracking-wider mb-4">
                Select Show Time
              </h2>
              <div className="space-y-4">
                {shows.length > 0 ? (
                  shows.map((show) => {
                    const isSelected = selectedShow?.id === show.id;
                    return (
                      <div
                        key={show.id}
                        className="flex flex-wrap items-center gap-4 bg-[#12162A] border border-gray-800 p-4 rounded-xl"
                      >
                        <span className="font-serif font-bold text-gray-300 w-24">
                          {show.hall_name || "Hall 1"}
                        </span>
                        <button
                          onClick={() => setSelectedShow(show)}
                          className={`px-5 py-2 rounded-lg text-xs font-semibold tracking-wider transition ${
                            isSelected
                              ? "bg-[#D4AF37] text-gray-950 shadow-md ring-2 ring-[#D4AF37]"
                              : "bg-[#27324A] text-gray-200 hover:bg-[#32405F]"
                          }`}
                        >
                          {show.start_time?.slice(0, 5) || "12:50"} ({show.price} BDT)
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex flex-wrap items-center gap-4 bg-[#12162A] border border-gray-800 p-4 rounded-xl">
                    <span className="font-serif font-bold text-gray-300 w-24">Hall 1</span>
                    <button
                      onClick={() => setSelectedShow({ id: 99, hall_name: "Hall 1", price: 450 })}
                      className="px-5 py-2 rounded-lg text-xs font-semibold bg-[#D4AF37] text-gray-950 shadow-md"
                    >
                      12:50 pm
                    </button>
                    <button className="px-5 py-2 rounded-lg text-xs font-semibold bg-[#27324A] text-gray-200 hover:bg-[#32405F]">
                      3:00 pm
                    </button>
                    <button className="px-5 py-2 rounded-lg text-xs font-semibold bg-[#27324A] text-gray-200 hover:bg-[#32405F]">
                      6:00 pm
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* 3. Interactive Seat Matrix (Wireframe Page 8) */}
            <div className="bg-[#FAF3E0] text-gray-900 rounded-2xl p-6 md:p-8 shadow-2xl border border-gray-300">
              {/* Screen Bar */}
              <div className="max-w-md mx-auto mb-10 text-center">
                <div className="h-6 w-full bg-gradient-to-b from-gray-400 to-gray-200 border-2 border-gray-600 rounded-t-lg shadow-md flex items-center justify-center">
                  <span className="text-xs font-bold tracking-widest text-gray-800 uppercase">
                    Screen
                  </span>
                </div>
              </div>

              {/* Seat Rows Container */}
              <div className="space-y-3 max-w-2xl mx-auto overflow-x-auto pb-4">
                {rows.map((rowLetter) => {
                  const isPremiumRow = rowLetter === "A" || rowLetter === "B";
                  const rowSeats = seats.filter((s) => s.row === rowLetter);

                  return (
                    <div
                      key={rowLetter}
                      className={`flex items-center gap-2 justify-center p-1 rounded-lg ${
                        isPremiumRow ? "border-2 border-red-700 bg-red-50/50" : ""
                      }`}
                    >
                      <span className="w-5 text-sm font-bold text-gray-700">{rowLetter}</span>

                      <div className="flex gap-2">
                        {rowSeats.map((seat) => {
                          const isSelected = selectedSeatIds.includes(seat.id);

                          let colorClasses = "bg-[#D4A373] text-white hover:bg-[#BC8A5F]";
                          if (seat.is_booked) {
                            colorClasses = "bg-[#4A5568] text-gray-300 cursor-not-allowed opacity-80";
                          } else if (isSelected) {
                            colorClasses = "bg-[#10B981] text-white ring-2 ring-green-600 shadow-md";
                          } else if (seat.seat_type === "PREMIUM") {
                            colorClasses = "bg-[#8B0000] text-white hover:bg-[#A52A2A]";
                          }

                          return (
                            <button
                              key={seat.id}
                              type="button"
                              disabled={seat.is_booked}
                              onClick={() => toggleSeatSelection(seat)}
                              className={`w-8 h-8 rounded text-[10px] font-bold flex items-center justify-center transition shadow-xs ${colorClasses}`}
                              title={`Seat ${seat.seat_number} - ${seat.seat_type}`}
                            >
                              {seat.seat_number}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Legend matching Page 8 */}
              <div className="mt-8 pt-4 border-t border-gray-300 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-gray-800">
                <span className="font-bold">Select your seats:</span>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-[#D4A373]" />
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-[#4A5568]" />
                  <span>Sold</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-[#8B0000]" />
                  <span>Premium</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-[#10B981]" />
                  <span>Selected</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Ticket Summary Card (Wireframe Page 6) */}
          <div className="lg:col-span-4 bg-[#12162A] border border-[#D4AF37]/30 rounded-2xl p-6 shadow-2xl space-y-6">
            <h2 className="text-lg font-serif font-bold text-[#D4AF37] tracking-wider border-b border-gray-800 pb-3">
              Ticket Summary
            </h2>

            {/* Movie Thumbnail & Header */}
            <div className="flex gap-4 items-center">
              <img
                src={movie?.poster_url || "https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=200&auto=format&fit=crop"}
                alt="Movie Thumbnail"
                className="w-16 h-24 object-cover rounded-md border border-[#D4AF37]/30 shadow"
              />
              <div>
                <span className="text-xs bg-[#D4AF37] text-gray-950 font-bold px-2 py-0.5 rounded">
                  {movie?.category || "2D"}
                </span>
                <h3 className="font-bold text-sm text-gray-100 mt-1">
                  {movie?.title || "Spider-Man: No Way Home"}
                </h3>
                <p className="text-xs text-gray-400">Duration: 3 hour</p>
              </div>
            </div>

            {/* Summary Details (Page 6) */}
            <div className="space-y-2 text-xs border-y border-gray-800 py-4 text-gray-300">
              <p className="flex justify-between">
                <span className="text-gray-400">Location:</span>
                <span className="text-white font-medium">{selectedTheatre?.name || "Bashundhara Shopping Mall"}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-400">Show Date:</span>
                <span className="text-white font-medium">{selectedDate}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-400">Hall Name:</span>
                <span className="text-white font-medium">{selectedShow?.hall_name || "Hall 1"}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-400">Show Time:</span>
                <span className="text-white font-medium">{selectedShow?.start_time || "12:50 pm"}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-400">Ticket Quantity:</span>
                <span className="text-[#D4AF37] font-bold text-sm">{selectedSeatIds.length}</span>
              </p>
              <p className="flex justify-between text-sm pt-2 border-t border-gray-800">
                <span className="font-bold text-white">Total Amount:</span>
                <span className="font-bold text-[#D4AF37] text-base">{totalAmount} BDT</span>
              </p>
            </div>

            {/* Checkout Form ("Ticket For" - Page 6) */}
            <form onSubmit={handlePurchase} className="space-y-4">
              <h3 className="text-xs font-serif font-bold text-gray-400 uppercase tracking-wider">
                Ticket For
              </h3>

              <div>
                <label className="block text-[11px] text-gray-300 mb-1">Full Name:</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full bg-[#0B0E1E] border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-[11px] text-gray-300 mb-1">Number:</label>
                <input
                  type="text"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="017xxxxxxxx"
                  className="w-full bg-[#0B0E1E] border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              {/* Payment selector (Bkash / Nagad) */}
              <div>
                <label className="block text-[11px] text-gray-300 mb-1">Payment Method:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("BKASH")}
                    className={`py-2 rounded-lg text-xs font-bold border transition ${
                      paymentMethod === "BKASH"
                        ? "border-pink-500 bg-pink-900/40 text-pink-400 ring-1 ring-pink-500"
                        : "border-gray-700 bg-[#0B0E1E] text-gray-400"
                    }`}
                  >
                    bKash
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("NAGAD")}
                    className={`py-2 rounded-lg text-xs font-bold border transition ${
                      paymentMethod === "NAGAD"
                        ? "border-orange-500 bg-orange-900/40 text-orange-400 ring-1 ring-orange-500"
                        : "border-gray-700 bg-[#0B0E1E] text-gray-400"
                    }`}
                  >
                    Nagad
                  </button>
                </div>
              </div>

              {errorMessage && (
                <div className="flex items-center gap-2 p-2.5 rounded bg-red-950/60 border border-red-800 text-red-300 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting || selectedSeatIds.length === 0}
                className="w-full bg-[#D4AF37] hover:bg-[#F3E5AB] text-gray-950 font-serif font-bold text-sm tracking-widest uppercase py-3 rounded-xl transition shadow-lg disabled:opacity-40 disabled:cursor-not-allowed mt-2"
              >
                {submitting ? "PURCHASING..." : "Purchase TICKET"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
