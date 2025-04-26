import React, { useEffect, useState, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import { AuthContext, AuthProvider } from "./context/AuthContext";
import "./App.css";
import EventDetails from "./pages/EventDetails";
import Survey from "./pages/Survey";
import Login from "./pages/Login";
import Landing from "./pages/Landing";
import Profile from "./pages/Profile";
import SignUp from "./pages/SignUp";
import Homepage from "./pages/Homepage";
import QRScannerComponent from './pages/Scanner'
import Search from "./pages/Search";
import CreateEvent from "./pages/components/CreateEvent";
import Leaderboard from "./pages/Leaderboard";
import Notifications from "./pages/Notifications";
import RedeemPoints from "./pages/RedeemPoints";
import menuIcon from "./assets/menu.svg";
import closeIcon from "./assets/close.svg";
import icon from "./assets/icon.png";
import Dashboard from "./pages/dashboard";
import AdminDashboard from "./pages/AdminDashboard";


const PrivateRoute = ({ element }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? element : <Navigate to="/login" />;
};

const AdminRoute = ({ element }) => {
  const { user, userRole, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  return user && userRole === "admin" ? element : <Navigate to="/homepage" />;
};

// Navbar overlay — conditional based on auth and role
const NavBar = ({ onClose }) => {
  const navigate = useNavigate();
  const { user, userRole } = useContext(AuthContext);
  const isAdmin = userRole === "admin";

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div className="nav-overlay">
      <ul>
        <li><Link to="/homepage" onClick={onClose}>Home</Link></li>
        {user ? (
          <>
            <li><Link to="/leaderboard" onClick={onClose}>Leaderboard</Link></li>
            <li><Link to="/notifications" onClick={onClose}>Notifications</Link></li>
            <li><Link to="/redeem" onClick={onClose}>Redeem Points</Link></li>
            <li><Link to="/profile" onClick={onClose}>Profile</Link></li>
            <li><Link to="/dashboard" onClick={onClose}>Dashboard</Link></li>
            
            {/* Admin-only links */}
            {isAdmin && (
              <>
                <li><Link to="/admin" onClick={onClose}>Create Event</Link></li>
                <li><Link to="/admin-dashboard" onClick={onClose}>Admin Dashboard</Link></li>
              </>
            )}
            
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

function AppContent() {
  const [showNav, setShowNav] = useState(false);
  const { user } = useContext(AuthContext);

  return (
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
          <img src={icon} alt="" />
          <div className="text">
            <h1>Campus Pulse</h1>
            <h6>Never miss a beat</h6>
          </div>
        </a>
      </div>

      {showNav && <NavBar onClose={() => setShowNav(false)} />}

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />
        <Route path="/homepage" element={<PrivateRoute element={<Homepage />} />} />
        <Route path="/scanner" element={<PrivateRoute element={<QRScannerComponent />} />} />
        <Route path="/search" element={<PrivateRoute element={<Search />} />} />
        <Route path="/admin" element={<AdminRoute element={<CreateEvent />} />} />
        <Route path="/admin-dashboard" element={<AdminRoute element={<AdminDashboard />} />} />
        <Route path="/leaderboard" element={<PrivateRoute element={<Leaderboard />} />} />
        <Route path="/notifications" element={<PrivateRoute element={<Notifications />} />} />
        <Route path="/redeem" element={<PrivateRoute element={<RedeemPoints />} />} />
        <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
        <Route path="/survey" element={<PrivateRoute element={<Survey />} />} />
        <Route path="/event/:id" element={<PrivateRoute element={<EventDetails />} />} />
      </Routes>

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Campus Pulse. All rights reserved.</p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
