import React from 'react';
import { Link } from 'react-router-dom';
import './Unauthorized.css';

const Unauthorized = () => {
  return (
    <div className="unauthorized-container">
      <h1>🚫 Access Denied</h1>
      <p>Sorry, you don't have permission to access this page.</p>
      <p>This area is restricted to administrators only.</p>
      <Link to="/" className="back-home">
        Return to Homepage
      </Link>
    </div>
  );
};

export default Unauthorized;