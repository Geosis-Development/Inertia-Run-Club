import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, onSnapshot, doc, setDoc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

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

function RunnerProfile() {

  const { email } = useParams();

  const [runs, setRuns] = useState([]);
  const [runnerRuns, setRunnerRuns] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [stravaImages, setStravaImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setCurrentUser(u));
    return () => unsub();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "runs"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setRuns(data);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const joined = runs.filter((run) =>
      run.participants?.find((p) => p.email === email)
    );
    setRunnerRuns(joined);
  }, [runs, email]);

  // Load Strava images from Firestore
  useEffect(() => {
    const encodedEmail = email.replace(/\./g, "_");
    const docRef = doc(db, "runnerProfiles", encodedEmail);
    const unsub = onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        setStravaImages(snap.data().stravaImages || []);
      }
    });
    return () => unsub();
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
      const currentImages = existing.exists() ? existing.data().stravaImages || [] : [];

      await setDoc(docRef, {
        stravaImages: [...currentImages, imageUrl]
      }, { merge: true });

    } catch (err) {
      alert("Upload failed. Try again.");
      console.error(err);
    }

    setUploading(false);
  };

  const runner = runnerRuns[0]?.participants?.find((p) => p.email === email);
  const totalKm = runnerRuns.reduce((sum, run) => sum + (parseFloat(run.distance) || 0), 0);
  const zone = getZone(runnerRuns.length);
  const score = runnerRuns.length * 100 + totalKm * 5;
  const isOwnProfile = currentUser?.email === email;

  if (!runner) {
    return <div style={{ padding: "80px" }}>Runner not found</div>;
  }

  return (
    <div style={styles.container}>

      {/* PROFILE HEADER */}
      <div style={styles.profileHeader}>
        <img src={runner.avatar} style={styles.avatar} alt={runner.name} />
        <h1 style={styles.name}>{runner.name}</h1>

        <div style={{
          ...styles.zoneBadge,
          background: zone.color + "22",
          border: `1px solid ${zone.color}`,
          color: zone.color,
        }}>
          {zone.emoji} {zone.name}
        </div>
      </div>

      {/* STATS ROW */}
      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{runnerRuns.length}</div>
          <div style={styles.statLabel}>Runs Joined</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{totalKm.toFixed(1)}</div>
          <div style={styles.statLabel}>Total km</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{Math.round(score)}</div>
          <div style={styles.statLabel}>Score</div>
        </div>
      </div>

      {/* STRAVA STATS */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>📊 Strava Stats</h2>

        {isOwnProfile && (
          <div style={styles.uploadBox}>
            <p style={styles.uploadHint}>
              Download your Strava summary image and upload it here to show your stats.
            </p>
            <label style={styles.uploadButton}>
              {uploading ? "Uploading..." : "Upload Strava Stats Image"}
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
              <img key={i} src={url} style={styles.stravaImage} alt={`Strava stats ${i + 1}`} />
            ))}
          </div>
        ) : (
          <p style={styles.emptyText}>No Strava stats uploaded yet.</p>
        )}
      </div>

      {/* RUNS JOINED */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Runs Joined</h2>
        <div style={styles.runList}>
          {runnerRuns.map((run) => (
            <div key={run.id} style={styles.runCard}>
              <h3 style={styles.runTitle}>{run.title}</h3>
              <p style={styles.runMeta}>{run.date} • {run.location} • {run.distance || 0}km</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

const styles = {
  container: { padding: "80px 40px", maxWidth: "900px", margin: "auto" },
  profileHeader: { textAlign: "center", marginBottom: "40px" },
  avatar: { width: "120px", height: "120px", borderRadius: "50%", marginBottom: "20px", objectFit: "cover" },
  name: { fontSize: "32px", marginBottom: "12px" },
  zoneBadge: { display: "inline-block", padding: "6px 16px", borderRadius: "20px", fontWeight: "600", fontSize: "14px" },
  statsRow: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginBottom: "60px" },
  statCard: { background: "#111", padding: "25px", borderRadius: "12px", textAlign: "center" },
  statNumber: { fontSize: "36px", fontWeight: "700", color: "#e6d28f", marginBottom: "8px" },
  statLabel: { color: "#aaa", fontSize: "14px" },
  section: { marginBottom: "50px" },
  sectionTitle: { color: "#e6d28f", fontSize: "24px", marginBottom: "20px" },
  uploadBox: { background: "#111", padding: "25px", borderRadius: "12px", marginBottom: "20px", textAlign: "center" },
  uploadHint: { color: "#aaa", marginBottom: "15px", fontSize: "14px" },
  uploadButton: { background: "#e6d28f", color: "#000", padding: "10px 20px", borderRadius: "6px", fontWeight: "600", cursor: "pointer", fontSize: "14px" },
  stravaGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" },
  stravaImage: { width: "100%", borderRadius: "12px", objectFit: "cover" },
  emptyText: { color: "#555", fontStyle: "italic" },
  runList: { display: "flex", flexDirection: "column", gap: "15px" },
  runCard: { background: "#111", padding: "20px", borderRadius: "10px" },
  runTitle: { marginBottom: "6px" },
  runMeta: { color: "#aaa", fontSize: "14px" },
};

export default RunnerProfile;