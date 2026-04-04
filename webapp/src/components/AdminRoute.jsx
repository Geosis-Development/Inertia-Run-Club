import { useEffect, useState } from "react";

import { auth, db } from "../firebase";

import { doc, getDoc } from "firebase/firestore";

import { onAuthStateChanged } from "firebase/auth";

function AdminRoute({ children }) {

  const [loading, setLoading] = useState(true);

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, async (user) => {

      if (!user) {
        setLoading(false);
        return;
      }

      const adminRef = doc(db, "admins", user.email);

      const adminSnap = await getDoc(adminRef);

      if (adminSnap.exists()) {
        setIsAdmin(true);
      }

      setLoading(false);

    });

    return () => unsubscribe();

  }, []);

  if (loading) return <div>Loading...</div>;

  if (!isAdmin) return <div>Access Denied</div>;

  return children;

}

export default AdminRoute;