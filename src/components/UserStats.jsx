import React, { useEffect, useState } from "react";
import { getUserStats } from "../services/userService";

const UserStats = ({ userId }) => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      const data = await getUserStats(userId);
      setStats(data);
    }
    fetchStats();
  }, [userId]);

  if (!stats) return <p>Loading...</p>;

  return (
    <div className="user-stats">
      <h2>Your Engagement Stats</h2>
      <p><strong>Total Points:</strong> {stats.totalPoints}</p>
      <p><strong>Events Attended:</strong> {stats.eventsAttended.length}</p>
      <h3>Past Events</h3>
      <ul>
        {stats.eventsAttended.map((eventId) => (
          <li key={eventId}>Event ID: {eventId}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserStats;
