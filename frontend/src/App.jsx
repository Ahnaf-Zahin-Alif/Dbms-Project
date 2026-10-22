import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Homepage from "./pages/Homepage";
import MovieDetails from "./pages/MovieDetails";
import BookingPage from "./pages/BookingPage";
import { AuthProvider } from "./context/AuthContext";
import { TheatreProvider } from "./context/TheatreContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Homepage />,
      },
      {
        path: "movie/:id",
        element: <MovieDetails />,
      },
      {
        path: "booking/movie/:movieId",
        element: <BookingPage />,
      },
      {
        path: "booking/:showId",
        element: <BookingPage />,
      },
      {
        path: "booking",
        element: <BookingPage />,
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);

export default function App() {
  return (
    <AuthProvider>
      <TheatreProvider>
        <RouterProvider router={router} />
      </TheatreProvider>
    </AuthProvider>
  );
}
