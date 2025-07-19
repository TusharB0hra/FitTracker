import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";

export default function Dashboard() {
  const [workouts, setWorkouts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    bodyPart: "",
    sets: "",
    reps: "",
    videoUrl: ""
  });

  // 🔁 Smart YouTube URL converter function
 function convertToEmbed(url) {
  let embedUrl = url;

  if (url.includes("watch?v=")) {
    embedUrl = url.replace("watch?v=", "embed/");
  } else if (url.includes("youtu.be")) {
    embedUrl = url.replace("youtu.be/", "www.youtube.com/embed/");
  } else if (url.includes("shorts")) {
    embedUrl = url.replace("shorts/", "embed/");
  }

  // Remove query parameters like ?si=...
  return embedUrl.split("?")[0];
}


  // Fetch all workouts
  const fetchWorkouts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/workouts");
      setWorkouts(res.data);
    } catch (err) {
      console.error("Error fetching workouts", err);
    }
  };

  // Add a workout
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.name || !form.sets || !form.reps) {
      alert("Please fill all required fields");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/workouts", form);
      setForm({ name: "", bodyPart: "", sets: "", reps: "", videoUrl: "" });
      fetchWorkouts();
    } catch (err) {
      console.error("Error adding workout", err);
    }
  };

  // Delete a workout
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/workouts/${id}`);
      fetchWorkouts();
    } catch (err) {
      console.error("Error deleting workout", err);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1 }}>
        <Topbar />
        <div style={{ padding: "20px" }}>
          <h2>🏋️ Add Workout</h2>
          <form onSubmit={handleAdd} style={{ marginBottom: "20px" }}>
            <input
              type="text"
              placeholder="Exercise Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              style={{ marginRight: "10px", padding: "5px" }}
            />
            <input
              type="text"
              placeholder="Body Part"
              value={form.bodyPart}
              onChange={(e) => setForm({ ...form, bodyPart: e.target.value })}
              style={{ marginRight: "10px", padding: "5px" }}
            />
            <input
              type="number"
              placeholder="Sets"
              value={form.sets}
              onChange={(e) => setForm({ ...form, sets: e.target.value })}
              required
              style={{ marginRight: "10px", padding: "5px" }}
            />
            <input
              type="number"
              placeholder="Reps"
              value={form.reps}
              onChange={(e) => setForm({ ...form, reps: e.target.value })}
              required
              style={{ marginRight: "10px", padding: "5px" }}
            />
            <input
              type="text"
              placeholder="YouTube Video URL"
              value={form.videoUrl}
              onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
              style={{ marginRight: "10px", padding: "5px" }}
            />
            <button type="submit" style={{ padding: "6px 10px" }}>
              ➕ Add
            </button>
          </form>

          <h3>📋 Your Workouts</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
  {workouts.map((w) => (
    <li key={w._id} style={{ marginBottom: "20px" }}>
      <strong>{w.name}</strong> – {w.bodyPart} – {w.sets}x{w.reps}
      <button
        onClick={() => handleDelete(w._id)}
        style={{
          marginLeft: "10px",
          background: "red",
          color: "#fff",
          border: "none",
          padding: "3px 6px",
          cursor: "pointer"
        }}
      >
        ❌ Delete
      </button>

      {/* ✅ Embedded YouTube video */}
      {w.videoUrl && (
        <div style={{ marginTop: "10px" }}>
          <iframe
            width="320"
            height="180"
            src={convertToEmbed(w.videoUrl)}
            title={w.name}
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </div>
      )}
    </li>
  ))}
</ul>
        </div>
      </div>
    </div>
  );
}
