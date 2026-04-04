import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

import EventCard from "../components/EventCard";

function Activities() {

  const [runs, setRuns] = useState([]);
  const [members, setMembers] = useState(0);
  const [gallery, setGallery] = useState([]);

  useEffect(() => {

    const unsubscribeRuns = onSnapshot(
      collection(db, "runs"),
      (snapshot) => {

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));

        setRuns(data);

        const uniqueMembers = new Set();

        data.forEach(run => {
          run.participants?.forEach(p => {
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
          ...doc.data()
        }));

        setGallery(data);

      }
    );

    return () => {
      unsubscribeRuns();
      unsubscribeGallery();
    };

  }, []);

  return (
    <div style={styles.container}>

      <h1 style={styles.title}>Activities</h1>

      {/* ACTIVE MEMBERS */}
      <div style={styles.members}>
        <h2 style={styles.sectionTitle}>Active Members</h2>

        <div style={styles.memberCard}>
          <h1 style={styles.memberNumber}>{members}</h1>
          <p>Runners in the Inertia Community</p>
        </div>
      </div>

      {/* UPCOMING RUNS */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Upcoming Runs</h2>

        <div style={styles.grid}>
          {runs.map((run) => (
            <EventCard
              id={run.id}   // ⭐ IMPORTANT FIX
              key={run.id}
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
      </div>

      {/* MOMENTS IN MOTION */}
      <div style={styles.gallerySection}>

        <h2 style={styles.galleryTitle}>Moments in Motion</h2>

        <p style={styles.gallerySubtitle}>
          A glimpse into our community, our runs, and our shared passion.
        </p>

        <div style={styles.masonry}>

          {gallery.map((img) => (
            <img
              key={img.id}
              src={img.image}
              alt={img.caption}
              style={styles.masonryImage}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow = "0 15px 35px rgba(0,0,0,0.6)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          ))}

        </div>

      </div>

    </div>
  );
}

const styles = {

  container: {
    padding: "80px 40px",
  },

  title: {
    fontSize: "36px",
    marginBottom: "40px",
  },

  sectionTitle: {
    fontSize: "28px",
    marginBottom: "20px",
  },

  members: {
    marginBottom: "60px",
    textAlign: "center"
  },

  memberCard: {
    background: "#111",
    padding: "40px",
    borderRadius: "12px",
    marginTop: "20px"
  },

  memberNumber: {
    fontSize: "60px",
    color: "#e6d28f",
    marginBottom: "10px"
  },

  section: {
    marginBottom: "80px"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "30px",
  },

  gallerySection: {
    marginTop: "80px",
    textAlign: "center"
  },

  galleryTitle: {
    fontSize: "40px",
    color: "#e6d28f",
    marginBottom: "10px"
  },

  gallerySubtitle: {
    color: "#aaa",
    marginBottom: "40px"
  },

  masonry: {
    columnCount: 4,
    columnGap: "20px"
  },

  masonryImage: {
    width: "100%",
    marginBottom: "20px",
    borderRadius: "12px",
    transition: "transform 0.3s ease",
    cursor: "pointer"
  }

};

export default Activities;