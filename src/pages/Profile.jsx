// src/Profile.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, storage } from "../firebase";
import { getCurrentUserData, updateUserData, logout } from "../services/authService";
import "./Profile.css";

function Profile() {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [userData, setUserData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        dob: "",
        avatar: ""
    });
    const [isEditing, setIsEditing] = useState(false);
    const [signupMethod, setSignupMethod] = useState("email");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [uploadingImage, setUploadingImage] = useState(false);

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
            
            // Include all editable fields, including name fields if not using social signup
            const updatedData = {
                phoneNumber: userData.phoneNumber,
                dob: userData.dob
            };
            
            // Include name fields only if using email signup method
            if (signupMethod === "email") {
                updatedData.firstName = userData.firstName;
                updatedData.lastName = userData.lastName;
            }
            
            const result = await updateUserData(user.uid, updatedData);
            
            if (result.success) {
                // Update userData state with the latest data
                setUserData(prevData => ({
                    ...prevData,
                    ...updatedData
                }));
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

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            setError("Image size should be less than 5MB");
            return;
        }

        try {
            setUploadingImage(true);
            setError("");
            const user = auth.currentUser;
            
            if (!user) {
                navigate("/login");
                return;
            }

            const storageRef = ref(storage, `profilePictures/${user.uid}_${Date.now()}`);
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);
            
            const updatedData = {
                avatar: downloadURL
            };
            
            const result = await updateUserData(user.uid, updatedData);

            if (result.success) {
                setUserData(prev => ({
                    ...prev,
                    ...updatedData
                }));
            } else {
                setError(result.error);
            }
        } catch (error) {
            setError("Error uploading image: " + error.message);
        } finally {
            setUploadingImage(false);
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
                    <div className="profile-picture-container">
                        <div className="profile-picture">
                            <img 
                                src={userData.avatar || "https://api.dicebear.com/7.x/avataaars/svg"} 
                                alt="Profile" 
                            />
                        </div>
                    </div>
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
                        <div className="profile-picture-container">
                            <div className="profile-picture">
                                <img 
                                    src={userData.avatar || "https://api.dicebear.com/7.x/avataaars/svg"} 
                                    alt="Profile" 
                                />
                                <button 
                                    type="button"
                                    className="change-picture-button"
                                    onClick={() => fileInputRef.current.click()}
                                    disabled={uploadingImage}
                                >
                                    {uploadingImage ? "Uploading..." : "Change Picture"}
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    style={{ display: 'none' }}
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={userData.firstName}
                                    onChange={handleChange}
                                    disabled={signupMethod !== "email"}
                                    required={signupMethod === "email"}
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
                                    required={signupMethod === "email"}
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
                                max={new Date().toISOString().split('T')[0]} // Prevents future dates
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