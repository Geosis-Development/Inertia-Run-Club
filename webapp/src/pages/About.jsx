export default function About() {
  return (
    <div style={styles.page}>

      {/* HERO */}
      <section style={styles.hero}>
        <p style={styles.eyebrow}>Who We Are</p>
        <h1 style={styles.heroTitle}>Built on the streets<br />of Panvel.</h1>
        <p style={styles.heroSubtitle}>
          A community built on momentum, consistency, and the joy of running together.
        </p>
      </section>

      {/* STORY */}
      <section style={styles.section}>
        <div style={styles.storyGrid}>
          <div>
            <p style={styles.eyebrow}>Our Story</p>
            <h2 style={styles.sectionTitle}>How it started</h2>
          </div>
          <div>
            <p style={styles.text}>
              Inertia Run Club started as a small group of runners in Panvel who
              believed that running is more enjoyable when shared with a community.
              What began as a few friends meeting for morning runs quickly grew
              into a passionate group committed to fitness, consistency, and
              supporting each other.
            </p>
            <p style={styles.text}>
              Today, Inertia Run Club welcomes runners of all levels — whether you
              are training for your first 5K or chasing a personal best. No
              judgment. No pace requirement. Just show up.
            </p>
          </div>
        </div>
      </section>

      {/* MISSION + VISION */}
      <section style={styles.missionSection}>
        <div style={styles.missionGrid}>

          <div style={styles.missionCard}>
            <span style={styles.missionIcon}>🎯</span>
            <h3 style={styles.cardTitle}>Mission</h3>
            <p style={styles.cardText}>
              To create a welcoming and motivating running community that helps
              individuals stay active, improve their performance, and build
              lasting friendships.
            </p>
          </div>

          <div style={styles.missionCard}>
            <span style={styles.missionIcon}>🔭</span>
            <h3 style={styles.cardTitle}>Vision</h3>
            <p style={styles.cardText}>
              To become the most vibrant running community in Panvel, inspiring
              more people to embrace a healthy and active lifestyle.
            </p>
          </div>

        </div>
      </section>

      {/* VALUES */}
      <section style={styles.valuesSection}>
        <p style={styles.eyebrow}>What drives us</p>
        <h2 style={styles.sectionTitle}>Our Values</h2>

        <div style={styles.valuesGrid}>
          {[
            { word: "Grit", desc: "We show up even when it's hard." },
            { word: "Pace", desc: "Every runner sets their own." },
            { word: "Crew", desc: "Nobody runs alone here." },
            { word: "Vibe", desc: "Running should feel good." },
          ].map((v) => (
            <div key={v.word} style={styles.valueCard}>
              <h3 style={styles.valueWord}>{v.word}</h3>
              <p style={styles.valueDesc}>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* JOIN CTA */}
      <section style={styles.cta}>
        <h2 style={styles.ctaTitle}>Come run with us.</h2>
        <p style={styles.ctaText}>Every Sunday. 6:30 AM. Panvel.</p>
        <a href="/activities" style={styles.ctaBtn}>See Upcoming Runs →</a>
      </section>

    </div>
  );
}

const styles = {
  page: {
    marginTop: "64px",
  },

  // HERO
  hero: {
    padding: "100px 24px",
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
    marginBottom: "16px",
  },
  heroTitle: {
    fontSize: "clamp(36px, 7vw, 72px)",
    fontWeight: "700",
    lineHeight: 1.1,
    color: "var(--text)",
    marginBottom: "20px",
  },
  heroSubtitle: {
    color: "var(--text2)",
    fontSize: "clamp(15px, 2vw, 18px)",
    maxWidth: "500px",
    margin: "0 auto",
    lineHeight: 1.7,
  },

  // STORY
  section: {
    padding: "80px 24px",
    maxWidth: "1100px",
    margin: "0 auto",
    borderBottom: "1px solid var(--border)",
  },
  storyGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 2fr",
    gap: "60px",
    alignItems: "start",
  },
  sectionTitle: {
    fontSize: "clamp(24px, 4vw, 36px)",
    fontWeight: "700",
    color: "var(--text)",
    marginBottom: "0",
    lineHeight: 1.2,
  },
  text: {
    color: "var(--text2)",
    lineHeight: "1.8",
    marginBottom: "20px",
    fontSize: "15px",
  },

  // MISSION
  missionSection: {
    padding: "80px 24px",
    background: "var(--surface)",
    borderBottom: "1px solid var(--border)",
  },
  missionGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "24px",
    maxWidth: "900px",
    margin: "0 auto",
  },
  missionCard: {
    background: "var(--bg)",
    border: "1px solid var(--border)",
    borderRadius: "16px",
    padding: "36px",
  },
  missionIcon: {
    fontSize: "32px",
    display: "block",
    marginBottom: "16px",
  },
  cardTitle: {
    fontSize: "20px",
    fontWeight: "700",
    color: "var(--text)",
    marginBottom: "12px",
  },
  cardText: {
    color: "var(--text2)",
    lineHeight: "1.7",
    fontSize: "15px",
  },

  // VALUES
  valuesSection: {
    padding: "80px 24px",
    maxWidth: "1100px",
    margin: "0 auto",
    textAlign: "center",
    borderBottom: "1px solid var(--border)",
  },
  valuesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
    marginTop: "40px",
  },
  valueCard: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "12px",
    padding: "32px 24px",
    transition: "border-color 0.2s",
  },
  valueWord: {
    fontSize: "28px",
    fontWeight: "700",
    color: "var(--accent)",
    marginBottom: "8px",
  },
  valueDesc: {
    color: "var(--text2)",
    fontSize: "14px",
    lineHeight: 1.6,
  },

  // CTA
  cta: {
    padding: "80px 24px",
    textAlign: "center",
    background: "var(--surface)",
    borderTop: "1px solid var(--border)",
  },
  ctaTitle: {
    fontSize: "clamp(28px, 5vw, 42px)",
    fontWeight: "700",
    color: "var(--text)",
    marginBottom: "12px",
  },
  ctaText: {
    color: "var(--text2)",
    fontSize: "16px",
    marginBottom: "32px",
  },
  ctaBtn: {
    background: "var(--accent)",
    color: "#0a0a0a",
    padding: "14px 32px",
    borderRadius: "8px",
    fontWeight: "700",
    fontSize: "15px",
    textDecoration: "none",
    display: "inline-block",
  },
};