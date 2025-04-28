// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginWithEmail, loginWithGoogle, loginWithFacebook, resetPassword, getCurrentUserData } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import "../styles/auth.css";

function Login() {
    const navigate = useNavigate();
    const { userRole } = useAuth();
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
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        
        const result = await loginWithEmail(formData.email, formData.password);
        
        if (result.success) {
            // Check user role and redirect accordingly
            const userDoc = await getCurrentUserData(result.user.uid);
            if (userDoc.success && userDoc.userData.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/homepage");
            }
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
                // Check user role and redirect accordingly
                const userDoc = await getCurrentUserData(result.user.uid);
                if (userDoc.success && userDoc.userData.role === "admin") {
                    navigate("/admin");
                } else {
                    navigate("/homepage");
                }
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
        <div className="auth-container">
            <h1>Login</h1>
            <p className="auth-description">Welcome back to Campus Pulse</p>
            
            {error && <p className="error-message">{error}</p>}
            
            {!showForgotPassword ? (
                <>
                    <form className="auth-form" onSubmit={handleSubmit}>
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
                        <button type="submit" className="submit-button">Log in</button>
                    </form>

                    <p className="forgot-password" onClick={() => setShowForgotPassword(true)}>
                        Forgot your password?
                    </p>

                    <div className="social-divider">or continue with</div>

                    <button 
                        className="social-button google-login" 
                        onClick={() => handleSocialLogin("google")}
                    >
                        Google
                    </button>
                </>
            ) : (
                <>
                    {resetEmailSent ? (
                        <div className="success-message">
                            <p>Password reset link sent to your email!</p>
                            <button 
                                className="submit-button"
                                onClick={() => {
                                    setShowForgotPassword(false);
                                    setResetEmailSent(false);
                                }}
                            >
                                Back to Login
                            </button>
                        </div>
                    ) : (
                        <form className="auth-form" onSubmit={handleForgotPassword}>
                            <p>Enter your email to receive a password reset link</p>
                            <input
                                type="email"
                                placeholder="Email"
                                value={resetEmail}
                                onChange={(e) => setResetEmail(e.target.value)}
                                required
                            />
                            <button type="submit" className="submit-button">
                                Send Reset Link
                            </button>
                            <button 
                                type="button" 
                                className="social-button"
                                onClick={() => setShowForgotPassword(false)}
                            >
                                Cancel
                            </button>
                        </form>
                    )}
                </>
            )}

            <p className="auth-link">
                Don't have an account? <a href="/signup">Sign up</a>
            </p>
        </div>
    );
}

export default Login;