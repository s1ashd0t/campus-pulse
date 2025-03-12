import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        
        // Basic validation
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        
        // Here you would typically send this data to your backend
        console.log("Signing up with:", formData);
        
        // Store user data in localStorage (for demo purposes)
        // In a real app, this would be handled by your backend
        const userData = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phoneNumber: formData.phoneNumber,
            dob: formData.dob,
            signupMethod: "email"
        };
        
        localStorage.setItem("userData", JSON.stringify(userData));
        localStorage.setItem("userCredentials", JSON.stringify({
            email: formData.email,
            password: formData.password
        }));
        
        // Redirect to login page after successful signup
        navigate("/login");
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
                    required
                />
                <input
                    type="date"
                    name="dob"
                    placeholder="Date of Birth"
                    value={formData.dob}
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
                <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Sign Up</button>
            </form>

            <div className="line-divider"><h6>or continue with</h6></div>

            <button className="google-login" onClick={() => handleSocialSignup("google")}>Google</button>
            <button className="facebook-login" onClick={() => handleSocialSignup("facebook")}>Facebook</button>
            
            <p className="login-link">
                Already have an account? <a href="/login">Log in</a>
            </p>
        </div>
    );
    
    function handleSocialSignup(provider) {
        // In a real app, this would trigger OAuth authentication
        console.log(`Signing up with ${provider}`);
        
        // For demo: simulate social signup by storing mock data
        const mockUserData = {
            firstName: provider === "google" ? "Google" : "Facebook",
            lastName: "User",
            email: `${provider}.user@example.com`,
            phoneNumber: "",
            dob: "",
            signupMethod: provider
        };
        
        localStorage.setItem("userData", JSON.stringify(mockUserData));
        localStorage.setItem("isLoggedIn", "true");
        
        // Redirect to profile page after social signup
        navigate("/profile");
    }
}

export default SignUp;