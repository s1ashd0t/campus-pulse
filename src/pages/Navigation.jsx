import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase';
import { useAuth } from '../context/AuthContext';
import menu from '../assets/menu.svg';
import close from '../assets/close.svg';
import './Navigation.css';

const Navigation = () => {
    const { user, isAdmin } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => setMenuOpen(!menuOpen);

    const handleLogout = () => {
        auth.signOut();
        setMenuOpen(false);
    };

    return (
        <nav className={`navigation ${menuOpen ? 'open' : ''}`}>
            <img 
                src={menuOpen ? close : menu} 
                className="menu" 
                onClick={toggleMenu} 
                alt="Menu"
            />
            <ul>
                <li><Link to="/" onClick={toggleMenu}>Home</Link></li>
                {user ? (
                    <>
                        <li><Link to="/leaderboard" onClick={toggleMenu}>Leaderboard</Link></li>
                        <li><Link to="/notifications" onClick={toggleMenu}>Notifications</Link></li>
                        <li><Link to="/redeem" onClick={toggleMenu}>Redeem Points</Link></li>
                        <li><Link to="/scanner" onClick={toggleMenu}>Scan QR</Link></li>
                        <li><Link to="/profile" onClick={toggleMenu}>Profile</Link></li>
                        <li><Link to="/dashboard" onClick={toggleMenu}>Dashboard</Link></li>
                        {isAdmin && (
                            <li><Link to="/admin" onClick={toggleMenu}>Admin Panel</Link></li>
                        )}
                        <li>
                            <button onClick={handleLogout} className="logout-btn">
                                Logout
                            </button>
                        </li>
                    </>
                ) : (
                    <>
                        <li><Link to="/login" onClick={toggleMenu}>Login</Link></li>
                        <li><Link to="/signup" onClick={toggleMenu}>Sign Up</Link></li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navigation;
