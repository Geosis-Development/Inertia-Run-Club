import { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";

import FeatureCard from "../components/FeatureCard";
import EventCard from "../components/EventCard";
import RunGallery from "../components/RunGallery";
import heroVideo from "../assets/video/hero-video.mp4";

function Home() {
  const [runs, setRuns] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "runs"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRuns(data);
    });
    return () => unsub();
  }, []);

  const featuredRuns = runs.slice(0, 3);

  return (
    <div style={styles.page}>

      {/* HERO */}
      <div style={styles.hero}>
        <video autoPlay loop muted playsInline style={styles.video}>
          <source src={heroVideo} type="video/mp4" />
        </video>

        <div style={styles.overlay}>
          <p style={styles.eyebrow}>Panvel's Homegrown Run Club</p>
          <div style={styles.titleWrapper}>
            <div style={styles.titleBackdrop} />
            <h1 style={styles.title}>Momentum Is<br />Everything</h1>
          </div>
          <p style={styles.subtitle}>
            Every Sunday. Every pace. Every person.
          </p>
          <div style={styles.buttons}>
            <Link to="/activities" style={styles.primary}>
              Join Next Run
            </Link>
            <Link to="/about" style={styles.secondary}>
              Our Story
            </Link>
          </div>
        </div>

        <div style={styles.scrollHint}>
          <div style={styles.scrollLine} />
          <span style={styles.scrollText}>scroll</span>
        </div>
      </div>

      {/* STATS BAR */}
      <div style={styles.statsBar}>
        <div style={styles.statItem}>
          <span style={styles.statNum}>{runs.length}</span>
          <span style={styles.statLabel}>Runs Organised</span>
        </div>
        <div style={styles.statDivider} />
        <div style={styles.statItem}>
          <span style={styles.statNum}>5km</span>
          <span style={styles.statLabel}>Every Sunday</span>
        </div>
        <div style={styles.statDivider} />
        <div style={styles.statItem}>
          <span style={styles.statNum}>6:30</span>
          <span style={styles.statLabel}>AM Meetup</span>
        </div>
        <div style={styles.statDivider} />
        <div style={styles.statItem}>
          <span style={styles.statNum}>Panvel</span>
          <span style={styles.statLabel}>Base Location</span>
        </div>
      </div>

      {/* WHY RUN WITH INERTIA */}
      <section style={styles.features}>
        <p style={styles.sectionEyebrow}>Why Run With Us</p>
        <h2 style={styles.sectionTitle}>Built for the streets.<br />Made for the crew.</h2>

        <div style={styles.featureGrid}>
          <FeatureCard
            icon="🏃"
            title="Community"
            description="Run alongside passionate people and build friendships that last beyond the finish line."
          />
          <FeatureCard
            icon="⚡"
            title="Performance"
            description="Push your limits and improve your pace with every run. Track your progress on the leaderboard."
          />
          <FeatureCard
            icon="🔥"
            title="Persistence"
            description="Stay consistent and motivated with the energy of the crew behind you every step."
          />
        </div>
      </section>

      {/* SUNDAY RUN GALLERY */}
      <RunGallery />

      {/* UPCOMING RUNS */}
      <section style={styles.events}>
        <p style={styles.sectionEyebrow}>What's Coming</p>
        <h2 style={styles.sectionTitle}>Upcoming Runs</h2>

        {featuredRuns.length === 0 ? (
          <p style={styles.empty}>No upcoming runs. Check back soon.</p>
        ) : (
          <div style={styles.eventGrid}>
            {featuredRuns.map((run) => (
              <EventCard
                key={run.id}
                id={run.id}
                title={run.title}
                description={run.postRun}
                date={run.date}
                location={run.location}
                time={run.time}
                image={run.image}
                meetupLocation={run.meetupLocation}
              />
            ))}
          </div>
        )}

        <div style={styles.viewAll}>
          <Link to="/activities" style={styles.viewAllBtn}>
            View All Runs →
          </Link>
        </div>
      </section>

      {/* JOIN CTA */}
      <section style={styles.cta}>
        <div style={styles.ctaInner}>
          <h2 style={styles.ctaTitle}>Ready to run with us?</h2>
          <p style={styles.ctaText}>
            No experience needed. Just show up, lace up, and keep moving.
          </p>
          <Link to="/activities" style={styles.ctaBtn}>
            See Next Run →
          </Link>
        </div>
      </section>

    </div>
  );
}

const styles = {
  page: {
    marginTop: "64px",
  },

  // HERO
  hero: {
    height: "100svh",
    position: "relative",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  video: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    zIndex: 0,
  },
  overlay: {
    position: "relative",
    zIndex: 1,
    textAlign: "center",
    padding: "0 24px",
  },
  titleWrapper: {
    position: "relative",
    display: "inline-flex",
    justifyContent: "center",
    width: "100%",
    marginBottom: "20px",
  },
  titleBackdrop: {
    position: "absolute",
    inset: "-12px 0 0",
    margin: "0 auto",
    width: "min(90vw, 480px)",
    height: "180px",
    background: "rgba(255, 255, 255, 0.15)",
    borderRadius: "40px",
    filter: "blur(10px)",
    zIndex: 0,
  },
  eyebrow: {
    fontSize: "12px",
    fontWeight: "600",
    letterSpacing: "3px",
    textTransform: "uppercase",
    color: "var(--accent)",
    marginBottom: "16px",
  },
  title: {
    position: "relative",
    zIndex: 1,
    fontSize: "clamp(48px, 10vw, 96px)",
    fontWeight: "700",
    lineHeight: 1.05,
    color: "#fff",
    marginBottom: "20px",
  },
  subtitle: {
    fontSize: "clamp(16px, 2.5vw, 20px)",
    color: "rgba(255,255,255,0.7)",
    marginBottom: "36px",
  },
  buttons: {
    display: "flex",
    gap: "12px",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  primary: {
    background: "var(--accent)",
    color: "#0a0a0a",
    padding: "14px 28px",
    borderRadius: "8px",
    fontWeight: "700",
    fontSize: "15px",
    textDecoration: "none",
    transition: "opacity 0.2s",
  },
  secondary: {
    background: "rgba(255,255,255,0.1)",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.3)",
    padding: "14px 28px",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "15px",
    textDecoration: "none",
  },
  scrollHint: {
    position: "absolute",
    bottom: "32px",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
    zIndex: 1,
  },
  scrollLine: {
    width: "1px",
    height: "40px",
    background: "rgba(255,255,255,0.4)",
    animation: "scrollPulse 2s infinite",
  },
  scrollText: {
    fontSize: "11px",
    letterSpacing: "2px",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.4)",
  },

  // STATS BAR
  statsBar: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "0",
    background: "var(--surface)",
    borderBottom: "1px solid var(--border)",
    padding: "24px 40px",
  },
  statItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "0 40px",
    gap: "4px",
  },
  statNum: {
    fontSize: "28px",
    fontWeight: "700",
    color: "var(--accent)",
  },
  statLabel: {
    fontSize: "12px",
    color: "var(--text2)",
    letterSpacing: "1px",
    textTransform: "uppercase",
  },
  statDivider: {
    width: "1px",
    height: "40px",
    background: "var(--border)",
  },

  // FEATURES
  features: {
    padding: "100px 24px",
    textAlign: "center",
    maxWidth: "1100px",
    margin: "0 auto",
  },
  sectionEyebrow: {
    fontSize: "12px",
    fontWeight: "600",
    letterSpacing: "3px",
    textTransform: "uppercase",
    color: "var(--accent)",
    marginBottom: "12px",
  },
  sectionTitle: {
    fontSize: "clamp(28px, 5vw, 42px)",
    fontWeight: "700",
    marginBottom: "60px",
    color: "var(--text)",
    lineHeight: 1.2,
  },
  featureGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "24px",
  },

  // EVENTS
  events: {
    padding: "100px 24px",
    textAlign: "center",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  eventGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "24px",
    marginTop: "40px",
  },
  empty: {
    color: "var(--text2)",
    marginTop: "40px",
  },
  viewAll: {
    marginTop: "48px",
  },
  viewAllBtn: {
    color: "var(--accent)",
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "16px",
    borderBottom: "1px solid var(--accent)",
    paddingBottom: "2px",
  },

  // CTA
  cta: {
    padding: "80px 24px",
    background: "var(--surface)",
    borderTop: "1px solid var(--border)",
  },
  ctaInner: {
    maxWidth: "600px",
    margin: "0 auto",
    textAlign: "center",
  },
  ctaTitle: {
    fontSize: "clamp(28px, 5vw, 40px)",
    fontWeight: "700",
    marginBottom: "16px",
    color: "var(--text)",
  },
  ctaText: {
    color: "var(--text2)",
    fontSize: "16px",
    marginBottom: "32px",
    lineHeight: 1.7,
  },
  ctaBtn: {
    background: "var(--accent)",
    color: "#0a0a0a",
    padding: "14px 32px",
    borderRadius: "8px",
    fontWeight: "700",
    fontSize: "15px",
    textDecoration: "none",
    display: "inline-block",
  },
};

export default Home;