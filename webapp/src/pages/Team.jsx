import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

function Team() {
  const [team, setTeam] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "team"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTeam(data);
    });
    return () => unsub();
  }, []);

  return (
    <div style={styles.page}>

      {/* HERO */}
      <section style={styles.hero}>
        <p style={styles.eyebrow}>The People Behind It</p>
        <h1 style={styles.heroTitle}>Meet the Team</h1>
        <p style={styles.heroSubtitle}>
          The passionate runners building the Inertia community from the ground up.
        </p>
      </section>

      {/* TEAM GRID */}
      <section style={styles.section}>
        {team.length === 0 ? (
          <p style={styles.empty}>Team members coming soon.</p>
        ) : (
          <div style={styles.grid}>
            {team.map((member) => (
              <div
                key={member.id}
                style={styles.card}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--accent)";
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div style={styles.imageWrapper}>
                  <img
                    src={member.image}
                    alt={member.name}
                    style={styles.image}
                  />
                </div>

                <div style={styles.cardContent}>
                  <h3 style={styles.name}>{member.name}</h3>
                  <p style={styles.role}>{member.role}</p>

                  {member.bio && (
                    <p style={styles.bio}>{member.bio}</p>
                  )}

                <div style={styles.links}>
                  {member.instagram && (
                    <a
                      href={member.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={styles.socialLink}
                      onClick={(e) => e.stopPropagation()}
                    >
                      📸 Instagram
                    </a>
                  )}
                  {member.strava && (
                    <a
                      href={member.strava}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={styles.socialLink}
                      onClick={(e) => e.stopPropagation()}
                    >
                      🏃 Strava
                    </a>
                  )}
                </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* JOIN CTA */}
      <section style={styles.cta}>
        <div style={styles.ctaInner}>
          <h2 style={styles.ctaTitle}>Want to be part of the crew?</h2>
          <p style={styles.ctaText}>
            Join us on the next run and become part of the Inertia family.
          </p>
          <a href="/activities" style={styles.ctaBtn}>
            See Upcoming Runs →
          </a>
        </div>
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

  // GRID
  section: {
    padding: "80px 24px",
    maxWidth: "1100px",
    margin: "0 auto",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "24px",
  },
  empty: {
    textAlign: "center",
    color: "var(--text2)",
    padding: "60px 0",
  },

  // CARD
  card: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "16px",
    overflow: "hidden",
    transition: "border-color 0.2s ease, transform 0.2s ease",
    cursor: "default",
  },
  imageWrapper: {
    width: "100%",
    height: "220px",
    overflow: "hidden",
    background: "var(--surface2)",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "top",
    display: "block",
    transition: "transform 0.4s ease",
  },
  cardContent: {
    padding: "24px",
  },
  name: {
    fontSize: "18px",
    fontWeight: "700",
    color: "var(--text)",
    marginBottom: "4px",
  },
  role: {
    fontSize: "13px",
    fontWeight: "600",
    color: "var(--accent)",
    marginBottom: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  bio: {
    color: "var(--text2)",
    fontSize: "13px",
    lineHeight: 1.7,
    marginBottom: "16px",
  },
  links: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },
  socialLink: {
    fontSize: "13px",
    color: "var(--text2)",
    textDecoration: "none",
    fontWeight: "600",
    padding: "4px 10px",
    borderRadius: "6px",
    background: "var(--surface2)",
    border: "1px solid var(--border)",
    transition: "color 0.2s",
  },

  // CTA
  cta: {
    padding: "80px 24px",
    background: "var(--surface)",
    borderTop: "1px solid var(--border)",
    textAlign: "center",
  },
  ctaInner: {
    maxWidth: "500px",
    margin: "0 auto",
  },
  ctaTitle: {
    fontSize: "clamp(24px, 4vw, 36px)",
    fontWeight: "700",
    color: "var(--text)",
    marginBottom: "12px",
  },
  ctaText: {
    color: "var(--text2)",
    fontSize: "15px",
    lineHeight: 1.7,
    marginBottom: "28px",
  },
  ctaBtn: {
    display: "inline-block",
    background: "var(--accent)",
    color: "#0a0a0a",
    padding: "14px 32px",
    borderRadius: "8px",
    fontWeight: "700",
    fontSize: "15px",
    textDecoration: "none",
  },
};

export default Team;