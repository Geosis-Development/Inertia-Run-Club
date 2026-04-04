import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";

import { db } from "../firebase";

function Team() {

  const [team, setTeam] = useState([]);

  useEffect(() => {

    const unsubscribe = onSnapshot(
      collection(db, "team"),
      (snapshot) => {

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));

        setTeam(data);

      }
    );

    return () => unsubscribe();

  }, []);

  return (

    <div style={styles.container}>

      <h1 style={styles.title}>Our Team</h1>

      <p style={styles.subtitle}>
        The passionate runners building the Inertia community.
      </p>

      <div style={styles.grid}>

        {team.map((member) => (

          <div key={member.id} style={styles.card}>

            <img
              src={member.image}
              alt={member.name}
              style={styles.image}
            />

            <h3 style={styles.name}>{member.name}</h3>

            <p style={styles.role}>{member.role}</p>

            {member.bio && (
              <p style={styles.bio}>
                {member.bio}
              </p>
            )}

            {member.instagram && (
              <a
                href={member.instagram}
                target="_blank"
                rel="noopener noreferrer"
                style={styles.link}
              >
                Instagram →
              </a>
            )}

          </div>

        ))}

      </div>

    </div>

  );

}



const styles = {

  container:{
    padding:"80px 40px",
    maxWidth:"1100px",
    margin:"auto",
    textAlign:"center"
  },

  title:{
    fontSize:"40px",
    marginBottom:"10px"
  },

  subtitle:{
    color:"#aaa",
    marginBottom:"60px"
  },

  grid:{
    display:"grid",
    gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",
    gap:"40px"
  },

  card:{
    background:"#111",
    padding:"25px",
    borderRadius:"12px"
  },

  image:{
    width:"120px",
    height:"120px",
    borderRadius:"50%",
    objectFit:"cover",
    marginBottom:"15px"
  },

  name:{
    marginBottom:"5px"
  },

  role:{
    color:"#e6d28f",
    marginBottom:"10px"
  },

  bio:{
    color:"#bbb",
    fontSize:"14px",
    marginBottom:"10px"
  },

  link:{
    color:"#e6d28f",
    textDecoration:"none",
    fontWeight:"600"
  }

};

export default Team;