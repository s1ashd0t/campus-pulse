import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import "./App.css";
import Login from "./pages/Login";
import Landing from "./pages/Landing";
import Profile from "./pages/Profile";
import SignUp from "./pages/SignUp";
import Homepage from "./pages/Homepage";
import Navigation from "./pages/Navigation";
import QRScannerComponent from './pages/Scanner'
import Search from "./pages/Search";
import CreateEvent from "./components/CreateEvent";

import Leaderboard from "./pages/Leaderboard";
import Notifications from "./pages/Notifications";
import menuIcon from "./assets/menu.svg";
import closeIcon from "./assets/close.svg";


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

// Navbar overlay — conditional based on auth
const NavBar = ({ isAuthenticated, onClose }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div className="nav-overlay">
      <ul>
        <li><Link to="/" onClick={onClose}>Home</Link></li>
        {isAuthenticated ? (
          <>
            <li><Link to="/leaderboard" onClick={onClose}>Leaderboard</Link></li>
            <li><Link to="/notifications" onClick={onClose}>Notifications</Link></li>
            <li><Link to="/profile" onClick={onClose}>Profile</Link></li>
            <li>
              <button onClick={() => { handleLogout(); onClose(); }} className="logout-button">
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li><Link to="/login" onClick={onClose}>Login</Link></li>
            <li><Link to="/signup" onClick={onClose}>Sign Up</Link></li>
          </>
        )}
      </ul>
    </div>
  );
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
    <Router>
      <div className="app-container">

        {/* Toggle between menu and close icon */}
        <img
          src={showNav ? closeIcon : menuIcon}
          className="menu-icon"
          alt={showNav ? "close menu" : "menu icon"}
          onClick={() => setShowNav(!showNav)}
        />

        <div className="heading">
          <a href="/">
            <h1>Campus Pulse</h1>
          </a>
        </div>

        {showNav && <NavBar isAuthenticated={isAuthenticated} onClose={() => setShowNav(false)} />}

        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />
          <Route path="/homepage" element={<PrivateRoute element={<Homepage />} />} />
          <Route path="/scanner" element={<PrivateRoute element={<QRScannerComponent />} />} />
          <Route path="/search" element={<PrivateRoute element={<Search />} />} />
          <Route path="/admin" element={<PrivateRoute element={<CreateEvent />} />} />


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
