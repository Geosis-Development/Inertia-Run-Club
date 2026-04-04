export default function About() {
  return (
    <div style={styles.container}>

      {/* HERO */}
      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>About Inertia Run Club</h1>
        <p style={styles.heroSubtitle}>
          A community built on momentum, consistency, and the joy of running.
        </p>
      </section>

      {/* STORY */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Our Story</h2>

        <p style={styles.text}>
          Inertia Run Club started as a small group of runners in Panvel who
          believed that running is more enjoyable when shared with a community.
          What began as a few friends meeting for morning runs quickly grew
          into a passionate group committed to fitness, consistency, and
          supporting each other.
        </p>

        <p style={styles.text}>
          Today, Inertia Run Club welcomes runners of all levels — whether you
          are training for your first 5K or chasing a personal best.
        </p>
      </section>

      {/* MISSION + VISION */}
      <section style={styles.gridSection}>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Mission</h3>
          <p style={styles.cardText}>
            To create a welcoming and motivating running community that helps
            individuals stay active, improve their performance, and build
            lasting friendships.
          </p>
        </div>

        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Vision</h3>
          <p style={styles.cardText}>
            To become the most vibrant running community in Panvel, inspiring
            more people to embrace a healthy and active lifestyle.
          </p>
        </div>
      </section>

      {/* VALUES */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Our Values</h2>

        <div style={styles.valuesGrid}>
          <div style={styles.valueCard}>Grit</div>
          <div style={styles.valueCard}>Pace</div>
          <div style={styles.valueCard}>Crew</div>
          <div style={styles.valueCard}>Vibe</div>
        </div>
      </section>

    </div>
  );
}

const styles = {

  container: {
    padding: "60px 40px",
    maxWidth: "1100px",
    margin: "0 auto",
  },

  hero: {
    textAlign: "center",
    marginBottom: "80px",
  },

  heroTitle: {
    fontSize: "48px",
    color: "#e6d28f",
    marginBottom: "20px",
  },

  heroSubtitle: {
    color: "#ccc",
    fontSize: "18px",
  },

  section: {
    marginBottom: "80px",
  },

  sectionTitle: {
    fontSize: "32px",
    color: "#e6d28f",
    marginBottom: "25px",
  },

  text: {
    color: "#ccc",
    lineHeight: "1.8",
    marginBottom: "20px",
  },

  gridSection: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "40px",
    marginBottom: "80px",
  },

  card: {
    background: "#111",
    padding: "30px",
    borderRadius: "12px",
  },

  cardTitle: {
    color: "#e6d28f",
    marginBottom: "15px",
  },

  cardText: {
    color: "#ccc",
    lineHeight: "1.7",
  },

  valuesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "20px",
  },

  valueCard: {
    background: "#111",
    padding: "25px",
    textAlign: "center",
    borderRadius: "10px",
    color: "#e6d28f",
    fontWeight: "600",
  },

};