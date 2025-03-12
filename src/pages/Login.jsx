import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import "../App.css";

function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        
        try {
            // In a real app, you would validate against your backend
            // For this demo, we'll check against localStorage
            const storedCredentials = JSON.parse(localStorage.getItem("userCredentials") || "{}");
            
            if (storedCredentials.email === formData.email && 
                storedCredentials.password === formData.password) {
                // Login successful
                localStorage.setItem("isLoggedIn", "true");
                navigate("/profile");
            } else {
                setError("Invalid email or password");
            }
        } catch (error) {
            setError("Something went wrong. Please try again.");
        }
    };

    const handleSocialLogin = (provider) => {
        // In a real app, this would trigger OAuth authentication
        console.log(`Logging in with ${provider}`);
        
        // Check if user exists with this social provider
        const userData = JSON.parse(localStorage.getItem("userData") || "{}");
        
        if (userData.signupMethod === provider) {
            localStorage.setItem("isLoggedIn", "true");
            navigate("/profile");
        } else {
            // For demo purposes, assume it's a new user and redirect to signup
            navigate("/signup");
        }
    };

    return (
        <div className="login-container">
            <h1>Campus Pulse</h1>
            <p className="description">An engagement tracker app for students at PFW</p>
            
            {error && <p className="error-message">{error}</p>}
            
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Log in</button>
            </form>

            <p className="forgot-password">Forgot your password?</p>

            <div className="line-divider"><h6>or continue with</h6></div>

            <button className="google-login" onClick={() => handleSocialLogin("google")}>Google</button>
            <button className="facebook-login" onClick={() => handleSocialLogin("facebook")}>Facebook</button>

            <p className="signup-link">
                Don't have an account? <a href="/signup">Sign up</a>
            </p>
        </div>
    );
}

export default Login;