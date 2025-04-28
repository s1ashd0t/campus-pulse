import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import PointsSummary from "../pages/PointsSummary";
import "./Dashboard.css";

const Dashboard = () => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState("");

  const db = getFirestore();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      const fetchUserStats = async () => {
        try {
          const userStatsRef = doc(db, "users", user.uid);
          const userStatsSnap = await getDoc(userStatsRef);

          if (userStatsSnap.exists()) {
            setDashboardData(userStatsSnap.data());
          } else {
            setDashboardData({});
          }
        } catch (error) {
          setError("Error fetching stats. Please try again later.");
        }
      };

      fetchUserStats();
    }
  }, [user, db]);

  if (loading) return <p className="loading-text">Loading...</p>;
  if (!user) return null;

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar"></aside>

      <main className="dashboard-content">
        <h1>Welcome, {user.displayName || "User"}!</h1>

        {error && <p className="error-text">⚠️ {error}</p>}

        {/* Show only if dashboardData has loaded */}
        {dashboardData ? (
          <div className="dashboard-stats">
            <p><strong>Events Attended:</strong> {dashboardData.eventsAttended ?? 0}</p>
            <p><strong>Rank:</strong> {dashboardData.rank ?? "Unranked"}</p>

            

            {/* Badges */}
            <div className="badges-section">
              <h2>Badges Earned</h2>
              {Array.isArray(dashboardData.badges) && dashboardData.badges.length > 0 ? (
                <div className="badges-grid">
                  {dashboardData.badges.map((badge, index) => (
                    <div className="badge-card" key={index}>
                      🏅 {badge}
                    </div>
                  ))}
                </div>
              ) : (
                <p>No badges earned yet!</p>
              )}
            </div>
            {/* Points */}
            <PointsSummary points={dashboardData.points ?? 0} />
          </div>
        ) : (
          <p className="no-stats-text">Sorry, no stats found.</p>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
