import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";

import { db } from "../firebase";

function Leaderboard() {

  const [leaders, setLeaders] = useState([]);

  useEffect(() => {

    const unsubscribe = onSnapshot(
      collection(db, "runs"),
      (snapshot) => {

        const runnerMap = {};

        snapshot.docs.forEach((doc) => {

          const participants = doc.data().participants || [];

          participants.forEach((p) => {

            if (!runnerMap[p.uid]) {

              runnerMap[p.uid] = {
                name: p.name,
                avatar: p.avatar,
                runs: 0
              };

            }

            runnerMap[p.uid].runs += 1;

          });

        });

        const sorted = Object.values(runnerMap).sort(
          (a, b) => b.runs - a.runs
        );

        setLeaders(sorted);

      }
    );

    return () => unsubscribe();

  }, []);

  return (

    <div style={styles.container}>

      <h1 style={styles.title}>🏆 Leaderboard</h1>

      {leaders.map((runner, index) => (

        <div key={index} style={styles.card}>

          <div style={styles.rank}>
            #{index + 1}
          </div>

          <img src={runner.avatar} style={styles.avatar} />

          <div style={styles.name}>
            {runner.name}
          </div>

          <div style={styles.runs}>
            {runner.runs} runs
          </div>

        </div>

      ))}

    </div>

  );

}

const styles = {

  container:{
    padding:"80px",
    maxWidth:"700px",
    margin:"auto"
  },

  title:{
    marginBottom:"40px"
  },

  card:{
    display:"flex",
    alignItems:"center",
    gap:"20px",
    background:"#111",
    padding:"15px",
    borderRadius:"10px",
    marginBottom:"15px"
  },

  rank:{
    fontSize:"20px",
    width:"40px"
  },

  avatar:{
    width:"50px",
    height:"50px",
    borderRadius:"50%"
  },

  name:{
    flex:1
  },

  runs:{
    fontWeight:"bold"
  }

};

export default Leaderboard;