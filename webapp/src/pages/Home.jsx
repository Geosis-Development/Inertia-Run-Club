import { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

import FeatureCard from "../components/FeatureCard";
import EventCard from "../components/EventCard";
import RunGallery from "../components/RunGallery";
import heroVideo from "../assets/video/hero-video.mp4";

import { Link } from "react-router-dom";

function Home() {

  const [runs, setRuns] = useState([]);

  useEffect(() => {

    const unsubscribe = onSnapshot(
      collection(db, "runs"),
      (snapshot) => {

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));

        setRuns(data);
      }
    );

    return () => unsubscribe();

  }, []);

  const featuredRuns = runs.slice(0, 3);

  return (
    <div style={styles.page}>

      {/* HERO SECTION */}
      <div style={styles.hero}>

        <video autoPlay loop muted playsInline style={styles.video}>
          <source src={heroVideo} type="video/mp4" />
        </video>

        <div style={styles.overlay}>
          <h1 style={styles.title}>Momentum Is Everything</h1>

          <p style={styles.subtitle}>
            Panvel's homegrown run club.
          </p>

          <div style={styles.buttons}>
            <button style={styles.primary}>Join Next Run</button>
            <button style={styles.secondary}>Our Story</button>
          </div>
        </div>

      </div>


      {/* WHY RUN WITH INERTIA */}
      <section style={styles.features}>
        <h2 style={styles.sectionTitle}>Why Run With Inertia</h2>

        <div style={styles.featureGrid}>

          <FeatureCard
            icon="🏃"
            title="Community"
            description="Run alongside passionate runners and build lasting friendships."
          />

          <FeatureCard
            icon="⚡"
            title="Performance"
            description="Push your limits and improve your pace with every run."
          />

          <FeatureCard
            icon="🔥"
            title="Persistence"
            description="Stay consistent and motivated with the power of the crew."
          />

        </div>
      </section>


      {/* SUNDAY RUN SECTION */}
      <RunGallery />


      {/* UPCOMING RUNS */}
      <section style={styles.events}>

        <h2 style={styles.sectionTitle}>Upcoming Runs</h2>

        <div style={styles.eventGrid}>
          {featuredRuns.map((run) => (
            <EventCard
              key={run.id}
              title={run.title}
              description={run.postRun}
              date={run.date}
              location={run.location}
              time={run.time}
              image={run.image}
            />
          ))}
        </div>

        <div style={styles.viewAll}>
          <Link to="/activities" style={styles.viewAllButton}>
            View All Runs →
          </Link>
        </div>

      </section>

    </div>
  );
}

const styles = {

  page:{
    marginTop:"80px"   // pushes content below fixed navbar
  },

  hero: {
    height: "90vh",
    position: "relative",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  video: {
    position: "absolute",
    width: "100%",
    height: "100%",
    objectFit: "cover",
    zIndex: "-1",
  },

  overlay: {
    textAlign: "center",
    background: "rgba(0,0,0,0.55)",
    padding: "40px",
    borderRadius: "12px",
  },

  title: {
    fontSize: "60px",
    marginBottom: "20px",
  },

  subtitle: {
    fontSize: "20px",
    marginBottom: "30px",
    color: "#ccc",
  },

  buttons: {
    display: "flex",
    gap: "20px",
    justifyContent: "center",
  },

  primary: {
    background: "#e6d28f",
    border: "none",
    padding: "12px 24px",
    fontSize: "16px",
    cursor: "pointer",
    borderRadius: "6px"
  },

  secondary: {
    background: "transparent",
    border: "2px solid #e6d28f",
    color: "#e6d28f",
    padding: "12px 24px",
    fontSize: "16px",
    cursor: "pointer",
    borderRadius: "6px"
  },

  features: {
    padding: "80px 40px",
    textAlign: "center",
  },

  sectionTitle: {
    fontSize: "36px",
    marginBottom: "40px",
  },

  featureGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "30px",
    maxWidth: "1000px",
    margin: "0 auto",
  },

  events: {
    padding: "80px 40px",
    textAlign: "center",
  },

  eventGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "30px",
    maxWidth: "1100px",
    margin: "0 auto",
  },

  viewAll: {
    marginTop: "40px",
  },

  viewAllButton: {
    color: "#e6d28f",
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "18px"
  }

};

export default Home;