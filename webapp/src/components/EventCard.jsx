import { Link } from "react-router-dom";

function EventCard({ id, title, description, date, location, time, image, meetupLocation }) {

  return (
    <Link
      to={`/activities/${id}`}
      style={styles.card}
    >

      <img src={image} style={styles.image} alt={title} />

      <div style={styles.content}>

        <h3 style={styles.title}>{title}</h3>

        <p style={styles.description}>{description}</p>

        <div style={styles.details}>
          <span>{date}</span>
          <span>{location}</span>
          <span>{time}</span>
        </div>

        {meetupLocation && (
          <a
            href={meetupLocation}
            target="_blank"
            rel="noopener noreferrer"
            style={styles.mapLink}
            onClick={(e)=>e.stopPropagation()}
          >
            📍 Open Meetup Location
          </a>
        )}

      </div>

    </Link>
  );
}

const styles = {

  card:{
    background:"#111",
    borderRadius:"14px",
    overflow:"hidden",
    transition:"all 0.3s ease",
    cursor:"pointer",
    textDecoration:"none",
    color:"white",
    display:"block"
  },

  image:{
    width:"100%",
    height:"180px",
    objectFit:"cover"
  },

  content:{
    padding:"20px"
  },

  title:{
    fontSize:"20px",
    marginBottom:"10px",
    color:"#e6d28f"
  },

  description:{
    color:"#ccc",
    fontSize:"14px",
    marginBottom:"15px"
  },

  details:{
    display:"flex",
    justifyContent:"space-between",
    fontSize:"13px",
    color:"#aaa",
    marginBottom:"12px"
  },

  mapLink:{
    color:"#e6d28f",
    fontSize:"14px",
    textDecoration:"none",
    fontWeight:"600"
  }

};

export default EventCard;