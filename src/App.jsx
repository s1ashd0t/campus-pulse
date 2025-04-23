import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import "./App.css";
import Login from "./pages/Login";
import Landing from "./pages/Landing";
import Profile from "./pages/Profile";
import SignUp from "./pages/SignUp";
import Homepage from "./pages/Homepage";
import QRScannerComponent from './pages/Scanner';
import Search from "./pages/Search";
import Admin from "./pages/Admin";
import Leaderboard from "./pages/Leaderboard";
import Notifications from "./pages/Notifications";
import Navigation from "./pages/Navigation";
import icon from "./assets/icon.png";
import Unauthorized from "./pages/Unauthorized";
import { AdminRoute } from "./components/AdminRoute";

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
  const [showNav, setShowNav] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="app-container">
      <Navigation isOpen={showNav} onClose={() => setShowNav(!showNav)} />

      <div className="heading">
        <a href="/">
          <img src={icon} alt="Campus Pulse Logo" />
          <div className="text">
            <h1>Campus Pulse</h1>
            <h6>Never miss a beat</h6>
          </div>
        </a>
      </div>

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />
        <Route path="/homepage" element={<PrivateRoute element={<Homepage />} />} />
        <Route path="/scanner" element={<PrivateRoute element={<QRScannerComponent />} />} />
        <Route path="/search" element={<PrivateRoute element={<Search />} />} />
        <Route path="/admin" element={<AdminRoute element={<Admin />} />} />
        <Route path="/leaderboard" element={<PrivateRoute element={<Leaderboard />} />} />
        <Route path="/notifications" element={<PrivateRoute element={<Notifications />} />} />
      </Routes>

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Campus Pulse. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
