import React, { useState } from 'react';
import './RedeemPoints.css';
import { useNavigate } from 'react-router-dom';

const RedeemPoints = () => {
    const [userPoints, setUserPoints] = useState(120); // Example starting points
    const [redeemStatus, setRedeemStatus] = useState('');
    const navigate = useNavigate();

    const rewards = [
        { id: 1, title: 'Discount Coupon (10%)', points: 50, image: '/api/placeholder/150/120', description: 'Valid at campus stores' },
        { id: 2, title: 'Free Coffee/Snack', points: 60, image: '/api/placeholder/150/120', description: 'Redeem at campus cafeteria' },
        { id: 3, title: 'Campus Water Bottle', points: 40, image: '/api/placeholder/150/120', description: 'Eco-friendly reusable bottle' },
        { id: 4, title: 'Campus Hoodie', points: 100, image: '/api/placeholder/150/120', description: 'Comfortable university hoodie' },
        { id: 5, title: 'Study Room Booking', points: 30, image: '/api/placeholder/150/120', description: 'Priority booking for 2 hours' },
        { id: 6, title: 'Library Late Fee Waiver', points: 25, image: '/api/placeholder/150/120', description: 'One-time late fee waiver' },
    ];

    const handleRedeem = (reward) => {
        if (userPoints >= reward.points) {
            setUserPoints(prevPoints => prevPoints - reward.points);
            setRedeemStatus(`Successfully redeemed ${reward.title}!`);
            
            setTimeout(() => {
                setRedeemStatus('');
            }, 3000);
        } else {
            setRedeemStatus('Not enough points to redeem this reward.');
            
            setTimeout(() => {
                setRedeemStatus('');
            }, 3000);
        }
    };

    return (
        <div className="redeem-container">
            <div className="redeem-header">
                <h1>Redeem Your Points</h1>
                <div className="points-display">
                    <span className="points-value">{userPoints}</span>
                    <span className="points-label">AVAILABLE POINTS</span>
                </div>
            </div>

            {redeemStatus && (
                <div className="redeem-status">
                    {redeemStatus}
                </div>
            )}

            <div className="rewards-grid">
                {rewards.map(reward => (
                    <div key={reward.id} className="reward-card">
                        <img src={reward.image} alt={reward.title} className="reward-image" />
                        <div className="reward-info">
                            <h3>{reward.title}</h3>
                            <p className="reward-description">{reward.description}</p>
                            <div className="reward-footer">
                                <span className="reward-points">{reward.points} pts</span>
                                <button 
                                    className={`redeem-button ${userPoints < reward.points ? 'disabled' : ''}`}
                                    onClick={() => handleRedeem(reward)}
                                    disabled={userPoints < reward.points}
                                >
                                    Redeem
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RedeemPoints;