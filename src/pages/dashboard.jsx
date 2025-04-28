import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { useNavigate, Navigate } from "react-router-dom";
import { getFirestore, doc, getDoc } from "firebase/firestore"; 
import "./Dashboard.css"; 
import AdminHomepage from "./AdminHomepage"; 

const Dashboard = () => {
  const { user, userRole, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(""); 

  const db = getFirestore(); // Firestore instance

  //Redirect to login if user is not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);
  
  //if the user is an admin it would render AdminHomepage :p
  if (!loading && user && userRole === "admin") {
    return <AdminHomepage />;
  }
  

  //feting user stats from Firestore
  useEffect(() => {
    if (user) {
      const fetchUserStats = async () => {
        try {
          const userStatsRef = doc(db, "userStats", user.uid);
          const userStatsSnap = await getDoc(userStatsRef);

          if (userStatsSnap.exists()) {
            setDashboardData(userStatsSnap.data());
          } else {
            setDashboardData(null);
          }
        } catch (error) {
          setError("Error fetching stats. Please try again later.");
        }
      };

      fetchUserStats();
    }
  }, [user, db]);

  if (loading) return <p className="loading-text">Loading...</p>; //loading state because why not
  if (!user) return null; 

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
      </aside>

      {/* Main Content */}
      <main className="dashboard-content">
        <h1>Welcome, {user.displayName || "User"}!</h1>

        {/* Error Handling */}
        {error && <p className="error-text">⚠️ {error}</p>}

        {/* User Stats */}
        {dashboardData ? (
          <div className="dashboard-stats">
            <p><strong>Events Attended:</strong> {dashboardData.eventsAttended}</p>
            <p><strong>Points Earned:</strong> {dashboardData.pointsEarned}</p>
            <p><strong>Rank:</strong> {dashboardData.rank}</p>
          </div>
        ) : (
          <p className="no-stats-text">Sorry, no stats found.</p>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
