import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

import Navbar from "./components/Navbar";
import ScrollToTop from "./components/ScrollToTop";
import RegistrationModal from "./components/RegistrationModal";

import Home from "./pages/Home";
import About from "./pages/About";
import Activities from "./pages/Activities";
import ActivityDetails from "./pages/ActivityDetails";
import Team from "./pages/Team";
import Socials from "./pages/Socials";
import Admin from "./pages/Admin";
import Leaderboard from "./pages/Leaderboard";
import RunnerProfile from "./pages/RunnerProfile";
import AdminRoute from "./components/AdminRoute";

function App() {
  const [showRegistration, setShowRegistration] = useState(false);
  const [pendingUser, setPendingUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return;
      const runnerRef = doc(db, "runners", user.uid);
      const runnerSnap = await getDoc(runnerRef);
      if (!runnerSnap.exists()) {
        setPendingUser(user);
        setShowRegistration(true);
      }
    });
    return () => unsub();
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar />

      {showRegistration && pendingUser && (
        <RegistrationModal
          user={pendingUser}
          onComplete={() => {
            setShowRegistration(false);
            setPendingUser(null);
          }}
        />
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/activities/:id" element={<ActivityDetails />} />
        <Route path="/runner/:email" element={<RunnerProfile />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/team" element={<Team />} />
        <Route path="/socials" element={<Socials />} />
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