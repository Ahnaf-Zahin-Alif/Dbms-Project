import { createContext, useContext, useState, useEffect } from "react";
import api from "../api";

const TheatreContext = createContext();

export function TheatreProvider({ children }) {
  const [theatres, setTheatres] = useState([]);
  const [selectedTheatre, setSelectedTheatre] = useState(() => {
    const saved = localStorage.getItem("selected_theatre");
    return saved ? JSON.parse(saved) : null;
  });
  const [isTheatreModalOpen, setIsTheatreModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchInitialTheatres = async () => {
      try {
        const res = await api.get("/api/theatres/");
        if (isMounted) {
          setTheatres(res.data);
          if (!selectedTheatre && res.data.length > 0) {
            setSelectedTheatre(res.data[0]);
            localStorage.setItem("selected_theatre", JSON.stringify(res.data[0]));
          }
        }
      } catch (err) {
        console.error("Error fetching theatres:", err);
      }
    };

    fetchInitialTheatres();
    return () => {
      isMounted = false;
    };
  }, [selectedTheatre]);

  const selectTheatre = (theatre) => {
    setSelectedTheatre(theatre);
    localStorage.setItem("selected_theatre", JSON.stringify(theatre));
    setIsTheatreModalOpen(false);
  };

  const openTheatreModal = () => setIsTheatreModalOpen(true);
  const closeTheatreModal = () => setIsTheatreModalOpen(false);

  return (
    <TheatreContext.Provider
      value={{
        theatres,
        selectedTheatre,
        selectTheatre,
        isTheatreModalOpen,
        openTheatreModal,
        closeTheatreModal,
      }}
    >
      {children}
    </TheatreContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheatre() {
  const context = useContext(TheatreContext);
  if (!context) {
    throw new Error("useTheatre must be used within a TheatreProvider");
  }
  return context;
}
