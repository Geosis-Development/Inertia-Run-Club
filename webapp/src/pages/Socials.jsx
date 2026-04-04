export default function Socials() {

  const socials = [
    {
      name: "Instagram",
      handle: "@inertiarunclub",
      description: "Follow our journey. Run photos, event recaps, and community moments every week.",
      url: "https://www.instagram.com/inertiarunclub",
      color: "#E1306C",
      icon: "📸",
      cta: "Follow on Instagram",
    },
    {
      name: "LinkedIn",
      handle: "Inertia Run Club",
      description: "Connect with us professionally. Updates, milestones, and the story behind the club.",
      url: "https://www.linkedin.com/company/inertia-run-club",
      color: "#0077B5",
      icon: "💼",
      cta: "Connect on LinkedIn",
    },
    {
      name: "WhatsApp",
      handle: "Community Group",
      description: "Join our WhatsApp group for run updates, meetup details, and crew conversations.",
      url: "https://chat.whatsapp.com/FRuxlfFIjgjE9cfHbQxD3j",
      color: "#25D366",
      icon: "💬",
      cta: "Join the Group",
    },
  ];

  return (
    <div style={styles.page}>

      {/* HERO */}
      <section style={styles.hero}>
        <p style={styles.eyebrow}>Stay Connected</p>
        <h1 style={styles.heroTitle}>Find Us Online</h1>
        <p style={styles.heroSubtitle}>
          Follow the journey, join the conversation, and never miss a run.
        </p>
      </section>

      {/* CARDS */}
      <section style={styles.cardsSection}>
        <div style={styles.cardsGrid}>
          {socials.map((s) => (
            <a
              key={s.name}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              style={styles.cardLink}
            >
              <div
                style={styles.card}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = s.color + "88";
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div
                  style={{
                    ...styles.iconWrapper,
                    background: s.color + "15",
                    border: `1px solid ${s.color}33`,
                  }}
                >
                  <span style={styles.icon}>{s.icon}</span>
                </div>

                <div style={styles.cardContent}>
                  <div style={styles.cardHeader}>
                    <h2 style={styles.cardName}>{s.name}</h2>
                    <span
                      style={{
                        ...styles.handle,
                        color: s.color,
                        background: s.color + "12",
                      }}
                    >
                      {s.handle}
                    </span>
                  </div>

                  <p style={styles.cardDesc}>{s.description}</p>

                  <div
                    style={{
                      ...styles.ctaRow,
                      color: s.color,
                    }}
                  >
                    <span style={styles.ctaText}>{s.cta}</span>
                    <span style={styles.arrow}>→</span>
                  </div>
                </div>

              </div>
            </a>
          ))}
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section style={styles.bottom}>
        <div style={styles.bottomInner}>
          <h2 style={styles.bottomTitle}>Want to run with us?</h2>
          <p style={styles.bottomText}>
            The best way to stay in the loop is to join our WhatsApp group.
            Every run announcement, route update, and post-run plan lands there first.
          </p>
          <a
            href="https://chat.whatsapp.com/FRuxlfFIjgjE9cfHbQxD3j"
            target="_blank"
            rel="noopener noreferrer"
            style={styles.bottomBtn}
          >
            💬 Join WhatsApp Group
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
    maxWidth: "400px",
    margin: "0 auto",
    lineHeight: 1.7,
  },

  // CARDS
  cardsSection: {
    padding: "80px 24px",
    maxWidth: "900px",
    margin: "0 auto",
  },
  cardsGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  cardLink: {
    textDecoration: "none",
    color: "var(--text)",
    display: "block",
  },
  card: {
    display: "flex",
    alignItems: "center",
    gap: "24px",
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "16px",
    padding: "28px",
    transition: "border-color 0.2s ease, transform 0.2s ease",
    cursor: "pointer",
  },
  iconWrapper: {
    width: "64px",
    height: "64px",
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  icon: {
    fontSize: "28px",
  },
  cardContent: {
    flex: 1,
    minWidth: 0,
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
    marginBottom: "10px",
  },
  cardName: {
    fontSize: "20px",
    fontWeight: "700",
    color: "var(--text)",
  },
  handle: {
    fontSize: "12px",
    fontWeight: "600",
    padding: "4px 10px",
    borderRadius: "20px",
  },
  cardDesc: {
    color: "var(--text2)",
    fontSize: "14px",
    lineHeight: 1.7,
    marginBottom: "16px",
  },
  ctaRow: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontWeight: "600",
    fontSize: "14px",
  },
  ctaText: {},
  arrow: {
    transition: "transform 0.2s",
  },

  // BOTTOM
  bottom: {
    padding: "80px 24px",
    background: "var(--surface)",
    borderTop: "1px solid var(--border)",
    textAlign: "center",
  },
  bottomInner: {
    maxWidth: "520px",
    margin: "0 auto",
  },
  bottomTitle: {
    fontSize: "clamp(24px, 4vw, 36px)",
    fontWeight: "700",
    color: "var(--text)",
    marginBottom: "16px",
  },
  bottomText: {
    color: "var(--text2)",
    fontSize: "15px",
    lineHeight: 1.8,
    marginBottom: "32px",
  },
  bottomBtn: {
    display: "inline-block",
    background: "#25D366",
    color: "#fff",
    padding: "14px 32px",
    borderRadius: "8px",
    fontWeight: "700",
    fontSize: "15px",
    textDecoration: "none",
  },
};