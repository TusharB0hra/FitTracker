import React from "react";
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div style={{
      width: "200px",
      background: "#222",
      color: "#fff",
      padding: "20px",
      height: "100vh",
      position: "sticky",
      top: 0
    }}>
      <h2>FitTrack</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        <li><Link to="/dashboard" style={{ color: "#fff", textDecoration: "none" }}>🏠 Dashboard</Link></li>
        <li><button onClick={() => { localStorage.clear(); window.location.href = "/" }} style={{
          marginTop: "20px",
          padding: "10px",
          background: "#ff5555",
          color: "#fff",
          border: "none",
          cursor: "pointer",
            width: "100%",
            textAlign: "left"               
        }}>🚪 Logout</button></li>
      </ul>
    </div>
  );
}
