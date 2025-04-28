import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { getEventAttendanceStats, getUserEngagementStats, getPointsDistributionStats, getEventCategoryStats, getMonthlyEventStats } from '../../services/analyticsService';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, ArcElement, PointElement, LineElement, BarElement, Tooltip, Legend } from 'chart.js';
import './Analytics.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  ArcElement,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend
);

const Analytics = () => {
  const { user, userRole } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [eventStats, setEventStats] = useState([]);
  const [userStats, setUserStats] = useState([]);
  const [pointsStats, setPointsStats] = useState(null);
  const [categoryStats, setCategoryStats] = useState(null);
  const [monthlyStats, setMonthlyStats] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [eventStatsResult, userStatsResult, pointsStatsResult, categoryStatsResult, monthlyStatsResult] = await Promise.all([
          getEventAttendanceStats(),
          getUserEngagementStats(),
          getPointsDistributionStats(),
          getEventCategoryStats(),
          getMonthlyEventStats()
        ]);

        if (eventStatsResult.success) setEventStats(eventStatsResult.eventStats);
        if (userStatsResult.success) setUserStats(userStatsResult.userStats);
        if (pointsStatsResult.success) setPointsStats(pointsStatsResult.pointsStats);
        if (categoryStatsResult.success) setCategoryStats(categoryStatsResult.categoryStats);
        if (monthlyStatsResult.success) setMonthlyStats(monthlyStatsResult.monthlyStats);

      } catch (err) {
        setError('Failed to load analytics data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (userRole !== 'admin') {
    return <div className="analytics-container"><h2>Access Denied</h2><p>You do not have permission to access this page.</p></div>;
  }

  if (loading) return <div className="loading">Loading analytics...</div>;
  if (error) return <div className="error-message">{error}</div>;

  const prepareEventCategoryChart = () => {
    if (!categoryStats) return null;
    return {
      labels: categoryStats.labels,
      datasets: [{
        data: categoryStats.data,
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
      }]
    };
  };

  const prepareMonthlyEventsChart = () => {
    if (!monthlyStats) return null;
    return {
      labels: monthlyStats.labels,
      datasets: [
        {
          label: 'Events',
          data: monthlyStats.eventCounts,
          borderColor: '#FF6384',
          backgroundColor: 'rgba(255,99,132,0.2)',
          fill: false
        },
        {
          label: 'RSVPs',
          data: monthlyStats.rsvpCounts,
          borderColor: '#36A2EB',
          backgroundColor: 'rgba(54,162,235,0.2)',
          fill: false
        }
      ]
    };
  };

  const preparePointsDistributionChart = () => {
    if (!pointsStats) return null;
    return {
      labels: pointsStats.pointRanges.map(range => range.range),
      datasets: [{
        label: 'Users',
        data: pointsStats.pointRanges.map(range => range.count),
        backgroundColor: '#FF9F40'
      }]
    };
  };

  return (
    <div className="analytics-container">
      <h2>Analytics Dashboard</h2>

      <div className="analytics-tabs">
        <button className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>Overview</button>
        <button className={`tab-button ${activeTab === 'events' ? 'active' : ''}`} onClick={() => setActiveTab('events')}>Events</button>
        <button className={`tab-button ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>Users</button>
        <button className={`tab-button ${activeTab === 'points' ? 'active' : ''}`} onClick={() => setActiveTab('points')}>Points</button>
      </div>

      <div className="analytics-content">

        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="stats-cards">
              <div className="stat-card"><h3>Total Events</h3><div className="stat-value">{eventStats.length}</div></div>
              <div className="stat-card"><h3>Total Users</h3><div className="stat-value">{userStats.length}</div></div>
              <div className="stat-card"><h3>Total RSVPs</h3><div className="stat-value">{eventStats.reduce((sum, e) => sum + e.total, 0)}</div></div>
              <div className="stat-card"><h3>Average Points</h3><div className="stat-value">{pointsStats ? Math.round(pointsStats.averagePoints) : 0}</div></div>
            </div>

            <div className="charts-row">
              <div className="chart-wrapper">
                <h3>Events by Category</h3>
                {categoryStats && <Pie data={prepareEventCategoryChart()} options={{ responsive: true }} />}
              </div>
              <div className="chart-wrapper">
                <h3>Monthly Activity</h3>
                {monthlyStats && <Line data={prepareMonthlyEventsChart()} options={{ responsive: true }} />}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="events-tab">
            <div className="charts-row">
              <div className="chart-wrapper">
                <h3>Events by Category</h3>
                {categoryStats && <Pie data={prepareEventCategoryChart()} />}
              </div>
              <div className="chart-wrapper">
                <h3>Monthly Events</h3>
                {monthlyStats && <Line data={prepareMonthlyEventsChart()} />}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="users-tab">
            <h3>User Engagement</h3>
            <div className="table-container">
              <table className="data-table">
                <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>RSVPs</th><th>Going</th></tr></thead>
                <tbody>
                  {userStats.map(user => (
                    <tr key={user.userId}><td>{user.name}</td><td>{user.email}</td><td>{user.role}</td><td>{user.rsvpCount}</td><td>{user.goingCount}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'points' && pointsStats && (
          <div className="points-tab">
            <div className="charts-row">
              <div className="chart-wrapper">
                <h3>Points Distribution</h3>
                <Bar data={preparePointsDistributionChart()} />
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Analytics;
