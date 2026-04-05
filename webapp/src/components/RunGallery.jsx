import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { Link } from "react-router-dom";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

function RunGallery() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const galleryQuery = query(
      collection(db, "homepageGallery"),
      orderBy("order", "asc")
    );
    const unsub = onSnapshot(galleryQuery, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        image: doc.data().image,
        order: doc.data().order,
      }));
      setImages(data);
    });
    return () => unsub();
  }, []);

  return (
    <section style={styles.section}>
      <div style={styles.container}>

        {/* LEFT TEXT */}
        <div style={styles.text}>
          <p style={styles.eyebrow}>Every Sunday</p>
          <h2 style={styles.title}>Sunday Morning Runs</h2>
          <p style={styles.paragraph}>
            Every Sunday, we hit the pavement for our flagship group run.
            The perfect way to kick off your week — routes for all levels,
            great energy, and a community that shows up.
          </p>
          <p style={styles.paragraph}>
            Whether you're chasing a new personal best or just looking for
            a friendly jog, you'll find your pace with us.
          </p>
          <p style={styles.paragraph}>
            The energy is contagious, the scenery is beautiful, and the
            post-run chai is always worth it.
          </p>
          <Link to="/activities" style={styles.link}>
            See All Runs →
          </Link>
        </div>

        {/* RIGHT SLIDER */}
        <div style={styles.sliderWrapper}>
          {images.length === 0 ? (
            <div style={styles.placeholder}>
              <p style={styles.placeholderText}>Photos coming soon</p>
            </div>
          ) : (
            <Swiper
              modules={[Navigation, Pagination]}
              navigation
              pagination={{ clickable: true }}
              spaceBetween={0}
              slidesPerView={1}
              style={{ borderRadius: "16px", overflow: "hidden" }}
            >
              {images.map((img) => (
                <SwiperSlide key={img.id}>
                  <img
                    src={img.image}
                    style={styles.image}
                    alt="Run"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>

      </div>
    </section>
  );
}

const styles = {
  section: {
    padding: "100px 24px",
    borderTop: "1px solid var(--border)",
    borderBottom: "1px solid var(--border)",
    background: "var(--surface)",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "1fr 1.6fr",
    gap: "80px",
    alignItems: "center",
  },
  text: {
    textAlign: "left",
  },
  eyebrow: {
    fontSize: "12px",
    fontWeight: "600",
    letterSpacing: "3px",
    textTransform: "uppercase",
    color: "var(--accent)",
    marginBottom: "12px",
  },
  title: {
    fontSize: "clamp(28px, 4vw, 40px)",
    fontWeight: "700",
    color: "var(--text)",
    marginBottom: "24px",
    lineHeight: 1.2,
  },
  paragraph: {
    color: "var(--text2)",
    lineHeight: "1.8",
    marginBottom: "16px",
    fontSize: "15px",
  },
  link: {
    display: "inline-block",
    marginTop: "8px",
    color: "var(--accent)",
    fontWeight: "700",
    textDecoration: "none",
    fontSize: "15px",
    borderBottom: "1px solid var(--accent)",
    paddingBottom: "2px",
  },
  sliderWrapper: {
    width: "100%",
    borderRadius: "16px",
    overflow: "hidden",
    border: "1px solid var(--border)",
  },
  image: {
    width: "100%",
    height: "460px",
    objectFit: "cover",
    display: "block",
  },
  placeholder: {
    height: "460px",
    background: "var(--surface2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "16px",
  },
  placeholderText: {
    color: "var(--text3)",
    fontSize: "14px",
  },
};

export default RunGallery;