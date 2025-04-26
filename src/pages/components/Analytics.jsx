import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { 
  getEventAttendanceStats, 
  getUserEngagementStats, 
  getPointsDistributionStats,
  getEventCategoryStats,
  getMonthlyEventStats
} from '../../services/analyticsService';
import './Analytics.css';

// Mock Chart.js components since we're not actually installing the library
const Chart = ({ type, data, options }) => {
  return (
    <div className="chart-container">
      <div className="chart-placeholder">
        <h4>{type.toUpperCase()} Chart</h4>
        <p>This would display a {type} chart with the provided data.</p>
        <div className="mock-chart">
          {type === 'bar' && (
            <div className="mock-bar-chart">
              {data.labels.map((label, index) => (
                <div key={index} className="mock-bar-container">
                  <div 
                    className="mock-bar" 
                    style={{ 
                      height: `${Math.min(data.datasets[0].data[index] * 5, 150)}px`,
                      backgroundColor: data.datasets[0].backgroundColor || '#ff7b00'
                    }}
                  ></div>
                  <div className="mock-label">{label}</div>
                </div>
              ))}
            </div>
          )}
          
          {type === 'pie' && (
            <div className="mock-pie-chart">
              <div className="mock-pie-segments">
                {data.labels.map((label, index) => (
                  <div key={index} className="mock-pie-legend">
                    <div 
                      className="mock-color-box" 
                      style={{ 
                        backgroundColor: Array.isArray(data.datasets[0].backgroundColor) 
                          ? data.datasets[0].backgroundColor[index] 
                          : '#ff7b00'
                      }}
                    ></div>
                    <span>{label}: {data.datasets[0].data[index]}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {type === 'line' && (
            <div className="mock-line-chart">
              <div className="mock-line-points">
                {data.labels.map((label, index) => (
                  <div key={index} className="mock-point-container">
                    <div className="mock-point"></div>
                    <div className="mock-label">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Analytics = () => {
  const { user, userRole } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Stats state
  const [eventStats, setEventStats] = useState([]);
  const [userStats, setUserStats] = useState([]);
  const [pointsStats, setPointsStats] = useState(null);
  const [categoryStats, setCategoryStats] = useState(null);
  const [monthlyStats, setMonthlyStats] = useState(null);
  
  // Check if user is admin
  if (userRole !== "admin") {
    return (
      <div className="analytics-container">
        <h2>Access Denied</h2>
        <p>You do not have permission to access this page.</p>
      </div>
    );
  }
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      
      try {
        // Fetch all stats in parallel
        const [
          eventStatsResult,
          userStatsResult,
          pointsStatsResult,
          categoryStatsResult,
          monthlyStatsResult
        ] = await Promise.all([
          getEventAttendanceStats(),
          getUserEngagementStats(),
          getPointsDistributionStats(),
          getEventCategoryStats(),
          getMonthlyEventStats()
        ]);
        
        if (eventStatsResult.success) {
          setEventStats(eventStatsResult.eventStats);
        }
        
        if (userStatsResult.success) {
          setUserStats(userStatsResult.userStats);
        }
        
        if (pointsStatsResult.success) {
          setPointsStats(pointsStatsResult.pointsStats);
        }
        
        if (categoryStatsResult.success) {
          setCategoryStats(categoryStatsResult.categoryStats);
        }
        
        if (monthlyStatsResult.success) {
          setMonthlyStats(monthlyStatsResult.monthlyStats);
        }
      } catch (err) {
        setError('Failed to load analytics data');
        console.error('Error fetching analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Prepare chart data
  const prepareEventCategoryChart = () => {
    if (!categoryStats) return null;
    
    const colors = [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', 
      '#FF9F40', '#8AC249', '#EA5545', '#F46A9B', '#EF9B20'
    ];
    
    return {
      labels: categoryStats.labels,
      datasets: [
        {
          data: categoryStats.data,
          backgroundColor: colors.slice(0, categoryStats.labels.length),
          hoverBackgroundColor: colors.slice(0, categoryStats.labels.length)
        }
      ]
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
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          fill: false
        },
        {
          label: 'RSVPs',
          data: monthlyStats.rsvpCounts,
          borderColor: '#36A2EB',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          fill: false
        }
      ]
    };
  };
  
  const preparePointsDistributionChart = () => {
    if (!pointsStats) return null;
    
    return {
      labels: pointsStats.pointRanges.map(range => range.range),
      datasets: [
        {
          label: 'Users',
          data: pointsStats.pointRanges.map(range => range.count),
          backgroundColor: '#FF9F40'
        }
      ]
    };
  };
  
  if (loading) {
    return <div className="loading">Loading analytics data...</div>;
  }
  
  if (error) {
    return <div className="error-message">{error}</div>;
  }
  
  return (
    <div className="analytics-container">
      <h2>Analytics Dashboard</h2>
      
      <div className="analytics-tabs">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab-button ${activeTab === 'events' ? 'active' : ''}`}
          onClick={() => setActiveTab('events')}
        >
          Events
        </button>
        <button 
          className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        <button 
          className={`tab-button ${activeTab === 'points' ? 'active' : ''}`}
          onClick={() => setActiveTab('points')}
        >
          Points
        </button>
      </div>
      
      <div className="analytics-content">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="stats-cards">
              <div className="stat-card">
                <h3>Total Events</h3>
                <div className="stat-value">{eventStats.length}</div>
              </div>
              <div className="stat-card">
                <h3>Total Users</h3>
                <div className="stat-value">{userStats.length}</div>
              </div>
              <div className="stat-card">
                <h3>Total RSVPs</h3>
                <div className="stat-value">
                  {eventStats.reduce((sum, event) => sum + event.total, 0)}
                </div>
              </div>
              <div className="stat-card">
                <h3>Average Points</h3>
                <div className="stat-value">
                  {pointsStats ? Math.round(pointsStats.averagePoints) : 0}
                </div>
              </div>
            </div>
            
            <div className="charts-row">
              <div className="chart-wrapper">
                <h3>Events by Category</h3>
                {categoryStats && (
                  <Chart 
                    type="pie" 
                    data={prepareEventCategoryChart()} 
                    options={{ responsive: true }}
                  />
                )}
              </div>
              
              <div className="chart-wrapper">
                <h3>Monthly Activity</h3>
                {monthlyStats && (
                  <Chart 
                    type="line" 
                    data={prepareMonthlyEventsChart()} 
                    options={{ responsive: true }}
                  />
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Events Tab */}
        {activeTab === 'events' && (
          <div className="events-tab">
            <div className="charts-row">
              <div className="chart-wrapper">
                <h3>Events by Category</h3>
                {categoryStats && (
                  <Chart 
                    type="pie" 
                    data={prepareEventCategoryChart()} 
                    options={{ responsive: true }}
                  />
                )}
              </div>
              
              <div className="chart-wrapper">
                <h3>Monthly Events</h3>
                {monthlyStats && (
                  <Chart 
                    type="line" 
                    data={prepareMonthlyEventsChart()} 
                    options={{ responsive: true }}
                  />
                )}
              </div>
            </div>
            
            <h3>Event Attendance</h3>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Event</th>
                    <th>Date</th>
                    <th>Category</th>
                    <th>Going</th>
                    <th>Maybe</th>
                    <th>Not Going</th>
                    <th>Total RSVPs</th>
                  </tr>
                </thead>
                <tbody>
                  {eventStats.map((event) => (
                    <tr key={event.eventId}>
                      <td>{event.title}</td>
                      <td>{new Date(event.date).toLocaleDateString()}</td>
                      <td>{event.category}</td>
                      <td>{event.going}</td>
                      <td>{event.maybe}</td>
                      <td>{event.notGoing}</td>
                      <td>{event.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="users-tab">
            <div className="stats-cards">
              <div className="stat-card">
                <h3>Total Users</h3>
                <div className="stat-value">{userStats.length}</div>
              </div>
              <div className="stat-card">
                <h3>Admin Users</h3>
                <div className="stat-value">
                  {userStats.filter(user => user.role === 'admin').length}
                </div>
              </div>
              <div className="stat-card">
                <h3>Student Users</h3>
                <div className="stat-value">
                  {userStats.filter(user => user.role === 'student').length}
                </div>
              </div>
              <div className="stat-card">
                <h3>Active Users</h3>
                <div className="stat-value">
                  {userStats.filter(user => user.rsvpCount > 0).length}
                </div>
              </div>
            </div>
            
            <h3>User Engagement</h3>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>RSVPs</th>
                    <th>Going</th>
                  </tr>
                </thead>
                <tbody>
                  {userStats.map((user) => (
                    <tr key={user.userId}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>{user.rsvpCount}</td>
                      <td>{user.goingCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* Points Tab */}
        {activeTab === 'points' && pointsStats && (
          <div className="points-tab">
            <div className="stats-cards">
              <div className="stat-card">
                <h3>Total Points</h3>
                <div className="stat-value">{pointsStats.totalPoints}</div>
              </div>
              <div className="stat-card">
                <h3>Average Points</h3>
                <div className="stat-value">{Math.round(pointsStats.averagePoints)}</div>
              </div>
              <div className="stat-card">
                <h3>Max Points</h3>
                <div className="stat-value">{pointsStats.maxPoints}</div>
              </div>
              <div className="stat-card">
                <h3>Min Points</h3>
                <div className="stat-value">{pointsStats.minPoints}</div>
              </div>
            </div>
            
            <div className="charts-row">
              <div className="chart-wrapper">
                <h3>Points Distribution</h3>
                <Chart 
                  type="bar" 
                  data={preparePointsDistributionChart()} 
                  options={{ responsive: true }}
                />
              </div>
            </div>
            
            <h3>Top Users by Points</h3>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Name</th>
                    <th>Points</th>
                  </tr>
                </thead>
                <tbody>
                  {pointsStats.topUsers.map((user, index) => (
                    <tr key={user.userId}>
                      <td>{index + 1}</td>
                      <td>{user.name}</td>
                      <td>{user.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
