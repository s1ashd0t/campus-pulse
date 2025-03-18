import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
// src/App.jsx
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import logo from "./assets/icon.png";
import "./App.css";
import Login from "./pages/Login";
import Landing from "./pages/Landing";

import Leaderboard from "./pages/Leaderboard";
import Notifications from "./pages/Notifications";

import Profile from "./pages/Profile";
import SignUp from "./pages/SignUp";
import Navigation from "./pages/Navigation";
import close from './assets/close.svg'
import menu from './assets/menu.svg'
import Leaderboard from './pages/Leaderboard';
import Notifications from './pages/Notifications';


// PrivateRoute component to protect routes that require authentication
const PrivateRoute = ({ element }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? element : <Navigate to="/login" />;
};


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
        {/* Keep the logo in App.jsx */}
        
        <Navigation />



        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />
          <Route path="/leaderboard" element={<PrivateRoute element={<Leaderboard />} />} />
          <Route path="/notifications" element={<PrivateRoute element={<Notifications />} />} />
        </Routes>


        <footer className="footer">
          <p>&copy; {new Date().getFullYear()} Campus Pulse. All rights reserved.</p>
        </footer>
        {/* Keep the logo in App.jsx */}
        <img src={menu} className="menu" />
        <Navigation />
        <div className="heading">
          <a href="/">
          <h1>Campus Pulse</h1>
          </a>
          
        </div>

        {/* Define routes */}
        <Routes>
          <Route path="/" element={<Landing />} /> {/* Landing Page as Home */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />
        </Routes>
        
        <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Campus Pulse. All rights reserved.</p>
      </footer>
      </div>
    </Router>
  );
}

export default App;