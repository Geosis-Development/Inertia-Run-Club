import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import logo from "../assets/logo/inertia-logo.png";

import { auth, provider, db } from "../firebase";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

function Navbar() {

  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {

      setUser(currentUser);

      if (currentUser) {

        const adminRef = doc(db, "admins", currentUser.email);
        const adminSnap = await getDoc(adminRef);

        if (adminSnap.exists()) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }

      } else {
        setIsAdmin(false);
      }

    });

    return () => unsubscribe();

  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <nav style={styles.nav}>

      <img src={logo} alt="Inertia Logo" style={styles.logo} />

      <div style={styles.links}>

        <Link style={styles.link} to="/">Home</Link>
        <Link style={styles.link} to="/about">About</Link>
        <Link style={styles.link} to="/activities">Activities</Link>

        <Link style={styles.link} to="/leaderboard">Leaderboard</Link>

        <Link style={styles.link} to="/team">Team</Link>
        <Link style={styles.link} to="/socials">Socials</Link>

        {isAdmin && (
          <Link style={styles.link} to="/admin">
            Admin
          </Link>
        )}

      </div>

      {user ? (
        <div style={styles.profile}>

          <img
            src={user.photoURL}
            alt="profile"
            style={styles.avatar}
          />

          <button onClick={handleLogout} style={styles.logout}>
            Logout
          </button>

        </div>
      ) : (
        <button style={styles.login} onClick={handleLogin}>
          Login
        </button>
      )}

    </nav>
  );
}

const styles = {

  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",

    padding: "18px 40px",

    position: "fixed",
    top: 0,
    left: 0,

    width: "100%",
    zIndex: 1000,

    background: "rgba(11,11,11,0.45)",

    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",

    borderBottom: "1px solid rgba(255,255,255,0.08)",
  },

  logo: {
    height: "40px",
  },

  links: {
    display: "flex",
    gap: "40px",
    alignItems: "center",
  },

  link: {
    color: "white",
    textDecoration: "none",
    fontWeight: "500",
    transition: "0.3s",
  },

  login: {
    background: "#e6d28f",
    border: "none",
    padding: "8px 18px",
    borderRadius: "6px",
    fontWeight: "600",
    cursor: "pointer",
  },

  profile: {
    display: "flex",
    alignItems: "center",
    gap: "15px"
  },

  avatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    objectFit: "cover"
  },

  logout: {
    background: "#e6d28f",
    border: "none",
    padding: "6px 14px",
    borderRadius: "6px",
    cursor: "pointer"
  }

};

export default Navbar;