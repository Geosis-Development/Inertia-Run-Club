import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import EventCard from "../components/EventCard";

function Activities() {
  const [runs, setRuns] = useState([]);
  const [members, setMembers] = useState(0);
  const [gallery, setGallery] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const unsubscribeRuns = onSnapshot(
      collection(db, "runs"),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRuns(data);

        const uniqueMembers = new Set();
        data.forEach((run) => {
          run.participants?.forEach((p) => {
            uniqueMembers.add(p.email || p.uid);
          });
        });
        setMembers(uniqueMembers.size);
      }
    );

    const unsubscribeGallery = onSnapshot(
      collection(db, "gallery"),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setGallery(data);
      }
    );

    return () => {
      unsubscribeRuns();
      unsubscribeGallery();
    };
  }, []);

  const filters = ["all", "upcoming", "past"];

  const now = new Date();
  const filteredRuns = runs.filter((run) => {
    if (filter === "all") return true;
    const runDate = new Date(run.date);
    if (filter === "upcoming") return isNaN(runDate) || runDate >= now;
    if (filter === "past") return !isNaN(runDate) && runDate < now;
    return true;
  });

  return (
    <div style={styles.page}>

      {/* HERO */}
      <section style={styles.hero}>
        <p style={styles.eyebrow}>Get Moving</p>
        <h1 style={styles.heroTitle}>Activities</h1>
        <p style={styles.heroSubtitle}>
          Every run is a chance to push further. Join us on the road.
        </p>
      </section>

      {/* STATS */}
      <section style={styles.statsBar}>
        <div style={styles.statItem}>
          <span style={styles.statNum}>{runs.length}</span>
          <span style={styles.statLabel}>Total Runs</span>
        </div>
        <div style={styles.statDivider} />
        <div style={styles.statItem}>
          <span style={styles.statNum}>{members}</span>
          <span style={styles.statLabel}>Unique Runners</span>
        </div>
        <div style={styles.statDivider} />
        <div style={styles.statItem}>
          <span style={styles.statNum}>
            {runs.reduce((sum, r) => sum + (r.participants?.length || 0), 0)}
          </span>
          <span style={styles.statLabel}>Total Participations</span>
        </div>
      </section>

      {/* RUNS */}
      <section style={styles.runsSection}>

        <div style={styles.filterRow}>
          {filters.map((f) => (
            <button
              key={f}
              style={{
                ...styles.filterBtn,
                background: filter === f ? "var(--accent)" : "var(--surface)",
                color: filter === f ? "#0a0a0a" : "var(--text2)",
                border: filter === f ? "1px solid var(--accent)" : "1px solid var(--border)",
              }}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {filteredRuns.length === 0 ? (
          <p style={styles.empty}>No runs found.</p>
        ) : (
          <div style={styles.grid}>
            {filteredRuns.map((run) => (
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

      </section>

      {/* GALLERY */}
      {gallery.length > 0 && (
        <section style={styles.gallerySection}>
          <p style={styles.eyebrow}>Moments in Motion</p>
          <h2 style={styles.galleryTitle}>From the streets</h2>
          <p style={styles.gallerySubtitle}>
            A glimpse into our community, our runs, and our shared passion.
          </p>

          <div style={styles.masonry}>
            {gallery.map((img) => (
              <img
                key={img.id}
                src={img.image}
                alt={img.caption || "Run photo"}
                style={styles.masonryImage}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.03)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}

const styles = {
  page: {
    marginTop: "64px",
  },

  // HERO
  hero: {
    padding: "80px 24px",
    textAlign: "center",
    background: "var(--surface)",
    borderBottom: "1px solid var(--border)",
  },
  eyebrow: {
    fontSize: "12px",
    fontWeight: "600",
    letterSpacing: "3px",
    textTransform: "uppercase",
    color: "var(--accent)",
    marginBottom: "12px",
  },
  heroTitle: {
    fontSize: "clamp(36px, 7vw, 64px)",
    fontWeight: "700",
    color: "var(--text)",
    marginBottom: "16px",
  },
  heroSubtitle: {
    color: "var(--text2)",
    fontSize: "16px",
    maxWidth: "440px",
    margin: "0 auto",
    lineHeight: 1.7,
  },

  // STATS
  statsBar: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    padding: "32px 24px",
    borderBottom: "1px solid var(--border)",
    background: "var(--bg)",
    gap: "0",
  },
  statItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "0 48px",
    gap: "4px",
  },
  statNum: {
    fontSize: "36px",
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

  // RUNS
  runsSection: {
    padding: "60px 24px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  filterRow: {
    display: "flex",
    gap: "10px",
    marginBottom: "40px",
    flexWrap: "wrap",
  },
  filterBtn: {
    padding: "8px 20px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "24px",
  },
  empty: {
    color: "var(--text2)",
    textAlign: "center",
    padding: "60px 0",
  },

  // GALLERY
  gallerySection: {
    padding: "80px 24px",
    background: "var(--surface)",
    borderTop: "1px solid var(--border)",
    textAlign: "center",
  },
  galleryTitle: {
    fontSize: "clamp(28px, 5vw, 42px)",
    fontWeight: "700",
    color: "var(--text)",
    marginBottom: "12px",
  },
  gallerySubtitle: {
    color: "var(--text2)",
    marginBottom: "48px",
    fontSize: "15px",
  },
  masonry: {
    columnCount: 3,
    columnGap: "16px",
    maxWidth: "1100px",
    margin: "0 auto",
  },
  masonryImage: {
    width: "100%",
    marginBottom: "16px",
    borderRadius: "10px",
    transition: "transform 0.3s ease",
    cursor: "pointer",
    display: "block",
  },
};

export default Activities;