import { Link } from "react-router-dom";

function EventCard({ id, title, description, date, location, time, image, meetupLocation }) {
  return (
    <Link to={`/activities/${id}`} style={styles.card}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.borderColor = "var(--accent)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.borderColor = "var(--border)";
      }}
    >

      {/* IMAGE */}
      <div style={styles.imageWrapper}>
        <img src={image} style={styles.image} alt={title} />
        {time && (
          <span style={styles.timeBadge}>{time}</span>
        )}
      </div>

      {/* CONTENT */}
      <div style={styles.content}>

        <h3 style={styles.title}>{title}</h3>

        {description && (
          <p style={styles.description}>{description}</p>
        )}

        <div style={styles.details}>
          {date && (
            <div style={styles.detail}>
              <span style={styles.detailIcon}>📅</span>
              <span style={styles.detailText}>{date}</span>
            </div>
          )}
          {location && (
            <div style={styles.detail}>
              <span style={styles.detailIcon}>📍</span>
              <span style={styles.detailText}>{location}</span>
            </div>
          )}
        </div>

        {meetupLocation && (
          <a
            href={meetupLocation}
            target="_blank"
            rel="noopener noreferrer"
            style={styles.mapLink}
            onClick={(e) => e.stopPropagation()}
          >
            Open Meetup Location →
          </a>
        )}

      </div>

    </Link>
  );
}

const styles = {
  card: {
    background: "var(--surface)",
    borderRadius: "16px",
    overflow: "hidden",
    border: "1px solid var(--border)",
    textDecoration: "none",
    color: "var(--text)",
    display: "block",
    transition: "transform 0.2s ease, border-color 0.2s ease",
  },
  imageWrapper: {
    position: "relative",
    width: "100%",
    height: "200px",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
    transition: "transform 0.4s ease",
  },
  timeBadge: {
    position: "absolute",
    top: "12px",
    right: "12px",
    background: "var(--accent)",
    color: "#0a0a0a",
    fontSize: "12px",
    fontWeight: "700",
    padding: "4px 12px",
    borderRadius: "20px",
  },
  content: {
    padding: "20px",
  },
  title: {
    fontSize: "18px",
    fontWeight: "700",
    color: "var(--text)",
    marginBottom: "8px",
  },
  description: {
    color: "var(--text2)",
    fontSize: "13px",
    lineHeight: 1.6,
    marginBottom: "16px",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  details: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    marginBottom: "14px",
  },
  detail: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  detailIcon: {
    fontSize: "13px",
  },
  detailText: {
    fontSize: "13px",
    color: "var(--text2)",
  },
  mapLink: {
    fontSize: "13px",
    color: "var(--accent)",
    textDecoration: "none",
    fontWeight: "600",
  },
};

export default EventCard;