import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";

function RunnerProfile() {

  const { email } = useParams();

  const [runs, setRuns] = useState([]);
  const [runnerRuns, setRunnerRuns] = useState([]);

  useEffect(() => {

    const unsubscribe = onSnapshot(
      collection(db, "runs"),
      (snapshot) => {

        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setRuns(data);

      }
    );

    return () => unsubscribe();

  }, []);

  useEffect(() => {

    const joinedRuns = runs.filter(run =>
      run.participants?.find(p => p.email === email)
    );

    setRunnerRuns(joinedRuns);

  }, [runs, email]);

  const runner = runnerRuns[0]?.participants?.find(p => p.email === email);

  if (!runner) {
    return <div style={{padding:"80px"}}>Runner not found</div>;
  }

  return (

    <div style={styles.container}>

      <div style={styles.profileHeader}>

        <img src={runner.avatar} style={styles.avatar}/>

        <h1>{runner.name}</h1>

        <p>{runnerRuns.length} Runs Joined</p>

      </div>

      <h2 style={styles.sectionTitle}>Runs Joined</h2>

      <div style={styles.runList}>

        {runnerRuns.map((run) => (

          <div key={run.id} style={styles.runCard}>

            <h3>{run.title}</h3>

            <p>{run.date} • {run.location}</p>

          </div>

        ))}

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

  profileHeader:{
    textAlign:"center",
    marginBottom:"50px"
  },

  avatar:{
    width:"120px",
    height:"120px",
    borderRadius:"50%",
    marginBottom:"20px"
  },

  sectionTitle:{
    marginBottom:"20px"
  },

  runList:{
    display:"flex",
    flexDirection:"column",
    gap:"20px"
  },

  runCard:{
    background:"#111",
    padding:"20px",
    borderRadius:"10px"
  }

};

export default RunnerProfile;