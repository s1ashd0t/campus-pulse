import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import logo from "./assets/icon.png";
import "./App.css";
import Login from "./pages/Login";

import Landing from "./pages/Landing";
import Profile from "./Profile";
import SignUp from "./SignUp";

// PrivateRoute component to protect routes that require authentication
const PrivateRoute = ({ element }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  return isLoggedIn ? element : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Keep the logo in App.jsx */}
        <div>
          <a href="/" target="_blank">
            <img src={logo} className="logo" alt="logo" />
          </a>
        </div>

        {/* Define routes */}
        <Routes>
          <Route path="/" element={<Landing />} /> {/* Landing Page as Home */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={< SignUp/>} />
          <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;