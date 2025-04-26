import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { getFirestore, doc, getDoc } from "firebase/firestore"; // Import Firestore
import "./Dashboard.css"; // Import the new dashboard styles

const Dashboard = () => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(""); // Error handling

  const db = getFirestore(); // Firestore instance

  // Redirect to login if user is not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);
  

  // Fetch user stats from Firestore
  useEffect(() => {
    if (user) {
      const fetchUserStats = async () => {
        try {
          const userStatsRef = doc(db, "userStats", user.uid);
          const userStatsSnap = await getDoc(userStatsRef);

          if (userStatsSnap.exists()) {
            setDashboardData(userStatsSnap.data()); // Store data
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

  if (loading) return <p className="loading-text">Loading...</p>; // Loading state
  if (!user) return null; // Prevent rendering if not logged in

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
