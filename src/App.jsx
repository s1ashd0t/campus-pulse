import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import logo from "./assets/icon.png";
import "./App.css";
import Login from "./pages/Login";
import Landing from "./pages/Landing";

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Keep the logo in App.jsx */}
        <div>
          <a href="https://vite.dev" target="_blank">
            <img src={logo} className="logo" alt="logo" />
          </a>
        </div>

        {/* Define routes */}
        <Routes>
        <Route path="/" element={<Landing />} /> {/* Landing Page as Home */}
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
