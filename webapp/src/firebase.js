import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAk6dJKBDOBFFwsnLphgLJoxZhpmVZXVJE",
  authDomain: "inertia-run-club-5cd85.firebaseapp.com",
  projectId: "inertia-run-club-5cd85",
  storageBucket: "inertia-run-club-5cd85.firebasestorage.app",
  messagingSenderId: "73961410218",
  appId: "1:73961410218:web:20609eccecc01a50c64ad3"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);