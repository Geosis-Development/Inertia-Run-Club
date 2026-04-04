import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { Link } from "react-router-dom";
import { db } from "../firebase";

const ZONES = [
  { name: "Pacer Elite", emoji: "⚡", min: 20, color: "#00f5a0", desc: "20+ runs" },
  { name: "Fired Up",    emoji: "🔥", min: 12, color: "#FF6B35", desc: "12–19 runs" },
  { name: "Grinder",     emoji: "💪", min: 6,  color: "#4cafef", desc: "6–11 runs" },
  { name: "On The Move", emoji: "🏃", min: 2,  color: "#b388ff", desc: "2–5 runs" },
  { name: "Fresh Legs",  emoji: "🌱", min: 0,  color: "#aaa",    desc: "1 run" },
];

function getZone(runs) {
  return ZONES.find((z) => runs >= z.min) || ZONES[ZONES.length - 1];
}

function getNextZone(runs) {
  const currentIndex = ZONES.findIndex((z) => runs >= z.min);
  if (currentIndex <= 0) return null;
  return ZONES[currentIndex - 1];
}

function getProgress(runs) {
  const currentIndex = ZONES.findIndex((z) => runs >= z.min);
  if (currentIndex <= 0) return 100;
  const current = ZONES[currentIndex];
  const next = ZONES[currentIndex - 1];
  return Math.round(((runs - current.min) / (next.min - current.min)) * 100);
}

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [activeZone, setActiveZone] = useState("All");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "runs"), (snapshot) => {
      const runnerMap = {};

      snapshot.docs.forEach((doc) => {
        const run = doc.data();
        const participants = run.participants || [];
        const km = parseFloat(run.distance) || 0;

        participants.forEach((p) => {
          if (!runnerMap[p.uid]) {
            runnerMap[p.uid] = {
              uid: p.uid,
              name: p.name,
              avatar: p.avatar,
              email: p.email,
              runs: 0,
              totalKm: 0,
            };
          }
          runnerMap[p.uid].runs += 1;
          runnerMap[p.uid].totalKm += km;
        });
      });

      const sorted = Object.values(runnerMap)
        .map((r) => ({
          ...r,
          score: r.runs * 100 + r.totalKm * 5,
          zone: getZone(r.runs),
          progress: getProgress(r.runs),
          nextZone: getNextZone(r.runs),
        }))
        .sort((a, b) => b.score - a.score);

      setLeaders(sorted);
      setLoaded(true);
    });

    return () => unsub();
  }, []);

  const filtered = activeZone === "All"
    ? leaders
    : leaders.filter((r) => r.zone.name === activeZone);

  return (
    <div style={styles.page}>

      {/* HERO */}
      <section style={styles.hero}>
        <p style={styles.eyebrow}>Who's Putting In The Work</p>
        <h1 style={styles.heroTitle}>Leaderboard</h1>
        <p style={styles.heroSubtitle}>
          Ranked by consistency. Divided by zone. United by the run.
        </p>
      </section>

      {/* ZONE LEGEND */}
      <section style={styles.legendSection}>
        <div style={styles.legendGrid}>
          {ZONES.map((z) => (
            <div key={z.name} style={styles.legendCard}>
              <span style={styles.legendEmoji}>{z.emoji}</span>
              <p style={{ ...styles.legendName, color: z.color }}>{z.name}</p>
              <p style={styles.legendDesc}>{z.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div style={styles.container}>

        {/* FILTER TABS */}
        <div style={styles.tabs}>
          {["All", ...ZONES.map((z) => z.name)].map((zone) => (
            <button
              key={zone}
              style={{
                ...styles.tab,
                background: activeZone === zone ? "var(--accent)" : "var(--surface)",
                color: activeZone === zone ? "#0a0a0a" : "var(--text2)",
                border: activeZone === zone
                  ? "1px solid var(--accent)"
                  : "1px solid var(--border)",
              }}
              onClick={() => setActiveZone(zone)}
            >
              {zone === "All"
                ? "All Runners"
                : `${ZONES.find((z) => z.name === zone)?.emoji} ${zone}`}
            </button>
          ))}
        </div>

        {/* SUMMARY */}
        <div style={styles.summary}>
          <span style={styles.summaryText}>
            {filtered.length} runner{filtered.length !== 1 ? "s" : ""}
            {activeZone !== "All" ? ` in ${activeZone}` : " total"}
          </span>
        </div>

        {/* LIST */}
        {!loaded ? (
          <div style={styles.loadingRow}>
            <div style={styles.loadingDot} />
            <p style={{ color: "var(--text2)" }}>Loading runners...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={styles.empty}>
            <p style={styles.emptyEmoji}>👟</p>
            <p style={styles.emptyText}>No runners in this zone yet.</p>
            <p style={styles.emptySubtext}>Be the first to join a run!</p>
          </div>
        ) : (
          <div style={styles.list}>
            {filtered.map((runner, index) => {
              const isTop3 = index < 3 && activeZone === "All";
              const medal = index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉";

              return (
                <Link
                  key={runner.uid}
                  to={`/runner/${runner.email}`}
                  style={styles.cardLink}
                >
                  <div
                    style={{
                      ...styles.card,
                      borderColor: isTop3
                        ? runner.zone.color + "66"
                        : "var(--border)",
                      background: isTop3
                        ? runner.zone.color + "08"
                        : "var(--surface)",
                    }}
                  >

                    {/* RANK */}
                    <div style={styles.rank}>
                      {isTop3 ? (
                        <span style={styles.medal}>{medal}</span>
                      ) : (
                        <span style={styles.rankNum}>#{index + 1}</span>
                      )}
                    </div>

                    {/* AVATAR */}
                    <div style={styles.avatarWrapper}>
                      <img
                        src={runner.avatar}
                        style={{
                          ...styles.avatar,
                          borderColor: runner.zone.color,
                        }}
                        alt={runner.name}
                      />
                      <span style={styles.zoneEmoji}>
                        {runner.zone.emoji}
                      </span>
                    </div>

                    {/* INFO */}
                    <div style={styles.info}>
                      <p style={styles.name}>{runner.name}</p>

                      <div style={styles.statsRow}>
                        <span style={styles.stat}>
                          {runner.runs} run{runner.runs !== 1 ? "s" : ""}
                        </span>
                        <span style={styles.statDot}>·</span>
                        <span style={styles.stat}>
                          {runner.totalKm.toFixed(1)} km
                        </span>
                      </div>

                      {/* PROGRESS BAR */}
                      <div style={styles.progressWrapper}>
                        <div style={styles.progressTrack}>
                          <div
                            style={{
                              ...styles.progressFill,
                              width: `${runner.progress}%`,
                              background: runner.zone.color,
                            }}
                          />
                        </div>
                        {runner.nextZone && (
                          <span style={styles.progressLabel}>
                            → {runner.nextZone.emoji} {runner.nextZone.name}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* RIGHT */}
                    <div style={styles.right}>
                      <div
                        style={{
                          ...styles.zoneBadge,
                          background: runner.zone.color + "18",
                          border: `1px solid ${runner.zone.color}55`,
                          color: runner.zone.color,
                        }}
                      >
                        {runner.zone.name}
                      </div>
                      <p style={styles.score}>
                        {Math.round(runner.score)} pts
                      </p>
                    </div>

                  </div>
                </Link>
              );
            })}
          </div>
        )}

      </div>
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

  // LEGEND
  legendSection: {
    padding: "40px 24px",
    borderBottom: "1px solid var(--border)",
    background: "var(--bg)",
  },
  legendGrid: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: "12px",
    maxWidth: "900px",
    margin: "0 auto",
  },
  legendCard: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "12px",
    padding: "16px 24px",
    textAlign: "center",
    minWidth: "120px",
  },
  legendEmoji: {
    fontSize: "24px",
    display: "block",
    marginBottom: "6px",
  },
  legendName: {
    fontSize: "13px",
    fontWeight: "700",
    marginBottom: "4px",
  },
  legendDesc: {
    fontSize: "11px",
    color: "var(--text3)",
  },

  // CONTAINER
  container: {
    padding: "48px 24px",
    maxWidth: "800px",
    margin: "0 auto",
  },

  // TABS
  tabs: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
    marginBottom: "24px",
  },
  tab: {
    padding: "8px 16px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s",
  },

  // SUMMARY
  summary: {
    marginBottom: "24px",
  },
  summaryText: {
    fontSize: "13px",
    color: "var(--text3)",
  },

  // LOADING
  loadingRow: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "60px 0",
    gap: "16px",
  },
  loadingDot: {
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    background: "var(--accent)",
  },

  // EMPTY
  empty: {
    textAlign: "center",
    padding: "80px 0",
  },
  emptyEmoji: {
    fontSize: "48px",
    marginBottom: "16px",
  },
  emptyText: {
    fontSize: "18px",
    fontWeight: "600",
    color: "var(--text)",
    marginBottom: "8px",
  },
  emptySubtext: {
    color: "var(--text2)",
    fontSize: "14px",
  },

  // LIST
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  cardLink: {
    textDecoration: "none",
    color: "var(--text)",
    display: "block",
  },
  card: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "20px",
    borderRadius: "16px",
    border: "1px solid var(--border)",
    transition: "transform 0.15s ease, box-shadow 0.15s ease",
    cursor: "pointer",
  },

  // RANK
  rank: {
    width: "40px",
    textAlign: "center",
    flexShrink: 0,
  },
  medal: {
    fontSize: "28px",
  },
  rankNum: {
    fontSize: "14px",
    fontWeight: "700",
    color: "var(--text3)",
  },

  // AVATAR
  avatarWrapper: {
    position: "relative",
    flexShrink: 0,
  },
  avatar: {
    width: "52px",
    height: "52px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid",
    display: "block",
  },
  zoneEmoji: {
    position: "absolute",
    bottom: "-4px",
    right: "-4px",
    fontSize: "14px",
    background: "var(--bg)",
    borderRadius: "50%",
    width: "20px",
    height: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  // INFO
  info: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontSize: "16px",
    fontWeight: "600",
    color: "var(--text)",
    marginBottom: "4px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  statsRow: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    marginBottom: "8px",
  },
  stat: {
    fontSize: "13px",
    color: "var(--text2)",
  },
  statDot: {
    color: "var(--text3)",
    fontSize: "13px",
  },

  // PROGRESS
  progressWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  progressTrack: {
    flex: 1,
    height: "4px",
    background: "var(--border)",
    borderRadius: "2px",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: "2px",
    transition: "width 0.6s ease",
  },
  progressLabel: {
    fontSize: "11px",
    color: "var(--text3)",
    whiteSpace: "nowrap",
  },

  // RIGHT
  right: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "6px",
    flexShrink: 0,
  },
  zoneBadge: {
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },
  score: {
    fontSize: "14px",
    fontWeight: "700",
    color: "var(--accent)",
  },
};