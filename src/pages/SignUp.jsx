// src/SignUp.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUpWithEmail, loginWithGoogle, loginWithFacebook } from "../services/authService";
import "../styles/auth.css";

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
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
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
                navigate("/Homepage");
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
        <div className="auth-container">
            <h1>Sign Up</h1>
            <p className="auth-description">Join Campus Pulse to track and earn rewards</p>
            
            {error && <p className="error-message">{error}</p>}
            
            <form className="auth-form" onSubmit={handleSubmit}>
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
                <button 
                    type="submit" 
                    className="submit-button"
                    disabled={loading}
                >
                    {loading ? "Signing up..." : "Sign Up"}
                </button>
            </form>

            <div className="social-divider">or continue with</div>

            <button 
                className="social-button google-login" 
                onClick={() => handleSocialSignup("google")}
                disabled={loading}
            >
                Google
            </button>
            
            <p className="auth-link">
                Already have an account? <a href="/login">Log in</a>
            </p>
        </div>
    );
}

export default SignUp;