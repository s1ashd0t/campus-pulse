import React, { useEffect, useState, useContext } from 'react';
import './RedeemPoints.css';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getCurrentUserData, updateUserData } from '../services/authService';

const RedeemPoints = () => {
    const { user } = useContext(AuthContext);
    const [userPoints, setUserPoints] = useState(null);
    const [redeemStatus, setRedeemStatus] = useState('');
    const navigate = useNavigate();

    const rewards = [
        { id: 1, title: 'Discount Coupon (10%)', points: 50, image: '/10d.png', description: 'Valid at campus stores' },
        { id: 2, title: 'Free Coffee/Snack', points: 60, image: '/fcd.png', description: 'Redeem at campus cafeteria' },
        { id: 3, title: 'Campus Water Bottle', points: 40, image: '/campwb.png', description: 'Eco-friendly reusable bottle' },
        { id: 4, title: 'Campus Hoodie', points: 100, image: '/hoodie.png', description: 'Comfortable university hoodie' },
        { id: 5, title: 'Study Room Booking', points: 30, image: '/stbook.png', description: 'Priority booking for 2 hours' },
        { id: 6, title: 'Library Late Fee Waiver', points: 25, image: '/llfw.png', description: 'One-time late fee waiver' },
    ];

    const fetchPoints = async () => {
        if (user) {
            const res = await getCurrentUserData(user.uid);
            if (res.success) {
                setUserPoints(res.userData.points ?? 0);
            } else {
                console.error("Error fetching user points:", res.error);
            }
        }
    };

    useEffect(() => {
        fetchPoints();
    }, [user]);

    const handleRedeem = async (reward) => {
        if (userPoints >= reward.points) {
            const newPoints = userPoints - reward.points;
            try {
                const updateRes = await updateUserData(user.uid, { points: newPoints });
                if (updateRes.success) {
                    setRedeemStatus(`Successfully redeemed ${reward.title}!`);
                    setUserPoints(newPoints);
                } else {
                    throw new Error(updateRes.error);
                }
            } catch (error) {
                console.error("Error updating points:", error);
                setRedeemStatus("Error redeeming reward. Try again.");
            }
            setTimeout(() => setRedeemStatus(''), 3000);
        } else {
            setRedeemStatus('Not enough points to redeem this reward.');
            setTimeout(() => setRedeemStatus(''), 3000);
        }
    };

    if (userPoints === null) {
        return <p className="loading-text">Loading your points...</p>;
    }

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
