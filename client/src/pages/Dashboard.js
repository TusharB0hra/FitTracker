import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";

const Dashboard = () => {
  // Replace the single 'form' state with individual state variables
  const [name, setName] = useState("");
  const [bodyPart, setBodyPart] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [image, setImage] = useState(null); // State for the file input

  const [workouts, setWorkouts] = useState([]);

  // ✅ Fetch workouts on load
  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    const res = await axios.get("http://localhost:5000/api/workouts");
    setWorkouts(res.data);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name) return; // Check for 'name' instead of 'form.name'

    // Create a FormData object to handle both text and file data
    const formData = new FormData();
    formData.append("name", name);
    formData.append("bodyPart", bodyPart);
    formData.append("sets", sets);
    formData.append("reps", reps);
    formData.append("videoUrl", videoUrl);
    if (image) {
      formData.append("image", image); // Append the image file
    }

    // Update the axios post request to send FormData
    await axios.post("http://localhost:5000/api/workouts", formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Important for file uploads
      },
    });

    // Reset individual state variables after submission
    setName("");
    setBodyPart("");
    setSets("");
    setReps("");
    setVideoUrl("");
    setImage(null); // Reset file input

    fetchWorkouts();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/workouts/${id}`);
    fetchWorkouts();
  };

  // ✅ Converts YouTube to embed format
  function convertToEmbed(url) {
    let embedUrl = url;

    if (url.includes("watch?v=")) {
      embedUrl = url.replace("watch?v=", "embed/");
    } else if (url.includes("youtu.be/")) {
      embedUrl = url.replace("youtu.be/", "www.youtube.com/embed/");
    } else if (url.includes("shorts/")) {
      embedUrl = url.replace("shorts/", "embed/");
    }

    // ✅ Remove query parameters like ?si=xyz
    return embedUrl.split("?")[0];
  }

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
              value={name} // Use 'name' state
              onChange={(e) => setName(e.target.value)} // Update 'name' state
              required
            />
            <input
              type="text"
              placeholder="Body Part"
              value={bodyPart} // Use 'bodyPart' state
              onChange={(e) => setBodyPart(e.target.value)} // Update 'bodyPart' state
            />
            <input
              type="number"
              placeholder="Sets"
              value={sets} // Use 'sets' state
              onChange={(e) => setSets(e.target.value)} // Update 'sets' state
            />
            <input
              type="number"
              placeholder="Reps"
              value={reps} // Use 'reps' state
              onChange={(e) => setReps(e.target.value)} // Update 'reps' state
            />
            <input
              type="text"
              placeholder="YouTube Video URL"
              value={videoUrl} // Use 'videoUrl' state
              onChange={(e) => setVideoUrl(e.target.value)} // Update 'videoUrl' state
            />
            <input
              type="file"
              onChange={(e) => setImage(e.target.files[0])} // Handle file selection
            />
            <button type="submit" style={{ marginLeft: "10px" }}>
              ➕ Add
            </button>
          </form>

          <h3 style={{ marginTop: "30px" }}>📋 Your Workouts</h3>
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

                {w.videoUrl && (
                  <div style={{ marginTop: "10px" }}>
                    <p>{convertToEmbed(w.videoUrl)}</p>

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
                {/* You can display the image if there's an 'imageUrl' in your workout object */}
                {w.imageUrl && (
                  <div style={{ marginTop: "10px" }}>
                    <img src={w.imageUrl} alt={w.name} style={{ maxWidth: "320px", maxHeight: "180px" }} />
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;