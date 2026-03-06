import { BrowserRouter, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import AdminHome from "./admin/AdminHome";
import AdminCheck from "./utils/AdminCheck";
import AdminCreateTheatre from "./admin/AdminTheatre";
import AdminCreateMovie from "./admin/AdminMovie";
import AdminShow from "./admin/AdminShow";
import AdminMovieRevies from "./admin/AdminMovieReview";
import AdminTheatreReview from "./admin/AdminTheatreReview";

// Lazy imports
const Register = lazy(() => import("./pages/Register"));
const Login = lazy(() => import("./pages/Login"));
const Movies = lazy(() => import("./pages/Movies"));
const TheatresPage = lazy(() => import("./pages/Theatre"));
const Seats = lazy(() => import("./pages/Seat"));
const Home = lazy(() => import("./pages/Home"));
const Booking = lazy(() => import("./pages/Booking"));
const ProfilePage = lazy(() => import("./pages/UserProfile"));

const Loader = () => (
  <div className="flex h-screen items-center justify-center text-lg">
    Loading...
  </div>
);

const App = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/bookings/:userId" element={<Booking />} />
          <Route path="/profile/:userId" element={<ProfilePage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/movies/:movieId/theatres" element={<TheatresPage />} />
          <Route path="/movies/:movieId/shows/:showId/seats" element={<Seats />} />
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminCheck />}>
            <Route path="" element={<AdminHome />} />
            <Route path="theatres" element={<AdminCreateTheatre />} />
            <Route path="movies" element={<AdminCreateMovie />} />
            <Route path="shows" element={<AdminShow />} />
            <Route path="movies/:movieId" element={<AdminMovieRevies />} />
            <Route path="theatres/:theatreId" element={<AdminTheatreReview />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;