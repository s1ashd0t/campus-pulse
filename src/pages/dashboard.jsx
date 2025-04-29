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
    const fetchUserData = async () => {
      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setDashboardData(userSnap.data());
        } else {
          setDashboardData(null);
        }
      } catch (err) {
        setError("Error fetching user data.");
      }
    };

    if (user) fetchUserData();
  }, [user]);

  const getBadgeTier = (points) => {
    if (points >= 501) return "Gold";
    if (points >= 101) return "Silver";
    return "Bronze";
  };

  if (loading) return <p className="loading-text">Loading...</p>;
  if (!user) return null;

  return (
    <div className="dashboard-layout">
      <main className="dashboard-content">
        <h1>Welcome, {user.displayName || "User"}!</h1>

        {error && <p className="error-text">⚠️ {error}</p>}

        {dashboardData ? (
          <>
            <div className="dashboard-stats">
              <p><strong>Events Attended:</strong> {dashboardData.eventsAttended ?? 0}</p>
              <p><strong>Rank:</strong> {dashboardData.rank ?? "Unranked"}</p>
              <p><strong>Badge Tier:</strong> {getBadgeTier(dashboardData.points ?? 0)}</p>
              <p><strong>Total Badges:</strong> {dashboardData.badges?.length ?? 0}</p>
            </div>

            <PointsSummary points={dashboardData.points ?? 0} />
          </>
        ) : (
          <p className="no-stats-text">Sorry, no stats found.</p>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
