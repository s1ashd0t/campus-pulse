import React from "react";
import { Link } from "react-router-dom";
import Landing from "./Landing";

const Landing = () => {
  return (
    <div className="landing">
      {/* Hero Section */}
      <header className="hero">
        <h1>Welcome to Campus Pulse</h1>
        <p>Track your engagement and stay connected at PFW!</p>
        <Link to="/login">
          <button className="cta-button">Get Started</button>
        </Link>
      </header>

      {/* Features Section */}
      <section className="features">
        <div className="feature">
          <h2>Track Your Attendance</h2>
          <p>Check in to events easily with QR codes.</p>
        </div>
        <div className="feature">
          <h2>Engagement Insights</h2>
          <p>Monitor your activity and see your progress.</p>
        </div>
        <div className="feature">
          <h2>Compete for Rewards</h2>
          <p>Earn points and climb the leaderboard.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Campus Pulse. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
