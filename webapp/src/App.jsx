import Navbar from "./components/Navbar";
import ScrollToTop from "./components/ScrollToTop";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import Activities from "./pages/Activities";
import ActivityDetails from "./pages/ActivityDetails";
import Team from "./pages/Team";
import Socials from "./pages/Socials";
import Admin from "./pages/Admin";
import Leaderboard from "./pages/Leaderboard";
import RunnerProfile from "./pages/RunnerProfile";   // ✅ NEW IMPORT

import AdminRoute from "./components/AdminRoute";

function App() {
  return (
    <BrowserRouter>

      <ScrollToTop />

      <Navbar />

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/about" element={<About />} />

        <Route path="/activities" element={<Activities />} />

        <Route path="/activities/:id" element={<ActivityDetails />} />

        {/* Runner Profile Page */}
        <Route path="/runner/:email" element={<RunnerProfile />} />   {/* ✅ NEW ROUTE */}

        <Route path="/leaderboard" element={<Leaderboard />} />

        <Route path="/team" element={<Team />} />

        <Route path="/socials" element={<Socials />} />

        {/* ADMIN PROTECTED ROUTE */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;