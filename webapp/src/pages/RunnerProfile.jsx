import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
  collection, onSnapshot, doc, setDoc, getDoc
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const ZONES = [
  { name: "Pacer Elite", emoji: "⚡", min: 20, color: "#00f5a0" },
  { name: "Fired Up",    emoji: "🔥", min: 12, color: "#FF6B35" },
  { name: "Grinder",     emoji: "💪", min: 6,  color: "#4cafef" },
  { name: "On The Move", emoji: "🏃", min: 2,  color: "#b388ff" },
  { name: "Fresh Legs",  emoji: "🌱", min: 0,  color: "#aaa"    },
];

function getZone(runs) {
  return ZONES.find((z) => runs >= z.min) || ZONES[ZONES.length - 1];
}

function getProgress(runs) {
  const currentIndex = ZONES.findIndex((z) => runs >= z.min);
  if (currentIndex <= 0) return 100;
  const current = ZONES[currentIndex];
  const next = ZONES[currentIndex - 1];
  return Math.round(((runs - current.min) / (next.min - current.min)) * 100);
}

function getNextZone(runs) {
  const currentIndex = ZONES.findIndex((z) => runs >= z.min);
  if (currentIndex <= 0) return null;
  return ZONES[currentIndex - 1];
}

export default function RunnerProfile() {
  const { email } = useParams();

  const [runs, setRuns] = useState([]);
  const [runnerRuns, setRunnerRuns] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [stravaImages, setStravaImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setCurrentUser(u));
    return () => unsub();
  }, []);

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
    const joined = runs.filter((run) =>
      run.participants?.find((p) => p.email === email)
    );
    setRunnerRuns(joined);
  }, [runs, email]);

  useEffect(() => {
    const encodedEmail = email.replace(/\./g, "_");
    const unsub = onSnapshot(doc(db, "runnerProfiles", encodedEmail), (snap) => {
      if (snap.exists()) {
        setStravaImages(snap.data().stravaImages || []);
      }
    });
    return () => unsub();
  }, [email]);

  // Load runner profile from runners collection
  useEffect(() => {
    const fetchProfile = async () => {
      const snapshot = await getDoc(
        doc(db, "runnerProfiles", email.replace(/\./g, "_"))
      );
      if (snapshot.exists()) setProfile(snapshot.data());
    };
    fetchProfile();
  }, [email]);

  const handleStravaUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
        { method: "POST", body: formData }
      );
      const data = await res.json();
      const imageUrl = data.data.url;
      const encodedEmail = email.replace(/\./g, "_");
      const docRef = doc(db, "runnerProfiles", encodedEmail);
      const existing = await getDoc(docRef);
      const currentImages = existing.exists()
        ? existing.data().stravaImages || []
        : [];
      await setDoc(docRef, {
        stravaImages: [...currentImages, imageUrl],
      }, { merge: true });
    } catch (err) {
      alert("Upload failed. Try again.");
      console.error(err);
    }
    setUploading(false);
  };

  const runner = runnerRuns[0]?.participants?.find((p) => p.email === email);
  const totalKm = runnerRuns.reduce(
    (sum, run) => sum + (parseFloat(run.distance) || 0), 0
  );
  const zone = getZone(runnerRuns.length);
  const score = Math.round(runnerRuns.length * 100 + totalKm * 5);
  const progress = getProgress(runnerRuns.length);
  const nextZone = getNextZone(runnerRuns.length);
  const isOwnProfile = currentUser?.email === email;

  if (!runner) {
    return (
      <div style={styles.notFound}>
        <p style={styles.notFoundEmoji}>👟</p>
        <h2 style={styles.notFoundTitle}>Runner not found</h2>
        <p style={styles.notFoundText}>
          This runner hasn't joined any runs yet.
        </p>
      </div>
    );
  }

  return (
    <div style={styles.page}>

      {/* HERO HEADER */}
      <section style={styles.hero}>
        <div style={styles.avatarWrapper}>
          <img
            src={runner.avatar}
            style={{
              ...styles.avatar,
              borderColor: zone.color,
            }}
            alt={runner.name}
          />
          <span style={styles.zoneEmoji}>{zone.emoji}</span>
        </div>

        <h1 style={styles.name}>{runner.name}</h1>
        <p style={styles.email}>{email}</p>

        <div
          style={{
            ...styles.zoneBadge,
            background: zone.color + "18",
            border: `1px solid ${zone.color}55`,
            color: zone.color,
          }}
        >
          {zone.emoji} {zone.name}
        </div>

        {/* PROGRESS TO NEXT ZONE */}
        {nextZone && (
          <div style={styles.progressSection}>
            <div style={styles.progressHeader}>
              <span style={styles.progressText}>
                Progress to {nextZone.emoji} {nextZone.name}
              </span>
              <span style={styles.progressPct}>{progress}%</span>
            </div>
            <div style={styles.progressTrack}>
              <div
                style={{
                  ...styles.progressFill,
                  width: `${progress}%`,
                  background: zone.color,
                }}
              />
            </div>
          </div>
        )}
      </section>

      {/* STATS */}
      <section style={styles.statsBar}>
        <div style={styles.statItem}>
          <span style={styles.statNum}>{runnerRuns.length}</span>
          <span style={styles.statLabel}>Runs Joined</span>
        </div>
        <div style={styles.statDivider} />
        <div style={styles.statItem}>
          <span style={styles.statNum}>{totalKm.toFixed(1)}</span>
          <span style={styles.statLabel}>Total km</span>
        </div>
        <div style={styles.statDivider} />
        <div style={styles.statItem}>
          <span style={styles.statNum}>{score}</span>
          <span style={styles.statLabel}>Score</span>
        </div>
      </section>

      <div style={styles.container}>

        {/* STRAVA STATS */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Strava Stats</h2>

          {isOwnProfile && (
            <div style={styles.uploadBox}>
              <p style={styles.uploadTitle}>Share your Strava summary</p>
              <p style={styles.uploadHint}>
                Open Strava → your activity → share image → upload it here.
              </p>
              <label style={{
                ...styles.uploadBtn,
                opacity: uploading ? 0.6 : 1,
                cursor: uploading ? "not-allowed" : "pointer",
              }}>
                {uploading ? "Uploading..." : "Upload Image"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleStravaUpload}
                  style={{ display: "none" }}
                  disabled={uploading}
                />
              </label>
            </div>
          )}

          {stravaImages.length > 0 ? (
            <div style={styles.stravaGrid}>
              {stravaImages.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  style={styles.stravaImage}
                  alt={`Strava stats ${i + 1}`}
                />
              ))}
            </div>
          ) : (
            <p style={styles.emptyText}>No Strava stats uploaded yet.</p>
          )}
        </div>

        {/* RUNS JOINED */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>
            Runs Joined ({runnerRuns.length})
          </h2>

          {runnerRuns.length === 0 ? (
            <p style={styles.emptyText}>No runs joined yet.</p>
          ) : (
            <div style={styles.runList}>
              {runnerRuns.map((run) => (
                <div key={run.id} style={styles.runCard}>
                  {run.image && (
                    <img
                      src={run.image}
                      style={styles.runImage}
                      alt={run.title}
                    />
                  )}
                  <div style={styles.runInfo}>
                    <h3 style={styles.runTitle}>{run.title}</h3>
                    <p style={styles.runMeta}>
                      {run.date} · {run.location} · {run.distance || "?"}km
                    </p>
                  </div>
                </div>
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

  // NOT FOUND
  notFound: {
    marginTop: "64px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "60vh",
    textAlign: "center",
    padding: "40px 24px",
  },
  notFoundEmoji: {
    fontSize: "64px",
    marginBottom: "20px",
  },
  notFoundTitle: {
    fontSize: "24px",
    fontWeight: "700",
    color: "var(--text)",
    marginBottom: "8px",
  },
  notFoundText: {
    color: "var(--text2)",
    fontSize: "15px",
  },

  // HERO
  hero: {
    padding: "60px 24px 48px",
    textAlign: "center",
    background: "var(--surface)",
    borderBottom: "1px solid var(--border)",
  },
  avatarWrapper: {
    position: "relative",
    display: "inline-block",
    marginBottom: "16px",
  },
  avatar: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "3px solid",
    display: "block",
  },
  zoneEmoji: {
    position: "absolute",
    bottom: "0",
    right: "0",
    fontSize: "20px",
    background: "var(--surface)",
    borderRadius: "50%",
    width: "28px",
    height: "28px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid var(--border)",
  },
  name: {
    fontSize: "clamp(24px, 5vw, 36px)",
    fontWeight: "700",
    color: "var(--text)",
    marginBottom: "4px",
  },
  email: {
    fontSize: "13px",
    color: "var(--text3)",
    marginBottom: "16px",
  },
  zoneBadge: {
    display: "inline-block",
    padding: "6px 16px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "700",
    marginBottom: "24px",
  },
  progressSection: {
    maxWidth: "320px",
    margin: "0 auto",
  },
  progressHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "8px",
  },
  progressText: {
    fontSize: "12px",
    color: "var(--text2)",
  },
  progressPct: {
    fontSize: "12px",
    fontWeight: "700",
    color: "var(--text)",
  },
  progressTrack: {
    height: "6px",
    background: "var(--border)",
    borderRadius: "3px",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: "3px",
    transition: "width 0.8s ease",
  },

  // STATS BAR
  statsBar: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    padding: "28px 24px",
    borderBottom: "1px solid var(--border)",
    background: "var(--bg)",
  },
  statItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "0 40px",
    gap: "4px",
  },
  statNum: {
    fontSize: "32px",
    fontWeight: "700",
    color: "var(--accent)",
  },
  statLabel: {
    fontSize: "11px",
    color: "var(--text2)",
    letterSpacing: "1px",
    textTransform: "uppercase",
  },
  statDivider: {
    width: "1px",
    height: "40px",
    background: "var(--border)",
  },

  // CONTAINER
  container: {
    padding: "48px 24px",
    maxWidth: "800px",
    margin: "0 auto",
  },

  // SECTIONS
  section: {
    marginBottom: "56px",
  },
  sectionTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "var(--text)",
    marginBottom: "20px",
    paddingBottom: "12px",
    borderBottom: "1px solid var(--border)",
  },
  emptyText: {
    color: "var(--text3)",
    fontStyle: "italic",
    fontSize: "14px",
  },

  // STRAVA UPLOAD
  uploadBox: {
    background: "var(--surface)",
    border: "1px dashed var(--border)",
    borderRadius: "12px",
    padding: "28px",
    textAlign: "center",
    marginBottom: "20px",
  },
  uploadTitle: {
    fontWeight: "600",
    color: "var(--text)",
    marginBottom: "6px",
    fontSize: "15px",
  },
  uploadHint: {
    color: "var(--text2)",
    fontSize: "13px",
    marginBottom: "16px",
    lineHeight: 1.6,
  },
  uploadBtn: {
    display: "inline-block",
    background: "var(--accent)",
    color: "#0a0a0a",
    padding: "10px 24px",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "14px",
  },
  stravaGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "16px",
  },
  stravaImage: {
    width: "100%",
    borderRadius: "12px",
    objectFit: "cover",
    border: "1px solid var(--border)",
  },

  // RUNS LIST
  runList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  runCard: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "12px",
    overflow: "hidden",
    padding: "0",
  },
  runImage: {
    width: "80px",
    height: "80px",
    objectFit: "cover",
    flexShrink: 0,
  },
  runInfo: {
    padding: "16px 16px 16px 0",
  },
  runTitle: {
    fontSize: "15px",
    fontWeight: "600",
    color: "var(--text)",
    marginBottom: "4px",
  },
  runMeta: {
    fontSize: "13px",
    color: "var(--text2)",
  },
};