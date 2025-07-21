import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";

const Dashboard = () => {
  // State for workout form inputs
  const [name, setName] = useState("");
  const [bodyPart, setBodyPart] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // State for workouts list
  const [workouts, setWorkouts] = useState([]);

  // Fetch workouts on initial render
  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    const res = await axios.get("http://localhost:5000/api/workouts");
    setWorkouts(res.data);
  };

  // Handle form submission
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name) return;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("bodyPart", bodyPart);
    formData.append("sets", sets);
    formData.append("reps", reps);
    formData.append("videoUrl", videoUrl);
    if (image) {
      formData.append("image", image);
    }

    await axios.post("http://localhost:5000/api/workouts", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // Reset form
    setName("");
    setBodyPart("");
    setSets("");
    setReps("");
    setVideoUrl("");
    setImage(null);
    setImagePreview(null);
    fetchWorkouts();
  };

  // Handle delete
  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/workouts/${id}`);
    fetchWorkouts();
  };

  // Convert YouTube link to embed
  const convertToEmbed = (url) => {
    let embedUrl = url;
    if (url.includes("watch?v=")) {
      embedUrl = url.replace("watch?v=", "embed/");
    } else if (url.includes("youtu.be/")) {
      embedUrl = url.replace("youtu.be/", "www.youtube.com/embed/");
    } else if (url.includes("shorts/")) {
      embedUrl = url.replace("shorts/", "embed/");
    }
    return embedUrl.split("?")[0];
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1 }}>
        <Topbar />
        <div style={{ padding: "20px" }}>
          <h2>🏋️‍♂️ Add Workout</h2>
          <form onSubmit={handleAdd}>
            <input
              type="text"
              placeholder="Exercise Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Body Part"
              value={bodyPart}
              onChange={(e) => setBodyPart(e.target.value)}
            />
            <input
              type="number"
              placeholder="Sets"
              value={sets}
              onChange={(e) => setSets(e.target.value)}
            />
            <input
              type="number"
              placeholder="Reps"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
            />
            <input
              type="text"
              placeholder="YouTube Video URL"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                setImage(file);
                if (file) {
                  setImagePreview(URL.createObjectURL(file));
                }
              }}
            />

            {/* Image Preview */}
            {imagePreview && (
              <div style={{ marginTop: "10px" }}>
                <p style={{ fontSize: "14px" }}>📸 Image Preview:</p>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{ width: "200px", borderRadius: "8px" }}
                />
              </div>
            )}

            <button type="submit" style={{ marginTop: "10px" }}>
              ➕ Add Workout
            </button>
          </form>

          <h3 style={{ marginTop: "30px" }}>📋 Your Workouts</h3>

          {/* Workout Cards Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "20px",
              paddingTop: "20px",
            }}
          >
            {workouts.map((w, i) => (
              <div
                key={i}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "10px",
                  padding: "15px",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  background: "#fff",
                }}
              >
                <h3>{w.name}</h3>
                <p><strong>Body Part:</strong> {w.bodyPart}</p>
                <p><strong>Sets x Reps:</strong> {w.sets} x {w.reps}</p>

                {w.videoUrl && (
                  <iframe
                    width="100%"
                    height="200"
                    src={convertToEmbed(w.videoUrl)}
                    title="Workout Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ marginTop: "10px", borderRadius: "8px" }}
                  />
                )}

                {w.image && (
                  <img
                    src={`http://localhost:5000/uploads/${w.image}`}
                    alt="Workout"
                    style={{
                      width: "100%",
                      marginTop: "10px",
                      borderRadius: "8px",
                    }}
                  />
                )}

                <button
                  onClick={() => handleDelete(w._id)}
                  style={{
                    background: "#ff4d4d",
                    color: "#fff",
                    padding: "6px 12px",
                    border: "none",
                    borderRadius: "5px",
                    marginTop: "10px",
                    cursor: "pointer",
                  }}
                >
                  ❌ Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
