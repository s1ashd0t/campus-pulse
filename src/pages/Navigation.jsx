import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { useAuth } from '../context/AuthContext';
import menu from '../assets/menu.svg';
import close from '../assets/close.svg';
import './Navigation.css';

const Navigation = ({ isOpen, onClose }) => {
    const { user, isAdmin } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        auth.signOut();
        onClose();
        navigate("/login");
    };

    return (
        <div>
            <img 
                src={isOpen ? close : menu} 
                className="menu-icon" 
                onClick={onClose} 
                alt={isOpen ? "Close menu" : "Open menu"}
            />
        <nav className={`navigation ${isOpen ? 'open' : ''}`}>

            <ul>
                <li><Link to="/homepage" onClick={onClose}>Home</Link></li>
                {user ? (
                    <>
                        <li><Link to="/leaderboard" onClick={onClose}>Leaderboard</Link></li>
                        <li><Link to="/notifications" onClick={onClose}>Notifications</Link></li>
                        <li><Link to="/redeem" onClick={onClose}>Redeem Points</Link></li>
                        <li><Link to="/profile" onClick={onClose}>Profile</Link></li>
                        {isAdmin && (
                            <li><Link to="/admin" onClick={onClose}>Admin Panel</Link></li>
                        )}
                        {isAdmin && (
                            <li><Link to="/analytics" onClick={onClose}>Admin Analytics</Link></li>
                        )}
                        <li>
                            <button onClick={handleLogout} className="logout-btn">
                                Logout
                            </button>
                        </li>
                    </>
                ) : (
                    <>
                        <li><Link to="/login" onClick={onClose}>Login</Link></li>
                        <li><Link to="/signup" onClick={onClose}>Sign Up</Link></li>
                    </>
                )}
            </ul>
        </nav>
        </div>
    );
};

export default Navigation;
