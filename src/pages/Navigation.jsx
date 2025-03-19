import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import menuIcon from "../assets/menu.svg"; // Menu icon (3 dots)
import "./Navigation.css"; // Import the CSS file

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useContext(AuthContext); // Get logged-in user

  // Toggle Sidebar Open/Close
  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest(".sidebar") && !event.target.closest(".menu-button")) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isOpen]);

  return (
    <nav className="navigation-container">
      {/* Menu Button (Three Dots) */}
      <button className="menu-button" onClick={toggleMenu}>
        <img src={menuIcon} alt="menu-icon" />
      </button>

      {/* Sidebar Navigation */}
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <ul>
          <li className="first-item"><Link to="/" onClick={toggleMenu}>Home</Link></li>
          {user && <li><Link to="/dashboard" onClick={toggleMenu}>Dashboard</Link></li>}
          {user && <li><Link to="/profile" onClick={toggleMenu}>Profile</Link></li>}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
