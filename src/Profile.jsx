import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
import "./App.css";

function Profile() {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        dob: ""
    });
    const [isEditing, setIsEditing] = useState(false);
    const [signupMethod, setSignupMethod] = useState("email");

    useEffect(() => {
        // Check if user is logged in
        const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
        if (!isLoggedIn) {
            navigate("/login");
            return;
        }

        // Load user data
        try {
            const storedUserData = JSON.parse(localStorage.getItem("userData") || "{}");
            setUserData(storedUserData);
            setSignupMethod(storedUserData.signupMethod || "email");
        } catch (error) {
            console.error("Error loading user data:", error);
        }
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({
            ...userData,
            [name]: value
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        
        // Save updated user data
        localStorage.setItem("userData", JSON.stringify(userData));
        
        // Exit edit mode
        setIsEditing(false);
    };

    const handleLogout = () => {
        localStorage.removeItem("isLoggedIn");
        navigate("/login");
    };

    return (
        <div className="profile-container">
            <h1>Profile</h1>
            
            {!isEditing ? (
                <div className="profile-view">
                    <div className="profile-info">
                        <div className="profile-field">
                            <label>Name:</label>
                            <p>{userData.firstName} {userData.lastName}</p>
                        </div>
                        <div className="profile-field">
                            <label>Email:</label>
                            <p>{userData.email}</p>
                        </div>
                        <div className="profile-field">
                            <label>Phone:</label>
                            <p>{userData.phoneNumber || "Not provided"}</p>
                        </div>
                        <div className="profile-field">
                            <label>Date of Birth:</label>
                            <p>{userData.dob || "Not provided"}</p>
                        </div>
                        <div className="profile-field">
                            <label>Sign Up Method:</label>
                            <p className="signup-method">{signupMethod}</p>
                        </div>
                    </div>
                    
                    <div className="profile-actions">
                        <button 
                            className="edit-button"
                            onClick={() => setIsEditing(true)}
                        >
                            Edit Profile
                        </button>
                        <button 
                            className="logout-button"
                            onClick={handleLogout}
                        >
                            Log Out
                        </button>
                    </div>
                </div>
            ) : (
                <div className="profile-edit">
                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label>First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={userData.firstName}
                                    onChange={handleChange}
                                    disabled={signupMethod !== "email"}
                                />
                            </div>
                            <div className="form-group">
                                <label>Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={userData.lastName}
                                    onChange={handleChange}
                                    disabled={signupMethod !== "email"}
                                />
                            </div>
                        </div>
                        
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={userData.email}
                                onChange={handleChange}
                                disabled={signupMethod !== "email"}
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input
                                type="tel"
                                name="phoneNumber"
                                value={userData.phoneNumber || ""}
                                onChange={handleChange}
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>Date of Birth</label>
                            <input
                                type="date"
                                name="dob"
                                value={userData.dob || ""}
                                onChange={handleChange}
                            />
                        </div>
                        
                        {signupMethod !== "email" && (
                            <p className="social-signup-note">
                                Some fields cannot be edited because you signed up with {signupMethod}.
                            </p>
                        )}
                        
                        <div className="form-actions">
                            <button type="submit" className="save-button">Save Changes</button>
                            <button 
                                type="button" 
                                className="cancel-button"
                                onClick={() => setIsEditing(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

export default Profile;