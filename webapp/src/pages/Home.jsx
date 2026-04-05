import { useState, useEffect, useRef } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import AnimatedText from "../components/AnimatedText";
import FeatureCard from "../components/FeatureCard";
import EventCard from "../components/EventCard";
import RunGallery from "../components/RunGallery";


function useCountUp(target, duration = 1500, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start || target === 0) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, start]);
  return count;
}

function StatItem({ num, label, suffix = "", start }) {
  const count = useCountUp(typeof num === "number" ? num : 0, 1500, start);
  return (
    <div style={styles.statItem}>
      <span style={styles.statNum}>
        {typeof num === "number" ? count : num}{suffix}
      </span>
      <span style={styles.statLabel}>{label}</span>
    </div>
  );
}

export default function Home() {
  const [runs, setRuns] = useState([]);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef(null);

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const featuredRuns = runs.slice(0, 3);

  return (
    <div style={styles.page}>

      {/* ── HERO ── */}
      <div style={styles.hero}>
        <div style={{
          ...styles.video,
            backgroundImage: `url(https://i.ibb.co/F4FvDBhB/IMG-2870.jpg)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
        }} />

        <div style={styles.heroOverlay} />

        <div style={styles.heroContent}>
          <div style={styles.heroBadge}>
            <span style={styles.heroBadgeDot} />
            Panvel's Homegrown Run Club
          </div>

          <AnimatedText
            text="Inertia Run Club"
            element="h1"
            style={styles.heroTitle}
            stagger={120}
            delay={200}
          />

          <AnimatedText
            text="Every Sunday. Every pace. Every person."
            element="p"
            style={styles.heroSubtitle}
            stagger={60}
            delay={600}
          />

          <div style={styles.heroBtns}>
            <Link to="/activities" style={styles.primaryBtn}>
              Join Next Run
            </Link>
            <Link to="/about" style={styles.ghostBtn}>
              Our Story →
            </Link>
          </div>
        </div>

        
      </div>

      {/* ── STATS BAR ── */}
      <div ref={statsRef} style={styles.statsBar}>
        <StatItem num={runs.length} label="Runs Organised" start={statsVisible} />
        <div style={styles.statDivider} />
        <StatItem num="5" label="km Every Sunday" start={statsVisible} suffix="km" />
        <div style={styles.statDivider} />
        <StatItem num="6:30" label="AM Meetup Time" start={statsVisible} />
        <div style={styles.statDivider} />
        <StatItem num="Panvel" label="Base Location" start={statsVisible} />
      </div>

      {/* ── WHY RUN WITH INERTIA ── */}
      <section style={styles.featuresSection}>
        <div style={styles.featuresInner}>
          <div style={styles.featuresMeta}>
            <p style={styles.eyebrow}>Why Run With Us</p>
            <AnimatedText
              text="Built for the streets. Made for the crew."
              element="h2"
              style={styles.sectionTitle}
              stagger={80}
            />
          </div>

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
        </div>
      </section>

      {/* ── SUNDAY RUNS ── */}
      <RunGallery />

      {/* ── UPCOMING RUNS ── */}
      <section style={styles.eventsSection}>
        <div style={styles.eventsInner}>
          <div style={styles.eventsHeader}>
            <div>
              <p style={styles.eyebrow}>What's Coming</p>
              <AnimatedText
                text="Upcoming Runs"
                element="h2"
                style={styles.sectionTitle}
                stagger={80}
              />
            </div>
            <Link to="/activities" style={styles.viewAllLink}>
              View All →
            </Link>
          </div>

          {featuredRuns.length === 0 ? (
            <div style={styles.emptyState}>
              <p style={styles.emptyText}>No upcoming runs. Check back soon.</p>
            </div>
          ) : (
            <div style={styles.eventGrid}>
              {featuredRuns.map((run, i) => (
                <div
                  key={run.id}
                  style={{
                    ...styles.eventCardWrapper,
                    transitionDelay: `${i * 100}ms`,
                  }}
                >
                  <EventCard
                    id={run.id}
                    title={run.title}
                    description={run.postRun}
                    date={run.date}
                    location={run.location}
                    time={run.time}
                    image={run.image}
                    meetupLocation={run.meetupLocation}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={styles.ctaSection}>
        <div style={styles.ctaInner}>
          <p style={styles.eyebrow}>Ready?</p>
          <AnimatedText
            text="Come run with us."
            element="h2"
            style={styles.ctaTitle}
            stagger={100}
          />
          <p style={styles.ctaText}>
            No experience needed. Just show up, lace up, and keep moving.
          </p>
          <div style={styles.ctaBtns}>
            <Link to="/activities" style={styles.primaryBtn}>
              See Next Run
            </Link>
            <Link to="/leaderboard" style={styles.ghostBtn}>
              View Leaderboard →
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

const styles = {
  page: { marginTop: "0" },

  // HERO
  hero: {
    height: "100svh",
    minHeight: "600px",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  video: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    zIndex: 0,
  },
  heroOverlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 60%, rgba(0,0,0,0.85) 100%)",
    zIndex: 1,
  },
  heroContent: {
    position: "relative",
    zIndex: 2,
    textAlign: "center",
    padding: "0 24px",
    maxWidth: "800px",
    width: "100%",
  },
  heroBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "20px",
    padding: "6px 16px",
    fontSize: "12px",
    fontWeight: "500",
    color: "rgba(255,255,255,0.8)",
    letterSpacing: "1px",
    marginBottom: "24px",
    backdropFilter: "blur(8px)",
  },
  heroBadgeDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "var(--accent)",
    animation: "pulse 2s infinite",
  },
  heroTitle: {
    fontSize: "clamp(40px, 9vw, 88px)",
    fontWeight: "700",
    lineHeight: 1.0,
    color: "#fff",
    marginBottom: "20px",
    letterSpacing: "-1px",
  },
  heroSubtitle: {
    fontSize: "clamp(15px, 2.5vw, 18px)",
    color: "rgba(255,255,255,0.6)",
    marginBottom: "40px",
    letterSpacing: "0.3px",
  },
  heroBtns: {
    display: "flex",
    gap: "12px",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  primaryBtn: {
    background: "var(--accent)",
    color: "#0a0a0a",
    padding: "14px 28px",
    borderRadius: "8px",
    fontWeight: "700",
    fontSize: "14px",
    textDecoration: "none",
    letterSpacing: "0.3px",
    transition: "opacity 0.2s, transform 0.2s",
    display: "inline-block",
  },
  ghostBtn: {
    background: "rgba(255,255,255,0.08)",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.2)",
    padding: "14px 28px",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "14px",
    textDecoration: "none",
    backdropFilter: "blur(8px)",
    display: "inline-block",
  },
  scrollIndicator: {
    position: "absolute",
    bottom: "40px",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
    zIndex: 2,
  },
  scrollTrack: {
    width: "1px",
    height: "48px",
    background: "rgba(255,255,255,0.2)",
    position: "relative",
    overflow: "hidden",
  },
  scrollThumb: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "40%",
    background: "var(--accent)",
    animation: "scrollDown 2s ease infinite",
  },
  scrollLabel: {
    fontSize: "10px",
    letterSpacing: "3px",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.35)",
  },

  // STATS
  statsBar: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    background: "var(--surface)",
    borderBottom: "1px solid var(--border)",
    padding: "32px 24px",
    gap: "0",
  },
  statItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "8px 48px",
    gap: "6px",
  },
  statNum: {
    fontSize: "clamp(22px, 4vw, 32px)",
    fontWeight: "700",
    color: "var(--accent)",
    letterSpacing: "-0.5px",
  },
  statLabel: {
    fontSize: "11px",
    color: "var(--text2)",
    letterSpacing: "1.5px",
    textTransform: "uppercase",
    fontWeight: "500",
  },
  statDivider: {
    width: "1px",
    height: "40px",
    background: "var(--border)",
  },

  // FEATURES
  featuresSection: {
    padding: "120px 24px",
    background: "var(--bg)",
  },
  featuresInner: {
    maxWidth: "1100px",
    margin: "0 auto",
  },
  featuresMeta: {
    marginBottom: "64px",
  },
  eyebrow: {
    fontSize: "11px",
    fontWeight: "600",
    letterSpacing: "3px",
    textTransform: "uppercase",
    color: "var(--accent)",
    marginBottom: "16px",
    display: "block",
  },
  sectionTitle: {
    fontSize: "clamp(26px, 5vw, 42px)",
    fontWeight: "700",
    color: "var(--text)",
    lineHeight: 1.15,
    letterSpacing: "-0.5px",
    maxWidth: "500px",
  },
  featureGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
  },

  // EVENTS
  eventsSection: {
    padding: "120px 24px",
    background: "var(--surface)",
    borderTop: "1px solid var(--border)",
  },
  eventsInner: {
    maxWidth: "1200px",
    margin: "0 auto",
  },
  eventsHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: "48px",
    flexWrap: "wrap",
    gap: "16px",
  },
  viewAllLink: {
    color: "var(--accent)",
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "14px",
    letterSpacing: "0.3px",
    borderBottom: "1px solid var(--accent)",
    paddingBottom: "2px",
  },
  eventGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
  },
  eventCardWrapper: {
    transition: "transform 0.3s ease, opacity 0.3s ease",
  },
  emptyState: {
    textAlign: "center",
    padding: "80px 0",
  },
  emptyText: {
    color: "var(--text2)",
    fontSize: "15px",
  },

  // CTA
  ctaSection: {
    padding: "120px 24px",
    background: "var(--bg)",
    borderTop: "1px solid var(--border)",
    textAlign: "center",
  },
  ctaInner: {
    maxWidth: "600px",
    margin: "0 auto",
  },
  ctaTitle: {
    fontSize: "clamp(32px, 6vw, 56px)",
    fontWeight: "700",
    color: "var(--text)",
    letterSpacing: "-0.5px",
    marginBottom: "20px",
    lineHeight: 1.1,
  },
  ctaText: {
    color: "var(--text2)",
    fontSize: "16px",
    lineHeight: 1.7,
    marginBottom: "40px",
  },
  ctaBtns: {
    display: "flex",
    gap: "12px",
    justifyContent: "center",
    flexWrap: "wrap",
  },
};