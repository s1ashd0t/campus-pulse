import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import logo from "./assets/icon.png";
import "./App.css";
import Login from "./pages/Login";
import Landing from "./pages/Landing";
import Profile from "./pages/Profile";
import SignUp from "./pages/SignUp";
import Navigation from "./pages/Navigation";
import close from './assets/close.svg';
import menu from './assets/menu.svg';

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
        {/* Keep the logo in App.jsx */}
        <img src={menu} className="menu" alt="menu" />
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
          <Route path="/leaderboard" element={<PrivateRoute element={<Leaderboard />} />} />
          <Route path="/notifications" element={<PrivateRoute element={<Notifications />} />} />
        </Routes>
        
        <footer className="footer">
          <p>&copy; {new Date().getFullYear()} Campus Pulse. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;