import { useState } from "react";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

export default function RegistrationModal({ user, onComplete }) {
  const [form, setForm] = useState({
    displayName: user.displayName || "",
    age: "",
    gender: "",
    phone: "",
    emergencyContact: "",
    emergencyPhone: "",
    tshirtSize: "",
    experience: "",
    city: "Panvel",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    if (
      !form.displayName || !form.age || !form.gender ||
      !form.phone || !form.experience || !form.tshirtSize
    ) {
      setError("Please fill all required fields.");
      return;
    }

    setLoading(true);
    try {
      await setDoc(doc(db, "runners", user.uid), {
        uid: user.uid,
        email: user.email,
        avatar: user.photoURL,
        displayName: form.displayName,
        age: parseInt(form.age),
        gender: form.gender,
        phone: form.phone,
        emergencyContact: form.emergencyContact,
        emergencyPhone: form.emergencyPhone,
        tshirtSize: form.tshirtSize,
        experience: form.experience,
        city: form.city,
        status: "active",
        joinedAt: new Date().toISOString(),
      });
      onComplete();
    } catch (err) {
      setError("Something went wrong. Try again.");
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>

        <img src={user.photoURL} style={styles.avatar} alt="profile" />
        <h2 style={styles.title}>Complete Your Profile</h2>
        <p style={styles.subtitle}>Just a few details before you join the crew.</p>

        {error && <p style={styles.error}>{error}</p>}

        <div style={styles.grid}>

          <div style={styles.field}>
            <label style={styles.label}>Full Name *</label>
            <input
              style={styles.input}
              value={form.displayName}
              onChange={(e) => update("displayName", e.target.value)}
              placeholder="Your name"
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Age *</label>
            <input
              style={styles.input}
              type="number"
              value={form.age}
              onChange={(e) => update("age", e.target.value)}
              placeholder="e.g. 24"
              min="10"
              max="80"
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Gender *</label>
            <select
              style={styles.input}
              value={form.gender}
              onChange={(e) => update("gender", e.target.value)}
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="non-binary">Non-binary</option>
              <option value="prefer-not">Prefer not to say</option>
            </select>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Phone *</label>
            <input
              style={styles.input}
              type="tel"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              placeholder="+91 98765 43210"
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Emergency Contact Name</label>
            <input
              style={styles.input}
              value={form.emergencyContact}
              onChange={(e) => update("emergencyContact", e.target.value)}
              placeholder="Parent / Partner name"
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Emergency Contact Phone</label>
            <input
              style={styles.input}
              type="tel"
              value={form.emergencyPhone}
              onChange={(e) => update("emergencyPhone", e.target.value)}
              placeholder="+91 98765 43210"
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>T-Shirt Size *</label>
            <select
              style={styles.input}
              value={form.tshirtSize}
              onChange={(e) => update("tshirtSize", e.target.value)}
            >
              <option value="">Select</option>
              <option value="XS">XS</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
              <option value="XXL">XXL</option>
            </select>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Running Experience *</label>
            <select
              style={styles.input}
              value={form.experience}
              onChange={(e) => update("experience", e.target.value)}
            >
              <option value="">Select</option>
              <option value="beginner">Beginner (just starting)</option>
              <option value="casual">Casual (1–2 runs/week)</option>
              <option value="intermediate">Intermediate (3–4 runs/week)</option>
              <option value="advanced">Advanced (5+ runs/week)</option>
            </select>
          </div>

        </div>

        <button
          style={styles.button}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Saving..." : "Join Inertia Run Club →"}
        </button>

      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    padding: "20px",
    overflowY: "auto",
  },
  modal: {
    background: "var(--bg)",
    borderRadius: "16px",
    padding: "40px",
    width: "100%",
    maxWidth: "560px",
    textAlign: "center",
    border: "1px solid var(--border)",
  },
  avatar: {
    width: "72px",
    height: "72px",
    borderRadius: "50%",
    marginBottom: "16px",
    objectFit: "cover",
  },
  title: {
    fontSize: "24px",
    fontWeight: "700",
    marginBottom: "8px",
    color: "var(--text)",
  },
  subtitle: {
    color: "var(--text2)",
    fontSize: "14px",
    marginBottom: "24px",
  },
  error: {
    color: "#e74c3c",
    fontSize: "13px",
    marginBottom: "16px",
    background: "#fde8e8",
    padding: "10px",
    borderRadius: "8px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "14px",
    marginBottom: "24px",
    textAlign: "left",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "12px",
    fontWeight: "600",
    color: "var(--text2)",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  input: {
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid var(--border)",
    background: "var(--surface)",
    color: "var(--text)",
    fontSize: "14px",
    outline: "none",
    width: "100%",
  },
  button: {
    background: "var(--accent)",
    color: "#0a0a0a",
    border: "none",
    padding: "14px 28px",
    borderRadius: "8px",
    fontWeight: "700",
    fontSize: "15px",
    cursor: "pointer",
    width: "100%",
  },
};