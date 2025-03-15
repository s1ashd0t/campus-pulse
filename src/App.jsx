import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import logo from "./assets/icon.png";
import "./App.css";
import Login from "./pages/Login";
import Landing from "./pages/Landing";
import Leaderboard from "./pages/Leaderboard";
import Notifications from "./pages/Notifications";

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Keeping logo in App.jsx to appear in all pages for testing */}
        <div>
          <a href="https://vite.dev" target="_blank" rel="noopener noreferrer">
            <img src={logo} className="logo" alt="logo" />
          </a>
        </div>

        <nav>
          <Link to="/">Home</Link> |{" "}
          <Link to="/leaderboard">Leaderboard</Link> |{" "}
          <Link to="/notifications">Notifications</Link> |{" "}
          <Link to="/login">Login</Link>
        </nav>

        {/* Defining the routes */}
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/notifications" element={<Notifications />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;