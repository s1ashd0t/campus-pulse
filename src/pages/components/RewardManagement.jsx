// src/pages/components/RewardManagement.jsx
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import './RewardManagement.css';

const RewardManagement = () => {
  const { user, userRole } = useContext(AuthContext);
  const [rewards, setRewards] = useState([
    { id: 1, title: 'Discount Coupon (10%)', points: 50, image: '/api/placeholder/150/120', description: 'Valid at campus stores' },
    { id: 2, title: 'Free Coffee/Snack', points: 60, image: '/api/placeholder/150/120', description: 'Redeem at campus cafeteria' },
    { id: 3, title: 'Campus Water Bottle', points: 40, image: '/api/placeholder/150/120', description: 'Eco-friendly reusable bottle' },
    { id: 4, title: 'Campus Hoodie', points: 100, image: '/api/placeholder/150/120', description: 'Comfortable university hoodie' },
    { id: 5, title: 'Study Room Booking', points: 30, image: '/api/placeholder/150/120', description: 'Priority booking for 2 hours' },
    { id: 6, title: 'Library Late Fee Waiver', points: 25, image: '/api/placeholder/150/120', description: 'One-time late fee waiver' },
  ]);
  
  const [editingReward, setEditingReward] = useState(null);
  const [newReward, setNewReward] = useState({
    title: '',
    points: 0,
    image: '/api/placeholder/150/120',
    description: ''
  });
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Check if user is admin
  if (userRole !== "admin") {
    return (
      <div className="reward-management-container">
        <h2>Access Denied</h2>
        <p>You do not have permission to access this page.</p>
      </div>
    );
  }

  const handleEditReward = (reward) => {
    setEditingReward(reward);
    setIsAdding(false);
  };

  const handleDeleteReward = (id) => {
    if (window.confirm('Are you sure you want to delete this reward?')) {
      // In a real app, you would call a service to delete from Firestore
      setRewards(rewards.filter(reward => reward.id !== id));
      setSuccess('Reward deleted successfully');
      
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    }
  };

  const handleSaveEdit = () => {
    // In a real app, you would call a service to update in Firestore
    setRewards(rewards.map(reward => 
      reward.id === editingReward.id ? editingReward : reward
    ));
    setEditingReward(null);
    setSuccess('Reward updated successfully');
    
    setTimeout(() => {
      setSuccess('');
    }, 3000);
  };

  const handleAddNew = () => {
    setIsAdding(true);
    setEditingReward(null);
  };

  const handleSaveNew = () => {
    if (!newReward.title || !newReward.points || !newReward.description) {
      setError('Please fill in all required fields');
      return;
    }

    // In a real app, you would call a service to add to Firestore
    const newId = Math.max(...rewards.map(r => r.id)) + 1;
    const rewardToAdd = {
      ...newReward,
      id: newId
    };
    
    setRewards([...rewards, rewardToAdd]);
    setNewReward({
      title: '',
      points: 0,
      image: '/api/placeholder/150/120',
      description: ''
    });
    setIsAdding(false);
    setSuccess('Reward added successfully');
    
    setTimeout(() => {
      setSuccess('');
    }, 3000);
  };

  const handleCancelEdit = () => {
    setEditingReward(null);
    setIsAdding(false);
    setError('');
  };

  return (
    <div className="reward-management-container">
      <h2>Reward Management</h2>
      
      {success && <div className="success-message">{success}</div>}
      {error && <div className="error-message">{error}</div>}
      
      <div className="reward-management-actions">
        <button className="add-reward-button" onClick={handleAddNew}>
          Add New Reward
        </button>
      </div>
      
      {isAdding && (
        <div className="reward-form">
          <h3>Add New Reward</h3>
          <div className="form-group">
            <label>Title*</label>
            <input 
              type="text" 
              value={newReward.title} 
              onChange={(e) => setNewReward({...newReward, title: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Points*</label>
            <input 
              type="number" 
              value={newReward.points} 
              onChange={(e) => setNewReward({...newReward, points: parseInt(e.target.value)})}
              required
            />
          </div>
          <div className="form-group">
            <label>Image URL</label>
            <input 
              type="text" 
              value={newReward.image} 
              onChange={(e) => setNewReward({...newReward, image: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Description*</label>
            <textarea 
              value={newReward.description} 
              onChange={(e) => setNewReward({...newReward, description: e.target.value})}
              required
            />
          </div>
          <div className="form-actions">
            <button className="save-button" onClick={handleSaveNew}>Save</button>
            <button className="cancel-button" onClick={handleCancelEdit}>Cancel</button>
          </div>
        </div>
      )}
      
      {editingReward && (
        <div className="reward-form">
          <h3>Edit Reward</h3>
          <div className="form-group">
            <label>Title*</label>
            <input 
              type="text" 
              value={editingReward.title} 
              onChange={(e) => setEditingReward({...editingReward, title: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Points*</label>
            <input 
              type="number" 
              value={editingReward.points} 
              onChange={(e) => setEditingReward({...editingReward, points: parseInt(e.target.value)})}
              required
            />
          </div>
          <div className="form-group">
            <label>Image URL</label>
            <input 
              type="text" 
              value={editingReward.image} 
              onChange={(e) => setEditingReward({...editingReward, image: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Description*</label>
            <textarea 
              value={editingReward.description} 
              onChange={(e) => setEditingReward({...editingReward, description: e.target.value})}
              required
            />
          </div>
          <div className="form-actions">
            <button className="save-button" onClick={handleSaveEdit}>Save</button>
            <button className="cancel-button" onClick={handleCancelEdit}>Cancel</button>
          </div>
        </div>
      )}
      
      <div className="rewards-list">
        <h3>Available Rewards</h3>
        <table className="rewards-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Points</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rewards.map(reward => (
              <tr key={reward.id}>
                <td>{reward.title}</td>
                <td>{reward.points}</td>
                <td>{reward.description}</td>
                <td className="reward-actions">
                  <button className="edit-button" onClick={() => handleEditReward(reward)}>Edit</button>
                  <button className="delete-button" onClick={() => handleDeleteReward(reward.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RewardManagement;
