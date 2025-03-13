// src/Profile.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { getCurrentUserData, updateUserData, logout } from "./services/authService";
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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const result = await getCurrentUserData(user.uid);
                    if (result.success) {
                        setUserData(result.userData);
                        setSignupMethod(result.userData.signupMethod || "email");
                    } else {
                        setError("Error loading user data");
                    }
                } catch (error) {
                    setError("Error loading user data");
                } finally {
                    setLoading(false);
                }
            } else {
                navigate("/login");
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({
            ...userData,
            [name]: value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        
        try {
            const user = auth.currentUser;
            if (!user) {
                navigate("/login");
                return;
            }
            
            const result = await updateUserData(user.uid, {
                phoneNumber: userData.phoneNumber,
                dob: userData.dob
            });
            
            if (result.success) {
                setIsEditing(false);
            } else {
                setError(result.error);
            }
        } catch (error) {
            setError(error.message);
        }
    };

    const handleLogout = async () => {
        try {
            const result = await logout();
            if (result.success) {
                navigate("/login");
            } else {
                setError(result.error);
            }
        } catch (error) {
            setError(error.message);
        }
    };

    if (loading) {
        return <div className="profile-container">Loading...</div>;
    }

    return (
        <div className="profile-container">
            <h1>Profile</h1>
            
            {error && <p className="error-message">{error}</p>}
            
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
                                disabled={true} // Email cannot be changed
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