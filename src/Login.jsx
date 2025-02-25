import React, { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Logging in with:", { email, password });
    // Add authentication logic here
  };

  return (
    <div className="login-container">
      <img src="/public/vite.svg" alt="Campus Pulse Logo" className="logo" />
      <h1>Campus Pulse</h1>
      <p>An engagement tracker app for students at PFW</p>

      <form onSubmit={handleSubmit}>
        <label>
          <strong>Log in</strong>
        </label>
        <input
          type="text"
          placeholder="Username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Log in</button>
      </form>

      <p className="forgot-password">Forgot your password?</p>

      <div className="social-login">
        <p>or continue with</p>
        <button className="google-login">🔴 Log in with Google</button>
        <button className="facebook-login">🔵 Log in with Facebook</button>
      </div>
    </div>
  );
};

export default Login;
