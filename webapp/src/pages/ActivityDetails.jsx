import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  onSnapshot
} from "firebase/firestore";

import { db, auth } from "../firebase";

function ActivityDetails() {

  const { id } = useParams();

  const [run, setRun] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [joined, setJoined] = useState(false);

  useEffect(() => {

    const runRef = doc(db, "runs", id);

    const unsubscribe = onSnapshot(runRef, (snapshot) => {

      if (snapshot.exists()) {

        const data = snapshot.data();

        setRun(data);

        const participantList = data.participants || [];

        setParticipants(participantList);

        if (auth.currentUser) {

          const exists = participantList.find(
            (p) => p.uid === auth.currentUser.uid
          );

          setJoined(!!exists);

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

    const runRef = doc(db, "runs", id);

    await updateDoc(runRef, {
      participants: arrayUnion({
        uid: auth.currentUser.uid,
        name: auth.currentUser.displayName,
        avatar: auth.currentUser.photoURL,
        email: auth.currentUser.email
      })
    });

  };


  const leaveRun = async () => {

    if (!auth.currentUser) return;

    const runRef = doc(db, "runs", id);

    await updateDoc(runRef, {
      participants: arrayRemove({
        uid: auth.currentUser.uid,
        name: auth.currentUser.displayName,
        avatar: auth.currentUser.photoURL,
        email: auth.currentUser.email
      })
    });

  };


  if (!run) {
    return <div style={{ padding: "80px" }}>Run not found</div>;
  }

  return (
    <div>

      <div
        style={{
          ...styles.hero,
          backgroundImage: `url(${run.image})`
        }}
      >
        <div style={styles.heroOverlay}>
          <h1 style={styles.heroTitle}>{run.title}</h1>
        </div>
      </div>

      <div style={styles.container}>

        <div style={styles.infoBox}>
          <div>
            <strong>Date</strong>
            <p>{run.date}</p>
          </div>

          <div>
            <strong>Location</strong>
            <p>{run.location}</p>
          </div>

          <div>
            <strong>Time</strong>
            <p>{run.time}</p>
          </div>
        </div>


        {/* MEETING POINT MAP */}

        {run.location && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Meeting Point</h2>

            <iframe
              src={`https://maps.google.com/maps?q=${encodeURIComponent(run.location)}&output=embed`}
              width="100%"
              height="350"
              loading="lazy"
              style={styles.map}
            ></iframe>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(run.location)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={styles.mapButton}
            >
              Open in Google Maps
            </a>

          </div>
        )}


        {/* ROUTE MAP */}

        {run.routeMap && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Running Route</h2>

            <iframe
              src={`https://maps.google.com/maps?q=${encodeURIComponent(run.routeMap)}&output=embed`}
              width="100%"
              height="350"
              loading="lazy"
              style={styles.map}
            ></iframe>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(run.routeMap)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={styles.mapButton}
            >
              Open Route in Google Maps
            </a>

          </div>
        )}


        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Post Run Plan</h2>
          <p style={styles.text}>{run.postRun}</p>
        </div>


        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>
            Participants ({participants.length})
          </h2>

          <div style={styles.participants}>
            {participants.map((p, index) => (
              <Link
                key={index}
                to={`/runner/${p.email}`}
                style={styles.runner}
              >
                <img src={p.avatar} style={styles.avatar} />
                <p>{p.name}</p>
              </Link>
            ))}
          </div>

        </div>


        {joined ? (
          <button style={styles.leave} onClick={leaveRun}>
            Leave Run
          </button>
        ) : (
          <button style={styles.join} onClick={joinRun}>
            Join This Run
          </button>
        )}

      </div>

    </div>
  );
}

const styles = {

  hero: {
    height: "300px",
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative"
  },

  heroOverlay: {
    background: "rgba(0,0,0,0.6)",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },

  heroTitle: {
    fontSize: "48px",
    color: "#fff"
  },

  container: {
    padding: "60px 40px",
    maxWidth: "1000px",
    margin: "auto"
  },

  infoBox: {
    display: "flex",
    justifyContent: "space-between",
    background: "#111",
    padding: "25px",
    borderRadius: "10px",
    marginBottom: "40px"
  },

  section: {
    marginBottom: "40px"
  },

  sectionTitle: {
    color: "#e6d28f",
    marginBottom: "15px"
  },

  text: {
    color: "#ccc",
    lineHeight: "1.7"
  },

  map: {
    border: "none",
    borderRadius: "10px",
    marginBottom: "15px"
  },

  mapButton: {
    display: "inline-block",
    padding: "10px 18px",
    background: "#e6d28f",
    color: "#000",
    textDecoration: "none",
    borderRadius: "6px",
    fontWeight: "600"
  },

  participants: {
    display: "flex",
    gap: "25px",
    flexWrap: "wrap"
  },

  runner: {
    textAlign: "center",
    textDecoration: "none",
    color: "white"
  },

  avatar: {
    width: "70px",
    height: "70px",
    borderRadius: "50%",
    objectFit: "cover",
    marginBottom: "8px"
  },

  join: {
    padding: "14px 28px",
    background: "#e6d28f",
    border: "none",
    borderRadius: "6px",
    fontWeight: "600",
    cursor: "pointer"
  },

  leave: {
    padding: "14px 28px",
    background: "#ff5c5c",
    border: "none",
    borderRadius: "6px",
    fontWeight: "600",
    cursor: "pointer"
  }

};

export default ActivityDetails;