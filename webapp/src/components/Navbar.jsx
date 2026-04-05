import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { auth, provider, db } from "../firebase";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useTheme } from "./ThemeContext";
import logo from "../assets/logo/inertia-logo.png";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/activities", label: "Activities" },
  { to: "/leaderboard", label: "Leaderboard" },
  { to: "/team", label: "Team" },
  { to: "/socials", label: "Socials" },
];

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  useEffect(() => setMenuOpen(false), [location]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

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
    ...LINKS,
    ...(isAdmin ? [{ to: "/admin", label: "Admin" }] : []),
  ];

  const isActive = (to) => {
    if (to === "/") return location.pathname === "/";
    return location.pathname.startsWith(to);
  };

  return (
    <>
      <nav style={{
        ...styles.nav,
        background: scrolled
          ? "var(--navbar-bg)"
          : "transparent",
        borderBottom: scrolled
          ? "1px solid var(--border)"
          : "1px solid transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
      }}>

        {/* LOGO */}
        <Link to="/" style={styles.logoLink}>
          <img src={logo} alt="Inertia" style={styles.logo} />
        </Link>

        {/* DESKTOP LINKS */}
        <div style={styles.desktopLinks}>
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              style={styles.linkWrapper}
            >
              <span style={{
                ...styles.link,
                color: isActive(l.to) ? "var(--accent)" : "var(--text)",
              }}>
                {l.label}
              </span>
              {isActive(l.to) && (
                <span style={styles.activeDot} />
              )}
            </Link>
          ))}
        </div>

        {/* RIGHT SIDE */}
        <div style={styles.right}>

          {/* THEME TOGGLE */}
          <button
            style={styles.iconBtn}
            onClick={toggleTheme}
            title="Toggle theme"
          >
            <span style={{ fontSize: "16px" }}>
              {theme === "light" ? "🌙" : "☀️"}
            </span>
          </button>

          {/* USER */}
          {user ? (
            <div style={styles.userRow}>
              <Link to={`/runner/${user.email}`} style={styles.avatarLink}>
                <img
                  src={user.photoURL}
                  style={styles.avatar}
                  alt="profile"
                />
                <span style={styles.onlineDot} />
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

          {/* HAMBURGER */}
          <button
            style={styles.hamburger}
            onClick={() => setMenuOpen((p) => !p)}
            aria-label="Toggle menu"
          >
            <span style={{
              ...styles.bar,
              transform: menuOpen
                ? "rotate(45deg) translate(5px, 6px)"
                : "none",
              background: menuOpen ? "var(--accent)" : "var(--text)",
            }} />
            <span style={{
              ...styles.bar,
              opacity: menuOpen ? 0 : 1,
              transform: menuOpen ? "translateX(-8px)" : "none",
            }} />
            <span style={{
              ...styles.bar,
              transform: menuOpen
                ? "rotate(-45deg) translate(5px, -6px)"
                : "none",
              background: menuOpen ? "var(--accent)" : "var(--text)",
            }} />
          </button>

        </div>
      </nav>

      {/* MOBILE FULLSCREEN DRAWER */}
      <div style={{
        ...styles.drawer,
        opacity: menuOpen ? 1 : 0,
        pointerEvents: menuOpen ? "all" : "none",
        transform: menuOpen ? "translateY(0)" : "translateY(-12px)",
      }}>

        {/* DRAWER LINKS */}
        <div style={styles.drawerLinks}>
          {links.map((l, i) => (
            <Link
              key={l.to}
              to={l.to}
              style={{
                ...styles.drawerLink,
                color: isActive(l.to) ? "var(--accent)" : "var(--text)",
                transform: menuOpen
                  ? "translateX(0)"
                  : "translateX(-20px)",
                opacity: menuOpen ? 1 : 0,
                transition: `transform 0.4s ease ${i * 60}ms, opacity 0.4s ease ${i * 60}ms, color 0.2s`,
              }}
              onClick={() => setMenuOpen(false)}
            >
              <span style={styles.drawerLinkNum}>
                0{i + 1}
              </span>
              {l.label}
              {isActive(l.to) && (
                <span style={styles.drawerActiveDot} />
              )}
            </Link>
          ))}
        </div>

        {/* DRAWER BOTTOM */}
        <div style={styles.drawerBottom}>
          <div style={styles.drawerDivider} />

          {user ? (
            <div style={styles.drawerUser}>
              <div style={styles.drawerUserInfo}>
                <img
                  src={user.photoURL}
                  style={styles.drawerAvatar}
                  alt="profile"
                />
                <div>
                  <p style={styles.drawerUserName}>
                    {user.displayName}
                  </p>
                  <p style={styles.drawerUserEmail}>
                    {user.email}
                  </p>
                </div>
              </div>
              <button
                style={styles.drawerLogout}
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              style={styles.drawerLogin}
              onClick={handleLogin}
            >
              Login with Google →
            </button>
          )}

          <div style={styles.drawerTheme}>
            <span style={styles.drawerThemeLabel}>
              {theme === "light" ? "Light mode" : "Dark mode"}
            </span>
            <button style={styles.drawerThemeBtn} onClick={toggleTheme}>
              {theme === "light" ? "🌙" : "☀️"}
            </button>
          </div>
        </div>

      </div>

      {/* BACKDROP */}
      {menuOpen && (
        <div
          style={styles.backdrop}
          onClick={() => setMenuOpen(false)}
        />
      )}
    </>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 32px",
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    zIndex: 1000,
    transition: "background 0.3s ease, border-color 0.3s ease, backdrop-filter 0.3s ease",
    boxSizing: "border-box",
  },
  logoLink: {
    textDecoration: "none",
    zIndex: 1001,
    position: "relative",
  },
  logo: {
    height: "34px",
    display: "block",
  },
  desktopLinks: {
    display: "flex",
    gap: "36px",
    alignItems: "center",
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",
  },
  linkWrapper: {
    textDecoration: "none",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
  },
  link: {
    fontSize: "13px",
    fontWeight: "500",
    letterSpacing: "0.3px",
    transition: "color 0.2s",
  },
  activeDot: {
    width: "4px",
    height: "4px",
    borderRadius: "50%",
    background: "var(--accent)",
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    zIndex: 1001,
    position: "relative",
  },
  iconBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "6px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background 0.2s",
  },
  userRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  avatarLink: {
    position: "relative",
    display: "block",
    textDecoration: "none",
  },
  avatar: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid var(--accent)",
    display: "block",
  },
  onlineDot: {
    position: "absolute",
    bottom: "0",
    right: "0",
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "var(--accent)",
    border: "2px solid var(--bg)",
  },
  loginBtn: {
    background: "var(--accent)",
    color: "#0a0a0a",
    border: "none",
    padding: "8px 18px",
    borderRadius: "8px",
    fontWeight: "700",
    fontSize: "13px",
    cursor: "pointer",
    letterSpacing: "0.3px",
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
    padding: "6px",
    zIndex: 1001,
  },
  bar: {
    display: "block",
    width: "22px",
    height: "2px",
    borderRadius: "2px",
    transition: "all 0.3s cubic-bezier(0.23, 1, 0.32, 1)",
  },

  // DRAWER
  drawer: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "var(--bg)",
    zIndex: 999,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "100px 32px 48px",
    transition: "opacity 0.3s ease, transform 0.3s ease",
    overflowY: "auto",
  },
  drawerLinks: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  drawerLink: {
    textDecoration: "none",
    fontSize: "clamp(28px, 8vw, 48px)",
    fontWeight: "700",
    letterSpacing: "-0.5px",
    padding: "12px 0",
    borderBottom: "1px solid var(--border)",
    display: "flex",
    alignItems: "center",
    gap: "16px",
    position: "relative",
  },
  drawerLinkNum: {
    fontSize: "12px",
    fontWeight: "500",
    color: "var(--text3)",
    letterSpacing: "1px",
    minWidth: "24px",
  },
  drawerActiveDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "var(--accent)",
    marginLeft: "auto",
    flexShrink: 0,
  },

  // DRAWER BOTTOM
  drawerBottom: {
    marginTop: "40px",
  },
  drawerDivider: {
    height: "1px",
    background: "var(--border)",
    marginBottom: "24px",
  },
  drawerUser: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "20px",
    gap: "12px",
  },
  drawerUserInfo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  drawerAvatar: {
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid var(--accent)",
  },
  drawerUserName: {
    fontWeight: "600",
    fontSize: "15px",
    color: "var(--text)",
    marginBottom: "2px",
  },
  drawerUserEmail: {
    fontSize: "12px",
    color: "var(--text2)",
  },
  drawerLogout: {
    background: "none",
    border: "1px solid var(--border)",
    color: "var(--text2)",
    padding: "8px 16px",
    borderRadius: "8px",
    fontSize: "13px",
    cursor: "pointer",
    flexShrink: 0,
  },
  drawerLogin: {
    background: "var(--accent)",
    color: "#0a0a0a",
    border: "none",
    padding: "16px",
    borderRadius: "10px",
    fontWeight: "700",
    fontSize: "16px",
    cursor: "pointer",
    width: "100%",
    marginBottom: "20px",
    letterSpacing: "0.3px",
  },
  drawerTheme: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "16px",
  },
  drawerThemeLabel: {
    fontSize: "13px",
    color: "var(--text2)",
  },
  drawerThemeBtn: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "8px",
    padding: "8px 12px",
    cursor: "pointer",
    fontSize: "16px",
  },

  // BACKDROP
  backdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.4)",
    zIndex: 998,
    backdropFilter: "blur(4px)",
  },
};