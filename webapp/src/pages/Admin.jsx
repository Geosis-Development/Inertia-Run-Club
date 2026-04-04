import { useEffect, useState } from "react";
import { db } from "../firebase";

import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  onSnapshot,
  query,
  orderBy
} from "firebase/firestore";

function Admin() {

  const [runs, setRuns] = useState([]);
  const [gallery, setGallery] = useState([]);

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [time, setTime] = useState("");
  const [image, setImage] = useState("");
  const [postRun, setPostRun] = useState("");
  const [meetupLocation, setMeetupLocation] = useState("");
  const [routeMap, setRouteMap] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [galleryImage, setGalleryImage] = useState("");


  useEffect(() => {

    const unsubscribeRuns = onSnapshot(
      collection(db, "runs"),
      (snapshot) => {

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));

        setRuns(data);

      }
    );

    const galleryQuery = query(
      collection(db, "homepageGallery"),
      orderBy("order", "asc")
    );

    const unsubscribeGallery = onSnapshot(
      galleryQuery,
      (snapshot) => {

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));

        setGallery(data);

      }
    );

    return () => {
      unsubscribeRuns();
      unsubscribeGallery();
    };

  }, []);



  const createRun = async () => {

    if (!title || !date || !location || !time) {
      alert("Please fill all fields");
      return;
    }

    await addDoc(collection(db, "runs"), {
      title,
      date,
      location,
      time,
      image,
      postRun,
      meetupLocation,
      routeMap,
      participants: []
    });

    resetForm();

  };



  const updateRun = async () => {

    await updateDoc(doc(db, "runs", editingId), {
      title,
      date,
      location,
      time,
      image,
      postRun,
      meetupLocation,
      routeMap
    });

    resetForm();

  };



  const editRun = (run) => {

    setTitle(run.title);
    setDate(run.date);
    setLocation(run.location);
    setTime(run.time);
    setImage(run.image);
    setPostRun(run.postRun);
    setMeetupLocation(run.meetupLocation || "");
    setRouteMap(run.routeMap || "");
    setEditingId(run.id);

  };



  const resetForm = () => {

    setTitle("");
    setDate("");
    setLocation("");
    setTime("");
    setImage("");
    setPostRun("");
    setMeetupLocation("");
    setRouteMap("");
    setEditingId(null);

  };



  const deleteRun = async (id) => {

    const confirmDelete = window.confirm("Delete this run?");
    if (!confirmDelete) return;

    await deleteDoc(doc(db, "runs", id));

  };



  const addGalleryImage = async () => {

    if (!galleryImage) {
      alert("Enter image URL");
      return;
    }

    await addDoc(collection(db, "homepageGallery"), {
      image: galleryImage,
      order: Date.now()
    });

    setGalleryImage("");

  };



  const deleteGalleryImage = async (id) => {

    const confirmDelete = window.confirm("Delete this image?");
    if (!confirmDelete) return;

    await deleteDoc(doc(db, "homepageGallery", id));

  };



  return (

    <div style={styles.container}>

      <h1 style={styles.title}>Admin Dashboard</h1>


      {/* RUN MANAGEMENT */}

      <div style={styles.section}>

        <h2>{editingId ? "Edit Run" : "Create New Run"}</h2>

        <input
          style={styles.input}
          placeholder="Title"
          value={title}
          onChange={(e)=>setTitle(e.target.value)}
        />

        <input
          style={styles.input}
          placeholder="Date"
          value={date}
          onChange={(e)=>setDate(e.target.value)}
        />

        <input
          style={styles.input}
          placeholder="Location"
          value={location}
          onChange={(e)=>setLocation(e.target.value)}
        />

        <input
          style={styles.input}
          placeholder="Time"
          value={time}
          onChange={(e)=>setTime(e.target.value)}
        />

        <input
          style={styles.input}
          placeholder="Image URL"
          value={image}
          onChange={(e)=>setImage(e.target.value)}
        />

        <input
          style={styles.input}
          placeholder="Meetup Location (Google Maps link)"
          value={meetupLocation}
          onChange={(e)=>setMeetupLocation(e.target.value)}
        />

        <input
          style={styles.input}
          placeholder="Route Map (Google Maps Directions link)"
          value={routeMap}
          onChange={(e)=>setRouteMap(e.target.value)}
        />

        <textarea
          style={styles.input}
          placeholder="Post Run Description"
          value={postRun}
          onChange={(e)=>setPostRun(e.target.value)}
        />

        {editingId ? (
          <button style={styles.createButton} onClick={updateRun}>
            Update Run
          </button>
        ) : (
          <button style={styles.createButton} onClick={createRun}>
            Create Run
          </button>
        )}


        <h3 style={{marginTop:"40px"}}>Existing Runs</h3>

        {runs.map((run)=>(
          <div key={run.id} style={styles.runCard}>

            <h4>{run.title}</h4>
            <p>{run.date} • {run.location}</p>

            <div style={styles.buttonRow}>
              <button
                style={styles.edit}
                onClick={()=>editRun(run)}
              >
                Edit
              </button>

              <button
                style={styles.delete}
                onClick={()=>deleteRun(run.id)}
              >
                Delete
              </button>
            </div>

          </div>
        ))}

      </div>



      {/* HOMEPAGE GALLERY */}

      <div style={styles.section}>

        <h2>Sunday Run Gallery</h2>

        <input
          style={styles.input}
          placeholder="Image URL"
          value={galleryImage}
          onChange={(e)=>setGalleryImage(e.target.value)}
        />

        {galleryImage && (
          <img src={galleryImage} style={styles.preview}/>
        )}

        <button style={styles.createButton} onClick={addGalleryImage}>
          Add Image
        </button>


        <div style={styles.galleryGrid}>

          {gallery.map((img)=>(
            <div key={img.id} style={styles.galleryCard}>

              <img src={img.image} style={styles.galleryImage}/>

              <button
                style={styles.delete}
                onClick={()=>deleteGalleryImage(img.id)}
              >
                Delete
              </button>

            </div>
          ))}

        </div>

      </div>

    </div>

  );

}



const styles = {

  container:{
    padding:"80px",
    maxWidth:"900px",
    margin:"auto"
  },

  title:{
    marginBottom:"40px"
  },

  section:{
    marginBottom:"60px"
  },

  input:{
    padding:"10px",
    borderRadius:"6px",
    border:"none",
    width:"100%",
    marginBottom:"10px"
  },

  preview:{
    width:"220px",
    borderRadius:"10px",
    marginBottom:"10px"
  },

  createButton:{
    background:"#e6d28f",
    border:"none",
    padding:"12px",
    borderRadius:"6px",
    fontWeight:"600",
    cursor:"pointer",
    marginBottom:"20px"
  },

  runCard:{
    background:"#111",
    padding:"15px",
    borderRadius:"10px",
    marginBottom:"10px"
  },

  buttonRow:{
    display:"flex",
    gap:"10px",
    marginTop:"10px"
  },

  edit:{
    background:"#4cafef",
    border:"none",
    padding:"8px 12px",
    borderRadius:"6px",
    cursor:"pointer"
  },

  delete:{
    background:"#ff5c5c",
    border:"none",
    padding:"8px 12px",
    borderRadius:"6px",
    cursor:"pointer"
  },

  galleryGrid:{
    display:"grid",
    gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",
    gap:"20px"
  },

  galleryCard:{
    background:"#111",
    padding:"10px",
    borderRadius:"10px",
    textAlign:"center"
  },

  galleryImage:{
    width:"100%",
    borderRadius:"8px",
    marginBottom:"10px"
  }

};

export default Admin;