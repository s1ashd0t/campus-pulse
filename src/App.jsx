import React, { useEffect, useState, useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { AuthContext } from "./context/AuthContext";
import "./App.css";
import EventDetails from "./pages/EventDetails";
import EventsPage from "./pages/EventsPage";
import Survey from "./pages/Survey";
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
import EventRegistration from "./pages/EventRegistration";
import TestNotifications from "./pages/TestNotifications";
import RedeemPoints from "./pages/RedeemPoints";
import menuIcon from "./assets/menu.svg";
import closeIcon from "./assets/close.svg";
import Dashboard from "./pages/dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminHomepage from "./pages/AdminHomepage";
import AdminEventsPage from "./pages/AdminEventsPage";
import Events from "./pages/Events";
import Analytics from "./pages/components/Analytics";

const PrivateRoute = ({ element, requireAdmin }) => {
  const { user, userRole, loading } = useContext(AuthContext);
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  // Not authenticated at all
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  // If route requires admin access but user is not admin
  if (requireAdmin && userRole !== "admin") {
    return <Navigate to="/unauthorized" />;
  }
  
  return element;
};

const AdminRoute = ({ element }) => {
  const { user, userRole, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (userRole !== "admin") {
    return <Navigate to="/unauthorized" />;
  }

  return element;
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

  // Add effect to handle body scrolling
  useEffect(() => {
    if (showNav) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showNav]);

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
        <Route path="/register/:eventId" element={<PrivateRoute element={<EventRegistration />} />} />
        <Route path="/events" element={<PrivateRoute element={<Events />} />} />
        <Route path="/event/:id" element={<PrivateRoute element={<EventDetails />} />} />
        <Route path="/survey" element={<PrivateRoute element={<Survey />} />} />
        <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
        <Route path="/redeem" element={<PrivateRoute element={<RedeemPoints />} />} />
        <Route path="/test-notifications" element={<PrivateRoute element={<TestNotifications />} />} />
        {<Route path="/analytics" element={<PrivateRoute element={<Analytics />} />} />}
      </Routes>

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Campus Pulse. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
