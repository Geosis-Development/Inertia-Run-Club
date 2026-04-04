import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { Link } from "react-router-dom";

import "swiper/css";
import "swiper/css/navigation";

function RunGallery() {

  const [images, setImages] = useState([]);

  useEffect(() => {

    const galleryQuery = query(
      collection(db, "homepageGallery"),
      orderBy("order", "asc")
    );

    const unsubscribe = onSnapshot(galleryQuery, (snapshot) => {

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        image: doc.data().image,
        order: doc.data().order
      }));

      setImages(data);

    });

    return () => unsubscribe();

  }, []);

  return (
    <section style={styles.section}>
      <div style={styles.container}>

        {/* LEFT TEXT */}
        <div style={styles.text}>
          <h2 style={styles.title}>Sunday Morning Runs</h2>

          <p style={styles.paragraph}>
            Every Sunday, we hit the pavement for our flagship group run.
            It's the perfect way to kick off your week, with routes for all
            levels and a great community vibe.
          </p>

          <p style={styles.paragraph}>
            Whether you're chasing a new personal best or just looking for
            a friendly jog, you'll find your pace with us.
          </p>

          <p style={styles.paragraph}>
            The energy is contagious, the scenery is beautiful, and the
            post-run coffee is always rewarding.
          </p>

          <Link to="/activities" style={styles.link}>
            See All Runs →
          </Link>
        </div>

        {/* RIGHT SLIDER */}
        <div style={styles.slider}>
          <Swiper
            modules={[Navigation]}
            navigation
            spaceBetween={20}
            slidesPerView={1}
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
        </div>

      </div>
    </section>
  );
}

const styles = {
  section: {
    padding: "120px 40px",
  },

  container: {
    maxWidth: "1300px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "1.2fr 1.8fr",
    gap: "80px",
    alignItems: "center",
  },

  text: {
    textAlign: "left",
  },

  title: {
    fontSize: "44px",
    color: "#e6d28f",
    marginBottom: "25px",
  },

  paragraph: {
    color: "#ccc",
    lineHeight: "1.8",
    marginBottom: "20px",
  },

  link: {
    color: "#e6d28f",
    fontWeight: "600",
    textDecoration: "none",
  },

  slider: {
    width: "100%",
    height: "420px",
    maxWidth: "700px",
  },

  image: {
    width: "100%",
    height: "420px",
    objectFit: "cover",
    borderRadius: "14px",
  },
};

export default RunGallery;