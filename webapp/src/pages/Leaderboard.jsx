import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { Link } from "react-router-dom";
import { db } from "../firebase";

const ZONES = [
  { name: "Pacer Elite", emoji: "⚡", min: 20, color: "#FFD700" },
  { name: "Fired Up",    emoji: "🔥", min: 12, color: "#FF6B35" },
  { name: "Grinder",     emoji: "💪", min: 6,  color: "#4cafef" },
  { name: "On The Move", emoji: "🏃", min: 2,  color: "#aaa" },
  { name: "Fresh Legs",  emoji: "🌱", min: 0,  color: "#7ec87e" },
];

function getZone(runs) {
  return ZONES.find((z) => runs >= z.min) || ZONES[ZONES.length - 1];
}

function Leaderboard() {

  const [leaders, setLeaders] = useState([]);
  const [activeZone, setActiveZone] = useState("All");

  useEffect(() => {

    const unsubscribe = onSnapshot(collection(db, "runs"), (snapshot) => {

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
        }))
        .sort((a, b) => b.score - a.score);

      setLeaders(sorted);

    });

    return () => unsubscribe();

  }, []);

  const filtered = activeZone === "All"
    ? leaders
    : leaders.filter((r) => r.zone.name === activeZone);

  return (
    <div style={styles.container}>

      <div style={styles.header}>
        <h1 style={styles.title}>🏆 Leaderboard</h1>
        <p style={styles.subtitle}>Ranked by attendance + distance</p>
      </div>

      {/* ZONE FILTER TABS */}
      <div style={styles.tabs}>
        {["All", ...ZONES.map((z) => z.name)].map((zone) => (
          <button
            key={zone}
            style={{
              ...styles.tab,
              background: activeZone === zone ? "#e6d28f" : "#111",
              color: activeZone === zone ? "#000" : "#fff",
            }}
            onClick={() => setActiveZone(zone)}
          >
            {zone === "All" ? "All Runners" : `${ZONES.find(z => z.name === zone)?.emoji} ${zone}`}
          </button>
        ))}
      </div>

      {/* ZONE LEGEND */}
      <div style={styles.legend}>
        {ZONES.map((z) => (
          <div key={z.name} style={styles.legendItem}>
            <span style={{ ...styles.legendDot, background: z.color }} />
            <span style={styles.legendText}>
              {z.emoji} {z.name} — {z.min === 20 ? "20+" : z.min === 0 ? "1" : `${z.min}–${ZONES[ZONES.indexOf(z) - 1].min - 1}`} runs
            </span>
          </div>
        ))}
      </div>

      {/* LEADERBOARD LIST */}
      {filtered.length === 0 ? (
        <p style={{ color: "#aaa", textAlign: "center", marginTop: "40px" }}>
          No runners in this zone yet.
        </p>
      ) : (
        filtered.map((runner, index) => (
          <Link
            key={runner.uid}
            to={`/runner/${runner.email}`}
            style={styles.cardLink}
          >
            <div style={styles.card}>

              <div style={styles.rank}>
                {index === 0 && activeZone === "All" ? "🥇" :
                 index === 1 && activeZone === "All" ? "🥈" :
                 index === 2 && activeZone === "All" ? "🥉" :
                 `#${index + 1}`}
              </div>

              <img src={runner.avatar} style={styles.avatar} alt={runner.name} />

              <div style={styles.info}>
                <div style={styles.name}>{runner.name}</div>
                <div style={styles.stats}>
                  {runner.runs} runs • {runner.totalKm.toFixed(1)} km
                </div>
              </div>

              <div style={styles.right}>
                <div
                  style={{
                    ...styles.zoneBadge,
                    background: runner.zone.color + "22",
                    border: `1px solid ${runner.zone.color}`,
                    color: runner.zone.color,
                  }}
                >
                  {runner.zone.emoji} {runner.zone.name}
                </div>
                <div style={styles.score}>{Math.round(runner.score)} pts</div>
              </div>

            </div>
          </Link>
        ))
      )}

    </div>
  );
}

const styles = {
  container: { padding: "80px 40px", maxWidth: "800px", margin: "auto" },
  header: { textAlign: "center", marginBottom: "40px" },
  title: { fontSize: "42px", marginBottom: "10px" },
  subtitle: { color: "#aaa" },
  tabs: { display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "30px", justifyContent: "center" },
  tab: { padding: "8px 16px", borderRadius: "20px", border: "none", cursor: "pointer", fontWeight: "600", fontSize: "13px", transition: "all 0.2s" },
  legend: { display: "flex", flexDirection: "column", gap: "8px", background: "#111", padding: "20px", borderRadius: "12px", marginBottom: "40px" },
  legendItem: { display: "flex", alignItems: "center", gap: "10px" },
  legendDot: { width: "10px", height: "10px", borderRadius: "50%", flexShrink: 0 },
  legendText: { color: "#ccc", fontSize: "14px" },
  cardLink: { textDecoration: "none", color: "white" },
  card: { display: "flex", alignItems: "center", gap: "20px", background: "#111", padding: "18px 20px", borderRadius: "12px", marginBottom: "12px", transition: "background 0.2s" },
  rank: { fontSize: "22px", width: "44px", textAlign: "center", flexShrink: 0 },
  avatar: { width: "52px", height: "52px", borderRadius: "50%", objectFit: "cover", flexShrink: 0 },
  info: { flex: 1 },
  name: { fontWeight: "600", fontSize: "16px", marginBottom: "4px" },
  stats: { color: "#aaa", fontSize: "13px" },
  right: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px" },
  zoneBadge: { padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" },
  score: { color: "#e6d28f", fontWeight: "700", fontSize: "15px" },
};

export default Leaderboard;