import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import menu from '../assets/menu.svg';
import close from '../assets/close.svg';
import '../App.css';

const Navigation = () => {
    const [user] = useAuthState(auth);
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => setMenuOpen(!menuOpen);

    const handleLogout = () => {
        auth.signOut();
        setMenuOpen(false); // Close menu on logout
    };

    return (
        <div className="navigation">
            <img 
                src={menuOpen ? close : menu} 
                className="menu" 
                onClick={toggleMenu} 
                alt="Menu"
            />
            <ul style={{ display: menuOpen ? 'block' : 'none' }}>
                <li><Link to="/" onClick={toggleMenu}>Home</Link></li>
                {user && <li><Link to="/leaderboard" onClick={toggleMenu}>Leaderboard</Link></li>}
                {user && <li><Link to="/notifications" onClick={toggleMenu}>Notifications</Link></li>}
                {user ? (
                    <>
                        <li><Link to="/profile" onClick={toggleMenu}>Profile</Link></li>
                        <li><button onClick={handleLogout} className="logout-btn">Logout</button></li>
                    </>
                ) : (
                    <>
                        <li><Link to="/login" onClick={toggleMenu}>Login</Link></li>
                        <li><Link to="/signup" onClick={toggleMenu}>Sign Up</Link></li>
                    </>
                )}
            </ul>
        </div>
    );
};

export default Navigation;
import React from 'react'

const Navigation = () => {
    return(
        <div className="navigation">
            
            <ul>
                <li>Home</li>
                <li>Sign Up</li>
                <li>Login</li>
            </ul>
        </div>
    )
}

export default Navigation
