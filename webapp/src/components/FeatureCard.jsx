function FeatureCard({ icon, title, description }) {
  return (
    <div
      style={styles.card}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--accent)";
        e.currentTarget.style.transform = "translateY(-6px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div style={styles.iconWrapper}>
        <span style={styles.icon}>{icon}</span>
      </div>
      <h3 style={styles.title}>{title}</h3>
      <p style={styles.description}>{description}</p>
    </div>
  );
}

const styles = {
  card: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "16px",
    padding: "32px 24px",
    textAlign: "center",
    transition: "border-color 0.2s ease, transform 0.2s ease",
    cursor: "default",
  },
  iconWrapper: {
    width: "56px",
    height: "56px",
    borderRadius: "14px",
    background: "var(--accent)18",
    border: "1px solid var(--accent)33",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 20px",
  },
  icon: {
    fontSize: "24px",
  },
  title: {
    fontSize: "18px",
    fontWeight: "700",
    color: "var(--text)",
    marginBottom: "10px",
  },
  description: {
    color: "var(--text2)",
    fontSize: "14px",
    lineHeight: 1.7,
  },
};

export default FeatureCard;