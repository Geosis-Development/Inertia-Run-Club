import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection, addDoc, deleteDoc, doc,
  updateDoc, onSnapshot, query, orderBy
} from "firebase/firestore";

export default function Admin() {

  const [activeTab, setActiveTab] = useState("runs");

  // Runs state
  const [runs, setRuns] = useState([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [time, setTime] = useState("");
  const [image, setImage] = useState("");
  const [postRun, setPostRun] = useState("");
  const [meetupLocation, setMeetupLocation] = useState("");
  const [routeMap, setRouteMap] = useState("");
  const [distance, setDistance] = useState("");
  const [editingId, setEditingId] = useState(null);

  // Gallery state
  const [gallery, setGallery] = useState([]);
  const [galleryImage, setGalleryImage] = useState("");

  // Runners state
  const [runners, setRunners] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRunner, setSelectedRunner] = useState(null);
  const [adminNote, setAdminNote] = useState("");

  // Team state
  const [team, setTeam] = useState([]);
  const [memberName, setMemberName] = useState("");
  const [memberRole, setMemberRole] = useState("");
  const [memberImage, setMemberImage] = useState("");
  const [memberBio, setMemberBio] = useState("");
  const [memberInstagram, setMemberInstagram] = useState("");
  const [memberStrava, setMemberStrava] = useState("");
  const [editingMemberId, setEditingMemberId] = useState(null);

  useEffect(() => {
    const unsubRuns = onSnapshot(collection(db, "runs"), (snap) => {
      setRuns(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    const galleryQ = query(
      collection(db, "homepageGallery"), orderBy("order", "asc")
    );
    const unsubGallery = onSnapshot(galleryQ, (snap) => {
      setGallery(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    const unsubRunners = onSnapshot(collection(db, "runners"), (snap) => {
      setRunners(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    const unsubTeam = onSnapshot(collection(db, "team"), (snap) => {
      setTeam(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => {
      unsubRuns();
      unsubGallery();
      unsubRunners();
      unsubTeam();
    };
  }, []);

  // ── RUN CRUD ──────────────────────────────────────────
  const createRun = async () => {
    if (!title || !date || !location || !time) {
      alert("Please fill all required fields.");
      return;
    }
    await addDoc(collection(db, "runs"), {
      title, date, location, time, image,
      postRun, meetupLocation, routeMap,
      distance: parseFloat(distance) || 0,
      participants: [],
    });
    resetForm();
  };

  const updateRun = async () => {
    await updateDoc(doc(db, "runs", editingId), {
      title, date, location, time, image,
      postRun, meetupLocation, routeMap,
      distance: parseFloat(distance) || 0,
    });
    resetForm();
  };

  const editRun = (run) => {
    setTitle(run.title);
    setDate(run.date);
    setLocation(run.location);
    setTime(run.time);
    setImage(run.image || "");
    setPostRun(run.postRun || "");
    setMeetupLocation(run.meetupLocation || "");
    setRouteMap(run.routeMap || "");
    setDistance(run.distance || "");
    setEditingId(run.id);
    setActiveTab("runs");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteRun = async (id) => {
    if (!window.confirm("Delete this run?")) return;
    await deleteDoc(doc(db, "runs", id));
  };

  const resetForm = () => {
    setTitle(""); setDate(""); setLocation(""); setTime("");
    setImage(""); setPostRun(""); setMeetupLocation("");
    setRouteMap(""); setDistance(""); setEditingId(null);
  };

  // ── GALLERY ───────────────────────────────────────────
  const addGalleryImage = async () => {
    if (!galleryImage) { alert("Enter image URL"); return; }
    await addDoc(collection(db, "homepageGallery"), {
      image: galleryImage,
      order: Date.now(),
    });
    setGalleryImage("");
  };

  const deleteGalleryImage = async (id) => {
    if (!window.confirm("Delete this image?")) return;
    await deleteDoc(doc(db, "homepageGallery", id));
  };

  // ── RUNNERS ───────────────────────────────────────────
  const banRunner = async (runner) => {
    if (!window.confirm(`Ban ${runner.displayName}?`)) return;
    await updateDoc(doc(db, "runners", runner.id), { status: "banned" });
  };

  const unbanRunner = async (runner) => {
    await updateDoc(doc(db, "runners", runner.id), { status: "active" });
  };

  const saveNote = async (runner) => {
    await updateDoc(doc(db, "runners", runner.id), { adminNote });
    setSelectedRunner(null);
    setAdminNote("");
    alert("Note saved.");
  };

  const removeRunner = async (runner) => {
    if (!window.confirm(`Permanently remove ${runner.displayName}?`)) return;
    await deleteDoc(doc(db, "runners", runner.id));
  };

  const filteredRunners = runners.filter((r) =>
    r.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ── TEAM ─────────────────────────────────────────────
  const createMember = async () => {
    if (!memberName || !memberRole) {
      alert("Name and role are required.");
      return;
    }
    await addDoc(collection(db, "team"), {
      name: memberName,
      role: memberRole,
      image: memberImage,
      bio: memberBio,
      instagram: memberInstagram,
      strava: memberStrava,
    });
    resetMemberForm();
  };

  const updateMember = async () => {
    await updateDoc(doc(db, "team", editingMemberId), {
      name: memberName,
      role: memberRole,
      image: memberImage,
      bio: memberBio,
      instagram: memberInstagram,
      strava: memberStrava,
    });
    resetMemberForm();
  };

  const editMember = (member) => {
    setMemberName(member.name || "");
    setMemberRole(member.role || "");
    setMemberImage(member.image || "");
    setMemberBio(member.bio || "");
    setMemberInstagram(member.instagram || "");
    setMemberStrava(member.strava || "");
    setEditingMemberId(member.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteMember = async (id) => {
    if (!window.confirm("Remove this team member?")) return;
    await deleteDoc(doc(db, "team", id));
  };

  const resetMemberForm = () => {
    setMemberName(""); setMemberRole(""); setMemberImage("");
    setMemberBio(""); setMemberInstagram(""); setMemberStrava("");
    setEditingMemberId(null);
  };

  const tabs = [
    { id: "runs", label: "Runs" },
    { id: "gallery", label: "Gallery" },
    { id: "runners", label: `Runners (${runners.length})` },
    { id: "team", label: `Team (${team.length})` },
  ];

  return (
    <div style={styles.page}>

      <div style={styles.header}>
        <p style={styles.eyebrow}>Admin</p>
        <h1 style={styles.title}>Dashboard</h1>
      </div>

      {/* TABS */}
      <div style={styles.tabs}>
        {tabs.map((t) => (
          <button
            key={t.id}
            style={{
              ...styles.tab,
              background: activeTab === t.id ? "var(--accent)" : "var(--surface)",
              color: activeTab === t.id ? "#0a0a0a" : "var(--text2)",
              border: activeTab === t.id
                ? "1px solid var(--accent)"
                : "1px solid var(--border)",
            }}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div style={styles.container}>

        {/* ── RUNS TAB ── */}
        {activeTab === "runs" && (
          <div>
            <h2 style={styles.sectionTitle}>
              {editingId ? "Edit Run" : "Create New Run"}
            </h2>

            <div style={styles.formGrid}>
              <div style={styles.field}>
                <label style={styles.label}>Title *</label>
                <input style={styles.input} value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Sunday Morning Run" />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Date *</label>
                <input style={styles.input} value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="e.g. Sunday, 6 Apr 2025" />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Location *</label>
                <input style={styles.input} value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Panvel Lake" />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Time *</label>
                <input style={styles.input} value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="e.g. 6:30 AM" />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Distance (km)</label>
                <input style={styles.input} type="number" value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  placeholder="e.g. 5" />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Image URL</label>
                <input style={styles.input} value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://..." />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Meetup Location (Maps link)</label>
                <input style={styles.input} value={meetupLocation}
                  onChange={(e) => setMeetupLocation(e.target.value)}
                  placeholder="Google Maps link" />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Route Map (Maps link)</label>
                <input style={styles.input} value={routeMap}
                  onChange={(e) => setRouteMap(e.target.value)}
                  placeholder="Google Maps directions link" />
              </div>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Post Run Description</label>
              <textarea
                style={{ ...styles.input, minHeight: "100px", resize: "vertical" }}
                value={postRun}
                onChange={(e) => setPostRun(e.target.value)}
                placeholder="What happens after the run..."
              />
            </div>

            <div style={styles.formActions}>
              {editingId && (
                <button style={styles.cancelBtn} onClick={resetForm}>
                  Cancel
                </button>
              )}
              <button
                style={styles.primaryBtn}
                onClick={editingId ? updateRun : createRun}
              >
                {editingId ? "Update Run" : "Create Run"}
              </button>
            </div>

            <h2 style={{ ...styles.sectionTitle, marginTop: "48px" }}>
              Existing Runs ({runs.length})
            </h2>

            <div style={styles.runList}>
              {runs.map((run) => (
                <div key={run.id} style={styles.runCard}>
                  {run.image && (
                    <img src={run.image} style={styles.runImg} alt={run.title} />
                  )}
                  <div style={styles.runInfo}>
                    <p style={styles.runTitle}>{run.title}</p>
                    <p style={styles.runMeta}>
                      {run.date} · {run.location} · {run.distance || 0}km
                    </p>
                    <p style={styles.runMeta}>
                      {run.participants?.length || 0} participants
                    </p>
                  </div>
                  <div style={styles.runActions}>
                    <button style={styles.editBtn} onClick={() => editRun(run)}>
                      Edit
                    </button>
                    <button style={styles.deleteBtn} onClick={() => deleteRun(run.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── GALLERY TAB ── */}
        {activeTab === "gallery" && (
          <div>
            <h2 style={styles.sectionTitle}>Sunday Run Gallery</h2>

            <div style={styles.field}>
              <label style={styles.label}>Image URL</label>
              <input style={styles.input} value={galleryImage}
                onChange={(e) => setGalleryImage(e.target.value)}
                placeholder="https://..." />
            </div>

            {galleryImage && (
              <img src={galleryImage} style={styles.preview} alt="preview" />
            )}

            <button style={styles.primaryBtn} onClick={addGalleryImage}>
              Add Image
            </button>

            <div style={styles.galleryGrid}>
              {gallery.map((img) => (
                <div key={img.id} style={styles.galleryCard}>
                  <img src={img.image} style={styles.galleryImg} alt="" />
                  <button
                    style={{ ...styles.deleteBtn, margin: "8px" }}
                    onClick={() => deleteGalleryImage(img.id)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── RUNNERS TAB ── */}
        {activeTab === "runners" && (
          <div>
            <h2 style={styles.sectionTitle}>Registered Runners</h2>

            <input
              style={{ ...styles.input, marginBottom: "24px" }}
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <div style={styles.statsRow}>
              <div style={styles.statCard}>
                <p style={styles.statNum}>{runners.length}</p>
                <p style={styles.statLabel}>Total</p>
              </div>
              <div style={styles.statCard}>
                <p style={styles.statNum}>
                  {runners.filter((r) => r.status === "active").length}
                </p>
                <p style={styles.statLabel}>Active</p>
              </div>
              <div style={styles.statCard}>
                <p style={styles.statNum}>
                  {runners.filter((r) => r.status === "banned").length}
                </p>
                <p style={styles.statLabel}>Banned</p>
              </div>
            </div>

            <div style={styles.runnerList}>
              {filteredRunners.map((runner) => (
                <div
                  key={runner.id}
                  style={{
                    ...styles.runnerCard,
                    borderColor: runner.status === "banned"
                      ? "#ff5c5c55" : "var(--border)",
                    background: runner.status === "banned"
                      ? "#ff5c5c08" : "var(--surface)",
                  }}
                >
                  <img
                    src={runner.avatar}
                    style={styles.runnerAvatar}
                    alt={runner.displayName}
                  />
                  <div style={styles.runnerInfo}>
                    <div style={styles.runnerNameRow}>
                      <p style={styles.runnerName}>{runner.displayName}</p>
                      {runner.status === "banned" && (
                        <span style={styles.bannedBadge}>Banned</span>
                      )}
                    </div>
                    <p style={styles.runnerMeta}>{runner.email}</p>
                    <p style={styles.runnerMeta}>
                      Age {runner.age} · {runner.gender} · {runner.tshirtSize} · {runner.experience}
                    </p>
                    <p style={styles.runnerMeta}>
                      📞 {runner.phone}
                      {runner.emergencyContact && ` · Emergency: ${runner.emergencyContact} (${runner.emergencyPhone})`}
                    </p>
                    {runner.adminNote && (
                      <p style={styles.adminNote}>📝 {runner.adminNote}</p>
                    )}
                  </div>
                  <div style={styles.runnerActions}>
                    {runner.status === "banned" ? (
                      <button style={styles.unbanBtn} onClick={() => unbanRunner(runner)}>
                        Unban
                      </button>
                    ) : (
                      <button style={styles.banBtn} onClick={() => banRunner(runner)}>
                        Ban
                      </button>
                    )}
                    <button
                      style={styles.noteBtn}
                      onClick={() => {
                        setSelectedRunner(runner);
                        setAdminNote(runner.adminNote || "");
                      }}
                    >
                      Note
                    </button>
                    <button style={styles.deleteBtn} onClick={() => removeRunner(runner)}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TEAM TAB ── */}
        {activeTab === "team" && (
          <div>
            <h2 style={styles.sectionTitle}>
              {editingMemberId ? "Edit Member" : "Add Team Member"}
            </h2>

            <div style={styles.formGrid}>
              <div style={styles.field}>
                <label style={styles.label}>Name *</label>
                <input style={styles.input} value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  placeholder="Full name" />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Role *</label>
                <input style={styles.input} value={memberRole}
                  onChange={(e) => setMemberRole(e.target.value)}
                  placeholder="e.g. Founder, Pacer, Photographer" />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Photo URL</label>
                <input style={styles.input} value={memberImage}
                  onChange={(e) => setMemberImage(e.target.value)}
                  placeholder="https://..." />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Instagram URL</label>
                <input style={styles.input} value={memberInstagram}
                  onChange={(e) => setMemberInstagram(e.target.value)}
                  placeholder="https://instagram.com/..." />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Strava URL</label>
                <input style={styles.input} value={memberStrava}
                  onChange={(e) => setMemberStrava(e.target.value)}
                  placeholder="https://strava.com/athletes/..." />
              </div>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Bio</label>
              <textarea
                style={{ ...styles.input, minHeight: "80px", resize: "vertical" }}
                value={memberBio}
                onChange={(e) => setMemberBio(e.target.value)}
                placeholder="Short bio about this member..."
              />
            </div>

            {memberImage && (
              <img src={memberImage} style={styles.preview} alt="preview" />
            )}

            <div style={styles.formActions}>
              {editingMemberId && (
                <button style={styles.cancelBtn} onClick={resetMemberForm}>
                  Cancel
                </button>
              )}
              <button
                style={styles.primaryBtn}
                onClick={editingMemberId ? updateMember : createMember}
              >
                {editingMemberId ? "Update Member" : "Add Member"}
              </button>
            </div>

            <h2 style={{ ...styles.sectionTitle, marginTop: "48px" }}>
              Team Members ({team.length})
            </h2>

            <div style={styles.teamGrid}>
              {team.map((member) => (
                <div key={member.id} style={styles.teamCard}>
                  {member.image && (
                    <img
                      src={member.image}
                      style={styles.teamImg}
                      alt={member.name}
                    />
                  )}
                  <div style={styles.teamInfo}>
                    <p style={styles.teamName}>{member.name}</p>
                    <p style={styles.teamRole}>{member.role}</p>
                    {member.bio && (
                      <p style={styles.runnerMeta}>{member.bio}</p>
                    )}
                  </div>
                  <div style={styles.runnerActions}>
                    <button
                      style={styles.editBtn}
                      onClick={() => editMember(member)}
                    >
                      Edit
                    </button>
                    <button
                      style={styles.deleteBtn}
                      onClick={() => deleteMember(member.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* NOTE MODAL */}
      {selectedRunner && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>
              Note for {selectedRunner.displayName}
            </h3>
            <textarea
              style={{ ...styles.input, minHeight: "120px", resize: "vertical" }}
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              placeholder="Add a note about this runner..."
            />
            <div style={styles.modalActions}>
              <button style={styles.cancelBtn} onClick={() => setSelectedRunner(null)}>
                Cancel
              </button>
              <button style={styles.primaryBtn} onClick={() => saveNote(selectedRunner)}>
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

const styles = {
  page: { marginTop: "64px" },
  header: { padding: "60px 24px 0", maxWidth: "1000px", margin: "0 auto" },
  eyebrow: {
    fontSize: "12px", fontWeight: "600", letterSpacing: "3px",
    textTransform: "uppercase", color: "var(--accent)", marginBottom: "8px",
  },
  title: {
    fontSize: "clamp(28px, 5vw, 42px)", fontWeight: "700",
    color: "var(--text)", marginBottom: "32px",
  },
  tabs: {
    display: "flex", gap: "8px", padding: "0 24px",
    maxWidth: "1000px", margin: "0 auto", flexWrap: "wrap",
  },
  tab: {
    padding: "10px 20px", borderRadius: "20px", fontSize: "13px",
    fontWeight: "600", cursor: "pointer", transition: "all 0.2s",
  },
  container: { padding: "40px 24px 80px", maxWidth: "1000px", margin: "0 auto" },
  sectionTitle: {
    fontSize: "20px", fontWeight: "700", color: "var(--text)",
    marginBottom: "24px", paddingBottom: "12px", borderBottom: "1px solid var(--border)",
  },
  formGrid: {
    display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "16px", marginBottom: "16px",
  },
  field: { display: "flex", flexDirection: "column", gap: "6px", marginBottom: "12px" },
  label: {
    fontSize: "11px", fontWeight: "600", color: "var(--text2)",
    textTransform: "uppercase", letterSpacing: "0.5px",
  },
  input: {
    padding: "10px 14px", borderRadius: "8px", border: "1px solid var(--border)",
    background: "var(--surface)", color: "var(--text)", fontSize: "14px",
    outline: "none", width: "100%",
  },
  formActions: { display: "flex", gap: "12px", marginTop: "8px" },
  primaryBtn: {
    background: "var(--accent)", color: "#0a0a0a", border: "none",
    padding: "12px 24px", borderRadius: "8px", fontWeight: "700",
    fontSize: "14px", cursor: "pointer",
  },
  cancelBtn: {
    background: "none", color: "var(--text2)", border: "1px solid var(--border)",
    padding: "12px 24px", borderRadius: "8px", fontWeight: "600",
    fontSize: "14px", cursor: "pointer",
  },
  preview: {
    width: "160px", borderRadius: "10px", marginBottom: "16px",
    display: "block", border: "1px solid var(--border)",
  },

  // RUNS
  runList: { display: "flex", flexDirection: "column", gap: "12px" },
  runCard: {
    display: "flex", alignItems: "center", gap: "16px",
    background: "var(--surface)", border: "1px solid var(--border)",
    borderRadius: "12px", overflow: "hidden",
  },
  runImg: { width: "80px", height: "80px", objectFit: "cover", flexShrink: 0 },
  runInfo: { flex: 1, padding: "12px 0" },
  runTitle: { fontWeight: "600", color: "var(--text)", fontSize: "15px", marginBottom: "4px" },
  runMeta: { fontSize: "12px", color: "var(--text2)", marginBottom: "2px" },
  runActions: { display: "flex", gap: "8px", padding: "0 16px", flexShrink: 0 },
  editBtn: {
    background: "var(--surface2)", border: "1px solid var(--border)",
    color: "var(--text)", padding: "6px 14px", borderRadius: "6px",
    fontSize: "12px", fontWeight: "600", cursor: "pointer",
  },
  deleteBtn: {
    background: "#ff5c5c18", border: "1px solid #ff5c5c55", color: "#ff5c5c",
    padding: "6px 14px", borderRadius: "6px", fontSize: "12px",
    fontWeight: "600", cursor: "pointer",
  },

  // GALLERY
  galleryGrid: {
    display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "16px", marginTop: "24px",
  },
  galleryCard: {
    background: "var(--surface)", border: "1px solid var(--border)",
    borderRadius: "10px", overflow: "hidden", textAlign: "center",
  },
  galleryImg: { width: "100%", height: "140px", objectFit: "cover", display: "block" },

  // RUNNERS
  statsRow: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "28px" },
  statCard: {
    background: "var(--surface)", border: "1px solid var(--border)",
    borderRadius: "12px", padding: "20px", textAlign: "center",
  },
  statNum: { fontSize: "32px", fontWeight: "700", color: "var(--accent)", marginBottom: "4px" },
  statLabel: { fontSize: "12px", color: "var(--text2)", textTransform: "uppercase", letterSpacing: "1px" },
  runnerList: { display: "flex", flexDirection: "column", gap: "12px" },
  runnerCard: {
    display: "flex", alignItems: "center", gap: "16px", padding: "16px",
    borderRadius: "12px", border: "1px solid var(--border)", flexWrap: "wrap",
  },
  runnerAvatar: {
    width: "52px", height: "52px", borderRadius: "50%", objectFit: "cover",
    flexShrink: 0, border: "2px solid var(--border)",
  },
  runnerInfo: { flex: 1, minWidth: "200px" },
  runnerNameRow: { display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" },
  runnerName: { fontWeight: "600", fontSize: "15px", color: "var(--text)" },
  bannedBadge: {
    background: "#ff5c5c18", border: "1px solid #ff5c5c55", color: "#ff5c5c",
    fontSize: "10px", fontWeight: "700", padding: "2px 8px",
    borderRadius: "10px", textTransform: "uppercase",
  },
  runnerMeta: { fontSize: "12px", color: "var(--text2)", marginBottom: "2px", lineHeight: 1.5 },
  adminNote: { fontSize: "12px", color: "var(--accent)", marginTop: "4px", fontStyle: "italic" },
  runnerActions: { display: "flex", gap: "8px", flexShrink: 0, flexWrap: "wrap" },
  banBtn: {
    background: "#ff5c5c18", border: "1px solid #ff5c5c55", color: "#ff5c5c",
    padding: "6px 14px", borderRadius: "6px", fontSize: "12px", fontWeight: "600", cursor: "pointer",
  },
  unbanBtn: {
    background: "#00f5a018", border: "1px solid #00f5a055", color: "#00f5a0",
    padding: "6px 14px", borderRadius: "6px", fontSize: "12px", fontWeight: "600", cursor: "pointer",
  },
  noteBtn: {
    background: "var(--surface2)", border: "1px solid var(--border)", color: "var(--text)",
    padding: "6px 14px", borderRadius: "6px", fontSize: "12px", fontWeight: "600", cursor: "pointer",
  },

  // TEAM
  teamGrid: { display: "flex", flexDirection: "column", gap: "12px" },
  teamCard: {
    display: "flex", alignItems: "center", gap: "16px",
    background: "var(--surface)", border: "1px solid var(--border)",
    borderRadius: "12px", overflow: "hidden",
  },
  teamImg: { width: "72px", height: "72px", objectFit: "cover", flexShrink: 0 },
  teamInfo: { flex: 1, padding: "12px 0" },
  teamName: { fontWeight: "600", color: "var(--text)", fontSize: "15px", marginBottom: "2px" },
  teamRole: { fontSize: "12px", color: "var(--accent)", fontWeight: "600", marginBottom: "4px" },

  // MODAL
  modalOverlay: {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 9999, padding: "24px",
  },
  modal: {
    background: "var(--bg)", border: "1px solid var(--border)",
    borderRadius: "16px", padding: "32px", width: "100%", maxWidth: "480px",
  },
  modalTitle: { fontSize: "18px", fontWeight: "700", color: "var(--text)", marginBottom: "20px" },
  modalActions: { display: "flex", gap: "12px", marginTop: "16px", justifyContent: "flex-end" },
};

