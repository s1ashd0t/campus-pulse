// src/SignUp.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUpWithEmail, loginWithGoogle, loginWithFacebook } from "./services/authService";
import "./SignUp.css";
import "./App.css";

function SignUp() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        dob: "",
        password: "",
        confirmPassword: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        // Basic validation
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        
        try {
            setLoading(true);
            setError("");
            
            const userData = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                phoneNumber: formData.phoneNumber,
                dob: formData.dob
            };
            
            const result = await signUpWithEmail(formData.email, formData.password, userData);
            
            if (result.success) {
                navigate("/profile");
            } else {
                setError(result.error);
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSocialSignup = async (provider) => {
        try {
            setLoading(true);
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
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signup-container">
            <h1>Sign Up</h1>
            <p className="description">Join Campus Pulse to track and earn rewards</p>
            
            {error && <p className="error-message">{error}</p>}
            
            <form onSubmit={handleSubmit}>
                <div className="form-row">
                    <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="tel"
                    name="phoneNumber"
                    placeholder="Phone Number"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                />
                <input
                    type="date"
                    name="dob"
                    placeholder="Date of Birth"
                    value={formData.dob}
                    onChange={handleChange}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? "Signing up..." : "Sign Up"}
                </button>
            </form>

            <div className="line-divider"><h6>or continue with</h6></div>

            <button 
                className="google-login" 
                onClick={() => handleSocialSignup("google")}
                disabled={loading}
            >
                Google
            </button>
            <button 
                className="facebook-login" 
                onClick={() => handleSocialSignup("facebook")}
                disabled={loading}
            >
                Facebook
            </button>
            
            <p className="login-link">
                Already have an account? <a href="/login">Log in</a>
            </p>
        </div>
    );
}

export default SignUp;