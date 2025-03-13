// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginWithEmail, loginWithGoogle, loginWithFacebook, resetPassword } from "../services/authService";
import "./Login.css";
import "../App.css";

function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [error, setError] = useState("");
    const [resetEmailSent, setResetEmailSent] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [resetEmail, setResetEmail] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        
        const result = await loginWithEmail(formData.email, formData.password);
        
        if (result.success) {
            navigate("/profile");
        } else {
            setError(result.error);
        }
    };

    const handleSocialLogin = async (provider) => {
        try {
            setError("");
            let result;
            
            if (provider === "google") {
                result = await loginWithGoogle();
            } else if (provider === "facebook") {
                result = await loginWithFacebook();
            }
            
            if (result.success) {
                navigate("/profile");
            } else {
                setError(result.error);
            }
        } catch (error) {
            setError(error.message);
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        
        if (!resetEmail) {
            setError("Please enter your email address");
            return;
        }
        
        try {
            setError("");
            const result = await resetPassword(resetEmail);
            
            if (result.success) {
                setResetEmailSent(true);
            } else {
                setError(result.error);
            }
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="login-container">
            <h1>Campus Pulse</h1>
            <p className="description">An engagement tracker app for students at PFW</p>
            
            {error && <p className="error-message">{error}</p>}
            
            {!showForgotPassword ? (
                <>
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

                    <p className="forgot-password" onClick={() => setShowForgotPassword(true)}>
                        Forgot your password?
                    </p>

                    <div className="line-divider"><h6>or continue with</h6></div>

                    <button 
                        className="google-login" 
                        onClick={() => handleSocialLogin("google")}
                    >
                        Google
                    </button>
                    <button 
                        className="facebook-login" 
                        onClick={() => handleSocialLogin("facebook")}
                    >
                        Facebook
                    </button>
                </>
            ) : (
                <>
                    {resetEmailSent ? (
                        <div className="reset-success">
                            <p>Password reset link sent to your email!</p>
                            <button onClick={() => {
                                setShowForgotPassword(false);
                                setResetEmailSent(false);
                            }}>
                                Back to Login
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleForgotPassword}>
                            <p>Enter your email to receive a password reset link</p>
                            <input
                                type="email"
                                placeholder="Email"
                                value={resetEmail}
                                onChange={(e) => setResetEmail(e.target.value)}
                                required
                            />
                            <button type="submit">Send Reset Link</button>
                            <button 
                                type="button" 
                                className="cancel-button"
                                onClick={() => setShowForgotPassword(false)}
                            >
                                Cancel
                            </button>
                        </form>
                    )}
                </>
            )}

            <p className="signup-link">
                Don't have an account? <a href="/signup">Sign up</a>
            </p>
        </div>
    );
}

export default Login;