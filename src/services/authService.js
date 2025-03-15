// src/services/authService.js
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    updateProfile,
    sendPasswordResetEmail,
    GoogleAuthProvider,
    FacebookAuthProvider,
    signInWithPopup
  } from "firebase/auth";
  import { setDoc, doc, getDoc, updateDoc } from "firebase/firestore";
  import { auth, db } from "../firebase";
  
  // Email/Password signup
  export const signUpWithEmail = async (email, password, userData) => {
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update user profile with name
      await updateProfile(user, {
        displayName: `${userData.firstName} ${userData.lastName}`
      });
  
      // Store additional user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: email,
        phoneNumber: userData.phoneNumber || "",
        dob: userData.dob || "",
        signupMethod: "email",
        createdAt: new Date()
      });
  
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
  
  // Email/Password login
  export const loginWithEmail = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
  
  // Google login
  export const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Check if user exists in Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      
      if (!userDoc.exists()) {
        // First time Google sign-in, create a user document
        const names = user.displayName ? user.displayName.split(" ") : ["Google", "User"];
        const firstName = names[0];
        const lastName = names.length > 1 ? names.slice(1).join(" ") : "";
        
        await setDoc(doc(db, "users", user.uid), {
          firstName,
          lastName,
          email: user.email,
          phoneNumber: user.phoneNumber || "",
          dob: "",
          signupMethod: "google",
          createdAt: new Date()
        });
      }
      
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
  
  // Facebook login
  export const loginWithFacebook = async () => {
    try {
      const provider = new FacebookAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Check if user exists in Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      
      if (!userDoc.exists()) {
        // First time Facebook sign-in, create a user document
        const names = user.displayName ? user.displayName.split(" ") : ["Facebook", "User"];
        const firstName = names[0];
        const lastName = names.length > 1 ? names.slice(1).join(" ") : "";
        
        await setDoc(doc(db, "users", user.uid), {
          firstName,
          lastName,
          email: user.email,
          phoneNumber: user.phoneNumber || "",
          dob: "",
          signupMethod: "facebook",
          createdAt: new Date()
        });
      }
      
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
  
  // Logout
  export const logout = async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
  
  // Get current user data from Firestore
  export const getCurrentUserData = async (userId) => {
    try {
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { success: true, userData: docSnap.data() };
      } else {
        return { success: false, error: "User data not found" };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
  
  // Update user data in Firestore
  export const updateUserData = async (userId, userData) => {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, userData);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
  
  // Forgot password
  export const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };