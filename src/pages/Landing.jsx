import React from "react";
import { Link } from "react-router-dom";
import "./Landing.css";
import logo from "../assets/icon.png";

const Landing = () => {
  return (
    <div className="landing">
      <img src={logo} className="logo" alt="logo" />
      {/* Hero Section */}
      <header className="hero">
        <div className="hero-background"></div>
        <div className="hero-content">
          <h1>Turn Every Event Into Rewards—Join, Track, Win!</h1>
          <p>Engage in campus activities, earn points, and unlock exclusive rewards.</p>
          <Link to="/login">
            <button className="cta-button">Join Now</button>
          </Link>
        </div>
      </header>

      {/* Features Section */}
      <section className="features">
        <div className="feature">
          <h2>🎟 Easy Event Check-ins</h2>
          <p>Scan QR codes or use GPS to check in instantly.</p>
        </div>
        <div className="feature">
          <h2>📊 Engagement Dashboard</h2>
          <p>Track your event participation and leaderboard ranking.</p>
        </div>
        <div className="feature">
          <h2>🏆 Earn & Redeem Rewards</h2>
          <p>Gain points for attending events and exchange them for prizes!</p>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="cta-section">
        <h2>Don’t Miss Out on the Rewards. Start Earning Today!</h2>
        <Link to="/signup">
          <button className="cta-button">Sign Up & Start Winning</button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Campus Pulse. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;