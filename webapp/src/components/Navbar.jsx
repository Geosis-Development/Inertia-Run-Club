import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { auth, provider, db } from "../firebase";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useTheme } from "./ThemeContext";
import logo from "../assets/logo/inertia-logo.png";

function Navbar() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  useEffect(() => setMenuOpen(false), [location]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const snap = await getDoc(doc(db, "admins", currentUser.email));
        setIsAdmin(snap.exists());
      } else {
        setIsAdmin(false);
      }
    });
    return () => unsub();
  }, []);

  const handleLogin = async () => {
    try { await signInWithPopup(auth, provider); }
    catch (e) { console.error(e); }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setMenuOpen(false);
  };

  const links = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/activities", label: "Activities" },
    { to: "/leaderboard", label: "Leaderboard" },
    { to: "/team", label: "Team" },
    { to: "/socials", label: "Socials" },
    ...(isAdmin ? [{ to: "/admin", label: "Admin" }] : []),
  ];

  return (
    <>
      <nav style={styles.nav}>

        <Link to="/" style={styles.logoLink}>
          <img src={logo} alt="Inertia" style={styles.logo} />
        </Link>

        {/* Desktop links */}
        <div style={styles.desktopLinks}>
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              style={{
                ...styles.link,
                color: location.pathname === l.to ? "var(--accent)" : "var(--text)",
              }}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div style={styles.right}>

          <button style={styles.iconBtn} onClick={toggleTheme} title="Toggle theme">
            {theme === "light" ? "🌙" : "☀️"}
          </button>

          {user ? (
            <div style={styles.profileRow}>
              <Link to={`/runner/${user.email}`}>
                <img src={user.photoURL} style={styles.avatar} alt="profile" />
              </Link>
              <button style={styles.logoutBtn} onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <button style={styles.loginBtn} onClick={handleLogin}>
              Login
            </button>
          )}

          <button
            style={styles.hamburger}
            onClick={() => setMenuOpen((p) => !p)}
            aria-label="Menu"
          >
            <span style={{
              ...styles.bar,
              transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "none"
            }} />
            <span style={{ ...styles.bar, opacity: menuOpen ? 0 : 1 }} />
            <span style={{
              ...styles.bar,
              transform: menuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none"
            }} />
          </button>

        </div>

      </nav>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div style={styles.mobileMenu}>
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              style={{
                ...styles.mobileLink,
                color: location.pathname === l.to ? "var(--accent)" : "var(--text)",
              }}
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </Link>
          ))}

          <div style={styles.mobileDivider} />

          {user ? (
            <button style={styles.mobileLogout} onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <button style={styles.mobileLogin} onClick={handleLogin}>
              Login with Google
            </button>
          )}
        </div>
      )}
    </>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 24px",
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    zIndex: 1000,
    background: "var(--navbar-bg)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    borderBottom: "1px solid var(--border)",
  },
  logoLink: {
    textDecoration: "none",
  },
  logo: {
    height: "36px",
  },
  desktopLinks: {
    display: "flex",
    gap: "32px",
    alignItems: "center",
  },
  link: {
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "500",
    transition: "color 0.2s",
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  iconBtn: {
    background: "none",
    border: "none",
    fontSize: "18px",
    cursor: "pointer",
    padding: "4px",
  },
  profileRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  avatar: {
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid var(--accent)",
    display: "block",
  },
  loginBtn: {
    background: "var(--accent)",
    color: "#0a0a0a",
    border: "none",
    padding: "8px 18px",
    borderRadius: "6px",
    fontWeight: "600",
    fontSize: "13px",
    cursor: "pointer",
  },
  logoutBtn: {
    background: "none",
    border: "1px solid var(--border)",
    color: "var(--text2)",
    padding: "6px 12px",
    borderRadius: "6px",
    fontSize: "12px",
    cursor: "pointer",
  },
  hamburger: {
    background: "none",
    border: "none",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    padding: "4px",
  },
  bar: {
    display: "block",
    width: "22px",
    height: "2px",
    background: "var(--text)",
    borderRadius: "2px",
    transition: "all 0.3s ease",
  },
  mobileMenu: {
    position: "fixed",
    top: "64px",
    left: 0,
    right: 0,
    background: "var(--bg)",
    borderBottom: "1px solid var(--border)",
    display: "flex",
    flexDirection: "column",
    padding: "16px 24px",
    zIndex: 999,
    gap: "4px",
  },
  mobileLink: {
    textDecoration: "none",
    fontSize: "16px",
    fontWeight: "500",
    padding: "12px 0",
    borderBottom: "1px solid var(--border)",
  },
  mobileDivider: {
    height: "8px",
  },
  mobileLogin: {
    background: "var(--accent)",
    color: "#0a0a0a",
    border: "none",
    padding: "12px",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "15px",
    cursor: "pointer",
    width: "100%",
  },
  mobileLogout: {
    background: "none",
    border: "1px solid var(--border)",
    color: "var(--text2)",
    padding: "12px",
    borderRadius: "8px",
    fontSize: "15px",
    cursor: "pointer",
    width: "100%",
  },
};

export default Navbar;