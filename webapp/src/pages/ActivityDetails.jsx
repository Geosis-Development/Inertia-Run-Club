import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  doc, updateDoc, arrayUnion, arrayRemove, onSnapshot
} from "firebase/firestore";
import { db, auth } from "../firebase";

function ActivityDetails() {
  const { id } = useParams();
  const [run, setRun] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [joined, setJoined] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const runRef = doc(db, "runs", id);
    const unsubscribe = onSnapshot(runRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setRun(data);
        const participantList = data.participants || [];
        setParticipants(participantList);
        if (auth.currentUser) {
          setJoined(!!participantList.find((p) => p.uid === auth.currentUser.uid));
        }
      }
    });
    return () => unsubscribe();
  }, [id]);

  const joinRun = async () => {
    if (!auth.currentUser) {
      alert("Please login first.");
      return;
    }
    setLoading(true);
    await updateDoc(doc(db, "runs", id), {
      participants: arrayUnion({
        uid: auth.currentUser.uid,
        name: auth.currentUser.displayName,
        avatar: auth.currentUser.photoURL,
        email: auth.currentUser.email,
      }),
    });
    setLoading(false);
  };

  const leaveRun = async () => {
    if (!auth.currentUser) return;
    setLoading(true);
    await updateDoc(doc(db, "runs", id), {
      participants: arrayRemove({
        uid: auth.currentUser.uid,
        name: auth.currentUser.displayName,
        avatar: auth.currentUser.photoURL,
        email: auth.currentUser.email,
      }),
    });
    setLoading(false);
  };

  if (!run) {
    return (
      <div style={styles.loading}>
        <div style={styles.loadingDot} />
        <p style={{ color: "var(--text2)", marginTop: "16px" }}>Loading run details...</p>
      </div>
    );
  }

  return (
    <div style={styles.page}>

      {/* HERO */}
      <div
        style={{
          ...styles.hero,
          backgroundImage: `url(${run.image})`,
        }}
      >
        <div style={styles.heroOverlay}>
          <p style={styles.eyebrow}>Run Details</p>
          <h1 style={styles.heroTitle}>{run.title}</h1>
        </div>
      </div>

      {/* INFO BAR */}
      <div style={styles.infoBar}>
        <div style={styles.infoItem}>
          <span style={styles.infoIcon}>📅</span>
          <div>
            <p style={styles.infoLabel}>Date</p>
            <p style={styles.infoValue}>{run.date}</p>
          </div>
        </div>
        <div style={styles.infoDivider} />
        <div style={styles.infoItem}>
          <span style={styles.infoIcon}>📍</span>
          <div>
            <p style={styles.infoLabel}>Location</p>
            <p style={styles.infoValue}>{run.location}</p>
          </div>
        </div>
        <div style={styles.infoDivider} />
        <div style={styles.infoItem}>
          <span style={styles.infoIcon}>⏰</span>
          <div>
            <p style={styles.infoLabel}>Time</p>
            <p style={styles.infoValue}>{run.time}</p>
          </div>
        </div>
        <div style={styles.infoDivider} />
        <div style={styles.infoItem}>
          <span style={styles.infoIcon}>🏃</span>
          <div>
            <p style={styles.infoLabel}>Distance</p>
            <p style={styles.infoValue}>{run.distance || "?"} km</p>
          </div>
        </div>
      </div>

      <div style={styles.container}>

        {/* JOIN / LEAVE */}
        <div style={styles.joinSection}>
          <div style={styles.participantCount}>
            <span style={styles.countNum}>{participants.length}</span>
            <span style={styles.countLabel}>runners joined</span>
          </div>

          {joined ? (
            <button
              style={styles.leaveBtn}
              onClick={leaveRun}
              disabled={loading}
            >
              {loading ? "..." : "✓ You're in — Leave Run"}
            </button>
          ) : (
            <button
              style={styles.joinBtn}
              onClick={joinRun}
              disabled={loading}
            >
              {loading ? "..." : "Join This Run →"}
            </button>
          )}
        </div>

        {/* MEETING POINT */}
        {run.location && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Meeting Point</h2>
            <div style={styles.mapWrapper}>
              <iframe
                src={`https://maps.google.com/maps?q=${encodeURIComponent(run.location)}&output=embed`}
                width="100%"
                height="340"
                loading="lazy"
                style={styles.map}
              />
            </div>
            
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(run.location)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={styles.mapBtn}
            >
              Open in Google Maps →
            </a>
          </div>
        )}

        {/* ROUTE MAP */}
        {run.routeMap && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Running Route</h2>
            <div style={styles.mapWrapper}>
              <iframe
                src={`https://maps.google.com/maps?q=${encodeURIComponent(run.routeMap)}&output=embed`}
                width="100%"
                height="340"
                loading="lazy"
                style={styles.map}
              />
            </div>
            
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(run.routeMap)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={styles.mapBtn}
            >
              Open Route in Google Maps →
            </a>
          </div>
        )}

        {/* POST RUN PLAN */}
        {run.postRun && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Post Run Plan</h2>
            <p style={styles.text}>{run.postRun}</p>
          </div>
        )}

        {/* PARTICIPANTS */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>
            Who's Running ({participants.length})
          </h2>

          {participants.length === 0 ? (
            <p style={styles.emptyText}>
              No one's joined yet. Be the first!
            </p>
          ) : (
            <div style={styles.participants}>
              {participants.map((p, index) => (
                <Link
                  key={index}
                  to={`/runner/${p.email}`}
                  style={styles.runnerCard}
                >
                  <img src={p.avatar} style={styles.avatar} alt={p.name} />
                  <p style={styles.runnerName}>{p.name?.split(" ")[0]}</p>
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

const styles = {
  page: {
    marginTop: "64px",
  },
  loading: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "60vh",
  },
  loadingDot: {
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    background: "var(--accent)",
    animation: "pulse 1.5s infinite",
  },

  // HERO
  hero: {
    height: "360px",
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative",
  },
  heroOverlay: {
    background: "rgba(0,0,0,0.55)",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "0 24px",
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
    fontSize: "clamp(28px, 6vw, 56px)",
    fontWeight: "700",
    color: "#fff",
  },

  // INFO BAR
  infoBar: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    background: "var(--surface)",
    borderBottom: "1px solid var(--border)",
    padding: "24px",
    gap: "0",
  },
  infoItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "0 32px",
  },
  infoIcon: {
    fontSize: "20px",
  },
  infoLabel: {
    fontSize: "11px",
    color: "var(--text2)",
    textTransform: "uppercase",
    letterSpacing: "1px",
    marginBottom: "2px",
  },
  infoValue: {
    fontSize: "15px",
    fontWeight: "600",
    color: "var(--text)",
  },
  infoDivider: {
    width: "1px",
    height: "40px",
    background: "var(--border)",
  },

  // CONTAINER
  container: {
    padding: "60px 24px",
    maxWidth: "900px",
    margin: "0 auto",
  },

  // JOIN SECTION
  joinSection: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "16px",
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "16px",
    padding: "24px 32px",
    marginBottom: "48px",
  },
  participantCount: {
    display: "flex",
    alignItems: "baseline",
    gap: "8px",
  },
  countNum: {
    fontSize: "42px",
    fontWeight: "700",
    color: "var(--accent)",
  },
  countLabel: {
    fontSize: "15px",
    color: "var(--text2)",
  },
  joinBtn: {
    background: "var(--accent)",
    color: "#0a0a0a",
    border: "none",
    padding: "14px 28px",
    borderRadius: "8px",
    fontWeight: "700",
    fontSize: "15px",
    cursor: "pointer",
    transition: "opacity 0.2s",
  },
  leaveBtn: {
    background: "none",
    color: "var(--text2)",
    border: "1px solid var(--border)",
    padding: "14px 28px",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "15px",
    cursor: "pointer",
  },

  // SECTIONS
  section: {
    marginBottom: "48px",
  },
  sectionTitle: {
    fontSize: "20px",
    fontWeight: "700",
    color: "var(--text)",
    marginBottom: "20px",
    paddingBottom: "12px",
    borderBottom: "1px solid var(--border)",
  },
  text: {
    color: "var(--text2)",
    lineHeight: "1.8",
    fontSize: "15px",
  },
  mapWrapper: {
    borderRadius: "12px",
    overflow: "hidden",
    marginBottom: "12px",
    border: "1px solid var(--border)",
  },
  map: {
    border: "none",
    display: "block",
  },
  mapBtn: {
    display: "inline-block",
    padding: "10px 18px",
    background: "var(--accent)",
    color: "#0a0a0a",
    textDecoration: "none",
    borderRadius: "6px",
    fontWeight: "600",
    fontSize: "13px",
  },

  // PARTICIPANTS
  participants: {
    display: "flex",
    gap: "16px",
    flexWrap: "wrap",
  },
  runnerCard: {
    textAlign: "center",
    textDecoration: "none",
    color: "var(--text)",
    transition: "transform 0.2s",
  },
  avatar: {
    width: "64px",
    height: "64px",
    borderRadius: "50%",
    objectFit: "cover",
    marginBottom: "6px",
    border: "2px solid var(--border)",
    display: "block",
  },
  runnerName: {
    fontSize: "12px",
    color: "var(--text2)",
  },
  emptyText: {
    color: "var(--text3)",
    fontStyle: "italic",
    fontSize: "14px",
  },
};

export default ActivityDetails;