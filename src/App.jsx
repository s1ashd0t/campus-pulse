import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import "./App.css";
import Login from "./pages/Login";
import Landing from "./pages/Landing";
import Profile from "./pages/Profile";
import SignUp from "./pages/SignUp";
import Navigation from "./pages/Navigation"; // Import Navigation
import Dashboard from "./pages/Dashboard";

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
  const location = useLocation(); // Get current route

  // Show Navigation except on Login & Signup pages
  const showNavigation = !["/login", "/signup"].includes(location.pathname);

  return (
    <div className="app-container">
      {showNavigation && <Navigation />} {/* Display Navigation */}

      <div className="heading">
        <a href="/profile">
          <h1>Campus Pulse</h1>
        </a>
      </div>

      {/* Define Routes */}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
        <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />
      </Routes>

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Campus Pulse. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;