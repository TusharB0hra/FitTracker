import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#ffbb28"];

const Analytics = () => {
  const [workouts, setWorkouts] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    axios.get("http://localhost:5000/api/workouts")
      .then(res => setWorkouts(res.data))
      .catch(err => console.error("Error fetching data", err));
  }, []);

  // Count per body part
  const countByBodyPart = workouts.reduce((acc, workout) => {
    const part = workout.bodyPart.toLowerCase();
    acc[part] = (acc[part] || 0) + 1;
    return acc;
  }, {});

  const data = Object.entries(countByBodyPart).map(([name, value]) => ({ name, value }));

  // Filtered data for table/bar (optional)
  const filtered = filter === "all"
    ? workouts
    : workouts.filter(w => w.bodyPart.toLowerCase() === filter.toLowerCase());

  return (
  // ⬇️ Your provided styled code goes here
  <div style={{
    padding: "20px",
    maxWidth: "900px",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif"
  }}>
    <h2 style={{ textAlign: "center", marginBottom: "30px" }}>
      📊 FitTrack Analytics Dashboard
    </h2>

    {/* Filter Dropdown */}
    <div style={{
      display: "flex",
      justifyContent: "center",
      marginBottom: "30px"
    }}>
      <select
        onChange={(e) => setFilter(e.target.value)}
        value={filter}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          borderRadius: "8px",
          border: "1px solid #ccc"
        }}
      >
        <option value="all">All Body Parts</option>
        {Object.keys(countByBodyPart).map((part, idx) => (
          <option key={idx} value={part}>{part}</option>
        ))}
      </select>
    </div>

    {/* Responsive Pie Chart */}
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius="80%"
            label
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>

    {/* Bar Chart Section */}
    <h3 style={{ textAlign: "center", marginTop: "40px" }}>
      📈 Workout Frequency by Body Part
    </h3>

    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#8884d8" radius={[10, 10, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>

    {/* Filtered List if Needed */}
    {filter !== "all" && (
      <div style={{ marginTop: "40px", textAlign: "center" }}>
        <h4>{filter.toUpperCase()} Workouts:</h4>
        {filtered.length === 0 ? (
          <p>No workouts found for this body part.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {filtered.map((w, i) => (
              <li key={i}>
                <strong>{w.name}</strong> — {w.sets}x{w.reps}
              </li>
            ))}
          </ul>
        )}
      </div>
    )}
  </div>
);

};

export default Analytics;
