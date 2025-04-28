import React, { useState, useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import EventManagement from './components/EventManagement';
import Analytics from './components/Analytics';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user, userRole, loading } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('events');
  
  //redirecting if the user is not an admin
  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  
  if (!user || userRole !== 'admin') {
    return <Navigate to="/homepage" />;
  }
  
  return (
    <div className="admin-dashboard-container">
      <h1>Admin Dashboard</h1>
      
      <div className="admin-tabs">
        <button 
          className={`tab-button ${activeTab === 'events' ? 'active' : ''}`}
          onClick={() => setActiveTab('events')}
        >
          Event Management
        </button>
        <button 
          className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          User Management
        </button>
        <button 
          className={`tab-button ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
      </div>
      
      <div className="tab-content">
        {activeTab === 'events' && (
          <EventManagement />
        )}
        
        {activeTab === 'users' && (
          <div className="placeholder-content">
            <h2>User Management</h2>
            <p>This feature will be implemented in a future update.</p>
            <p>Here you will be able to:</p>
            <ul>
              <li>View all users</li>
              <li>Edit user roles</li>
              <li>Manage user accounts</li>
              <li>Send notifications to specific users</li>
            </ul>
          </div>
        )}
        
        {activeTab === 'analytics' && (
          <Analytics />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
